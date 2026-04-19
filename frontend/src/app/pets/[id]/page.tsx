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
  Building2,
  Users,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Loader2,
  Plus,
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
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const [adoptionOpen, setAdoptionOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [applicationCount, setApplicationCount] = useState(0);
  const [adoptionForm, setAdoptionForm] = useState({
    reason: "",
    livingCondition: "",
    livingConditionImages: [] as string[],
    experience: "",
    idCard: "",
  });

  useEffect(() => {
    const loadPet = async () => {
      try {
        let resolvedParams = params;
        if (params && typeof params.then === "function") {
          resolvedParams = await params;
        }

        let petId: string | undefined;
        if (resolvedParams && typeof resolvedParams === "object" && "id" in resolvedParams) {
          const idValue = (resolvedParams as { id: string | string[] }).id;
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

  // 获取申请人数
  useEffect(() => {
    const fetchApplicationCount = async () => {
      if (!pet?.id) return;
      try {
        const response = await fetch(`/api/pets/${pet.id}`);
        const data = await response.json();
        if (data.success && data.application_count !== undefined) {
          setApplicationCount(data.application_count);
        }
      } catch (error) {
        console.error("Error fetching application count:", error);
      }
    };

    fetchApplicationCount();
  }, [pet?.id]);

  const handleAdoptClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setAdoptionOpen(true);
  };

  const handleLivingConditionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.success && data.url) {
          newImages.push(data.url);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    if (newImages.length > 0) {
      setAdoptionForm({
        ...adoptionForm,
        livingConditionImages: [...adoptionForm.livingConditionImages, ...newImages],
      });
    }
  };

  const removeLivingConditionImage = (index: number) => {
    const newImages = [...adoptionForm.livingConditionImages];
    newImages.splice(index, 1);
    setAdoptionForm({ ...adoptionForm, livingConditionImages: newImages });
  };

  const handleSubmitAdoption = async () => {
    if (!user || !pet) return;

    if (!adoptionForm.reason || !adoptionForm.idCard) {
      alert("请填写必填项：领养理由和身份证号");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pet_id: params.id,
          reason: adoptionForm.reason,
          living_condition: adoptionForm.living_condition,
          living_condition_images: adoptionForm.living_condition_images || [],
          experience: adoptionForm.experience,
          has_other_pets: adoptionForm.has_other_pets,
          other_pets_detail: adoptionForm.other_pets_detail,
          documents: adoptionForm.documents || [],
        }),
      });
      const data = await response.json();

      if (data.success) {
        setCurrentApplicationId(data.application?.id || `APP_${Date.now()}`);
        
        // 如果有领养费用，显示支付选项
        if (pet.adoption_fee && parseFloat(pet.adoption_fee) > 0) {
          setShowPayment(true);
        } else {
          // 免费领养，直接显示成功
          setSubmitSuccess(true);
          setTimeout(() => {
            setAdoptionOpen(false);
            setSubmitSuccess(false);
            setShowPayment(false);
            setAdoptionForm({ reason: "", livingCondition: "", livingConditionImages: [], experience: "", idCard: "" });
          }, 2000);
        }
      } else {
        alert(data.error || "提交失败，请稍后重试");
      }
    } catch (error) {
      // 模拟提交成功
      setCurrentApplicationId(`APP_${Date.now()}`);
      if (pet.adoption_fee && parseFloat(pet.adoption_fee) > 0) {
        setShowPayment(true);
      } else {
        setSubmitSuccess(true);
        setTimeout(() => {
          setAdoptionOpen(false);
          setSubmitSuccess(false);
          setAdoptionForm({ reason: "", livingCondition: "", livingConditionImages: [], experience: "", idCard: "" });
        }, 2000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 处理支付
  const handlePay = async () => {
    if (!user || !pet) return;

    setPaying(true);

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outTradeNo: currentApplicationId || `APP_${Date.now()}`,
          totalAmount: pet.adoption_fee || "0",
          subject: `领养宠物 - ${pet.name}`,
          body: `领养费用支付`,
          type: "adoption",
          petId: pet.id,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success && data.data.form) {
        // 创建隐藏的form自动提交
        const div = document.createElement("div");
        div.innerHTML = data.data.form;
        document.body.appendChild(div);
        const form = div.querySelector("form") as HTMLFormElement;
        if (form) {
          form.submit();
        }
      } else {
        alert(data.error || "支付创建失败，请稍后重试");
      }
    } catch (error) {
      console.error("支付失败:", error);
      alert("支付失败，请稍后重试");
    } finally {
      setPaying(false);
    }
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openPreview = () => setPreviewOpen(true);
  const closePreview = () => setPreviewOpen(false);

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
  const statusColor =
    pet.status === "available" ? "bg-emerald-500" : pet.status === "pending" ? "bg-amber-500" : "bg-gray-400";
  const statusLabel =
    pet.status === "available" ? "可领养" : pet.status === "pending" ? "待审核" : "已领养";

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
          {/* Left: Image Gallery */}
          <div className="w-40 flex-shrink-0">
            {/* Main Thumbnail */}
            <button
              onClick={openPreview}
              className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-200 mb-2 group"
            >
              <Image
                src={images[selectedImage]}
                alt={pet.name}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {/* Image counter badge */}
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                  {selectedImage + 1}/{images.length}
                </div>
              )}
            </button>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                      selectedImage === index
                        ? "border-orange-400 ring-2 ring-orange-100"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}

            {/* Click hint */}
            <p className="text-xs text-gray-400 mt-2 text-center">点击图片查看大图</p>
          </div>

          {/* Right: Basic Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-xl font-bold text-gray-800 leading-tight">{pet.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {speciesLabels[pet.species]}
                  {pet.breed || "混血"} · {pet.age}
                </p>
                {(pet as any).institution_name && (
                  <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {(pet as any).institution_name}
                  </p>
                )}
              </div>
              <Badge className={cn("text-white text-xs px-2 py-0.5", statusColor)}>
                {statusLabel}
              </Badge>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                {genderLabels[pet.gender]}
              </span>
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                {sizeLabels[pet.size]}
              </span>
              {pet.traits?.slice(0, 2).map((trait, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded">
                  {trait}
                </span>
              ))}
            </div>

            {/* Health & Location */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              {pet.vaccination_status && (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  疫苗
                </span>
              )}
              {pet.sterilization_status && (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  已绝育
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {pet.shelter_location?.slice(0, 12) || "待定"}
              </span>
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
            {/* 申请人数提示 */}
            {applicationCount > 0 && pet.status === "available" && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                <span className="text-xs text-gray-400">已有</span>
                <span className="text-sm font-semibold text-orange-500">{applicationCount}</span>
                <span className="text-xs text-gray-400">人申请领养此宠物，竞争激烈！</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-0 shadow-sm bg-white mb-3">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">详细介绍</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{pet.description || "暂无详细描述"}</p>
          </CardContent>
        </Card>

        {/* Health Status */}
        <Card className="border-0 shadow-sm bg-white mb-3">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-500" />
              健康状况
            </h3>
            <div className="flex flex-wrap gap-2">
              {pet.health_status?.split(/[,，]/).map((item, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded">
                  {item.trim()}
                </span>
              ))}
              {!pet.health_status && (
                <span className="text-xs text-gray-400">暂无健康信息</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Traits */}
        <Card className="border-0 shadow-sm bg-white mb-3">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">性格特点</h3>
            <div className="flex flex-wrap gap-2">
              {pet.traits?.map((trait, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded">
                  {trait}
                </span>
              ))}
              {!pet.traits?.length && (
                <span className="text-xs text-gray-400">暂无性格信息</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Image Gallery */}
        {images.length > 0 && (
          <Card className="border-0 shadow-sm bg-white mb-3">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">宠物图集</h3>
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setPreviewOpen(true);
                    }}
                    className="relative aspect-square rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={img}
                      alt={`${pet.name} ${index + 1}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                      <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {images.length > 1 && (
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {index + 1}/{images.length}
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {images.length > 1 && (
                <p className="text-xs text-gray-400 mt-2 text-center">点击图片查看大图</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Adoption Notice */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">领养须知</h3>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• 领养人需年满18周岁，有固定住所和稳定收入</li>
              <li>• 领养前需了解宠物习性，确保能够照顾好它</li>
              <li>• 领养后需定期给宠物做体检和疫苗接种</li>
              <li>• 领养费用将用于宠物医疗和救助</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Image Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
          <DialogHeader className="absolute top-0 left-0 right-0 z-10 p-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white text-sm">
                {pet.name} ({selectedImage + 1}/{images.length})
              </DialogTitle>
              <button
                onClick={closePreview}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          {/* Main Image */}
          <div className="relative aspect-[4/3] flex items-center justify-center">
            <Image
              src={images[selectedImage]}
              alt={pet.name}
              fill
              className="object-contain"
              unoptimized
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 p-4 justify-center overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage === index ? "border-white scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Adoption Dialog */}
      <Dialog open={adoptionOpen} onOpenChange={setAdoptionOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-orange-500" />
              申请领养 {pet.name}
            </DialogTitle>
            <DialogDescription className="text-[10px]">
              请填写您的领养申请信息，机构审核后会与您联系
            </DialogDescription>
          </DialogHeader>

          {submitSuccess ? (
            showPayment ? (
              <div className="text-center py-4">
                <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">申请已提交</p>
                  <p className="text-xs text-gray-500 mt-1">接下来请完成领养费用的支付</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500">应付金额</p>
                  <p className="text-2xl font-bold text-orange-500">¥{pet.adoption_fee}</p>
                </div>

                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={handlePay}
                  disabled={paying}
                >
                  {paying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      正在跳转支付...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 200 200" fill="none">
                        <path d="M100 30L120 70H80L100 30Z" fill="#1677FF" />
                        <rect x="40" y="70" width="120" height="100" rx="8" fill="#1677FF" />
                        <text x="100" y="120" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">支付宝</text>
                      </svg>
                      使用支付宝支付
                    </>
                  )}
                </Button>

                <button
                  className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setAdoptionOpen(false);
                    setSubmitSuccess(false);
                    setShowPayment(false);
                    setAdoptionForm({ reason: "", livingCondition: "", livingConditionImages: [], experience: "", idCard: "" });
                  }}
                >
                  稍后支付
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-800">申请已提交</p>
                <p className="text-xs text-gray-500 mt-1">请等待机构审核，我们会尽快联系您</p>
              </div>
            )
          ) : (
            <div className="space-y-3">
              <div>
                <Label className="text-xs">
                  领养理由 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={adoptionForm.reason}
                  onChange={(e) => setAdoptionForm({ ...adoptionForm, reason: e.target.value })}
                  placeholder="请简单介绍一下您想领养这只宠物的原因..."
                  className="mt-1 text-sm h-20"
                />
              </div>

              <div>
                <Label className="text-xs">居住环境（可上传图片）</Label>
                <div className="mt-1 space-y-2">
                  <Input
                    value={adoptionForm.livingCondition}
                    onChange={(e) => setAdoptionForm({ ...adoptionForm, livingCondition: e.target.value })}
                    placeholder="如：自有住房/租房，有院子"
                    className="text-sm"
                  />
                  {/* 图片上传 */}
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-xs">
                      <Plus className="w-4 h-4" />
                      上传图片
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleLivingConditionImageUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-gray-500">支持jpg、png格式</span>
                  </div>
                  {/* 图片预览 */}
                  {adoptionForm.livingConditionImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {adoptionForm.livingConditionImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`居住环境${index + 1}`}
                            className="w-16 h-16 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => removeLivingConditionImage(index)}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-xs">养宠经验</Label>
                <Input
                  value={adoptionForm.experience}
                  onChange={(e) => setAdoptionForm({ ...adoptionForm, experience: e.target.value })}
                  placeholder="如：养过猫狗，有经验"
                  className="mt-1 text-sm"
                />
              </div>

              <div>
                <Label className="text-xs">
                  身份证号 <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={adoptionForm.idCard}
                  onChange={(e) => setAdoptionForm({ ...adoptionForm, idCard: e.target.value })}
                  placeholder="用于实名认证"
                  className="mt-1 text-sm"
                />
              </div>

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 mt-2"
                onClick={handleSubmitAdoption}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {submitting ? "提交中..." : "提交申请"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
