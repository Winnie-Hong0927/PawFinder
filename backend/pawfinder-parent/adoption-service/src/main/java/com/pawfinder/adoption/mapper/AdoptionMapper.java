package com.pawfinder.adoption.mapper;

import com.pawfinder.adoption.entity.AdoptionApplication;
import com.pawfinder.adoption.entity.Adoption;
import com.pawfinder.adoption.entity.PetVideo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AdoptionMapper {
    // AdoptionApplication
    int insertApplication(AdoptionApplication app);
    int updateApplication(AdoptionApplication app);
    AdoptionApplication selectApplicationById(@Param("id") Long id);
    List<AdoptionApplication> selectApplicationsByUserId(@Param("userId") Long userId);
    List<AdoptionApplication> selectApplicationsByStatus(@Param("status") String status);
    List<AdoptionApplication> selectApplicationsByPetId(@Param("petId") Long petId);
    Long countApplicationsByStatus(@Param("status") String status);
    
    // Adoption
    int insertAdoption(Adoption adoption);
    int updateAdoption(Adoption adoption);
    Adoption selectAdoptionById(@Param("id") Long id);
    List<Adoption> selectAdoptionsByUserId(@Param("userId") Long userId);
    Adoption selectActiveAdoptionByPetId(@Param("petId") Long petId);
    
    // PetVideo
    int insertVideo(PetVideo video);
    int updateVideo(PetVideo video);
    PetVideo selectVideoById(@Param("id") Long id);
    List<PetVideo> selectVideosByAdoptionId(@Param("adoptionId") Long adoptionId);
    List<PetVideo> selectVideosByUserId(@Param("userId") Long userId);
    List<PetVideo> selectVideosByStatus(@Param("status") String status);
}
