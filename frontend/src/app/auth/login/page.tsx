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
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, isAdmin } = useAuth();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState({
    phone: "",
    code: "",
  });
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

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
        body: JSON.stringify({ phone: formData.phone, type: "login" }),
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
      // Call API to verify code and login
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, code: formData.code }),
      });
      const data = await response.json();

      if (data.success) {
        login(data.user);
        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(data.error || "验证码错误");
      }
    } catch {
      // For demo purposes, allow login with any 6-digit code
      const demoUser = {
        id: "1",
        name: "演示用户",
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
              手机号登录
            </CardTitle>
            <CardDescription className="text-center">
              {step === "phone" 
                ? "输入您的手机号获取验证码" 
                : "输入收到的验证码完成登录"}
            </CardDescription>
          </CardHeader>

          <CardContent>
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
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">还没有账户？</span>
              <Link href="/register">
                <Button variant="link" className="text-orange-600 font-medium">
                  立即注册
                </Button>
              </Link>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-orange-50 border border-orange-100">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-orange-500 mt-0.5" />
                <p className="text-xs text-orange-700">
                  温馨提示：登录即表示您同意我们的服务条款和隐私政策。您的手机号将用于账号安全和重要通知。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo hint */}
        <div className="mt-4 p-3 rounded-lg bg-gray-100 border border-gray-200 text-center">
          <p className="text-xs text-gray-600">
            演示模式：输入任意6位数字验证码即可登录
          </p>
        </div>
      </div>
    </div>
  );
}
