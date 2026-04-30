package com.pawfinder.adoption.controller;

import com.pawfinder.adoption.dto.ApplicationCreateRequest;
import com.pawfinder.adoption.dto.ApplicationReviewRequest;
import com.pawfinder.adoption.dto.ApplicationVO;
import com.pawfinder.adoption.service.AdoptionService;
import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.common.result.Result;
import com.pawfinder.common.util.JwtUtil;
import com.pawfinder.common.util.PageResult;
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

/**
 * 构造方法：通过依赖注入方式初始化AdoptionController
 * @param adoptionService 注入的AdoptionService服务接口实现类实例
 */
    public AdoptionController(AdoptionService adoptionService) {
        // 将传入的adoptionService实例赋值给类的成员变量adoptionService
        this.adoptionService = adoptionService;
    }

    @Operation(summary = "获取申请详情")
    @GetMapping("/{id}")
    public Result<ApplicationVO> getById(@PathVariable String id) {
        return adoptionService.getById(id);
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
        return adoptionService.create(userId, createRequest);
    }

    @Operation(summary = "审核申请（管理员）")
    @PostMapping("/{id}/review")
    public Result<ApplicationVO> review(
            @PathVariable String id,
            HttpServletRequest request,
            @Valid @RequestBody ApplicationReviewRequest reviewRequest) {
        String adminId = getUserIdFromRequest(request);
        return adoptionService.review(id, adminId, reviewRequest);
    }

    @Operation(summary = "取消申请")
    @PostMapping("/cancel/{id}")
    public Result<Void> cancel(
            @PathVariable String id,
            HttpServletRequest request) {
        String userId = getUserIdFromRequest(request);
        return adoptionService.cancel(id, userId);
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
