package com.pawfinder.adoption;

import jakarta.annotation.PostConstruct;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.groovy.template.GroovyTemplateAutoConfiguration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(exclude = {
        GroovyTemplateAutoConfiguration.class
})
@MapperScan("com.pawfinder.adoption.mapper")
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.pawfinder.adoption.feign")
@EnableAsync
public class AdoptionApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdoptionApplication.class, args);
    }
}