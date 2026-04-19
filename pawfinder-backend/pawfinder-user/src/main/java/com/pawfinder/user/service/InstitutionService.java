package com.pawfinder.user.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.util.IdUtil;
import com.pawfinder.common.util.PageResult;
import com.pawfinder.user.dto.InstitutionCreateRequest;
import com.pawfinder.user.dto.InstitutionVO;
import com.pawfinder.user.entity.Institution;
import com.pawfinder.user.mapper.InstitutionMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class InstitutionService {

    private final InstitutionMapper institutionMapper;

    /**
     * Get institution by ID
     */
    public InstitutionVO getById(String id) {
        Institution institution = institutionMapper.selectById(id);
        if (institution == null) {
            throw BusinessException.INSTITUTION_NOT_FOUND;
        }
        return toVO(institution);
    }

    /**
     * List all institutions with pagination
     */
    public PageResult<InstitutionVO> list(int page, int size, String keyword) {
        Page<Institution> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Institution> queryWrapper = new LambdaQueryWrapper<>();

        if (keyword != null && !keyword.isEmpty()) {
            queryWrapper.and(w -> w
                    .like(Institution::getName, keyword)
                    .or()
                    .like(Institution::getAddress, keyword)
            );
        }

        queryWrapper.eq(Institution::getStatus, "active");
        queryWrapper.orderByDesc(Institution::getCreatedAt);

        Page<Institution> result = institutionMapper.selectPage(pageParam, queryWrapper);

        return PageResult.of(result.getRecords().stream().map(this::toVO).toList())
                .of(result.getTotal(), result.getCurrent(), result.getSize());
    }

    /**
     * Create new institution
     */
    @Transactional
    public InstitutionVO create(InstitutionCreateRequest request) {
        // Check duplicate name
        Long count = institutionMapper.selectCount(
                new LambdaQueryWrapper<Institution>()
                        .eq(Institution::getName, request.getName())
                        .isNull(Institution::getDeletedAt)
        );

        if (count > 0) {
            throw BusinessException.INSTITUTION_NAME_DUPLICATE;
        }

        Institution institution = new Institution();
        institution.setId(IdUtil.snowflakeId());
        institution.setName(request.getName());
        institution.setType(request.getType() != null ? request.getType() : "shelter");
        institution.setLicenseNumber(request.getLicenseNumber());
        institution.setContactPhone(request.getContactPhone());
        institution.setContactEmail(request.getContactEmail());
        institution.setAddress(request.getAddress());
        institution.setProvince(request.getProvince());
        institution.setCity(request.getCity());
        institution.setDistrict(request.getDistrict());
        institution.setDescription(request.getDescription());
        institution.setLogoUrl(request.getLogoUrl());
        institution.setBusinessHours(request.getBusinessHours());
        institution.setStatus("active");

        institutionMapper.insert(institution);
        log.info("Institution created: {}", institution.getId());

        return toVO(institution);
    }

    /**
     * Update institution
     */
    @Transactional
    public InstitutionVO update(String id, InstitutionCreateRequest request) {
        Institution institution = institutionMapper.selectById(id);
        if (institution == null) {
            throw BusinessException.INSTITUTION_NOT_FOUND;
        }

        if (request.getName() != null) {
            institution.setName(request.getName());
        }
        if (request.getType() != null) {
            institution.setType(request.getType());
        }
        if (request.getLicenseNumber() != null) {
            institution.setLicenseNumber(request.getLicenseNumber());
        }
        if (request.getContactPhone() != null) {
            institution.setContactPhone(request.getContactPhone());
        }
        if (request.getContactEmail() != null) {
            institution.setContactEmail(request.getContactEmail());
        }
        if (request.getAddress() != null) {
            institution.setAddress(request.getAddress());
        }
        if (request.getProvince() != null) {
            institution.setProvince(request.getProvince());
        }
        if (request.getCity() != null) {
            institution.setCity(request.getCity());
        }
        if (request.getDistrict() != null) {
            institution.setDistrict(request.getDistrict());
        }
        if (request.getDescription() != null) {
            institution.setDescription(request.getDescription());
        }
        if (request.getLogoUrl() != null) {
            institution.setLogoUrl(request.getLogoUrl());
        }
        if (request.getBusinessHours() != null) {
            institution.setBusinessHours(request.getBusinessHours());
        }

        institutionMapper.updateById(institution);
        log.info("Institution updated: {}", id);

        return toVO(institution);
    }

    private InstitutionVO toVO(Institution institution) {
        return InstitutionVO.builder()
                .id(institution.getId())
                .name(institution.getName())
                .type(institution.getType())
                .licenseNumber(institution.getLicenseNumber())
                .contactPhone(institution.getContactPhone())
                .contactEmail(institution.getContactEmail())
                .address(institution.getAddress())
                .province(institution.getProvince())
                .city(institution.getCity())
                .district(institution.getDistrict())
                .description(institution.getDescription())
                .logoUrl(institution.getLogoUrl())
                .businessHours(institution.getBusinessHours())
                .status(institution.getStatus())
                .createdAt(institution.getCreatedAt())
                .build();
    }
}
