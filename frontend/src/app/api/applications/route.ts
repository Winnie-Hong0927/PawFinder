import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const pet_id = searchParams.get("pet_id");
    const user_id = searchParams.get("user_id");
    const institution_id = searchParams.get("institution_id");

    const supabase = getSupabaseClient();

    // First get the applications
    let query = supabase
      .from("adoption_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (pet_id) {
      query = query.eq("pet_id", pet_id);
    }

    if (user_id) {
      query = query.eq("user_id", user_id);
    }

    const { data: applications, error } = await query;

    if (error) throw error;

    // Then fetch related data
    const petIds = applications?.map(a => a.pet_id) || [];
    const userIds = applications?.map(a => a.user_id) || [];

    let pets: any = {};
    let users: any = {};
    let institutions: any = {};

    if (petIds.length > 0) {
      const { data: petsData } = await supabase
        .from("pets")
        .select("*, institutions(name)")
        .in("id", [...new Set(petIds)]);
      
      petsData?.forEach(p => { pets[p.id] = p; });
    }

    if (userIds.length > 0) {
      const { data: usersData } = await supabase
        .from("users")
        .select("id, name, email, phone")
        .in("id", [...new Set(userIds)]);
      
      usersData?.forEach(u => { users[u.id] = u; });
    }

    // Combine the data
    const enrichedApplications = applications?.map(app => ({
      ...app,
      pet: pets[app.pet_id] || null,
      user: users[app.user_id] || null,
    })) || [];

    // Filter by institution if needed
    let result = enrichedApplications;
    if (institution_id) {
      result = result.filter((app: any) => app.pet?.institution_id === institution_id);
    }

    return NextResponse.json({
      success: true,
      applications: result,
    });
  } catch (error: any) {
    console.error("Get applications error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取申请列表失败" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pet_id, user_id, reason, living_condition, living_condition_images, experience, has_other_pets, other_pets_detail, documents } = body;

    if (!pet_id || !user_id) {
      return NextResponse.json(
        { success: false, error: "宠物ID和用户ID不能为空" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // Check if pet exists and is available
    const { data: pet, error: petError } = await supabase
      .from("pets")
      .select("id, status, name")
      .eq("id", pet_id)
      .single();

    if (petError || !pet) {
      return NextResponse.json(
        { success: false, error: "宠物不存在" },
        { status: 404 }
      );
    }

    if (pet.status !== "available") {
      return NextResponse.json(
        { success: false, error: "该宠物当前不可申请领养" },
        { status: 400 }
      );
    }

    // Check if user already applied
    const { data: existingApp } = await supabase
      .from("adoption_applications")
      .select("id")
      .eq("pet_id", pet_id)
      .eq("user_id", user_id)
      .eq("status", "pending")
      .single();

    if (existingApp) {
      return NextResponse.json(
        { success: false, error: "您已提交过该宠物的领养申请" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("adoption_applications")
      .insert({
        pet_id,
        user_id,
        reason,
        living_condition,
        experience,
        has_other_pets,
        other_pets_detail,
        documents: documents || [],
        living_condition_images: living_condition_images || [],
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      application: data,
    });
  } catch (error: any) {
    console.error("Create application error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "创建申请失败" },
      { status: 500 }
    );
  }
}
