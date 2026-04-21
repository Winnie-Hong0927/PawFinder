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
 * GET /api/applications/[id] - 获取申请详情
 * 前端代理层，转发到后端领养服务
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await requestBackend<{
      code: number;
      message: string;
      data: any;
    }>(API_ENDPOINTS.applicationById(id), { method: 'GET' }, request);

    // 后端返回格式: { code: 200, message: 'success', data: {...} }
    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '获取申请详情失败' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application: result.data,
    });
  } catch (error: any) {
    console.error("Get application proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取申请详情失败" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/applications/[id] - 更新申请状态（审核）
 * 前端代理层，转发到后端领养服务
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, admin_notes } = body;

    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 调用后端审核API
    const result = await requestBackend<{
      code: number;
      message: string;
      data: any;
    }>(API_ENDPOINTS.applicationReview(id), {
      method: 'PUT',
      body: JSON.stringify({ status, adminNotes: admin_notes }),
    }, request);

    // 后端返回格式: { code: 200, message: 'success', data: {...} }
    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '更新申请失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      application: result.data,
    });
  } catch (error: any) {
    console.error("Update application proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "更新申请失败" },
      { status: 500 }
    );
  }
}
