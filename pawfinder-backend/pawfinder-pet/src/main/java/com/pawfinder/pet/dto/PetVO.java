package com.pawfinder.pet.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String name;

    private String species;

    private String breed;

    private String age;

    private String gender;

    private String size;

    private List<String> images;

    private String description;

    private List<String> traits;

    private String healthStatus;

    private Boolean vaccinationStatus;

    private Boolean sterilizationStatus;

    private String shelterLocation;

    private BigDecimal adoptionFee;

    private String status;

    private String institutionId;

    private String institutionName;

    private LocalDateTime createdAt;

    /**
     * Number of adoption applications for this pet
     */
    private Long applicationCount;
}
