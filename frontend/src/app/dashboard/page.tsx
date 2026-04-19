"use client";

import { useState, useEffect, useRef } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Heart,
  Gift,
  Video,
  Settings,
  Bell,
  LogOut,
  PawPrint,
  Calendar,
  ChevronRight,
  ChevronDown,
  Camera,
  Loader2,
  CheckCircle,
  User,
  Lock,
  Users,
} from "lucide-react";

interface Application {
  id: string;
  pet_id: string;
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string;
    age: string;
    gender: string;
    size: string;
    images: string[];
    adoption_fee: number;
    shelter_location: string;
    health_status: string;
    vaccination_status: boolean;
    sterilization_status: boolean;
    traits: string[];
    application_count?: number;
  };
  status: string;
  created_at: string;
  admin_notes?: string;
}

interface Adoption {
  id: string;
  pet_id: string;
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string;
    age: string;
    gender: string;
    size: string;
    images: string[];
    adoption_fee: number;
    shelter_location: string;
    health_status: string;
    vaccination_status: boolean;
    sterilization_status: boolean;
    traits: string[];
    application_count?: number;
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

export default function DashboardPage() {
  const router = useRouter();
  const { user: authUser, logout, isAuthenticated, isLoading, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Use auth user or show loading
  const user = authUser || {
    id: "",
    name: "加载中...",
    email: "",
    role: "user" as const,
    avatar_url: "",
    adopter_status: undefined,
    phone: "",
    member_since: "",
  };

  // Placeholder arrays for unimplemented features
  const mockDonations: { id: string; amount: number; date: string; pet_name: string }[] = [];
  const mockVideos: { id: string; title: string; thumbnail: string; upload_date: string; status: string }[] = [];

  // Settings state
  const [expandedSetting, setExpandedSetting] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar_url: "",
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
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Applications state
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [petApplicationsCount, setPetApplicationsCount] = useState<Record<string, number>>({});

  // Fetch applications
  useEffect(() => {
    if (!authUser) return;

    const fetchApplications = async () => {
      setApplicationsLoading(true);
      try {
        const response = await fetch("/api/applications", {
          credentials: "include"
        });
        const data = await response.json();
        if (data.success && data.applications) {
          setApplications(data.applications);
          
          // Extract application counts from pet data
          const countMap: Record<string, number> = {};
          data.applications.forEach((app: Application) => {
            if (app.pet?.application_count !== undefined) {
              countMap[app.pet_id] = app.pet.application_count;
            }
          });
          setPetApplicationsCount(countMap);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setApplicationsLoading(false);
      }
    };

    fetchApplications();
  }, [authUser]);

  // Update form when auth user changes
  useEffect(() => {
    if (authUser) {
      setProfileForm({
        name: authUser.name || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        avatar_url: authUser.avatar_url || "",
      });
    }
  }, [authUser]);

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("图片大小不能超过5MB");
      return;
    }

    setAvatarUploading(true);

    try {
      // Convert to base64 for demo (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setProfileForm((prev) => ({ ...prev, avatar_url: dataUrl }));
      };
      reader.readAsDataURL(file);
    } finally {
      setAvatarUploading(false);
    }
  };

