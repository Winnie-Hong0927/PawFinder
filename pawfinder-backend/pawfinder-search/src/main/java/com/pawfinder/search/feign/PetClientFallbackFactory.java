package com.pawfinder.search.feign;

import com.pawfinder.common.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.Map;

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
            public Result<Map<String, Object>> getPet(String petId) {
                return Result.fail("宠物服务暂不可用");
            }

            @Override
            public Result<Map<String, Object>> listPets(String status, int page, int size) {
                return Result.fail("宠物服务暂不可用");
            }
        };
    }
}
