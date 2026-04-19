import { NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/lib/api-config';

export async function POST(request: Request) {
  try {
    const { phone, code, name } = await request.json();
    
    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: '手机号和验证码不能为空' },
        { status: 400 }
      );
    }
    
    // 调用后端验证API
    const backendUrl = API_ENDPOINTS.verifyCode;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code, name }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: result.message || '验证失败' },
        { status: response.status }
      );
    }
    
    // 后端返回: { code: 0, message: 'success', data: { token, userId, user } }
    if (result.code !== 0) {
      return NextResponse.json(
        { success: false, error: result.message || '验证失败' },
        { status: 400 }
      );
    }
    
    const { token, userId, user } = result.data;
    
    // 构建前端响应
    const nextResponse = NextResponse.json({
      success: true,
      message: '登录成功',
      user: {
        id: userId,
        phone: user.phone,
        name: user.name,
        role: user.role,
        avatar_url: user.avatar_url,
        institution_id: user.institution_id,
      }
    });
    
    // 设置 token cookie（使用后端返回的 JWT）
    nextResponse.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7天
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    
    return nextResponse;
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
