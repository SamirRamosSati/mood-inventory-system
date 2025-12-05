import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/auth/validadeRequest";

export async function GET() {
  try {
    const { response } = await requireUser();
    if (response) return response;

    const adminClient = createAdminClient();

    const { data: users, error } = await adminClient
      .from("users")
      .select(
        `
        id,
        name,
        email,
        role,
        status,
        created_at,
        avatar_color,
        StaffProfile!inner (
          function,
          phone
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching staff:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch staff" },
        { status: 500 }
      );
    }

    const { data: pendingInvites } = await adminClient
      .from("pending_invites")
      .select("*")
      .order("created_at", { ascending: false });

    const activeEmployees = users.map((user) => {
      const profile = Array.isArray(user.StaffProfile)
        ? user.StaffProfile[0]
        : user.StaffProfile;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: profile?.phone || "",
        duty: profile?.function || "",
        role: user.role,
        status: user.status || "active",
        avatarColor: user.avatar_color,
        createdAt: new Date(user.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      };
    });

    const pendingEmployees = (pendingInvites || []).map((invite) => ({
      id: invite.email,
      name: invite.name,
      email: invite.email,
      phone: invite.phone || "",
      duty: invite.function || "",
      role: invite.role,
      status: "pending",
      createdAt: new Date(invite.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    }));

    const employees = [...activeEmployees, ...pendingEmployees];

    return NextResponse.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("Staff API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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
        { success: false, error: "Only admins can delete staff" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const isPending = searchParams.get("isPending") === "true";

    if (!id && !email) {
      return NextResponse.json(
        { success: false, error: "Missing id or email parameter" },
        { status: 400 }
      );
    }

    if (isPending && email) {
      const { error } = await adminClient
        .from("pending_invites")
        .delete()
        .eq("email", email);

      if (error) {
        console.error("Error deleting pending invite:", error);
        return NextResponse.json(
          { success: false, error: "Failed to delete pending invite" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Pending invite deleted successfully",
      });
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id for active user" },
        { status: 400 }
      );
    }

    const { error: authError } = await adminClient.auth.admin.deleteUser(id);
    if (authError) {
      console.error("Error deleting auth user:", authError);
    }

    await adminClient.from("StaffProfile").delete().eq("user_id", id);

    const { error: userError } = await adminClient
      .from("users")
      .delete()
      .eq("id", id);

    if (userError) {
      console.error("Error deleting user:", userError);
      return NextResponse.json(
        { success: false, error: "Failed to delete user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete staff error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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
        { success: false, error: "Only admins can update staff" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, email, name, phone, duty, role, isPending } = body;

    if (!id && !email) {
      return NextResponse.json(
        { success: false, error: "Missing id or email" },
        { status: 400 }
      );
    }

    if (isPending && email) {
      const { error } = await adminClient
        .from("pending_invites")
        .update({
          name,
          phone: phone || null,
          role,
          function: duty,
        })
        .eq("email", email);

      if (error) {
        console.error("Error updating pending invite:", error);
        return NextResponse.json(
          { success: false, error: "Failed to update pending invite" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Pending invite updated successfully",
      });
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id for active user" },
        { status: 400 }
      );
    }

    const { error: userError } = await adminClient
      .from("users")
      .update({
        name,
        role,
      })
      .eq("id", id);

    if (userError) {
      console.error("Error updating user:", userError);
      return NextResponse.json(
        { success: false, error: "Failed to update user" },
        { status: 500 }
      );
    }

    const { error: profileError } = await adminClient
      .from("StaffProfile")
      .update({
        function: duty,
        phone: phone || null,
      })
      .eq("user_id", id);

    if (profileError) {
      console.error("Error updating staff profile:", profileError);
      return NextResponse.json(
        { success: false, error: "Failed to update staff profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update staff error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
