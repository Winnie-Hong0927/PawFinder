"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface PetCardProps {
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
  className?: string;
}

const speciesLabels: Record<string, string> = {
  DOG: "狗狗",
  CAT: "猫咪",
  RABBIT: "兔子",
  BIRD: "鸟类",
  HAMSTER: "仓鼠",
  OTHER: "其他",
};

const genderLabels: Record<string, string> = {
  MALE: "公",
  FEMALE: "母",
  UNKNOWN: "未知",
};

// 后端状态枚举值（大写）
const statusConfig: Record<string, { color: string; label: string }> = {
  AVAILABLE: { color: "bg-emerald-500", label: "可领养" },
  ADOPTED: { color: "bg-gray-500", label: "已领养" },
  UNAVAILABLE: { color: "bg-amber-500", label: "暂不可领养" },
  PENDING: { color: "bg-amber-500", label: "待审核" },
};

export function PetCard({
  id,
  name,
  species,
  breed,
  age,
  gender,
  images,
  traits,
  shelter_location,
  status,
  className,
}: PetCardProps) {
  const primaryImage = images?.[0] || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400";
  
  // 使用大写状态值匹配，兼容大小写
  const upperStatus = status?.toUpperCase() || "";
  const statusInfo = statusConfig[upperStatus] || statusConfig.UNAVAILABLE;
  const statusColor = statusInfo.color;
  const statusLabel = statusInfo.label;

  return (
    <Link href={`/pets/${id}`} className="block group">
      <Card className={cn(
        "overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5 cursor-pointer border border-gray-100 group-hover:border-orange-200 bg-white rounded-xl",
        className
      )}>
        {/* Image - 4:3 aspect ratio */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50">
          <Image
            src={primaryImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          
          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <Badge className={cn("text-white shadow-sm text-[10px] px-1.5 py-0", statusColor)}>
              {statusLabel}
            </Badge>
          </div>

          {/* Favorite Button */}
          <button 
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="w-3.5 h-3.5 text-orange-500 hover:fill-orange-500 transition-all" />
          </button>
        </div>

        {/* Content - Compact */}
        <CardContent className="p-3">
          {/* Name & Species */}
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-bold text-sm text-gray-800 group-hover:text-orange-600 transition-colors truncate mr-2">{name}</h3>
            <Badge variant="secondary" className="bg-orange-50 text-orange-700 text-[10px] px-1.5 py-0 flex-shrink-0">
              {speciesLabels[species?.toUpperCase()] || species}
            </Badge>
          </div>

          {/* Info - Compact single line */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-2">
            <span className="truncate">{breed || "混血"}</span>
            <span className="text-gray-300">|</span>
            <span>{genderLabels[gender?.toUpperCase()] || "未知"}</span>
            <span className="text-gray-300">|</span>
            <span className="truncate">{age || "未知"}</span>
          </div>

          {/* Traits - Minimal */}
          {traits && traits.length > 0 && (
            <div className="flex gap-1 mb-2">
              {traits.slice(0, 2).map((trait, index) => (
                <span 
                  key={index} 
                  className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] rounded-full"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}

          {/* Location - Minimal */}
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{shelter_location || "待定"}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Pet Card Skeleton - Compact
export function PetCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-gray-100 rounded-xl">
      <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-amber-50 animate-pulse" />
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-12" />
        </div>
        <div className="h-3 bg-gray-100 animate-pulse rounded w-full" />
        <div className="flex gap-1">
          <div className="h-4 bg-gray-100 animate-pulse rounded w-12" />
          <div className="h-4 bg-gray-100 animate-pulse rounded w-12" />
        </div>
      </CardContent>
    </Card>
  );
}
