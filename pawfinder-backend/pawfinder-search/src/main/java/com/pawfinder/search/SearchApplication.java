package com.pawfinder.search;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.elasticsearch.repository.config.EnableReactiveElasticsearchRepositories;

/**
 * 搜索服务启动类
 * 
 * Elasticsearch 全文检索服务
 * 提供宠物搜索功能
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@EnableReactiveElasticsearchRepositories
public class SearchApplication {
    public static void main(String[] args) {
        SpringApplication.run(SearchApplication.class, args);
    }
}
