import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

// 审核申请
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 检查是否为管理员
    const client = getSupabaseClient();
    const { data: admin } = await client
      .from("users")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can review applications" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, admin_notes } = body;

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // 获取申请信息
    const { data: application } = await client
      .from("adoption_applications")
      .select("pet_id, user_id")
      .eq("id", id)
      .maybeSingle();

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // 更新申请状态
    const { data: updatedApp, error } = await client
      .from("adoption_applications")
      .update({
        status,
        admin_notes,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update application: ${error.message}`);
    }

    if (status === "approved") {
      // 创建领养记录
      await client
        .from("adoptions")
        .insert({
          pet_id: application.pet_id,
          user_id: application.user_id,
          application_id: id,
          status: "active",
        });

      // 更新宠物状态为 adopted
      await client
        .from("pets")
        .update({ status: "adopted" })
        .eq("id", application.pet_id);

      // 将用户角色更新为 adopter
      await client
        .from("users")
        .update({ 
          role: "adopter",
          adopter_status: "approved" 
        })
        .eq("id", application.user_id);
    } else {
      // 拒绝申请，恢复宠物状态
      await client
        .from("pets")
        .update({ status: "available" })
        .eq("id", application.pet_id);
    }

    return NextResponse.json({
      success: true,
      application: updatedApp,
    });
  } catch (error) {
    console.error("Review application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
