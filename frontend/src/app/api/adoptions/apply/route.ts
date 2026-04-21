import { NextRequest, NextResponse } from "next/server";
import { GATEWAY_BASE_URL } from "@/lib/api-config";

// 提交领养申请
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { petId, reason, idCard, livingCondition, experience } = body;

    // 从 header 获取用户 ID
    const authHeader = request.headers.get("Authorization");
    let userId = request.headers.get("x-user-id");
    
    if (!userId && authHeader) {
      try {
        const token = Buffer.from(authHeader.replace("Bearer ", ""), "base64").toString();
        userId = token.split(":")[0];
      } catch {
        // ignore
      }
    }

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "请先登录"
      }, { status: 401 });
    }

    if (!petId) {
      return NextResponse.json({
        success: false,
        error: "缺少宠物ID",
      });
    }

    if (!reason) {
      return NextResponse.json({
        success: false,
        error: "请填写领养理由",
      });
    }

    // 调用后端领养申请接口
    const response = await fetch(`${GATEWAY_BASE_URL}/api/adoption/v1/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        pet_id: petId,
        reason,
        id_card_number: idCard,
        living_condition: livingCondition,
        experience
      })
    });

    const result = await response.json();

    if (result.code !== 200) {
      return NextResponse.json({
        success: false,
        error: result.message || "提交失败"
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "申请已提交",
      applicationId: result.data?.id
    });
  } catch (error) {
    console.error("Submit adoption error:", error);
    return NextResponse.json({
      success: false,
      error: "提交失败，请稍后重试"
    }, { status: 500 });
  }
}

// 获取领养申请列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const petId = searchParams.get("petId");

    const params = new URLSearchParams();
    if (userId) params.append("user_id", userId);
    if (petId) params.append("pet_id", petId);

    const response = await fetch(`${GATEWAY_BASE_URL}/api/adoption/v1/applications?${params.toString()}`);
    const result = await response.json();

    if (result.code !== 200) {
      return NextResponse.json({
        success: false,
        error: result.message || "获取失败"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      applications: result.data?.records || []
    });
  } catch (error) {
    console.error("Get applications error:", error);
    return NextResponse.json({
      success: false,
      error: "获取失败"
    }, { status: 500 });
  }
}
