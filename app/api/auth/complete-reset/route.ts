import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return Response.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // Fetch the token from password_resets table
    const { data: reset, error: fetchError } = await supabase
      .from("password_resets")
      .select("*")
      .eq("token", token)
      .is("used_at", null)
      .single();

    if (fetchError || !reset) {
      return Response.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(reset.expires_at);

    if (now > expiresAt) {
      return Response.json(
        { error: "Reset link has expired" },
        { status: 400 }
      );
    }

    // Update password in auth.users
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: updateError } = await adminClient.auth.admin.updateUserById(
      reset.user_id,
      { password }
    );

    if (updateError) {
      console.error("Password update error:", updateError);
      return Response.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }

    // Mark token as used
    const { error: updateUsedError } = await supabase
      .from("password_resets")
      .update({ used_at: new Date().toISOString() })
      .eq("token", token);

    if (updateUsedError) {
      console.error("Token update error:", updateUsedError);
    }

    return Response.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Complete reset error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
