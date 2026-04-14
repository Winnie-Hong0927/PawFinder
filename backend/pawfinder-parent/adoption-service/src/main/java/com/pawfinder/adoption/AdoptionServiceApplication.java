package com.pawfinder.adoption;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication(scanBasePackages = {"com.pawfinder.adoption", "com.pawfinder.common"})
@MapperScan("com.pawfinder.adoption.mapper")
public class AdoptionServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdoptionServiceApplication.class, args);
    }
}
