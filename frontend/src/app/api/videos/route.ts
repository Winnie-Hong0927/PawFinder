import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

// 获取我的视频列表
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = getSupabaseClient();
    
    const { data: videos, error } = await client
      .from("pet_videos")
      .select(`
        *,
        adoptions (
          id,
          pets (
            id,
            name,
            species
          )
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch videos: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      videos: videos || [],
    });
  } catch (error) {
    console.error("Get videos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 上传宠物视频
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { adoption_id, video_url, thumbnail_url, description } = body;

    if (!adoption_id || !video_url) {
      return NextResponse.json(
        { error: "Adoption ID and video URL are required" },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // 验证领养记录
    const { data: adoption, error: adoptionError } = await client
      .from("adoptions")
      .select("id, status")
      .eq("id", adoption_id)
      .eq("user_id", userId)
      .maybeSingle();

    if (adoptionError) {
      throw new Error(`Failed to verify adoption: ${adoptionError.message}`);
    }

    if (!adoption) {
      return NextResponse.json(
        { error: "Adoption record not found" },
        { status: 404 }
      );
    }

    if (adoption.status !== "active") {
      return NextResponse.json(
        { error: "Adoption is not active" },
        { status: 400 }
      );
    }

    // 创建视频记录
    const { data: video, error } = await client
      .from("pet_videos")
      .insert({
        adoption_id,
        user_id: userId,
        video_url,
        thumbnail_url,
        description,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create video record: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      video,
    });
  } catch (error) {
    console.error("Upload video error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
