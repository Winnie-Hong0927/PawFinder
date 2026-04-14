package com.pawfinder.donation.entity;

import com.pawfinder.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
public class DonationCampaign extends BaseEntity {
    private String title;
    private String description;
    private String imageUrl;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private String status; // active, completed, cancelled
}
