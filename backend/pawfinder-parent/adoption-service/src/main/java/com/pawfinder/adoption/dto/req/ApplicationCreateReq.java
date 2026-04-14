package com.pawfinder.adoption.dto.req;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationCreateReq {
    @NotNull(message = "宠物ID不能为空")
    private Long petId;
    
    @NotNull(message = "领养理由不能为空")
    private String reason;
    
    @NotNull(message = "身份证号不能为空")
    private String idCard;
    
    private String livingCondition;
    private String experience;
}
