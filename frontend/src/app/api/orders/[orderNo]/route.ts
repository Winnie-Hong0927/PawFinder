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
 * GET /api/orders/[orderNo] - 获取订单详情
 * 前端代理层，转发到后端订单服务 GET /api/order/v1/orders/{orderNo}
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  try {
    const { orderNo } = await params;

    const result = await requestBackend<{
      code: number;
      message: string;
      data: any;
    }>(API_ENDPOINTS.orderByOrderNo(orderNo), { method: 'GET' }, request);

    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '获取订单详情失败' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: result.data,
    });
  } catch (error: any) {
    console.error("Get order proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "获取订单详情失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders/[orderNo] - 取消订单
 * 前端代理层，转发到后端订单服务 POST /api/order/v1/orders/{orderNo}/cancel
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  try {
    const { orderNo } = await params;
    const body = await request.json();

    // 取消订单
    if (body.action === 'cancel') {
      const result = await requestBackend<{
        code: number;
        message: string;
      }>(API_ENDPOINTS.cancelOrder(orderNo), {
        method: 'POST',
      }, request);

      if (result.code !== 200) {
        return NextResponse.json(
          { success: false, error: result.message || '取消订单失败' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: result.message || '订单已取消',
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Cancel order proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "取消订单失败" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/orders/[orderNo] - 取消订单
 * 兼容前端旧的调用方式
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  try {
    const { orderNo } = await params;

    const result = await requestBackend<{
      code: number;
      message: string;
    }>(API_ENDPOINTS.cancelOrder(orderNo), {
      method: 'POST',
    }, request);

    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '取消订单失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message || '订单已取消',
    });
  } catch (error: any) {
    console.error("Cancel order proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "取消订单失败" },
      { status: 500 }
    );
  }
}
