package com.pawfinder.user.controller;

import com.pawfinder.common.result.Result;
import com.pawfinder.common.util.PageResult;
import com.pawfinder.user.dto.InstitutionCreateRequest;
import com.pawfinder.user.dto.InstitutionVO;
import com.pawfinder.user.service.InstitutionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@Tag(name = "机构管理")
@RestController
@RequestMapping("/api/user/v1/institutions")
public class InstitutionController {

    private final InstitutionService institutionService;

    public InstitutionController(InstitutionService institutionService) {
        this.institutionService = institutionService;
    }

    @Operation(summary = "获取机构列表")
    @GetMapping
    public Result<PageResult<InstitutionVO>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        PageResult<InstitutionVO> result = institutionService.list(page, size, keyword);
        return Result.success(result);
    }

    @Operation(summary = "获取机构详情")
    @GetMapping("/{id}")
    public Result<InstitutionVO> getById(@PathVariable String id) {
        InstitutionVO institution = institutionService.getById(id);
        return Result.success(institution);
    }

    @Operation(summary = "创建机构")
    @PostMapping
    public Result<InstitutionVO> create(@Valid @RequestBody InstitutionCreateRequest request) {
        InstitutionVO institution = institutionService.create(request);
        return Result.success(institution);
    }

    @Operation(summary = "更新机构")
    @PutMapping("/{id}")
    public Result<InstitutionVO> update(
            @PathVariable String id,
            @RequestBody InstitutionCreateRequest request) {
        InstitutionVO institution = institutionService.update(id, request);
        return Result.success(institution);
    }
}
