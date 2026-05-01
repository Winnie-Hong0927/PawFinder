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
 * GET /api/applications - 获取申请列表
 * 前端代理层，转发到后端领养服务 GET /api/adoption/v1/applications
 * 
 * 后端参数: page, size, status, petId, userId
 * 我的申请: GET /api/adoption/v1/applications/my
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const petId = searchParams.get("pet_id");
    const userId = searchParams.get("user_id");
    const my = searchParams.get("my");
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "10";
    
    let backendUrl: string;
    
    // 我的申请
    if (my === 'true') {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('size', size);
      if (status) params.set('status', status);
      backendUrl = `${API_ENDPOINTS.myApplications}?${params.toString()}`;
    }
    // 通用查询（管理员）
    else {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('size', size);
      if (status) params.set('status', status);
      if (petId) params.set('petId', petId);
      if (userId) params.set('userId', userId);
      backendUrl = `${API_ENDPOINTS.applications}?${params.toString()}`;
    }

    const result = await requestBackend<{
      code: number;
      message: string;
      data: { records: any[]; total: number; current: number; size: number };
    }>(backendUrl, { method: 'GET' }, request);

    // 后端返回格式: { code: 200, message: 'success', data: {...} }
    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '获取申请列表失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      applications: result.data.records,
      total: result.data.total,
      page: result.data.current,
      size: result.data.size,
    });
  } catch (error: any) {
    console.error("Get applications proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取申请列表失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/applications - 创建申请
 * 前端代理层，转发到后端领养服务 POST /api/adoption/v1/applications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pet_id, reason, living_condition, living_condition_images, experience, has_other_pets, other_pets_detail, documents } = body;

    // 调用后端创建申请
    const result = await requestBackend<{
      code: number;
      message: string;
      data: any;
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

    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '提交申请失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message || '申请提交成功',
      application: result.data,
    });
  } catch (error: any) {
    console.error("Create application proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "提交申请失败" },
      { status: 500 }
    );
  }
}
