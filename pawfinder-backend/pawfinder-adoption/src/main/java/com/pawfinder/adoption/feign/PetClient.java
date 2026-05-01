package com.pawfinder.adoption.feign;

import com.pawfinder.adoption.feign.dto.PetDTO;
import com.pawfinder.common.result.Result;
import com.pawfinder.pet.dto.PetVO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 宠物服务 Feign 客户端
 * 用于调用宠物服务的接口
 */
@FeignClient(name = "pet-service", contextId = "petClientForAdoption", fallbackFactory = PetClientFallbackFactory.class)
public interface PetClient {

    /**
     * 根据宠物ID获取宠物信息
     */
    @GetMapping("/api/pet/v1/pets/{id}")
    Result<PetVO> getPetById(@PathVariable String id);

    /**
     * 更新宠物状态
     */
    @PostMapping("/api/pet/v1/pets/status/{id}")
    Result<Void> updatePetStatus(@PathVariable String id, @RequestBody Map<String, String> request);

    /**
     * 获取宠物申请人数
     */
    @GetMapping("/api/pet/v1/pets/{id}/application-count")
    Result<Long> getApplicationCount(@PathVariable String id);

    @PostMapping("/api/pet/v1/pets/update/count")
    Result<Void> updateApplicationCount(@RequestParam String id, @RequestParam Integer count);
}