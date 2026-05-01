import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from '@/lib/api-config';

/**
 * GET /api/auth/me - 获取当前用户信息
 * 前端代理层，转发到后端用户服务 GET /api/user/v1/auth/me
 */
export async function GET(request: NextRequest) {
  try {
    // 从 cookie 获取 token
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    
    if (!tokenMatch) {
      return NextResponse.json(
        { error: "Unauthorized", message: "请先登录" },
        { status: 401 }
      );
    }
    
    const token = tokenMatch[1];

    // 调用后端用户服务
    const response = await fetch(API_ENDPOINTS.me, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    // 后端返回格式: { code: 200, message: 'success', data: UserVO }
    if (result.code !== 200) {
      return NextResponse.json(
        { error: result.message || '获取用户信息失败' },
        { status: 401 }
      );
    }

    // 转换后端字段为前端字段
    const user = result.data;
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        institution_id: user.institutionId,
        avatar_url: user.avatarUrl,
        bio: user.bio,
        address: user.address,
        adopter_status: user.adopterStatus,
      }
    });
  } catch (error) {
    console.error("Get current user proxy error:", error);
    return NextResponse.json(
      { error: "获取用户信息失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/me - 更新当前用户信息
 * 前端代理层，转发到后端用户服务 POST /api/user/v1/auth/update/me
 */
export async function POST(request: NextRequest) {
  try {
    // 从 cookie 获取 token
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    
    if (!tokenMatch) {
      return NextResponse.json(
        { error: "Unauthorized", message: "请先登录" },
        { status: 401 }
      );
    }
    
    const token = tokenMatch[1];
    const body = await request.json();

    // 调用后端用户服务
    const response = await fetch(API_ENDPOINTS.updateMe, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result.code !== 200) {
      return NextResponse.json(
        { error: result.message || '更新用户信息失败' },
        { status: response.status }
      );
    }

    // 转换后端字段为前端字段
    const user = result.data;
    return NextResponse.json({
      success: true,
      message: result.message || '更新成功',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        institution_id: user.institutionId,
        avatar_url: user.avatarUrl,
        bio: user.bio,
        address: user.address,
      }
    });
  } catch (error) {
    console.error("Update user proxy error:", error);
    return NextResponse.json(
      { error: "更新用户信息失败" },
      { status: 500 }
    );
  }
}
