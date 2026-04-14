package com.pawfinder.pet;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * PawFinder Pet Service Application
 */
@EnableDiscoveryClient
@SpringBootApplication(scanBasePackages = {"com.pawfinder.pet", "com.pawfinder.common"})
@MapperScan("com.pawfinder.pet.mapper")
public class PetServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PetServiceApplication.class, args);
    }
}
