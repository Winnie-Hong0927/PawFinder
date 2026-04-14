package com.pawfinder.donation.dto.req;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class DonationReq {
    @NotNull(message = "项目ID不能为空")
    private Long campaignId;
    
    @NotNull(message = "金额不能为空")
    @Positive(message = "金额必须为正数")
    private BigDecimal amount;
    
    private String paymentMethod;
    private String anonymous;
    private String message;
}
