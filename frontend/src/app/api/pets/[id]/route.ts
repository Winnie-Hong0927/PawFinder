import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = getSupabaseClient();

    const { data: pet, error } = await client
      .from("pets")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch pet: ${error.message}`);
    }

    if (!pet) {
      return NextResponse.json(
        { error: "Pet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pet,
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
    const { id } = await params;
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
        { error: "Only admins can update pets" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
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
    const { id } = await params;
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
        { error: "Only admins can delete pets" },
        { status: 403 }
      );
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
