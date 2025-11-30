import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/auth/validadeRequest";

export async function GET() {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const adminClient = createAdminClient();

    const { data: product, error } = await adminClient
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching the products", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const body = await request.json();
    const { name, sku, category, brand } = body;

    if (!name || !sku) {
      return NextResponse.json(
        { success: false, error: "Name and SKU are required" },
        { status: 400 }
      );
    }
    const adminClient = createAdminClient();

    const existing = await adminClient
      .from("products")
      .select("id")
      .eq("sku", sku)
      .maybeSingle();

    if (existing.data) {
      return NextResponse.json(
        { success: false, error: "SKU already exists" },
        { status: 409 }
      );
    }

    const { data: product, error } = await adminClient
      .from("products")
      .insert({
        name,
        sku,
        category: category || null,
        brand,
        stock: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const body = await request.json();
    const { id, name, sku, category, brand } = body;

    if (!id || !name || !sku) {
      return NextResponse.json(
        { success: false, error: "ID, name and SKU are required" },
        { status: 400 }
      );
    }
    const adminClient = createAdminClient();

    const { data: updated, error } = await adminClient
      .from("products")
      .update({
        name,
        sku,
        category: category || null,
        brand,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
