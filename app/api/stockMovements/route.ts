import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/auth/validadeRequest";

type MovementType = "ARRIVAL" | "DELIVERY" | "PICKUP";

interface MovementBody {
  id?: string;
  productId: string;
  type: MovementType;
  quantity: number;
  notes?: string;

  arrivalDate?: string;

  deliveryDate?: string;
  deliveryCompany?: string;
  order?: string;

  pickupBy?: string;
  pickupDate?: string;
  sku?: string;

  vendor?: string;
  customerName?: string;
  location?: string;
}

async function validateMovement(body: MovementBody) {
  const { type, quantity, productId } = body;

  if (!productId || !type || !quantity || quantity <= 0) {
    return "Invalid movement data";
  }

  if (type === "ARRIVAL" && !body.arrivalDate) {
    return "arrivalDate is required for ARRIVAL";
  }

  if (
    type === "DELIVERY" &&
    (!body.deliveryDate || !body.deliveryCompany || !body.order)
  ) {
    return "deliveryDate, deliveryCompany and order are required for DELIVERY";
  }

  if (
    type === "PICKUP" &&
    (!body.pickupBy || !body.pickupDate || !body.order || !body.sku)
  ) {
    return "pickupBy, pickupDate, order and sku are required for PICKUP";
  }

  return null;
}

async function updateProductStock(
  admin: ReturnType<typeof createAdminClient>,
  productId: string,
  adjustment: number
) {
  const { data: product, error: prodErr } = await admin
    .from("products")
    .select("id, stock")
    .eq("id", productId)
    .single();

  if (prodErr || !product) throw new Error("Product not found");

  const newStock = product.stock + adjustment;

  if (newStock < 0) throw new Error("Not enough stock");

  const { error: updateErr } = await admin
    .from("products")
    .update({ stock: newStock })
    .eq("id", productId);

  if (updateErr) throw updateErr;

  return newStock;
}

export async function GET(request: NextRequest) {
  try {
    const { response } = await requireUser();
    if (response) return response;

    const admin = createAdminClient();
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");

    let query = admin
      .from("movements")
      .select("*")
      .order("createdAt", { ascending: false });
    if (productId) query = query.eq("productId", productId);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("GET stock movements error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const body: MovementBody = await request.json();
    const validationError = await validateMovement(body);
    if (validationError)
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );

    const admin = createAdminClient();

    let adjustment = 0;
    if (body.type === "ARRIVAL") adjustment = body.quantity;
    if (body.type === "DELIVERY" || body.type === "PICKUP")
      adjustment = -body.quantity;

    // Atualizar o estoque do produto
    await updateProductStock(admin, body.productId, adjustment);

    // Inserir movimento de estoque
    const { data: movement, error: movErr } = await admin
      .from("movements")
      .insert({ ...body, userId: user.id })
      .select()
      .single();
    if (movErr) throw movErr;

    // Obter o nome do produto
    const { data: product } = await admin
      .from("products")
      .select("name")
      .eq("id", body.productId)
      .single();

    // Obter o nome do usuário
    const { data: userData } = await admin
      .from("users")
      .select("name")
      .eq("id", user.id)
      .single();

    // Retornar o movimento com o nome do produto e do usuário
    return NextResponse.json(
      {
        success: true,
        data: {
          ...movement,
          productName: product?.name || "",
          userName: userData?.name || "",
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST stock movement error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const body: MovementBody = await request.json();
    const { id, ...fields } = body;

    if (!id)
      return NextResponse.json(
        { success: false, error: "Movement ID is required" },
        { status: 400 }
      );

    const validationError = await validateMovement(fields);
    if (validationError)
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );

    const admin = createAdminClient();

    const { data: existing, error: existErr } = await admin
      .from("movements")
      .select("*")
      .eq("id", id)
      .single();
    if (existErr || !existing)
      return NextResponse.json(
        { success: false, error: "Movement not found" },
        { status: 404 }
      );

    let revertAdjustment = 0;
    if (existing.type === "ARRIVAL") revertAdjustment = -existing.quantity;
    if (existing.type === "DELIVERY" || existing.type === "PICKUP")
      revertAdjustment = existing.quantity;

    await updateProductStock(admin, existing.productId, revertAdjustment);

    let newAdjustment = 0;
    if (fields.type === "ARRIVAL") newAdjustment = fields.quantity;
    if (fields.type === "DELIVERY" || fields.type === "PICKUP")
      newAdjustment = -fields.quantity;

    await updateProductStock(admin, existing.productId, newAdjustment);

    const { data: updated, error: updErr } = await admin
      .from("movements")
      .update(fields)
      .eq("id", id)
      .select()
      .single();
    if (updErr) throw updErr;

    const { data: product } = await admin
      .from("products")
      .select("name")
      .eq("id", updated.productId)
      .single();

    const { data: userData } = await admin
      .from("users")
      .select("name")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        productName: product?.name || "",
        userName: userData?.name || "",
      },
    });
  } catch (err: any) {
    console.error("PUT stock movement error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { response } = await requireUser();
    if (response) return response;

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { success: false, error: "Movement ID is required" },
        { status: 400 }
      );

    const admin = createAdminClient();

    const { data: existing, error: existErr } = await admin
      .from("movements")
      .select("*")
      .eq("id", id)
      .single();
    if (existErr || !existing)
      return NextResponse.json(
        { success: false, error: "Movement not found" },
        { status: 404 }
      );

    // Reverter estoque
    let adjustment = 0;
    if (existing.type === "ARRIVAL") adjustment = -existing.quantity;
    if (existing.type === "DELIVERY" || existing.type === "PICKUP")
      adjustment = existing.quantity;

    await updateProductStock(admin, existing.productId, adjustment);

    const { error: delErr } = await admin
      .from("movements")
      .delete()
      .eq("id", id);
    if (delErr) throw delErr;

    return NextResponse.json({ success: true, message: "Movement deleted" });
  } catch (err: any) {
    console.error("DELETE stock movement error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
