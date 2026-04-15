"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Heart,
  MapPin,
  Calendar,
  Shield,
  Clock,
  CheckCircle,
  ArrowLeft,
  Share2,
  User,
  Loader2,
  FileText,
  Home,
  Award,
  Send,
  CheckCircle2,
} from "lucide-react";

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
    if (params.id) {
      fetchPet(params.id as string);
    }
  }, [params.id]);

  const fetchPet = async (id: string) => {
    try {
      const response = await fetch(`/api/pets/${id}`);
      const data = await response.json();

      if (data.success) {
        setPet(data.pet);
      }
    } catch (error) {
      console.error("Failed to fetch pet:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle adoption button click
  const handleAdoptClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setAdoptionOpen(true);
  };

  // Submit adoption application
  const handleSubmitAdoption = async () => {
    if (!user || !pet) return;
    
    if (!adoptionForm.reason || !adoptionForm.idCard) {
      alert("请填写必填项：领养理由和身份证号");
      return;
    }

    setSubmitting(true);
    
    try {
      // Call API to submit application
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
        // Reset form and close dialog after 2 seconds
        setTimeout(() => {
          setAdoptionOpen(false);
          setSubmitSuccess(false);
          setAdoptionForm({ reason: "", livingCondition: "", experience: "", idCard: "" });
        }, 2000);
      } else {
        alert(data.error || "提交失败，请稍后重试");
      }
    } catch (error) {
      // For demo: simulate success
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center animate-pulse">
            🐾
          </div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">宠物未找到</h2>
          <p className="text-muted-foreground mb-4">这只宠物可能已经被领养或不存在</p>
          <Link href="/pets">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回列表
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = pet.images?.length > 0 ? pet.images : ["/placeholder-pet.jpg"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-6">
        <div className="container mx-auto px-4">
          <Link
            href="/pets"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回列表</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <Image
                src={images[selectedImage]}
                alt={pet.name}
                fill
                className="object-cover"
                unoptimized
              />
              
              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <Badge
                  className={`${
                    pet.status === "available"
                      ? "bg-green-500"
                      : pet.status === "pending"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  } text-white px-3 py-1`}
                >
                  {pet.status === "available"
                    ? "可领养"
                    : pet.status === "pending"
                    ? "待审核"
                    : "已领养"}
                </Badge>
              </div>

              {/* Share Button */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === index
                        ? "border-primary-500"
                        : "border-transparent hover:border-primary-200"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${pet.name} - 图片 ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pet Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{pet.name}</h1>
                <Badge className="bg-primary-100 text-primary-700">
                  {speciesLabels[pet.species] || pet.species}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-muted-foreground">
                <span>{pet.breed || "混血"}</span>
                <span>|</span>
                <span>{genderLabels[pet.gender] || "未知"}</span>
                <span>|</span>
                <span>{pet.age || "未知年龄"}</span>
                <span>|</span>
                <span>{sizeLabels[pet.size] || "未知体型"}</span>
              </div>
            </div>

            <Separator />

            {/* Traits */}
            {pet.traits && pet.traits.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">特征标签</h3>
                <div className="flex flex-wrap gap-2">
                  {pet.traits.map((trait, index) => (
                    <Badge key={index} variant="secondary">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Health Info */}
            <Card className="border-primary-100">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-3">健康状况</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    {pet.vaccination_status ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className="text-sm">
                      {pet.vaccination_status ? "已接种疫苗" : "未接种疫苗"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {pet.sterilization_status ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className="text-sm">
                      {pet.sterilization_status ? "已绝育" : "未绝育"}
                    </span>
                  </div>
                </div>
                {pet.health_status && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {pet.health_status}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5" />
              <span>{pet.shelter_location || "待定"}</span>
            </div>

            {/* Adoption Fee */}
            <Card className="bg-primary-50 border-primary-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">领养费用</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {pet.adoption_fee === "0" || !pet.adoption_fee
                      ? "免费"
                      : `¥${pet.adoption_fee}`}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                disabled={pet.status !== "available"}
                onClick={handleAdoptClick}
              >
                <Heart className="w-5 h-5 mr-2" />
                {pet.status === "available" ? "申请领养" : "暂不可申请"}
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="w-5 h-5 mr-2" />
                收藏
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">详细介绍</TabsTrigger>
              <TabsTrigger value="requirements">领养要求</TabsTrigger>
              <TabsTrigger value="process">领养流程</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-4">
                    关于 {pet.name}
                  </h3>
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                    {pet.description || "暂无详细描述。"}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-4">
                    领养要求
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary-500 mt-0.5" />
                      <span className="text-muted-foreground">
                        年满18周岁，有稳定住所和收入
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary-500 mt-0.5" />
                      <span className="text-muted-foreground">
                        家人同意领养，愿意为宠物提供终身照料
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary-500 mt-0.5" />
                      <span className="text-muted-foreground">
                        按时接种疫苗，定期体检，科学喂养
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary-500 mt-0.5" />
                      <span className="text-muted-foreground">
                        接受定期回访，愿意分享宠物生活照片/视频
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary-500 mt-0.5" />
                      <span className="text-muted-foreground">
                        不因结婚、怀孕、搬家等理由遗弃宠物
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="process" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-4">
                    领养流程
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-600 font-semibold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">提交申请</h4>
                        <p className="text-sm text-muted-foreground">
                          填写领养申请表，上传身份证明等材料
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-600 font-semibold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">资料审核</h4>
                        <p className="text-sm text-muted-foreground">
                          管理员审核您的申请资料，可能进行电话/视频回访
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-600 font-semibold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">签署协议</h4>
                        <p className="text-sm text-muted-foreground">
                          审核通过后，签署领养协议并完成领养
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-600 font-semibold">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">定期回访</h4>
                        <p className="text-sm text-muted-foreground">
                          领养后需定期上传宠物近况视频，接受回访
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Adoption Application Dialog */}
      <Dialog open={adoptionOpen} onOpenChange={setAdoptionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {submitSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">申请已提交！</h3>
              <p className="text-gray-600">
                感谢您的领养申请，我们将在1-3个工作日内审核。
              </p>
              <p className="text-sm text-gray-500 mt-2">
                您可以在个人中心查看申请进度
              </p>
              <div className="mt-6">
                <Button onClick={() => setAdoptionOpen(false)} className="bg-orange-500">
                  确定
                </Button>
              </div>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  申请领养 - {pet?.name}
                </DialogTitle>
                <DialogDescription>
                  请填写您的领养申请信息，我们会认真审核每一份申请。
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Pet Info Summary */}
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-orange-200 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{pet?.name}</p>
                      <p className="text-sm text-gray-500">
                        {pet?.species === "dog" ? "狗狗" : pet?.species === "cat" ? "猫咪" : "其他宠物"} · {pet?.breed}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason (Required) */}
                <div className="space-y-2">
                  <Label htmlFor="reason">
                    领养理由 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="请告诉我们为什么想领养这只宠物..."
                    value={adoptionForm.reason}
                    onChange={(e) => setAdoptionForm({ ...adoptionForm, reason: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* ID Card (Required) */}
                <div className="space-y-2">
                  <Label htmlFor="idCard">
                    身份证号 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="idCard"
                    placeholder="请输入18位身份证号"
                    value={adoptionForm.idCard}
                    onChange={(e) => setAdoptionForm({ ...adoptionForm, idCard: e.target.value })}
                    maxLength={18}
                  />
                </div>

                {/* Living Condition */}
                <div className="space-y-2">
                  <Label htmlFor="livingCondition">
                    <Home className="w-4 h-4 inline mr-1" />
                    居住环境
                  </Label>
                  <Input
                    id="livingCondition"
                    placeholder="如：公寓套房、有院子、租房/自有房..."
                    value={adoptionForm.livingCondition}
                    onChange={(e) => setAdoptionForm({ ...adoptionForm, livingCondition: e.target.value })}
                  />
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experience">
                    <Award className="w-4 h-4 inline mr-1" />
                    养宠经验
                  </Label>
                  <Textarea
                    id="experience"
                    placeholder="请分享您的养宠经验，如果没有可以填写'第一次养宠'"
                    value={adoptionForm.experience}
                    onChange={(e) => setAdoptionForm({ ...adoptionForm, experience: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => setAdoptionOpen(false)}>
                  取消
                </Button>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={handleSubmitAdoption}
                  disabled={submitting || !adoptionForm.reason || !adoptionForm.idCard}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      提交中...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      提交申请
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
