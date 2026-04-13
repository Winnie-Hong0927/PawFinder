"use client";

import { useState, useEffect } from "react";
import { PetCard, PetCardSkeleton } from "@/components/pet/pet-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, PawPrint } from "lucide-react";

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
  { value: "small", label: "小型" },
  { value: "medium", label: "中型" },
  { value: "large", label: "大型" },
];

const genderOptions = [
  { value: "", label: "所有性别" },
  { value: "male", label: "♂ 公" },
  { value: "female", label: "♀ 母" },
];

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [species, setSpecies] = useState("");
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchPets(true);
  }, [species, size, gender]);

  const fetchPets = async (reset = false) => {
    if (reset) {
      setPage(1);
      setLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        status: "available",
        page: reset ? "1" : page.toString(),
        limit: "12",
      });
      if (species) params.append("species", species);

      const response = await fetch(`/api/pets?${params}`);
      const data = await response.json();

      if (data.success) {
        if (reset) {
          setPets(data.pets || []);
        } else {
          setPets((prev) => [...prev, ...(data.pets || [])]);
        }
        setTotal(data.total || 0);
        setHasMore((data.pets || []).length === 12);
      }
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // 简单的客户端搜索过滤
    if (!searchQuery.trim()) {
      fetchPets(true);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <PawPrint className="w-8 h-8" />
              <h1 className="text-4xl font-bold">寻找你的伙伴</h1>
            </div>
            <p className="text-primary-100 max-w-2xl mx-auto">
              在这里，你会发现许多等待新家的可爱宠物。每一个都有自己独特的故事和性格，总有一个会打动你的心。
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">搜索</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="搜索宠物..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              </div>

              {/* Species */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  宠物种类
                </label>
                <div className="space-y-1">
                  {speciesOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={species === option.value ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSpecies(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">体型</label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant={size === option.value ? "default" : "outline"}
                      className={`cursor-pointer ${
                        size === option.value ? "bg-primary-500" : ""
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
                <label className="text-sm font-medium text-foreground">性别</label>
                <div className="flex flex-wrap gap-2">
                  {genderOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant={gender === option.value ? "default" : "outline"}
                      className={`cursor-pointer ${
                        gender === option.value ? "bg-primary-500" : ""
                      }`}
                      onClick={() => setGender(option.value)}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  共找到 <span className="font-semibold text-foreground">{total}</span> 只宠物
                </p>
              </div>
            </div>
          </aside>

          {/* Pet Grid */}
          <div className="flex-1">
            {loading && pets.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PetCardSkeleton key={i} />
                ))}
              </div>
            ) : pets.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pets.map((pet) => (
                    <PetCard key={pet.id} {...pet} />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPage((p) => p + 1);
                        fetchPets();
                      }}
                      disabled={loading}
                    >
                      {loading ? "加载中..." : "加载更多"}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  暂无符合条件的宠物
                </h3>
                <p className="text-muted-foreground mb-4">
                  试试调整筛选条件，或看看其他可爱的宠物吧
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSpecies("");
                    setSize("");
                    setGender("");
                    setSearchQuery("");
                    fetchPets(true);
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
