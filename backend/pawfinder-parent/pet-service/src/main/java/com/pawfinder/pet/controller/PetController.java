package com.pawfinder.pet.controller;

import com.pawfinder.common.dto.resp.ApiResponse;
import com.pawfinder.pet.dto.req.CreatePetReq;
import com.pawfinder.pet.dto.req.UpdatePetReq;
import com.pawfinder.pet.dto.resp.PetDetailResp;
import com.pawfinder.pet.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Pet Controller
 */
@RestController
@RequestMapping("/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    /**
     * Get available pets (public)
     */
    @GetMapping
    public ApiResponse<List<PetDetailResp>> getPets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String keyword) {

        List<PetDetailResp> pets;

        if (keyword != null && !keyword.isEmpty()) {
            pets = petService.searchPets(keyword);
        } else if (species != null && !species.isEmpty()) {
            pets = petService.getPetsBySpecies(species, status);
        } else if (status != null && !status.isEmpty()) {
            pets = petService.getPetsByStatus(status);
        } else {
            pets = petService.getPetsByStatus("available");
        }

        return ApiResponse.success(pets);
    }

    /**
     * Get pet by ID (public)
     */
    @GetMapping("/{petId}")
    public ApiResponse<PetDetailResp> getPetById(@PathVariable Long petId) {
        PetDetailResp pet = petService.getPetById(petId);
        return ApiResponse.success(pet);
    }

    /**
     * Search pets
     */
    @GetMapping("/search")
    public ApiResponse<List<PetDetailResp>> searchPets(@RequestParam String keyword) {
        List<PetDetailResp> pets = petService.searchPets(keyword);
        return ApiResponse.success(pets);
    }
}
