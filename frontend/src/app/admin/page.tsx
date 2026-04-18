"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings, Building2, Users, PawPrint, Heart, Video,
  CheckCircle, XCircle, Plus, Eye, Trash2, Edit,
  LogOut, Bell, Shield, UserCog, Clock, Loader2,
  FileText, Mail, Phone, MapPin, Building, AlertCircle
} from "lucide-react";

interface Institution {
  id: string;
  name: string;
  description: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  license_url: string;
  status: string;
  created_at: string;
}

interface InstitutionAdminRequest {
  id: string;
  institution_id: string;
  institution?: { id: string; name: string };
  email: string;
  phone: string;
  name: string;
  id_card_number: string;
  id_card_front_url: string;
  id_card_back_url: string;
  status: string;
  rejection_reason: string;
  created_at: string;
}

interface Pet {
  id: string;
  institution_id: string;
  institution?: { name: string };
  name: string;
  species: string;
  breed: string;
  images: string[];
  status: string;
  created_at: string;
}

interface Application {
  id: string;
  pet_id: string;
  pet: { name: string; species: string };
  user: { name: string; email: string; phone: string };
  reason: string;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const { user, logout, isAuthenticated, isLoading: authLoading, isSysAdmin, isInstitutionAdmin } = useAuth();
  const router = useRouter();

