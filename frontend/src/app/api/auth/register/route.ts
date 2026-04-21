import { NextRequest, NextResponse } from "next/server";
import { GATEWAY_BASE_URL } from "@/lib/api-config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, password, email } = body;

    if (!phone || phone.length !== 11) {
      return NextResponse.json({
        success: false,
        error: "请输入正确的11位手机号",
      });
    }

    if (!name) {
      return NextResponse.json({
        success: false,
        error: "请输入您的姓名",
      });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({
        success: false,
        error: "密码至少6位",
      });
    }

    // 调用后端注册接口
    const response = await fetch(`${GATEWAY_BASE_URL}/api/user/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone, name, password, email })
    });

    const result = await response.json();

    if (result.code !== 200) {
      return NextResponse.json({
        success: false,
        error: result.message || "注册失败"
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "注册成功",
      user: result.data.user,
      token: result.data.token
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({
      success: false,
      error: "注册失败，请稍后重试"
    }, { status: 500 });
  }
}
