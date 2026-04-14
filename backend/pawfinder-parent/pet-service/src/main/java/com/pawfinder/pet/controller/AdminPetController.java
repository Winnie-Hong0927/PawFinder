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
 * Admin Pet Controller
 */
@RestController
@RequestMapping("/admin/pets")
@RequiredArgsConstructor
public class AdminPetController {

    private final PetService petService;

    /**
     * Create pet (admin only)
     */
    @PostMapping
    public ApiResponse<PetDetailResp> createPet(
            @Valid @RequestBody CreatePetReq req,
            @RequestHeader("X-User-Id") Long adminId) {
        PetDetailResp pet = petService.createPet(req, adminId);
        return ApiResponse.success("Pet created successfully", pet);
    }

    /**
     * Update pet (admin only)
     */
    @PutMapping("/{petId}")
    public ApiResponse<PetDetailResp> updatePet(
            @PathVariable Long petId,
            @RequestBody UpdatePetReq req,
            @RequestHeader("X-User-Id") Long adminId) {
        PetDetailResp pet = petService.updatePet(petId, req, adminId);
        return ApiResponse.success("Pet updated successfully", pet);
    }

    /**
     * Delete pet (admin only)
     */
    @DeleteMapping("/{petId}")
    public ApiResponse<?> deletePet(
            @PathVariable Long petId,
            @RequestHeader("X-User-Id") Long adminId) {
        petService.deletePet(petId, adminId);
        return ApiResponse.success("Pet deleted successfully");
    }

    /**
     * Update pet status (admin only)
     */
    @PutMapping("/{petId}/status")
    public ApiResponse<?> updatePetStatus(
            @PathVariable Long petId,
            @RequestBody java.util.Map<String, String> body,
            @RequestHeader("X-User-Id") Long adminId) {
        
        String status = body.get("status");
        if (status == null || status.isEmpty()) {
            return ApiResponse.badRequest("Status is required");
        }
        
        petService.updatePetStatus(petId, status, adminId);
        return ApiResponse.success("Pet status updated successfully");
    }

    /**
     * Get all pets (admin only)
     */
    @GetMapping
    public ApiResponse<List<PetDetailResp>> getAllPets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String species) {
        
        List<PetDetailResp> pets;
        if (species != null && !species.isEmpty()) {
            pets = petService.getPetsBySpecies(species, status);
        } else if (status != null && !status.isEmpty()) {
            pets = petService.getPetsByStatus(status);
        } else {
            pets = petService.getPetsByStatus(null);
        }
        return ApiResponse.success(pets);
    }

    /**
     * Get pet statistics (admin only)
     */
    @GetMapping("/stats")
    public ApiResponse<?> getPetStats() {
        return ApiResponse.success(petService.getPetStats());
    }
}
