package com.pawfinder.pet;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

/**
 * 宠物服务启动类
 * 
 * 功能：
 * - 宠物CRUD
 * - 宠物状态管理
 * - 同步宠物数据到Elasticsearch
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.pawfinder")
@MapperScan("com.pawfinder.pet.mapper")
@ComponentScan(basePackages = "com.pawfinder")
public class PetApplication {
    public static void main(String[] args) {
        SpringApplication.run(PetApplication.class, args);
        System.out.println("========================================");
        System.out.println("  PawFinder Pet Service Started!");
        System.out.println("  Port: 8082");
        System.out.println("  API Docs: http://localhost:8082/doc.html");
        System.out.println("========================================");
    }
}
