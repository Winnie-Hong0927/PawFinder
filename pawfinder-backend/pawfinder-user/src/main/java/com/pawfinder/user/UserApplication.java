package com.pawfinder.user;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

/**
 * 用户服务启动类
 * 
 * 功能：
 * - 认证管理（验证码登录）
 * - 用户管理
 * - 机构管理
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.pawfinder")
@MapperScan("com.pawfinder.user.mapper")
@ComponentScan(basePackages = "com.pawfinder")
public class UserApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserApplication.class, args);
        System.out.println("========================================");
        System.out.println("  PawFinder User Service Started!");
        System.out.println("  Port: 8081");
        System.out.println("  API Docs: http://localhost:8081/doc.html");
        System.out.println("========================================");
    }
}
