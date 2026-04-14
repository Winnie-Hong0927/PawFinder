package com.pawfinder.chat.dto.resp;

import lombok.Data;

@Data
public class SessionResp {
    private String sessionId;
    private String title;
    private Long messageCount;
    private String createdAt;
    private String lastMessage;
}
