import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return Response.json({ error: "Token is required" }, { status: 400 });
    }

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

    const now = new Date();
    const expiresAt = new Date(reset.expires_at);

    if (now > expiresAt) {
      return Response.json(
        { error: "Reset link has expired" },
        { status: 400 }
      );
    }

    return Response.json({ valid: true });
  } catch (error) {
    console.error("Token validation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
