package com.pawfinder.donation.mapper;

import com.pawfinder.donation.entity.Donation;
import com.pawfinder.donation.entity.DonationCampaign;
import org.apache.ibatis.annotations.*;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface DonationMapper {
    // Campaign
    int insertCampaign(DonationCampaign campaign);
    int updateCampaign(DonationCampaign campaign);
    DonationCampaign selectCampaignById(@Param("id") Long id);
    List<DonationCampaign> selectActiveCampaigns();
    List<DonationCampaign> selectAllCampaigns();
    Long countActiveCampaigns();
    
    // Donation
    int insertDonation(Donation donation);
    int updateDonation(Donation donation);
    Donation selectDonationById(@Param("id") Long id);
    List<Donation> selectDonationsByCampaignId(@Param("campaignId") Long campaignId);
    List<Donation> selectDonationsByUserId(@Param("userId") Long userId);
    BigDecimal sumDonationsByCampaignId(@Param("campaignId") Long campaignId);
    Long countDonationsByCampaignId(@Param("campaignId") Long campaignId);
}
