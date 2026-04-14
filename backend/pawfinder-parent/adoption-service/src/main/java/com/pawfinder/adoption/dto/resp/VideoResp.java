package com.pawfinder.adoption.dto.resp;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class VideoResp extends BaseResp {
    private Long id;
    private Long adoptionId;
    private Long userId;
    private Long petId;
    private String petName;
    private String videoUrl;
    private String thumbnailUrl;
    private String description;
    private String status;
    private String reviewNotes;
    private String nextReminderDate;
}
