import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("adoption_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    // Fetch related data
    let pet = null;
    let user = null;

    if (data.pet_id) {
      const petRes = await supabase
        .from("pets")
        .select("*, institutions(name)")
        .eq("id", data.pet_id)
        .single();
      pet = petRes.data;
    }

    if (data.user_id) {
      const userRes = await supabase
        .from("users")
        .select("id, name, email, phone")
        .eq("id", data.user_id)
        .single();
      user = userRes.data;
    }

    const enrichedApplication = {
      ...data,
      pet,
      user,
    };

    return NextResponse.json({
      success: true,
      application: enrichedApplication,
    });
  } catch (error: any) {
    console.error("Get application error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取申请详情失败" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, admin_notes, reviewed_by } = body;
    const supabase = getSupabaseClient();

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
    }

    if (admin_notes) {
      updateData.admin_notes = admin_notes;
    }

    if (status && ["approved", "rejected"].includes(status)) {
      updateData.reviewed_by = reviewed_by;
      updateData.reviewed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("adoption_applications")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // If approved, update pet status to adopted and create adoption record
    if (status === "approved") {
      const { data: application } = await supabase
        .from("adoption_applications")
        .select("pet_id, user_id")
        .eq("id", id)
        .single();

      if (application) {
        // Update pet status
        await supabase
          .from("pets")
          .update({ status: "adopted" })
          .eq("id", application.pet_id);

        // Create adoption record
        await supabase
          .from("adoptions")
          .insert({
            pet_id: application.pet_id,
            user_id: application.user_id,
            application_id: id,
            status: "active",
          });
      }
    }

    // Fetch related data for the response
    let pet = null;
    let user = null;

    if (data.pet_id) {
      const petRes = await supabase
        .from("pets")
        .select("*, institutions(name)")
        .eq("id", data.pet_id)
        .single();
      pet = petRes.data;
    }

    if (data.user_id) {
      const userRes = await supabase
        .from("users")
        .select("id, name, email, phone")
        .eq("id", data.user_id)
        .single();
      user = userRes.data;
    }

    const enrichedApplication = {
      ...data,
      pet,
      user,
    };

    return NextResponse.json({
      success: true,
      application: enrichedApplication,
    });
  } catch (error: any) {
    console.error("Update application error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "更新申请失败" },
      { status: 500 }
    );
  }
}
