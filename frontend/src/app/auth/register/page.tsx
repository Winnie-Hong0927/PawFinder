"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PawPrint, Phone, Lock, ArrowRight, ArrowLeft, Loader2, Shield, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<"phone" | "code" | "profile">("phone");
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState({
    phone: "",
    code: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendCode = async () => {
    if (!formData.phone || formData.phone.length !== 11) {
      setError("请输入正确的11位手机号");
      return;
    }
    
    setSendingCode(true);
    setError("");
    
    try {
      // Call API to send SMS code
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, type: "register" }),
      });
      const data = await response.json();
      
      if (data.success) {
        setStep("code");
        setCountdown(60);
      } else {
        setError(data.error || "发送失败，请稍后重试");
      }
    } catch {
      // For demo purposes, proceed anyway
      setStep("code");
      setCountdown(60);
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (step === "code") {
        // Verify code
        const response = await fetch("/api/auth/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formData.phone, code: formData.code }),
        });
        const data = await response.json();

        if (data.success) {
          setStep("profile");
        } else {
          setError(data.error || "验证码错误");
        }
      } else if (step === "profile") {
        // Complete registration
        if (!formData.name) {
          setError("请输入您的姓名");
          setLoading(false);
          return;
        }
        if (!formData.password || formData.password.length < 6) {
          setError("密码至少6位");
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("两次密码输入不一致");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: formData.phone,
            name: formData.name,
            password: formData.password,
          }),
        });
        const data = await response.json();

        if (data.success) {
          login(data.user);
          router.push("/dashboard");
        } else {
          setError(data.error || "注册失败");
        }
      }
    } catch {
      // For demo purposes, create demo account
      const demoUser = {
        id: Date.now().toString(),
        name: formData.name || "新用户",
        phone: formData.phone,
        email: "",
        role: "user" as const,
      };
      login(demoUser);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === "code") {
      setStep("phone");
      setFormData({ ...formData, code: "" });
    } else if (step === "profile") {
      setStep("code");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-background to-orange-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <PawPrint className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-800">PawFinder</span>
          </Link>
        </div>

        <Card className="shadow-xl border-orange-100">
          <CardHeader className="space-y-1">
            {step !== "phone" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="absolute top-4 left-4 text-gray-500"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                返回
              </Button>
            )}
            <CardTitle className="text-2xl text-center text-gray-800">
              {step === "phone" && "注册账户"}
              {step === "code" && "验证手机号"}
              {step === "profile" && "完善资料"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === "phone" && "输入手机号开始注册"}
              {step === "code" && "输入收到的验证码"}
              {step === "profile" && "最后一步，告诉我们您的信息"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Step 1: Phone */}
              {step === "phone" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">手机号</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="请输入11位手机号"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={sendCode}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    disabled={sendingCode || countdown > 0}
                  >
                    {sendingCode ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {countdown > 0 ? `${countdown}秒后重新获取` : "获取验证码"}
                  </Button>
                </>
              )}

              {/* Step 2: Code */}
              {step === "code" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="code">验证码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="code"
                        type="text"
                        placeholder="请输入6位验证码"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        className="pl-10"
                        maxLength={6}
                        autoFocus
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={sendCode}
                      className="text-sm text-orange-600 hover:underline"
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `${countdown}秒后可重新获取` : "重新获取验证码"}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    disabled={loading || formData.code.length !== 6}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <ArrowRight className="w-4 h-4 mr-2" />
                    )}
                    验证
                  </Button>
                </>
              )}

              {/* Step 3: Profile */}
              {step === "profile" && (
                <>
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-100 mb-4">
                    <p className="text-sm text-orange-700">
                      手机号验证成功：{formData.phone}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="请输入您的真实姓名"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="password">设置密码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="至少6位字符"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">确认密码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="再次输入密码"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    完成注册
                  </Button>
                </>
              )}
            </form>

            {step === "phone" && (
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">已有账户？</span>
                <Link href="/auth/login">
                  <Button variant="link" className="text-orange-600 font-medium">
                    立即登录
                  </Button>
                </Link>
              </div>
            )}

            {step === "profile" && (
              <div className="mt-4 p-3 rounded-lg bg-orange-50 border border-orange-100">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-orange-500 mt-0.5" />
                  <p className="text-xs text-orange-700">
                    完成注册后，如需成为领养人，请在个人中心提交身份证等信息进行认证。领养代替购买，给流浪宠物一个温暖的家！
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo hint */}
        {step === "code" && (
          <div className="mt-4 p-3 rounded-lg bg-gray-100 border border-gray-200 text-center">
            <p className="text-xs text-gray-600">
              演示模式：输入任意6位数字验证码即可继续
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
