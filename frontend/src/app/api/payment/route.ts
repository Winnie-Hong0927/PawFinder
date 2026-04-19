import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 支付宝配置
const ALIPAY_CONFIG = {
  appId: process.env.ALIPAY_APP_ID || '',
  privateKey: formatPrivateKey(process.env.ALIPAY_PRIVATE_KEY || ''),
  alipayPublicKey: formatPublicKey(process.env.ALIPAY_PUBLIC_KEY || ''),
  gateway: process.env.ALIPAY_GATEWAY || 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',
  returnUrl: process.env.ALIPAY_RETURN_URL || 'http://localhost:5000',
};

// 格式化私钥（添加PEM头尾如果缺失）
function formatPrivateKey(key: string): string {
  if (!key) return '';
  if (key.includes('-----BEGIN')) return key;
  return `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`;
}

// 格式化公钥（添加PEM头尾如果缺失）
function formatPublicKey(key: string): string {
  if (!key) return '';
  if (key.includes('-----BEGIN')) return key;
  return `-----BEGIN PUBLIC KEY-----\n${key}\n-----END PUBLIC KEY-----`;
}

// RSA2签名函数
function sign(params: Record<string, string>): string | null {
  if (!ALIPAY_CONFIG.privateKey) {
    console.log('Missing private key');
    return null;
  }
  
  try {
    const signString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signString);
    return sign.sign(ALIPAY_CONFIG.privateKey, 'base64');
  } catch (error) {
    console.error('签名失败:', error);
    return null;
  }
}

// 验证签名
function verifySign(params: Record<string, string>): boolean {
  const signStr = params.sign;
  if (!signStr || !ALIPAY_CONFIG.alipayPublicKey) {
    return false;
  }
  
  try {
    delete params.sign;
    const verifyString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(verifyString);
    return verify.verify(ALIPAY_CONFIG.alipayPublicKey, signStr, 'base64');
  } catch (error) {
    console.error('验签失败:', error);
    return false;
  }
}

// 创建支付订单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      outTradeNo,        // 商户订单号
      totalAmount,       // 订单金额
      subject,           // 订单标题
      body: orderBody,   // 订单描述
      type,              // 支付类型: adoption(领养) / donation(捐赠)
      petId,             // 宠物ID（领养时）
      userId,            // 用户ID
    } = body;

    // 验证必要参数
    if (!outTradeNo || !totalAmount || !subject) {
      return NextResponse.json({
        success: false,
        error: '缺少必要参数',
      }, { status: 400 });
    }

    // 构建业务扩展参数
    const businessParams = JSON.stringify({
      type,
      petId,
      userId,
    });

    // 构建请求参数
    const params: Record<string, string> = {
      app_id: ALIPAY_CONFIG.appId,
      method: 'alipay.trade.wap.pay',
      format: 'JSON',
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      version: '1.0',
      biz_content: JSON.stringify({
        out_trade_no: outTradeNo,
        total_amount: String(totalAmount),
        subject,
        body: orderBody || subject,
        product_code: 'QUICK_WAP_WAY',
        quit_url: ALIPAY_CONFIG.returnUrl,
        passback_params: encodeURIComponent(businessParams),
      }),
    };

    // 添加签名
    const signature = sign(params);
    if (!signature) {
      return NextResponse.json({
        success: false,
        error: '签名失败，请检查配置',
      }, { status: 500 });
    }
    params.sign = signature;

    // 构建表单
    const formHtml = `
      <form id="alipayForm" action="${ALIPAY_CONFIG.gateway}" method="post">
        ${Object.keys(params).map(key => 
          `<input type="hidden" name="${key}" value="${params[key].replace(/"/g, '&quot;')}" />`
        ).join('')}
      </form>
      <script>document.getElementById('alipayForm').submit();</script>
    `;

    // 返回支付表单
    return NextResponse.json({
      success: true,
      data: {
        form: formHtml,
        outTradeNo,
      },
    });

  } catch (error) {
    console.error('支付创建失败:', error);
    return NextResponse.json({
      success: false,
      error: '支付创建失败',
    }, { status: 500 });
  }
}

// 获取支付链接（用于重定向）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const outTradeNo = searchParams.get('outTradeNo') || `ORDER_${Date.now()}`;
    const totalAmount = searchParams.get('totalAmount') || '0.01';
    const subject = searchParams.get('subject') || '支付';
    const type = searchParams.get('type') || 'donate';
    const petId = searchParams.get('petId');
    const userId = searchParams.get('userId');

    // 构建业务扩展参数
    const businessParams = JSON.stringify({
      type,
      petId,
      userId,
    });

    // 构建请求参数
    const params: Record<string, string> = {
      app_id: ALIPAY_CONFIG.appId,
      method: 'alipay.trade.wap.pay',
      format: 'JSON',
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14),
      version: '1.0',
      biz_content: JSON.stringify({
        out_trade_no: outTradeNo,
        total_amount: totalAmount,
        subject,
        body: subject,
        product_code: 'QUICK_WAP_WAY',
        quit_url: ALIPAY_CONFIG.returnUrl,
        passback_params: encodeURIComponent(businessParams),
      }),
    };

    // 添加签名
    const signature = sign(params);
    if (!signature) {
      return NextResponse.json({
        success: false,
        error: '签名失败，请检查配置',
      }, { status: 500 });
    }
    params.sign = signature;

    // 构建重定向URL
    const redirectUrl = `${ALIPAY_CONFIG.gateway}?${Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')}`;

    return NextResponse.json({
      success: true,
      data: {
        redirectUrl,
        outTradeNo,
      },
    });

  } catch (error) {
    console.error('支付创建失败:', error);
    return NextResponse.json({
      success: false,
      error: '支付创建失败',
    }, { status: 500 });
  }
}
