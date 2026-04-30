package com.pawfinder.search.component;

import com.pawfinder.pet.entity.Pet;
import com.pawfinder.pet.mapper.PetMapper;
import com.pawfinder.search.convert.Pet2PetDoc;
import com.pawfinder.search.entity.PetDocument;
import com.pawfinder.search.repository.PetRepository;
import jakarta.annotation.Resource;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

//@Component
public class EsDataSyncRunner {
// implements ApplicationRunner
    // 你的 MySQL Mapper
//    @Resource
//    private PetMapper petMapper;
//
//    // 你的 ES Repository
//    @Resource
//    private PetRepository petRepository;
//
//    /**
//     * 项目启动成功后自动执行
//     */
//    @Override
//    public void run(ApplicationArguments args) {
//        // 1. 从数据库查数据
//        List<Pet> mysqlPets = petMapper.selectList(null);
//
//        // 2. 转换类型（关键！）
//        List<PetDocument> esPets = mysqlPets.stream()
//                .map(Pet2PetDoc::toPetDocument)
//                .toList();
//
//        // 3. 清空旧数据
//        petRepository.deleteAll();
//
//        // 4. 存入 ES
//        petRepository.saveAll(esPets);
//    }
}
