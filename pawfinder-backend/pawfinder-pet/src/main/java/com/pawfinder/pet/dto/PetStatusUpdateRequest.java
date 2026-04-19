package com.pawfinder.pet.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PetStatusUpdateRequest {

    @NotBlank(message = "状态不能为空")
    private String status;
}
