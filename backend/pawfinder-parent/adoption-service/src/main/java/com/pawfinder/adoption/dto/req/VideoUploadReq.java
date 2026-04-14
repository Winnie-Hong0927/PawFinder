package com.pawfinder.adoption.dto.req;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VideoUploadReq {
    @NotNull(message = "领养记录ID不能为空")
    private Long adoptionId;
    
    @NotNull(message = "视频URL不能为空")
    private String videoUrl;
    
    private String thumbnailUrl;
    private String description;
}
