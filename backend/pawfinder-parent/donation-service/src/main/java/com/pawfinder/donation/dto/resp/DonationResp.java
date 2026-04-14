package com.pawfinder.donation.dto.resp;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DonationResp {
    private Long id;
    private Long campaignId;
    private String campaignTitle;
    private Long userId;
    private String userName;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentStatus;
    private String transactionId;
    private String message;
    private String createdAt;
}
