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
    { title: "总宠物数", value: "156", change: "+12", icon: PawPrint, trend: "up" },
    { title: "待审核申请", value: "8", change: "+3", icon: Heart, trend: "up" },
    { title: "本月领养", value: "23", change: "+5", icon: Users, trend: "up" },
    { title: "收到捐赠", value: "¥12,580", change: "-8%", icon: Gift, trend: "down" },
  ];

  const handleReviewApplication = async (id: string, status: "approved" | "rejected") => {
    // 模拟审核
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status } : app
      )
    );
    setSelectedApplication(null);
  };

  const handleReviewVideo = async (id: string, status: "approved" | "rejected") => {
    // 模拟审核
    setVideos((prev) =>
      prev.map((video) =>
        video.id === id ? { ...video, status } : video
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold">管理后台</h1>
                <p className="text-sm text-gray-400">PawFinder 管理系统</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-primary-500 text-white">管理员</Badge>
              <Link href="/">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  返回首页
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-xs ${
                          stat.trend === "up" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="adoptions">
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              数据概览
            </TabsTrigger>
            <TabsTrigger value="pets" className="gap-2">
              <PawPrint className="w-4 h-4" />
              宠物管理
            </TabsTrigger>
            <TabsTrigger value="adoptions" className="gap-2">
              <Heart className="w-4 h-4" />
              领养审核
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <Video className="w-4 h-4" />
              视频审查
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              用户管理
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>数据概览</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-4">本月领养趋势</h3>
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
                          <span className="text-sm text-muted-foreground w-8">{item.day}</span>
                          <div className="flex-1 bg-primary-100 rounded-full h-4">
                            <div
                              className="bg-primary-500 rounded-full h-4"
                              style={{ width: `${item.width}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-4">宠物种类分布</h3>
                    <div className="space-y-3">
                      {[
                        { name: "猫咪", count: 58, color: "bg-blue-500" },
                        { name: "狗狗", count: 42, color: "bg-green-500" },
                        { name: "兔子", count: 18, color: "bg-pink-500" },
                        { name: "其他", count: 8, color: "bg-gray-500" },
                      ].map((item) => (
                        <div key={item.name} className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-16">{item.name}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-4">
                            <div
                              className={`${item.color} rounded-full h-4`}
                              style={{ width: `${(item.count / 126) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pets */}
          <TabsContent value="pets">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>宠物管理</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  添加宠物
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>宠物</TableHead>
                      <TableHead>种类</TableHead>
                      <TableHead>品种</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pets.map((pet) => (
                      <TableRow key={pet.id}>
                        <TableCell className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            🐾
                          </div>
                          <span className="font-medium">{pet.name}</span>
                        </TableCell>
                        <TableCell>{pet.species}</TableCell>
                        <TableCell>{pet.breed}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              pet.status === "available"
                                ? "bg-green-500"
                                : pet.status === "pending"
                                ? "bg-yellow-500"
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
                        <TableCell>{pet.created_at}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
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
            <Card>
              <CardHeader>
                <CardTitle>领养申请审核</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>申请人</TableHead>
                      <TableHead>申请宠物</TableHead>
                      <TableHead>申请理由</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>申请时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{app.user.name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{app.user.name}</p>
                              <p className="text-xs text-muted-foreground">{app.user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>🐾</span>
                            <span>{app.pet.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{app.reason}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              app.status === "pending"
                                ? "bg-yellow-500"
                                : app.status === "approved"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          >
                            {app.status === "pending"
                              ? "待审核"
                              : app.status === "approved"
                              ? "已通过"
                              : "已拒绝"}
                          </Badge>
                        </TableCell>
                        <TableCell>{app.created_at}</TableCell>
                        <TableCell>
                          {app.status === "pending" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedApplication(app)}>
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
                                  <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="font-medium mb-2">申请人信息</h4>
                                    <p>姓名: {selectedApplication?.user.name}</p>
                                    <p>邮箱: {selectedApplication?.user.email}</p>
                                  </div>
                                  <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="font-medium mb-2">申请理由</h4>
                                    <p className="text-sm">{selectedApplication?.reason}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>审核备注</Label>
                                    <Input
                                      placeholder="输入审核备注..."
                                      value={reviewNotes}
                                      onChange={(e) => setReviewNotes(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleReviewApplication(app.id, "rejected")}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    拒绝
                                  </Button>
                                  <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleReviewApplication(app.id, "approved")}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    通过
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
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
            <Card>
              <CardHeader>
                <CardTitle>宠物视频审查</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>视频</TableHead>
                      <TableHead>宠物名称</TableHead>
                      <TableHead>描述</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>上传时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell>
                          <div className="w-16 h-12 rounded bg-purple-100 flex items-center justify-center">
                            <Video className="w-6 h-6 text-purple-400" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{video.pet_name}</TableCell>
                        <TableCell className="max-w-xs truncate">{video.description}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              video.status === "pending"
                                ? "bg-yellow-500"
                                : video.status === "approved"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          >
                            {video.status === "pending"
                              ? "待审核"
                              : video.status === "approved"
                              ? "已通过"
                              : "已拒绝"}
                          </Badge>
                        </TableCell>
                        <TableCell>{video.created_at}</TableCell>
                        <TableCell>
                          {video.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReviewVideo(video.id, "approved")}
                              >
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReviewVideo(video.id, "rejected")}
                              >
                                <XCircle className="w-4 h-4 text-red-500" />
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
            <Card>
              <CardHeader>
                <CardTitle>用户管理</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">用户管理功能开发中...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
