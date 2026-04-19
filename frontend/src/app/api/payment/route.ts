import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 强制使用 OpenSSL 旧版提供程序以兼容 RSA 密钥
process.env.NODE_OPTIONS = (process.env.NODE_OPTIONS || '') + ' --openssl-legacy-provider';

const ALIPAY_APP_ID = process.env.ALIPAY_APP_ID || '';
const ALIPAY_PRIVATE_KEY = process.env.ALIPAY_PRIVATE_KEY || '';
const ALIPAY_PUBLIC_KEY = process.env.ALIPAY_PUBLIC_KEY || '';
const ALIPAY_GATEWAY = process.env.ALIPAY_GATEWAY || 'https://openapi-sandbox.dl.alipaydev.com/gateway.do';

// 格式化私钥
function formatPrivateKey(key: string): string {
  if (!key) return '';
  // 如果已经是 PEM 格式，直接返回
  if (key.includes('-----BEGIN')) return key;
  // 否则包装成 PEM 格式
  return `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`;
}

// 格式化公钥
function formatPublicKey(key: string): string {
  if (!key) return '';
  if (key.includes('-----BEGIN')) return key;
  return `-----BEGIN PUBLIC KEY-----\n${key}\n-----END PUBLIC KEY-----`;
}

// 创建 AlipayFormData 类
class AlipayFormData {
  private fields: Map<string, string> = new Map();
  private files: Map<string, string> = new Map();

  addField(key: string, value: string): void {
    this.fields.set(key, value);
  }

  addFile(key: string, value: string): void {
    this.files.set(key, value);
  }

  getFields(): Map<string, string> {
    return this.fields;
  }

  getFiles(): Map<string, string> {
    return this.files;
  }
}

// 简单的签名函数
function sign(
  params: Record<string, string>,
  privateKey: string,
  signType: string = 'RSA2'
): string {
  const signContent = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== '')
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const sign = crypto.createSign(signType === 'RSA2' ? 'RSA-SHA256' : 'RSA-SHA1');
  sign.update(signContent);
  return sign.sign(privateKey, 'base64');
}

// 验证签名
function verify(
  params: Record<string, string>,
  sign: string,
  publicKey: string,
  signType: string = 'RSA2'
): boolean {
  const signContent = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== '' && key !== 'sign' && key !== 'sign_type')
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const verify = crypto.createVerify(signType === 'RSA2' ? 'RSA-SHA256' : 'RSA-SHA1');
  verify.update(signContent);
  return verify.verify(publicKey, sign, 'base64');
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const outTradeNo = searchParams.get('outTradeNo') || `DONATE${Date.now()}`;
  const totalAmount = searchParams.get('totalAmount') || '10';
  const subject = searchParams.get('subject') || '爱心捐赠';
  const type = searchParams.get('type') || 'donate';

  if (!ALIPAY_APP_ID || !ALIPAY_PRIVATE_KEY) {
    return NextResponse.json(
      { success: false, error: '支付宝配置不完整' },
      { status: 500 }
    );
  }

  try {
    const timestamp = new Date().format('yyyyMMddHHmmss');
    const bizContent: Record<string, string> = {
      out_trade_no: outTradeNo,
      total_amount: totalAmount,
      subject: subject,
      body: subject,
      product_code: 'QUICK_WAP_WAY',
      quit_url: process.env.ALIPAY_RETURN_URL || 'http://localhost:5000',
    };

    const publicParams: Record<string, string> = {
      app_id: ALIPAY_APP_ID,
      method: 'alipay.trade.wap.pay',
      format: 'JSON',
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp,
      version: '1.0',
      biz_content: JSON.stringify(bizContent),
    };

    // 计算签名
    const signStr = sign(publicParams, formatPrivateKey(ALIPAY_PRIVATE_KEY), 'RSA2');
    publicParams.sign = signStr;

    // 构建网关 URL
    const queryString = Object.keys(publicParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(publicParams[key])}`)
      .join('&');

    const redirectUrl = `${ALIPAY_GATEWAY}?${queryString}`;

    return NextResponse.json({
      success: true,
      data: { redirectUrl, outTradeNo },
    });
  } catch (error) {
    console.error('支付宝支付创建失败:', error);
    return NextResponse.json(
      { success: false, error: '支付创建失败' },
      { status: 500 }
    );
  }
}

// POST 请求处理
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { outTradeNo, totalAmount, subject, type } = body;

    const requestData = {
      outTradeNo: outTradeNo || `DONATE${Date.now()}`,
      totalAmount: totalAmount || '10',
      subject: subject || '爱心捐赠',
      type: type || 'donate',
    };

    // 重定向到 GET 请求
    const queryString = new URLSearchParams(requestData).toString();
    return NextResponse.redirect(new URL(`/api/payment?${queryString}`, request.url));
  } catch (error) {
    console.error('支付请求处理失败:', error);
    return NextResponse.json(
      { success: false, error: '支付请求处理失败' },
      { status: 500 }
    );
  }
}

// 时间格式化扩展
declare global {
  interface Date {
    format(format: string): string;
  }
}

if (typeof Date.prototype.format === 'undefined') {
  Date.prototype.format = function(format: string): string {
    const year = this.getFullYear();
    const month = String(this.getMonth() + 1).padStart(2, '0');
    const day = String(this.getDate()).padStart(2, '0');
    const hours = String(this.getHours()).padStart(2, '0');
    const minutes = String(this.getMinutes()).padStart(2, '0');
    const seconds = String(this.getSeconds()).padStart(2, '0');

    return format
      .replace('yyyy', String(year))
      .replace('MM', month)
      .replace('dd', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  };
}
