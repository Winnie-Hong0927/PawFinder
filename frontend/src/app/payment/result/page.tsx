'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'fail'>('loading');
  const [orderInfo, setOrderInfo] = useState<{
    outTradeNo: string;
    totalAmount: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    // 从URL参数获取支付结果
    const outTradeNo = searchParams.get('outTradeNo');
    const totalAmount = searchParams.get('totalAmount');
    const result = searchParams.get('result');

    if (outTradeNo && totalAmount) {
      setOrderInfo({
        outTradeNo,
        totalAmount,
        type: searchParams.get('type') || 'adoption',
      });
    }

    // 判断支付结果
    // 注意：同步返回结果不可靠，实际结果应以异步通知为准
    if (result === 'success') {
      setStatus('success');
    } else if (result === 'fail') {
      setStatus('fail');
    } else {
      // 如果没有明确的结果参数，查询订单状态
      if (outTradeNo) {
        queryOrderStatus(outTradeNo);
      } else {
        setStatus('fail');
      }
    }
  }, [searchParams]);

  // 查询订单状态
  const queryOrderStatus = async (outTradeNo: string) => {
    try {
      const response = await fetch(`/api/payment/query?outTradeNo=${outTradeNo}`);
      const data = await response.json();

      if (data.success && data.data.tradeStatus === 'WAIT_BUYER_PAY') {
        // 等待支付
        setStatus('loading');
      } else if (data.success && data.data.tradeStatus === 'TRADE_SUCCESS') {
        // 支付成功
        setStatus('success');
      } else if (data.success && data.data.tradeStatus === 'TRADE_CLOSED') {
        // 交易关闭
        setStatus('fail');
      } else {
        // 其他情况认为失败
        setStatus('fail');
      }
    } catch (error) {
      console.error('查询订单状态失败:', error);
      setStatus('fail');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">支付结果确认中...</h1>
            <p className="text-gray-500">请稍候，正在确认您的支付结果</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">支付成功！</h1>
            <p className="text-gray-500 mb-4">感谢您的{orderInfo?.type === 'donation' ? '爱心捐赠' : '领养支持'}！</p>
            
            {orderInfo && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">订单号：{orderInfo.outTradeNo}</p>
                <p className="text-lg font-semibold text-gray-800 mt-2">
                  支付金额：<span className="text-green-500">¥{orderInfo.totalAmount}</span>
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                返回首页
              </Link>
              <Link
                href="/profile"
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                查看订单
              </Link>
            </div>
          </>
        )}

        {status === 'fail' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">支付失败</h1>
            <p className="text-gray-500 mb-4">很抱歉，您的支付未能完成</p>
            
            {orderInfo && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">订单号：{orderInfo.outTradeNo}</p>
                <p className="text-lg font-semibold text-gray-800 mt-2">
                  订单金额：¥{orderInfo.totalAmount}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                返回首页
              </Link>
              <Link
                href="/pets"
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                重新支付
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
