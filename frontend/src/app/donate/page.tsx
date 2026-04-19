"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Heart, Gift, Users, Clock, CheckCircle, PawPrint, ArrowLeft, DollarSign, Package, Phone, MapPin, Building2, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

interface Institution {
  id: string;
  name: string;
  description: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  status: string;
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
  const [showContactModal, setShowContactModal] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/donations");
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

  const handleDonate = async () => {
    const amount = customAmount || selectedAmount;
    if (!amount || parseFloat(amount) <= 0) {
      alert("请选择或输入捐赠金额");
      return;
    }

    setDonating(true);
    try {
      const outTradeNo = `DONATE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const response = await fetch(
        `/api/payment?outTradeNo=${outTradeNo}&totalAmount=${amount}&subject=爱心捐赠&body=感谢您的爱心捐赠&type=donate`
      );
      const data = await response.json();
      
      if (data.success && data.data) {
        // 如果是表单格式，提交表单到支付宝
        if (data.data.form) {
          const formContainer = document.createElement("div");
          formContainer.innerHTML = data.data.form;
          const form = formContainer.querySelector("form");
          if (form) {
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        } else if (data.data.redirectUrl) {
          // 如果是重定向URL，跳转到支付宝
          window.location.href = data.data.redirectUrl;
        }
      } else {
        alert("发起捐赠失败，请稍后重试");
      }
    } catch (error) {
      console.error("Donation error:", error);
      alert("捐赠请求失败，请稍后重试");
    } finally {
      setDonating(false);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const response = await fetch("/api/institutions");
      const data = await response.json();
      if (data.success) {
        // 只显示已审核通过的机构
        const verified = data.institutions.filter((i: Institution) => i.status === "verified");
        setInstitutions(verified);
      }
    } catch (error) {
      console.error("Failed to fetch institutions:", error);
    }
  };

  const handleShowContact = () => {
    fetchInstitutions();
    setShowContactModal(true);
  };

  const getProgress = (current: string, target: string) => {
    const currentNum = parseFloat(current || "0");
    const targetNum = parseFloat(target || "0");
    if (targetNum === 0) return 0;
    return Math.min((currentNum / targetNum) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-background">
      {/* Hero - 修复颜色对比 */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-12 shadow-lg">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium hover:bg-white/30 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gift className="w-10 h-10 text-white" />
              <h1 className="text-4xl font-bold text-white">爱心捐赠</h1>
            </div>
            <p className="text-orange-100 text-lg max-w-2xl mx-auto leading-relaxed">
              您的每一份捐赠都将用于宠物救助、医疗和喂养。让我们一起为流浪动物创造更好的未来。
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, value: "5,280+", label: "爱心捐赠人", color: "from-blue-400 to-blue-500" },
            { icon: PawPrint, value: "2,500+", label: "受助宠物", color: "from-orange-400 to-amber-500" },
            { icon: Heart, value: "98%", label: "善款利用率", color: "from-pink-400 to-rose-500" },
            { icon: DollarSign, value: "¥500,000+", label: "累计善款", color: "from-emerald-400 to-green-500" },
          ].map((item, i) => (
            <Card key={i} className="border-orange-100 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto mb-2`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xl font-bold text-gray-800">{item.value}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="money">
          <TabsList className="mb-8 bg-white p-1 rounded-xl shadow-sm">
            <TabsTrigger value="money" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg px-6">
              <Heart className="w-4 h-4" />
              <span>资金捐赠</span>
            </TabsTrigger>
            <TabsTrigger value="goods" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg px-6">
              <Gift className="w-4 h-4" />
              <span>物资捐赠</span>
            </TabsTrigger>
          </TabsList>

          {/* Money Donation */}
          <TabsContent value="money">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Donation Form */}
              <div className="lg:col-span-2">
                <Card className="border-orange-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <Heart className="w-5 h-5 text-orange-500" />
                      奉献爱心
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Amount Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
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
                                ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0"
                                : "border-orange-200 text-gray-700 hover:bg-orange-50"
                            }
                          >
                            ¥{amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        自定义金额
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
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
                          className="pl-8 border-orange-200 focus:border-orange-400 text-gray-800"
                        />
                      </div>
                    </div>

                    {/* Selected Amount Display */}
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 text-center border border-orange-100">
                      <p className="text-gray-500 mb-2 font-medium">您的捐赠金额</p>
                      <p className="text-4xl font-bold text-orange-600">
                        ¥{customAmount || selectedAmount || "0"}
                      </p>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md"
                      disabled={!selectedAmount && !customAmount}
                      onClick={handleDonate}
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      立即捐赠
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                      您的捐赠将帮助更多流浪动物获得关爱和照顾
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Impact Stats */}
              <div className="space-y-6">
                <Card className="border-orange-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">您的爱心影响</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="font-bold text-orange-600">¥50</span>
                      <span className="text-sm text-gray-600">可喂养一只宠物一周</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="font-bold text-orange-600">¥200</span>
                      <span className="text-sm text-gray-600">可完成一次疫苗接种</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="font-bold text-orange-600">¥500</span>
                      <span className="text-sm text-gray-600">可资助一次绝育手术</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="font-bold text-orange-600">¥1000</span>
                      <span className="text-sm text-gray-600">可帮助一只宠物找到新家</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Badges */}
                <Card className="border-orange-100 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center gap-4 text-gray-500">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm">正规机构</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm">透明公开</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Goods Donation */}
          <TabsContent value="goods">
            <Card className="border-orange-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Package className="w-5 h-5 text-orange-500" />
                  可捐赠物资
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {donationItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{item.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <p className="text-lg font-bold text-orange-600">{item.price}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-orange-50 rounded-xl border border-orange-100">
                  <h4 className="font-semibold text-gray-800 mb-2">如何捐赠物资？</h4>
                  <ol className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-sm flex items-center justify-center flex-shrink-0">1</span>
                      <span>选择您想捐赠的物资类型</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-sm flex items-center justify-center flex-shrink-0">2</span>
                      <span>联系我们的工作人员确认捐赠详情</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-sm flex items-center justify-center flex-shrink-0">3</span>
                      <span>通过邮寄或亲自送达的方式捐赠物资</span>
                    </li>
                  </ol>
                  <Button 
                    className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                    onClick={handleShowContact}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    联系我们
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 机构联系方式弹窗 */}
          <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Phone className="w-5 h-5 text-orange-500" />
                  联系我们
                </DialogTitle>
                <DialogDescription>
                  以下是各合作机构的联系方式，您可以通过电话或实地拜访进行物资捐赠咨询
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                {institutions.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">暂无可联系的机构</p>
                ) : (
                  institutions.map((institution) => (
                    <div 
                      key={institution.id} 
                      className="border border-orange-200 rounded-lg p-4 hover:bg-orange-50 transition-colors"
                    >
                      <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-orange-500" />
                        {institution.name}
                      </h3>
                      <div className="mt-3 space-y-2 text-sm">
                        <p className="flex items-start gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span>{institution.address || '地址待完善'}</span>
                        </p>
                        {institution.contact_phone && (
                          <p className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a 
                              href={`tel:${institution.contact_phone}`}
                              className="text-orange-600 hover:text-orange-700 hover:underline"
                            >
                              {institution.contact_phone}
                            </a>
                          </p>
                        )}
                        {institution.contact_email && (
                          <p className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <a 
                              href={`mailto:${institution.contact_email}`}
                              className="text-orange-600 hover:text-orange-700 hover:underline"
                            >
                              {institution.contact_email}
                            </a>
                          </p>
                        )}
                        {institution.description && (
                          <p className="text-gray-500 text-xs mt-2 border-t pt-2">
                            {institution.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  <strong className="text-orange-600">温馨提示：</strong>
                  捐赠前请先电话联系机构确认是否需要该物资，以及捐赠的具体时间和方式。
                </p>
              </div>
            </DialogContent>
          </Dialog>

        </Tabs>
      </div>
    </div>
  );
}
