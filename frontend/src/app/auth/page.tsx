"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PawPrint, Mail, Lock, User, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"form" | "profile">("form");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await response.json();

        if (data.success) {
          // 保存用户信息到 localStorage
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/dashboard");
        } else {
          setError(data.error || "登录失败");
        }
      } else {
        if (step === "form") {
          // 验证基本信息
          if (!formData.email || !formData.password) {
            setError("请填写所有必填项");
            setLoading(false);
            return;
          }
          if (formData.password.length < 6) {
            setError("密码至少6位");
            setLoading(false);
            return;
          }
          // 跳转到完善资料步骤
          setStep("profile");
          setLoading(false);
          return;
        }

        // 完成注册
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await response.json();

        if (data.success) {
          // 保存用户信息到 localStorage
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/dashboard");
        } else {
          setError(data.error || "注册失败");
        }
      }
    } catch (err) {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <PawPrint className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl text-foreground">PawFinder</span>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            {step === "form" ? (
              <>
                <CardTitle className="text-2xl text-center">
                  {mode === "login" ? "欢迎回来" : "创建账户"}
                </CardTitle>
                <CardDescription className="text-center">
                  {mode === "login"
                    ? "登录您的账户，继续您的爱心之旅"
                    : "注册账户，开始您的领养之旅"}
                </CardDescription>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep("form")}
                  className="absolute top-4 left-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回
                </Button>
                <CardTitle className="text-2xl text-center">完善资料</CardTitle>
                <CardDescription className="text-center">
                  最后一步，告诉我们更多关于您的信息
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {step === "form" && (
                <>
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">密码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder={mode === "register" ? "至少6位字符" : "••••••••"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {mode === "register" && (
                    <>
                      <Separator className="my-6" />

                      {/* Optional: Name & Phone for Register */}
                      <div className="space-y-2">
                        <Label htmlFor="name">姓名（选填）</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="您的姓名"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">手机号（选填）</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="您的手机号"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                    disabled={loading}
                  >
                    {loading ? (
                      "处理中..."
                    ) : mode === "login" ? (
                      <>
                        登录
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        下一步
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </>
              )}

              {step === "profile" && mode === "register" && (
                <>
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="您的真实姓名"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">手机号</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="您的手机号"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-primary-50 border border-primary-200">
                    <p className="text-sm text-primary-700">
                      温馨提示：完成注册后，如需成为领养人，请在个人中心提交身份证等信息进行认证。
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                    disabled={loading}
                  >
                    {loading ? "注册中..." : "完成注册"}
                  </Button>
                </>
              )}
            </form>

            <div className="mt-6 text-center text-sm">
              {mode === "login" ? (
                <>
                  还没有账户？{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setStep("form");
                      setError("");
                    }}
                    className="text-primary-600 hover:underline font-medium"
                  >
                    立即注册
                  </button>
                </>
              ) : (
                <>
                  已有账户？{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setStep("form");
                      setError("");
                    }}
                    className="text-primary-600 hover:underline font-medium"
                  >
                    立即登录
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          登录即表示您同意我们的{" "}
          <a href="#" className="text-primary-600 hover:underline">
            服务条款
          </a>{" "}
          和{" "}
          <a href="#" className="text-primary-600 hover:underline">
            隐私政策
          </a>
        </p>
      </div>
    </div>
  );
}
