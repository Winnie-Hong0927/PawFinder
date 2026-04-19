import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// 会话有效期：24小时
const SESSION_TTL = 24 * 60 * 60 * 1000;

// 获取 Supabase 客户端（使用服务角色密钥）
function getSupabaseAdmin() {
  const supabaseUrl = process.env.COZE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.COZE_SUPABASE_SERVICE_ROLE_KEY || process.env.COZE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// 生成随机会话ID
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// 创建会话
export async function createSession(userId: string, user: Record<string, unknown>): Promise<string> {
  const supabase = getSupabaseAdmin();
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_TTL);

  const { error } = await supabase
    .from('sessions')
    .insert({
      id: sessionId,
      user_id: userId,
      user_data: user,
      expires_at: expiresAt.toISOString()
    });

  if (error) {
    console.error('Failed to create session:', error);
    throw new Error('Failed to create session');
  }

  return sessionId;
}

// 获取会话
export async function getSession(sessionId: string): Promise<{ userId: string; user: Record<string, unknown> } | null> {
  if (!sessionId) return null;
  
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('sessions')
    .select('user_id, user_data')
    .eq('id', sessionId)
    .single();

  if (error || !data) return null;
  
  // 检查是否过期
  const expiresAt = new Date(data.expires_at);
  if (Date.now() > expiresAt.getTime()) {
    // 删除过期会话
    await supabase.from('sessions').delete().eq('id', sessionId);
    return null;
  }
  
  // 确保 user_data 是纯 JSON 对象
  const userData = JSON.parse(JSON.stringify(data.user_data));
  
  return { userId: data.user_id, user: userData };
}

// 删除会话
export async function deleteSession(sessionId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase.from('sessions').delete().eq('id', sessionId);
}

// 获取当前会话（从 cookie）
export async function getCurrentSession(): Promise<{ userId: string; user: Record<string, unknown> } | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;
  if (!sessionId) return null;
  return getSession(sessionId);
}

// 设置会话 cookie
export function getSessionCookie(sessionId: string): string {
  return `session_id=${sessionId}; Path=/; HttpOnly; Max-Age=${SESSION_TTL / 1000}; SameSite=Lax`;
}

// 清理过期会话（可定时调用）
export async function cleanupExpiredSessions(): Promise<void> {
  const supabase = getSupabaseAdmin();
  await supabase
    .from('sessions')
    .delete()
    .lt('expires_at', new Date().toISOString());
}
