import { NextRequest, NextResponse } from 'next/server';
import AlipaySdk from 'alipay-sdk';

// 初始化支付宝SDK
const alipay = new AlipaySdk({
  appId: process.env.ALIPAY_APP_ID || '2021000000000000',
  privateKey: process.env.ALIPAY_PRIVATE_KEY || '',
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY || '',
  gateway: process.env.ALIPAY_GATEWAY || 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',
  signType: 'RSA2',
});

// 查询订单状态
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const outTradeNo = searchParams.get('outTradeNo');

    if (!outTradeNo) {
      return NextResponse.json({
        success: false,
        error: '缺少订单号',
      }, { status: 400 });
    }

    // 调用支付宝查询接口
    const result = await alipay.exec('alipay.trade.query', {}, {
      bizContent: {
        outTradeNo,
      },
    });

    // 解析响应
    const response = result as any;
    
    if (response.code === '10000') {
      return NextResponse.json({
        success: true,
        data: {
          outTradeNo: response.outTradeNo,
          tradeNo: response.tradeNo,
          tradeStatus: response.tradeStatus,
          totalAmount: response.totalAmount,
          buyerLogonId: response.buyerLogonId,
          payTime: response.payTime,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        error: response.subMsg || '查询失败',
        code: response.code,
      }, { status: 400 });
    }

  } catch (error) {
    console.error('订单查询失败:', error);
    return NextResponse.json({
      success: false,
      error: '订单查询失败',
    }, { status: 500 });
  }
}
