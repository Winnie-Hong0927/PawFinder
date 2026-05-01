package com.pawfinder.pet.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.common.result.Result;
import com.pawfinder.common.util.IdUtil;
import com.pawfinder.common.util.PageResult;
import com.pawfinder.pet.constants.*;
import com.pawfinder.pet.dto.PetCreateRequest;
import com.pawfinder.pet.dto.PetStatusUpdateRequest;
import com.pawfinder.pet.dto.PetVO;
import com.pawfinder.pet.entity.Pet;
import com.pawfinder.pet.mapper.PetMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
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
    public Result<PetVO> getById(String id) {
        Pet pet = petMapper.selectById(id);
        if (pet == null) {
            return Result.fail(ErrorCode.PET_NOT_FOUND, ErrorCode.PET_NOT_FOUND.getMessage());
        }
        if (Objects.equals(pet.getStatus(), PetStatusEnum.DELETED.getValue())) {
            return null;
        }
        return Result.success(toVO(pet));
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
            queryWrapper.eq(Pet::getSpecies, PetSpeciesEnum.fromValue(species).getValue());
        }
        if (gender != null && !gender.isEmpty()) {
            queryWrapper.eq(Pet::getGender, GenderEnum.fromValue(gender).getValue());
        }
        if (sizeParam != null && !sizeParam.isEmpty()) {
            queryWrapper.eq(Pet::getSize, SizeEnum.fromValue(sizeParam).getValue());
        }
        if (status != null && !status.isEmpty()) {
            queryWrapper.eq(Pet::getStatus, PetStatusEnum.fromValue(status).getValue());
        } else {
            queryWrapper.eq(Pet::getStatus, PetStatusEnum.AVAILABLE.getValue());
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
        queryWrapper.eq(Pet::getStatus, PetStatusEnum.AVAILABLE);
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
        StringBuilder imagesBuilder = new StringBuilder();
        request.getImages().forEach(image -> imagesBuilder.append(image).append("\n"));
        pet.setImages(imagesBuilder.toString());

        StringBuilder traitsBuilder = new StringBuilder();
        request.getTraits().forEach(trait -> traitsBuilder.append(trait).append("\n"));
        pet.setTraits(traitsBuilder.toString());

        StringBuilder healthStatusBuilder = new StringBuilder();
        request.getHealthStatus().forEach(status -> healthStatusBuilder.append(status.getValue()).append("\n"));
        pet.setHealthStatus(healthStatusBuilder.toString());

        pet.setId(IdUtil.snowflakeId());
        pet.setName(request.getName());
        pet.setSpecies(request.getSpecies().getValue());
        pet.setBreed(request.getBreed());
        pet.setAge(request.getAge());
        pet.setGender(request.getGender().getValue());
        pet.setSize(request.getSize().getValue());
        pet.setDescription(request.getDescription());
        pet.setVaccinationStatus(request.getVaccinationStatus() != null ? request.getVaccinationStatus() : false);
        pet.setSterilizationStatus(request.getSterilizationStatus() != null ? request.getSterilizationStatus() : false);
        pet.setShelterLocation(request.getShelterLocation());
        pet.setAdoptionFee(request.getAdoptionFee() != null ? request.getAdoptionFee() : BigDecimal.ZERO);
        pet.setStatus(PetStatusEnum.AVAILABLE.getValue());
        pet.setInstitutionId(request.getInstitutionId());
        pet.setCreatedBy(request.getCreatedBy());
        pet.setCreatedAt(LocalDateTime.now());
        pet.setUpdatedAt(LocalDateTime.now());

        petMapper.insert(pet);
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
            pet.setSpecies(request.getSpecies().getValue());
        }
        if (request.getBreed() != null) {
            pet.setBreed(request.getBreed());
        }
        if (request.getAge() != null) {
            pet.setAge(request.getAge());
        }
        if (request.getGender() != null) {
            pet.setGender(request.getGender().getValue());
        }
        if (request.getSize() != null) {
            pet.setSize(request.getSize().getValue());
        }
        if (request.getImages() != null) {
            StringBuilder imagesBuilder = new StringBuilder();
            request.getImages().forEach(image -> imagesBuilder.append(image).append("\n"));
            pet.setImages(imagesBuilder.toString());
        }
        if (request.getDescription() != null) {
            pet.setDescription(request.getDescription());
        }
        if (request.getTraits() != null) {
            StringBuilder traitsBuilder = new StringBuilder();
            request.getTraits().forEach(trait -> traitsBuilder.append(trait).append("\n"));
            pet.setTraits(traitsBuilder.toString());
        }
        if (request.getHealthStatus() != null) {
            StringBuilder healthStatusBuilder = new StringBuilder();
            request.getHealthStatus().forEach(status -> healthStatusBuilder.append(status).append("\n"));
            pet.setHealthStatus(healthStatusBuilder.toString());
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

        pet.setStatus(request.getStatus().toLowerCase());
        pet.setUpdatedAt(LocalDateTime.now());
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

        pet.setStatus(PetStatusEnum.DELETED.getValue());
        petMapper.updateById(pet);
        System.out.println("Pet deleted: " + id);
    }

    /**
     * Get application count for a pet
     */
    public Result<Long> getApplicationCount(String petId) {
        Pet pet = petMapper.selectById(petId);
        if (pet == null) {
            return Result.fail(ErrorCode.PET_NOT_FOUND, ErrorCode.PET_NOT_FOUND.getMessage());
        }
        return Result.success(pet.getApplicationCount());
    }


    public Result<Void> updateApplicationCount(String id, Integer count) {
        Pet pet = petMapper.selectById(id);
        if (pet == null) {
            return Result.fail(ErrorCode.PET_NOT_FOUND, ErrorCode.PET_NOT_FOUND.getMessage());
        }
        pet.setApplicationCount(pet.getApplicationCount() + count);
        petMapper.updateById(pet);
        return Result.success();
    }

    private PetVO toVO(Pet pet) {
        List<String> imagesList = new ArrayList<>();
        String images = pet.getImages();
        if (images != null) {
            String[] split = StringUtils.split(images, "\n");
            if (split != null) {
                imagesList.addAll(Arrays.asList(split));
            }
        }

        List<String> traitsList = new  ArrayList<>();
        String traits = pet.getTraits();
        if (traits != null) {
            String[] split = StringUtils.split(traits, "\n");
            if (split != null) {
                traitsList.addAll(Arrays.asList(split));
            }
        }

        List<HealthStatusEnum> healthStatusList = new ArrayList<>();
        String healthStatus = pet.getHealthStatus();
        if (healthStatus != null) {
            String[] split = StringUtils.split(healthStatus, "\n");
            if (split != null) {
                for (String s : split) {
                    if (!s.isEmpty()) {
                        healthStatusList.add(HealthStatusEnum.fromValue(s));
                    }
                }
            }
        }

        PetVO vo = new PetVO();
        vo.setId(pet.getId());
        vo.setName(pet.getName());
        vo.setSpecies(PetSpeciesEnum.fromValue(pet.getSpecies()));
        vo.setBreed(pet.getBreed());
        vo.setAge(pet.getAge());
        vo.setGender(GenderEnum.fromValue(pet.getGender()));
        vo.setSize(SizeEnum.fromValue(pet.getSize()));
        vo.setImages(imagesList);
        vo.setDescription(pet.getDescription());
        vo.setTraits(traitsList);
        vo.setHealthStatus(healthStatusList);
        vo.setVaccinationStatus(pet.getVaccinationStatus());
        vo.setSterilizationStatus(pet.getSterilizationStatus());
        vo.setShelterLocation(pet.getShelterLocation());
        vo.setAdoptionFee(pet.getAdoptionFee());
        vo.setStatus(PetStatusEnum.fromValue(pet.getStatus()));
        vo.setInstitutionId(pet.getInstitutionId());
        vo.setCreatedAt(pet.getCreatedAt());
        vo.setApplicationCount(pet.getApplicationCount());
        return vo;
    }
}
