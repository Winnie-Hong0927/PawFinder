package com.pawfinder.adoption.controller;

import com.pawfinder.adoption.dto.req.ApplicationReviewReq;
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
@RequestMapping("/api/admin/adoptions")
@RequiredArgsConstructor
public class AdminAdoptionController {
    private final AdoptionService adoptionService;
    private final JwtUtils jwtUtils;

    @GetMapping("/applications")
    public ApiResponse<List<ApplicationResp>> getApplicationsByStatus(
            @RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return adoptionService.getApplicationsByStatus(status);
        }
        return adoptionService.getPendingApplications();
    }

    @GetMapping("/applications/pending/count")
    public ApiResponse<Long> getPendingCount() {
        return adoptionService.getPendingApplicationCount();
    }

    @PutMapping("/applications/{id}/review")
    public ApiResponse<Void> reviewApplication(
            HttpServletRequest request,
            @PathVariable Long id,
            @Valid @RequestBody ApplicationReviewReq req) {
        Long adminId = getAdminId(request);
        return adoptionService.reviewApplication(adminId, id, req);
    }

    // Video management
    @GetMapping("/videos")
    public ApiResponse<List<VideoResp>> getVideos(@RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return adoptionService.getVideosByAdoption(null); // by status not implemented separately
        }
        return adoptionService.getPendingVideos();
    }

    @PutMapping("/videos/{id}/review")
    public ApiResponse<Void> reviewVideo(
            HttpServletRequest request,
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String reviewNotes) {
        Long adminId = getAdminId(request);
        return adoptionService.reviewVideo(adminId, id, status, reviewNotes);
    }

    private Long getAdminId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        return jwtUtils.getUserIdFromToken(token);
    }
}
