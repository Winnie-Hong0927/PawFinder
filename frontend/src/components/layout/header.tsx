"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, PawPrint, Users, Gift, LogIn, User, Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "首页", icon: PawPrint },
    { href: "/pets", label: "领养宠物", icon: Heart },
    { href: "/donate", label: "我要捐赠", icon: Gift },
    ...(isAuthenticated ? [
      { href: isAdmin ? "/admin" : "/dashboard", label: isAdmin ? "管理后台" : "个人中心", icon: isAdmin ? Settings : Users },
    ] : []),
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground">PawFinder</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "gap-2",
                    pathname === item.href && "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* Auth Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-muted-foreground">
                  {user?.name || user?.phone}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  退出
                </Button>
              </div>
            ) : (
              <Link href="/auth/login" className="ml-4">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 gap-2">
                  <LogIn className="w-4 h-4" />
                  登录 / 注册
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2 mb-1",
                    pathname === item.href && "bg-orange-100 text-orange-700"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* Mobile Auth Button */}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-500"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                退出登录
              </Button>
            ) : (
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 gap-2">
                  <LogIn className="w-4 h-4" />
                  登录 / 注册
                </Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
