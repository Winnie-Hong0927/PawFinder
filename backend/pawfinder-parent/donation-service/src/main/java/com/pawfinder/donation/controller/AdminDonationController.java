package com.pawfinder.donation.controller;

import com.pawfinder.donation.dto.req.CampaignCreateReq;
import com.pawfinder.donation.dto.resp.CampaignResp;
import com.pawfinder.donation.dto.resp.DonationResp;
import com.pawfinder.donation.service.DonationService;
import com.pawfinder.common.dto.resp.ApiResponse;
import com.pawfinder.common.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/donations")
@RequiredArgsConstructor
public class AdminDonationController {
    private final DonationService donationService;
    private final JwtUtils jwtUtils;

    @PostMapping("/campaigns")
    public ApiResponse<Long> createCampaign(
            HttpServletRequest request,
            @Valid @RequestBody CampaignCreateReq req) {
        Long adminId = getAdminId(request);
        return donationService.createCampaign(adminId, req);
    }

    @PutMapping("/campaigns/{id}")
    public ApiResponse<Void> updateCampaign(
            @PathVariable Long id,
            @Valid @RequestBody CampaignCreateReq req) {
        return donationService.updateCampaign(id, req);
    }

    @PutMapping("/campaigns/{id}/status")
    public ApiResponse<Void> updateCampaignStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return donationService.updateCampaignStatus(id, status);
    }

    @GetMapping("/campaigns")
    public ApiResponse<List<CampaignResp>> getAllCampaigns() {
        return donationService.getAllCampaigns();
    }

    @GetMapping("/donations")
    public ApiResponse<List<DonationResp>> getAllDonations() {
        // Not implemented - would need a new mapper method
        return ApiResponse.success(List.of());
    }

    @GetMapping("/campaigns/count")
    public ApiResponse<Long> getActiveCampaignCount() {
        return donationService.getActiveCampaignCount();
    }

    private Long getAdminId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        return jwtUtils.getUserIdFromToken(token);
    }
}
