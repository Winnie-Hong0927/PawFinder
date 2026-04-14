package com.pawfinder.adoption.entity;

import com.pawfinder.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class Adoption extends BaseEntity {
    private Long userId;
    private Long petId;
    private Long applicationId;
    private String status; // active, cancelled, terminated
    private String notes;
}
