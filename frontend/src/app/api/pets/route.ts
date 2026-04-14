import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const species = searchParams.get("species");
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

    const { data: pets, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch pets: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      pets: pets || [],
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
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can create pets" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    const { data, error } = await client
      .from("pets")
      .insert({
        ...body,
        created_by: userId,
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