  // Data states
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [adminRequests, setAdminRequests] = useState<InstitutionAdminRequest[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [createInstitutionOpen, setCreateInstitutionOpen] = useState(false);
  const [createInstitutionForm, setCreateInstitutionForm] = useState({
    name: "",
    description: "",
    contact_phone: "",
    contact_email: "",
    address: "",
    license_url: "",
  });

  const [rejectReason, setRejectReason] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<InstitutionAdminRequest | null>(null);

  // Redirect based on role
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (!isSysAdmin && !isInstitutionAdmin) {
        router.push("/dashboard");
      }
    }
  }, [authLoading, isAuthenticated, isSysAdmin, isInstitutionAdmin, router]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load institutions
        if (isSysAdmin) {
          const instRes = await fetch("/api/institutions");
          const instData = await instRes.json();
          if (instData.success) setInstitutions(instData.institutions);

          const reqRes = await fetch("/api/institution-admin-requests");
          const reqData = await reqRes.json();
          if (reqData.success) setAdminRequests(reqData.requests);
        }

        // Load pets for institution admin
        if (isInstitutionAdmin && user?.institution_id) {
          const petRes = await fetch(`/api/pets?institution_id=${user.institution_id}`);
          const petData = await petRes.json();
          if (petData.success) setPets(petData.pets || []);
        } else if (isSysAdmin) {
          const petRes = await fetch("/api/pets");
          const petData = await petRes.json();
          if (petData.success) setPets(petData.pets || []);
        }

        // Load applications
        const appRes = await fetch("/api/applications");
        const appData = await appRes.json();
        if (appData.success) setApplications(appData.applications || []);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && (isSysAdmin || isInstitutionAdmin)) {
      loadData();
    }
  }, [authLoading, isSysAdmin, isInstitutionAdmin, user]);

  // Handlers
  const handleCreateInstitution = async () => {
    try {
      const res = await fetch("/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createInstitutionForm),
      });
      const data = await res.json();
      if (data.success) {
        setInstitutions([data.institution, ...institutions]);
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
        body: JSON.stringify({ status: "approved", verified_by: user?.id }),
      });
      const data = await res.json();
      if (data.success) {
        setInstitutions(institutions.map(i => i.id === id ? { ...i, status: "approved" } : i));
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
        setInstitutions(institutions.map(i => i.id === id ? { ...i, status: "rejected" } : i));
      }
    } catch (error) {
      alert("审核失败");
    }
  };

  const handleReviewAdminRequest = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/institution-admin-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewed_by: user?.id, rejection_reason: rejectReason }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminRequests(adminRequests.map(r => r.id === id ? { ...r, status } : r));
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

  // Stats
  const pendingInstitutions = institutions.filter(i => i.status === "pending");
  const pendingRequests = adminRequests.filter(r => r.status === "pending");
  const pendingApps = applications.filter(a => a.status === "pending");

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50/50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {isSysAdmin ? "系统管理后台" : "机构管理后台"}
                </h1>
                <p className="text-orange-100 text-sm">
                  {isSysAdmin ? "PawFinder 机构管理" : user?.name ? `${user.name} 的管理中心` : "机构管理"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-white/20 text-white px-3 py-1">
                {isSysAdmin ? "系统管理员" : "机构管理员"}
              </Badge>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 gap-2"
                onClick={() => { logout(); router.push("/"); }}
              >
                <LogOut className="w-4 h-4" />
                <span>退出登录</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isSysAdmin && (
            <>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{institutions.length}</p>
                      <p className="text-xs text-gray-500">机构总数</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <UserCog className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{pendingRequests.length}</p>
                      <p className="text-xs text-gray-500">待审管理员</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
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
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{pendingApps.length}</p>
                  <p className="text-xs text-gray-500">待审领养</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <Tabs defaultValue={isSysAdmin ? "institutions" : "pets"}>
          <TabsList className="mb-6 bg-white p-1 rounded-xl shadow-sm">
            {isSysAdmin && (
              <TabsTrigger value="institutions" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg px-4">
                <Building2 className="w-4 h-4" />
                <span>机构管理</span>
              </TabsTrigger>
            )}
            {isSysAdmin && (
              <TabsTrigger value="admin-requests" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg px-4">
                <UserCog className="w-4 h-4" />
                <span>管理员申请</span>
                {pendingRequests.length > 0 && <Badge className="ml-1 bg-red-500 text-white text-xs">{pendingRequests.length}</Badge>}
              </TabsTrigger>
            )}
            <TabsTrigger value="pets" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg px-4">
              <PawPrint className="w-4 h-4" />
              <span>宠物管理</span>
            </TabsTrigger>
            <TabsTrigger value="adoptions" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white rounded-lg px-4">
              <Heart className="w-4 h-4" />
              <span>领养审核</span>
              {pendingApps.length > 0 && <Badge className="ml-1 bg-red-500 text-white text-xs">{pendingApps.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          {/* Institution Management - SysAdmin Only */}
          {isSysAdmin && (
            <TabsContent value="institutions">
              <Card className="border-orange-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-500" />
                    机构列表
                  </CardTitle>
                  <Dialog open={createInstitutionOpen} onOpenChange={setCreateInstitutionOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        添加机构
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
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
                            <Input type="email" value={createInstitutionForm.contact_email} onChange={e => setCreateInstitutionForm({ ...createInstitutionForm, contact_email: e.target.value })} placeholder="请输入联系邮箱" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>机构地址</Label>
                          <Input value={createInstitutionForm.address} onChange={e => setCreateInstitutionForm({ ...createInstitutionForm, address: e.target.value })} placeholder="请输入机构地址" />
                        </div>
                        <div className="space-y-2">
                          <Label>营业执照URL</Label>
                          <Input value={createInstitutionForm.license_url} onChange={e => setCreateInstitutionForm({ ...createInstitutionForm, license_url: e.target.value })} placeholder="请输入营业执照图片URL" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateInstitutionOpen(false)}>取消</Button>
                        <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleCreateInstitution}>创建</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-orange-50">
                        <TableHead className="text-gray-600 font-semibold">机构名称</TableHead>
                        <TableHead className="text-gray-600 font-semibold">联系方式</TableHead>
                        <TableHead className="text-gray-600 font-semibold">地址</TableHead>
                        <TableHead className="text-gray-600 font-semibold">状态</TableHead>
                        <TableHead className="text-gray-600 font-semibold">创建时间</TableHead>
                        <TableHead className="text-gray-600 font-semibold">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {institutions.map(inst => (
                        <TableRow key={inst.id} className="hover:bg-orange-50/50">
                          <TableCell className="font-medium text-gray-800">{inst.name}</TableCell>
                          <TableCell className="text-gray-600">
                            <div className="flex flex-col">
                              <span>{inst.contact_phone || "-"}</span>
                              <span className="text-xs text-gray-400">{inst.contact_email || "-"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-500 text-sm">{inst.address || "-"}</TableCell>
                          <TableCell>
                            <Badge className={inst.status === "approved" ? "bg-emerald-500" : inst.status === "pending" ? "bg-amber-500" : "bg-gray-500"}>
                              {inst.status === "approved" ? "已认证" : inst.status === "pending" ? "待审核" : "已拒绝"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-500 text-sm">{new Date(inst.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {inst.status === "pending" && (
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleApproveInstitution(inst.id)}>
                                  <CheckCircle className="w-4 h-4 mr-1" />通过
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleRejectInstitution(inst.id)}>
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                            {inst.status === "approved" && (
                              <Button size="sm" variant="ghost" className="text-gray-500">
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {institutions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            暂无机构数据
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Admin Requests - SysAdmin Only */}
          {isSysAdmin && (
            <TabsContent value="admin-requests">
              <Card className="border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <UserCog className="w-5 h-5 text-orange-500" />
                    机构管理员申请
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-orange-50">
                        <TableHead className="text-gray-600 font-semibold">申请人</TableHead>
                        <TableHead className="text-gray-600 font-semibold">所属机构</TableHead>
                        <TableHead className="text-gray-600 font-semibold">联系方式</TableHead>
                        <TableHead className="text-gray-600 font-semibold">状态</TableHead>
                        <TableHead className="text-gray-600 font-semibold">申请时间</TableHead>
                        <TableHead className="text-gray-600 font-semibold">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminRequests.map(req => (
                        <TableRow key={req.id} className="hover:bg-orange-50/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8 bg-orange-100">
                                <AvatarFallback className="text-orange-600 text-sm">{req.name?.[0]}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-gray-800">{req.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">{req.institution?.name || "-"}</TableCell>
                          <TableCell className="text-gray-500 text-sm">
                            <div className="flex flex-col">
                              <span>{req.phone}</span>
                              <span className="text-xs text-gray-400">{req.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={req.status === "approved" ? "bg-emerald-500" : req.status === "pending" ? "bg-amber-500" : "bg-red-500"}>
                              {req.status === "approved" ? "已通过" : req.status === "pending" ? "待审核" : "已拒绝"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-500 text-sm">{new Date(req.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {req.status === "pending" && (
                              <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50" onClick={() => setSelectedRequest(req)}>
                                    <FileText className="w-4 h-4 mr-1" />审核
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>审核管理员申请</DialogTitle>
                                    <DialogDescription>请审核 {selectedRequest?.name} 的机构管理员申请</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                      <h4 className="font-medium text-gray-800 mb-2">申请人信息</h4>
                                      <p className="text-gray-600">姓名: {selectedRequest?.name}</p>
                                      <p className="text-gray-600">手机: {selectedRequest?.phone}</p>
                                      <p className="text-gray-600">邮箱: {selectedRequest?.email}</p>
                                      <p className="text-gray-600">所属机构: {selectedRequest?.institution?.name}</p>
                                      {selectedRequest?.id_card_number && (
                                        <p className="text-gray-600">身份证: {selectedRequest.id_card_number}</p>
                                      )}
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
                                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => selectedRequest && handleReviewAdminRequest(selectedRequest.id, "approved")}>
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
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            暂无申请数据
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Pet Management */}
          <TabsContent value="pets">
            <Card className="border-orange-100 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <PawPrint className="w-5 h-5 text-orange-500" />
                  {isSysAdmin ? "所有宠物" : "本机构宠物"}
                </CardTitle>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  添加宠物
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-50">
                      <TableHead className="text-gray-600 font-semibold">宠物</TableHead>
                      <TableHead className="text-gray-600 font-semibold">种类/品种</TableHead>
                      {isSysAdmin && <TableHead className="text-gray-600 font-semibold">所属机构</TableHead>}
                      <TableHead className="text-gray-600 font-semibold">状态</TableHead>
                      <TableHead className="text-gray-600 font-semibold">创建时间</TableHead>
                      <TableHead className="text-gray-600 font-semibold">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pets.map(pet => (
                      <TableRow key={pet.id} className="hover:bg-orange-50/50">
                        <TableCell className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-xl">🐾</div>
                          <span className="font-medium text-gray-800">{pet.name}</span>
                        </TableCell>
                        <TableCell className="text-gray-600">{pet.species} / {pet.breed}</TableCell>
                        {isSysAdmin && <TableCell className="text-gray-500 text-sm">{pet.institution?.name || "-"}</TableCell>}
                        <TableCell>
                          <Badge className={pet.status === "available" ? "bg-emerald-500" : pet.status === "pending" ? "bg-amber-500" : "bg-gray-500"}>
                            {pet.status === "available" ? "可领养" : pet.status === "pending" ? "待审核" : "已领养"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">{new Date(pet.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50"><Eye className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-50"><Edit className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pets.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          暂无宠物数据
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Adoption Reviews */}
          <TabsContent value="adoptions">
            <Card className="border-orange-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-orange-500" />
                  领养申请审核
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-50">
                      <TableHead className="text-gray-600 font-semibold">申请人</TableHead>
                      <TableHead className="text-gray-600 font-semibold">申请宠物</TableHead>
                      <TableHead className="text-gray-600 font-semibold">申请理由</TableHead>
                      <TableHead className="text-gray-600 font-semibold">状态</TableHead>
                      <TableHead className="text-gray-600 font-semibold">申请时间</TableHead>
                      <TableHead className="text-gray-600 font-semibold">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map(app => (
                      <TableRow key={app.id} className="hover:bg-orange-50/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 bg-orange-100">
                              <AvatarFallback className="text-orange-600 font-medium">{app.user.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-800">{app.user.name}</p>
                              <p className="text-xs text-gray-500">{app.user.phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🐾</span>
                            <span className="text-gray-700">{app.pet.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 max-w-xs truncate">{app.reason}</TableCell>
                        <TableCell>
                          <Badge className={app.status === "approved" ? "bg-emerald-500" : app.status === "pending" ? "bg-amber-500" : "bg-red-500"}>
                            {app.status === "approved" ? "已通过" : app.status === "pending" ? "待审核" : "已拒绝"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm">{new Date(app.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {app.status === "pending" ? (
                            <div className="flex items-center gap-2">
                              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white"><CheckCircle className="w-4 h-4" /></Button>
                              <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50"><XCircle className="w-4 h-4" /></Button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">已完成</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {applications.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          暂无申请数据
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
