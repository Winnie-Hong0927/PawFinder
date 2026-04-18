import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    
    // 查找用户
    const { data: user, error } = await client
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      throw new Error(`Login failed: ${error.message}`);
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 在生产环境中，这里应该生成 JWT token 或 session
    // 目前简化处理，直接返回用户信息
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        institution_id: user.institution_id,
        avatar_url: user.avatar_url,
        adopter_status: user.adopter_status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
