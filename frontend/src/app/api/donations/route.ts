import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";

// 获取捐赠项目列表
export async function GET(request: NextRequest) {
  try {
    const client = getSupabaseClient();
    
    const { data: campaigns, error } = await client
      .from("donation_campaigns")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch campaigns: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      campaigns: campaigns || [],
    });
  } catch (error) {
    console.error("Get campaigns error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 创建捐赠
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
    const { campaign_id, type, amount, goods_detail, goods_address } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Donation type is required" },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();

    // 如果是资金捐赠，更新项目金额
    if (type === "money" && campaign_id && amount) {
      const { data: campaign } = await client
        .from("donation_campaigns")
        .select("current_amount")
        .eq("id", campaign_id)
        .maybeSingle();

      if (campaign) {
        const newAmount = parseFloat(campaign.current_amount || "0") + parseFloat(amount);
        await client
          .from("donation_campaigns")
          .update({ current_amount: newAmount.toString() })
          .eq("id", campaign_id);
      }
    }

    // 创建捐赠记录
    const { data: donation, error } = await client
      .from("donations")
      .insert({
        campaign_id,
        user_id: userId,
        type,
        amount: amount || null,
        goods_detail: goods_detail || null,
        goods_address: goods_address || null,
        status: "completed",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create donation: ${error.message}`);
    }

    // 如果用户没有 donor 角色，更新为 donor
    const { data: user } = await client
      .from("users")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (user && user.role === "user") {
      await client
        .from("users")
        .update({ role: "donor" })
        .eq("id", userId);
    }

    return NextResponse.json({
      success: true,
      donation,
    });
  } catch (error) {
    console.error("Create donation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
