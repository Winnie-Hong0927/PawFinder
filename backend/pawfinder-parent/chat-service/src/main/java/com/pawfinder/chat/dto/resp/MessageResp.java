package com.pawfinder.chat.dto.resp;

import lombok.Data;

@Data
public class MessageResp {
    private Long id;
    private String sessionId;
    private String role;
    private String content;
    private String model;
    private String createdAt;
}
