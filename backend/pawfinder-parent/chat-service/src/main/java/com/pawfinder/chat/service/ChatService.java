package com.pawfinder.chat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pawfinder.chat.dto.req.ChatReq;
import com.pawfinder.chat.dto.req.RecommendReq;
import com.pawfinder.chat.dto.resp.ChatResp;
import com.pawfinder.chat.dto.resp.MessageResp;
import com.pawfinder.chat.dto.resp.SessionResp;
import com.pawfinder.chat.entity.ChatMessage;
import com.pawfinder.chat.entity.ChatSession;
import com.pawfinder.chat.mapper.ChatMapper;
import com.pawfinder.common.dto.resp.ApiResponse;
import com.pawfinder.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {
    private final ChatMapper chatMapper;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Value("${doubao.api-key:}")
    private String apiKey;

    @Value("${doubao.model:doubao-pro}")
    private String model;

    private static final String BASE_URL = "https://ark.cn-beijing.volces.com/api/v3";
    private static final String SYSTEM_PROMPT = """  
        你叫小Paw，是PawFinder宠物领养平台的AI助手。你的任务是：
        1. 友好地回答用户关于宠物领养的问题
        2. 根据用户的需求推荐合适的宠物
        3. 提供领养流程、注意事项等指导
        4. 鼓励领养代替购买，传递温暖和关爱
        
        请用温暖、亲切的语气回答问题。如果涉及医疗建议，请建议咨询专业兽医。
        """;

    public ApiResponse<ChatResp> chat(Long userId, ChatReq req) {
        String sessionId = req.getSessionId();
        
        // Create session if not exists
        ChatSession session = chatMapper.selectSessionById(sessionId);
        if (session == null) {
            session = new ChatSession();
            session.setUserId(userId);
            session.setSessionId(sessionId);
            session.setTitle("新对话");
            session.setCreatedBy(userId);
            chatMapper.insertSession(session);
        }

        // Save user message
        ChatMessage userMessage = new ChatMessage();
        userMessage.setUserId(userId);
        userMessage.setSessionId(sessionId);
        userMessage.setRole("user");
        userMessage.setContent(req.getMessage());
        userMessage.setModel(req.getModel() != null ? req.getModel() : model);
        userMessage.setCreatedBy(userId);
        chatMapper.insertMessage(userMessage);

        // Get conversation history
        List<ChatMessage> history = chatMapper.selectMessagesBySessionId(sessionId);
        String reply = callLLM(history);

        // Save assistant message
        ChatMessage assistantMessage = new ChatMessage();
        assistantMessage.setUserId(userId);
        assistantMessage.setSessionId(sessionId);
        assistantMessage.setRole("assistant");
        assistantMessage.setContent(reply);
        assistantMessage.setModel(req.getModel() != null ? req.getModel() : model);
        assistantMessage.setCreatedBy(userId);
        chatMapper.insertMessage(assistantMessage);

        // Update session
        session.setMessageCount((long) history.size() + 1);
        chatMapper.updateSession(session);

        ChatResp resp = new ChatResp();
        resp.setSessionId(sessionId);
        resp.setReply(reply);
        resp.setModel(req.getModel() != null ? req.getModel() : model);
        return ApiResponse.success(resp);
    }

    private String callLLM(List<ChatMessage> history) {
        if (apiKey == null || apiKey.isEmpty()) {
            return getDefaultResponse(history);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", SYSTEM_PROMPT));
            
            for (ChatMessage msg : history) {
                messages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
            }

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", messages);
            requestBody.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                BASE_URL + "/chat/completions",
                HttpMethod.POST,
                entity,
                Map.class
            );

            if (response.getBody() != null && response.getBody().containsKey("choices")) {
                List<?> choices = (List<?>) response.getBody().get("choices");
                if (!choices.isEmpty()) {
                    Map<?, ?> choice = (Map<?, ?>) choices.get(0);
                    Map<?, ?> message = (Map<?, ?>) choice.get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            log.error("LLM call failed: {}", e.getMessage());
        }
        
        return getDefaultResponse(history);
    }

    private String getDefaultResponse(List<ChatMessage> history) {
        if (history.isEmpty()) {
            return "你好！我是小Paw，PawFinder宠物领养平台的AI助手。很高兴认识你！有什么关于宠物领养的问题我可以帮你解答吗？";
        }
        
        String lastMessage = history.get(history.size() - 1).getContent().toLowerCase();
        
        if (lastMessage.contains("推荐") || lastMessage.contains("适合")) {
            return "根据你的需求，我可以帮你推荐合适的宠物。请告诉我：\n\n1. 你更喜欢猫还是狗？\n2. 你的居住环境是怎样的（公寓/独栋/有院子）？\n3. 你有养宠物的经验吗？\n4. 你希望宠物是什么性格的？\n\n这样我可以给你更精准的推荐哦！";
        }
        
        if (lastMessage.contains("领养") || lastMessage.contains("流程")) {
            return "领养流程很简单：\n\n1. 浏览我们的宠物列表，找到你心仪的TA\n2. 提交领养申请\n3. 我们的工作人员会审核你的申请\n4. 通过审核后，你可以来见见宠物\n5. 确认领养后签署领养协议\n6. 带TA回家，开启幸福生活！\n\n有任何问题随时问我哦~";
        }
        
        if (lastMessage.contains("费用") || lastMessage.contains("多少钱")) {
            return "领养本身是免费的！但领养前需要：\n\n1. 支付一小笔绝育/疫苗费用（根据宠物情况）\n2. 准备好宠物的生活用品\n\n我们希望通过适当的费用筛选出真正有爱心、负责任的领养人。领养代替购买，给流浪宠物一个温暖的家！";
        }
        
        return "感谢你的提问！我会尽力帮助你。请问还有什么关于宠物领养的问题吗？或者你想让我帮你推荐一只合适的宠物？";
    }

    public ApiResponse<ChatResp> recommend(Long userId, RecommendReq req) {
        String prompt = buildRecommendPrompt(req);
        
        ChatMessage userMessage = new ChatMessage();
        userMessage.setUserId(userId);
        userMessage.setSessionId(UUID.randomUUID().toString());
        userMessage.setRole("user");
        userMessage.setContent(prompt);
        userMessage.setModel(model);
        userMessage.setCreatedBy(userId);
        chatMapper.insertMessage(userMessage);

        String reply = callLLM(List.of(userMessage));
        
        ChatResp resp = new ChatResp();
        resp.setSessionId(userMessage.getSessionId());
        resp.setReply(reply);
        resp.setRecommendations(parseRecommendations(reply));
        return ApiResponse.success(resp);
    }

    private String buildRecommendPrompt(RecommendReq req) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("请根据以下信息推荐适合的宠物：\n");
        if (req.getPreference() != null) {
            prompt.append("- 偏好：").append(req.getPreference()).append("\n");
        }
        if (req.getLivingCondition() != null) {
            prompt.append("- 居住环境：").append(req.getLivingCondition()).append("\n");
        }
        if (req.getExperience() != null) {
            prompt.append("- 养宠经验：").append(req.getExperience()).append("\n");
        }
        if (req.getFamilySituation() != null) {
            prompt.append("- 家庭情况：").append(req.getFamilySituation()).append("\n");
        }
        prompt.append("\n请给出2-3只宠物的推荐，并简要说明推荐理由。");
        return prompt.toString();
    }

    private List<ChatResp.PetRecommend> parseRecommendations(String reply) {
        // Simple parsing - in production would use structured output
        return List.of();
    }

    public ApiResponse<List<SessionResp>> getSessions(Long userId) {
        List<ChatSession> sessions = chatMapper.selectSessionsByUserId(userId);
        List<SessionResp> result = new ArrayList<>();
        for (ChatSession session : sessions) {
            SessionResp resp = new SessionResp();
            resp.setSessionId(session.getSessionId());
            resp.setTitle(session.getTitle());
            resp.setMessageCount(session.getMessageCount());
            resp.setCreatedAt(session.getCreatedAt() != null ? session.getCreatedAt().format(formatter) : null);
            
            ChatMessage lastMsg = chatMapper.selectLastMessageBySessionId(session.getSessionId());
            if (lastMsg != null) {
                resp.setLastMessage(lastMsg.getContent());
            }
            result.add(resp);
        }
        return ApiResponse.success(result);
    }

    public ApiResponse<List<MessageResp>> getMessages(String sessionId) {
        List<ChatMessage> messages = chatMapper.selectMessagesBySessionId(sessionId);
        List<MessageResp> result = messages.stream().map(msg -> {
            MessageResp resp = new MessageResp();
            resp.setId(msg.getId());
            resp.setSessionId(msg.getSessionId());
            resp.setRole(msg.getRole());
            resp.setContent(msg.getContent());
            resp.setModel(msg.getModel());
            resp.setCreatedAt(msg.getCreatedAt() != null ? msg.getCreatedAt().format(formatter) : null);
            return resp;
        }).toList();
        return ApiResponse.success(result);
    }

    public ApiResponse<Void> deleteSession(String sessionId) {
        ChatSession session = chatMapper.selectSessionById(sessionId);
        if (session != null) {
            session.setDeleted(1);
            chatMapper.updateSession(session);
        }
        return ApiResponse.success(null);
    }
}
