import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Notification, ApiResponse } from "@/types";

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

    // Update notification as read
    const { data: updatedNotification, error: updateError } = await adminClient
      .from("notifications")
      .update({
        read_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError || !updatedNotification) {
      console.error("Error updating notification:", updateError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Failed to update notification" },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Notification>>(
      {
        success: true,
        data: updatedNotification,
        message: "Notification marked as read",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/notifications/[id]:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // Delete notification
    const { error: deleteError } = await adminClient
      .from("notifications")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting notification:", deleteError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Failed to delete notification" },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Notification deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/notifications/[id]:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
