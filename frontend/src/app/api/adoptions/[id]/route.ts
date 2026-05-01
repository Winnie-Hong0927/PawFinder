import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from '@/lib/api-config';

/**
 * 通用后端请求方法
 */
async function requestBackend<T>(
  url: string,
  options: RequestInit = {},
  request: NextRequest
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 如果前端有token，也传递
  const cookieHeader = request.headers.get("cookie") || "";
  if (cookieHeader.includes('token=')) {
    const match = cookieHeader.match(/token=([^;]+)/);
    if (match) {
      headers['Authorization'] = `Bearer ${match[1]}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response.json();
}

/**
 * PUT /api/adoptions/[id] - 审核申请
 * 前端代理层，转发到后端领养服务 POST /api/adoption/v1/applications/{id}/review
 * 
 * 注意：后端审核接口是 POST 而不是 PUT
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, admin_notes } = body;

    const result = await requestBackend<{
      code: number;
      message: string;
      data: any;
    }>(API_ENDPOINTS.reviewApplication(id), {
      method: 'POST',
      body: JSON.stringify({
        status,
        adminNotes: admin_notes,
      }),
    }, request);

    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '审核失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message || '审核成功',
      application: result.data,
    });
  } catch (error: any) {
    console.error("Review application proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "审核失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/adoptions/[id] - 取消申请
 * 前端代理层，转发到后端领养服务 POST /api/adoption/v1/applications/cancel/{id}
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 取消申请
    if (body.action === 'cancel' || !body.action) {
      const result = await requestBackend<{
        code: number;
        message: string;
      }>(API_ENDPOINTS.cancelApplication(id), {
        method: 'POST',
      }, request);

      if (result.code !== 200) {
        return NextResponse.json(
          { success: false, error: result.message || '取消申请失败' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: result.message || '申请已取消',
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Cancel application proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "操作失败" },
      { status: 500 }
    );
  }
}
