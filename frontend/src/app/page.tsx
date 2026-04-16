"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PetCard, PetCardSkeleton } from "@/components/pet/pet-card";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, Gift, PawPrint, ArrowRight, Star, Shield, Clock, Sparkles, Zap } from "lucide-react";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  images: string[];
  traits: string[];
  shelter_location: string;
  status: string;
}

const stats = [
  { icon: Heart, value: "2,500+", label: "成功领养", color: "text-pink-500" },
  { icon: PawPrint, value: "5,000+", label: "待领养宠物", color: "text-orange-500" },
  { icon: Gift, value: "10,000+", label: "爱心捐赠", color: "text-emerald-500" },
  { icon: Star, value: "98%", label: "满意度", color: "text-yellow-500" },
];

const features = [
  {
    icon: Shield,
    title: "严格审核",
    description: "多重审核机制确保每位领养人都是合格的宠物家长",
    emoji: "🔒",
  },
  {
    icon: Clock,
    title: "持续关怀",
    description: "领养后持续跟踪，定期视频回访确保宠物福祉",
    emoji: "💝",
  },
  {
    icon: Heart,
    title: "全程支持",
    description: "专业团队随时解答领养过程中的各类问题",
    emoji: "🤗",
  },
];

const speciesOptions = [
  { value: "", label: "所有种类" },
  { value: "dog", label: "🐕 狗狗" },
  { value: "cat", label: "🐱 猫咪" },
  { value: "rabbit", label: "🐰 兔子" },
  { value: "bird", label: "🐦 鸟类" },
  { value: "hamster", label: "🐹 仓鼠" },
];

export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: "available",
        page: "1",
        limit: "4",
      });
      if (selectedSpecies) {
        params.append("species", selectedSpecies);
      }

      const response = await fetch(`/api/pets?${params}`);
      const data = await response.json();

      if (data.success) {
        setPets(data.pets || []);
      }
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section - 更简洁 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
        {/* 装饰性背景元素 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-200 rounded-full opacity-30 blur-3xl" />
          <div className="absolute top-20 -left-10 w-60 h-60 bg-amber-200 rounded-full opacity-40 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-100 rounded-full opacity-50 blur-3xl" />
        </div>

        {/* 浮动装饰 */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-16 left-[10%] text-4xl animate-bounce-soft opacity-60">🐾</span>
          <span className="absolute top-32 right-[15%] text-3xl animate-bounce-soft delay-200 opacity-50">🐱</span>
          <span className="absolute bottom-20 left-[20%] text-3xl animate-bounce-soft delay-300 opacity-50">🐕</span>
          <span className="absolute top-1/2 right-[8%] text-2xl animate-bounce-soft delay-400 opacity-40">🐰</span>
        </div>

        <div className="container mx-auto px-4 pt-10 pb-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="mb-5 animate-fade-in">
              <Badge className="bg-white/90 text-orange-600 px-4 py-2 text-sm font-medium shadow-sm border border-orange-200 hover:bg-white">
                <Sparkles className="w-4 h-4 mr-2" />
                每一个生命都值得被爱
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="animate-fade-in delay-100">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                <span className="text-gray-800">找到你的</span>
                <span className="text-orange-500 ml-2">毛孩子</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-xl mx-auto leading-relaxed">
                PawFinder 是一个温暖的宠物领养平台，连接流浪宠物与爱心人士。我们用严格的审核流程确保每一次领养都是负责任的选择。
              </p>
            </div>

            {/* Stats - 更紧凑 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto animate-fade-in delay-200 mt-8">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-3 text-center">
                    <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                    <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* 波浪分隔线 */}
        <div className="h-8 bg-gradient-to-b from-orange-100 to-background" />
      </section>

      {/* Features Section */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              为什么选择 PawFinder
            </h2>
            <p className="text-gray-500">我们致力于提供最专业、最温暖的领养服务</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-md bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{feature.emoji}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pets Section - 搜索框移到宠物展示上方 */}
      <section className="py-8 bg-gradient-to-b from-background to-orange-50/50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🐾</span>
                待领养的小可爱
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                还有很多可爱的小家伙在等你哦
              </p>
            </div>
            <Link href="/pets">
              <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50 gap-2">
                查看全部宠物
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Search Box - 移到宠物展示上方 */}
          <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="搜索你喜欢的宠物名字、品种..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-2 border-orange-200 focus:border-orange-400 bg-white text-gray-800 placeholder:text-gray-400"
                />
              </div>
              <select
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="h-12 px-4 rounded-xl border-2 border-orange-200 bg-white focus:border-orange-400 outline-none text-gray-700"
              >
                {speciesOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button
                size="lg"
                onClick={fetchPets}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium shadow-md transition-all hover:shadow-lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                搜索
              </Button>
            </div>
          </div>

          {/* Pet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <PetCardSkeleton key={i} />)
            ) : pets.length > 0 ? (
              pets.map((pet) => <PetCard key={pet.id} {...pet} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-5xl mb-3">🐾</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">暂无待领养的宠物</h3>
                <p className="text-gray-500">敬请期待，更多可爱宠物即将上线</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section - 修复按钮颜色 */}
      <section className="py-14 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            想要帮助更多流浪宠物？
          </h2>
          <p className="text-orange-100 mb-6 max-w-xl mx-auto">
            您的每一份捐赠都将用于宠物救助、医疗和喂养。让我们一起为流浪动物创造更好的未来。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/donate">
              <Button
                size="lg"
                className="bg-white text-orange-700 hover:bg-orange-50 gap-2 shadow-lg font-semibold min-w-[140px]"
              >
                <Gift className="w-5 h-5" />
                立即捐赠
              </Button>
            </Link>
            <Link href="/pets">
              <Button
                size="lg"
                className="bg-orange-700 text-white hover:bg-orange-800 gap-2 shadow-lg font-semibold min-w-[140px]"
              >
                <Heart className="w-5 h-5" />
                领养宠物
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
