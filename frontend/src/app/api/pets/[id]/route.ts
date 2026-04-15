import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Query from Supabase database
    const client = getSupabaseClient();
    const { data: pet, error } = await client
      .from("pets")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch pet: ${error.message}`);
    }

    if (!pet) {
      return NextResponse.json({
        success: false,
        error: "宠物不存在",
      });
    }

    return NextResponse.json({
      success: true,
      pet,
    });
  } catch (error) {
    console.error("Get pet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
