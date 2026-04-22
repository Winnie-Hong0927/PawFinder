package com.pawfinder.adoption;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * 领养服务启动类
 * 
 * 功能：
 * - 领养申请管理（创建、查询、审核）
 * - 领养记录管理
 * - Saga 长事务编排（领养完成流程）
 */
@SpringBootApplication
@MapperScan("com.pawfinder.adoption.mapper")
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.pawfinder.adoption.feign")
@EnableAsync
public class AdoptionApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdoptionApplication.class, args);
    }
}
