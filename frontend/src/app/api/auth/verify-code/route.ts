import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/lib/api-config';

/**
 * 验证码登录 - 前端代理层
 * POST /api/auth/verify-code -> POST /api/user/v1/auth/verify-code
 */
export async function POST(request: Request) {
  try {
    const { phone, code, name } = await request.json();
    
    // 参数校验
    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: '手机号和验证码不能为空' },
        { status: 400 }
      );
    }
    
    // 调用后端用户服务
    const response = await fetch(API_ENDPOINTS.verifyCode, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code, name }),
    });
    
    const result = await response.json();
    
    // 后端返回格式: { code: 200, message: 'success', data: { token, userId, user } }
    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '验证失败' },
        { status: response.status }
      );
    }
    
    const { token, userId, user } = result.data;
    
    // 构建前端响应
    const nextResponse = NextResponse.json({
      success: true,
      message: result.message || '登录成功',
      user: {
        id: userId,
        phone: user?.phone,
        name: user?.name,
        role: user?.role,
        avatar_url: user?.avatarUrl,
        institution_id: user?.institutionId,
      }
    });
    
    // 设置 token cookie（使用后端返回的 JWT）
    if (token) {
      nextResponse.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7天
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }
    
    return nextResponse;
  } catch (error) {
    console.error('登录代理错误:', error);
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
