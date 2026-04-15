"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Heart,
  MapPin,
  Shield,
  CheckCircle,
  ArrowLeft,
  Share2,
  FileText,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  health_status: string;
  vaccination_status: boolean;
  sterilization_status: boolean;
  shelter_location: string;
  adoption_fee: string;
  description: string;
  status: string;
}

const speciesLabels: Record<string, string> = {
  dog: "🐕",
  cat: "🐱",
  rabbit: "🐰",
  bird: "🐦",
  hamster: "🐹",
  other: "🐾",
};

const genderLabels: Record<string, string> = {
  male: "公",
  female: "母",
  unknown: "未知",
};

const sizeLabels: Record<string, string> = {
  small: "小型",
  medium: "中型",
  large: "大型",
};

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const [adoptionOpen, setAdoptionOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [adoptionForm, setAdoptionForm] = useState({
    reason: "",
    livingCondition: "",
    experience: "",
    idCard: "",
  });

  useEffect(() => {
    const loadPet = async () => {
      try {
        let resolvedParams = params;
        if (params && typeof params.then === 'function') {
          resolvedParams = await params;
        }
        
        let petId: string | undefined;
        if (resolvedParams && typeof resolvedParams === 'object' && 'id' in resolvedParams) {
          const idValue = (resolvedParams as {id: string | string[]}).id;
          petId = Array.isArray(idValue) ? idValue[0] : idValue;
        }
        
        if (petId) {
          const response = await fetch(`/api/pets/${petId}`);
          const data = await response.json();
          if (data.success) {
            setPet(data.pet);
          }
        }
      } catch (error) {
        console.error("Error loading pet:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPet();
  }, [params]);

  const handleAdoptClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setAdoptionOpen(true);
  };

  const handleSubmitAdoption = async () => {
    if (!user || !pet) return;
    
    if (!adoptionForm.reason || !adoptionForm.idCard) {
      alert("请填写必填项：领养理由和身份证号");
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch("/api/adoptions/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petId: pet.id,
          ...adoptionForm,
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setAdoptionOpen(false);
          setSubmitSuccess(false);
          setAdoptionForm({ reason: "", livingCondition: "", experience: "", idCard: "" });
        }, 2000);
      } else {
        alert(data.error || "提交失败，请稍后重试");
      }
    } catch (error) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setAdoptionOpen(false);
        setSubmitSuccess(false);
        setAdoptionForm({ reason: "", livingCondition: "", experience: "", idCard: "" });
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-2">🐾</div>
          <h2 className="text-lg font-medium text-gray-800 mb-1">宠物未找到</h2>
          <p className="text-sm text-gray-500 mb-3">这只宠物可能已经被领养或不存在</p>
          <Link href="/pets">
            <Button size="sm" className="bg-orange-500">返回列表</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = pet.images?.length > 0 ? pet.images : ["/placeholder-pet.jpg"];
  const statusColor = pet.status === "available" ? "bg-emerald-500" : pet.status === "pending" ? "bg-amber-500" : "bg-gray-400";
  const statusLabel = pet.status === "available" ? "可领养" : pet.status === "pending" ? "待审核" : "已领养";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/pets" className="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-500">
            <ArrowLeft className="w-4 h-4" />
            返回
          </Link>
          <span className="text-xs text-gray-400">宠物详情</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Top Section: Image + Basic Info side by side */}
        <div className="flex gap-4 mb-3">
          {/* Left: Small Thumbnail Grid */}
          <div className="w-32 flex-shrink-0">
            <div className="grid grid-cols-2 gap-1.5">
              {images.slice(0, 4).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden border-2",
                    selectedImage === index ? "border-orange-400" : "border-gray-200"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
            {images.length > 4 && (
              <p className="text-xs text-gray-400 mt-1 text-center">+{images.length - 4}张照片</p>
            )}
          </div>
          
          {/* Right: Basic Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-xl font-bold text-gray-800 leading-tight">{pet.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{speciesLabels[pet.species]}{pet.breed || "混血"} · {pet.age}</p>
              </div>
              <Badge className={cn("text-white text-xs px-2 py-0.5", statusColor)}>
                {statusLabel}
              </Badge>
            </div>
            
            {/* Quick tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{genderLabels[pet.gender]}</span>
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{sizeLabels[pet.size]}</span>
              {pet.traits?.slice(0, 2).map((trait, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded">{trait}</span>
              ))}
            </div>
            
            {/* Health & Location */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              {pet.vaccination_status && (
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" />疫苗</span>
              )}
              {pet.sterilization_status && (
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" />已绝育</span>
              )}
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{pet.shelter_location?.slice(0, 12) || "待定"}</span>
            </div>
          </div>
        </div>

        {/* Adopting Card */}
        <Card className="border-0 shadow-sm bg-white mb-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">领养费用</span>
                <span className="text-xl font-bold text-orange-500">
                  {pet.adoption_fee === "0" || !pet.adoption_fee ? "免费" : `¥${pet.adoption_fee}`}
                </span>
              </div>
              <Button 
                size="sm" 
                className="h-8 text-sm bg-gradient-to-r from-orange-500 to-amber-500 px-4"
                disabled={pet.status !== "available"}
                onClick={handleAdoptClick}
              >
                <Heart className="w-4 h-4 mr-1.5" />
                {pet.status === "available" ? "申请领养" : "暂不可申请"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-0 shadow-sm bg-white mb-3">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">详细介绍</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {pet.description || "暂无详细描述。"}
            </p>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="border-0 shadow-sm bg-white mb-3">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-orange-400" />
              领养须知
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 年满18周岁，有稳定住所和收入</li>
              <li>• 家人同意领养，愿意为宠物提供终身照料</li>
              <li>• 按时接种疫苗，定期体检，科学喂养</li>
              <li>• 接受定期回访</li>
            </ul>
          </CardContent>
        </Card>

        {/* All Traits */}
        {pet.traits && pet.traits.length > 0 && (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">特征标签</h3>
              <div className="flex flex-wrap gap-2">
                {pet.traits.map((trait, i) => (
                  <span key={i} className="text-sm px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full">{trait}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Adoption Dialog */}
      <Dialog open={adoptionOpen} onOpenChange={setAdoptionOpen}>
        <DialogContent className="sm:max-w-[400px]">
          {submitSuccess ? (
            <div className="py-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-gray-800">申请已提交！</h3>
              <p className="text-xs text-gray-500 mt-1">我们将在1-3个工作日内审核</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-orange-500" />
                  申请领养 - {pet?.name}
                </DialogTitle>
                <DialogDescription className="text-[10px]">
                  请填写领养申请信息
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-2.5 py-1">
                <div className="space-y-1">
                  <Label htmlFor="reason" className="text-[11px]">领养理由 <span className="text-red-500">*</span></Label>
                  <Textarea
                    id="reason"
                    placeholder="请告诉我们为什么想领养..."
                    value={adoptionForm.reason}
                    onChange={(e) => setAdoptionForm({ ...adoptionForm, reason: e.target.value })}
                    rows={2}
                    className="text-xs resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="idCard" className="text-[11px]">身份证号 <span className="text-red-500">*</span></Label>
                  <Input
                    id="idCard"
                    placeholder="18位身份证号"
                    value={adoptionForm.idCard}
                    onChange={(e) => setAdoptionForm({ ...adoptionForm, idCard: e.target.value })}
                    maxLength={18}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="livingCondition" className="text-[11px]">居住环境 <span className="text-gray-400">(选填)</span></Label>
                  <Input
                    id="livingCondition"
                    placeholder="自有住房/租房..."
                    value={adoptionForm.livingCondition}
                    onChange={(e) => setAdoptionForm({ ...adoptionForm, livingCondition: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => setAdoptionOpen(false)}>取消</Button>
                <Button size="sm" className="flex-1 text-xs h-8 bg-orange-500" onClick={handleSubmitAdoption} disabled={submitting}>
                  {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : "提交申请"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
        </Dialog>
    </div>
  );
}
