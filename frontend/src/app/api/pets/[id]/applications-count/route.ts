import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from '@/lib/api-config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 调用后端获取申请人数
    const backendUrl = API_ENDPOINTS.petApplicationCount(id);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (result.code !== 0) {
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
    console.error("Get applications count error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "获取申请人数失败" 
    }, { status: 500 });
  }
}
