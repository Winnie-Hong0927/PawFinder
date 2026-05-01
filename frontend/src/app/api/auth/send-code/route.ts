import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from '@/lib/api-config';

/**
 * 发送验证码 - 前端代理层
 * POST /api/auth/send-code -> POST /api/user/v1/auth/send-code
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, type } = body;

    // 参数校验
    if (!phone || phone.length !== 11) {
      return NextResponse.json({
        success: false,
        error: "请输入正确的11位手机号",
      });
    }

    // 调用后端用户服务
    const response = await fetch(API_ENDPOINTS.sendCode, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });
    
    const result = await response.json();
    
    // 后端返回格式: { code: 200, message: 'success', data: '验证码' }
    if (result.code !== 200) {
      return NextResponse.json({
        success: false,
        error: result.message || '发送失败',
      }, { status: response.status });
    }
    
    return NextResponse.json({
      success: true,
      message: result.message || "验证码已发送",
      // 开发环境返回验证码方便测试
      debug_code: process.env.NODE_ENV === 'development' ? result.data : undefined,
    });
  } catch (error) {
    console.error("Send code proxy error:", error);
    return NextResponse.json({
      success: false,
      error: "发送失败，请稍后重试",
    }, { status: 500 });
  }
}
