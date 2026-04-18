"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PawPrint, Phone, Lock, ArrowRight, Loader2, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, isAdmin, isSysAdmin } = useAuth();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState({
    phone: "",
    code: "",
  });
  const [error, setError] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (isSysAdmin) {
        router.push("/admin");
      } else if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [authLoading, isAuthenticated, isSysAdmin, isAdmin, router]);

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
        body: JSON.stringify({ phone: formData.phone }),
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
      // Call API to verify code - this will auto-register if user doesn't exist
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, code: formData.code }),
      });
      const data = await response.json();

      if (data.success) {
        login(data.user);
        if (data.isNewUser) {
          setIsNewUser(true);
          // Short delay to show welcome message before redirect
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          if (data.user.role === "sysadmin" || data.user.role === "institution_admin" || data.user.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }
      } else {
        setError(data.error || "验证码错误");
      }
    } catch {
      // For demo purposes, allow login with any 6-digit code
      const demoUser = {
        id: Date.now().toString(),
        name: "新用户",
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
            <CardTitle className="text-2xl text-center text-gray-800">
              {isNewUser ? "注册成功" : "手机号登录"}
            </CardTitle>
            <CardDescription className="text-center">
              {isNewUser 
                ? "欢迎加入PawFinder，即将跳转到个人中心..." 
                : step === "phone" 
                  ? "输入手机号获取验证码" 
                  : "输入收到的验证码完成登录"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isNewUser ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600">
                  您的账号已自动创建<br />
                  <span className="font-medium text-gray-800">{formData.phone}</span>
                </p>
                <Loader2 className="w-6 h-6 mx-auto animate-spin text-orange-500" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="请输入11位手机号"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                      className="pl-10"
                      disabled={step === "code"}
                      required
                    />
                  </div>
                </div>

                {/* Verification Code */}
                {step === "code" && (
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
                    <p className="text-xs text-muted-foreground">
                      验证码已发送至您的手机，请注意查收
                    </p>
                  </div>
                )}

                {step === "phone" ? (
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
                ) : (
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
                    验证并登录
                  </Button>
                )}
              </form>
            )}

            {step === "code" && !isNewUser && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setFormData({ ...formData, code: "" });
                  }}
                  className="text-sm text-gray-500 hover:text-orange-600"
                >
                  返回修改手机号
                </button>
              </div>
            )}

            {!isNewUser && (
              <div className="mt-4 p-3 rounded-lg bg-orange-50 border border-orange-100">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-orange-500 mt-0.5" />
                  <p className="text-xs text-orange-700">
                    登录即表示您同意服务条款。首次登录将自动创建账号，手机号即为您的主要账号标识。
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo hint */}
        {step === "code" && !isNewUser && (
          <div className="mt-4 p-3 rounded-lg bg-gray-100 border border-gray-200 text-center">
            <p className="text-xs text-gray-600">
              演示模式：输入任意6位数字验证码即可登录
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
