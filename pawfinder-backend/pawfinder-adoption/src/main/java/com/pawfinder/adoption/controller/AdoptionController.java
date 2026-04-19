package com.pawfinder.adoption.controller;

import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.common.result.Result;
import com.pawfinder.common.util.JwtUtil;
import com.pawfinder.common.util.PageResult;
import com.pawfinder.adoption.dto.ApplicationCreateRequest;
import com.pawfinder.adoption.dto.ApplicationReviewRequest;
import com.pawfinder.adoption.dto.ApplicationVO;
import com.pawfinder.adoption.service.AdoptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@Tag(name = "领养申请管理")
@RestController
@RequestMapping("/api/adoption/v1/applications")
public class AdoptionController {

    private final AdoptionService adoptionService;

    public AdoptionController(AdoptionService adoptionService) {
        this.adoptionService = adoptionService;
    }

    @Operation(summary = "获取申请详情")
    @GetMapping("/{id}")
    public Result<ApplicationVO> getById(@PathVariable String id) {
        ApplicationVO application = adoptionService.getById(id);
        return Result.success(application);
    }

    @Operation(summary = "获取宠物申请人数")
    @GetMapping("/pet/{petId}/count")
    public Result<Long> getCountByPetId(@PathVariable String petId) {
        Long count = adoptionService.getApplicationCountByPetId(petId);
        return Result.success(count);
    }

    @Operation(summary = "获取当前用户的申请列表")
    @GetMapping("/my")
    public Result<PageResult<ApplicationVO>> listMyApplications(
            HttpServletRequest request,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        String userId = getUserIdFromRequest(request);
        PageResult<ApplicationVO> result = adoptionService.listByUser(userId, page, size, status);
        return Result.success(result);
    }

    @Operation(summary = "获取申请列表（管理员）")
    @GetMapping
    public Result<PageResult<ApplicationVO>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String petId,
            @RequestParam(required = false) String userId) {
        PageResult<ApplicationVO> result = adoptionService.listAll(page, size, status, petId, userId);
        return Result.success(result);
    }

    @Operation(summary = "提交领养申请")
    @PostMapping
    public Result<ApplicationVO> create(
            HttpServletRequest request,
            @Valid @RequestBody ApplicationCreateRequest createRequest) {
        String userId = getUserIdFromRequest(request);
        ApplicationVO application = adoptionService.create(userId, createRequest);
        return Result.success(application);
    }

    @Operation(summary = "审核申请（管理员）")
    @PutMapping("/{id}/review")
    public Result<ApplicationVO> review(
            @PathVariable String id,
            HttpServletRequest request,
            @Valid @RequestBody ApplicationReviewRequest reviewRequest) {
        String adminId = getUserIdFromRequest(request);
        ApplicationVO application = adoptionService.review(id, adminId, reviewRequest);
        return Result.success(application);
    }

    @Operation(summary = "取消申请")
    @DeleteMapping("/{id}")
    public Result<Void> cancel(
            @PathVariable String id,
            HttpServletRequest request) {
        String userId = getUserIdFromRequest(request);
        adoptionService.cancel(id, userId);
        return Result.success();
    }

    private String getUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        String token = authHeader.substring(7);
        return JwtUtil.getUserId(token);
    }
}
