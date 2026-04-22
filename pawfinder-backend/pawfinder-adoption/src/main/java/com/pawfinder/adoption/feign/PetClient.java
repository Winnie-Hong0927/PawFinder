package com.pawfinder.adoption.feign;

import com.pawfinder.common.result.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

/**
 * 宠物服务 Feign 客户端
 * 用于调用宠物服务的接口
 */
@FeignClient(name = "pet-service", fallbackFactory = PetClientFallbackFactory.class)
public interface PetClient {

    /**
     * 根据宠物ID获取宠物信息
     */
    @GetMapping("/api/pet/v1/internal/pets/{id}")
    Result<Map<String, Object>> getPetById(@PathVariable("id") String id);

    /**
     * 更新宠物状态
     */
    @PutMapping("/api/pet/v1/internal/pets/{id}/status")
    Result<Void> updatePetStatus(@PathVariable("id") String id, @RequestBody Map<String, String> request);

    /**
     * 获取宠物申请人数
     */
    @GetMapping("/api/pet/v1/internal/pets/{id}/application-count")
    Result<Long> getApplicationCount(@PathVariable("id") String id);
}
