import { NextRequest, NextResponse } from "next/server";

// Reference the same store (in production, use shared Redis/database)
const verificationCodes: Record<string, { code: string; expires: number; type: string }> = {};

// Mock users database (in production, query real database)
const mockUsers: Record<string, any> = {
  "13800138000": {
    id: "1",
    name: "演示用户",
    phone: "138****8000",
    email: "demo@pawfinder.com",
    role: "user",
  },
  "13800138001": {
    id: "2",
    name: "管理员",
    phone: "138****8001",
    email: "admin@pawfinder.com",
    role: "admin",
  },
};

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

    // Check if code is correct and not expired
    const record = verificationCodes[phone];
    
    // For demo: accept any 6-digit code
    if (code.length === 6) {
      // Clear the used code
      delete verificationCodes[phone];

      // Check if user exists
      const fullPhone = Object.keys(mockUsers).find(k => k.startsWith(phone.slice(0, 7)));
      const user = mockUsers[fullPhone || phone] || {
        id: Date.now().toString(),
        name: "新用户",
        phone: phone,
        email: "",
        role: "user",
      };

      // Generate mock token
      const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

      return NextResponse.json({
        success: true,
        message: "验证成功",
        token,
        user,
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
