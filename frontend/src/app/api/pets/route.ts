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
 * GET /api/pets - 获取宠物列表
 * 前端代理层，转发到后端宠物服务 GET /api/pet/v1/pets
 * 
 * 后端参数: page, size, species, gender, sizeParam, status, keyword
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 构造后端请求参数
    const params = new URLSearchParams();
    const species = searchParams.get("species");
    const gender = searchParams.get("gender");
    const size = searchParams.get("size");
    const status = searchParams.get("status");
    const keyword = searchParams.get("keyword");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("size") || searchParams.get("limit") || "10";
    
    params.set('page', page);
    params.set('size', limit);
    if (species) params.set('species', species);
    if (gender) params.set('gender', gender);
    if (size) params.set('sizeParam', size); // 后端参数名是 sizeParam
    if (status) params.set('status', status);
    if (keyword) params.set('keyword', keyword);

    const backendUrl = `${API_ENDPOINTS.pets}?${params.toString()}`;
    const result = await requestBackend<{
      code: number;
      message: string;
      data: { records: any[]; total: number; current: number; size: number; pages: number };
    }>(backendUrl, { method: 'GET' }, request);

    // 后端返回格式: { code: 200, message: 'success', data: {...} }
    if (result.code !== 200) {
      return NextResponse.json(
        { error: result.message || '获取宠物列表失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      pets: result.data.records,
      total: result.data.total,
      page: result.data.current,
      limit: result.data.size,
      pages: result.data.pages,
    });
  } catch (error) {
    console.error("Get pets proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pets - 创建宠物
 * 前端代理层，转发到后端宠物服务 POST /api/pet/v1/pets
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await requestBackend<{
      code: number;
      message: string;
      data: any;
    }>(API_ENDPOINTS.pets, {
      method: 'POST',
      body: JSON.stringify(body),
    }, request);

    if (result.code !== 200) {
      return NextResponse.json(
        { error: result.message || '创建宠物失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message || '创建成功',
      pet: result.data,
    });
  } catch (error) {
    console.error("Create pet proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
