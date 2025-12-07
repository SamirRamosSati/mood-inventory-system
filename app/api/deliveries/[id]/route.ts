import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Delivery, UpdateDeliveryData, ApiResponse } from "@/types";

const adminClient = createAdminClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const body: UpdateDeliveryData = await request.json();
    const { id } = await params;

    // Verify the delivery exists and belongs to the user
    const { data: delivery, error: fetchError } = await adminClient
      .from("deliveries")
      .select("userId")
      .eq("id", id)
      .single();

    if (fetchError || !delivery) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Delivery not found" },
        { status: 404 }
      );
    }

    // Check if user owns this delivery
    if (delivery.userId !== user.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "You don't have permission to update this delivery",
        },
        { status: 403 }
      );
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.customer_name !== undefined) {
      updateData.customer_name = body.customer_name;
    }
    if (body.customer_phone !== undefined) {
      updateData.customer_phone = body.customer_phone;
    }
    if (body.delivery_address !== undefined) {
      updateData.delivery_address = body.delivery_address;
    }
    if (body.scheduled_date !== undefined) {
      updateData.scheduled_date = body.scheduled_date;
    }
    if (body.items !== undefined) {
      updateData.items = body.items;
    }

    // Update delivery
    const { data: updatedDelivery, error: updateError } = await adminClient
      .from("deliveries")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError || !updatedDelivery) {
      console.error("Error updating delivery:", updateError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Failed to update delivery" },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Delivery>>(
      {
        success: true,
        data: updatedDelivery as Delivery,
        message: "Delivery updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/deliveries/[id]:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
