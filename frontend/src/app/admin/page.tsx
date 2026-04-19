"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, UserCog, PawPrint, Heart, Plus, CheckCircle, XCircle, Eye, Edit, Trash2, Upload, X, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Check if user is admin
  const isSysAdmin = user?.role === "sysadmin";
  const isInstitutionAdmin = user?.role === "institution_admin";

  // State for data
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [adminRequests, setAdminRequests] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [currentInstitution, setCurrentInstitution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [createInstitutionOpen, setCreateInstitutionOpen] = useState(false);
  const [addPetOpen, setAddPetOpen] = useState(false);
  const [editPetOpen, setEditPetOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [previewPet, setPreviewPet] = useState<any>(null);

  // Form states
  const [createInstitutionForm, setCreateInstitutionForm] = useState({
    name: "", description: "", contact_phone: "", contact_email: "", address: "", license_url: ""
  });

  const [addPetForm, setAddPetForm] = useState({
    name: "", species: "dog", breed: "", gender: "male", age: "", size: "medium", weight: "",
    images: "", description: "", traits: "", health_status: "", shelter_name: "", shelter_address: ""
  });

  const [editPetForm, setEditPetForm] = useState({
    id: "", name: "", species: "dog", breed: "", gender: "male", age: "", size: "medium", weight: "",
    images: "", description: "", traits: "", health_status: ""
  });

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [editUploadedImages, setEditUploadedImages] = useState<string[]>([]);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    } else if (!authLoading && user && user.role !== "sysadmin" && user.role !== "institution_admin") {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Fetch data based on role
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (isSysAdmin) {
        // Fetch all institutions
        const instRes = await fetch("/api/institutions");
        const instData = await instRes.json();
        if (instData.success) {
          setInstitutions(instData.institutions || []);
        }

        // Fetch admin requests
        const reqRes = await fetch("/api/institution-admin-requests");
        const reqData = await reqRes.json();
        if (reqData.success) {
          setAdminRequests(reqData.requests || []);
        }

        // Fetch all pets
        const petsRes = await fetch("/api/pets");
        const petsData = await petsRes.json();
        if (petsData.success) {
          setPets(petsData.pets || []);
        }
      } else if (isInstitutionAdmin) {
        // Fetch institution info
        if (user?.institution_id) {
          const instRes = await fetch(`/api/institutions/${user.institution_id}`);
          const instData = await instRes.json();
          if (instData.success) {
            setCurrentInstitution(instData.institution);
          }
        }

        // Fetch pets for this institution
        const petsRes = await fetch(`/api/pets?institution_id=${user?.institution_id}`);
        const petsData = await petsRes.json();
        if (petsData.success) {
          setPets(petsData.pets || []);
        }

        // Fetch applications
        const appsRes = await fetch("/api/applications");
        const appsData = await appsRes.json();
        if (appsData.success) {
          setApplications(appsData.applications || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const pendingInstitutions = institutions.filter(i => i.status === "pending");
  const pendingRequests = adminRequests.filter(r => r.status === "pending");
  const pendingApps = applications.filter(a => a.status === "pending");

  // Institution handlers
  const handleCreateInstitution = async () => {
    try {
      const res = await fetch("/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createInstitutionForm),
      });
      const data = await res.json();
      if (data.success) {
        setInstitutions([...institutions, data.institution]);
        setCreateInstitutionOpen(false);
        setCreateInstitutionForm({ name: "", description: "", contact_phone: "", contact_email: "", address: "", license_url: "" });
      } else {
        alert(data.error || "创建失败");
      }
    } catch (error) {
      alert("创建机构失败");
    }
  };

  const handleApproveInstitution = async (id: string) => {
    try {
      const res = await fetch(`/api/institutions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "verified" }),
      });
      const data = await res.json();
      if (data.success) {
        setInstitutions(institutions.map(i => i.id === id ? data.institution : i));
      }
    } catch (error) {
      alert("审核失败");
    }
  };

  const handleRejectInstitution = async (id: string) => {
    try {
      const res = await fetch(`/api/institutions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      const data = await res.json();
      if (data.success) {
        setInstitutions(institutions.map(i => i.id === id ? data.institution : i));
      }
    } catch (error) {
      alert("审核失败");
    }
  };

  // Admin request handlers
  const handleReviewAdminRequest = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/institution-admin-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejection_reason: rejectReason }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminRequests(adminRequests.map(r => r.id === id ? data.request : r));
        setReviewDialogOpen(false);
        setSelectedRequest(null);
        setRejectReason("");
      } else {
        alert(data.error || "审核失败");
      }
    } catch (error) {
      alert("审核失败");
    }
  };

  // Pet handlers
  const handleAddPetDialogOpen = (open: boolean) => {
    setAddPetOpen(open);
    if (open && currentInstitution) {
      setAddPetForm(prev => ({
        ...prev,
        shelter_name: currentInstitution?.name || "",
        shelter_address: currentInstitution?.address || "",
      }));
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const files = e.target.files;
    if (!files) return;

    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          newUrls.push(data.url);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    if (isEdit) {
      const updated = [...editUploadedImages, ...newUrls];
      setEditUploadedImages(updated);
      setEditPetForm(prev => ({ ...prev, images: updated.join("\n") }));
    } else {
      const updated = [...uploadedImages, ...newUrls];
      setUploadedImages(updated);
      setAddPetForm(prev => ({ ...prev, images: updated.join("\n") }));
    }
  };

  const handleRemoveImage = (index: number, isEdit: boolean = false) => {
    if (isEdit) {
      const newImages = editUploadedImages.filter((_, i) => i !== index);
      setEditUploadedImages(newImages);
      setEditPetForm(prev => ({ ...prev, images: newImages.join("\n") }));
    } else {
      const newImages = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(newImages);
      setAddPetForm(prev => ({ ...prev, images: newImages.join("\n") }));
    }
  };

  const handleCreatePet = async () => {
    try {
      const imagesArray = uploadedImages.length > 0 ? uploadedImages : addPetForm.images.split("\n").map(url => url.trim()).filter(url => url);
      const traitsArray = addPetForm.traits.split("、").map(t => t.trim()).filter(t => t);

      const res = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addPetForm.name,
          species: addPetForm.species,
          breed: addPetForm.breed,
          gender: addPetForm.gender,
          age: addPetForm.age,
          size: addPetForm.size,
          weight: addPetForm.weight ? parseFloat(addPetForm.weight) : 0,
          images: imagesArray,
          description: addPetForm.description,
          traits: traitsArray,
          health_status: addPetForm.health_status,
          shelter_name: currentInstitution?.name || addPetForm.shelter_name,
          shelter_address: currentInstitution?.address || addPetForm.shelter_address,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPets([...pets, data.pet]);
        setAddPetOpen(false);
        setUploadedImages([]);
        setAddPetForm({
          name: "", species: "dog", breed: "", gender: "male", age: "", size: "medium", weight: "",
          images: "", description: "", traits: "", health_status: "", shelter_name: "", shelter_address: ""
        });
      } else {
        alert(data.error || "添加失败");
      }
    } catch (error) {
      alert("添加宠物失败");
    }
  };

  const handleEditPet = (pet: any) => {
    setEditPetForm({
      id: pet.id,
      name: pet.name,
      species: pet.species || "dog",
      breed: pet.breed || "",
      gender: pet.gender || "male",
      age: pet.age || "",
      size: pet.size || "medium",
      weight: pet.weight?.toString() || "",
      images: pet.images?.join("\n") || "",
      description: pet.description || "",
      traits: pet.traits?.join("、") || "",
      health_status: pet.health_status || "",
    });
    setEditUploadedImages(pet.images || []);
    setEditPetOpen(true);
  };

  const handleUpdatePet = async () => {
    try {
      const imagesArray = editPetForm.images.split("\n").map(url => url.trim()).filter(url => url);

      const res = await fetch(`/api/pets/${editPetForm.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editPetForm.name,
          species: editPetForm.species,
          breed: editPetForm.breed,
          gender: editPetForm.gender,
          age: editPetForm.age,
          size: editPetForm.size,
          weight: editPetForm.weight ? parseFloat(editPetForm.weight) : 0,
          images: imagesArray,
          description: editPetForm.description,
          traits: editPetForm.traits.split("、").map(t => t.trim()).filter(t => t),
          health_status: editPetForm.health_status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPets(pets.map(p => p.id === editPetForm.id ? data.pet : p));
        setEditPetOpen(false);
      } else {
        alert(data.error || "更新失败");
      }
    } catch (error) {
      alert("更新宠物失败");
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!confirm("确定要删除这只宠物吗？")) return;
    try {
      const res = await fetch(`/api/pets/${petId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPets(pets.filter(p => p.id !== petId));
      }
    } catch (error) {
      alert("删除宠物失败");
    }
  };

  // Application handlers
  const handleReviewApplication = async (id: string, status: "approved" | "rejected", notes?: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, admin_notes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        setApplications(applications.map(a => a.id === id ? data.application : a));
      }
    } catch (error) {
      alert("审核失败");
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: "待审核",
      verified: "已通过",
      approved: "已通过",
      rejected: "已拒绝",
      available: "可领养",
      adopted: "已领养",
      unavailable: "不可领养",
    };
    return map[status] || status;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== "sysadmin" && user.role !== "institution_admin")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">PawFinder 管理中心</h1>
            <p className="text-sm text-gray-500">
              {isSysAdmin ? "系统管理员" : "机构管理员"}
              {currentInstitution && ` - ${currentInstitution.name}`}
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>
            返回首页
          </Button>
        </div>
      </div>

      {/* Stats Cards - Only for SysAdmin */}
      {isSysAdmin && (
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-orange-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-800">{institutions.filter(i => i.status === "verified").length}</p>
                    <p className="text-sm text-gray-500">机构总数</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                    <UserCog className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-800">{adminRequests.filter(r => r.status === "approved").length}</p>
                    <p className="text-sm text-gray-500">管理员总数</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-100 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <PawPrint className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{pets.length}</p>
                    <p className="text-xs text-gray-500">宠物总数</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="container mx-auto px-4 pb-8">
        <Tabs defaultValue={isSysAdmin ? "institutions" : "pets"}>
          <TabsList className="mb-6 bg-white p-1 rounded-xl shadow-sm">
            {isSysAdmin && (
              <TabsTrigger value="institutions">
                <Building2 className="w-4 h-4 mr-2" />
                机构管理
                {pendingInstitutions.length > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs">{pendingInstitutions.length}</Badge>
                )}
              </TabsTrigger>
            )}
            {isSysAdmin && (
              <TabsTrigger value="admin-requests">
                <UserCog className="w-4 h-4 mr-2" />
                管理员申请
                {pendingRequests.length > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs">{pendingRequests.length}</Badge>
                )}
              </TabsTrigger>
            )}
            <TabsTrigger value="pets">
              <PawPrint className="w-4 h-4 mr-2" />
              宠物列表
            </TabsTrigger>
            {!isSysAdmin && (
              <TabsTrigger value="adoptions">
                <Heart className="w-4 h-4 mr-2" />
                领养审核
                {pendingApps.length > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs">{pendingApps.length}</Badge>
                )}
              </TabsTrigger>
            )}
          </TabsList>

          {/* Institution Management */}
          {isSysAdmin && (
            <TabsContent value="institutions">
              <Card className="border-orange-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-500" />
                    机构列表
                  </CardTitle>
                  <Dialog open={createInstitutionOpen} onOpenChange={setCreateInstitutionOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-orange-500 to-amber-500">
                        <Plus className="w-4 h-4 mr-2" />
                        添加机构
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>添加新机构</DialogTitle>
                        <DialogDescription>机构通过审核后，管理员才能注册并管理宠物</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>机构名称 *</Label>
                          <Input value={createInstitutionForm.name} onChange={e => setCreateInstitutionForm({ ...createInstitutionForm, name: e.target.value })} placeholder="请输入机构名称" />
                        </div>
                        <div className="space-y-2">
                          <Label>机构描述</Label>
                          <Textarea value={createInstitutionForm.description} onChange={e => setCreateInstitutionForm({ ...createInstitutionForm, description: e.target.value })} placeholder="请输入机构描述" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>联系电话</Label>
                            <Input value={createInstitutionForm.contact_phone} onChange={e => setCreateInstitutionForm({ ...createInstitutionForm, contact_phone: e.target.value })} placeholder="请输入联系电话" />
                          </div>
                          <div className="space-y-2">
                            <Label>联系邮箱</Label>
                            <Input value={createInstitutionForm.contact_email} onChange={e => setCreateInstitutionForm({ ...createInstitutionForm, contact_email: e.target.value })} placeholder="请输入联系邮箱" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>机构地址</Label>
                          <Input value={createInstitutionForm.address} onChange={e => setCreateInstitutionForm({ ...createInstitutionForm, address: e.target.value })} placeholder="请输入机构地址" />
                        </div>
                        <div className="space-y-2">
                          <Label>营业执照 URL</Label>
                          <Input value={createInstitutionForm.license_url} onChange={e => setCreateInstitutionForm({ ...createInstitutionForm, license_url: e.target.value })} placeholder="请输入营业执照图片URL" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateInstitutionOpen(false)}>取消</Button>
                        <Button className="bg-gradient-to-r from-orange-500 to-amber-500" onClick={handleCreateInstitution}>确认添加</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-orange-50">
                        <TableHead>机构名称</TableHead>
                        <TableHead>联系方式</TableHead>
                        <TableHead>地址</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>创建时间</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {institutions.map(inst => (
                        <TableRow key={inst.id}>
                          <TableCell className="font-medium">{inst.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{inst.contact_phone}</span>
                              <span className="text-gray-400 text-xs">{inst.contact_email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-500 text-sm max-w-[200px] truncate">{inst.address}</TableCell>
                          <TableCell>
                            <Badge className={inst.status === "verified" ? "bg-emerald-500" : inst.status === "pending" ? "bg-amber-500" : "bg-gray-500"}>
                              {getStatusText(inst.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-500 text-sm">{new Date(inst.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {inst.status === "pending" ? (
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600" onClick={() => handleApproveInstitution(inst.id)}>
                                  <CheckCircle className="w-4 h-4 mr-1" />通过
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleRejectInstitution(inst.id)}>
                                  <XCircle className="w-4 h-4 mr-1" />拒绝
                                </Button>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                {inst.verified_at ? `审核于 ${new Date(inst.verified_at).toLocaleDateString()}` : "-"}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {institutions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">暂无机构数据</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Admin Requests */}
          {isSysAdmin && (
            <TabsContent value="admin-requests">
              <Card className="border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCog className="w-5 h-5 text-orange-500" />
                    管理员申请列表
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-orange-50">
                        <TableHead>申请人</TableHead>
                        <TableHead>所属机构</TableHead>
                        <TableHead>联系方式</TableHead>
                        <TableHead>申请时间</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminRequests.map(req => (
                        <TableRow key={req.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8 bg-orange-100">
                                <AvatarFallback className="text-orange-600 font-medium">{req.name?.[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{req.name}</p>
                                <p className="text-xs text-gray-400">ID: {req.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-amber-50">{req.institution?.name || req.institution_id}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{req.phone}</span>
                              <span className="text-gray-400 text-xs">{req.email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-500 text-sm">{new Date(req.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={req.status === "approved" ? "bg-emerald-500" : req.status === "rejected" ? "bg-red-500" : "bg-amber-500"}>
                              {getStatusText(req.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {req.status === "pending" && (
                              <Dialog open={reviewDialogOpen && selectedRequest?.id === req.id} onOpenChange={(open) => { setReviewDialogOpen(open); if (!open) setSelectedRequest(null); }}>
                                <DialogTrigger asChild>
                                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => setSelectedRequest(req)}>
                                    审核
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>审核管理员申请</DialogTitle>
                                    <DialogDescription>请审核 {req.name} 的管理员申请</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="bg-orange-50 p-3 rounded-lg">
                                      <p className="text-sm text-gray-600"><strong>申请人：</strong>{req.name}</p>
                                      <p className="text-sm text-gray-600"><strong>手机号：</strong>{req.phone}</p>
                                      <p className="text-sm text-gray-600"><strong>邮箱：</strong>{req.email}</p>
                                      <p className="text-sm text-gray-600"><strong>所属机构：</strong>{req.institution?.name || req.institution_id}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>拒绝原因（仅拒绝时填写）</Label>
                                      <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="请输入拒绝原因..." />
                                    </div>
                                  </div>
                                  <DialogFooter className="gap-2">
                                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => selectedRequest && handleReviewAdminRequest(selectedRequest.id, "rejected")}>
                                      <XCircle className="w-4 h-4 mr-2" />拒绝
                                    </Button>
                                    <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => selectedRequest && handleReviewAdminRequest(selectedRequest.id, "approved")}>
                                      <CheckCircle className="w-4 h-4 mr-2" />通过
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                            {req.status !== "pending" && (
                              <span className="text-gray-400 text-sm">{req.status === "approved" ? "已开通账号" : req.rejection_reason || "已拒绝"}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {adminRequests.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">暂无申请数据</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Pet List */}
          <TabsContent value="pets">
            <Card className="border-orange-100 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PawPrint className="w-5 h-5 text-orange-500" />
                  {isSysAdmin ? "宠物列表（只读）" : "本机构宠物"}
                  {currentInstitution && (
                    <Badge variant="outline" className="ml-2 bg-amber-50">
                      <MapPin className="w-3 h-3 mr-1" />
                      {currentInstitution.name}
                    </Badge>
                  )}
                </CardTitle>
                {!isSysAdmin && (
                  <Dialog open={addPetOpen} onOpenChange={handleAddPetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-orange-500 to-amber-500">
                        <Plus className="w-4 h-4 mr-2" />
                        添加宠物
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>添加新宠物</DialogTitle>
                        <DialogDescription>填写宠物信息，带 * 号为必填项</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>宠物名称 *</Label>
                            <Input value={addPetForm.name} onChange={e => setAddPetForm({ ...addPetForm, name: e.target.value })} placeholder="如：小橘" />
                          </div>
                          <div className="space-y-2">
                            <Label>种类 *</Label>
                            <select className="w-full h-10 px-3 border rounded-lg" value={addPetForm.species} onChange={e => setAddPetForm({ ...addPetForm, species: e.target.value })}>
                              <option value="dog">狗</option>
                              <option value="cat">猫</option>
                              <option value="other">其他</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>品种</Label>
                            <Input value={addPetForm.breed} onChange={e => setAddPetForm({ ...addPetForm, breed: e.target.value })} placeholder="如：中华田园猫" />
                          </div>
                          <div className="space-y-2">
                            <Label>性别</Label>
                            <select className="w-full h-10 px-3 border rounded-lg" value={addPetForm.gender} onChange={e => setAddPetForm({ ...addPetForm, gender: e.target.value })}>
                              <option value="male">公</option>
                              <option value="female">母</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>年龄</Label>
                            <Input value={addPetForm.age} onChange={e => setAddPetForm({ ...addPetForm, age: e.target.value })} placeholder="如：2岁" />
                          </div>
                          <div className="space-y-2">
                            <Label>体型</Label>
                            <select className="w-full h-10 px-3 border rounded-lg" value={addPetForm.size} onChange={e => setAddPetForm({ ...addPetForm, size: e.target.value })}>
                              <option value="small">小型</option>
                              <option value="medium">中型</option>
                              <option value="large">大型</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label>体重(kg)</Label>
                            <Input type="number" value={addPetForm.weight} onChange={e => setAddPetForm({ ...addPetForm, weight: e.target.value })} placeholder="如：5" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>宠物图片（上传或输入URL）</Label>
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                            <input type="file" accept="image/*" multiple onChange={e => handleUploadImage(e)} className="hidden" id="add-pet-upload" />
                            <label htmlFor="add-pet-upload" className="cursor-pointer flex flex-col items-center">
                              <Upload className="w-8 h-8 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-500">点击上传图片</span>
                            </label>
                          </div>
                          {uploadedImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {uploadedImages.map((url, idx) => (
                                <div key={idx} className="relative group">
                                  <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                                  <button onClick={() => handleRemoveImage(idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <Input value={addPetForm.images} onChange={e => setAddPetForm({ ...addPetForm, images: e.target.value })} placeholder="或输入图片URL，每行一个" className="mt-2" />
                        </div>
                        <div className="space-y-2">
                          <Label>详细介绍</Label>
                          <Textarea value={addPetForm.description} onChange={e => setAddPetForm({ ...addPetForm, description: e.target.value })} placeholder="描述宠物的性格、习惯等" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>性格特点</Label>
                            <Input value={addPetForm.traits} onChange={e => setAddPetForm({ ...addPetForm, traits: e.target.value })} placeholder="如：温顺、亲人、活泼（用顿号分隔）" />
                          </div>
                          <div className="space-y-2">
                            <Label>健康状况</Label>
                            <Input value={addPetForm.health_status} onChange={e => setAddPetForm({ ...addPetForm, health_status: e.target.value })} placeholder="如：已绝育、已打疫苗" />
                          </div>
                        </div>
                        {currentInstitution && (
                          <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600"><strong>所属机构：</strong>{currentInstitution.name}</p>
                            <p className="text-sm text-gray-600"><strong>地址：</strong>{currentInstitution.address}</p>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => { setAddPetOpen(false); setUploadedImages([]); }}>取消</Button>
                        <Button className="bg-gradient-to-r from-orange-500 to-amber-500" onClick={handleCreatePet} disabled={!addPetForm.name}>确认添加</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-50">
                      <TableHead>宠物</TableHead>
                      <TableHead>种类/品种</TableHead>
                      {isSysAdmin && <TableHead>所属机构</TableHead>}
                      <TableHead>状态</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pets.map(pet => (
                      <TableRow key={pet.id} className="hover:bg-orange-50/50">
                        <TableCell className="flex items-center gap-3">
                          {pet.images && pet.images[0] ? (
                            <img src={pet.images[0]} alt={pet.name} className="w-10 h-10 rounded-lg object-cover bg-orange-100" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-xl">🐾</div>
                          )}
                          <span className="font-medium text-gray-800">{pet.name}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{pet.species === "dog" ? "狗" : pet.species === "cat" ? "猫" : "其他"}</span>
                            <span className="text-gray-400 text-xs">{pet.breed || "-"}</span>
                          </div>
                        </TableCell>
                        {isSysAdmin && <TableCell><Badge variant="outline">{pet.shelter_name || pet.institution_id || "-"}</Badge></TableCell>}
                        <TableCell>
                          <Badge className={pet.status === "available" ? "bg-emerald-500" : pet.status === "pending" ? "bg-amber-500" : "bg-gray-500"}>
                            {getStatusText(pet.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">{new Date(pet.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setPreviewPet(pet)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {!isSysAdmin && (
                              <>
                                <Button size="sm" variant="ghost" onClick={() => handleEditPet(pet)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => handleDeletePet(pet.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pets.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={isSysAdmin ? 6 : 5} className="text-center py-8 text-gray-500">暂无宠物数据</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Adoptions */}
          {!isSysAdmin && (
            <TabsContent value="adoptions">
              <Card className="border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-orange-500" />
                    领养申请审核
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-orange-50">
                        <TableHead>宠物</TableHead>
                        <TableHead>申请人</TableHead>
                        <TableHead>申请理由</TableHead>
                        <TableHead>申请时间</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map(app => (
                        <TableRow key={app.id}>
                          <TableCell className="flex items-center gap-2">
                            {app.pet?.images?.[0] && <img src={app.pet.images[0]} alt="" className="w-8 h-8 rounded object-cover" />}
                            <span>{app.pet?.name || "未知宠物"}</span>
                          </TableCell>
                          <TableCell>{app.user?.name || "未知用户"}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{app.reason}</TableCell>
                          <TableCell className="text-gray-500 text-sm">{new Date(app.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={app.status === "approved" ? "bg-emerald-500" : app.status === "rejected" ? "bg-red-500" : "bg-amber-500"}>
                              {getStatusText(app.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {app.status === "pending" && (
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600" onClick={() => handleReviewApplication(app.id, "approved")}>
                                  <CheckCircle className="w-4 h-4 mr-1" />通过
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleReviewApplication(app.id, "rejected")}>
                                  <XCircle className="w-4 h-4 mr-1" />拒绝
                                </Button>
                              </div>
                            )}
                            {app.status !== "pending" && (
                              <span className="text-gray-400 text-sm">{app.admin_notes || "-"}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {applications.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">暂无申请数据</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Edit Pet Dialog */}
      <Dialog open={editPetOpen} onOpenChange={setEditPetOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑宠物信息</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>宠物名称 *</Label>
                <Input value={editPetForm.name} onChange={e => setEditPetForm({ ...editPetForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>种类</Label>
                <select className="w-full h-10 px-3 border rounded-lg" value={editPetForm.species} onChange={e => setEditPetForm({ ...editPetForm, species: e.target.value })}>
                  <option value="dog">狗</option>
                  <option value="cat">猫</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>品种</Label>
                <Input value={editPetForm.breed} onChange={e => setEditPetForm({ ...editPetForm, breed: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>性别</Label>
                <select className="w-full h-10 px-3 border rounded-lg" value={editPetForm.gender} onChange={e => setEditPetForm({ ...editPetForm, gender: e.target.value })}>
                  <option value="male">公</option>
                  <option value="female">母</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>年龄</Label>
                <Input value={editPetForm.age} onChange={e => setEditPetForm({ ...editPetForm, age: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>体型</Label>
                <select className="w-full h-10 px-3 border rounded-lg" value={editPetForm.size} onChange={e => setEditPetForm({ ...editPetForm, size: e.target.value })}>
                  <option value="small">小型</option>
                  <option value="medium">中型</option>
                  <option value="large">大型</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>体重(kg)</Label>
                <Input type="number" value={editPetForm.weight} onChange={e => setEditPetForm({ ...editPetForm, weight: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>宠物图片URL（每行一个）</Label>
              <Textarea value={editPetForm.images} onChange={e => setEditPetForm({ ...editPetForm, images: e.target.value })} placeholder="每行一个图片URL" />
              {editUploadedImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editUploadedImages.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>详细介绍</Label>
              <Textarea value={editPetForm.description} onChange={e => setEditPetForm({ ...editPetForm, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>性格特点</Label>
                <Input value={editPetForm.traits} onChange={e => setEditPetForm({ ...editPetForm, traits: e.target.value })} placeholder="用顿号分隔" />
              </div>
              <div className="space-y-2">
                <Label>健康状况</Label>
                <Input value={editPetForm.health_status} onChange={e => setEditPetForm({ ...editPetForm, health_status: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPetOpen(false)}>取消</Button>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500" onClick={handleUpdatePet} disabled={!editPetForm.name}>保存修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewPet} onOpenChange={(open) => !open && setPreviewPet(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{previewPet?.name}</DialogTitle>
          </DialogHeader>
          {previewPet && (
            <div className="space-y-4">
              {previewPet.images && previewPet.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {previewPet.images.map((img: string, idx: number) => (
                    <img key={idx} src={img} alt="" className="w-full aspect-square object-cover rounded-lg bg-gray-100" />
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>种类：</strong>{previewPet.species === "dog" ? "狗" : previewPet.species === "cat" ? "猫" : "其他"}</div>
                <div><strong>品种：</strong>{previewPet.breed || "-"}</div>
                <div><strong>性别：</strong>{previewPet.gender === "male" ? "公" : "母"}</div>
                <div><strong>年龄：</strong>{previewPet.age || "-"}</div>
                <div><strong>体型：</strong>{previewPet.size === "small" ? "小型" : previewPet.size === "medium" ? "中型" : "大型"}</div>
                <div><strong>体重：</strong>{previewPet.weight ? `${previewPet.weight}kg` : "-"}</div>
              </div>
              {previewPet.description && (
                <div>
                  <p className="text-sm text-gray-500">详细介绍</p>
                  <p className="text-gray-700">{previewPet.description}</p>
                </div>
              )}
              {previewPet.traits && previewPet.traits.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {previewPet.traits.map((trait: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="bg-orange-100 text-orange-700">{trait}</Badge>
                  ))}
                </div>
              )}
              {previewPet.health_status && (
                <div>
                  <p className="text-sm text-gray-500">健康状况</p>
                  <p className="text-gray-700">{previewPet.health_status}</p>
                </div>
              )}
              {(previewPet.shelter_name || previewPet.shelter_address) && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">所属机构</p>
                  {previewPet.shelter_name && <p className="font-medium">{previewPet.shelter_name}</p>}
                  {previewPet.shelter_address && <p className="text-sm text-gray-600">{previewPet.shelter_address}</p>}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Badge className={previewPet.status === "available" ? "bg-emerald-500" : previewPet.status === "pending" ? "bg-amber-500" : "bg-gray-500"}>
                  {getStatusText(previewPet.status)}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewPet(null)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
