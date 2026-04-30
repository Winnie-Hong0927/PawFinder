package com.pawfinder.order.feign;

import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.common.result.Result;
import com.pawfinder.common.util.PageResult;
import com.pawfinder.pet.dto.PetVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 宠物服务降级工厂
 */
@Slf4j
@Component
public class PetClientFallbackFactory implements FallbackFactory<PetClient> {

    @Override
    public PetClient create(Throwable cause) {
        log.error("宠物服务调用失败: {}", cause.getMessage());
        
        return new PetClient() {
            @Override
            public Result<PetVO> getPet(String petId) {
                return Result.fail(ErrorCode.SERVICE_UNAVAILABLE, "宠物服务暂不可用");
            }

            @Override
            public Result<PageResult<PetVO>> listPets(String status, int page, int size) {
                return Result.fail(ErrorCode.SERVICE_UNAVAILABLE, "宠物服务暂不可用");
            }

            @Override
            public Result<List<PetVO>> getAllPets() {
                return Result.fail(ErrorCode.SERVICE_UNAVAILABLE, "宠物服务暂不可用");
            }
        };
    }
}
