import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from '@/lib/api-config';

/**
 * 通用后端请求方法
 */
async function requestBackend<T>(
  url: string,
  options: RequestInit = {},
  request: NextRequest
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 传递用户认证信息
  const userId = request.headers.get("x-user-id");
  const userRole = request.headers.get("x-user-role");
  if (userId) headers['X-User-Id'] = userId;
  if (userRole) headers['X-User-Role'] = userRole;

  // 如果前端有token，也传递
  const cookieHeader = request.headers.get("cookie") || "";
  if (cookieHeader.includes('token=')) {
    const match = cookieHeader.match(/token=([^;]+)/);
    if (match) {
      headers['Authorization'] = `Bearer ${match[1]}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response.json();
}

/**
 * GET /api/adoptions - 获取我的领养列表
 * 前端代理层，转发到后端领养服务
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await requestBackend<{
      code: number;
      message: string;
      data: any[];
    }>(API_ENDPOINTS.myAdoptions, { method: 'GET' }, request);

    // 后端返回格式: { code: 200, message: 'success', data: [...] }
    if (result.code !== 200) {
      return NextResponse.json(
        { error: result.message || '获取领养列表失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      applications: result.data,
    });
  } catch (error) {
    console.error("Get adoptions proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/adoptions - 创建领养申请
 * 前端代理层，转发到后端领养服务
 */
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
    const { pet_id, reason, living_condition, living_condition_images, experience, has_other_pets, other_pets_detail, documents } = body;

    if (!pet_id) {
      return NextResponse.json(
        { error: "Pet ID is required" },
        { status: 400 }
      );
    }

    // 调用后端创建申请
    const result = await requestBackend<{
      code: number;
      message: string;
      data: string;
    }>(API_ENDPOINTS.applications, {
      method: 'POST',
      body: JSON.stringify({
        petId: pet_id,
        reason,
        livingCondition: living_condition,
        livingConditionImages: living_condition_images,
        experience,
        hasOtherPets: has_other_pets,
        otherPetsDetail: other_pets_detail,
        documents: documents || [],
      }),
    }, request);

    // 后端返回格式: { code: 200, message: 'success', data: 'applicationId' }
    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '创建申请失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      applicationId: result.data,
    });
  } catch (error) {
    console.error("Create adoption proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
