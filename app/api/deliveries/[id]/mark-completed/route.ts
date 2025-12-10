import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Delivery, ApiResponse } from "@/types";

const adminClient = createAdminClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Get the delivery first
    const { data: delivery, error: fetchError } = await adminClient
      .from("deliveries")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !delivery) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Delivery not found" },
        { status: 404 }
      );
    }

    // Update delivery status to completed
    const { data: updatedDelivery, error: updateError } = await adminClient
      .from("deliveries")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
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

    // Get all Managers and create notifications
    const { data: managers, error: fetchManagersError } = await adminClient
      .from("StaffProfile")
      .select("user_id")
      .eq("function", "Manager");

    console.log("Managers found:", managers, "Error:", fetchManagersError);

    if (!fetchManagersError && managers && managers.length > 0) {
      const notifications = managers.map((manager) => ({
        user_id: manager.user_id,
        type: "delivery_completed",
        delivery_id: id,
        title: "Delivery Completed",
        message: `${delivery.customer_name} - Delivery completed`,
        read_at: null,
        created_at: new Date().toISOString(),
      }));

      await adminClient.from("notifications").insert(notifications);
    }

    return NextResponse.json<ApiResponse<Delivery>>(
      {
        success: true,
        data: updatedDelivery,
        message: "Delivery marked as completed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/deliveries/[id]/mark-completed:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
