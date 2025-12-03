import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    console.log("Received token validation request:", token);

    if (!token) {
      console.log("No token provided");
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

    console.log("Database query result:", { invite, error });

    if (error || !invite) {
      console.log("Token not found in database");
      return NextResponse.json(
        { valid: false, error: "Invalid token" },
        { status: 404 }
      );
    }

    // Check if expired
    const expiryDate = new Date(invite.invite_expiry);
    const now = new Date();
    const expired = expiryDate.getTime() <= now.getTime();
    console.log("Expiry check:", { expiryDate, now, expired });

    if (expired) {
      console.log("Token has expired");
      return NextResponse.json(
        { valid: false, error: "Invite link has expired" },
        { status: 410 }
      );
    }

    console.log("Token is valid, returning success");
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
