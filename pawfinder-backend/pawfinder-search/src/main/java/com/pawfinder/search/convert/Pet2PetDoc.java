package com.pawfinder.search.convert;

import com.pawfinder.pet.dto.PetVO;
import com.pawfinder.pet.entity.Pet;
import com.pawfinder.search.entity.PetDocument;
import org.springframework.beans.BeanUtils;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class Pet2PetDoc {
    /**
     * MySQL 实体 Pet → ES 实体 PetDocument
     */
    public static PetDocument toPetDocument(Pet pet) {
        PetDocument doc = new PetDocument();

        // 基础字段一一复制（完全相同的字段）
        doc.setId(pet.getId());
        doc.setName(pet.getName());
        doc.setSpecies(pet.getSpecies());
        doc.setBreed(pet.getBreed());
        doc.setGender(pet.getGender());
        doc.setSize(pet.getSize());
        doc.setStatus(pet.getStatus());
        doc.setDescription(pet.getDescription());
        doc.setInstitutionId(pet.getInstitutionId());
        doc.setShelterLocation(pet.getShelterLocation());
        doc.setAdoptionFee(pet.getAdoptionFee());
        doc.setHealthStatus(pet.getHealthStatus());
        doc.setVaccinationStatus(pet.getVaccinationStatus());
        doc.setImages(convertImages(pet.getImages()));

        return doc;
    }

    /**
     * 图片地址转换工具：逗号分隔字符串 → List
     */
    private static List<String> convertImages(String images) {
        if (images == null || images.isBlank()) {
            return Collections.emptyList();
        }
        // 按逗号切割成数组
        return Arrays.asList(images.split(","));
    }

    public static PetDocument toPetDocument(PetVO petVO) {
        if (petVO == null) {
            return null;
        }

        PetDocument document = new PetDocument();

        // 1. 相同名称字段直接拷贝
        BeanUtils.copyProperties(petVO, document);

        // 2. 枚举类型 → 转字符串（存入 ES 必须是字符串）
        document.setSpecies(petVO.getSpecies() == null ? null : petVO.getSpecies().name());
        document.setGender(petVO.getGender() == null ? null : petVO.getGender().name());
        document.setSize(petVO.getSize() == null ? null : petVO.getSize().name());
        document.setStatus(petVO.getStatus() == null ? null : petVO.getStatus().name());

        // 3. 健康状态：List<枚举> → 逗号拼接字符串（ES 里是 Keyword 单字段）
        if (petVO.getHealthStatus() != null) {
            document.setHealthStatus(
                    petVO.getHealthStatus().stream()
                            .map(Enum::name)
                            .collect(Collectors.joining(","))
            );
        }
        return document;
    }
}
