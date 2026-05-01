import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from '@/lib/api-config';

/**
 * 通用后端请求方法
 */
async function requestBackend<T>(
  url: string,
  options: RequestInit = {},
  request: NextRequest
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 如果前端有token，也传递
  const cookieHeader = request.headers.get("cookie") || "";
  if (cookieHeader.includes('token=')) {
    const match = cookieHeader.match(/token=([^;]+)/);
    if (match) {
      headers['Authorization'] = `Bearer ${match[1]}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response.json();
}

/**
 * GET /api/pets/[id] - 获取宠物详情
 * 前端代理层，转发到后端宠物服务 GET /api/pet/v1/pets/{id}
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // 获取宠物信息和申请人数
    const [petResult, countResult] = await Promise.all([
      requestBackend<{
        code: number;
        message: string;
        data: any;
      }>(API_ENDPOINTS.petById(id), { method: 'GET' }, request),
      requestBackend<{
        code: number;
        data: number;
      }>(API_ENDPOINTS.petApplicationCount(id), { method: 'GET' }, request).catch(() => ({ code: 500, data: 0 })),
    ]);

    // 后端返回格式: { code: 200, message: 'success', data: {...} }
    if (petResult.code !== 200) {
      return NextResponse.json(
        { error: petResult.message || '获取宠物详情失败' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pet: petResult.data,
      application_count: countResult.code === 200 ? countResult.data : 0,
    });
  } catch (error) {
    console.error("Get pet proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/pets/[id] - 更新宠物
 * 前端代理层，转发到后端宠物服务 POST /api/pet/v1/pets/update/{id}
 * 
 * 注意：后端更新接口是 POST 而不是 PUT
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const result = await requestBackend<{
      code: number;
      message: string;
      data: any;
    }>(API_ENDPOINTS.updatePet(id), {
      method: 'POST',
      body: JSON.stringify(body),
    }, request);

    // 后端返回格式: { code: 200, message: 'success', data: {...} }
    if (result.code !== 200) {
      return NextResponse.json(
        { error: result.message || '更新宠物失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message || '更新成功',
      pet: result.data,
    });
  } catch (error) {
    console.error("Update pet proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/pets/[id] - 删除宠物
 * 前端代理层，转发到后端宠物服务 POST /api/pet/v1/pets/delete/{id}
 * 
 * 注意：后端删除接口是 POST 而不是 DELETE
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = await requestBackend<{
      code: number;
      message: string;
    }>(API_ENDPOINTS.deletePet(id), {
      method: 'POST',
    }, request);

    // 后端返回格式: { code: 200, message: 'success' }
    if (result.code !== 200) {
      return NextResponse.json(
        { error: result.message || '删除宠物失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message || '删除成功',
    });
  } catch (error) {
    console.error("Delete pet proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pets/[id] - 更新宠物状态
 * 前端代理层，转发到后端宠物服务 POST /api/pet/v1/pets/status/{id}
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // 如果是状态更新
    if (body.status) {
      const result = await requestBackend<{
        code: number;
        message: string;
      }>(API_ENDPOINTS.updatePetStatus(id), {
        method: 'POST',
        body: JSON.stringify({ status: body.status }),
      }, request);

      if (result.code !== 200) {
        return NextResponse.json(
          { error: result.message || '更新状态失败' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: result.message || '状态更新成功',
      });
    }

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Update pet status proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
