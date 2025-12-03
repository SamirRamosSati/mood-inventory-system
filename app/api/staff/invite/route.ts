import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/auth/validadeRequest";

const TEMPLATE_ID = "d-d2ce0083dd90434093647c1de3f29ab7";

export async function POST(req: NextRequest) {
  try {
    const { user, response } = await requireUser();
    if (response) return response;

    const adminClient = createAdminClient();
    const { data: currentUser } = await adminClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!currentUser || currentUser.role?.toLowerCase() !== "admin") {
      return NextResponse.json(
        { success: false, error: "Only admins can invite staff" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, phone, role, duty } = body;

    if (!name || !email || !role || !duty) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: existingUser } = await adminClient
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already in use" },
        { status: 409 }
      );
    }

    const token =
      crypto.randomUUID().replace(/-/g, "") +
      crypto.randomUUID().replace(/-/g, "");
    const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    const { error: insertErr } = await adminClient
      .from("pending_invites")
      .upsert(
        {
          email,
          name,
          phone: phone || null,
          role,
          function: duty,
          invite_token: token,
          invite_expiry: expiry,
        },
        { onConflict: "email" }
      );

    if (insertErr) {
      console.error("Error creating pending invite:", insertErr);
      return NextResponse.json(
        { success: false, error: "Failed to create invite" },
        { status: 500 }
      );
    }

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/set-password/${token}`;

    const sgResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: {
          email: process.env.SENDGRID_FROM_EMAIL,
          name: "Mood Inventory System",
        },
        personalizations: [
          {
            to: [{ email }],
            dynamic_template_data: {
              name,
              invite_link: inviteLink,
            },
            subject: "Welcome to MOOD - Set Your Password",
          },
        ],
        template_id: TEMPLATE_ID,
      }),
    });

    if (!sgResponse.ok) {
      await adminClient.from("pending_invites").delete().eq("email", email);
      const errorText = await sgResponse.text();
      console.error("SendGrid error:", errorText);
      return NextResponse.json(
        { success: false, error: "Failed to send invite email" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invite sent successfully",
    });
  } catch (error) {
    console.error("Staff invite API error:", error);
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
