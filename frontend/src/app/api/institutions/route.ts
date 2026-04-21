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
 * GET /api/institutions - 获取机构列表
 * 前端代理层，转发到后端用户服务
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const size = parseInt(searchParams.get("size") || "20");

    const params = new URLSearchParams();
    params.set('status', status);
    if (type) params.set('type', type);
    params.set('current', String(page));
    params.set('size', String(size));

    const result = await requestBackend<{
      code: number;
      message: string;
      data: { records: any[]; total: number; current: number; size: number };
    }>(`${API_ENDPOINTS.institutions}?${params.toString()}`, { method: 'GET' }, request);

    // 后端返回格式: { code: 200, message: 'success', data: {...} }
    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '获取机构列表失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      institutions: result.data.records,
      total: result.data.total,
      page: result.data.current,
      size: result.data.size,
    });
  } catch (error: any) {
    console.error("Get institutions proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取机构列表失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/institutions - 创建机构
 * 前端代理层，转发到后端用户服务
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, contact_phone, contact_email, address, type, province, city, district, license_url } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "机构名称不能为空" },
        { status: 400 }
      );
    }

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
      data: string;
    }>(API_ENDPOINTS.institutions, {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        contactPhone: contact_phone,
        contactEmail: contact_email,
        address,
        type: type || 'shelter',
        province,
        city,
        district,
        licenseUrl: license_url,
      }),
    }, request);

    // 后端返回格式: { code: 200, message: 'success', data: 'institutionId' }
    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '创建机构失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      institutionId: result.data,
    });
  } catch (error: any) {
    console.error("Create institution proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "创建机构失败" },
      { status: 500 }
    );
  }
}
