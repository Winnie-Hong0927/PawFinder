'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Heart, Gift, Users, Award } from 'lucide-react';

export default function DonatePage() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDonate = async () => {
    if (!user) {
      alert('请先登录');
      return;
    }

    setLoading(true);
    
    // 模拟捐赠流程
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-emerald-500 fill-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">感谢您的爱心！</h2>
            <p className="text-gray-600 mb-6">
              您的每一份捐赠都将帮助更多流浪宠物找到温暖的家。
            </p>
            {message && (
              <div className="bg-orange-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-orange-700">您的留言：</p>
                <p className="text-gray-700 mt-1">{message}</p>
              </div>
            )}
            <button
              onClick={() => {
                setSuccess(false);
                setMessage('');
              }}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              返回继续捐赠
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* 标题 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">爱心捐赠</h1>
          <p className="text-gray-600 text-lg">每一份善意都将帮助更多流浪宠物找到温暖的家</p>
        </div>

        {/* 捐赠方式说明 */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Gift className="w-7 h-7 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">物资捐赠</h3>
            <p className="text-gray-600 mb-4">您可以捐赠宠物食品、玩具、窝垫等物资，帮助改善流浪宠物的生活条件。</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>狗粮 / 猫粮</li>
              <li>宠物窝垫</li>
              <li>玩具零食</li>
              <li>清洁用品</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">资金捐赠</h3>
            <p className="text-gray-600 mb-4">您的捐款将用于流浪宠物的医疗、绝育、领养推广等用途。</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>医疗救治费用</li>
              <li>疫苗绝育手术</li>
              <li>领养活动推广</li>
              <li>基地日常运营</li>
            </ul>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            捐赠联系方式
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm mb-1">物资捐赠地址</p>
              <p className="text-gray-800">北京市朝阳区爱心路88号</p>
              <p className="text-gray-600 text-sm">爱心宠物救助中心 收</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">咨询电话</p>
              <p className="text-gray-800">400-123-4567</p>
              <p className="text-gray-600 text-sm">工作日 9:00-18:00</p>
            </div>
          </div>
        </div>

        {/* 留言 */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">写给毛孩子们的话</h3>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="写下您想对毛孩子们说的话，我们会转达您的爱心..."
            rows={4}
            maxLength={200}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none text-gray-800 placeholder-gray-400"
          />
          <p className="text-right text-gray-400 text-sm mt-2">{message.length}/200</p>

          <button
            onClick={handleDonate}
            disabled={loading}
            className={`w-full mt-4 py-4 rounded-xl font-semibold text-lg transition-all ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? '感谢您的爱心...' : '提交爱心留言'}
          </button>
        </div>

        {/* 爱心榜 */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" />
            爱心榜单
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥇</span>
                <span className="text-gray-800">李***</span>
              </div>
              <span className="text-orange-500 font-medium">¥500</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥈</span>
                <span className="text-gray-800">王***</span>
              </div>
              <span className="text-orange-500 font-medium">¥300</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🥉</span>
                <span className="text-gray-800">张***</span>
              </div>
              <span className="text-orange-500 font-medium">¥200</span>
            </div>
            <div className="flex items-center justify-between py-2 text-gray-500 text-sm">
              <span>还有很多默默奉献的爱心人士...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
