package com.pawfinder.adoption.service;

import com.pawfinder.adoption.dto.req.ApplicationCreateReq;
import com.pawfinder.adoption.dto.req.ApplicationReviewReq;
import com.pawfinder.adoption.dto.req.VideoUploadReq;
import com.pawfinder.adoption.dto.resp.AdoptionResp;
import com.pawfinder.adoption.dto.resp.ApplicationResp;
import com.pawfinder.adoption.dto.resp.VideoResp;
import com.pawfinder.adoption.entity.Adoption;
import com.pawfinder.adoption.entity.AdoptionApplication;
import com.pawfinder.adoption.entity.PetVideo;
import com.pawfinder.adoption.mapper.AdoptionMapper;
import com.pawfinder.common.dto.resp.ApiResponse;
import com.pawfinder.common.enums.AdoptionStatusEnum;
import com.pawfinder.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdoptionService {
    private final AdoptionMapper adoptionMapper;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // ============ AdoptionApplication ============
    public ApiResponse<Long> createApplication(Long userId, ApplicationCreateReq req) {
        // Check if user already has pending application for this pet
        List<AdoptionApplication> existing = adoptionMapper.selectApplicationsByUserId(userId);
        boolean hasPending = existing.stream()
                .anyMatch(a -> a.getPetId().equals(req.getPetId()) && "pending".equals(a.getStatus()));
        if (hasPending) {
            throw new BusinessException("您已提交过该宠物的领养申请，请等待审核结果");
        }

        AdoptionApplication app = new AdoptionApplication();
        app.setUserId(userId);
        app.setPetId(req.getPetId());
        app.setReason(req.getReason());
        app.setIdCard(req.getIdCard());
        app.setLivingCondition(req.getLivingCondition());
        app.setExperience(req.getExperience());
        app.setStatus(AdoptionStatusEnum.PENDING.getCode());
        app.setCreatedBy(userId);
        adoptionMapper.insertApplication(app);
        return ApiResponse.success(app.getId());
    }

    public ApiResponse<List<ApplicationResp>> getMyApplications(Long userId) {
        List<AdoptionApplication> apps = adoptionMapper.selectApplicationsByUserId(userId);
        List<ApplicationResp> result = apps.stream().map(this::toApplicationResp).collect(Collectors.toList());
        return ApiResponse.success(result);
    }

    public ApiResponse<ApplicationResp> getApplication(Long id) {
        AdoptionApplication app = adoptionMapper.selectApplicationById(id);
        if (app == null) {
            throw new BusinessException("申请不存在");
        }
        return ApiResponse.success(toApplicationResp(app));
    }

    public ApiResponse<Void> cancelApplication(Long userId, Long applicationId) {
        AdoptionApplication app = adoptionMapper.selectApplicationById(applicationId);
        if (app == null) {
            throw new BusinessException("申请不存在");
        }
        if (!app.getUserId().equals(userId)) {
            throw new BusinessException("无权限操作");
        }
        if (!"pending".equals(app.getStatus())) {
            throw new BusinessException("只有待审核的申请可以取消");
        }
        app.setStatus(AdoptionStatusEnum.CANCELLED.getCode());
        adoptionMapper.updateApplication(app);
        return ApiResponse.success(null);
    }

    // Admin operations
    public ApiResponse<List<ApplicationResp>> getApplicationsByStatus(String status) {
        List<AdoptionApplication> apps = adoptionMapper.selectApplicationsByStatus(status);
        return ApiResponse.success(apps.stream().map(this::toApplicationResp).collect(Collectors.toList()));
    }

    public ApiResponse<List<ApplicationResp>> getPendingApplications() {
        return getApplicationsByStatus(AdoptionStatusEnum.PENDING.getCode());
    }

    public ApiResponse<Void> reviewApplication(Long adminId, Long applicationId, ApplicationReviewReq req) {
        AdoptionApplication app = adoptionMapper.selectApplicationById(applicationId);
        if (app == null) {
            throw new BusinessException("申请不存在");
        }
        if (!AdoptionStatusEnum.PENDING.getCode().equals(app.getStatus())) {
            throw new BusinessException("只能审核待处理的申请");
        }
        app.setStatus(req.getStatus());
        app.setReviewNotes(req.getReviewNotes());
        app.setReviewedBy(adminId);
        adoptionMapper.updateApplication(app);
        return ApiResponse.success(null);
    }

    // ============ Adoption ============
    @Transactional
    public ApiResponse<Long> completeAdoption(Long userId, Long applicationId, Long petId) {
        // Create adoption record
        Adoption adoption = new Adoption();
        adoption.setUserId(userId);
        adoption.setPetId(petId);
        adoption.setApplicationId(applicationId);
        adoption.setStatus(AdoptionStatusEnum.ACTIVE.getCode());
        adoption.setCreatedBy(userId);
        adoptionMapper.insertAdoption(adoption);
        return ApiResponse.success(adoption.getId());
    }

    public ApiResponse<List<AdoptionResp>> getMyAdoptions(Long userId) {
        List<Adoption> adoptions = adoptionMapper.selectAdoptionsByUserId(userId);
        return ApiResponse.success(adoptions.stream().map(this::toAdoptionResp).collect(Collectors.toList()));
    }

    public ApiResponse<AdoptionResp> getAdoption(Long id) {
        Adoption adoption = adoptionMapper.selectAdoptionById(id);
        if (adoption == null) {
            throw new BusinessException("领养记录不存在");
        }
        return ApiResponse.success(toAdoptionResp(adoption));
    }

    @Transactional
    public ApiResponse<Void> updateAdoptionStatus(Long id, String status, String notes) {
        Adoption adoption = adoptionMapper.selectAdoptionById(id);
        if (adoption == null) {
            throw new BusinessException("领养记录不存在");
        }
        adoption.setStatus(status);
        adoption.setNotes(notes);
        adoptionMapper.updateAdoption(adoption);
        return ApiResponse.success(null);
    }

    // ============ PetVideo ============
    public ApiResponse<Long> uploadVideo(Long userId, VideoUploadReq req) {
        PetVideo video = new PetVideo();
        video.setAdoptionId(req.getAdoptionId());
        video.setUserId(userId);
        video.setPetId(req.getPetId() != null ? req.getPetId() : 0L);
        video.setVideoUrl(req.getVideoUrl());
        video.setThumbnailUrl(req.getThumbnailUrl());
        video.setDescription(req.getDescription());
        video.setStatus(AdoptionStatusEnum.PENDING.getCode());
        video.setCreatedBy(userId);
        adoptionMapper.insertVideo(video);
        return ApiResponse.success(video.getId());
    }

    public ApiResponse<List<VideoResp>> getVideosByAdoption(Long adoptionId) {
        List<PetVideo> videos = adoptionMapper.selectVideosByAdoptionId(adoptionId);
        return ApiResponse.success(videos.stream().map(this::toVideoResp).collect(Collectors.toList()));
    }

    public ApiResponse<List<VideoResp>> getMyVideos(Long userId) {
        List<PetVideo> videos = adoptionMapper.selectVideosByUserId(userId);
        return ApiResponse.success(videos.stream().map(this::toVideoResp).collect(Collectors.toList()));
    }

    public ApiResponse<List<VideoResp>> getPendingVideos() {
        List<PetVideo> videos = adoptionMapper.selectVideosByStatus(AdoptionStatusEnum.PENDING.getCode());
        return ApiResponse.success(videos.stream().map(this::toVideoResp).collect(Collectors.toList()));
    }

    public ApiResponse<Void> reviewVideo(Long adminId, Long videoId, String status, String reviewNotes) {
        PetVideo video = adoptionMapper.selectVideoById(videoId);
        if (video == null) {
            throw new BusinessException("视频不存在");
        }
        video.setStatus(status);
        video.setReviewNotes(reviewNotes);
        video.setReviewedBy(adminId);
        if (AdoptionStatusEnum.APPROVED.getCode().equals(status)) {
            video.setNextReminderDate(LocalDateTime.now().plusMonths(1));
        }
        adoptionMapper.updateVideo(video);
        return ApiResponse.success(null);
    }

    // Statistics
    public ApiResponse<Long> getPendingApplicationCount() {
        return ApiResponse.success(adoptionMapper.countApplicationsByStatus(AdoptionStatusEnum.PENDING.getCode()));
    }

    // ============ Mappers ============
    private ApplicationResp toApplicationResp(AdoptionApplication app) {
        ApplicationResp resp = new ApplicationResp();
        resp.setId(app.getId());
        resp.setUserId(app.getUserId());
        resp.setPetId(app.getPetId());
        resp.setReason(app.getReason());
        resp.setIdCard(app.getIdCard());
        resp.setLivingCondition(app.getLivingCondition());
        resp.setExperience(app.getExperience());
        resp.setStatus(app.getStatus());
        resp.setReviewNotes(app.getReviewNotes());
        resp.setCreatedAt(app.getCreatedAt() != null ? app.getCreatedAt().format(formatter) : null);
        resp.setUpdatedAt(app.getUpdatedAt() != null ? app.getUpdatedAt().format(formatter) : null);
        return resp;
    }

    private AdoptionResp toAdoptionResp(Adoption adoption) {
        AdoptionResp resp = new AdoptionResp();
        resp.setId(adoption.getId());
        resp.setUserId(adoption.getUserId());
        resp.setPetId(adoption.getPetId());
        resp.setApplicationId(adoption.getApplicationId());
        resp.setStatus(adoption.getStatus());
        resp.setNotes(adoption.getNotes());
        resp.setCreatedAt(adoption.getCreatedAt() != null ? adoption.getCreatedAt().format(formatter) : null);
        resp.setUpdatedAt(adoption.getUpdatedAt() != null ? adoption.getUpdatedAt().format(formatter) : null);
        return resp;
    }

    private VideoResp toVideoResp(PetVideo video) {
        VideoResp resp = new VideoResp();
        resp.setId(video.getId());
        resp.setAdoptionId(video.getAdoptionId());
        resp.setUserId(video.getUserId());
        resp.setPetId(video.getPetId());
        resp.setVideoUrl(video.getVideoUrl());
        resp.setThumbnailUrl(video.getThumbnailUrl());
        resp.setDescription(video.getDescription());
        resp.setStatus(video.getStatus());
        resp.setReviewNotes(video.getReviewNotes());
        resp.setNextReminderDate(video.getNextReminderDate() != null ? video.getNextReminderDate().format(formatter) : null);
        resp.setCreatedAt(video.getCreatedAt() != null ? video.getCreatedAt().format(formatter) : null);
        resp.setUpdatedAt(video.getUpdatedAt() != null ? video.getUpdatedAt().format(formatter) : null);
        return resp;
    }
}
