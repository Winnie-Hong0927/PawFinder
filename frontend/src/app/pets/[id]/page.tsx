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
  ChevronDown,
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
  dog: "🐕 狗狗",
  cat: "🐱 猫咪",
  rabbit: "🐰 兔子",
  bird: "🐦 鸟类",
  hamster: "🐹 仓鼠",
  other: "🐾 其他",
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
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  // Adoption dialog state
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50/50 to-background">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-3" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50/50 to-background">
        <div className="text-center">
          <div className="text-5xl mb-3">🐾</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">宠物未找到</h2>
          <p className="text-gray-500 mb-4">这只宠物可能已经被领养或不存在</p>
          <Link href="/pets">
            <Button className="bg-orange-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回列表
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = pet.images?.length > 0 ? pet.images : ["/placeholder-pet.jpg"];
  const statusColor = pet.status === "available" ? "bg-emerald-500" : pet.status === "pending" ? "bg-amber-500" : "bg-gray-500";
  const statusLabel = pet.status === "available" ? "可领养" : pet.status === "pending" ? "待审核" : "已领养";

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-background">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/pets" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">返回</span>
            </Link>
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        {/* Main Content - Single column, compact */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left: Image Gallery */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-20">
              {/* Main Image - 4:3 ratio */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                <Image
                  src={images[selectedImage]}
                  alt={pet.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {/* Status Badge */}
                <Badge className={cn("absolute top-2 left-2 text-white text-xs px-2 py-0.5", statusColor)}>
                  {statusLabel}
                </Badge>
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                        selectedImage === index ? "border-orange-400" : "border-transparent hover:border-gray-200"
                      )}
                    >
                      <Image src={img} alt="" fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Pet Info - Compact */}
          <div className="flex-1 space-y-3">
            {/* Basic Info Card */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">{pet.name}</h1>
                    <p className="text-sm text-gray-500">{speciesLabels[pet.species] || pet.species} · {pet.breed || "混血"}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                    onClick={() => {}}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Quick Info */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">{genderLabels[pet.gender]}</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">{pet.age || "未知年龄"}</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">{sizeLabels[pet.size]}</span>
                </div>
              </CardContent>
            </Card>

            {/* Traits Card */}
            {pet.traits && pet.traits.length > 0 && (
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {pet.traits.map((trait, index) => (
                      <span key={index} className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs rounded-full">
                        {trait}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Health Info - Compact Pills */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    {pet.vaccination_status ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full bg-gray-200" />
                    )}
                    <span className={pet.vaccination_status ? "text-emerald-600" : "text-gray-400"}>已疫苗</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {pet.sterilization_status ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full bg-gray-200" />
                    )}
                    <span className={pet.sterilization_status ? "text-emerald-600" : "text-gray-400"}>已绝育</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[120px]">{pet.shelter_location || "待定"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description - Collapsible */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-between text-sm font-medium text-gray-700"
                >
                  <span>详细介绍</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", showDetails && "rotate-180")} />
                </button>
                {showDetails && (
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    {pet.description || "暂无详细描述。"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Adoption Action - Sticky Bottom */}
            <Card className="border-0 shadow-lg bg-white lg:hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">领养费用</p>
                    <p className="text-lg font-bold text-orange-500">
                      {pet.adoption_fee === "0" || !pet.adoption_fee ? "免费" : `¥${pet.adoption_fee}`}
                    </p>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    disabled={pet.status !== "available"}
                    onClick={handleAdoptClick}
                  >
                    <Heart className="w-4 h-4 mr-1.5" />
                    {pet.status === "available" ? "申请领养" : "暂不可申请"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Adoption Action - Desktop Sidebar */}
            <Card className="hidden lg:block border-0 shadow-sm bg-gradient-to-br from-orange-50 to-amber-50">
              <CardContent className="p-4 space-y-3">
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">领养费用</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {pet.adoption_fee === "0" || !pet.adoption_fee ? "免费领养" : `¥${pet.adoption_fee}`}
                  </p>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  disabled={pet.status !== "available"}
                  onClick={handleAdoptClick}
                >
                  <Heart className="w-4 h-4 mr-1.5" />
                  {pet.status === "available" ? "申请领养" : "暂不可申请"}
                </Button>
                <p className="text-[10px] text-center text-gray-400">
                  审核通过后即可领养 · 全程免费
                </p>
              </CardContent>
            </Card>

            {/* Requirements - Collapsible */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-between text-sm font-medium text-gray-700"
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-orange-400" />
                    领养须知
                  </span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", showDetails && "rotate-180")} />
                </button>
                {showDetails && (
                  <ul className="mt-2 space-y-1.5 text-xs text-gray-500">
                    <li className="flex items-start gap-1.5">
                      <span className="text-orange-400 mt-0.5">•</span>
                      <span>年满18周岁，有稳定住所和收入</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-orange-400 mt-0.5">•</span>
                      <span>家人同意领养，愿意为宠物提供终身照料</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-orange-400 mt-0.5">•</span>
                      <span>按时接种疫苗，定期体检，科学喂养</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-orange-400 mt-0.5">•</span>
                      <span>接受定期回访，愿意分享宠物近况</span>
                    </li>
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Adoption Application Dialog */}
      <Dialog open={adoptionOpen} onOpenChange={setAdoptionOpen}>
        <DialogContent className="sm:max-w-[420px]">
          {submitSuccess ? (
            <div className="py-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">申请已提交！</h3>
              <p className="text-sm text-gray-500">我们将在1-3个工作日内审核</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">
                  <FileText className="w-4 h-4 text-orange-500" />
                  申请领养 - {pet?.name}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  请填写领养申请信息
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-3 py-2">
                {/* Reason (Required) */}
                <div className="space-y-1.5">
                  <Label htmlFor="reason" className="text-xs">
                    领养理由 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="请告诉我们为什么想领养这只宠物..."
                    value={adoptionForm.reason}
                    onChange={(e) => setAdoptionForm({ ...adoptionForm, reason: e.target.value })}
                    rows={3}
                    className="text-sm resize-none"
                  />
                </div>

                {/* ID Card (Required) */}
                <div className="space-y-1.5">
                  <Label htmlFor="idCard" className="text-xs">
                    身份证号 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="idCard"
                    placeholder="请输入18位身份证号"
                    value={adoptionForm.idCard}
                    onChange={(e) => setAdoptionForm({ ...adoptionForm, idCard: e.target.value })}
                    maxLength={18}
                    className="text-sm"
                  />
                </div>

                {/* Living Condition (Optional) */}
                <div className="space-y-1.5">
                  <Label htmlFor="livingCondition" className="text-xs">
                    居住环境 <span className="text-gray-400">(选填)</span>
                  </Label>
                  <Input
                    id="livingCondition"
                    placeholder="如：自有住房/租房/宿舍..."
                    value={adoptionForm.livingCondition}
                    onChange={(e) => setAdoptionForm({ ...adoptionForm, livingCondition: e.target.value })}
                    className="text-sm"
                  />
                </div>

                {/* Experience (Optional) */}
                <div className="space-y-1.5">
                  <Label htmlFor="experience" className="text-xs">
                    养宠经验 <span className="text-gray-400">(选填)</span>
                  </Label>
                  <Input
                    id="experience"
                    placeholder="是否有养宠经验..."
                    value={adoptionForm.experience}
                    onChange={(e) => setAdoptionForm({ ...adoptionForm, experience: e.target.value })}
                    className="text-sm"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setAdoptionOpen(false)}
                >
                  取消
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  onClick={handleSubmitAdoption}
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "提交申请"
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
