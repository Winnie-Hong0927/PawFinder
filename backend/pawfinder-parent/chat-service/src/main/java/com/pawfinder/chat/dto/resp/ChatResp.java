package com.pawfinder.chat.dto.resp;

import lombok.Data;

import java.util.List;

@Data
public class ChatResp {
    private String sessionId;
    private String reply;
    private String model;
    private List<PetRecommend> recommendations;
    
    @Data
    public static class PetRecommend {
        private Long id;
        private String name;
        private String species;
        private String breed;
        private String reason;
    }
}
