"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  const [pets, setPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    // 模拟数据
    setTimeout(() => {
      setPets([
        { id: "1", name: "小白", species: "cat", breed: "中华田园猫", images: [], status: "available", created_at: "2024-01-15" },
        { id: "2", name: "旺财", species: "dog", breed: "金毛", images: [], status: "pending", created_at: "2024-01-14" },
        { id: "3", name: "团子", species: "rabbit", breed: "垂耳兔", images: [], status: "adopted", created_at: "2024-01-13" },
      ]);
      setApplications([
        {
          id: "1",
          pet_id: "2",
          user_id: "u1",
          pet: { name: "旺财", species: "dog", images: [] },
          user: { name: "李四", email: "lisi@example.com" },
          reason: "一直想养一只金毛，有足够的时间和精力照顾它。",
          status: "pending",
          created_at: "2024-01-18",
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
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const stats: StatCard[] = [
    { title: "总宠物数", value: "156", change: "+12", icon: PawPrint, trend: "up", color: "bg-orange-100 text-orange-600" },
    { title: "待审核申请", value: "8", change: "+3", icon: Heart, trend: "up", color: "bg-rose-100 text-rose-600" },
    { title: "本月领养", value: "23", change: "+5", icon: Users, trend: "up", color: "bg-emerald-100 text-emerald-600" },
    { title: "收到捐赠", value: "¥12,580", change: "-8%", icon: Gift, trend: "down", color: "bg-amber-100 text-amber-600" },
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
                  A
                </div>
                <span className="text-sm font-medium">管理员</span>
              </div>
              <Link href="/">
                <Button variant="ghost" className="text-white hover:bg-white/20 gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>返回首页</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "待审核领养", count: 3, icon: Clock, color: "from-amber-400 to-orange-500", bg: "bg-amber-50" },
            { label: "待审核视频", count: 5, icon: Video, color: "from-purple-400 to-pink-500", bg: "bg-purple-50" },
            { label: "待审核用户", count: 2, icon: UserCheck, color: "from-blue-400 to-cyan-500", bg: "bg-blue-50" },
            { label: "今日新增捐赠", count: 8, icon: DollarSign, color: "from-emerald-400 to-green-500", bg: "bg-emerald-50" },
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
              <CardHeader>
                <CardTitle className="text-gray-800">用户管理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "张三", email: "zhangsan@example.com", role: "领养人", status: "已认证", avatar: "张" },
                    { name: "李四", email: "lisi@example.com", role: "领养人", status: "待审核", avatar: "李" },
                    { name: "王五", email: "wangwu@example.com", role: "捐赠人", status: "已认证", avatar: "王" },
                    { name: "赵六", email: "zhaoliu@example.com", role: "捐赠人", status: "已认证", avatar: "赵" },
                    { name: "孙七", email: "sunqi@example.com", role: "领养人", status: "待审核", avatar: "孙" },
                    { name: "周八", email: "zhouba@example.com", role: "领养人", status: "已认证", avatar: "周" },
                  ].map((user, i) => (
                    <div key={i} className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-12 h-12 bg-orange-100">
                          <AvatarFallback className="text-orange-600 font-bold">{user.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-orange-200 text-orange-600">
                          {user.role}
                        </Badge>
                        <Badge className={user.status === "已认证" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
