package com.pawfinder.pet.dto;

import com.pawfinder.pet.constants.PetStatusEnum;
import lombok.Data;

/**
 * Pet status update request DTO
 */
@Data
public class PetStatusUpdateRequest {

    private String status;
}
