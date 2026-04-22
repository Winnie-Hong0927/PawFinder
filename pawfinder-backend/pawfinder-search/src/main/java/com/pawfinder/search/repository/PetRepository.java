package com.pawfinder.search.repository;

import com.pawfinder.search.entity.PetDocument;
import org.springframework.data.elasticsearch.repository.ReactiveElasticsearchRepository;
import org.springframework.stereotype.Repository;

/**
 * 宠物 Elasticsearch Repository
 */
@Repository
public interface PetRepository extends ReactiveElasticsearchRepository<PetDocument, String> {
}
