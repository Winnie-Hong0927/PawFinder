package com.pawfinder.pet;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.pawfinder")
@MapperScan("com.pawfinder.pet.mapper")
@ComponentScan(basePackages = "com.pawfinder")
public class PetApplication {
    public static void main(String[] args) {
        SpringApplication.run(PetApplication.class, args);
    }
}
