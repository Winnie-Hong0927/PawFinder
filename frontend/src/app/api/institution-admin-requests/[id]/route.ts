import { NextRequest, NextResponse } from "next/server";
import { GATEWAY_BASE_URL } from "@/lib/api-config";

// 获取机构管理员申请详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await fetch(`${GATEWAY_BASE_URL}/api/user/v1/institution-admin-requests/${id}`);
    const result = await response.json();

    if (result.code !== 200) {
      return NextResponse.json({
        success: false,
        error: result.message || "获取申请详情失败"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      request: result.data,
    });
  } catch (error: any) {
    console.error("Get admin request error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取申请详情失败" },
      { status: 500 }
    );
  }
}

// 审核机构管理员申请
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, reviewed_by, rejection_reason } = body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "无效的状态" },
        { status: 400 }
      );
    }

    const response = await fetch(`${GATEWAY_BASE_URL}/api/user/v1/institution-admin-requests/${id}/review`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status,
        reviewed_by,
        rejection_reason
      })
    });

    const result = await response.json();

    if (result.code !== 200) {
      return NextResponse.json({
        success: false,
        error: result.message || "审核失败"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      request: result.data
    });
  } catch (error: any) {
    console.error("Review admin request error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "审核失败" },
      { status: 500 }
    );
  }
}
