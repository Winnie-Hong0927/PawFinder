import { NextRequest, NextResponse } from "next/server";
import { GATEWAY_BASE_URL } from "@/lib/api-config";

// 获取捐赠项目列表
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/api/user/v1/donations/campaigns`);
    const result = await response.json();

    if (result.code !== 200) {
      return NextResponse.json({
        success: false,
        error: result.message || "获取捐赠项目失败"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      campaigns: result.data || [],
    });
  } catch (error) {
    console.error("Get campaigns error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 创建捐赠
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
    const { campaign_id, type, amount, goods_detail, goods_address } = body;

    if (!type) {
      return NextResponse.json(
        { success: false, error: "Donation type is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${GATEWAY_BASE_URL}/api/user/v1/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        campaign_id,
        type,
        amount,
        goods_detail,
        goods_address
      })
    });

    const result = await response.json();

    if (result.code !== 200) {
      return NextResponse.json({
        success: false,
        error: result.message || "创建捐赠失败"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      donation: result.data
    });
  } catch (error) {
    console.error("Create donation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
