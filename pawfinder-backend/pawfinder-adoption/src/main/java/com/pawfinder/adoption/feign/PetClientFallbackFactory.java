package com.pawfinder.adoption.feign;

import com.pawfinder.adoption.feign.dto.PetDTO;
import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.common.result.Result;
import com.pawfinder.pet.dto.PetVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
public class PetClientFallbackFactory implements FallbackFactory<PetClient> {
    @Override
    public PetClient create(Throwable cause) {
        return new PetClient() {
            @Override
            public Result<PetVO> getPetById(String id) {
                log.error("Feign调用 pet-service.getPetById 失败, petId: {}, error: {}", id, cause.getMessage());
                return Result.fail(ErrorCode.FALLBACK_ERROR, "调用宠物服务失败");
            }

            @Override
            public Result<Void> updatePetStatus(String id, Map<String, String> request) {
                log.error("Feign调用 pet-service.updatePetStatus 失败, petId: {}, error: {}", id, cause.getMessage());
                return Result.fail(ErrorCode.FALLBACK_ERROR, "调用宠物服务失败");
            }

            @Override
            public Result<Long> getApplicationCount(String id) {
                log.error("Feign调用 pet-service.getApplicationCount 失败, petId: {}, error: {}", id, cause.getMessage());
                return Result.fail(ErrorCode.FALLBACK_ERROR, "调用宠物服务失败");
            }
        };
    }
}