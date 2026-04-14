import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    
    // 检查邮箱是否已存在
    const { data: existingUser } = await client
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // 创建用户
    const { data, error } = await client
      .from("users")
      .insert({
        email,
        name: name || null,
        phone: phone || null,
        role: "user",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
