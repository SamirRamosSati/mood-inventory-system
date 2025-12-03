import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: "Missing token or password" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const { data: invite, error: findError } = await adminClient
      .from("pending_invites")
      .select("*")
      .eq("invite_token", token)
      .single();

    if (findError || !invite) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 404 }
      );
    }

    if (new Date(invite.invite_expiry).getTime() <= Date.now()) {
      return NextResponse.json(
        { success: false, error: "Invite link has expired" },
        { status: 410 }
      );
    }

    const { data: authData, error: authError } =
      await adminClient.auth.admin.createUser({
        email: invite.email,
        password: password,
        email_confirm: true,
        user_metadata: {
          name: invite.name,
          role: invite.role,
          function: invite.function,
        },
      });

    if (authError || !authData.user) {
      console.error("Error creating auth user:", authError);
      return NextResponse.json(
        { success: false, error: "Failed to create account" },
        { status: 500 }
      );
    }

    const authId = authData.user.id;

    const { error: usersError } = await adminClient.from("users").insert({
      id: authId,
      email: invite.email,
      name: invite.name,
      role: invite.role,
      created_at: new Date().toISOString(),
      status: "active",
    });

    if (usersError) {
      console.error("Error inserting user:", usersError);
      await adminClient.auth.admin.deleteUser(authId);
      return NextResponse.json(
        { success: false, error: "Failed to create user record" },
        { status: 500 }
      );
    }

    const { error: profileError } = await adminClient
      .from("StaffProfile")
      .insert({
        user_id: authId,
        function: invite.function,
        phone: invite.phone || null,
        created_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error("Error creating staff profile:", profileError);
      await adminClient.from("users").delete().eq("id", authId);
      await adminClient.auth.admin.deleteUser(authId);
      return NextResponse.json(
        { success: false, error: "Failed to create staff profile" },
        { status: 500 }
      );
    }

    await adminClient
      .from("pending_invites")
      .delete()
      .eq("email", invite.email);

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Complete invite API error:", error);
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
