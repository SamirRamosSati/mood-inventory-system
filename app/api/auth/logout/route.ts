import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types";

export async function POST() {
  try {
    console.log("🔓 Logout API called");
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("❌ Logout error:", error);
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message || "Logout failed" },
        { status: 500 }
      );
    }

    console.log("✅ Logout successful");
    return NextResponse.json<ApiResponse>(
      { success: true, message: "Logout successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Logout error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
