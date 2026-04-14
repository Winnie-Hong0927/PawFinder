package com.pawfinder.donation.entity;

import com.pawfinder.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class Donation extends BaseEntity {
    private Long campaignId;
    private Long userId;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentStatus; // pending, completed, failed, refunded
    private String transactionId;
    private String anonymous;
    private String message;
}
