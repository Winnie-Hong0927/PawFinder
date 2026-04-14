package com.pawfinder.pet.mapper;

import com.pawfinder.pet.entity.Pet;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Pet Mapper
 */
@Mapper
public interface PetMapper {

    /**
     * Insert pet
     */
    int insert(Pet pet);

    /**
     * Update pet
     */
    int update(Pet pet);

    /**
     * Delete pet by ID
     */
    int deleteById(@Param("id") Long id);

    /**
     * Select pet by ID
     */
    Pet selectById(@Param("id") Long id);

    /**
     * Select pets by status
     */
    List<Pet> selectByStatus(@Param("status") String status);

    /**
     * Select pets by species
     */
    List<Pet> selectBySpecies(@Param("species") String species);

    /**
     * Select pets by status and species
     */
    List<Pet> selectByStatusAndSpecies(@Param("status") String status, @Param("species") String species);

    /**
     * Search pets
     */
    List<Pet> searchPets(@Param("keyword") String keyword);

    /**
     * Count pets by status
     */
    Long countByStatus(@Param("status") String status);

    /**
     * Count pets by species
     */
    Long countBySpecies(@Param("species") String species);

    /**
     * Count all pets
     */
    Long countAll();

    /**
     * Increment view count
     */
    int incrementViewCount(@Param("id") Long id);

    /**
     * Update pet status
     */
    int updateStatus(@Param("id") Long id, @Param("status") String status);
}
