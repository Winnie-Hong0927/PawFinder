"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, ChevronRight } from "lucide-react";
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
  dog: "狗狗",
  cat: "猫咪",
  rabbit: "兔子",
  bird: "鸟类",
  hamster: "仓鼠",
  other: "其他",
};

const genderLabels: Record<string, string> = {
  male: "公",
  female: "母",
  unknown: "未知",
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
  const statusColor = 
    status === "available" ? "bg-emerald-500" : 
    status === "pending" ? "bg-amber-500" : "bg-gray-500";
  const statusLabel = 
    status === "available" ? "可领养" : 
    status === "pending" ? "待审核" : "已领养";

  return (
    <Link href={`/pets/${id}`} className="block group">
      <Card className={cn(
        "overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 cursor-pointer border-2 border-transparent group-hover:border-orange-200",
        className
      )}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-orange-50">
          <Image
            src={primaryImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={cn("text-white shadow-sm", statusColor)}>
              {statusLabel}
            </Badge>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* View Details Hint */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
            <span className="text-xs font-medium text-gray-700">查看详情</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          </div>

          {/* Favorite Button */}
          <button 
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="w-5 h-5 text-orange-500 hover:fill-orange-500 transition-all" />
          </button>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          {/* Name & Species */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition-colors">{name}</h3>
            <Badge variant="secondary" className="bg-orange-50 text-orange-700 text-xs">
              {speciesLabels[species] || species}
            </Badge>
          </div>

          {/* Info */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="font-medium">{breed || "混血"}</span>
            <span className="text-gray-300">|</span>
            <span>{genderLabels[gender] || "未知"}</span>
            <span className="text-gray-300">|</span>
            <span>{age || "未知年龄"}</span>
          </div>

          {/* Traits */}
          {traits && traits.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {traits.slice(0, 3).map((trait, index) => (
                <span 
                  key={index} 
                  className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-100"
                >
                  {trait}
                </span>
              ))}
              {traits.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                  +{traits.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-gray-400 pt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{shelter_location || "待定"}</span>
          </div>

          {/* CTA - 明确指示 */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm font-medium text-orange-500 group-hover:text-orange-600 transition-colors">
              点击领养
            </span>
            <ChevronRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Pet Card Skeleton
export function PetCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-50 animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-2/3" />
          <div className="h-5 bg-gray-200 animate-pulse rounded w-16" />
        </div>
        <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
        <div className="flex gap-1.5">
          <div className="h-5 bg-gray-100 animate-pulse rounded w-16" />
          <div className="h-5 bg-gray-100 animate-pulse rounded w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
