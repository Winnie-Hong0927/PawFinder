import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = getSupabaseClient();

    // 获取宠物信息
    const { data: pet, error: petError } = await client
      .from("pets")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (petError) {
      throw new Error(`Failed to fetch pet: ${petError.message}`);
    }

    if (!pet) {
      return NextResponse.json(
        { error: "Pet not found" },
        { status: 404 }
      );
    }

    // 获取申请人数和机构名称
    const [appCountResult, institutionResult] = await Promise.all([
      client
        .from("adoption_applications")
        .select("*", { count: "exact", head: true })
        .eq("pet_id", id),
      pet.institution_id
        ? client
            .from("institutions")
            .select("name")
            .eq("id", pet.institution_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    const institutionName = institutionResult?.data?.name || null;

    return NextResponse.json({
      success: true,
      pet: { ...pet, institution_name: institutionName },
      application_count: appCountResult.count || 0,
    });
  } catch (error) {
    console.error("Get pet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id } = await params;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = getSupabaseClient();
    
    // 检查是否为管理员
    const { data: admin } = await client
      .from("users")
      .select("role, institution_id")
      .eq("id", userId)
      .maybeSingle();

    // 允许 sysadmin 或 institution_admin 更新宠物
    if (!admin || (admin.role !== "admin" && admin.role !== "institution_admin" && admin.role !== "sysadmin")) {
      return NextResponse.json(
        { error: "权限不足，只有管理员可以修改宠物" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // 如果是机构管理员，只能修改本机构的宠物
    if (admin.role === "institution_admin") {
      const { data: existingPet } = await client
        .from("pets")
        .select("institution_id")
        .eq("id", id)
        .maybeSingle();
      
      if (!existingPet || existingPet.institution_id !== admin.institution_id) {
        return NextResponse.json(
          { error: "只能修改本机构的宠物" },
          { status: 403 }
        );
      }
    }

    const { data, error } = await client
      .from("pets")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update pet: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      pet: data,
    });
  } catch (error) {
    console.error("Update pet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { id } = await params;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = getSupabaseClient();
    
    // 检查是否为管理员
    const { data: admin } = await client
      .from("users")
      .select("role, institution_id")
      .eq("id", userId)
      .maybeSingle();

    // 允许 sysadmin 或 institution_admin 删除宠物
    if (!admin || (admin.role !== "admin" && admin.role !== "institution_admin" && admin.role !== "sysadmin")) {
      return NextResponse.json(
        { error: "权限不足，只有管理员可以删除宠物" },
        { status: 403 }
      );
    }

    // 如果是机构管理员，只能删除本机构的宠物
    if (admin.role === "institution_admin") {
      const { data: existingPet } = await client
        .from("pets")
        .select("institution_id")
        .eq("id", id)
        .maybeSingle();
      
      if (!existingPet || existingPet.institution_id !== admin.institution_id) {
        return NextResponse.json(
          { error: "只能删除本机构的宠物" },
          { status: 403 }
        );
      }
    }

    const { error } = await client
      .from("pets")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete pet: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete pet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


