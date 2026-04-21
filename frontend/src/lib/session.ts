import { cookies } from 'next/headers';
import { GATEWAY_BASE_URL } from './api-config';

// 会话有效期：24小时
const SESSION_TTL = 24 * 60 * 60 * 1000;

// 从后端获取当前用户信息
export async function getCurrentUser(): Promise<{ userId: string; user: Record<string, unknown> } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) return null;
  
  try {
    const response = await fetch(`${GATEWAY_BASE_URL}/api/user/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) return null;
    
    const result = await response.json();
    if (result.code !== 200 || !result.data) return null;
    
    return {
      userId: result.data.id,
      user: result.data
    };
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

// 获取认证 token
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value || null;
}

// 设置认证 cookie
export function getAuthCookie(token: string, maxAge: number = SESSION_TTL / 1000): string {
  return `auth_token=${token}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Lax`;
}

// 清除认证 cookie
export function getClearAuthCookie(): string {
  return 'auth_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax';
}

// 检查是否已登录
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
