package com.pawfinder.donation.dto.resp;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CampaignResp {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private Long donationCount;
    private String status;
    private String createdAt;
}
