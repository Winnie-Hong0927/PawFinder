package com.pawfinder.pet.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Pet view object DTO
 */
public class PetVO {

    private String id;
    private String name;
    private String species;
    private String breed;
    private String age;
    private String gender;
    private String size;
    private List<String> images;
    private String description;
    private List<String> traits;
    private String healthStatus;
    private Boolean vaccinationStatus;
    private Boolean sterilizationStatus;
    private String shelterLocation;
    private BigDecimal adoptionFee;
    private String status;
    private String institutionId;
    private String institutionName;
    private Long applicationCount;
    private LocalDateTime createdAt;

    public PetVO() {
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }

    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getTraits() { return traits; }
    public void setTraits(List<String> traits) { this.traits = traits; }

    public String getHealthStatus() { return healthStatus; }
    public void setHealthStatus(String healthStatus) { this.healthStatus = healthStatus; }

    public Boolean getVaccinationStatus() { return vaccinationStatus; }
    public void setVaccinationStatus(Boolean vaccinationStatus) { this.vaccinationStatus = vaccinationStatus; }

    public Boolean getSterilizationStatus() { return sterilizationStatus; }
    public void setSterilizationStatus(Boolean sterilizationStatus) { this.sterilizationStatus = sterilizationStatus; }

    public String getShelterLocation() { return shelterLocation; }
    public void setShelterLocation(String shelterLocation) { this.shelterLocation = shelterLocation; }

    public BigDecimal getAdoptionFee() { return adoptionFee; }
    public void setAdoptionFee(BigDecimal adoptionFee) { this.adoptionFee = adoptionFee; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getInstitutionId() { return institutionId; }
    public void setInstitutionId(String institutionId) { this.institutionId = institutionId; }

    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }

    public Long getApplicationCount() { return applicationCount; }
    public void setApplicationCount(Long applicationCount) { this.applicationCount = applicationCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
