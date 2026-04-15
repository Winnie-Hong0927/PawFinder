import { NextRequest, NextResponse } from "next/server";

// Reference the same store (in production, use shared Redis/database)
const verificationCodes: Record<string, { code: string; expires: number; type: string }> = {};

// Mock users database (in production, query real database)
const mockUsers: Record<string, any> = {
  // Pre-defined demo admin account
  "13800138001": {
    id: "2",
    name: "管理员",
    phone: "13800138001",
    email: "admin@pawfinder.com",
    role: "admin",
  },
};

// Auto-register new users on first login
function autoRegister(phone: string) {
  const user = {
    id: Date.now().toString(),
    name: "新用户",
    phone: phone,
    email: "",
    role: "user" as const,
    created_at: new Date().toISOString(),
  };
  mockUsers[phone] = user;
  return user;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json({
        success: false,
        error: "请提供手机号和验证码",
      });
    }

    // For demo: accept any 6-digit code
    if (code.length === 6) {
      // Clear the used code
      delete verificationCodes[phone];

      // Check if user exists, if not auto-register
      let user = mockUsers[phone];
      let isNewUser = false;
      
      if (!user) {
        user = autoRegister(phone);
        isNewUser = true;
      }

      // Generate mock token
      const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

      return NextResponse.json({
        success: true,
        message: isNewUser ? "注册成功" : "登录成功",
        token,
        user,
        isNewUser,
      });
    }

    return NextResponse.json({
      success: false,
      error: "验证码错误或已过期",
    });
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json({
      success: false,
      error: "验证失败，请稍后重试",
    });
  }
}
