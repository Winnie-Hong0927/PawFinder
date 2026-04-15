"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AdminRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PawPrint,
  Users,
  Heart,
  Gift,
  Video,
  Settings,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  FileText,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LogOut,
  Bell,
  DollarSign,
  Package,
  Clock,
  UserCheck,
  Loader2,
  Search,
  Edit,
  Trash2,
} from "lucide-react";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  images: string[];
  status: string;
  created_at: string;
}

interface Application {
  id: string;
  pet_id: string;
  user_id: string;
  pet: { name: string; species: string; images: string[] };
  user: { name: string; email: string };
  reason: string;
  idCard?: string;
  livingCondition?: string;
  experience?: string;
  status: string;
  created_at: string;
}

interface Video {
  id: string;
  user_id: string;
  pet_name: string;
  video_url: string;
  thumbnail_url: string;
  description: string;
  status: string;
  created_at: string;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: "up" | "down";
  color: string;
}

export default function AdminPage() {
  const { user, logout, isAuthenticated, isLoading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [users, setUsers] = useState([
    { id: "1", name: "张三", email: "zhangsan@example.com", phone: "138****8000", role: "adopter", adopter_status: "approved", created_at: "2024-01-01" },
    { id: "2", name: "李四", email: "lisi@example.com", phone: "139****8001", role: "adopter", adopter_status: "pending", created_at: "2024-01-10" },
    { id: "3", name: "王五", email: "wangwu@example.com", phone: "137****8002", role: "donor", created_at: "2024-01-05" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Create admin dialog
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [createAdminForm, setCreateAdminForm] = useState({
    phone: "",
    name: "",
  });

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (!isAdmin) {
        router.push("/dashboard");
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    // 模拟数据
    setTimeout(() => {
      setPets([
        { id: "1", name: "小白", species: "cat", breed: "中华田园猫", images: [], status: "available", created_at: "2024-01-15" },
        { id: "2", name: "旺财", species: "dog", breed: "金毛", images: [], status: "pending", created_at: "2024-01-14" },
        { id: "3", name: "团子", species: "rabbit", breed: "垂耳兔", images: [], status: "adopted", created_at: "2024-01-13" },
        { id: "4", name: "花花", species: "cat", breed: "布偶猫", images: [], status: "available", created_at: "2024-01-16" },
        { id: "5", name: "大黄", species: "dog", breed: "柴犬", images: [], status: "available", created_at: "2024-01-17" },
      ]);
      setApplications([
        {
          id: "1",
          pet_id: "2",
          user_id: "u1",
          pet: { name: "旺财", species: "dog", images: [] },
          user: { name: "李四", email: "lisi@example.com" },
          reason: "一直想养一只金毛，有足够的时间和精力照顾它。希望能给旺财一个温暖的家。",
          idCard: "110101199001011234",
          livingCondition: "住在有院子的房子里，空间充足",
          experience: "养过两只狗，有丰富的养狗经验",
          status: "pending",
          created_at: "2024-01-18",
        },
        {
          id: "2",
          pet_id: "1",
          user_id: "u2",
          pet: { name: "小白", species: "cat", images: [] },
          user: { name: "赵六", email: "zhaoliu@example.com" },
          reason: "独居人士，希望有一只猫陪伴。",
          idCard: "110101199201021234",
          livingCondition: "公寓，面积60平米",
          experience: "第一次养猫",
          status: "pending",
          created_at: "2024-01-19",
        },
      ]);
      setVideos([
        {
          id: "1",
          user_id: "u2",
          pet_name: "小白",
          video_url: "/videos/sample.mp4",
          thumbnail_url: "",
          description: "小白最近学会了新技能！",
          status: "pending",
          created_at: "2024-01-20",
        },
        {
          id: "2",
          user_id: "u3",
          pet_name: "旺财",
          video_url: "/videos/sample2.mp4",
          thumbnail_url: "",
          description: "旺财在院子里玩耍的视频",
          status: "pending",
          created_at: "2024-01-21",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const pendingApplications = applications.filter(a => a.status === "pending");
  const pendingVideos = videos.filter(v => v.status === "pending");
  const pendingUsers = users.filter(u => u.adopter_status === "pending");

  const stats: StatCard[] = [
    { title: "总宠物数", value: pets.length.toString(), change: "+2", icon: PawPrint, trend: "up", color: "bg-orange-100 text-orange-600" },
    { title: "待审核申请", value: pendingApplications.length.toString(), change: "+1", icon: Heart, trend: "up", color: "bg-rose-100 text-rose-600" },
    { title: "本月领养", value: "3", change: "+1", icon: Users, trend: "up", color: "bg-emerald-100 text-emerald-600" },
    { title: "待审核视频", value: pendingVideos.length.toString(), change: "0", icon: Video, trend: "up", color: "bg-amber-100 text-amber-600" },
  ];

  const handleReviewApplication = async (id: string, status: "approved" | "rejected") => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status } : app
      )
    );
    setSelectedApplication(null);
  };

  const handleReviewVideo = async (id: string, status: "approved" | "rejected") => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === id ? { ...video, status } : video
      )
    );
  };

  const handleSetAdmin = async (userId: string) => {
    if (!confirm("确定要将此用户设为管理员吗？")) return;
    
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, role: "admin" } : u
      )
    );
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("确定要删除此用户吗？此操作不可撤销。")) return;
    
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleCreateAdmin = async () => {
    if (!createAdminForm.phone || !createAdminForm.name) {
      alert("请填写完整信息");
      return;
    }
    
    // Check if user already exists
    const existing = users.find(u => u.phone === createAdminForm.phone);
    if (existing) {
      // Upgrade existing user to admin
      setUsers((prev) =>
        prev.map((u) =>
          u.id === existing.id ? { ...u, role: "admin" } : u
        )
      );
    } else {
      // Create new admin user
      const newAdmin = {
        id: Date.now().toString(),
        name: createAdminForm.name,
        email: "",
        phone: createAdminForm.phone,
        role: "admin" as const,
        adopter_status: undefined,
        created_at: new Date().toISOString().split("T")[0],
      };
      setUsers((prev) => [...prev, newAdmin]);
    }
    
    setCreateAdminOpen(false);
    setCreateAdminForm({ phone: "", name: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-background">
      {/* Header - 温暖配色 */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">管理后台</h1>
                <p className="text-orange-100 text-sm">PawFinder 管理系统</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm font-bold">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <span className="text-sm font-medium">{user?.name || "管理员"}</span>
              </div>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20 gap-2"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>退出登录</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "待审核领养", count: pendingApplications.length, icon: Clock, color: "from-amber-400 to-orange-500", bg: "bg-amber-50" },
            { label: "待审核视频", count: pendingVideos.length, icon: Video, color: "from-purple-400 to-pink-500", bg: "bg-purple-50" },
            { label: "待审核用户", count: pendingUsers.length, icon: UserCheck, color: "from-blue-400 to-cyan-500", bg: "bg-blue-50" },
            { label: "总宠物数", count: pets.length, icon: PawPrint, color: "from-emerald-400 to-green-500", bg: "bg-emerald-50" },
          ].map((item, i) => (
            <Card key={i} className="border-0 shadow-md overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{item.count}</p>
                    <p className="text-xs text-gray-500">{item.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Tabs - 温暖配色 */}
        <Tabs defaultValue="adoptions">
          <TabsList className="mb-6 bg-white p-1 rounded-xl shadow-sm">
            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg px-4">
              <BarChart3 className="w-4 h-4" />
              <span>数据概览</span>
            </TabsTrigger>
            <TabsTrigger value="pets" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg px-4">
              <PawPrint className="w-4 h-4" />
              <span>宠物管理</span>
            </TabsTrigger>
            <TabsTrigger value="adoptions" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg px-4">
              <Heart className="w-4 h-4" />
              <span>领养审核</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg px-4">
              <Video className="w-4 h-4" />
              <span>视频审查</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg px-4">
              <Users className="w-4 h-4" />
              <span>用户管理</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 统计卡片 */}
              <Card className="border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    关键指标
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="flex items-center justify-between mb-2">
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                          <Badge variant={stat.trend === "up" ? "default" : "destructive"} className="text-xs">
                            {stat.change}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.title}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 本月趋势 */}
              <Card className="border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800">本月领养趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { day: "周一", value: 3, width: 65 },
                      { day: "周二", value: 5, width: 78 },
                      { day: "周三", value: 4, width: 72 },
                      { day: "周四", value: 6, width: 85 },
                      { day: "周五", value: 3, width: 60 },
                      { day: "周六", value: 2, width: 55 },
                      { day: "周日", value: 4, width: 70 },
                    ].map((item) => (
                      <div key={item.day} className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 w-8">{item.day}</span>
                        <div className="flex-1 bg-orange-100 rounded-full h-4">
                          <div
                            className="bg-gradient-to-r from-orange-400 to-amber-400 rounded-full h-4"
                            style={{ width: `${item.width}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 待办事项 */}
              <Card className="border-orange-100 shadow-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-500" />
                    待办事项
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">3 项领养申请待审核</p>
                        <p className="text-sm text-gray-500">需要尽快处理</p>
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Video className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">5 个视频待审查</p>
                        <p className="text-sm text-gray-500">领养回访视频</p>
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">2 个捐赠待确认</p>
                        <p className="text-sm text-gray-500">物资捐赠</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pets */}
          <TabsContent value="pets">
            <Card className="border-orange-100 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-800">宠物列表</CardTitle>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  添加宠物
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-50">
                      <TableHead className="text-gray-600 font-semibold">宠物</TableHead>
                      <TableHead className="text-gray-600 font-semibold">种类</TableHead>
                      <TableHead className="text-gray-600 font-semibold">品种</TableHead>
                      <TableHead className="text-gray-600 font-semibold">状态</TableHead>
                      <TableHead className="text-gray-600 font-semibold">创建时间</TableHead>
                      <TableHead className="text-gray-600 font-semibold">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pets.map((pet) => (
                      <TableRow key={pet.id} className="hover:bg-orange-50/50">
                        <TableCell className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-xl">
                            🐾
                          </div>
                          <span className="font-medium text-gray-800">{pet.name}</span>
                        </TableCell>
                        <TableCell className="text-gray-600">{pet.species}</TableCell>
                        <TableCell className="text-gray-600">{pet.breed}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              pet.status === "available"
                                ? "bg-emerald-500"
                                : pet.status === "pending"
                                ? "bg-amber-500"
                                : "bg-gray-500"
                            }
                          >
                            {pet.status === "available"
                              ? "可领养"
                              : pet.status === "pending"
                              ? "待审核"
                              : "已领养"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">{pet.created_at}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-50">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Adoptions */}
          <TabsContent value="adoptions">
            <Card className="border-orange-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">领养申请审核</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-50">
                      <TableHead className="text-gray-600 font-semibold">申请人</TableHead>
                      <TableHead className="text-gray-600 font-semibold">申请宠物</TableHead>
                      <TableHead className="text-gray-600 font-semibold">申请理由</TableHead>
                      <TableHead className="text-gray-600 font-semibold">状态</TableHead>
                      <TableHead className="text-gray-600 font-semibold">申请时间</TableHead>
                      <TableHead className="text-gray-600 font-semibold">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id} className="hover:bg-orange-50/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 bg-orange-100">
                              <AvatarFallback className="text-orange-600 font-medium">{app.user.name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-800">{app.user.name}</p>
                              <p className="text-xs text-gray-500">{app.user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🐾</span>
                            <span className="text-gray-700">{app.pet.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 max-w-xs truncate">{app.reason}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              app.status === "pending"
                                ? "bg-amber-500"
                                : app.status === "approved"
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }
                          >
                            {app.status === "pending" ? "待审核" : app.status === "approved" ? "已通过" : "已拒绝"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">{app.created_at}</TableCell>
                        <TableCell>
                          {app.status === "pending" ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50" onClick={() => setSelectedApplication(app)}>
                                  <FileText className="w-4 h-4 mr-2" />
                                  审核
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>审核领养申请</DialogTitle>
                                  <DialogDescription>
                                    请审核 {selectedApplication?.user.name} 的领养申请
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                    <h4 className="font-medium text-gray-800 mb-2">申请人信息</h4>
                                    <p className="text-gray-600">姓名: {selectedApplication?.user.name}</p>
                                    <p className="text-gray-600">邮箱: {selectedApplication?.user.email}</p>
                                  </div>
                                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                    <h4 className="font-medium text-gray-800 mb-2">申请理由</h4>
                                    <p className="text-sm text-gray-600">{selectedApplication?.reason}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-gray-700">审核备注</Label>
                                    <Input
                                      placeholder="输入审核备注..."
                                      value={reviewNotes}
                                      onChange={(e) => setReviewNotes(e.target.value)}
                                      className="border-orange-200 focus:border-orange-400"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => handleReviewApplication(app.id, "rejected")}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    拒绝
                                  </Button>
                                  <Button
                                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                                    onClick={() => handleReviewApplication(app.id, "approved")}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    通过
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <span className="text-gray-400 text-sm">已完成</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Videos */}
          <TabsContent value="videos">
            <Card className="border-orange-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800">视频审查</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-purple-50">
                      <TableHead className="text-gray-600 font-semibold">宠物</TableHead>
                      <TableHead className="text-gray-600 font-semibold">上传者</TableHead>
                      <TableHead className="text-gray-600 font-semibold">描述</TableHead>
                      <TableHead className="text-gray-600 font-semibold">状态</TableHead>
                      <TableHead className="text-gray-600 font-semibold">上传时间</TableHead>
                      <TableHead className="text-gray-600 font-semibold">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videos.map((video) => (
                      <TableRow key={video.id} className="hover:bg-purple-50/50">
                        <TableCell className="text-gray-800">{video.pet_name}</TableCell>
                        <TableCell className="text-gray-600">{video.user_id}</TableCell>
                        <TableCell className="text-gray-600 max-w-xs truncate">{video.description}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              video.status === "pending"
                                ? "bg-amber-500"
                                : video.status === "approved"
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }
                          >
                            {video.status === "pending" ? "待审核" : video.status === "approved" ? "已通过" : "已拒绝"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">{video.created_at}</TableCell>
                        <TableCell>
                          {video.status === "pending" && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-emerald-600 hover:bg-emerald-50"
                                onClick={() => handleReviewVideo(video.id, "approved")}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => handleReviewVideo(video.id, "rejected")}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card className="border-orange-100 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-800">用户管理</CardTitle>
                <Dialog open={createAdminOpen} onOpenChange={setCreateAdminOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      创建管理员
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>创建管理员账号</DialogTitle>
                      <DialogDescription>
                        输入手机号或用户名创建新的管理员账号。如果用户已存在，将升级为管理员。
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="adminPhone">手机号</Label>
                        <Input
                          id="adminPhone"
                          placeholder="请输入手机号"
                          value={createAdminForm.phone}
                          onChange={(e) => setCreateAdminForm({ ...createAdminForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adminName">姓名</Label>
                        <Input
                          id="adminName"
                          placeholder="请输入姓名"
                          value={createAdminForm.name}
                          onChange={(e) => setCreateAdminForm({ ...createAdminForm, name: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCreateAdminOpen(false)}>取消</Button>
                      <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleCreateAdmin}>
                        创建
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {/* Users Table */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-orange-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">用户</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">手机号</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">角色</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">认证状态</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">注册时间</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-orange-50/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10 bg-orange-100">
                                <AvatarFallback className="text-orange-600 font-medium">{u.name?.[0] || "U"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-800">{u.name}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{u.phone}</td>
                          <td className="px-4 py-3">
                            <Badge className={u.role === "admin" ? "bg-red-500" : u.role === "donor" ? "bg-emerald-500" : "bg-blue-500"}>
                              {u.role === "admin" ? "管理员" : u.role === "donor" ? "捐赠人" : "领养人"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={u.adopter_status === "approved" ? "bg-emerald-100 text-emerald-700" : u.adopter_status === "pending" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}>
                              {u.adopter_status === "approved" ? "已认证" : u.adopter_status === "pending" ? "待审核" : "未申请"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{u.created_at}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {u.role !== "admin" && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600 hover:bg-red-50"
                                  onClick={() => handleSetAdmin(u.id)}
                                >
                                  <Settings className="w-4 h-4 mr-1" />
                                  设为管理员
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
