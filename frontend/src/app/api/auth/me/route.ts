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
 * GET /api/auth/me - 获取当前用户信息
 * 前端代理层，转发到后端用户服务
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await requestBackend<{
      code: number;
      message: string;
      data: any;
    }>(API_ENDPOINTS.userInfo, { method: 'GET' }, request);

    // 后端返回格式: { code: 200, message: 'success', data: {...} }
    if (result.code !== 200) {
      return NextResponse.json(
        { error: result.message || '获取用户信息失败' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: result.data.id,
        email: result.data.email,
        name: result.data.name,
        phone: result.data.phone,
        role: result.data.role,
        institution_id: result.data.institution_id,
        avatar_url: result.data.avatar_url,
        bio: result.data.bio,
        address: result.data.address,
        adopter_status: result.data.adopter_status,
      },
    });
  } catch (error) {
    console.error("Get user proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/auth/me - 更新当前用户信息
 * 前端代理层，转发到后端用户服务
 */
export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // 只允许更新特定字段（业务逻辑在后端，这里只是简单转发）
    const result = await requestBackend<{
      code: number;
      message: string;
      data: any;
    }>(API_ENDPOINTS.updateUser, {
      method: 'PUT',
      body: JSON.stringify(body),
    }, request);

    // 后端返回格式: { code: 200, message: 'success', data: {...} }
    if (result.code !== 200) {
      return NextResponse.json(
        { error: result.message || '更新用户信息失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.data,
    });
  } catch (error) {
    console.error("Update user proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
