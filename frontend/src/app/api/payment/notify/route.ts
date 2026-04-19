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

// 支付异步回调通知
export async function POST(request: NextRequest) {
  try {
    // 获取POST请求体
    const body = await request.formData();
    const params: Record<string, string> = {};
    
    body.forEach((value, key) => {
      params[key] = value.toString();
    });

    console.log('收到支付宝回调:', params);

    // 验签
    const signResult = await alipay.checkNotifySign(params);
    
    if (!signResult) {
      console.error('验签失败');
      return NextResponse.text('fail');
    }

    // 获取交易状态
    const tradeStatus = params.trade_status;
    const outTradeNo = params.out_trade_no;
    const tradeNo = params.trade_no;
    const totalAmount = params.total_amount;
    const businessParams = params.business_params;

    console.log(`交易状态: ${tradeStatus}, 商户订单号: ${outTradeNo}`);

    // 解析业务扩展参数
    let businessData = {
      type: '',
      petId: '',
      userId: '',
    };
    
    try {
      if (businessParams) {
        businessData = JSON.parse(businessParams);
      }
    } catch (e) {
      console.error('解析业务参数失败:', e);
    }

    // 根据交易状态处理
    if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
      // 支付成功
      // 这里可以更新数据库中的订单状态
      // 根据 type 判断是领养费用还是捐赠
      // 如果是领养费用，还需要更新领养申请状态
      
      console.log(`支付成功 - 类型: ${businessData.type}, 金额: ${totalAmount}`);
      
      // TODO: 更新数据库
      // 1. 创建支付记录
      // 2. 如果是领养费用，更新领养申请状态为已支付
      // 3. 如果是捐赠，创建捐赠记录

      return NextResponse.text('success');
    }

    return NextResponse.text('fail');

  } catch (error) {
    console.error('处理回调失败:', error);
    return NextResponse.text('fail');
  }
}

// 允许GET请求用于验证
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: '支付回调验证端点',
    status: 'ok',
  });
}
