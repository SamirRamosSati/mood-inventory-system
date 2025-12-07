import { createClient } from "@supabase/supabase-js";
import sgMail from "@sendgrid/mail";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: users } = await adminClient.auth.admin.listUsers();
    const user = users?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return Response.json(
        {
          success: true,
          message:
            "If an account exists with this email, a reset link will be sent.",
        },
        { status: 200 }
      );
    }

    const { data: userData } = await supabase
      .from("users")
      .select("name")
      .eq("id", user.id)
      .single();

    const resetToken =
      crypto.randomUUID().replace(/-/g, "") +
      crypto.randomUUID().replace(/-/g, "");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase
      .from("password_resets")
      .insert({
        user_id: user.id,
        email: user.email,
        token: resetToken,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error("Failed to create reset token:", insertError);
      return Response.json(
        { error: "Failed to create reset token" },
        { status: 500 }
      );
    }

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;

    try {
      await sgMail.send({
        to: user.email || "",
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: "Password Reset Request - MOOD Inventory System",
        templateId: "d-2950f81d44d042028edb125ab5404ea9",
        dynamicTemplateData: {
          name: userData?.name || "User",
          reset_link: resetLink,
        },
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      return Response.json(
        { error: "Failed to send reset email" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message:
          "If an account exists with this email, a reset link will be sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
