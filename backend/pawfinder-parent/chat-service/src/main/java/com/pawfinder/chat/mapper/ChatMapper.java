package com.pawfinder.chat.mapper;

import com.pawfinder.chat.entity.ChatMessage;
import com.pawfinder.chat.entity.ChatSession;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ChatMapper {
    // Session
    int insertSession(ChatSession session);
    int updateSession(ChatSession session);
    ChatSession selectSessionById(@Param("sessionId") String sessionId);
    List<ChatSession> selectSessionsByUserId(@Param("userId") Long userId);
    
    // Message
    int insertMessage(ChatMessage message);
    List<ChatMessage> selectMessagesBySessionId(@Param("sessionId") String sessionId);
    ChatMessage selectLastMessageBySessionId(@Param("sessionId") String sessionId);
}
