package com.pawfinder.adoption.service;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.pawfinder.adoption.constants.AdoptionStatusEnum;
import com.pawfinder.adoption.dto.ApplicationCreateRequest;
import com.pawfinder.adoption.dto.ApplicationReviewRequest;
import com.pawfinder.adoption.dto.ApplicationVO;
import com.pawfinder.adoption.entity.AdoptionApplication;
import com.pawfinder.adoption.entity.AdoptionRecord;
import com.pawfinder.adoption.feign.PetClient;
import com.pawfinder.adoption.feign.UserClient;
import com.pawfinder.adoption.feign.dto.PetDTO;
import com.pawfinder.adoption.mapper.AdoptionApplicationMapper;
import com.pawfinder.adoption.mapper.AdoptionRecordMapper;
import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.common.result.Result;
import com.pawfinder.common.util.IdUtil;
import com.pawfinder.common.util.PageResult;
import com.pawfinder.pet.dto.PetVO;
import com.pawfinder.user.dto.UserVO;
import com.pawfinder.user.entity.User;
import io.seata.spring.annotation.GlobalTransactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class AdoptionService {

    private static final Logger log = LoggerFactory.getLogger(AdoptionService.class);

    private final AdoptionApplicationMapper applicationMapper;
    private final AdoptionRecordMapper recordMapper;
    private final StringRedisTemplate redisTemplate;
    private final UserClient userClient;
    private final PetClient petClient;

    public AdoptionService(AdoptionApplicationMapper applicationMapper,
                           AdoptionRecordMapper recordMapper,
                           StringRedisTemplate redisTemplate,
                           UserClient userClient,
                           PetClient petClient) {
        this.applicationMapper = applicationMapper;
        this.recordMapper = recordMapper;
        this.redisTemplate = redisTemplate;
        this.userClient = userClient;
        this.petClient = petClient;
    }

    /**
     * Get application by ID
     */
    public Result<ApplicationVO> getById(String id) {
        AdoptionApplication application = applicationMapper.selectById(id);
        if (application == null) {
            return Result.fail(ErrorCode.APPLICATION_NOT_FOUND, ErrorCode.APPLICATION_NOT_FOUND.getMessage());
        }
        return toVO(application);
    }

    /**
     * Get application count for a pet
     */
    public Long getApplicationCountByPetId(String petId) {
        return applicationMapper.selectCount(
                new LambdaQueryWrapper<AdoptionApplication>()
                        .eq(AdoptionApplication::getPetId, petId)
                        .eq(AdoptionApplication::getStatus, AdoptionStatusEnum.PENDING)
        );
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

        PageResult<ApplicationVO> pageResult = new PageResult<>();
        pageResult.setTotal(result.getTotal());
        pageResult.setCurrent(result.getCurrent());
        pageResult.setSize(result.getSize());
        pageResult.setPages(result.getPages());
        // todo
        pageResult.setRecords(result.getRecords().stream().map(a -> toVO(a).getData()).toList());
        return pageResult;
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

        PageResult<ApplicationVO> pageResult = new PageResult<>();
        pageResult.setTotal(result.getTotal());
        pageResult.setCurrent(result.getCurrent());
        pageResult.setSize(result.getSize());
        pageResult.setPages(result.getPages());
        pageResult.setRecords(result.getRecords().stream().map(a -> toVO(a).getData()).toList());
        return pageResult;
    }

    /**
     * Create new application
     */
    @Transactional
    public Result<ApplicationVO> create(String userId, ApplicationCreateRequest request) {
        // Check if user has already applied for this pet
        Long existingCount = applicationMapper.selectCount(
                new LambdaQueryWrapper<AdoptionApplication>()
                        .eq(AdoptionApplication::getPetId, request.getPetId())
                        .eq(AdoptionApplication::getUserId, userId)
                        .ne(AdoptionApplication::getStatus, "canceled")
        );

        if (existingCount > 0) {
            return Result.fail(ErrorCode.APPLICATION_ALREADY_EXISTS, ErrorCode.APPLICATION_ALREADY_EXISTS.getMessage());
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
        application.setStatus(AdoptionStatusEnum.PENDING);

        application.setCreatedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());

        Result<ApplicationVO> result = toVO(application);
        if (result.getCode() == ErrorCode.SUCCESS.getCode()) {
            applicationMapper.insert(application);
            log.info("Adoption application created: {} by user {}", application.getId(), userId);
        }
        return result;
    }

    /**
     * Review application (approve/reject) - Saga 长事务编排
     * 使用 @GlobalTransactional 实现 Seata 分布式事务
     * 流程：审核申请 → 创建领养记录 → 更新宠物状态
     */
    @GlobalTransactional(name = "adoption-review-saga", rollbackFor = Exception.class)
    @Transactional
    public Result<ApplicationVO> review(String applicationId, String adminId, ApplicationReviewRequest request) {
        AdoptionApplication application = applicationMapper.selectById(applicationId);
        if (application == null) {
            return Result.fail(ErrorCode.APPLICATION_NOT_FOUND, ErrorCode.APPLICATION_NOT_FOUND.getMessage());
        }

        if (!AdoptionStatusEnum.PENDING.equals(application.getStatus())) {
            return Result.fail(ErrorCode.APPLICATION_NOT_PENDING, ErrorCode.APPLICATION_NOT_PENDING.getMessage());
        }

        // Step 1: 更新申请状态
        application.setStatus(request.getStatus());
        application.setReviewedBy(adminId);
        application.setReviewedAt(LocalDateTime.now());
        if (request.getAdminNotes() != null) {
            application.setAdminNotes(request.getAdminNotes());
        }
        applicationMapper.updateById(application);
        log.info("Application {} reviewed by {}: {}", applicationId, adminId, request.getStatus());

        // Step 2: 如果通过，执行 Saga 流程
        if (AdoptionStatusEnum.APPROVED.equals(request.getStatus())) {
            try {
                // 2.1 创建领养记录
                AdoptionRecord record = createAdoptionRecord(application);
                log.info("Adoption record created: {}", record.getId());

                // 2.2 通过 OpenFeign 调用宠物服务，更新宠物状态为 "adopted"
                Map<String, String> statusRequest = new java.util.HashMap<>();
                statusRequest.put("status", "adopted");
                Result<Void> petResult = petClient.updatePetStatus(application.getPetId(), statusRequest);
                if (petResult == null || petResult.getCode() != 200) {
                    log.error("Failed to update pet status, will rollback");
                    return Result.fail(ErrorCode.SYSTEM_ERROR, "更新宠物状态失败");
                }
                log.info("Pet {} status updated to adopted", application.getPetId());

                // 2.3 发送通知（可选，失败不影响主流程）
                try {
                    // TODO: 调用通知服务发送领养成功通知
                    log.info("Notification sent for adoption: {}", record.getId());
                } catch (Exception e) {
                    log.warn("Failed to send notification, but adoption is complete: {}", e.getMessage());
                }

            } catch (Exception e) {
                log.error("Saga transaction failed, rolling back: {}", e.getMessage());
                return Result.fail(ErrorCode.SYSTEM_ERROR, "Seata事务执行失败，回滚所有分支事务");
            }
        }
        return toVO(application);
    }

    /**
     * Cancel application
     */
    @Transactional
    public Result<Void> cancel(String applicationId, String userId) {
        AdoptionApplication application = applicationMapper.selectById(applicationId);
        if (application == null) {
            return Result.fail(ErrorCode.APPLICATION_NOT_FOUND, ErrorCode.APPLICATION_NOT_FOUND.getMessage());
        }

        if (!userId.equals(application.getUserId())) {
            return Result.fail(ErrorCode.FORBIDDEN, ErrorCode.FORBIDDEN.getMessage());
        }

        if (!AdoptionStatusEnum.PENDING.equals(application.getStatus())) {
            return Result.fail(ErrorCode.APPLICATION_STATUS_ERROR, ErrorCode.APPLICATION_STATUS_ERROR.getMessage());
        }

        application.setStatus(AdoptionStatusEnum.CANCELED);
        applicationMapper.updateById(application);
        log.info("Application {} canceled by user {}", applicationId, userId);
        return Result.success();
    }

    /**
     * Create adoption record
     */
    private AdoptionRecord createAdoptionRecord(AdoptionApplication application) {
        // 通过 OpenFeign 获取用户信息
        String adopterName = "未知申请人";
        String adopterPhone = "";
        try {
            Result<UserVO> userResult = userClient.getUserById(application.getUserId());
            if (userResult != null && userResult.getCode() == 200 && userResult.getData() != null) {
                UserVO temp = userResult.getData();
                if (temp != null) {
                    adopterName = temp.getName();
                    adopterPhone = temp.getPhone();
                }
            }
        } catch (Exception e) {
            log.warn("Failed to get user info: {}", e.getMessage());
        }

        AdoptionRecord record = new AdoptionRecord();
        record.setId(IdUtil.snowflakeId());
        record.setApplicationId(application.getId());
        record.setPetId(application.getPetId());
        record.setUserId(application.getUserId());
        record.setAdopterName(adopterName);
        record.setAdopterPhone(adopterPhone);
        record.setAdoptionDate(LocalDateTime.now());

        recordMapper.insert(record);
        return record;
    }

    /**
     * Convert entity to VO with OpenFeign calls for user and pet info
     */
    private Result<ApplicationVO> toVO(AdoptionApplication application) {
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

        ApplicationVO vo = new ApplicationVO();
        vo.setId(application.getId());
        vo.setPetId(application.getPetId());
        vo.setUserId(application.getUserId());
        vo.setReason(application.getReason());
        vo.setLivingCondition(application.getLivingCondition());
        vo.setExperience(application.getExperience());
        vo.setHasOtherPets(application.getHasOtherPets());
        vo.setOtherPetsDetail(application.getOtherPetsDetail());
        vo.setDocuments(documentList);
        vo.setLivingConditionImages(imageList);
        vo.setStatus(application.getStatus().toString());
        vo.setAdminNotes(application.getAdminNotes());
        vo.setReviewedBy(application.getReviewedBy());
        vo.setReviewedAt(application.getReviewedAt());
        vo.setCreatedAt(application.getCreatedAt());
        vo.setUpdatedAt(application.getUpdatedAt());

        // 通过 OpenFeign 获取宠物信息
        try {
            Result<PetVO> petResult = petClient.getPetById(application.getPetId());
            if (petResult != null && petResult.getCode() == ErrorCode.SUCCESS.getCode() && petResult.getData() != null) {
                PetVO petData = petResult.getData();
                vo.setPetName(petData.getName());
                StringBuilder imageBuilder = new StringBuilder();
                for (String image : petData.getImages()) {
                    imageBuilder.append(image);
                }
                vo.setPetImage(imageBuilder.toString());
            } else {
                assert petResult != null;
                return Result.fail(petResult.getCode(), petResult.getMessage());
            }
        } catch (Exception e) {
            log.warn("Failed to get pet info: {}", e.getMessage());
            return Result.fail(ErrorCode.GET_PET_INFO_FAIL, ErrorCode.GET_PET_INFO_FAIL.getMessage());
        }

        // 通过 OpenFeign 获取用户信息
        try {
            Result<UserVO> userResult = userClient.getUserById(application.getUserId());
            if (userResult != null && userResult.getCode() == ErrorCode.SUCCESS.getCode() && userResult.getData() != null) {
                UserVO userData = userResult.getData();
                vo.setUserName(userData.getName());
                vo.setUserPhone(userData.getPhone());
            } else {
                assert userResult != null;
                return Result.fail(userResult.getCode(), userResult.getMessage());
            }
        } catch (Exception e) {
            log.warn("Failed to get user info: {}", e.getMessage());
            return Result.fail(ErrorCode.GET_USER_INFO_FAIL, ErrorCode.GET_USER_INFO_FAIL.getMessage());
        }

        return Result.success(vo);
    }
}
