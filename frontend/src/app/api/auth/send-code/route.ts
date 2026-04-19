import { NextRequest, NextResponse } from "next/server";

// In-memory store for demo (in production, use Redis or database)
const verificationCodes: Record<string, { code: string; expires: number; type: string }> = {};

// Generate random 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

    // Check rate limit (1 code per 60 seconds per phone)
    const existing = verificationCodes[phone];
    if (existing && existing.expires > Date.now()) {
      const remaining = Math.ceil((existing.expires - Date.now()) / 1000);
      return NextResponse.json({
        success: false,
        error: `请${remaining}秒后再试`,
        remaining,
      });
    }

    // Generate new code
    const code = generateCode();
    verificationCodes[phone] = {
      code,
      expires: Date.now() + 60000, // 60 seconds
      type: type || "login",
    };

    // In production, integrate with SMS service (e.g., Alibaba Cloud, Tencent Cloud)
    // For demo, we'll just return success and log the code
    console.log(`[SMS] Verification code for ${phone}: ${code}`);

    // Simulate SMS API call
    // const smsResponse = await fetch('https://api.sms.example.com/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone, template: 'login', params: { code } }),
    // });

    return NextResponse.json({
      success: true,
      message: "验证码已发送",
      // For demo purposes, return the code (remove in production!)
      debug_code: code,
    });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json({
      success: false,
      error: "发送失败，请稍后重试",
    });
  }
}
