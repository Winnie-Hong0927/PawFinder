package com.pawfinder.chat.entity;

import com.pawfinder.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ChatSession extends BaseEntity {
    private Long userId;
    private String sessionId;
    private String title;
    private Long messageCount;
}
