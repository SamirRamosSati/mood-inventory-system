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

    // Update delivery status to paid
    const { data: updatedDelivery, error: updateError } = await adminClient
      .from("deliveries")
      .update({
        status: "paid",
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

    // Get all users and create notifications
    const { data: allUsers, error: fetchUsersError } = await adminClient
      .from("StaffProfile")
      .select("user_id");

    console.log("All staff found:", allUsers, "Error:", fetchUsersError);

    if (!fetchUsersError && allUsers && allUsers.length > 0) {
      const notifications = allUsers.map((user: any) => ({
        user_id: user.user_id,
        type: "delivery_paid",
        delivery_id: id,
        title: "Payment Confirmed",
        message: `${delivery.customer_name} - Payment confirmed`,
        read_at: null,
        created_at: new Date().toISOString(),
      }));

      const { error: notifError } = await adminClient
        .from("notifications")
        .insert(notifications);
      console.log("Notifications inserted:", notifError);
    }

    return NextResponse.json<ApiResponse<Delivery>>(
      {
        success: true,
        data: updatedDelivery,
        message: "Delivery marked as paid successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/deliveries/[id]/mark-paid:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
