package com.pawfinder.chat.dto.req;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChatReq {
    @NotBlank(message = "会话ID不能为空")
    private String sessionId;
    
    @NotBlank(message = "消息内容不能为空")
    private String message;
    
    private String model;
}
