import { NextRequest, NextResponse } from "next/server";
import { LLMClient, Config, HeaderUtils } from "coze-coding-dev-sdk";
import { GATEWAY_BASE_URL } from "@/lib/api-config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { preferences } = body;

    if (!preferences) {
      return NextResponse.json(
        { success: false, error: "Preferences are required" },
        { status: 400 }
      );
    }

    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 从后端获取所有可用宠物
    const petsResponse = await fetch(`${GATEWAY_BASE_URL}/api/pet/v1/pets?status=available&limit=50`);
    const petsResult = await petsResponse.json();

    if (petsResult.code !== 200) {
      throw new Error(petsResult.message || "Failed to fetch pets");
    }

    const pets = petsResult.data?.records || [];

    if (!pets || pets.length === 0) {
      return NextResponse.json({
        success: true,
        recommendations: [],
        message: "目前没有可领养的宠物",
      });
    }

    // 构建宠物列表
    const petList = pets.map((p: any) => 
      `ID: ${p.id}, 名字: ${p.name}, 种类: ${p.species}, 品种: ${p.breed || '未知'}, 年龄: ${p.age || '未知'}, 性别: ${p.gender || '未知'}, 体型: ${p.size || '未知'}, 特征: ${(p.traits || []).join(', ')}, 描述: ${p.description || '暂无'}`
    ).join("\n");

    // 构建推荐提示词
    const recommendPrompt = `用户希望找到以下特征的宠物：${preferences}

以下是系统中可领养的宠物列表：
${petList}

请根据用户的偏好，从上述列表中推荐最合适的3-5只宠物。对于每只推荐的宠物，请说明：
1. 为什么适合用户
2. 匹配度（高/中/低）
3. 领养注意事项

请以 JSON 格式返回，格式如下：
{
  "recommendations": [
    {
      "pet_id": "xxx",
      "match_reason": "xxx",
      "match_level": "高/中/低"
    }
  ]
}`;

    const messages = [
      { role: "system", content: "你是一个专业的宠物推荐助手。请根据用户的偏好从提供的宠物列表中推荐最合适的宠物。" },
      { role: "user", content: recommendPrompt },
    ];

    // 调用 LLM
    let responseContent = "";
    const stream = client.stream(messages, { 
      model: "doubao-seed-1-8-251228",
      temperature: 0.3 // 低温度保证稳定性
    });

    for await (const chunk of stream) {
      if (chunk.content) {
        responseContent += chunk.content.toString();
      }
    }

    // 解析 LLM 返回的推荐
    interface Recommendation {
      pet_id: string;
      match_reason: string;
      match_level: string;
    }
    let recommendations: Recommendation[] = [];
    try {
      // 尝试提取 JSON
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        recommendations = parsed.recommendations || [];
      }
    } catch (parseError) {
      console.error("Failed to parse recommendations:", parseError);
    }

    // 获取推荐的宠物详情
    const recommendedPets = recommendations.map(rec => {
      const pet = pets.find((p: any) => p.id === rec.pet_id);
      return pet ? { ...pet, match_reason: rec.match_reason, match_level: rec.match_level } : null;
    }).filter(Boolean);

    return NextResponse.json({
      success: true,
      recommendations: recommendedPets,
      raw_response: responseContent,
    });
  } catch (error) {
    console.error("Recommend error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
