package com.pawfinder.search.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.repository.config.EnableReactiveElasticsearchRepositories;

/**
 * Elasticsearch 配置
 */
@Configuration
@EnableReactiveElasticsearchRepositories(basePackages = "com.pawfinder.search.repository")
public class ElasticsearchConfig {

    @Value("${spring.elasticsearch.uris:localhost:9200}")
    private String uris;

    @Value("${spring.elasticsearch.username:}")
    private String username;

    @Value("${spring.elasticsearch.password:}")
    private String password;
}
