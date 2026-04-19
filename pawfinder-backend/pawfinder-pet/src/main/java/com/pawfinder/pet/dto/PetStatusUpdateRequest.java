package com.pawfinder.pet.dto;

/**
 * Pet status update request DTO
 */
public class PetStatusUpdateRequest {

    private String status;

    public PetStatusUpdateRequest() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
