import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/auth/validadeRequest";

export async function PUT(req: NextRequest) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const { name, email, avatarColor } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    if (email !== user.email) {
      const { data: existingUser } = await adminClient
        .from("users")
        .select("id")
        .eq("email", email)
        .neq("id", user.id)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "Email already in use" },
          { status: 409 }
        );
      }

      const { error: authError } = await adminClient.auth.admin.updateUserById(
        user.id,
        { email }
      );

      if (authError) {
        console.error("Error updating auth email:", authError);
        return NextResponse.json(
          { success: false, error: "Failed to update email" },
          { status: 500 }
        );
      }
    }

    const { error: updateError } = await adminClient
      .from("users")
      .update({
        name,
        email,
        avatar_color: avatarColor,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating user:", updateError);
      return NextResponse.json(
        { success: false, error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Account API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
