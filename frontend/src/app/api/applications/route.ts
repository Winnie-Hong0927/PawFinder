import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from '@/lib/api-config';

// 通用请求方法
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

// GET /api/applications - 获取申请列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const pet_id = searchParams.get("pet_id");
    const user_id = searchParams.get("user_id");
    const my = searchParams.get("my");
    const pending = searchParams.get("pending");
    
    let backendUrl: string;
    
    // 我的申请
    if (my === 'true') {
      backendUrl = API_ENDPOINTS.myApplications;
    }
    // 待审核申请（管理员）
    else if (pending === 'true') {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      const page = searchParams.get("page") || "1";
      const size = searchParams.get("size") || "20";
      params.set('page', page);
      params.set('size', size);
      backendUrl = `${API_ENDPOINTS.pendingApplications}?${params.toString()}`;
    }
    // 通用查询
    else {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (pet_id) params.set('petId', pet_id);
      if (user_id) params.set('userId', user_id);
      backendUrl = `${API_ENDPOINTS.applications}${params.toString() ? '?' + params.toString() : ''}`;
    }

    const result = await requestBackend<{
      code: number;
      message: string;
      data: any[] | { list: any[]; total: number; page: number; size: number };
    }>(backendUrl, { method: 'GET' }, request);

    if (result.code !== 0) {
      return NextResponse.json(
        { success: false, error: result.message || '获取申请列表失败' },
        { status: 400 }
      );
    }

    // 处理分页响应
    if (pending === 'true' && result.data && typeof result.data === 'object' && 'list' in result.data) {
      return NextResponse.json({
        success: true,
        applications: result.data.list,
        total: result.data.total,
        page: result.data.page,
        size: result.data.size,
      });
    }

    return NextResponse.json({
      success: true,
      applications: result.data,
    });
  } catch (error: any) {
    console.error("Get applications error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取申请列表失败" },
      { status: 500 }
    );
  }
}

// POST /api/applications - 创建申请
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pet_id, reason, living_condition, living_condition_images, experience, has_other_pets, other_pets_detail, documents } = body;

    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "用户未登录或登录已过期，请重新登录" },
        { status: 401 }
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
        pet_id,
        reason,
        living_condition,
        living_condition_images,
        experience,
        has_other_pets,
        other_pets_detail,
        documents: documents || [],
      }),
    }, request);

    if (result.code !== 0) {
      return NextResponse.json(
        { success: false, error: result.message || '创建申请失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      applicationId: result.data,
    });
  } catch (error: any) {
    console.error("Create application error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "创建申请失败" },
      { status: 500 }
    );
  }
}
