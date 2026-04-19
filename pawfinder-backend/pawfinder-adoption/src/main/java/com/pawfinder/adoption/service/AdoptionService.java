package com.pawfinder.adoption.service;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.pawfinder.adoption.dto.ApplicationCreateRequest;
import com.pawfinder.adoption.dto.ApplicationReviewRequest;
import com.pawfinder.adoption.dto.ApplicationVO;
import com.pawfinder.adoption.entity.AdoptionApplication;
import com.pawfinder.adoption.entity.AdoptionRecord;
import com.pawfinder.adoption.mapper.AdoptionApplicationMapper;
import com.pawfinder.adoption.mapper.AdoptionRecordMapper;
import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.util.IdUtil;
import com.pawfinder.common.util.PageResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdoptionService {

    private final AdoptionApplicationMapper applicationMapper;
    private final AdoptionRecordMapper recordMapper;
    private final StringRedisTemplate redisTemplate;

    // Mock data for user and pet info (in production, use OpenFeign to call other services)
    // For simplicity, we store pet name and image in application for quick retrieval
    private String mockPetName = "未知宠物";
    private String mockPetImage = "";
    private String mockUserName = "未知申请人";
    private String mockUserPhone = "";

    /**
     * Get application by ID
     */
    public ApplicationVO getById(String id) {
        AdoptionApplication application = applicationMapper.selectById(id);
        if (application == null) {
            throw BusinessException.APPLICATION_NOT_FOUND;
        }
        return toVO(application);
    }

    /**
     * Get application count for a pet
     */
    public Long getApplicationCountByPetId(String petId) {
        Long count = applicationMapper.selectCount(
                new LambdaQueryWrapper<AdoptionApplication>()
                        .eq(AdoptionApplication::getPetId, petId)
                        .eq(AdoptionApplication::getStatus, "pending")
        );
        return count;
    }

    /**
     * List applications by user
     */
    public PageResult<ApplicationVO> listByUser(String userId, int page, int size, String status) {
        Page<AdoptionApplication> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<AdoptionApplication> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(AdoptionApplication::getUserId, userId);

        if (status != null && !status.isEmpty()) {
            queryWrapper.eq(AdoptionApplication::getStatus, status);
        }

        queryWrapper.orderByDesc(AdoptionApplication::getCreatedAt);

        Page<AdoptionApplication> result = applicationMapper.selectPage(pageParam, queryWrapper);

        return PageResult.of(result.getRecords().stream().map(this::toVO).toList())
                .of(result.getTotal(), result.getCurrent(), result.getSize());
    }

    /**
     * List all applications (for admin)
     */
    public PageResult<ApplicationVO> listAll(int page, int size, String status, String petId, String userId) {
        Page<AdoptionApplication> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<AdoptionApplication> queryWrapper = new LambdaQueryWrapper<>();

        if (status != null && !status.isEmpty()) {
            queryWrapper.eq(AdoptionApplication::getStatus, status);
        }
        if (petId != null && !petId.isEmpty()) {
            queryWrapper.eq(AdoptionApplication::getPetId, petId);
        }
        if (userId != null && !userId.isEmpty()) {
            queryWrapper.eq(AdoptionApplication::getUserId, userId);
        }

        queryWrapper.orderByDesc(AdoptionApplication::getCreatedAt);

        Page<AdoptionApplication> result = applicationMapper.selectPage(pageParam, queryWrapper);

        return PageResult.of(result.getRecords().stream().map(this::toVO).toList())
                .of(result.getTotal(), result.getCurrent(), result.getSize());
    }

    /**
     * Create new application
     */
    @Transactional
    public ApplicationVO create(String userId, ApplicationCreateRequest request) {
        // Check if user has already applied for this pet
        Long existingCount = applicationMapper.selectCount(
                new LambdaQueryWrapper<AdoptionApplication>()
                        .eq(AdoptionApplication::getPetId, request.getPetId())
                        .eq(AdoptionApplication::getUserId, userId)
                        .ne(AdoptionApplication::getStatus, "canceled")
        );

        if (existingCount > 0) {
            throw BusinessException.APPLICATION_ALREADY_EXISTS;
        }

        AdoptionApplication application = new AdoptionApplication();
        application.setId(IdUtil.snowflakeId());
        application.setPetId(request.getPetId());
        application.setUserId(userId);
        application.setReason(request.getReason());
        application.setLivingCondition(request.getLivingCondition());
        application.setExperience(request.getExperience());
        application.setHasOtherPets(request.getHasOtherPets());
        application.setOtherPetsDetail(request.getOtherPetsDetail());
        application.setDocuments(request.getDocuments() != null ? JSONUtil.toJsonStr(request.getDocuments()) : null);
        application.setLivingConditionImages(request.getLivingConditionImages() != null
                ? JSONUtil.toJsonStr(request.getLivingConditionImages()) : null);
        application.setStatus("pending");

        applicationMapper.insert(application);
        log.info("Adoption application created: {} by user {}", application.getId(), userId);

        return toVO(application);
    }

    /**
     * Review application (approve/reject)
     */
    @Transactional
    public ApplicationVO review(String applicationId, String adminId, ApplicationReviewRequest request) {
        AdoptionApplication application = applicationMapper.selectById(applicationId);
        if (application == null) {
            throw BusinessException.APPLICATION_NOT_FOUND;
        }

        if (!"pending".equals(application.getStatus())) {
            throw BusinessException.APPLICATION_NOT_PENDING;
        }

        // Update application status
        application.setStatus(request.getStatus());
        application.setReviewedBy(adminId);
        application.setReviewedAt(LocalDateTime.now());
        if (request.getAdminNotes() != null) {
            application.setAdminNotes(request.getAdminNotes());
        }

        applicationMapper.updateById(application);
        log.info("Application {} reviewed by {}: {}", applicationId, adminId, request.getStatus());

        // If approved, create adoption record
        if ("approved".equals(request.getStatus())) {
            createAdoptionRecord(application);
        }

        return toVO(application);
    }

    /**
     * Cancel application
     */
    @Transactional
    public void cancel(String applicationId, String userId) {
        AdoptionApplication application = applicationMapper.selectById(applicationId);
        if (application == null) {
            throw BusinessException.APPLICATION_NOT_FOUND;
        }

        if (!userId.equals(application.getUserId())) {
            throw BusinessException.FORBIDDEN;
        }

        if (!"pending".equals(application.getStatus())) {
            throw BusinessException.APPLICATION_STATUS_ERROR;
        }

        application.setStatus("canceled");
        applicationMapper.updateById(application);
        log.info("Application {} canceled by user {}", applicationId, userId);
    }

    private void createAdoptionRecord(AdoptionApplication application) {
        AdoptionRecord record = new AdoptionRecord();
        record.setId(IdUtil.snowflakeId());
        record.setApplicationId(application.getId());
        record.setPetId(application.getPetId());
        record.setUserId(application.getUserId());
        record.setAdoptionDate(LocalDateTime.now());

        recordMapper.insert(record);
        log.info("Adoption record created for application: {}", application.getId());
    }

    private ApplicationVO toVO(AdoptionApplication application) {
        List<String> documentList = null;
        if (application.getDocuments() != null && !application.getDocuments().isEmpty()) {
            try {
                documentList = JSONUtil.toList(application.getDocuments(), String.class);
            } catch (Exception e) {
                documentList = Collections.singletonList(application.getDocuments());
            }
        }

        List<String> imageList = null;
        if (application.getLivingConditionImages() != null && !application.getLivingConditionImages().isEmpty()) {
            try {
                imageList = JSONUtil.toList(application.getLivingConditionImages(), String.class);
            } catch (Exception e) {
                imageList = Collections.singletonList(application.getLivingConditionImages());
            }
        }

        return ApplicationVO.builder()
                .id(application.getId())
                .petId(application.getPetId())
                .petName(mockPetName)
                .petImage(mockPetImage)
                .userId(application.getUserId())
                .userName(mockUserName)
                .userPhone(mockUserPhone)
                .reason(application.getReason())
                .livingCondition(application.getLivingCondition())
                .experience(application.getExperience())
                .hasOtherPets(application.getHasOtherPets())
                .otherPetsDetail(application.getOtherPetsDetail())
                .documents(documentList)
                .livingConditionImages(imageList)
                .status(application.getStatus())
                .adminNotes(application.getAdminNotes())
                .reviewedBy(application.getReviewedBy())
                .reviewedAt(application.getReviewedAt())
                .createdAt(application.getCreatedAt())
                .build();
    }
}
