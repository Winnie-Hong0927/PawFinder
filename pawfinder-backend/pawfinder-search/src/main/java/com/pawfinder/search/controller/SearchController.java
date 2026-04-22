package com.pawfinder.search.controller;

import com.pawfinder.common.result.Result;
import com.pawfinder.search.entity.PetDocument;
import com.pawfinder.search.service.SearchService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

/**
 * 搜索控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/search/v1")
public class SearchController {

    @Autowired
    private SearchService searchService;

    /**
     * 搜索宠物
     * 
     * @param keyword 关键词（搜索名称、品种、描述等）
     * @param species 物种: dog, cat, rabbit, other
     * @param gender 性别: male, female
     * @param size 体型: small, medium, large
     * @param status 状态: available, pending, adopted, offline
     * @param page 页码
     * @param size 每页数量
     */
    @GetMapping("/pets")
    public Mono<Result<Map<String, Object>>> searchPets(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        return searchService.searchPets(keyword, species, gender, size, status, page, size)
                .map(Result::success);
    }

    /**
     * 索引宠物（供其他服务调用）
     */
    @PostMapping("/pets")
    public Mono<Result<PetDocument>> indexPet(@RequestBody PetDocument petDocument) {
        return searchService.indexPet(petDocument)
                .map(Result::success);
    }

    /**
     * 批量索引宠物
     */
    @PostMapping("/pets/batch")
    public Mono<Result<String>> indexPets(@RequestBody List<PetDocument> petDocuments) {
        return searchService.indexPets(petDocuments)
                .then(Mono.just(Result.success("索引成功")));
    }

    /**
     * 更新宠物索引
     */
    @PutMapping("/pets/{petId}")
    public Mono<Result<PetDocument>> updatePet(
            @PathVariable("petId") String petId,
            @RequestBody PetDocument petDocument) {
        petDocument.setId(petId);
        return searchService.updatePet(petDocument)
                .map(Result::success);
    }

    /**
     * 删除宠物索引
     */
    @DeleteMapping("/pets/{petId}")
    public Mono<Result<Void>> deletePet(@PathVariable("petId") String petId) {
        return searchService.deletePet(petId)
                .then(Mono.just(Result.success()));
    }
}
