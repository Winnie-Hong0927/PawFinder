import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, password } = body;

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

    // In production: 
    // 1. Verify phone code again
    // 2. Hash password with bcrypt
    // 3. Save user to database
    // 4. Generate JWT token

    const user = {
      id: Date.now().toString(),
      name,
      phone,
      email: "",
      role: "user" as const,
      adopter_status: undefined,
    };

    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

    console.log(`[Register] New user registered: ${phone} - ${name}`);

    return NextResponse.json({
      success: true,
      message: "注册成功",
      token,
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({
      success: false,
      error: "注册失败，请稍后重试",
    });
  }
}
