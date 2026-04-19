package com.pawfinder.pet.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Pet entity
 */
@TableName("pets")
public class Pet {

    @TableId(type = IdType.INPUT)
    private String id;
    private String name;
    private String species;
    private String breed;
    private String age;
    private String gender;
    private String size;
    private String images;
    private String description;
    private String traits;
    private String healthStatus;
    private Boolean vaccinationStatus;
    private Boolean sterilizationStatus;
    private String shelterLocation;
    private BigDecimal adoptionFee;
    private String status;
    private String institutionId;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    public Pet() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getImages() {
        return images;
    }

    public void setImages(String images) {
        this.images = images;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTraits() {
        return traits;
    }

    public void setTraits(String traits) {
        this.traits = traits;
    }

    public String getHealthStatus() {
        return healthStatus;
    }

    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }

    public Boolean getVaccinationStatus() {
        return vaccinationStatus;
    }

    public void setVaccinationStatus(Boolean vaccinationStatus) {
        this.vaccinationStatus = vaccinationStatus;
    }

    public Boolean getSterilizationStatus() {
        return sterilizationStatus;
    }

    public void setSterilizationStatus(Boolean sterilizationStatus) {
        this.sterilizationStatus = sterilizationStatus;
    }

    public String getShelterLocation() {
        return shelterLocation;
    }

    public void setShelterLocation(String shelterLocation) {
        this.shelterLocation = shelterLocation;
    }

    public BigDecimal getAdoptionFee() {
        return adoptionFee;
    }

    public void setAdoptionFee(BigDecimal adoptionFee) {
        this.adoptionFee = adoptionFee;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getInstitutionId() {
        return institutionId;
    }

    public void setInstitutionId(String institutionId) {
        this.institutionId = institutionId;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
}
