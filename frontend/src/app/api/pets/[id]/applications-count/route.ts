import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();
    
    const { count, error } = await supabase
      .from("adoption_applications")
      .select("*", { count: "exact", head: true })
      .eq("pet_id", id);
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, count: count || 0 });
  } catch (error) {
    console.error("Get applications count error:", error);
    return NextResponse.json({ success: false, error: "获取申请人数失败" }, { status: 500 });
  }
}
