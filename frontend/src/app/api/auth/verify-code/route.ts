import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

// Reference the same store (in production, use shared Redis/database)
const verificationCodes: Record<string, { code: string; expires: number; type: string }> = {};

// Auto-register new users on first login
async function autoRegister(supabase: any, phone: string) {
  const { data, error } = await supabase
    .from("users")
    .insert({
      phone,
      name: "新用户",
      role: "user",
    })
    .select()
    .single();

  if (error) {
    console.error("Auto-register error:", error);
    // Fallback to mock user
    return {
      id: Date.now().toString(),
      name: "新用户",
      phone,
      email: "",
      role: "user",
    };
  }

  return data;
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

      const supabase = getSupabaseClient();
      let isNewUser = false;
      let user = null;

      // Try to find existing user by phone from real database
      const { data: existingUser, error: findError } = await supabase
        .from("users")
        .select("*")
        .eq("phone", phone)
        .maybeSingle();

      if (findError) {
        console.error("Find user error:", findError);
      }

      if (existingUser) {
        user = {
          id: existingUser.id,
          name: existingUser.name,
          phone: existingUser.phone,
          email: existingUser.email,
          role: existingUser.role,
          institution_id: existingUser.institution_id,
          avatar_url: existingUser.avatar_url,
          adopter_status: existingUser.adopter_status,
        };
      } else {
        // Auto-register new user
        user = await autoRegister(supabase, phone);
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
