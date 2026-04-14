package com.pawfinder.donation.dto.req;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CampaignCreateReq {
    @NotBlank(message = "标题不能为空")
    private String title;
    
    @NotBlank(message = "描述不能为空")
    private String description;
    
    private String imageUrl;
    
    @NotNull(message = "目标金额不能为空")
    @Positive(message = "目标金额必须为正数")
    private BigDecimal targetAmount;
}
