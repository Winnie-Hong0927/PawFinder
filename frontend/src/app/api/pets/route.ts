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

// GET /api/pets - 获取宠物列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 构造后端请求参数
    const params = new URLSearchParams();
    const species = searchParams.get("species");
    const size = searchParams.get("size");
    const status = searchParams.get("status") || "available";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    
    if (species) params.set('species', species);
    if (size) params.set('size', size);
    params.set('status', status);
    params.set('page', String(page));
    params.set('size', String(limit));

    const backendUrl = `${API_ENDPOINTS.pets}?${params.toString()}`;
    const result = await requestBackend<{
      code: number;
      message: string;
      data: { list: any[]; total: number; page: number; size: number };
    }>(backendUrl, { method: 'GET' }, request);

    if (result.code !== 0) {
      return NextResponse.json(
        { error: result.message || '获取宠物列表失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      pets: result.data.list,
      total: result.data.total,
      page: result.data.page,
      limit: result.data.size,
    });
  } catch (error) {
    console.error("Get pets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/pets - 创建宠物
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
    const backendUrl = API_ENDPOINTS.pets;
    
    const result = await requestBackend<{
      code: number;
      message: string;
      data: string;
    }>(backendUrl, {
      method: 'POST',
      body: JSON.stringify(body),
    }, request);

    if (result.code !== 0) {
      return NextResponse.json(
        { error: result.message || '创建宠物失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      petId: result.data,
    });
  } catch (error) {
    console.error("Create pet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
