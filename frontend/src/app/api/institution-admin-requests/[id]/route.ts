import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("institution_admin_requests")
      .select(`
        *,
        institution:institutions(id, name)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      request: data,
    });
  } catch (error: any) {
    console.error("Get admin request error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取申请详情失败" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, reviewed_by, rejection_reason } = body;
    const supabase = getSupabaseClient();

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "无效的状态" },
        { status: 400 }
      );
    }

    // Get the request first
    const { data: existingRequest, error: getError } = await supabase
      .from("institution_admin_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (getError || !existingRequest) {
      return NextResponse.json(
        { success: false, error: "申请不存在" },
        { status: 404 }
      );
    }

    const updateData: any = {
      status,
      reviewed_by,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (status === "rejected") {
      updateData.rejection_reason = rejection_reason || "不符合条件";
    }

    // Update request
    const { data: requestData, error } = await supabase
      .from("institution_admin_requests")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // If approved, create the user account
    if (status === "approved") {
      const { error: userError } = await supabase
        .from("users")
        .insert({
          email: existingRequest.email,
          phone: existingRequest.phone,
          name: existingRequest.name,
          role: "institution_admin",
          institution_id: existingRequest.institution_id,
          id_card_number: existingRequest.id_card_number,
          id_card_front_url: existingRequest.id_card_front_url,
          id_card_back_url: existingRequest.id_card_back_url,
        });

      if (userError) {
        console.error("Failed to create user:", userError);
        // Rollback the request status
        await supabase
          .from("institution_admin_requests")
          .update({ status: "pending" })
          .eq("id", id);

        return NextResponse.json(
          { success: false, error: "创建用户账号失败" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      request: requestData,
    });
  } catch (error: any) {
    console.error("Review admin request error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "审核申请失败" },
      { status: 500 }
    );
  }
}
