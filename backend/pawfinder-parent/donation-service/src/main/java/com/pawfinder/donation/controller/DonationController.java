package com.pawfinder.donation.controller;

import com.pawfinder.donation.dto.req.DonationReq;
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
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {
    private final DonationService donationService;
    private final JwtUtils jwtUtils;

    @GetMapping("/campaigns")
    public ApiResponse<List<CampaignResp>> getActiveCampaigns() {
        return donationService.getActiveCampaigns();
    }

    @GetMapping("/campaigns/all")
    public ApiResponse<List<CampaignResp>> getAllCampaigns() {
        return donationService.getAllCampaigns();
    }

    @GetMapping("/campaigns/{id}")
    public ApiResponse<CampaignResp> getCampaign(@PathVariable Long id) {
        return donationService.getCampaign(id);
    }

    @PostMapping
    public ApiResponse<Long> donate(
            HttpServletRequest request,
            @Valid @RequestBody DonationReq req) {
        Long userId = getUserId(request);
        return donationService.donate(userId, req);
    }

    @GetMapping("/my")
    public ApiResponse<List<DonationResp>> getMyDonations(HttpServletRequest request) {
        Long userId = getUserId(request);
        return donationService.getMyDonations(userId);
    }

    @GetMapping("/campaign/{campaignId}/donations")
    public ApiResponse<List<DonationResp>> getCampaignDonations(@PathVariable Long campaignId) {
        return donationService.getCampaignDonations(campaignId);
    }

    private Long getUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        return jwtUtils.getUserIdFromToken(token);
    }
}
