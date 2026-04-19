'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

export default function DonatePage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const presetAmounts = [
    { value: 10, label: '10元' },
    { value: 50, label: '50元' },
    { value: 100, label: '100元' },
    { value: 200, label: '200元' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 获取捐赠金额
    const donateAmount = amount === 'custom' ? customAmount : amount;
    
    if (!donateAmount || parseFloat(donateAmount) <= 0) {
      setError('请选择或输入捐赠金额');
      return;
    }

    if (!user) {
      setError('请先登录');
      return;
    }

    setLoading(true);

    try {
      // 创建支付订单
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outTradeNo: `DONATE_${Date.now()}_${user.id}`,
          totalAmount: donateAmount,
          subject: '爱心捐赠 - PawFinder',
          body: message || '感谢您的爱心捐赠',
          type: 'donation',
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success && data.data.form) {
        // 创建隐藏的form自动提交
        const form = document.createElement('div');
        form.innerHTML = data.data.form;
        document.body.appendChild(form);
        const payForm = form.querySelector('form') as HTMLFormElement;
        if (payForm) {
          payForm.submit();
        }
      } else {
        setError(data.error || '支付创建失败');
      }
    } catch (err) {
      console.error('捐赠失败:', err);
      setError('捐赠失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">爱心捐赠</h1>
          <p className="text-gray-600">每一份善意都将帮助更多流浪宠物找到温暖的家</p>
        </div>

        {/* 捐赠卡片 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            {/* 选择金额 */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">选择捐赠金额</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {presetAmounts.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setAmount(item.value.toString())}
                    className={`py-3 px-4 rounded-xl border-2 transition-all ${
                      amount === item.value.toString() && amount !== 'custom'
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 hover:border-orange-200 text-gray-700'
                    }`}
                  >
                    <span className="font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
              
              {/* 自定义金额 */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setAmount('custom')}
                  className={`w-full py-3 px-4 rounded-xl border-2 transition-all ${
                    amount === 'custom'
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-200 hover:border-orange-200 text-gray-700'
                  }`}
                >
                  自定义金额
                </button>
                
                {amount === 'custom' && (
                  <div className="mt-3 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">¥</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="请输入金额"
                      min="1"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border-2 border-orange-500 rounded-xl focus:outline-none focus:border-orange-600"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 捐赠留言 */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3">
                捐赠留言 <span className="text-gray-400 text-sm">(可选)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="写下您想对毛孩子们说的话..."
                rows={3}
                maxLength={200}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none"
              />
              <p className="text-right text-gray-400 text-sm mt-1">{message.length}/200</p>
            </div>

            {/* 捐赠说明 */}
            <div className="bg-orange-50 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-orange-800 mb-2">捐赠说明</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  所有捐赠将用于流浪宠物的救助和照护
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  您的爱心将帮助更多宠物找到温暖的家
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  捐赠完成后可查看捐赠记录
                </li>
              </ul>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading || !amount || (amount === 'custom' && !customAmount)}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                loading || !amount || (amount === 'custom' && !customAmount)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  正在跳转支付...
                </span>
              ) : (
                `立即捐赠 ${amount === 'custom' && customAmount ? `¥${customAmount}` : amount ? `¥${amount}` : ''}`
              )}
            </button>
          </form>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-gray-400 text-sm mt-6">
          支付由支付宝提供支持，交易安全有保障
        </p>
      </div>
    </div>
  );
}
