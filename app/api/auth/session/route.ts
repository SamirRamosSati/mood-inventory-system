import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin"; // ✅ Novo import
import type { ApiResponse, UserSession } from "@/types";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // ✅ Usar admin client para consultar o banco
    const adminClient = createAdminClient();
    const { data: user, error: userError } = await adminClient
      .from("users")
      .select("id, email, name, role, createdAt, updatedAt")
      .eq("authId", authUser.id)
      .single();

    if (userError || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const sessionData: UserSession = {
      user,
      isAdmin: user.role === "ADMIN",
    };

    return NextResponse.json<ApiResponse<UserSession>>(
      { success: true, data: sessionData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
