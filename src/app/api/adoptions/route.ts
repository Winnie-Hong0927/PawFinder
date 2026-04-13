import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

// 获取我的领养申请
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = getSupabaseClient();
    
    const { data: applications, error } = await client
      .from("adoption_applications")
      .select(`
        *,
        pets (
          id,
          name,
          species,
          breed,
          images
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      applications: applications || [],
    });
  } catch (error) {
    console.error("Get applications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 创建领养申请
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { pet_id, reason, living_condition, experience, has_other_pets, other_pets_detail, documents } = body;

    if (!pet_id) {
      return NextResponse.json(
        { error: "Pet ID is required" },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // 检查宠物是否可领养
    const { data: pet, error: petError } = await client
      .from("pets")
      .select("status")
      .eq("id", pet_id)
      .maybeSingle();

    if (petError) {
      throw new Error(`Failed to fetch pet: ${petError.message}`);
    }

    if (!pet || pet.status !== "available") {
      return NextResponse.json(
        { error: "Pet is not available for adoption" },
        { status: 400 }
      );
    }

    // 检查是否已有待处理的申请
    const { data: existing } = await client
      .from("adoption_applications")
      .select("id")
      .eq("pet_id", pet_id)
      .eq("user_id", userId)
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "You already have a pending application for this pet" },
        { status: 400 }
      );
    }

    // 创建申请
    const { data, error } = await client
      .from("adoption_applications")
      .insert({
        pet_id,
        user_id: userId,
        reason,
        living_condition,
        experience,
        has_other_pets: has_other_pets || false,
        other_pets_detail,
        documents: documents || [],
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create application: ${error.message}`);
    }

    // 更新宠物状态为 pending
    await client
      .from("pets")
      .update({ status: "pending" })
      .eq("id", pet_id);

    return NextResponse.json({
      success: true,
      application: data,
    });
  } catch (error) {
    console.error("Create application error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
