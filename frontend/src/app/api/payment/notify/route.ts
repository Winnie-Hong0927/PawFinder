import { NextRequest, NextResponse } from 'next/server';
import { API_ENDPOINTS } from '@/lib/api-config';

/**
 * POST /api/payment/notify - 支付回调
 * 前端代理层，转发到后端支付服务 POST /api/payment/v1/callback
 * 
 * 注意：实际生产环境中，支付宝直接回调后端服务，不经过前端代理
 */
export async function POST(request: NextRequest) {
  try {
    // 获取表单数据
    const formData = await request.formData();
    const params: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    console.log('收到支付宝回调:', params);

    // 转发到后端支付服务
    const formBody = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      formBody.append(key, value);
    });

    const response = await fetch(API_ENDPOINTS.paymentCallback, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    });

    const result = await response.text();
    
    return new NextResponse(result, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error: any) {
    console.error("Payment notify proxy error:", error);
    return new NextResponse('fail', {
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
