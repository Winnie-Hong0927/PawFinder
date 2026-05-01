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
 * GET /api/institutions/[id] - 获取机构详情
 * 前端代理层，转发到后端用户服务 GET /api/user/v1/institutions/{id}
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
    }>(API_ENDPOINTS.institutionById(id), { method: 'GET' }, request);

    // 后端返回格式: { code: 200, message: 'success', data: {...} }
    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '获取机构详情失败' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      institution: result.data,
    });
  } catch (error: any) {
    console.error("Get institution proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取机构详情失败" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/institutions/[id] - 更新机构
 * 前端代理层，转发到后端用户服务 PUT /api/user/v1/institutions/{id}
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = await requestBackend<{
      code: number;
      message: string;
      data: any;
    }>(API_ENDPOINTS.institutionById(id), {
      method: 'PUT',
      body: JSON.stringify(body),
    }, request);

    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '更新机构失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message || '更新成功',
      institution: result.data,
    });
  } catch (error: any) {
    console.error("Update institution proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "更新机构失败" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/institutions/[id] - 更新机构
 * 兼容前端旧的调用方式
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(request, { params });
}
