package com.pawfinder.search.feign;

import com.pawfinder.common.result.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 宠物服务 Feign 客户端
 */
@FeignClient(name = "pawfinder-pet", path = "/api/pet/v1", fallbackFactory = PetClientFallbackFactory.class)
public interface PetClient {

    /**
     * 获取宠物详情
     */
    @GetMapping("/pets/{petId}")
    Result<Map<String, Object>> getPet(@PathVariable("petId") String petId);

    /**
     * 获取宠物列表
     */
    @GetMapping("/pets")
    Result<Map<String, Object>> listPets(@RequestParam(required = false) String status,
                                          @RequestParam(defaultValue = "1") int page,
                                          @RequestParam(defaultValue = "100") int size);

    /**
     * 获取所有宠物（用于同步到 ES）
     */
    @GetMapping("/pets/all")
    Result<Map<String, Object>> getAllPets();
}
