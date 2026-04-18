import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const institution_id = searchParams.get("institution_id");

    const supabase = getSupabaseClient();

    let query = supabase
      .from("institution_admin_requests")
      .select(`
        *,
        institution:institutions(id, name)
      `)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (institution_id) {
      query = query.eq("institution_id", institution_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      requests: data || [],
    });
  } catch (error: any) {
    console.error("Get admin requests error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取申请列表失败" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { institution_id, email, phone, name, id_card_number, id_card_front_url, id_card_back_url } = body;

    if (!institution_id || !email || !phone || !name) {
      return NextResponse.json(
        { success: false, error: "请填写完整信息" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // Check if institution exists and is approved
    const { data: institution, error: instError } = await supabase
      .from("institutions")
      .select("id, status")
      .eq("id", institution_id)
      .single();

    if (instError || !institution) {
      return NextResponse.json(
        { success: false, error: "机构不存在" },
        { status: 404 }
      );
    }

    if (institution.status !== "approved") {
      return NextResponse.json(
        { success: false, error: "机构尚未通过审核" },
        { status: 400 }
      );
    }

    // Check if email already registered
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "该邮箱已被注册" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("institution_admin_requests")
      .insert({
        institution_id,
        email,
        phone,
        name,
        id_card_number,
        id_card_front_url,
        id_card_back_url,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      request: data,
    });
  } catch (error: any) {
    console.error("Create admin request error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "创建申请失败" },
      { status: 500 }
    );
  }
}
