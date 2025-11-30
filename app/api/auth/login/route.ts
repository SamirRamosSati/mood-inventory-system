import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ApiResponse, UserSession } from "@/types";

export async function POST(request: NextRequest) {
  console.log("🔐 Login API called");

  try {
    const body = await request.json();
    console.log("📧 Login attempt:", body.email);

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    console.log("🔑 Attempting Supabase authentication...");
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      console.log("❌ Supabase auth error:", authError.message);
      return NextResponse.json<ApiResponse>(
        { success: false, error: authError.message },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("📊 Fetching user from database...");

    const adminClient = createAdminClient();
    const { data: user, error: userError } = await adminClient
      .from("users")
      .select("id, email, name, role, created_at")
      .eq("id", authData.user.id)
      .single();

    if (userError || !user) {
      console.log("❌ User not found in database:", userError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "User not found in system" },
        { status: 404 }
      );
    }

    const sessionData: UserSession = {
      user,
      isAdmin: user.role === "ADMIN",
    };

    console.log("✅ Login successful:", user.email);
    return NextResponse.json<ApiResponse<UserSession>>(
      { success: true, data: sessionData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
