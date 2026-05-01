import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/lib/api-config';

/**
 * GET /api/payment/query - 查询支付状态
 * 前端代理层，转发到后端支付服务 GET /api/payment/v1/status/{transactionNo}
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const transactionNo = searchParams.get('transactionNo') || searchParams.get('outTradeNo');

    if (!transactionNo) {
      return NextResponse.json({
        success: false,
        error: '缺少交易号',
      }, { status: 400 });
    }

    const response = await fetch(API_ENDPOINTS.paymentStatus(transactionNo), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (result.code !== 200) {
      return NextResponse.json({
        success: false,
        error: result.message || '查询支付状态失败',
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    console.error("Query payment status proxy error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "查询支付状态失败",
    }, { status: 500 });
  }
}
