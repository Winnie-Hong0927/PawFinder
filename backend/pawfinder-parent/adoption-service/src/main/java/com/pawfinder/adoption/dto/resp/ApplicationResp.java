package com.pawfinder.adoption.dto.resp;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ApplicationResp extends BaseResp {
    private Long id;
    private Long userId;
    private String userName;
    private Long petId;
    private String petName;
    private String reason;
    private String idCard;
    private String livingCondition;
    private String experience;
    private String status;
    private String reviewNotes;
    private String createdAt;
}
