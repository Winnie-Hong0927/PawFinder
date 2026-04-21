import { NextRequest, NextResponse } from "next/server";
import { GATEWAY_BASE_URL } from "@/lib/api-config";

// 获取机构管理员申请列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const institution_id = searchParams.get("institution_id");

    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (institution_id) params.append("institution_id", institution_id);

    const response = await fetch(`${GATEWAY_BASE_URL}/api/user/v1/institution-admin-requests?${params.toString()}`);
    const result = await response.json();

    if (result.code !== 200) {
      return NextResponse.json({
        success: false,
        error: result.message || "获取申请列表失败"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      requests: result.data || [],
    });
  } catch (error: any) {
    console.error("Get admin requests error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取申请列表失败" },
      { status: 500 }
    );
  }
}

// 创建机构管理员申请
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { institution_id, email, phone, name, id_card_number, id_card_front_url, id_card_back_url } = body;

    if (!institution_id || !email || !phone || !name) {
      return NextResponse.json(
        { success: false, error: "请填写完整信息" },
        { status: 400 }
      );
    }

    const response = await fetch(`${GATEWAY_BASE_URL}/api/user/v1/institution-admin-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        institution_id,
        email,
        phone,
        name,
        id_card_number,
        id_card_front_url,
        id_card_back_url
      })
    });

    const result = await response.json();

    if (result.code !== 200) {
      return NextResponse.json({
        success: false,
        error: result.message || "创建申请失败"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      request: result.data
    });
  } catch (error: any) {
    console.error("Create admin request error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "创建申请失败" },
      { status: 500 }
    );
  }
}
