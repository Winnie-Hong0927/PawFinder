package com.pawfinder.search.service;

import com.pawfinder.common.result.BusinessException;
import com.pawfinder.common.result.ErrorCode;
import com.pawfinder.search.entity.PetDocument;
import com.pawfinder.search.repository.PetRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ReactiveElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Service;
import co.elastic.clients.elasticsearch._types.query_dsl.*;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 搜索服务
 * 
 * 提供 Elasticsearch 全文检索功能
 */
@Slf4j
@Service
public class SearchService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private ReactiveElasticsearchOperations elasticsearchOperations;

    /**
     * 全文搜索宠物
     * 
     * 支持搜索字段：名称、品种、描述、性格特点、位置
     */
    public Mono<Map<String, Object>> searchPets(String keyword, String species, String gender, 
                                                  String size, String status, int page, int size) {
        // 构建查询条件
        List<Query> mustQueries = new ArrayList<>();
        List<Query> shouldQueries = new ArrayList<>();

        // 关键词搜索（多字段匹配）
        if (keyword != null && !keyword.trim().isEmpty()) {
            MultiMatchQuery multiMatchQuery = MultiMatchQuery.of(m -> m
                    .query(keyword)
                    .fields("name^3", "breed^2", "description", "traits", "shelterLocation", "institutionName")
                    .type(TextQueryType.BestFields)
            );
            shouldQueries.add(Query.of(q -> q.multiMatch(multiMatchQuery)));
        }

        // 物种过滤
        if (species != null && !species.isEmpty()) {
            TermQuery termQuery = TermQuery.of(t -> t.field("species").value(species));
            mustQueries.add(Query.of(q -> q.term(termQuery)));
        }

        // 性别过滤
        if (gender != null && !gender.isEmpty()) {
            TermQuery termQuery = TermQuery.of(t -> t.field("gender").value(gender));
            mustQueries.add(Query.of(q -> q.term(termQuery)));
        }

        // 体型过滤
        if (size != null && !size.isEmpty()) {
            TermQuery termQuery = TermQuery.of(t -> t.field("size").value(size));
            mustQueries.add(Query.of(q -> q.term(termQuery)));
        }

        // 状态过滤（默认只搜索可领养的）
        if (status == null || status.isEmpty()) {
            status = "available";
        }
        TermQuery statusQuery = TermQuery.of(t -> t.field("status").value(status));
        mustQueries.add(Query.of(q -> q.term(statusQuery)));

        // 构建布尔查询
        BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();
        if (!mustQueries.isEmpty()) {
            boolQueryBuilder.must(mustQueries);
        }
        if (!shouldQueries.isEmpty()) {
            boolQueryBuilder.should(shouldQueries);
            boolQueryBuilder.minimumShouldMatch("1");
        }

        // 创建查询
        NativeQuery searchQuery = NativeQuery.builder()
                .withQuery(Query.of(q -> q.bool(boolQueryBuilder.build())))
                .withPageable(PageRequest.of(page - 1, size))
                .build();

        // 执行搜索
        return elasticsearchOperations.search(searchQuery, PetDocument.class)
                .map(SearchHit::getContent)
                .collectList()
                .map(hits -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("records", hits);
                    result.put("page", page);
                    result.put("size", size);
                    return result;
                });
    }

    /**
     * 索引宠物文档
     */
    public Mono<PetDocument> indexPet(PetDocument petDocument) {
        return petRepository.save(petDocument)
                .doOnSuccess(pet -> log.info("索引宠物成功: id={}", pet.getId()))
                .doOnError(e -> log.error("索引宠物失败: {}", e.getMessage()));
    }

    /**
     * 批量索引宠物
     */
    public Flux<PetDocument> indexPets(List<PetDocument> petDocuments) {
        return petRepository.saveAll(petDocuments)
                .doOnNext(pet -> log.debug("索引宠物: id={}", pet.getId()))
                .doOnComplete(() -> log.info("批量索引完成: count={}", petDocuments.size()));
    }

    /**
     * 删除宠物索引
     */
    public Mono<Void> deletePet(String petId) {
        return petRepository.deleteById(petId)
                .doOnSuccess(v -> log.info("删除宠物索引: id={}", petId));
    }

    /**
     * 更新宠物索引
     */
    public Mono<PetDocument> updatePet(PetDocument petDocument) {
        return petRepository.save(petDocument)
                .doOnSuccess(pet -> log.info("更新宠物索引: id={}", pet.getId()));
    }

    /**
     * 根据ID获取宠物
     */
    public Mono<PetDocument> getPetById(String petId) {
        return petRepository.findById(petId)
                .switchIfEmpty(Mono.error(new BusinessException(ErrorCode.PET_NOT_FOUND)));
    }
}
