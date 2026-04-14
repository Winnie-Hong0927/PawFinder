import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ChatWidget } from '@/components/chat/chat-widget';

export const metadata: Metadata = {
  title: {
    default: 'PawFinder - 宠物领养平台',
    template: '%s | PawFinder',
  },
  description:
    'PawFinder 是一个温暖而专业的宠物领养平台，帮助流浪宠物找到温暖的新家。我们提供完善的领养审核流程和领养后管理，确保每一个生命都被善待。',
  keywords: [
    '宠物领养',
    '领养宠物',
    '流浪猫',
    '流浪狗',
    '爱心领养',
    '宠物救助',
    '领养审核',
  ],
  authors: [{ name: 'PawFinder Team' }],
  generator: 'PawFinder',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'PawFinder - 宠物领养平台',
    description: '每一个生命都值得被爱。帮助流浪宠物找到温暖的新家。',
    siteName: 'PawFinder',
    locale: 'zh_CN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
