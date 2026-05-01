import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from '@/lib/api-config';

/**
 * POST /api/adoptions/apply - 提交领养申请
 * 前端代理层，转发到后端领养服务 POST /api/adoption/v1/applications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { petId, reason, idCard, livingCondition, experience, hasOtherPets, otherPetsDetail, livingConditionImages, documents } = body;

    // 参数校验
    if (!petId) {
      return NextResponse.json({
        success: false,
        error: "缺少宠物ID",
      }, { status: 400 });
    }

    if (!reason) {
      return NextResponse.json({
        success: false,
        error: "请填写领养理由",
      }, { status: 400 });
    }

    // 从 cookie 获取 token
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);

    // 调用后端领养申请接口
    const response = await fetch(API_ENDPOINTS.applications, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(tokenMatch ? { 'Authorization': `Bearer ${tokenMatch[1]}` } : {}),
      },
      body: JSON.stringify({
        petId,
        reason,
        idCard,
        livingCondition,
        experience,
        hasOtherPets,
        otherPetsDetail,
        livingConditionImages,
        documents,
      }),
    });

    const result = await response.json();

    if (result.code !== 200) {
      return NextResponse.json({
        success: false,
        error: result.message || '提交申请失败',
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      message: result.message || '申请提交成功',
      application: result.data,
    });
  } catch (error: any) {
    console.error("Apply adoption proxy error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "提交申请失败",
    }, { status: 500 });
  }
}
