import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { LLMClient, Config, HeaderUtils } from "coze-coding-dev-sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, session_id, pet_preferences } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const userId = request.headers.get("x-user-id") || null;
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 构建系统提示词
    const systemPrompt = `你是"小 paw"，一个温暖、专业的宠物领养智能助理。你的职责是：
1. 帮助用户找到合适的宠物伴侣
2. 解答领养流程相关问题
3. 提醒领养人上传宠物近况视频
4. 提供养宠建议和指导

请用温暖、友好的语气回答，保持简洁专业。`;

    // 如果用户提供了宠物偏好，进行智能推荐
    let userMessage = message;
    if (pet_preferences) {
      userMessage = `用户希望找到以下特征的宠物：${pet_preferences}。请根据用户的偏好推荐合适的宠物，并给出推荐理由。`;
    }

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ];

    // 调用 LLM
    let responseContent = "";
    const stream = client.stream(messages, { 
      model: "doubao-seed-1-8-251228",
      temperature: 0.7 
    });

    for await (const chunk of stream) {
      if (chunk.content) {
        responseContent += chunk.content.toString();
      }
    }

    // 保存聊天记录
    if (userId && session_id) {
      const dbClient = getSupabaseClient();
      await dbClient
        .from("chat_messages")
        .insert({
          session_id,
          user_id: userId,
          role: "user",
          content: message,
        });
      
      await dbClient
        .from("chat_messages")
        .insert({
          session_id,
          user_id: userId,
          role: "assistant",
          content: responseContent,
        });
    }

    return NextResponse.json({
      success: true,
      response: responseContent,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
