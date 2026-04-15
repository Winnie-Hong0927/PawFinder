"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Gift, Video, Settings, Bell, LogOut, PawPrint, Calendar, ChevronRight, ChevronDown, FileText, CheckCircle, XCircle, Clock, Shield, User, Lock } from "lucide-react";

interface Adoption {
  id: string;
  pet: {
    name: string;
    species: string;
    images: string[];
  };
  adoption_date: string;
  status: string;
}

interface Donation {
  id: string;
  type: string;
  amount: string;
  created_at: string;
}

interface VideoRecord {
  id: string;
  pet_name: string;
  uploaded_at: string;
  status: string;
}

const mockAdoptions: Adoption[] = [
  {
    id: "1",
    pet: { name: "小白", species: "cat", images: [] },
    adoption_date: "2024-01-15",
    status: "active",
  },
];

const mockDonations: Donation[] = [
  { id: "1", type: "money", amount: "200", created_at: "2024-01-10" },
  { id: "2", type: "goods", amount: "0", created_at: "2024-01-05" },
];

const mockVideos: VideoRecord[] = [
  { id: "1", pet_name: "小白", uploaded_at: "2024-01-20", status: "approved" },
  { id: "2", pet_name: "小白", uploaded_at: "2024-01-27", status: "pending" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user: authUser, logout, isAuthenticated, isLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  // Use auth user or show loading
  const user = authUser || {
    name: "加载中...",
    email: "",
    role: "user" as const,
    avatar_url: "",
    adopter_status: undefined,
    phone: "",
    member_since: "",
  };

  // Settings state
  const [expandedSetting, setExpandedSetting] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
  });
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showDonations: false,
  });

  const tabs = [
    { value: "overview", label: "概览", icon: PawPrint },
    { value: "adoptions", label: "我的领养", icon: Heart },
    { value: "donations", label: "我的捐赠", icon: Gift },
    { value: "videos", label: "宠物视频", icon: Video },
    { value: "settings", label: "设置", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-background">
      {/* Header - 更清晰的配色 */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-10 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-white text-orange-600 text-2xl font-bold">
                {user.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              {/* 用户名 - 白色，高对比度 */}
              <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
              {/* 邮箱 - 浅橙色背景上的白色文字 */}
              <p className="text-white/90 text-sm bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
                {user.email}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-white/25 text-white border-0 backdrop-blur-sm">
                  {user.role === "adopter" ? "已认证领养人" : "普通用户"}
                </Badge>
                {user.adopter_status === "approved" && (
                  <Badge className="bg-green-500 text-white border-0">
                    审核通过
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* 个人信息补充 - 更清晰 */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
              <span className="text-white/70 text-sm">手机号：</span>
              <span className="font-medium">{user.phone}</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
              <span className="text-white/70 text-sm">注册时间：</span>
              <span className="font-medium">{user.member_since}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="sticky top-24 shadow-md">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <Link key={tab.value} href={`#${tab.value}`}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                      </Button>
                    </Link>
                  ))}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    退出登录
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Overview */}
            <section id="overview">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <PawPrint className="w-6 h-6 text-orange-500" />
                概览
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:shadow-lg transition-shadow border-orange-100">
                  <CardContent className="p-6 text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                    <div className="text-3xl font-bold text-gray-800">
                      {mockAdoptions.length}
                    </div>
                    <p className="text-gray-500">我的领养</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-orange-100">
                  <CardContent className="p-6 text-center">
                    <Gift className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                    <div className="text-3xl font-bold text-gray-800">
                      {mockDonations.length}
                    </div>
                    <p className="text-gray-500">我的捐赠</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow border-orange-100">
                  <CardContent className="p-6 text-center">
                    <Video className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-3xl font-bold text-gray-800">
                      {mockVideos.length}
                    </div>
                    <p className="text-gray-500">已上传视频</p>
                  </CardContent>
                </Card>
              </div>

              {/* Next Video Reminder */}
              <Card className="mt-6 bg-amber-50 border-amber-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">视频上传提醒</h3>
                      <p className="text-sm text-gray-600">
                        距离下次上传宠物近况视频还有 5 天
                      </p>
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      立即上传
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Adoptions */}
            <section id="adoptions">
              <Card className="border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Heart className="w-5 h-5 text-orange-500" />
                    我的领养
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockAdoptions.length > 0 ? (
                    <div className="space-y-4">
                      {mockAdoptions.map((adoption) => (
                        <div
                          key={adoption.id}
                          className="flex items-center gap-4 p-4 rounded-lg bg-orange-50 border border-orange-100 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="w-16 h-16 rounded-lg bg-orange-100 flex items-center justify-center text-3xl">
                            🐾
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{adoption.pet.name}</h4>
                            <p className="text-sm text-gray-500">
                              领养日期：{adoption.adoption_date}
                            </p>
                            <Badge className="mt-1 bg-green-100 text-green-700 border-0">
                              领养成功
                            </Badge>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🐾</div>
                      <p>暂无领养记录</p>
                      <Link href="/pets">
                        <Button variant="outline" className="mt-4 border-orange-200 text-orange-600 hover:bg-orange-50">
                          去领养宠物
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Donations */}
            <section id="donations">
              <Card className="border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Gift className="w-5 h-5 text-emerald-500" />
                    我的捐赠
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockDonations.length > 0 ? (
                    <div className="space-y-4">
                      {mockDonations.map((donation) => (
                        <div
                          key={donation.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Gift className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {donation.type === "money" ? "资金捐赠" : "物资捐赠"}
                              </p>
                              <p className="text-sm text-gray-500">{donation.created_at}</p>
                            </div>
                          </div>
                          {donation.type === "money" && (
                            <span className="font-bold text-emerald-600">¥{donation.amount}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🎁</div>
                      <p>暂无捐赠记录</p>
                      <Link href="/donate">
                        <Button variant="outline" className="mt-4 border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                          去捐赠
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Videos */}
            <section id="videos">
              <Card className="border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Video className="w-5 h-5 text-purple-500" />
                    宠物视频
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockVideos.length > 0 ? (
                    <div className="space-y-4">
                      {mockVideos.map((video) => (
                        <div
                          key={video.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-purple-50 border border-purple-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <Video className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{video.pet_name} 的近况</p>
                              <p className="text-sm text-gray-500">{video.uploaded_at}</p>
                            </div>
                          </div>
                          <Badge className={
                            video.status === "approved" 
                              ? "bg-green-100 text-green-700 border-0" 
                              : "bg-yellow-100 text-yellow-700 border-0"
                          }>
                            {video.status === "approved" ? "已审核" : "待审核"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📹</div>
                      <p>暂无视频记录</p>
                      <Button variant="outline" className="mt-4 border-purple-200 text-purple-600 hover:bg-purple-50">
                        上传视频
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Settings */}
            <section id="settings">
              <Card className="border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Settings className="w-5 h-5 text-gray-500" />
                    账户设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 个人信息 */}
                  <div className="rounded-lg bg-gray-50 border border-gray-100 overflow-hidden">
                    <button 
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => setExpandedSetting(expandedSetting === 'profile' ? null : 'profile')}
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700 font-medium">个人信息</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSetting === 'profile' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedSetting === 'profile' && (
                      <div className="p-4 pt-0 border-t border-gray-100 mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name" className="text-gray-600">姓名</Label>
                            <Input 
                              id="name" 
                              value={profileForm.name}
                              onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-gray-600">邮箱</Label>
                            <Input 
                              id="email" 
                              type="email"
                              value={profileForm.email}
                              onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone" className="text-gray-600">手机号</Label>
                            <Input 
                              id="phone" 
                              value={profileForm.phone}
                              onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                            保存修改
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 通知设置 */}
                  <div className="rounded-lg bg-gray-50 border border-gray-100 overflow-hidden">
                    <button 
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => setExpandedSetting(expandedSetting === 'notifications' ? null : 'notifications')}
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700 font-medium">通知设置</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSetting === 'notifications' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedSetting === 'notifications' && (
                      <div className="p-4 pt-0 border-t border-gray-100 mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-700 font-medium">邮件通知</p>
                            <p className="text-sm text-gray-500">接收领养状态变更邮件通知</p>
                          </div>
                          <Switch 
                            checked={notifications.email}
                            onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-700 font-medium">短信通知</p>
                            <p className="text-sm text-gray-500">接收重要消息的短信提醒</p>
                          </div>
                          <Switch 
                            checked={notifications.sms}
                            onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-700 font-medium">推送通知</p>
                            <p className="text-sm text-gray-500">接收浏览器推送通知</p>
                          </div>
                          <Switch 
                            checked={notifications.push}
                            onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 隐私设置 */}
                  <div className="rounded-lg bg-gray-50 border border-gray-100 overflow-hidden">
                    <button 
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => setExpandedSetting(expandedSetting === 'privacy' ? null : 'privacy')}
                    >
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-700 font-medium">隐私设置</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSetting === 'privacy' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedSetting === 'privacy' && (
                      <div className="p-4 pt-0 border-t border-gray-100 mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-700 font-medium">公开个人资料</p>
                            <p className="text-sm text-gray-500">允许其他人查看您的公开资料</p>
                          </div>
                          <Switch 
                            checked={privacy.showProfile}
                            onCheckedChange={(checked) => setPrivacy({...privacy, showProfile: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-700 font-medium">公开捐赠记录</p>
                            <p className="text-sm text-gray-500">在捐赠榜单中显示您的捐赠记录</p>
                          </div>
                          <Switch 
                            checked={privacy.showDonations}
                            onCheckedChange={(checked) => setPrivacy({...privacy, showDonations: checked})}
                          />
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-gray-700 font-medium mb-2">修改密码</p>
                          <div className="space-y-3">
                            <Input type="password" placeholder="当前密码" />
                            <Input type="password" placeholder="新密码" />
                            <Input type="password" placeholder="确认新密码" />
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                              修改密码
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
