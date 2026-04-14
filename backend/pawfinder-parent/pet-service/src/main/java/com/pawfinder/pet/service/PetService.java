package com.pawfinder.pet.service;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.TypeReference;
import com.pawfinder.common.enums.PetSpeciesEnum;
import com.pawfinder.common.enums.PetStatusEnum;
import com.pawfinder.common.exception.BusinessException;
import com.pawfinder.pet.dto.req.CreatePetReq;
import com.pawfinder.pet.dto.req.UpdatePetReq;
import com.pawfinder.pet.dto.resp.PetDetailResp;
import com.pawfinder.pet.entity.Pet;
import com.pawfinder.pet.mapper.PetMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

/**
 * Pet Service
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PetService {

    private final PetMapper petMapper;

    /**
     * Create pet
     */
    @Transactional
    public PetDetailResp createPet(CreatePetReq req, Long adminId) {
        Pet pet = new Pet();
        pet.setName(req.getName());
        pet.setSpecies(req.getSpecies());
        pet.setBreed(req.getBreed());
        pet.setAge(req.getAge());
        pet.setGender(req.getGender());
        pet.setSize(req.getSize());
        pet.setImages(JSON.toJSONString(req.getImages()));
        pet.setTraits(JSON.toJSONString(req.getTraits()));
        pet.setHealthStatus(req.getHealthStatus());
        pet.setDescription(req.getDescription());
        pet.setStatus(PetStatusEnum.AVAILABLE.getCode());
        pet.setShelterLocation(req.getShelterLocation());
        pet.setShelterContact(req.getShelterContact());
        pet.setIsVaccinated(req.getIsVaccinated());
        pet.setIsNeutered(req.getIsNeutered());
        pet.setRescueStory(req.getRescueStory());
        pet.setAdoptionFee(req.getAdoptionFee());
        pet.setCreatedAt(LocalDateTime.now());
        pet.setCreatedBy(adminId);

        petMapper.insert(pet);

        return toPetDetailResp(pet);
    }

    /**
     * Update pet
     */
    @Transactional
    public PetDetailResp updatePet(Long petId, UpdatePetReq req, Long adminId) {
        Pet pet = petMapper.selectById(petId);
        if (pet == null) {
            throw new BusinessException(404, "Pet not found");
        }

        if (req.getName() != null) pet.setName(req.getName());
        if (req.getBreed() != null) pet.setBreed(req.getBreed());
        if (req.getAge() != null) pet.setAge(req.getAge());
        if (req.getGender() != null) pet.setGender(req.getGender());
        if (req.getSize() != null) pet.setSize(req.getSize());
        if (req.getImages() != null) pet.setImages(JSON.toJSONString(req.getImages()));
        if (req.getTraits() != null) pet.setTraits(JSON.toJSONString(req.getTraits()));
        if (req.getHealthStatus() != null) pet.setHealthStatus(req.getHealthStatus());
        if (req.getDescription() != null) pet.setDescription(req.getDescription());
        if (req.getStatus() != null) pet.setStatus(req.getStatus());
        if (req.getShelterLocation() != null) pet.setShelterLocation(req.getShelterLocation());
        if (req.getShelterContact() != null) pet.setShelterContact(req.getShelterContact());
        if (req.getIsVaccinated() != null) pet.setIsVaccinated(req.getIsVaccinated());
        if (req.getIsNeutered() != null) pet.setIsNeutered(req.getIsNeutered());
        if (req.getRescueStory() != null) pet.setRescueStory(req.getRescueStory());
        if (req.getAdoptionFee() != null) pet.setAdoptionFee(req.getAdoptionFee());
        pet.setUpdatedAt(LocalDateTime.now());
        pet.setUpdatedBy(adminId);

        petMapper.update(pet);

        return toPetDetailResp(pet);
    }

    /**
     * Get pet by ID
     */
    public PetDetailResp getPetById(Long petId) {
        Pet pet = petMapper.selectById(petId);
        if (pet == null) {
            throw new BusinessException(404, "Pet not found");
        }

        // Increment view count
        petMapper.incrementViewCount(petId);

        return toPetDetailResp(pet);
    }

    /**
     * Get pets by status
     */
    public List<PetDetailResp> getPetsByStatus(String status) {
        List<Pet> pets = petMapper.selectByStatus(status);
        return pets.stream().map(this::toPetDetailResp).toList();
    }

    /**
     * Get pets by species
     */
    public List<PetDetailResp> getPetsBySpecies(String species, String status) {
        List<Pet> pets;
        if (status != null) {
            pets = petMapper.selectByStatusAndSpecies(status, species);
        } else {
            pets = petMapper.selectBySpecies(species);
        }
        return pets.stream().map(this::toPetDetailResp).toList();
    }

    /**
     * Search pets
     */
    public List<PetDetailResp> searchPets(String keyword) {
        List<Pet> pets = petMapper.searchPets(keyword);
        return pets.stream().map(this::toPetDetailResp).toList();
    }

    /**
     * Delete pet
     */
    @Transactional
    public void deletePet(Long petId, Long adminId) {
        Pet pet = petMapper.selectById(petId);
        if (pet == null) {
            throw new BusinessException(404, "Pet not found");
        }
        petMapper.deleteById(petId);
    }

    /**
     * Update pet status
     */
    @Transactional
    public void updatePetStatus(Long petId, String status, Long adminId) {
        Pet pet = petMapper.selectById(petId);
        if (pet == null) {
            throw new BusinessException(404, "Pet not found");
        }
        petMapper.updateStatus(petId, status);
    }

    /**
     * Get pet statistics
     */
    public Object getPetStats() {
        Long totalPets = petMapper.countAll();
        Long availablePets = petMapper.countByStatus(PetStatusEnum.AVAILABLE.getCode());
        Long pendingPets = petMapper.countByStatus(PetStatusEnum.PENDING.getCode());
        Long adoptedPets = petMapper.countByStatus(PetStatusEnum.ADOPTED.getCode());

        return java.util.Map.of(
                "totalPets", totalPets,
                "availablePets", availablePets,
                "pendingPets", pendingPets,
                "adoptedPets", adoptedPets
        );
    }

    /**
     * Convert Pet to PetDetailResp
     */
    private PetDetailResp toPetDetailResp(Pet pet) {
        PetSpeciesEnum speciesEnum = PetSpeciesEnum.fromCode(pet.getSpecies());
        PetStatusEnum statusEnum = PetStatusEnum.fromCode(pet.getStatus());

        return PetDetailResp.builder()
                .id(pet.getId())
                .name(pet.getName())
                .species(pet.getSpecies())
                .speciesDesc(speciesEnum.getDescription())
                .breed(pet.getBreed())
                .age(pet.getAge())
                .gender(pet.getGender())
                .size(pet.getSize())
                .images(parseJsonArray(pet.getImages()))
                .traits(parseJsonArray(pet.getTraits()))
                .healthStatus(pet.getHealthStatus())
                .description(pet.getDescription())
                .status(pet.getStatus())
                .statusDesc(statusEnum.getDescription())
                .shelterLocation(pet.getShelterLocation())
                .shelterContact(pet.getShelterContact())
                .isVaccinated(pet.getIsVaccinated())
                .isNeutered(pet.getIsNeutered())
                .rescueStory(pet.getRescueStory())
                .adoptionFee(pet.getAdoptionFee())
                .viewCount(pet.getViewCount())
                .createdAt(pet.getCreatedAt())
                .build();
    }

    /**
     * Parse JSON array string to List
     */
    private List<String> parseJsonArray(String json) {
        if (json == null || json.isEmpty()) {
            return Collections.emptyList();
        }
        try {
            return JSON.parseObject(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.warn("Failed to parse JSON array: {}", json);
            return Collections.emptyList();
        }
    }
}
