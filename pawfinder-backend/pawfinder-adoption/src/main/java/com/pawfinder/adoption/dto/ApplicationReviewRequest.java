package com.pawfinder.adoption.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Application review request DTO
 */
public class ApplicationReviewRequest {

    @NotBlank(message = "审核状态不能为空")
    private String status;

    private String adminNotes;

    public ApplicationReviewRequest() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
}
