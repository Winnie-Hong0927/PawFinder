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

// GET /api/institutions/[id] - 获取机构详情
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

    if (result.code !== 0) {
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
    console.error("Get institution error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取机构详情失败" },
      { status: 500 }
    );
  }
}

// PATCH /api/institutions/[id] - 更新机构
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await requestBackend<{
      code: number;
      message: string;
      data: any;
    }>(API_ENDPOINTS.institutionById(id), {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }, request);

    if (result.code !== 0) {
      return NextResponse.json(
        { success: false, error: result.message || '更新机构失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      institution: result.data,
    });
  } catch (error: any) {
    console.error("Update institution error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "更新机构失败" },
      { status: 500 }
    );
  }
}

// DELETE /api/institutions/[id] - 删除机构
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await requestBackend<{
      code: number;
      message: string;
    }>(API_ENDPOINTS.institutionById(id), {
      method: 'DELETE',
    }, request);

    if (result.code !== 0) {
      return NextResponse.json(
        { success: false, error: result.message || '删除机构失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("Delete institution error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "删除机构失败" },
      { status: 500 }
    );
  }
}
