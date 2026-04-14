package com.pawfinder.chat.entity;

import com.pawfinder.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ChatMessage extends BaseEntity {
    private Long userId;
    private String sessionId;
    private String role; // user, assistant
    private String content;
    private String model; // doubao, deepseek
}
