import { NextRequest, NextResponse } from 'next/server';
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
 * POST /api/payment - 创建支付
 * 前端代理层，转发到后端支付服务 POST /api/payment/v1/create
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { success: false, error: '订单ID和金额不能为空' },
        { status: 400 }
      );
    }

    const result = await requestBackend<{
      code: number;
      message: string;
      data: { payForm: string };
    }>(API_ENDPOINTS.createPayment, {
      method: 'POST',
      body: JSON.stringify({ orderId, amount }),
    }, request);

    if (result.code !== 200) {
      return NextResponse.json(
        { success: false, error: result.message || '创建支付失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      payForm: result.data.payForm,
    });
  } catch (error: any) {
    console.error("Create payment proxy error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "创建支付失败" },
      { status: 500 }
    );
  }
}
