import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { getCurrentSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const pet_id = searchParams.get("pet_id");
    const user_id = searchParams.get("user_id");
    const institution_id = searchParams.get("institution_id");

    // Get current session
    const session = await getCurrentSession();
    const currentUser = session?.user;
    
    // If not logged in, return empty
    if (!currentUser) {
      return NextResponse.json({ success: true, applications: [] });
    }

    const supabase = getSupabaseClient();

    // First get the applications - filter by current user unless admin
    let query = supabase
      .from("adoption_applications")
      .select("*")
      .order("created_at", { ascending: false });

    // Non-admin users can only see their own applications
    if (currentUser.role !== "admin" && currentUser.role !== "institution_admin") {
      query = query.eq("user_id", currentUser.id);
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (pet_id) {
      query = query.eq("pet_id", pet_id);
    }

    if (user_id && currentUser.role === "admin") {
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
    const { pet_id, reason, living_condition, living_condition_images, experience, has_other_pets, other_pets_detail, documents } = body;

    // 从后端会话获取用户信息
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "用户未登录或登录已过期，请重新登录" },
        { status: 401 }
      );
    }

    const user_id = session.userId;

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
      .select("id, status, created_at")
      .eq("pet_id", pet_id)
      .eq("user_id", user_id)
      .single();

    if (existingApp) {
      const statusText = existingApp.status === "pending" ? "待审核" : 
                         existingApp.status === "approved" ? "已通过" : 
                         existingApp.status === "rejected" ? "已拒绝" : existingApp.status;
      return NextResponse.json(
        { 
          success: false, 
          error: `您已提交过该宠物的领养申请（当前状态：${statusText}）` ,
          existingApplication: existingApp
        },
        { status: 400 }
      );
    }

    // Insert the application
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
