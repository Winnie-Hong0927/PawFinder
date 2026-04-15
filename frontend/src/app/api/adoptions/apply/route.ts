import { NextRequest, NextResponse } from "next/server";

// In-memory store for demo
const applications: Record<string, any>[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { petId, reason, idCard, livingCondition, experience } = body;

    // Get user from header (simplified auth)
    const authHeader = request.headers.get("Authorization");
    let userId = "demo-user";
    
    if (authHeader) {
      try {
        const token = Buffer.from(authHeader.replace("Bearer ", ""), "base64").toString();
        userId = token.split(":")[0] || "demo-user";
      } catch {
        // Use default
      }
    }

    if (!petId) {
      return NextResponse.json({
        success: false,
        error: "缺少宠物ID",
      });
    }

    if (!reason) {
      return NextResponse.json({
        success: false,
        error: "请填写领养理由",
      });
    }

    if (!idCard || idCard.length !== 18) {
      return NextResponse.json({
        success: false,
        error: "请输入正确的18位身份证号",
      });
    }

    // Create application
    const application = {
      id: Date.now().toString(),
      userId,
      petId,
      reason,
      idCard,
      livingCondition: livingCondition || "",
      experience: experience || "",
      status: "pending",
      created_at: new Date().toISOString(),
    };

    applications.push(application);

    console.log(`[Adoption] New application for pet ${petId} by user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "申请已提交",
      applicationId: application.id,
    });
  } catch (error) {
    console.error("Submit adoption error:", error);
    return NextResponse.json({
      success: false,
      error: "提交失败，请稍后重试",
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const petId = searchParams.get("petId");
    const status = searchParams.get("status");

    let result = [...applications];

    if (userId) {
      result = result.filter((app) => app.userId === userId);
    }
    if (petId) {
      result = result.filter((app) => app.petId === petId);
    }
    if (status) {
      result = result.filter((app) => app.status === status);
    }

    return NextResponse.json({
      success: true,
      applications: result,
    });
  } catch (error) {
    console.error("Get applications error:", error);
    return NextResponse.json({
      success: false,
      error: "获取申请列表失败",
    });
  }
}
