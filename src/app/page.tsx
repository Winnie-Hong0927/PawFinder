"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PetCard, PetCardSkeleton } from "@/components/pet/pet-card";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, Gift, PawPrint, ArrowRight, Star, Shield, Clock } from "lucide-react";

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
  { icon: Heart, value: "2,500+", label: "成功领养" },
  { icon: PawPrint, value: "5,000+", label: "待领养宠物" },
  { icon: Gift, value: "10,000+", label: "爱心捐赠" },
  { icon: Star, value: "98%", label: "满意度" },
];

const features = [
  {
    icon: Shield,
    title: "严格审核",
    description: "多重审核机制确保每位领养人都是合格的宠物家长",
  },
  {
    icon: Clock,
    title: "持续关怀",
    description: "领养后持续跟踪，定期视频回访确保宠物福祉",
  },
  {
    icon: Heart,
    title: "全程支持",
    description: "专业团队随时解答领养过程中的各类问题",
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
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPets();
  }, [selectedSpecies]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: "available",
        page: "1",
        limit: "8",
      });
      if (selectedSpecies) {
        params.append("species", selectedSpecies);
      }

      const response = await fetch(`/api/pets?${params}`);
      const data = await response.json();

      if (data.success) {
        setPets(data.pets || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] gradient-hero overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 text-8xl">🐾</div>
          <div className="absolute top-40 right-20 text-6xl">🐱</div>
          <div className="absolute bottom-20 left-1/4 text-7xl">🐕</div>
          <div className="absolute bottom-40 right-10 text-5xl">🐰</div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4 animate-fade-in">
              <Badge className="bg-primary-100 text-primary-700 px-4 py-1 text-sm">
                🏠 每一个生命都值得被爱
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                找到你的
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
                  {" "}
                  毛孩子
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                PawFinder 是一个温暖的宠物领养平台，连接流浪宠物与爱心人士。我们用严格的审核流程确保每一次领养都是负责任的选择。
              </p>
            </div>

            {/* Search Box */}
            <div className="flex flex-col md:flex-row gap-4 justify-center max-w-2xl mx-auto animate-fade-in delay-100">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="搜索你喜欢的宠物..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 rounded-xl border-2 border-primary-200 focus:border-primary-500"
                />
              </div>
              <select
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="h-14 px-4 rounded-xl border-2 border-primary-200 bg-white focus:border-primary-500 outline-none"
              >
                {speciesOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button
                size="lg"
                className="h-14 px-8 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
              >
                搜索
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 animate-fade-in delay-200">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                  <CardContent className="p-4 text-center">
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 50L60 45C120 40 240 30 360 35C480 40 600 60 720 65C840 70 960 60 1080 50C1200 40 1320 30 1380 25L1440 20V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z"
              fill="currentColor"
              className="text-background"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">为什么选择 PawFinder</h2>
            <p className="text-muted-foreground">我们致力于提供最专业、最温暖的领养服务</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pets Section */}
      <section className="py-16 bg-gradient-to-b from-background to-primary-50/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">待领养的小可爱</h2>
              <p className="text-muted-foreground">
                共 {total} 只宠物正在等待新家
              </p>
            </div>
            <Link href="/pets">
              <Button variant="outline" className="gap-2">
                查看全部
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Pet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <PetCardSkeleton key={i} />)
            ) : pets.length > 0 ? (
              pets.map((pet) => <PetCard key={pet.id} {...pet} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">暂无待领养的宠物</h3>
                <p className="text-muted-foreground">敬请期待，更多可爱宠物即将上线</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            想要帮助更多流浪宠物？
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            您的每一份捐赠都将用于宠物救助、医疗和喂养。让我们一起为流浪动物创造更好的未来。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50 gap-2"
              >
                <Gift className="w-5 h-5" />
                立即捐赠
              </Button>
            </Link>
            <Link href="/pets">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 gap-2"
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
