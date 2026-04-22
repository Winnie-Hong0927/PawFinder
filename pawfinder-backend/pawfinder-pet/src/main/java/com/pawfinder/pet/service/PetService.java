package com.pawfinder.pet.service;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.common.util.IdUtil;
import com.pawfinder.common.util.PageResult;
import com.pawfinder.pet.dto.PetCreateRequest;
import com.pawfinder.pet.dto.PetStatusUpdateRequest;
import com.pawfinder.pet.dto.PetVO;
import com.pawfinder.pet.entity.Pet;
import com.pawfinder.pet.mapper.PetMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class PetService {

    private final PetMapper petMapper;
    private final StringRedisTemplate redisTemplate;

    private static final String APPLICATION_COUNT_PREFIX = "pet:application:count:";

    public PetService(PetMapper petMapper, StringRedisTemplate redisTemplate) {
        this.petMapper = petMapper;
        this.redisTemplate = redisTemplate;
    }

    /**
     * Get pet by ID
     */
    public PetVO getById(String id) {
        Pet pet = petMapper.selectById(id);
        if (pet == null) {
            throw new BusinessException(ErrorCode.PET_NOT_FOUND);
        }
        return toVO(pet);
    }

    /**
     * List pets with pagination and filters
     */
    public PageResult<PetVO> list(
            int page,
            int size,
            String species,
            String gender,
            String sizeParam,
            String status,
            String keyword) {

        Page<Pet> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Pet> queryWrapper = new LambdaQueryWrapper<>();

        if (species != null && !species.isEmpty()) {
            queryWrapper.eq(Pet::getSpecies, species);
        }
        if (gender != null && !gender.isEmpty()) {
            queryWrapper.eq(Pet::getGender, gender);
        }
        if (sizeParam != null && !sizeParam.isEmpty()) {
            queryWrapper.eq(Pet::getSize, sizeParam);
        }
        if (status != null && !status.isEmpty()) {
            queryWrapper.eq(Pet::getStatus, status);
        } else {
            // Default to available pets
            queryWrapper.eq(Pet::getStatus, "available");
        }

        if (keyword != null && !keyword.isEmpty()) {
            queryWrapper.and(w -> w
                    .like(Pet::getName, keyword)
                    .or()
                    .like(Pet::getBreed, keyword)
                    .or()
                    .like(Pet::getDescription, keyword)
            );
        }

        queryWrapper.orderByDesc(Pet::getCreatedAt);

        Page<Pet> result = petMapper.selectPage(pageParam, queryWrapper);

        PageResult<PetVO> pageResult = new PageResult<>();
        pageResult.setTotal(result.getTotal());
        pageResult.setCurrent(result.getCurrent());
        pageResult.setSize(result.getSize());
        pageResult.setPages(result.getPages());
        pageResult.setRecords(result.getRecords().stream().map(this::toVO).toList());
        return pageResult;
    }

    /**
     * List all pets (for search service sync)
     */
    public List<PetVO> listAll() {
        LambdaQueryWrapper<Pet> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Pet::getStatus, "available");
        queryWrapper.orderByDesc(Pet::getCreatedAt);

        List<Pet> pets = petMapper.selectList(queryWrapper);
        return pets.stream().map(this::toVO).toList();
    }

    /**
     * Create new pet
     */
    @Transactional
    public PetVO create(PetCreateRequest request) {
        Pet pet = new Pet();
        pet.setId(IdUtil.snowflakeId());
        pet.setName(request.getName());
        pet.setSpecies(request.getSpecies());
        pet.setBreed(request.getBreed());
        pet.setAge(request.getAge());
        pet.setGender(request.getGender());
        pet.setSize(request.getSize());
        pet.setImages(JSONUtil.toJsonStr(request.getImages()));
        pet.setDescription(request.getDescription());
        pet.setTraits(request.getTraits() != null ? JSONUtil.toJsonStr(request.getTraits()) : null);
        pet.setHealthStatus(request.getHealthStatus() != null ? request.getHealthStatus() : "健康");
        pet.setVaccinationStatus(request.getVaccinationStatus() != null ? request.getVaccinationStatus() : false);
        pet.setSterilizationStatus(request.getSterilizationStatus() != null ? request.getSterilizationStatus() : false);
        pet.setShelterLocation(request.getShelterLocation());
        pet.setAdoptionFee(request.getAdoptionFee() != null ? request.getAdoptionFee() : BigDecimal.ZERO);
        pet.setStatus("available");
        pet.setInstitutionId(request.getInstitutionId());

        petMapper.insert(pet);
        System.out.println("Pet created: " + pet.getId());

        return toVO(pet);
    }

    /**
     * Update pet
     */
    @Transactional
    public PetVO update(String id, PetCreateRequest request) {
        Pet pet = petMapper.selectById(id);
        if (pet == null) {
            throw new BusinessException(ErrorCode.PET_NOT_FOUND);
        }

        if (request.getName() != null) {
            pet.setName(request.getName());
        }
        if (request.getSpecies() != null) {
            pet.setSpecies(request.getSpecies());
        }
        if (request.getBreed() != null) {
            pet.setBreed(request.getBreed());
        }
        if (request.getAge() != null) {
            pet.setAge(request.getAge());
        }
        if (request.getGender() != null) {
            pet.setGender(request.getGender());
        }
        if (request.getSize() != null) {
            pet.setSize(request.getSize());
        }
        if (request.getImages() != null) {
            pet.setImages(JSONUtil.toJsonStr(request.getImages()));
        }
        if (request.getDescription() != null) {
            pet.setDescription(request.getDescription());
        }
        if (request.getTraits() != null) {
            pet.setTraits(JSONUtil.toJsonStr(request.getTraits()));
        }
        if (request.getHealthStatus() != null) {
            pet.setHealthStatus(request.getHealthStatus());
        }
        if (request.getVaccinationStatus() != null) {
            pet.setVaccinationStatus(request.getVaccinationStatus());
        }
        if (request.getSterilizationStatus() != null) {
            pet.setSterilizationStatus(request.getSterilizationStatus());
        }
        if (request.getShelterLocation() != null) {
            pet.setShelterLocation(request.getShelterLocation());
        }
        if (request.getAdoptionFee() != null) {
            pet.setAdoptionFee(request.getAdoptionFee());
        }

        petMapper.updateById(pet);
        System.out.println("Pet updated: " + id);

        return toVO(pet);
    }

    /**
     * Update pet status
     */
    @Transactional
    public void updateStatus(String id, PetStatusUpdateRequest request) {
        Pet pet = petMapper.selectById(id);
        if (pet == null) {
            throw new BusinessException(ErrorCode.PET_NOT_FOUND);
        }

        pet.setStatus(request.getStatus());
        petMapper.updateById(pet);
        System.out.println("Pet " + id + " status updated to: " + request.getStatus());
    }

    /**
     * Delete pet (soft delete)
     */
    @Transactional
    public void delete(String id) {
        Pet pet = petMapper.selectById(id);
        if (pet == null) {
            throw new BusinessException(ErrorCode.PET_NOT_FOUND);
        }

        pet.setDeletedAt(LocalDateTime.now());
        petMapper.updateById(pet);
        System.out.println("Pet deleted: " + id);
    }

    /**
     * Get application count for a pet
     */
    public Long getApplicationCount(String petId) {
        // Try to get from cache first
        String cachedCount = redisTemplate.opsForValue().get(APPLICATION_COUNT_PREFIX + petId);
        if (cachedCount != null) {
            return Long.parseLong(cachedCount);
        }
        return 0L;
    }

    /**
     * Set application count (called by adoption service)
     */
    public void setApplicationCount(String petId, Long count) {
        redisTemplate.opsForValue().set(APPLICATION_COUNT_PREFIX + petId, String.valueOf(count), 30, TimeUnit.MINUTES);
    }

    private PetVO toVO(Pet pet) {
        List<String> imageList = null;
        if (pet.getImages() != null && !pet.getImages().isEmpty()) {
            try {
                imageList = JSONUtil.toList(pet.getImages(), String.class);
            } catch (Exception e) {
                imageList = Collections.singletonList(pet.getImages());
            }
        }

        List<String> traitList = null;
        if (pet.getTraits() != null && !pet.getTraits().isEmpty()) {
            try {
                traitList = JSONUtil.toList(pet.getTraits(), String.class);
            } catch (Exception e) {
                traitList = Collections.singletonList(pet.getTraits());
            }
        }

        // Get application count from cache
        Long applicationCount = getApplicationCount(pet.getId());

        PetVO vo = new PetVO();
        vo.setId(pet.getId());
        vo.setName(pet.getName());
        vo.setSpecies(pet.getSpecies());
        vo.setBreed(pet.getBreed());
        vo.setAge(pet.getAge());
        vo.setGender(pet.getGender());
        vo.setSize(pet.getSize());
        vo.setImages(imageList);
        vo.setDescription(pet.getDescription());
        vo.setTraits(traitList);
        vo.setHealthStatus(pet.getHealthStatus());
        vo.setVaccinationStatus(pet.getVaccinationStatus());
        vo.setSterilizationStatus(pet.getSterilizationStatus());
        vo.setShelterLocation(pet.getShelterLocation());
        vo.setAdoptionFee(pet.getAdoptionFee());
        vo.setStatus(pet.getStatus());
        vo.setInstitutionId(pet.getInstitutionId());
        vo.setCreatedAt(pet.getCreatedAt());
        vo.setApplicationCount(applicationCount);

        return vo;
    }
}
