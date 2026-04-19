import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const species = searchParams.get("species");
    const size = searchParams.get("size");
    const gender = searchParams.get("gender");
    const status = searchParams.get("status") || "available";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const client = getSupabaseClient();
    let query = client
      .from("pets")
      .select("*", { count: "exact" })
      .eq("status", status)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (species) {
      query = query.eq("species", species);
    }
    if (size) {
      query = query.eq("size", size);
    }
    if (gender) {
      query = query.eq("gender", gender);
    }

    const { data: pets, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch pets: ${error.message}`);
    }

    // 如果有宠物且有机构ID，获取机构名称
    let petsWithInstitution = pets || [];
    if (petsWithInstitution.length > 0) {
      const institutionIds = petsWithInstitution
        .map((p: any) => p.institution_id)
        .filter((id: any) => id);
      
      if (institutionIds.length > 0) {
        const { data: institutions } = await client
          .from("institutions")
          .select("id, name")
          .in("id", institutionIds);
        
        const institutionMap = new Map(
          (institutions || []).map((i: any) => [i.id, i.name])
        );
        
        petsWithInstitution = petsWithInstitution.map((p: any) => ({
          ...p,
          institution_name: institutionMap.get(p.institution_id) || null
        }));
      }
    }

    return NextResponse.json({
      success: true,
      pets: petsWithInstitution,
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error("Get pets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 检查是否为管理员
    const client = getSupabaseClient();
    const { data: admin } = await client
      .from("users")
      .select("role, institution_id")
      .eq("id", userId)
      .maybeSingle();

    // 允许 sysadmin 或 institution_admin 创建宠物
    if (!admin || (admin.role !== "admin" && admin.role !== "institution_admin" && admin.role !== "sysadmin")) {
      return NextResponse.json(
        { error: "权限不足，只有管理员可以创建宠物" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // 如果是机构管理员，自动关联机构ID
    if (admin.role === "institution_admin" && admin.institution_id) {
      body.institution_id = admin.institution_id;
    }
    
    const { data, error } = await client
      .from("pets")
      .insert({
        ...body,
        created_by: userId,
        status: body.status || "available",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create pet: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      pet: data,
    });
  } catch (error) {
    console.error("Create pet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
