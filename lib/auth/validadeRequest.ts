import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function requireUser() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      supabase: null,
      response: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  return { user, supabase, response: null };
}
