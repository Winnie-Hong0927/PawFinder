"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Gift, Video, Settings, Bell, LogOut, PawPrint, Calendar } from "lucide-react";

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
  const user = {
    name: "张三",
    email: "zhangsan@example.com",
    role: "adopter",
    avatar_url: "",
    adopter_status: "approved",
  };

  const tabs = [
    { value: "overview", label: "概览", icon: PawPrint },
    { value: "adoptions", label: "我的领养", icon: Heart },
    { value: "donations", label: "我的捐赠", icon: Gift },
    { value: "videos", label: "宠物视频", icon: Video },
    { value: "settings", label: "设置", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-white">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-primary-200 text-primary-700 text-2xl">
                {user.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-primary-100">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-white/20 text-white">
                  {user.role === "adopter" ? "已认证领养人" : "普通用户"}
                </Badge>
                {user.adopter_status === "approved" && (
                  <Badge className="bg-green-500 text-white">审核通过</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <Link key={tab.value} href={`#${tab.value}`}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3"
                      >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                      </Button>
                    </Link>
                  ))}
                  <Button variant="ghost" className="w-full justify-start gap-3 text-red-500">
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
              <h2 className="text-2xl font-bold text-foreground mb-4">概览</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-primary-500" />
                    <div className="text-3xl font-bold text-foreground">
                      {mockAdoptions.length}
                    </div>
                    <p className="text-muted-foreground">我的领养</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Gift className="w-8 h-8 mx-auto mb-2 text-accent-500" />
                    <div className="text-3xl font-bold text-foreground">
                      {mockDonations.length}
                    </div>
                    <p className="text-muted-foreground">我的捐赠</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Video className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-3xl font-bold text-foreground">
                      {mockVideos.length}
                    </div>
                    <p className="text-muted-foreground">已上传视频</p>
                  </CardContent>
                </Card>
              </div>

              {/* Next Video Reminder */}
              <Card className="mt-6 bg-yellow-50 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">视频上传提醒</h3>
                      <p className="text-sm text-muted-foreground">
                        距离下次上传宠物近况视频还有 5 天
                      </p>
                    </div>
                    <Button>立即上传</Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Adoptions */}
            <section id="adoptions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary-500" />
                    我的领养
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockAdoptions.length > 0 ? (
                    <div className="space-y-4">
                      {mockAdoptions.map((adoption) => (
                        <div
                          key={adoption.id}
                          className="flex items-center gap-4 p-4 rounded-lg bg-muted"
                        >
                          <div className="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center">
                            🐾
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">
                              {adoption.pet.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              领养日期: {adoption.adoption_date}
                            </p>
                          </div>
                          <Badge
                            className={
                              adoption.status === "active"
                                ? "bg-green-500 text-white"
                                : "bg-gray-500 text-white"
                            }
                          >
                            {adoption.status === "active" ? "进行中" : "已结束"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">🐾</div>
                      <h3 className="font-semibold text-foreground mb-2">暂无领养记录</h3>
                      <p className="text-muted-foreground mb-4">
                        快去领养一只可爱的宠物吧
                      </p>
                      <Link href="/pets">
                        <Button>
                          <PawPrint className="w-4 h-4 mr-2" />
                          浏览宠物
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Donations */}
            <section id="donations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-accent-500" />
                    我的捐赠
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockDonations.length > 0 ? (
                    <div className="space-y-4">
                      {mockDonations.map((donation) => (
                        <div
                          key={donation.id}
                          className="flex items-center gap-4 p-4 rounded-lg bg-muted"
                        >
                          <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center">
                            {donation.type === "money" ? (
                              <Gift className="w-6 h-6 text-accent-600" />
                            ) : (
                              <Gift className="w-6 h-6 text-accent-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">
                              {donation.type === "money"
                                ? `捐赠 ¥${donation.amount}`
                                : "物资捐赠"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {donation.created_at}
                            </p>
                          </div>
                          <Badge className="bg-green-500 text-white">已完成</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">🎁</div>
                      <h3 className="font-semibold text-foreground mb-2">暂无捐赠记录</h3>
                      <p className="text-muted-foreground mb-4">
                        感谢您的每一份爱心
                      </p>
                      <Link href="/donate">
                        <Button variant="outline">
                          <Gift className="w-4 h-4 mr-2" />
                          我要捐赠
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Videos */}
            <section id="videos">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
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
                          className="flex items-center gap-4 p-4 rounded-lg bg-muted"
                        >
                          <div className="w-24 h-16 rounded bg-purple-100 flex items-center justify-center">
                            <Video className="w-8 h-8 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">
                              {video.pet_name} - 近况视频
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              上传于 {video.uploaded_at}
                            </p>
                          </div>
                          <Badge
                            className={
                              video.status === "approved"
                                ? "bg-green-500 text-white"
                                : "bg-yellow-500 text-white"
                            }
                          >
                            {video.status === "approved" ? "已审核" : "待审核"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">📹</div>
                      <h3 className="font-semibold text-foreground mb-2">暂无视频记录</h3>
                      <p className="text-muted-foreground mb-4">
                        上传宠物近况视频，让我们一起守护它们的成长
                      </p>
                      <Button>
                        <Video className="w-4 h-4 mr-2" />
                        上传视频
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Settings */}
            <section id="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-500" />
                    个人设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        姓名
                      </label>
                      <p className="text-muted-foreground">{user.name}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        邮箱
                      </label>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        手机号
                      </label>
                      <p className="text-muted-foreground">138****8888</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        地址
                      </label>
                      <p className="text-muted-foreground">北京市朝阳区</p>
                    </div>
                  </div>
                  <Button>编辑资料</Button>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
