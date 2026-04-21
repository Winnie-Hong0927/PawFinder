import { NextRequest, NextResponse } from "next/server";
import { GATEWAY_BASE_URL } from "@/lib/api-config";

// 获取我的视频列表
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(`${GATEWAY_BASE_URL}/api/adoption/v1/videos?user_id=${userId}`);
    const result = await response.json();

    if (result.code !== 200) {
      return NextResponse.json({
        success: false,
        error: result.message || "获取视频列表失败"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      videos: result.data || [],
    });
  } catch (error) {
    console.error("Get videos error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
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
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { adoption_id, video_url, thumbnail_url, description } = body;

    if (!adoption_id || !video_url) {
      return NextResponse.json(
        { success: false, error: "Adoption ID and video URL are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${GATEWAY_BASE_URL}/api/adoption/v1/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        adoption_id,
        video_url,
        thumbnail_url,
        description
      })
    });

    const result = await response.json();

    if (result.code !== 200) {
      return NextResponse.json({
        success: false,
        error: result.message || "上传视频失败"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      video: result.data
    });
  } catch (error) {
    console.error("Upload video error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
