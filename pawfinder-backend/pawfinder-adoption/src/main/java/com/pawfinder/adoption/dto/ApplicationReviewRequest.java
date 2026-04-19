package com.pawfinder.adoption.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApplicationReviewRequest {

    @NotBlank(message = "审核状态不能为空")
    private String status; // approved, rejected

    private String adminNotes;
}
