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
 * GET /api/adoptions - 获取我的领养列表
 * 前端代理层，转发到后端领养服务 GET /api/adoption/v1/applications/my
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "10";
    const status = searchParams.get("status");

    const params = new URLSearchParams();
    params.set('page', page);
    params.set('size', size);
    if (status) params.set('status', status);

    const result = await requestBackend<{
      code: number;
      message: string;
      data: { records: any[]; total: number; current: number; size: number };
    }>(`${API_ENDPOINTS.myApplications}?${params.toString()}`, { method: 'GET' }, request);

    // 后端返回格式: { code: 200, message: 'success', data: {...} }
    if (result.code !== 200) {
      return NextResponse.json(
        { error: result.message || '获取领养列表失败' },
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
  } catch (error) {
    console.error("Get adoptions proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
