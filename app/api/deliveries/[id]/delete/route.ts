import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ApiResponse } from "@/types";

const adminClient = createAdminClient();

export async function DELETE(
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
          error: "You don't have permission to delete this delivery",
        },
        { status: 403 }
      );
    }

    // Delete the delivery
    const { error: deleteError } = await adminClient
      .from("deliveries")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting delivery:", deleteError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Failed to delete delivery" },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Delivery deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/deliveries/[id]:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
