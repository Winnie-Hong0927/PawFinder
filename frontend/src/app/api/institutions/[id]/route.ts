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
      .from("institutions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      institution: data,
    });
  } catch (error: any) {
    console.error("Get institution error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取机构详情失败" },
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
    const { status, verified_by } = body;
    const supabase = getSupabaseClient();

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
      if (status === "approved") {
        updateData.verified_at = new Date().toISOString();
        updateData.verified_by = verified_by;
      }
    }

    const { data, error } = await supabase
      .from("institutions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      institution: data,
    });
  } catch (error: any) {
    console.error("Update institution error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "更新机构失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from("institutions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("Delete institution error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "删除机构失败" },
      { status: 500 }
    );
  }
}
