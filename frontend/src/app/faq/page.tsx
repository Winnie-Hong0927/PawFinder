"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, HelpCircle, Heart, Gift, Video, User, Home, Search } from "lucide-react";

const faqCategories = [
  {
    category: "领养相关",
    icon: "🏠",
    questions: [
      {
        q: "领养需要满足什么条件？",
        a: "领养人需要年满18周岁，有稳定的工作和收入，居住在允许养宠物的住所，且家庭成员同意领养决定。具体要求请查看我们的领养指南。",
      },
      {
        q: "领养流程是怎样的？",
        a: "领养流程包括：浏览宠物 → 提交申请 → 等待审核（3-5个工作日）→ 签署协议 → 接宠物回家。我们会确保每一位领养人都经过认真审核。",
      },
      {
        q: "领养需要支付费用吗？",
        a: "领养本身是免费的，但需要支付一定的领养押金（¥500-1000），用于确保领养人会负责任地照顾宠物。押金在领养成功后一段时间无问题可退还。",
      },
      {
        q: "可以领养多只宠物吗？",
        a: "可以的，但需要证明你有足够的空间、时间和精力照顾多只宠物。首次领养建议从一只开始，等有经验后再考虑领养第二只。",
      },
      {
        q: "领养后可以更换宠物吗？",
        a: "我们不建议频繁更换宠物，这会对宠物的心理健康造成影响。如果你确实无法继续照顾现有宠物，请联系我们，我们会协助你为宠物找到新的合适家庭。",
      },
    ],
  },
  {
    category: "领养后相关",
    icon: "📹",
    questions: [
      {
        q: "为什么需要提交宠物视频？",
        a: "提交视频是为了确保宠物得到良好的照顾。我们会定期要求领养人上传宠物近况视频，管理员会审核视频内容。如果发现宠物没有得到适当照顾，我们会采取相应措施。",
      },
      {
        q: "视频提交频率是多久一次？",
        a: "通常建议每月提交一次宠物近况视频。在领养初期（前3个月）可能需要更频繁地提交，以便我们确认宠物适应良好。",
      },
      {
        q: "如果宠物生病了怎么办？",
        a: "请及时带宠物去宠物医院接受治疗。领养前我们会对宠物进行全面健康检查，领养后的一些常见疾病（如感冒、消化问题等）需要主人自行承担医疗费用。",
      },
      {
        q: "可以给宠物做绝育手术吗？",
        a: "如果是未绝育的宠物，我们强烈建议领养后进行绝育手术。这有助于宠物的健康，也能避免不必要的繁殖。具体费用和时间安排可咨询我们的工作人员。",
      },
      {
        q: "如果我搬家或换工作怎么办？",
        a: "请提前告知我们。如果你搬家后仍然可以继续照顾宠物，只需更新联系方式即可。如果新住所不允许养宠物，我们会协助你为宠物寻找新的家庭。",
      },
    ],
  },
  {
    category: "捐赠相关",
    icon: "💝",
    questions: [
      {
        q: "捐赠的善款如何使用？",
        a: "所有善款将用于宠物救助、医疗、疫苗接种、绝育手术、食物和日常用品等。我们承诺95%以上的善款直接用于动物福利，每一笔支出都会公开透明。",
      },
      {
        q: "可以指定捐赠用途吗？",
        a: "可以。在捐赠时你可以选择捐赠到特定项目（如某个宠物或某个救助行动）。如果没有指定用途，善款将用于最需要的领域。",
      },
      {
        q: "可以捐赠物资吗？",
        a: "当然可以！我们接受猫粮、狗粮、宠物玩具、宠物窝、清洁用品、疫苗等物资捐赠。捐赠物资请联系我们的工作人员确认需求和邮寄方式。",
      },
      {
        q: "捐赠有发票吗？",
        a: "是的，大额捐赠（¥1000以上）可以获得捐赠发票。请在捐赠时提供您的开票信息，我们会在7个工作日内寄出发票。",
      },
    ],
  },
  {
    category: "账户相关",
    icon: "👤",
    questions: [
      {
        q: "注册需要提供什么信息？",
        a: "注册时需要提供有效的电子邮箱、手机号码和基本信息。申请领养时还需要上传身份证照片用于身份验证。所有信息都会严格保密。",
      },
      {
        q: "如何成为认证领养人？",
        a: "提交领养申请后，我们的工作人员会审核你的申请材料，包括身份证明、居住证明等。审核通过后你将获得认证领养人资格，可以更快地完成领养流程。",
      },
      {
        q: "忘记密码怎么办？",
        a: "在登录页面点击「忘记密码」，输入你的注册邮箱，我们会发送重置密码链接到你的邮箱。",
      },
      {
        q: "如何删除账户？",
        a: "如果你需要删除账户，请联系我们的客服团队。我们会在核实身份后协助你完成账户注销，届时你的所有个人数据将被永久删除。",
      },
    ],
  },
];

export default function FAQPage() {
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
              <HelpCircle className="w-10 h-10 text-white" />
              <h1 className="text-4xl font-bold text-white">常见问题</h1>
            </div>
            <p className="text-orange-100 text-lg max-w-2xl mx-auto leading-relaxed">
              解答你关于领养、捐赠和平台使用的常见问题。如果还有其他疑问，欢迎联系我们。
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Home, label: "领养流程", href: "/guidelines", color: "from-orange-400 to-amber-500" },
            { icon: Gift, label: "如何捐赠", href: "/donate", color: "from-emerald-400 to-green-500" },
            { icon: Video, label: "视频回访", href: "/guidelines", color: "from-purple-400 to-pink-500" },
            { icon: User, label: "联系客服", href: "#contact", color: "from-blue-400 to-cyan-500" },
          ].map((item, i) => (
            <Link key={i} href={item.href}>
              <Card className="border-orange-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto mb-2`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-medium text-gray-700">{item.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category) => (
            <section key={category.category}>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                {category.category}
              </h2>
              <Card className="border-orange-100 shadow-md">
                <CardContent className="p-4">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, i) => (
                      <AccordionItem key={i} value={`${category.category}-${i}`} className="border-b border-orange-100 last:border-0">
                        <AccordionTrigger className="text-left font-medium text-gray-700 hover:text-orange-600 hover:no-underline py-4">
                          <span className="flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                            {faq.q}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-500 pb-4 pl-8">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </section>
          ))}
        </div>

        {/* Contact Section */}
        <section id="contact" className="mt-12">
          <Card className="bg-gradient-to-r from-orange-500 to-amber-500 border-0 shadow-lg">
            <CardContent className="p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-3">还有其他问题？</h2>
              <p className="text-orange-100 mb-6 max-w-xl mx-auto">
                我们的客服团队随时为你解答疑问。无论是领养问题还是捐赠咨询，我们都乐意帮助你。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold">
                  <Heart className="w-5 h-5 mr-2" />
                  在线咨询
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                  发送邮件
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center mt-10">
          <p className="text-gray-500 mb-4">没有找到你想要的答案？</p>
          <Link href="/guidelines">
            <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
              查看完整领养指南
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
