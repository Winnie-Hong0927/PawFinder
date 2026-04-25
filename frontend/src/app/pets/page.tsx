"use client";

import { useState, useEffect } from "react";
import { PetCard, PetCardSkeleton } from "@/components/pet/pet-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, PawPrint, ChevronRight } from "lucide-react";

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

const speciesOptions = [
  { value: "", label: "所有种类" },
  { value: "dog", label: "🐕 狗狗" },
  { value: "cat", label: "🐱 猫咪" },
  { value: "rabbit", label: "🐰 兔子" },
  { value: "bird", label: "🐦 鸟类" },
  { value: "hamster", label: "🐹 仓鼠" },
  { value: "other", label: "🐾 其他" },
];

const sizeOptions = [
  { value: "", label: "所有体型" },
  { value: "SMALL", label: "小型" },
  { value: "MEDIUM", label: "中型" },
  { value: "LARGE", label: "大型" },
];

const genderOptions = [
  { value: "", label: "全部" },
  { value: "MALE", label: "♂ 公" },
  { value: "FEMALE", label: "♀ 母" },
];

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [species, setSpecies] = useState("");
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPets();
  }, [species, size, gender]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: "available",
        page: "1",
        limit: "12",
      });
      if (species) params.append("species", species);
      if (size) params.append("size", size);
      if (gender) params.append("gender", gender);

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

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      fetchPets();
      return;
    }

    const filtered = pets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.shelter_location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setPets(filtered);
    setTotal(filtered.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-background">
      {/* Header - 更清晰的颜色对比 */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-4xl">🐾</span>
              <h1 className="text-3xl md:text-4xl font-bold">寻找你的伙伴</h1>
            </div>
            <p className="text-orange-100 max-w-xl mx-auto leading-relaxed">
              在这里，你会发现许多等待新家的可爱宠物。每一个都有自己独特的故事和性格，总有一个会打动你的心。
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-5">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  搜索
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="搜索宠物..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
              </div>

              {/* Species */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  宠物种类
                </label>
                <div className="space-y-1">
                  {speciesOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={species === option.value ? "default" : "ghost"}
                      className={`w-full justify-start text-sm ${
                        species === option.value 
                          ? "bg-orange-500 hover:bg-orange-600 text-white" 
                          : "text-gray-600 hover:bg-orange-50"
                      }`}
                      onClick={() => setSpecies(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">体型</label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant={size === option.value ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-1 ${
                        size === option.value 
                          ? "bg-orange-500 text-white border-orange-500" 
                          : "border-orange-200 text-gray-600 hover:border-orange-400"
                      }`}
                      onClick={() => setSize(option.value)}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">性别</label>
                <div className="flex gap-2">
                  {genderOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant={gender === option.value ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-1 ${
                        gender === option.value 
                          ? "bg-orange-500 text-white border-orange-500" 
                          : "border-orange-200 text-gray-600 hover:border-orange-400"
                      }`}
                      onClick={() => setGender(option.value)}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="pt-4 border-t border-orange-100">
                <p className="text-sm text-gray-500">
                  共找到 <span className="font-bold text-orange-600">{total}</span> 只宠物
                </p>
              </div>
            </div>
          </aside>

          {/* Pet Grid */}
          <div className="flex-1">
            {/* 提示文字 */}
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
              <PawPrint className="w-4 h-4 text-orange-400" />
              <span>点击卡片查看详情，开始你的领养之旅</span>
            </div>

            {loading && pets.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <PetCardSkeleton key={i} />
                ))}
              </div>
            ) : pets.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {pets.map((pet) => (
                  <PetCard key={pet.id} {...pet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-orange-100">
                <div className="text-5xl mb-3">🐾</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  暂无符合条件的宠物
                </h3>
                <p className="text-gray-500 mb-4">
                  试试调整筛选条件，或看看其他可爱的宠物吧
                </p>
                <Button
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  onClick={() => {
                    setSpecies("");
                    setSize("");
                    setGender("");
                    setSearchQuery("");
                    fetchPets();
                  }}
                >
                  清除筛选
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
