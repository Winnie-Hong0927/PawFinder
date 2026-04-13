"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar } from "lucide-react";
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
  const primaryImage = images?.[0] || "/placeholder-pet.jpg";
  const statusColor = status === "available" ? "bg-green-500" : status === "pending" ? "bg-yellow-500" : "bg-gray-500";
  const statusLabel = status === "available" ? "可领养" : status === "pending" ? "待审核" : "已领养";

  return (
    <Link href={`/pets/${id}`}>
      <Card className={cn("overflow-hidden card-hover cursor-pointer", className)}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={primaryImage}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
            unoptimized
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={cn("text-white", statusColor)}>
              {statusLabel}
            </Badge>
          </div>

          {/* Favorite Button */}
          <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
            <Heart className="w-5 h-5 text-primary-500 hover:fill-primary-500 transition-all" />
          </button>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          {/* Name & Species */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-foreground">{name}</h3>
            <Badge variant="secondary" className="bg-primary-50 text-primary-700">
              {speciesLabels[species] || species}
            </Badge>
          </div>

          {/* Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{breed || "混血"}</span>
            <span>|</span>
            <span>{genderLabels[gender] || "未知"}</span>
            <span>|</span>
            <span>{age || "未知年龄"}</span>
          </div>

          {/* Traits */}
          {traits && traits.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {traits.slice(0, 3).map((trait, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {trait}
                </Badge>
              ))}
              {traits.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{traits.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{shelter_location || "待定"}</span>
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
      <div className="aspect-square bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-6 bg-muted animate-pulse rounded w-2/3" />
        <div className="h-4 bg-muted animate-pulse rounded w-full" />
        <div className="flex gap-1">
          <div className="h-6 bg-muted animate-pulse rounded w-16" />
          <div className="h-6 bg-muted animate-pulse rounded w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
