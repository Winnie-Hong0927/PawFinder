import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from '@/lib/api-config';

/**
 * GET /api/pets/[id]/applications-count - 获取宠物申请人数
 * 前端代理层，转发到后端领养服务
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 调用后端获取申请人数
    const response = await fetch(API_ENDPOINTS.petApplicationCount(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    // 后端返回格式: { code: 200, message: 'success', data: 0 }
    if (result.code !== 200) {
      return NextResponse.json({ 
        success: false, 
        error: result.message || '获取申请人数失败' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true, 
      count: result.data || 0 
    });
  } catch (error) {
    console.error("Get applications count proxy error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "获取申请人数失败" 
    }, { status: 500 });
  }
}
