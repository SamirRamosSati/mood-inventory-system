import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Delivery, CreateDeliveryData, ApiResponse } from "@/types";

const adminClient = createAdminClient();

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    let query = adminClient
      .from("deliveries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(
        `customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`
      );
    }

    const offset = page * pageSize;
    query = query.range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching deliveries:", error);
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Delivery[]>>(
      {
        success: true,
        data: data as Delivery[],
        message: `Found ${count || 0} deliveries`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/deliveries:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: CreateDeliveryData = await request.json();

    if (!body.customer_name || !body.customer_phone || !body.delivery_address) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: delivery, error: deliveryError } = await adminClient
      .from("deliveries")
      .insert({
        userId: user.id,
        created_by_name: user.user_metadata?.name || "Unknown User",
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        delivery_address: body.delivery_address,
        scheduled_date: body.scheduled_date || null,
        items: body.items || [],
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (deliveryError || !delivery) {
      console.error("Error creating delivery:", deliveryError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Failed to create delivery" },
        { status: 500 }
      );
    }

    const { data: warehouseWorkers, error: fetchError } = await adminClient
      .from("StaffProfile")
      .select("user_id")
      .eq("function", "Warehouse Worker");

    console.log(
      "Warehouse workers found:",
      warehouseWorkers,
      "Error:",
      fetchError
    );

    if (!fetchError && warehouseWorkers && warehouseWorkers.length > 0) {
      const notifications = warehouseWorkers.map((worker) => ({
        user_id: worker.user_id,
        type: "delivery_created",
        delivery_id: delivery.id,
        title: "New Delivery Created",
        message: `${body.customer_name} - ${body.delivery_address}`,
        read_at: null,
        created_at: new Date().toISOString(),
      }));

      const insertResult = await adminClient
        .from("notifications")
        .insert(notifications);
      console.log(
        "Notifications inserted:",
        insertResult.data,
        "Error:",
        insertResult.error
      );
    }

    return NextResponse.json<ApiResponse<Delivery>>(
      {
        success: true,
        data: delivery,
        message: "Delivery created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/deliveries:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
