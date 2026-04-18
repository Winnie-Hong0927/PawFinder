import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const supabase = getSupabaseClient();

    let query = supabase
      .from("institutions")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      institutions: data || [],
    });
  } catch (error: any) {
    console.error("Get institutions error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取机构列表失败" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, contact_phone, contact_email, address, license_url } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "机构名称不能为空" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("institutions")
      .insert({
        name,
        description,
        contact_phone,
        contact_email,
        address,
        license_url,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      institution: data,
    });
  } catch (error: any) {
    console.error("Create institution error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "创建机构失败" },
      { status: 500 }
    );
  }
}
