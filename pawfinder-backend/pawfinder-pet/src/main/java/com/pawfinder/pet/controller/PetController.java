package com.pawfinder.pet.controller;

import com.pawfinder.common.result.Result;
import com.pawfinder.common.util.PageResult;
import com.pawfinder.pet.dto.PetCreateRequest;
import com.pawfinder.pet.dto.PetStatusUpdateRequest;
import com.pawfinder.pet.dto.PetVO;
import com.pawfinder.pet.service.PetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@Tag(name = "宠物管理")
@RestController
@RequestMapping("/api/pet/v1/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @Operation(summary = "获取宠物列表")
    @GetMapping
    public Result<PageResult<PetVO>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String sizeParam,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword) {
        PageResult<PetVO> result = petService.list(page, size, species, gender, sizeParam, status, keyword);
        return Result.success(result);
    }

    @Operation(summary = "获取所有宠物列表(供搜索服务调用)")
    @GetMapping("/all")
    public Result<java.util.List<PetVO>> listAll() {
        java.util.List<PetVO> pets = petService.listAll();
        return Result.success(pets);
    }

    @Operation(summary = "获取宠物详情")
    @GetMapping("/{id}")
    public Result<PetVO> getById(@PathVariable String id) {
        PetVO pet = petService.getById(id);
        return Result.success(pet);
    }

    @Operation(summary = "创建宠物")
    @PostMapping
    public Result<PetVO> create(@Valid @RequestBody PetCreateRequest request) {
        PetVO pet = petService.create(request);
        return Result.success(pet);
    }

    @Operation(summary = "更新宠物")
    @PostMapping("/update/{id}")
    public Result<PetVO> update(@PathVariable String id, @RequestBody PetCreateRequest request) {
        PetVO pet = petService.update(id, request);
        return Result.success(pet);
    }

    @Operation(summary = "更新宠物状态")
    @PostMapping("/status/{id}")
    public Result<Void> updateStatus(@PathVariable String id, @Valid @RequestBody PetStatusUpdateRequest request) {
        petService.updateStatus(id, request);
        return Result.success();
    }

    @Operation(summary = "删除宠物")
    @PostMapping("/delete/{id}")
    public Result<Void> delete(@PathVariable String id) {
        petService.delete(id);
        return Result.success();
    }
}
