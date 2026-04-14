package com.pawfinder.adoption.controller;

import com.pawfinder.adoption.dto.req.ApplicationCreateReq;
import com.pawfinder.adoption.dto.req.ApplicationReviewReq;
import com.pawfinder.adoption.dto.req.VideoUploadReq;
import com.pawfinder.adoption.dto.resp.AdoptionResp;
import com.pawfinder.adoption.dto.resp.ApplicationResp;
import com.pawfinder.adoption.dto.resp.VideoResp;
import com.pawfinder.adoption.service.AdoptionService;
import com.pawfinder.common.dto.resp.ApiResponse;
import com.pawfinder.common.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/adoptions")
@RequiredArgsConstructor
public class AdoptionController {
    private final AdoptionService adoptionService;
    private final JwtUtils jwtUtils;

    // ============ User APIs ============
    @PostMapping("/applications")
    public ApiResponse<Long> createApplication(
            HttpServletRequest request,
            @Valid @RequestBody ApplicationCreateReq req) {
        Long userId = getUserId(request);
        return adoptionService.createApplication(userId, req);
    }

    @GetMapping("/applications/my")
    public ApiResponse<List<ApplicationResp>> getMyApplications(HttpServletRequest request) {
        Long userId = getUserId(request);
        return adoptionService.getMyApplications(userId);
    }

    @GetMapping("/applications/{id}")
    public ApiResponse<ApplicationResp> getApplication(@PathVariable Long id) {
        return adoptionService.getApplication(id);
    }

    @DeleteMapping("/applications/{id}")
    public ApiResponse<Void> cancelApplication(HttpServletRequest request, @PathVariable Long id) {
        Long userId = getUserId(request);
        return adoptionService.cancelApplication(userId, id);
    }

    // Adoptions
    @GetMapping("/my")
    public ApiResponse<List<AdoptionResp>> getMyAdoptions(HttpServletRequest request) {
        Long userId = getUserId(request);
        return adoptionService.getMyAdoptions(userId);
    }

    @GetMapping("/{id}")
    public ApiResponse<AdoptionResp> getAdoption(@PathVariable Long id) {
        return adoptionService.getAdoption(id);
    }

    // Videos
    @PostMapping("/videos")
    public ApiResponse<Long> uploadVideo(
            HttpServletRequest request,
            @Valid @RequestBody VideoUploadReq req) {
        Long userId = getUserId(request);
        return adoptionService.uploadVideo(userId, req);
    }

    @GetMapping("/videos/adoption/{adoptionId}")
    public ApiResponse<List<VideoResp>> getVideosByAdoption(@PathVariable Long adoptionId) {
        return adoptionService.getVideosByAdoption(adoptionId);
    }

    @GetMapping("/videos/my")
    public ApiResponse<List<VideoResp>> getMyVideos(HttpServletRequest request) {
        Long userId = getUserId(request);
        return adoptionService.getMyVideos(userId);
    }

    private Long getUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        return jwtUtils.getUserIdFromToken(token);
    }
}
