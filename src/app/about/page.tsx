"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Heart, Shield, Users, Gift, Star, Clock, Target, Eye, Zap, Home, Phone, Mail, MapPin, Video } from "lucide-react";

const teamMembers = [
  { name: "张小明", role: "创始人 & CEO", avatar: "张", bio: "热爱动物，10年动物保护经验" },
  { name: "李婷婷", role: "运营总监", avatar: "李", bio: "专业兽医背景，专注动物福利" },
  { name: "王建国", role: "技术负责人", avatar: "王", bio: "全栈工程师，用技术传递爱心" },
  { name: "陈美美", role: "客服主管", avatar: "陈", bio: "耐心倾听，为每一只宠物找到家" },
];

const milestones = [
  { year: "2018", event: "PawFinder 成立，开始流浪动物救助" },
  { year: "2019", event: "完成第一个百只宠物成功领养" },
  { year: "2020", event: "上线在线捐赠系统，收到第一笔爱心捐款" },
  { year: "2021", event: "推出视频回访系统，确保领养质量" },
  { year: "2022", event: "累计帮助超过1000只宠物找到新家" },
  { year: "2023", event: "启动智能助理小 paw，提供24小时服务" },
  { year: "2024", event: "累计领养突破2500只，继续前行" },
];

const values = [
  {
    icon: Heart,
    title: "爱心第一",
    description: "每一只动物都值得被爱，我们用爱心对待每一只来到平台的宠物。",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: Shield,
    title: "责任担当",
    description: "领养是一份责任，我们严格审核确保每位领养人都是合格的宠物家长。",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Users,
    title: "社区共建",
    description: "我们相信爱心的力量，动员全社会共同参与动物保护事业。",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Gift,
    title: "透明公开",
    description: "每一笔捐赠、每一分支出都公开透明，让爱心人士放心。",
    color: "bg-emerald-100 text-emerald-600",
  },
];

const stats = [
  { value: "2,500+", label: "成功领养", icon: Heart },
  { value: "5,000+", label: "待领养宠物", icon: Home },
  { value: "10,000+", label: "爱心捐赠人", icon: Users },
  { value: "98%", label: "满意度", icon: Star },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-background">
      {/* Header */}
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
              <span className="text-5xl">🐾</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white">关于 PawFinder</h1>
            </div>
            <p className="text-orange-100 text-lg max-w-2xl mx-auto leading-relaxed">
              一个温暖的宠物领养平台，让每一只流浪宠物都能找到爱的港湾。我们相信，领养不只是改变一只动物的生命，更是给自己的生活带来无限温暖。
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Mission & Vision */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-orange-100 shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-orange-400 to-amber-400" />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">我们的使命</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  通过技术创新和社区力量，为流浪动物提供展示和领养平台，同时建立完善的领养审核机制和后续跟踪服务，确保每一次领养都是负责任的选择，让领养成为一件简单、温暖、有意义的事情。
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-100 shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-amber-400 to-yellow-400" />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">我们的愿景</h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  构建一个人与动物和谐共处的社会，让每一只流浪动物都能找到温暖的家。我们希望通过平台的力量，唤起更多人对动物保护的关注，让领养代替购买成为更多人的选择。
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <Card key={i} className="border-orange-100 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">我们的价值观</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <Card key={i} className="border-orange-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-xl ${value.color} flex items-center justify-center mx-auto mb-4`}>
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-500">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
            <Users className="w-6 h-6 text-orange-500" />
            核心团队
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <Card key={i} className="border-orange-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-orange-400 to-amber-400">
                    <AvatarFallback className="text-white text-2xl font-bold">{member.avatar}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-sm text-orange-600 mb-2">{member.role}</p>
                  <p className="text-xs text-gray-500">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
            <Clock className="w-6 h-6 text-orange-500" />
            发展历程
          </h2>
          <Card className="border-orange-100 shadow-md">
            <CardContent className="p-6">
              <div className="space-y-6">
                {milestones.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                        {item.year}
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-gray-700 font-medium">{item.event}</p>
                    </div>
                    {i < milestones.length - 1 && (
                      <div className="absolute left-12 top-20 w-0.5 h-12 bg-orange-200 ml-8 -mt-6" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">平台特色</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "智能推荐",
                desc: "AI 智能助理小 paw 根据你的喜好推荐最适合的宠物伙伴",
                color: "from-yellow-400 to-orange-500",
              },
              {
                icon: Shield,
                title: "严格审核",
                desc: "多重身份验证和资质审核，确保领养人具备照顾宠物的条件",
                color: "from-blue-400 to-cyan-500",
              },
              {
                icon: Video,
                title: "视频回访",
                desc: "定期要求领养人提交宠物近况视频，确保宠物得到良好照顾",
                color: "from-purple-400 to-pink-500",
              },
            ].map((feature, i) => (
              <Card key={i} className="border-orange-100 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-orange-500 to-amber-500 border-0 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6">联系我们</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-orange-100 text-sm">邮箱</p>
                    <p className="font-medium">contact@pawfinder.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-orange-100 text-sm">电话</p>
                    <p className="font-medium">400-888-8888</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-orange-100 text-sm">地址</p>
                    <p className="font-medium">上海市浦东新区</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">和我们一起传递温暖</h2>
          <p className="text-gray-500 mb-6 max-w-xl mx-auto">
            无论你是想领养一只可爱的宠物，还是想为流浪动物奉献爱心，PawFinder 都是你的最佳选择。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pets">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold">
                <Heart className="w-5 h-5 mr-2" />
                开始领养
              </Button>
            </Link>
            <Link href="/donate">
              <Button size="lg" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                <Gift className="w-5 h-5 mr-2" />
                奉献爱心
              </Button>
            </Link>
            <Link href="/guidelines">
              <Button size="lg" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                了解更多
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
