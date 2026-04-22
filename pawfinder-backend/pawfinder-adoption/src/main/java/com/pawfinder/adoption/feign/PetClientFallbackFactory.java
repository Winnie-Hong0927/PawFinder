package com.pawfinder.adoption.feign;

import com.pawfinder.common.result.Result;
import com.pawfinder.common.result.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

/**
 * 宠物服务 Feign 降级工厂
 */
@Slf4j
@Component
public class PetClientFallbackFactory implements FallbackFactory<PetClient> {

    @Override
    public PetClient create(Throwable cause) {
        log.error("宠物服务调用失败: {}", cause.getMessage());
        
        return new PetClient() {
            @Override
            public Result<Map<String, Object>> getPetById(@PathVariable("id") String id) {
                log.error("获取宠物信息降级, petId: {}", id);
                return Result.fail(ErrorCode.SERVICE_UNAVAILABLE, "宠物服务暂时不可用");
            }

            @Override
            public Result<Void> updatePetStatus(@PathVariable("id") String id, @RequestBody Map<String, String> request) {
                log.error("更新宠物状态降级, petId: {}", id);
                return Result.fail(ErrorCode.SERVICE_UNAVAILABLE, "宠物服务暂时不可用");
            }

            @Override
            public Result<Long> getApplicationCount(@PathVariable("id") String id) {
                log.error("获取申请人数降级, petId: {}", id);
                return Result.fail(ErrorCode.SERVICE_UNAVAILABLE, "宠物服务暂时不可用");
            }
        };
    }
}
