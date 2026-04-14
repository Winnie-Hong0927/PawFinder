package com.pawfinder.donation.service;

import com.pawfinder.donation.dto.req.CampaignCreateReq;
import com.pawfinder.donation.dto.req.DonationReq;
import com.pawfinder.donation.dto.resp.CampaignResp;
import com.pawfinder.donation.dto.resp.DonationResp;
import com.pawfinder.donation.entity.Donation;
import com.pawfinder.donation.entity.DonationCampaign;
import com.pawfinder.donation.mapper.DonationMapper;
import com.pawfinder.common.dto.resp.ApiResponse;
import com.pawfinder.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationService {
    private final DonationMapper donationMapper;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // ============ Campaign ============
    public ApiResponse<Long> createCampaign(Long adminId, CampaignCreateReq req) {
        DonationCampaign campaign = new DonationCampaign();
        campaign.setTitle(req.getTitle());
        campaign.setDescription(req.getDescription());
        campaign.setImageUrl(req.getImageUrl());
        campaign.setTargetAmount(req.getTargetAmount());
        campaign.setCurrentAmount(BigDecimal.ZERO);
        campaign.setStatus("active");
        campaign.setCreatedBy(adminId);
        donationMapper.insertCampaign(campaign);
        return ApiResponse.success(campaign.getId());
    }

    public ApiResponse<List<CampaignResp>> getActiveCampaigns() {
        List<DonationCampaign> campaigns = donationMapper.selectActiveCampaigns();
        return ApiResponse.success(campaigns.stream().map(this::toCampaignResp).collect(Collectors.toList()));
    }

    public ApiResponse<List<CampaignResp>> getAllCampaigns() {
        List<DonationCampaign> campaigns = donationMapper.selectAllCampaigns();
        return ApiResponse.success(campaigns.stream().map(this::toCampaignResp).collect(Collectors.toList()));
    }

    public ApiResponse<CampaignResp> getCampaign(Long id) {
        DonationCampaign campaign = donationMapper.selectCampaignById(id);
        if (campaign == null) {
            throw new BusinessException("项目不存在");
        }
        return ApiResponse.success(toCampaignResp(campaign));
    }

    @Transactional
    public ApiResponse<Void> updateCampaign(Long id, CampaignCreateReq req) {
        DonationCampaign campaign = donationMapper.selectCampaignById(id);
        if (campaign == null) {
            throw new BusinessException("项目不存在");
        }
        campaign.setTitle(req.getTitle());
        campaign.setDescription(req.getDescription());
        campaign.setImageUrl(req.getImageUrl());
        campaign.setTargetAmount(req.getTargetAmount());
        donationMapper.updateCampaign(campaign);
        return ApiResponse.success(null);
    }

    @Transactional
    public ApiResponse<Void> updateCampaignStatus(Long id, String status) {
        DonationCampaign campaign = donationMapper.selectCampaignById(id);
        if (campaign == null) {
            throw new BusinessException("项目不存在");
        }
        campaign.setStatus(status);
        donationMapper.updateCampaign(campaign);
        return ApiResponse.success(null);
    }

    // ============ Donation ============
    @Transactional
    public ApiResponse<Long> donate(Long userId, DonationReq req) {
        DonationCampaign campaign = donationMapper.selectCampaignById(req.getCampaignId());
        if (campaign == null) {
            throw new BusinessException("项目不存在");
        }
        if (!"active".equals(campaign.getStatus())) {
            throw new BusinessException("该项目已结束募捐");
        }

        // Create donation record
        Donation donation = new Donation();
        donation.setCampaignId(req.getCampaignId());
        donation.setUserId(userId);
        donation.setAmount(req.getAmount());
        donation.setPaymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "alipay");
        donation.setPaymentStatus("completed"); // Simulate payment success
        donation.setTransactionId(UUID.randomUUID().toString().replace("-", ""));
        donation.setAnonymous(req.getAnonymous() != null ? req.getAnonymous() : "false");
        donation.setMessage(req.getMessage());
        donation.setCreatedBy(userId);
        donationMapper.insertDonation(donation);

        // Update campaign current amount
        BigDecimal totalAmount = donationMapper.sumDonationsByCampaignId(req.getCampaignId());
        campaign.setCurrentAmount(totalAmount);
        if (totalAmount.compareTo(campaign.getTargetAmount()) >= 0) {
            campaign.setStatus("completed");
        }
        donationMapper.updateCampaign(campaign);

        return ApiResponse.success(donation.getId());
    }

    public ApiResponse<List<DonationResp>> getMyDonations(Long userId) {
        List<Donation> donations = donationMapper.selectDonationsByUserId(userId);
        return ApiResponse.success(donations.stream().map(this::toDonationResp).collect(Collectors.toList()));
    }

    public ApiResponse<List<DonationResp>> getCampaignDonations(Long campaignId) {
        List<Donation> donations = donationMapper.selectDonationsByCampaignId(campaignId);
        return ApiResponse.success(donations.stream().map(this::toDonationResp).collect(Collectors.toList()));
    }

    public ApiResponse<Long> getActiveCampaignCount() {
        return ApiResponse.success(donationMapper.countActiveCampaigns());
    }

    // ============ Mappers ============
    private CampaignResp toCampaignResp(DonationCampaign campaign) {
        CampaignResp resp = new CampaignResp();
        resp.setId(campaign.getId());
        resp.setTitle(campaign.getTitle());
        resp.setDescription(campaign.getDescription());
        resp.setImageUrl(campaign.getImageUrl());
        resp.setTargetAmount(campaign.getTargetAmount());
        resp.setCurrentAmount(campaign.getCurrentAmount());
        resp.setDonationCount(donationMapper.countDonationsByCampaignId(campaign.getId()));
        resp.setStatus(campaign.getStatus());
        resp.setCreatedAt(campaign.getCreatedAt() != null ? campaign.getCreatedAt().format(formatter) : null);
        return resp;
    }

    private DonationResp toDonationResp(Donation donation) {
        DonationResp resp = new DonationResp();
        resp.setId(donation.getId());
        resp.setCampaignId(donation.getCampaignId());
        resp.setUserId(donation.getUserId());
        resp.setAmount(donation.getAmount());
        resp.setPaymentMethod(donation.getPaymentMethod());
        resp.setPaymentStatus(donation.getPaymentStatus());
        resp.setTransactionId(donation.getTransactionId());
        resp.setMessage(donation.getMessage());
        resp.setCreatedAt(donation.getCreatedAt() != null ? donation.getCreatedAt().format(formatter) : null);
        
        if (!"true".equals(donation.getAnonymous())) {
            resp.setUserName("爱心人士");
        }
        return resp;
    }
}
