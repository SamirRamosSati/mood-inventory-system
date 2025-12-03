import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Missing token" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const { data: invite, error } = await adminClient
      .from("pending_invites")
      .select("email, name, invite_expiry")
      .eq("invite_token", token)
      .single();

    if (error || !invite) {
      return NextResponse.json(
        { valid: false, error: "Invalid token" },
        { status: 404 }
      );
    }

    // Check if expired
    const expired = new Date(invite.invite_expiry).getTime() <= Date.now();
    if (expired) {
      return NextResponse.json(
        { valid: false, error: "Invite link has expired" },
        { status: 410 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: invite.email,
      name: invite.name,
    });
  } catch (error) {
    console.error("Validate token API error:", error);
    return NextResponse.json(
      { valid: false, error: "Internal error" },
      { status: 500 }
    );
  }
}
