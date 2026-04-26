package com.pawfinder.adoption.dto;

import com.pawfinder.adoption.constants.AdoptionStatusEnum;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Application review request DTO
 */
@Data
public class ApplicationReviewRequest {

    @NotBlank(message = "审核状态不能为空")
    private AdoptionStatusEnum status;

    private String adminNotes;
}
