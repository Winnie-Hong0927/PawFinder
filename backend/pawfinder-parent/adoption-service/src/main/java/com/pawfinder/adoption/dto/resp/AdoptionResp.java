package com.pawfinder.adoption.dto.resp;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class AdoptionResp extends BaseResp {
    private Long id;
    private Long userId;
    private String userName;
    private Long petId;
    private String petName;
    private Long applicationId;
    private String status;
    private String notes;
}
