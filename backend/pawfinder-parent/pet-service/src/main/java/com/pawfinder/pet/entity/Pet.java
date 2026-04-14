package com.pawfinder.pet.entity;

import com.pawfinder.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * Pet Entity
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Pet extends BaseEntity {

    /**
     * Pet name
     */
    private String name;

    /**
     * Species: dog, cat, rabbit, bird, hamster, other
     */
    private String species;

    /**
     * Breed
     */
    private String breed;

    /**
     * Age description
     */
    private String age;

    /**
     * Gender: male, female, unknown
     */
    private String gender;

    /**
     * Size: small, medium, large
     */
    private String size;

    /**
     * Pet images (JSON array)
     */
    private String images;

    /**
     * Pet traits (JSON array)
     */
    private String traits;

    /**
     * Health status
     */
    private String healthStatus;

    /**
     * Description
     */
    private String description;

    /**
     * Status: available, pending, adopted, unavailable
     */
    private String status;

    /**
     * Shelter location
     */
    private String shelterLocation;

    /**
     * Shelter contact
     */
    private String shelterContact;

    /**
     * Is vaccinated
     */
    private Boolean isVaccinated;

    /**
     * Is neutered
     */
    private Boolean isNeutered;

    /**
     * Rescue story
     */
    private String rescueStory;

    /**
     * Adoption fee
     */
    private Integer adoptionFee;

    /**
     * View count
     */
    private Integer viewCount;
}
