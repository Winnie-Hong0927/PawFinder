package com.pawfinder.search.repository;

import com.pawfinder.search.entity.PetDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

/**
 * 宠物 ES 仓库
 */
public interface PetRepository extends ElasticsearchRepository<PetDocument, String> {

    /**
     * 按状态查询
     */
    Page<PetDocument> findByStatus(String status, Pageable pageable);

    /**
     * 按物种查询
     */
    Page<PetDocument> findBySpecies(String species, Pageable pageable);

    /**
     * 按机构查询
     */
    Page<PetDocument> findByInstitutionId(String institutionId, Pageable pageable);

    /**
     * 多字段模糊搜索
     */
    @Query("{\"bool\": {\"should\": [" +
            "{\"match\": {\"name\": \"?0\"}}," +
            "{\"match\": {\"breed\": \"?0\"}}," +
            "{\"match\": {\"description\": \"?0\"}}" +
            "]}}")
    Page<PetDocument> searchByKeyword(String keyword, Pageable pageable);

    /**
     * 按状态查询列表
     */
    List<PetDocument> findByStatus(String status);
}
