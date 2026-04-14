package com.pawfinder.chat.dto.req;

import lombok.Data;

@Data
public class RecommendReq {
    private String preference;
    private String livingCondition;
    private String experience;
    private String familySituation;
}
