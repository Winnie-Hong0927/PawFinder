import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { getCurrentSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    // 从会话获取用户信息
    const session = await getCurrentSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = getSupabaseClient();
    
    const { data: user, error } = await client
      .from("users")
      .select("*")
      .eq("id", session.userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

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
        bio: user.bio,
        address: user.address,
        adopter_status: user.adopter_status,
        id_card_number: user.id_card_number ? "***" + user.id_card_number.slice(-4) : null,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // 从会话获取用户信息
    const session = await getCurrentSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const userId = session.userId;

    const body = await request.json();
    const client = getSupabaseClient();

    // 只允许更新特定字段
    const allowedFields = ["name", "phone", "avatar_url", "bio", "address"];
    const updateData: Record<string, string | null> = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await client
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role,
        institution_id: data.institution_id,
        avatar_url: data.avatar_url,
        bio: data.bio,
        address: data.address,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