  // Save profile
  const handleSaveProfile = async () => {
    if (!authUser) return;

    setSaveSuccess(false);
    
    try {
      // Call API to update profile (demo: just update local state)
      // const response = await fetch("/api/user/profile", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(profileForm),
      // });

      // Update auth context
      updateUser({
        ...authUser,
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        avatar_url: profileForm.avatar_url,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

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
            {/* Avatar with upload support */}
            <div className="relative">
              <Avatar 
                className="w-24 h-24 border-4 border-white shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => fileInputRef.current?.click()}
              >
                <AvatarImage src={profileForm.avatar_url} />
                <AvatarFallback className="bg-white text-orange-600 text-2xl font-bold">
                  {profileForm.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              {avatarUploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              {/* 用户名 - 白色，高对比度 */}
              <h1 className="text-3xl font-bold text-white mb-1">{profileForm.name || user.name}</h1>
              {/* 邮箱 - 浅橙色背景上的白色文字 */}
              <p className="text-white/90 text-sm bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
                {profileForm.email || user.email || "未设置邮箱"}
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
              <span className="font-medium">{profileForm.phone || user.phone || "未设置"}</span>
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
                      {applications.length}
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
                  {applicationsLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500" />
                      <p className="mt-2 text-gray-500">加载中...</p>
                    </div>
                  ) : applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center gap-4 p-4 rounded-lg bg-orange-50 border border-orange-100 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedApplication(app)}
                        >
                          <div className="w-16 h-16 rounded-lg bg-orange-100 flex items-center justify-center text-3xl overflow-hidden">
                            {app.pet?.images?.[0] ? (
                              <img src={app.pet.images[0]} alt={app.pet.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>?</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{app.pet?.name || "未知宠物"}</h4>
                            <p className="text-sm text-gray-500">
                              申请时间：{new Date(app.created_at).toLocaleDateString("zh-CN")}
                            </p>
                            <Badge className={`mt-1 ${
                              app.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                              app.status === "approved" ? "bg-green-100 text-green-700" :
                              app.status === "rejected" ? "bg-red-100 text-red-700" :
                              "bg-gray-100 text-gray-700"
                            } border-0`}>
                              {app.status === "pending" ? "待审核" :
                               app.status === "approved" ? "已通过" :
                               app.status === "rejected" ? "已拒绝" : app.status}
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

            {/* Application Detail Dialog */}
            <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>领养申请详情</DialogTitle>
                </DialogHeader>
                {selectedApplication && (
                  <div className="space-y-4">
                    {/* Pet Image and Basic Info */}
                    <div className="flex gap-4">
                      <div className="w-32 h-32 rounded-lg bg-orange-100 overflow-hidden flex-shrink-0">
                        {selectedApplication.pet?.images?.[0] ? (
                          <img src={selectedApplication.pet.images[0]} alt={selectedApplication.pet.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">?</div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <h3 className="text-lg font-semibold">{selectedApplication.pet?.name || "未知宠物"}</h3>
                        <p className="text-sm text-gray-500">{selectedApplication.pet?.breed || "未知品种"}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <Badge variant="outline" className="text-xs">{selectedApplication.pet?.age || "未知年龄"}</Badge>
                          <Badge variant="outline" className="text-xs">{selectedApplication.pet?.gender === "male" ? "公" : "母"}</Badge>
                          <Badge variant="outline" className="text-xs">{selectedApplication.pet?.size === "large" ? "大型" : selectedApplication.pet?.size === "medium" ? "中型" : "小型"}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* Applications Count - Highlight */}
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-orange-500" />
                          <span className="text-gray-700">当前申请人数</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">
                          {petApplicationsCount[selectedApplication.pet_id] || 0} 人
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">已有这么多人提交了该宠物的领养申请</p>
                    </div>
                    
                    {/* Application Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">申请时间</span>
                        <span className="font-medium">{new Date(selectedApplication.created_at).toLocaleString("zh-CN")}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">当前状态</span>
                        <Badge className={`${
                          selectedApplication.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          selectedApplication.status === "approved" ? "bg-green-100 text-green-700" :
                          selectedApplication.status === "rejected" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-700"
                        } border-0`}>
                          {selectedApplication.status === "pending" ? "待审核" :
                           selectedApplication.status === "approved" ? "已通过" :
                           selectedApplication.status === "rejected" ? "已拒绝" : selectedApplication.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">领养费用</span>
                        <span className="font-medium">{selectedApplication.pet?.adoption_fee === 0 ? "免费" : `¥${selectedApplication.pet?.adoption_fee}`}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">所在地</span>
                        <span className="font-medium">{selectedApplication.pet?.shelter_location || "未知"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">健康状况</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{selectedApplication.pet?.health_status || "健康"}</Badge>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">疫苗状态</span>
                        <Badge variant="outline" className={selectedApplication.pet?.vaccination_status ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-500"}>
                          {selectedApplication.pet?.vaccination_status ? "已接种" : "未接种"}
                        </Badge>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">是否绝育</span>
                        <Badge variant="outline" className={selectedApplication.pet?.sterilization_status ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-gray-50 text-gray-500"}>
                          {selectedApplication.pet?.sterilization_status ? "已绝育" : "未绝育"}
                        </Badge>
                      </div>
                      {selectedApplication.pet?.traits && selectedApplication.pet.traits.length > 0 && (
                        <div className="py-2 border-b">
                          <span className="text-gray-500">宠物特点</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedApplication.pet.traits.map((trait: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{trait}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedApplication.admin_notes && (
                        <div className="pt-2">
                          <span className="text-gray-500">审核备注</span>
                          <p className="mt-1 text-gray-700 bg-gray-50 p-2 rounded">{selectedApplication.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

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
                        <div className="flex justify-end items-center gap-3">
                          {saveSuccess && (
                            <span className="text-green-600 text-sm flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              保存成功
                            </span>
                          )}
                          <Button 
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={handleSaveProfile}
                          >
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
