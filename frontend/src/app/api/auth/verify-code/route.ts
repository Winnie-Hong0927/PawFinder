import { NextResponse } from 'next/server';
import { createSession, getSessionCookie } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();
    
    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: '手机号和验证码不能为空' },
        { status: 400 }
      );
    }
    
    // 验证验证码（测试环境接受任意6位数字）
    if (code !== '123456' && code.length !== 6) {
      return NextResponse.json(
        { success: false, error: '验证码错误' },
        { status: 400 }
      );
    }
    
    // 导入 Supabase 客户端
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.COZE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.COZE_SUPABASE_SERVICE_ROLE_KEY || process.env.COZE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      // 返回错误，让前端知道配置问题
      return NextResponse.json(
        { success: false, error: '数据库配置缺失，请联系管理员' },
        { status: 500 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 查找或创建用户
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();
    
    if (error || !user) {
      // 自动注册新用户（使用手机号生成虚拟邮箱）
      const virtualEmail = `phone_${phone}@pawfinder.local`;
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          phone,
          email: virtualEmail,
          name: `用户${phone.slice(-4)}`,
          role: 'user'
        })
        .select()
        .single();
      
      if (insertError || !newUser) {
        return NextResponse.json(
          { success: false, error: '用户注册失败，请稍后重试' },
          { status: 500 }
        );
      }
      user = newUser;
    }
    
    // 创建会话
    const sessionId = await createSession(user.id, {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      email: user.email,
      institution_id: user.institution_id
    });
    
    // 构建响应
    const response = NextResponse.json({
      success: true,
      message: '登录成功',
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        email: user.email,
        institution_id: user.institution_id
      }
    });
    
    // 设置会话 cookie
    response.cookies.set({
      name: 'session_id',
      value: sessionId,
      httpOnly: true,
      path: '/',
      maxAge: 24 * 60 * 60, // 24小时
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
