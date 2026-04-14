import Link from "next/link";
import { PawPrint, Heart, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary-50 to-background border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-foreground">PawFinder</span>
            </div>
            <p className="text-sm text-muted-foreground">
              每一个生命都值得被爱。我们致力于帮助流浪宠物找到温暖的新家。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pets" className="text-muted-foreground hover:text-primary-600 transition-colors">
                  领养宠物
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-muted-foreground hover:text-primary-600 transition-colors">
                  爱心捐赠
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary-600 transition-colors">
                  个人中心
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">资源</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary-600 transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary-600 transition-colors">
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-muted-foreground hover:text-primary-600 transition-colors">
                  领养指南
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">联系我们</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                contact@pawfinder.com
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                24小时客服热线
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PawFinder. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
}
