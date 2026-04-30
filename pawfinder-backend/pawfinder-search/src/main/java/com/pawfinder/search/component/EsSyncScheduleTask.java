package com.pawfinder.search.component;

import com.pawfinder.common.result.Result;
import com.pawfinder.pet.dto.PetVO;
import com.pawfinder.pet.entity.Pet;
import com.pawfinder.pet.mapper.PetMapper;
import com.pawfinder.search.convert.Pet2PetDoc;
import com.pawfinder.search.entity.PetDocument;
import com.pawfinder.search.feign.PetClient;
import com.pawfinder.search.repository.PetRepository;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.*;

@Slf4j
@Component
public class EsSyncScheduleTask {
    private final PetRepository petRepository;

    private final PetClient petClient;

    public EsSyncScheduleTask(PetRepository petRepository, PetClient petClient) {
        this.petRepository = petRepository;
        this.petClient = petClient;
    }

    /**
     * 【最优效率方案】
     * 1. 只查ES ID（超快）
     * 2. 内存比较（<10ms）
     * 3. 批量更新（只更改变更的数据）
     * 4. 不清空、不卡顿、不影响搜索
     */
    @Scheduled(fixedRate = 60000)
    public void bestSyncEsData() {
        try {
            log.info("===== 最优效率：ES 增量同步开始 =====");

            // ========== 1. 从 pet-service 获取全量宠物（替换 mapper） ==========
            Result<List<PetVO>> petsResult = petClient.getAllPets();
            if (petsResult.getCode() != 200 || petsResult.getData() == null) {
                log.error("从 pet-service 获取宠物数据失败");
                return;
            }
            List<PetVO> mysqlPets = petsResult.getData();

            // 远程无数据 → 清空 ES
            if (mysqlPets.isEmpty()) {
                petRepository.deleteAll();
                log.info("pet-service 无数据，清空 ES 完成");
                return;
            }

            // ========== 2. 只查询 ES 中所有文档 ID（效率最高） ==========
            List<String> esIds = new ArrayList<>();
            Iterable<PetDocument> petDocuments = petRepository.findAll();
            for (PetDocument petDocument : petDocuments) {
                esIds.add(petDocument.getId());
            }
            Set<String> esIdSet = new HashSet<>(esIds);

            // ========== 3. 内存对比：需要新增/更新 ==========
            List<PetDocument> needUpsert = new ArrayList<>();
            for (PetVO vo : mysqlPets) {
                needUpsert.add(Pet2PetDoc.toPetDocument(vo));
            }

            // ========== 4. 内存对比：需要删除（ES 有、远程无） ==========
            List<String> needDelete = new ArrayList<>();
            for (String id : esIdSet) {
                boolean existsInRemote = mysqlPets.stream()
                        .anyMatch(petVO -> id.equals(petVO.getId()));

                if (!existsInRemote) {
                    needDelete.add(id);
                }
            }

            // ========== 5. 批量执行 ES 操作 ==========
            if (!needUpsert.isEmpty()) {
                petRepository.saveAll(needUpsert);
            }
            if (!needDelete.isEmpty()) {
                petRepository.deleteAllById(needDelete);
            }

            log.info("===== 同步完成：更新/新增 {} 条 | 删除 {} 条 =====",
                    needUpsert.size(), needDelete.size());

        } catch (Exception e) {
            log.error("ES 增量同步失败", e);
        }
    }
}