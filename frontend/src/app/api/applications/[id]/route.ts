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
 * GET /api/applications/[id] - 获取申请详情
 * 前端代理层，转发到后端领养服务 GET /api/adoption/v1/applications/{id}
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await requestBackend<{
      code: number;
      message: string;
      data: any;
    }>(API_ENDPOINTS.applicationById(id), { method: 'GET' }, request);

    // 后端返回格式: { code: 200, message: 'success', data: {...} }
    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '获取申请详情失败' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application: result.data,
    });
  } catch (error: any) {
    console.error("Get application proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取申请详情失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/applications/[id] - 审核申请 / 取消申请
 * 前端代理层，转发到后端领养服务
 * 
 * 审核: POST /api/adoption/v1/applications/{id}/review
 * 取消: POST /api/adoption/v1/applications/cancel/{id}
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // 取消申请
    if (body.action === 'cancel') {
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
    
    // 审核申请
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
      { success: false, error: error.message || "操作失败" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/applications/[id] - 审核申请
 * 兼容前端旧的调用方式
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, admin_notes } = body;

    // 调用后端审核API
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
