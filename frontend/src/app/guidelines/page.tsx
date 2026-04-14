"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Shield, Heart, Clock, CheckCircle, FileText, Home, Users, DollarSign, AlertTriangle } from "lucide-react";

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-8 shadow-lg">
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
              <Shield className="w-10 h-10 text-white" />
              <h1 className="text-4xl font-bold text-white">领养指南</h1>
            </div>
            <p className="text-orange-100 text-lg max-w-2xl mx-auto leading-relaxed">
              为了确保每一位宠物都能找到负责任的新家，我们需要您了解以下领养流程和注意事项。
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Process Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-500" />
            领养流程
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "浏览宠物", desc: "浏览我们的小可爱，找到你心仪的宠物", icon: "🔍" },
              { step: 2, title: "提交申请", desc: "填写领养申请表，上传身份证明", icon: "📝" },
              { step: 3, title: "等待审核", desc: "我们的团队将在3-5个工作日内审核", icon: "⏳" },
              { step: 4, title: "签署协议", desc: "审核通过后签署领养协议，接宠物回家", icon: "🏠" },
            ].map((item) => (
              <Card key={item.step} className="border-orange-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xl font-bold flex items-center justify-center mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
            领养要求
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-emerald-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Heart className="w-5 h-5 text-emerald-500" />
                  基本要求
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "年满18周岁，具有完全民事行为能力",
                  "有稳定的工作和收入来源",
                  "居住在允许养宠物的住所",
                  "家庭成员同意领养决定",
                  "有足够的时间和精力照顾宠物",
                  "愿意接受定期回访和视频提交",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-orange-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <DollarSign className="w-5 h-5 text-orange-500" />
                  费用说明
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "领养押金：¥500-1000（领养成功后可退还）",
                  "疫苗接种：根据宠物情况，¥200-500",
                  "绝育手术：¥300-800（如未绝育）",
                  "日常开销：猫粮/狗粮、玩具、用品等",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 font-bold text-sm">{i + 1}</span>
                    </div>
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Commitments */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-500" />
            领养承诺
          </h2>
          <Card className="border-purple-100 shadow-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "科学喂养", desc: "提供优质的宠物食品，不喂食人类食物中的有害物质" },
                  { title: "定期体检", desc: "每年带宠物进行健康检查，及时接种疫苗" },
                  { title: "安全环境", desc: "为宠物提供安全、舒适的居住环境" },
                  { title: "陪伴关爱", desc: "每天抽出时间陪伴宠物，不长时间独留在家" },
                  { title: "不离不弃", desc: "无论发生什么，都不随意遗弃宠物" },
                  { title: "配合回访", desc: "按要求定期提交宠物近况视频，接受回访" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">✨</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Warnings */}
        <section className="mb-8">
          <Card className="border-red-100 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-red-700 text-lg mb-2">重要提醒</h3>
                  <p className="text-red-600 mb-3">
                    以下情况将导致领养申请被拒绝或取消领养资格：
                  </p>
                  <ul className="space-y-2 text-red-600">
                    <li>• 提供虚假个人信息的</li>
                    <li>• 有虐待动物记录的</li>
                    <li>• 无法为宠物提供稳定生活环境的</li>
                    <li>• 拒绝配合定期回访的</li>
                    <li>• 将领养宠物用于繁殖或商业目的的</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">准备好领养了吗？</h2>
          <p className="text-gray-500 mb-6">每一只宠物都值得被爱，每一份领养都是一份责任</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pets">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold">
                <Heart className="w-5 h-5 mr-2" />
                浏览待领养宠物
              </Button>
            </Link>
            <Link href="/faq">
              <Button size="lg" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                常见问题
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
