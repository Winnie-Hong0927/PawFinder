package com.pawfinder.adoption.dto;

import com.pawfinder.adoption.constants.AdoptionStatusEnum;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Application review request DTO
 */
@Data
public class ApplicationReviewRequest {
    private AdoptionStatusEnum status;
    private String adminNotes;
}
