import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ApiResponse } from "@/types";

const adminClient = createAdminClient();

export async function GET(request: NextRequest) {
  try {
    // Get all staff profiles
    const { data: allStaff, error: allError } = await adminClient
      .from("StaffProfile")
      .select("*");

    console.log("All staff profiles:", allStaff);
    console.log("All staff error:", allError);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Debug info",
      data: {
        allStaff,
        allError: allError
          ? { message: allError.message, code: allError.code }
          : null,
        count: Array.isArray(allStaff) ? allStaff.length : 0,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
