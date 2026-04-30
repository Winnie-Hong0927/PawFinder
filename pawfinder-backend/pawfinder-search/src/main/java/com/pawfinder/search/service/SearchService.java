package com.pawfinder.search.service;

import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.common.result.Result;
import com.pawfinder.common.util.PageResult;
import com.pawfinder.pet.dto.PetVO;
import com.pawfinder.pet.entity.Pet;
import com.pawfinder.search.convert.Pet2PetDoc;
import com.pawfinder.search.entity.PetDocument;
import com.pawfinder.search.feign.PetClient;
import com.pawfinder.search.repository.PetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 搜索服务
 */
@Service
public class SearchService {

    private static final Logger log = LoggerFactory.getLogger(SearchService.class);

    private final PetRepository petRepository;
    private final PetClient petClient;

    public SearchService(PetRepository petRepository, PetClient petClient) {
        this.petRepository = petRepository;
        this.petClient = petClient;
    }

    /**
     * 综合搜索宠物
     */
    public Result<PageResult<Map<String, Object>>> searchPets(
            String keyword,
            String species,
            String gender,
            String size,
            String status,
            int page,
            int pageSize) {
        try {
            Pageable pageable = PageRequest.of(page - 1, pageSize);
            Page<PetDocument> petPage;

            if (keyword != null && !keyword.isEmpty()) {
                // 关键词搜索
                petPage = petRepository.searchByKeyword(keyword, pageable);
            } else if (species != null) {
                // 按物种搜索
                petPage = petRepository.findBySpecies(species, pageable);
            } else if (status != null) {
                // 按状态搜索
                petPage = petRepository.findByStatus(status, pageable);
            } else {
                // 搜索全部
                petPage = petRepository.findAll(pageable);
            }

            // 过滤条件
            List<Map<String, Object>> records = petPage.getContent().stream()
                    .filter(doc -> gender == null || gender.equals(doc.getGender()))
                    .filter(doc -> size == null || size.equals(doc.getSize()))
                    .filter(doc -> status == null || status.equals(doc.getStatus()))
                    .map(this::convertToMap)
                    .collect(Collectors.toList());

            PageResult<Map<String, Object>> result = new PageResult<>();
            result.setRecords(records);
            result.setTotal(petPage.getTotalElements());
            result.setCurrent(page);
            result.setSize(pageSize);
            result.setPages(petPage.getTotalPages());

            return Result.success(result);
        } catch (Exception e) {
            log.error("搜索宠物失败", e);
            throw new BusinessException(ErrorCode.SEARCH_ERROR, "搜索失败: " + e.getMessage());
        }
    }

    /**
     * 同步宠物数据到 ES
     */
    public Result<String> syncPetData() {
        try {
            // 从宠物服务获取所有宠物
            Result<List<PetVO>> petsResult = petClient.getAllPets();
            if (petsResult.getCode() != 200 || petsResult.getData() == null) {
                return Result.fail(ErrorCode.SERVICE_UNAVAILABLE.getCode(), "获取宠物数据失败");
            }

            // 从返回的 Map 中提取 records 列表
            List<PetVO> data = petsResult.getData();
            List<PetDocument> documents = data.stream()
                    .map(Pet2PetDoc::toPetDocument)
                    .collect(Collectors.toList());

            petRepository.saveAll(documents);

            return Result.success("同步成功，共 " + documents.size() + " 条数据");
        } catch (Exception e) {
            log.error("同步宠物数据失败", e);
            return Result.fail(ErrorCode.SEARCH_ERROR.getCode(), "同步失败: " + e.getMessage());
        }
    }

    /**
     * 更新单个宠物索引
     */
    public Result<String> updatePetIndex(PetDocument petDocument) {
        try {
            petRepository.save(petDocument);
            return Result.success("更新成功");
        } catch (Exception e) {
            log.error("更新宠物索引失败", e);
            return Result.fail(ErrorCode.SEARCH_ERROR.getCode(), "更新失败: " + e.getMessage());
        }
    }

    /**
     * 删除宠物索引
     */
    public Result<String> deletePetIndex(String petId) {
        try {
            petRepository.deleteById(petId);
            return Result.success("删除成功");
        } catch (Exception e) {
            log.error("删除宠物索引失败", e);
            return Result.fail(ErrorCode.SEARCH_ERROR.getCode(), "删除失败: " + e.getMessage());
        }
    }

    /**
     * 转换为 Map
     */
    private Map<String, Object> convertToMap(PetDocument doc) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", doc.getId());
        map.put("name", doc.getName());
        map.put("species", doc.getSpecies());
        map.put("breed", doc.getBreed());
        map.put("gender", doc.getGender());
        map.put("size", doc.getSize());
        map.put("status", doc.getStatus());
        map.put("description", doc.getDescription());
        map.put("images", doc.getImages());
        map.put("adoptionFee", doc.getAdoptionFee());
        map.put("healthStatus", doc.getHealthStatus());
        map.put("institutionId", doc.getInstitutionId());
        map.put("shelterLocation", doc.getShelterLocation());
        map.put("vaccinationStatus", doc.getVaccinationStatus());
        map.put("sterilizationStatus", doc.getSterilizationStatus());
        return map;
    }

    /**
     * 转换为 ES 文档
     */
    private PetDocument convertToDocument(Map<String, Object> map) {
        PetDocument doc = new PetDocument();
        doc.setId((String) map.get("id"));
        doc.setName((String) map.get("name"));
        doc.setSpecies((String) map.get("species"));
        doc.setBreed((String) map.get("breed"));
        doc.setGender((String) map.get("gender"));
        doc.setSize((String) map.get("size"));
        doc.setStatus((String) map.get("status"));
        doc.setDescription((String) map.get("description"));
        doc.setInstitutionId((String) map.get("institutionId"));
        doc.setShelterLocation((String) map.get("shelterLocation"));
        doc.setHealthStatus((String) map.get("healthStatus"));
        return doc;
    }
}
