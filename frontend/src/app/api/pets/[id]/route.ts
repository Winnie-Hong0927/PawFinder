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

// GET /api/pets/[id] - 获取宠物详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 获取宠物信息和申请人数
    const [petResult, countResult] = await Promise.all([
      requestBackend<{
        code: number;
        message: string;
        data: any;
      }>(API_ENDPOINTS.petById(id), { method: 'GET' }, request),
      requestBackend<{
        code: number;
        data: number;
      }>(API_ENDPOINTS.petApplicationCount(id), { method: 'GET' }, request),
    ]);

    if (petResult.code !== 0) {
      return NextResponse.json(
        { error: petResult.message || '获取宠物详情失败' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pet: petResult.data,
      application_count: countResult.code === 0 ? countResult.data : 0,
    });
  } catch (error) {
    console.error("Get pet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/pets/[id] - 更新宠物
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    const result = await requestBackend<{
      code: number;
      message: string;
    }>(API_ENDPOINTS.petById(id), {
      method: 'PUT',
      body: JSON.stringify(body),
    }, request);

    if (result.code !== 0) {
      return NextResponse.json(
        { error: result.message || '更新宠物失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Update pet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/pets/[id] - 删除宠物
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    const result = await requestBackend<{
      code: number;
      message: string;
    }>(API_ENDPOINTS.petById(id), {
      method: 'DELETE',
    }, request);

    if (result.code !== 0) {
      return NextResponse.json(
        { error: result.message || '删除宠物失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete pet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
