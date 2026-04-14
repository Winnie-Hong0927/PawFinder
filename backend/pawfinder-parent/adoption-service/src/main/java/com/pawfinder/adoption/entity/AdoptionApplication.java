package com.pawfinder.adoption.entity;

import com.pawfinder.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class AdoptionApplication extends BaseEntity {
    private Long userId;
    private Long petId;
    private String reason;
    private String idCard;
    private String livingCondition;
    private String experience;
    private String status; // pending, approved, rejected
    private String reviewNotes;
    private Long reviewedBy;
}
