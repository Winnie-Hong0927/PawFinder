package com.pawfinder.adoption.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationVO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String id;

    private String petId;

    private String petName;

    private String petImage;

    private String userId;

    private String userName;

    private String userPhone;

    private String reason;

    private String livingCondition;

    private String experience;

    private Boolean hasOtherPets;

    private String otherPetsDetail;

    private List<String> documents;

    private List<String> livingConditionImages;

    private String status;

    private String adminNotes;

    private String reviewedBy;

    private LocalDateTime reviewedAt;

    private LocalDateTime createdAt;
}
