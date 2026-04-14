package com.pawfinder.chat.controller;

import com.pawfinder.chat.dto.req.ChatReq;
import com.pawfinder.chat.dto.req.RecommendReq;
import com.pawfinder.chat.dto.resp.ChatResp;
import com.pawfinder.chat.dto.resp.MessageResp;
import com.pawfinder.chat.dto.resp.SessionResp;
import com.pawfinder.chat.service.ChatService;
import com.pawfinder.common.dto.resp.ApiResponse;
import com.pawfinder.common.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final JwtUtils jwtUtils;

    @PostMapping
    public ApiResponse<ChatResp> chat(
            HttpServletRequest request,
            @Valid @RequestBody ChatReq req) {
        Long userId = getUserId(request);
        return chatService.chat(userId, req);
    }

    @PostMapping("/recommend")
    public ApiResponse<ChatResp> recommend(
            HttpServletRequest request,
            @RequestBody RecommendReq req) {
        Long userId = getUserId(request);
        return chatService.recommend(userId, req);
    }

    @GetMapping("/sessions")
    public ApiResponse<List<SessionResp>> getSessions(HttpServletRequest request) {
        Long userId = getUserId(request);
        return chatService.getSessions(userId);
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public ApiResponse<List<MessageResp>> getMessages(@PathVariable String sessionId) {
        return chatService.getMessages(sessionId);
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ApiResponse<Void> deleteSession(@PathVariable String sessionId) {
        return chatService.deleteSession(sessionId);
    }

    private Long getUserId(HttpServletRequest request) {
        String auth = request.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.replace("Bearer ", "");
            return jwtUtils.getUserIdFromToken(token);
        }
        return 0L; // Anonymous user
    }
}
