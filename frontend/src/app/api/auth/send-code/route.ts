import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, type } = body;

    if (!phone || phone.length !== 11) {
      return NextResponse.json({
        success: false,
        error: "请输入正确的11位手机号",
      });
    }

    // 调用后端发送验证码API
    const backendUrl = API_ENDPOINTS.sendCode;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, type: type || 'login' }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: result.message || '发送失败',
      }, { status: response.status });
    }
    
    // 后端返回: { code: 0, message: 'success', data: { code } }
    if (result.code !== 0) {
      return NextResponse.json({
        success: false,
        error: result.message || '发送失败',
      });
    }
    
    // 开发环境下返回验证码方便测试
    const debugCode = process.env.NODE_ENV === 'development' ? result.data?.code : undefined;
    
    return NextResponse.json({
      success: true,
      message: "验证码已发送",
      debug_code: debugCode,
    });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json({
      success: false,
      error: "发送失败，请稍后重试",
    });
  }
}
