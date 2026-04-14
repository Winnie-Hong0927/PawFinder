package com.pawfinder.adoption.dto.resp;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class BaseResp extends com.pawfinder.common.dto.resp.BaseResp {
    private String createdAt;
    private String updatedAt;
}
