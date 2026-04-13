"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Heart, Gift, Users, Clock, CheckCircle, PawPrint } from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  target_amount: string;
  current_amount: string;
  cover_image: string;
  status: string;
  created_at: string;
}

const donationItems = [
  { icon: "🥫", name: "猫粮/狗粮", price: "¥50", description: "一袋优质宠物粮" },
  { icon: "🧸", name: "宠物玩具", price: "¥30", description: "一个耐咬的玩具" },
  { icon: "🛏️", name: "宠物窝", price: "¥100", description: "一个温暖的窝" },
  { icon: "💊", name: "疫苗接种", price: "¥200", description: "一次疫苗接种" },
  { icon: "🧴", name: "清洁用品", price: "¥40", description: "沐浴露、梳子等" },
  { icon: "🎁", name: "爱心礼包", price: "¥500", description: "包含多种物资" },
];

export default function DonatePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/donations/campaigns");
      const data = await response.json();
      if (data.success) {
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (current: string, target: string) => {
    const currentNum = parseFloat(current || "0");
    const targetNum = parseFloat(target || "0");
    if (targetNum === 0) return 0;
    return Math.min((currentNum / targetNum) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-accent-500 to-accent-600 py-12">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="w-8 h-8" />
            <h1 className="text-4xl font-bold">爱心捐赠</h1>
          </div>
          <p className="text-accent-100 max-w-2xl mx-auto">
            您的每一份捐赠都将用于宠物救助、医疗和喂养。让我们一起为流浪动物创造更好的未来。
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="money">
          <TabsList className="w-full justify-start mb-8">
            <TabsTrigger value="money" className="gap-2">
              <Heart className="w-4 h-4" />
              资金捐赠
            </TabsTrigger>
            <TabsTrigger value="goods" className="gap-2">
              <Gift className="w-4 h-4" />
              物资捐赠
            </TabsTrigger>
          </TabsList>

          {/* Money Donation */}
          <TabsContent value="money">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Donation Form */}
              <div className="lg:col-span-2">
                <Card className="border-primary-100">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary-500" />
                      奉献爱心
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Amount Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">
                        选择金额
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {["50", "100", "200", "500", "1000", "2000"].map((amount) => (
                          <Button
                            key={amount}
                            variant={selectedAmount === amount ? "default" : "outline"}
                            onClick={() => {
                              setSelectedAmount(amount);
                              setCustomAmount("");
                            }}
                            className={
                              selectedAmount === amount
                                ? "bg-primary-500 hover:bg-primary-600"
                                : ""
                            }
                          >
                            ¥{amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">
                        自定义金额
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                          ¥
                        </span>
                        <Input
                          type="number"
                          placeholder="输入金额"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount("");
                          }}
                          className="pl-8"
                        />
                      </div>
                    </div>

                    {/* Selected Amount Display */}
                    <div className="bg-primary-50 rounded-xl p-6 text-center">
                      <p className="text-muted-foreground mb-2">您的捐赠金额</p>
                      <p className="text-4xl font-bold text-primary-600">
                        ¥{customAmount || selectedAmount || "0"}
                      </p>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                      disabled={!selectedAmount && !customAmount}
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      立即捐赠
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      您的捐赠将帮助更多流浪动物获得关爱和照顾
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Impact Stats */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">您的爱心影响</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">¥50</span>
                      <span className="text-sm">可喂养一只宠物一周</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">¥200</span>
                      <span className="text-sm">可完成一次疫苗接种</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">¥500</span>
                      <span className="text-sm">可资助一次绝育手术</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">¥1000</span>
                      <span className="text-sm">可帮助一只宠物找到新家</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-accent-50 border-accent-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-6 h-6 text-accent-600" />
                      <span className="font-semibold text-accent-900">爱心社区</span>
                    </div>
                    <p className="text-sm text-accent-700">
                      加入我们的爱心社区，与 thousands of 爱心人士一起，为流浪动物创造更美好的世界。
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Goods Donation */}
          <TabsContent value="goods">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donationItems.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                    <p className="text-2xl font-bold text-primary-600 mb-2">{item.price}</p>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <Button variant="outline" className="w-full">
                      <Gift className="w-4 h-4 mr-2" />
                      捐赠此物品
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">物资捐赠说明</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    捐赠物资请确保干净、完好，符合安全卫生标准
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    食品类请在保质期内，包装完整
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    捐赠后我们的工作人员会与您联系确认收货地址
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    感谢您的爱心，每一份物资都将被妥善使用
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Campaign Projects */}
        {campaigns.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <PawPrint className="w-6 h-6 text-primary-500" />
              正在进行中的项目
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden">
                  <div className="relative h-40 bg-gradient-to-r from-primary-100 to-primary-200">
                    {campaign.cover_image && (
                      <Image
                        src={campaign.cover_image}
                        alt={campaign.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                    <Badge className="absolute top-4 left-4 bg-white text-primary-600">
                      <Clock className="w-3 h-3 mr-1" />
                      进行中
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {campaign.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">已筹</span>
                        <span className="font-semibold text-primary-600">
                          ¥{campaign.current_amount || "0"}
                        </span>
                      </div>
                      <Progress
                        value={getProgress(campaign.current_amount, campaign.target_amount)}
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {getProgress(campaign.current_amount, campaign.target_amount).toFixed(0)}%
                        </span>
                        <span>目标: ¥{campaign.target_amount || "0"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
