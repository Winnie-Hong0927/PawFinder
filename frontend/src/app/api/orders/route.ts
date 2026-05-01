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
 * GET /api/orders - 获取用户订单列表
 * 前端代理层，转发到后端订单服务 GET /api/order/v1/orders
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "10";
    const all = searchParams.get("all");

    let backendUrl: string;
    
    // 管理员查看所有订单
    if (all === 'true') {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('size', size);
      backendUrl = `${API_ENDPOINTS.allOrders}?${params.toString()}`;
    } else {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('size', size);
      backendUrl = `${API_ENDPOINTS.orders}?${params.toString()}`;
    }

    const result = await requestBackend<{
      code: number;
      message: string;
      data: { records: any[]; total: number; current: number; size: number };
    }>(backendUrl, { method: 'GET' }, request);

    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '获取订单列表失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: result.data.records,
      total: result.data.total,
      page: result.data.current,
      size: result.data.size,
    });
  } catch (error: any) {
    console.error("Get orders proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取订单列表失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders - 创建订单
 * 前端代理层，转发到后端订单服务 POST /api/order/v1/orders
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, petId, amount, description } = body;

    if (!applicationId || !petId || !amount) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const result = await requestBackend<{
      code: number;
      message: string;
      data: any;
    }>(API_ENDPOINTS.orders, {
      method: 'POST',
      body: JSON.stringify({ applicationId, petId, amount, description }),
    }, request);

    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '创建订单失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message || '创建成功',
      order: result.data,
    });
  } catch (error: any) {
    console.error("Create order proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "创建订单失败" },
      { status: 500 }
    );
  }
}
