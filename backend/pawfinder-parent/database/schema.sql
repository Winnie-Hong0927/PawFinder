-- PawFinder Database Schema
-- Run this script on your MySQL database to create all required tables

CREATE DATABASE IF NOT EXISTS pawfinder DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pawfinder;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `phone` VARCHAR(20),
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100),
    `avatar` VARCHAR(500),
    `role` VARCHAR(20) NOT NULL DEFAULT 'user' COMMENT 'user/adopter/donor/admin',
    `adopter_status` VARCHAR(20) COMMENT 'pending/approved/rejected',
    `bio` TEXT,
    `address` VARCHAR(255),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` BIGINT,
    `deleted` TINYINT NOT NULL DEFAULT 0,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_deleted (deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Pets Table
-- ============================================
CREATE TABLE IF NOT EXISTS `pets` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `species` VARCHAR(50) NOT NULL COMMENT 'dog/cat/other',
    `breed` VARCHAR(100),
    `gender` VARCHAR(10) COMMENT 'male/female',
    `age` VARCHAR(50) COMMENT 'e.g., 2 years, 6 months',
    `weight` DECIMAL(5,2) COMMENT 'kg',
    `images` JSON COMMENT '["url1", "url2"]',
    `description` TEXT,
    `traits` JSON COMMENT '["friendly", "quiet", "active"]',
    `health_status` VARCHAR(100) COMMENT 'healthy/neutered/vaccinated',
    `status` VARCHAR(20) NOT NULL DEFAULT 'available' COMMENT 'available/pending/adopted',
    `shelter_name` VARCHAR(200),
    `shelter_address` VARCHAR(255),
    `rescue_date` DATE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` BIGINT,
    `deleted` TINYINT NOT NULL DEFAULT 0,
    INDEX idx_species (species),
    INDEX idx_status (status),
    INDEX idx_deleted (deleted),
    FULLTEXT INDEX idx_name_desc (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Adoption Applications Table
-- ============================================
CREATE TABLE IF NOT EXISTS `adoption_applications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `pet_id` BIGINT NOT NULL,
    `reason` TEXT NOT NULL,
    `id_card` VARCHAR(20) NOT NULL,
    `living_condition` TEXT,
    `experience` TEXT,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT 'pending/approved/rejected/cancelled',
    `review_notes` TEXT,
    `reviewed_by` BIGINT,
    `reviewed_at` DATETIME,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` BIGINT,
    `deleted` TINYINT NOT NULL DEFAULT 0,
    INDEX idx_user_id (user_id),
    INDEX idx_pet_id (pet_id),
    INDEX idx_status (status),
    INDEX idx_deleted (deleted),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pet_id) REFERENCES pets(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Adoptions Table
-- ============================================
CREATE TABLE IF NOT EXISTS `adoptions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `pet_id` BIGINT NOT NULL,
    `application_id` BIGINT,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT 'active/cancelled/terminated',
    `notes` TEXT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` BIGINT,
    `deleted` TINYINT NOT NULL DEFAULT 0,
    INDEX idx_user_id (user_id),
    INDEX idx_pet_id (pet_id),
    INDEX idx_status (status),
    INDEX idx_deleted (deleted),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pet_id) REFERENCES pets(id),
    FOREIGN KEY (application_id) REFERENCES adoption_applications(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Pet Videos Table (for follow-up visits)
-- ============================================
CREATE TABLE IF NOT EXISTS `pet_videos` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `adoption_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `pet_id` BIGINT NOT NULL,
    `video_url` VARCHAR(500) NOT NULL,
    `thumbnail_url` VARCHAR(500),
    `description` TEXT,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT 'pending/approved/rejected',
    `review_notes` TEXT,
    `reviewed_by` BIGINT,
    `next_reminder_date` DATETIME,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` BIGINT,
    `deleted` TINYINT NOT NULL DEFAULT 0,
    INDEX idx_adoption_id (adoption_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_deleted (deleted),
    FOREIGN KEY (adoption_id) REFERENCES adoptions(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (pet_id) REFERENCES pets(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Donation Campaigns Table
-- ============================================
CREATE TABLE IF NOT EXISTS `donation_campaigns` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT,
    `image_url` VARCHAR(500),
    `target_amount` DECIMAL(12,2) NOT NULL,
    `current_amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT 'active/completed/cancelled',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` BIGINT,
    `deleted` TINYINT NOT NULL DEFAULT 0,
    INDEX idx_status (status),
    INDEX idx_deleted (deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Donations Table
-- ============================================
CREATE TABLE IF NOT EXISTS `donations` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `campaign_id` BIGINT NOT NULL,
    `user_id` BIGINT,
    `amount` DECIMAL(12,2) NOT NULL,
    `payment_method` VARCHAR(50) COMMENT 'alipay/wechat/bank',
    `payment_status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT 'pending/completed/failed/refunded',
    `transaction_id` VARCHAR(100),
    `anonymous` VARCHAR(10) NOT NULL DEFAULT 'false',
    `message` TEXT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` BIGINT,
    `deleted` TINYINT NOT NULL DEFAULT 0,
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_user_id (user_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_deleted (deleted),
    FOREIGN KEY (campaign_id) REFERENCES donation_campaigns(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Chat Sessions Table
-- ============================================
CREATE TABLE IF NOT EXISTS `chat_sessions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `session_id` VARCHAR(100) NOT NULL UNIQUE,
    `title` VARCHAR(200) DEFAULT '新对话',
    `message_count` BIGINT NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` BIGINT,
    `deleted` TINYINT NOT NULL DEFAULT 0,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_deleted (deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Chat Messages Table
-- ============================================
CREATE TABLE IF NOT EXISTS `chat_messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `session_id` VARCHAR(100) NOT NULL,
    `role` VARCHAR(20) NOT NULL COMMENT 'user/assistant',
    `content` TEXT NOT NULL,
    `model` VARCHAR(50),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` BIGINT,
    `deleted` TINYINT NOT NULL DEFAULT 0,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted (deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Sample Data
-- ============================================

-- Insert admin user (password: admin123)
INSERT INTO `users` (`email`, `password`, `name`, `role`, `adopter_status`, `created_by`) VALUES
('admin@pawfinder.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '管理员', 'admin', 'approved', 1);

-- Insert sample pets
INSERT INTO `pets` (`name`, `species`, `breed`, `gender`, `age`, `weight`, `images`, `description`, `traits`, `health_status`, `status`, `shelter_name`, `rescue_date`, `created_by`) VALUES
('小橘', 'cat', '中华田园猫', 'female', '1岁', 3.5, '["https://example.com/cat1.jpg"]', '性格温顺亲人，喜欢撒娇，已绝育', '["温顺", "亲人", "安静"]', 'healthy,neutered,vaccinated', 'available', '阳光宠物救助站', '2024-01-15', 1),
('旺财', 'dog', '金毛', 'male', '2岁', 25.0, '["https://example.com/dog1.jpg"]', '活泼好动，喜欢户外运动，对人友好', '["活泼", "友好", "聪明"]', 'healthy,neutered,vaccinated', 'available', '爱心宠物之家', '2024-02-01', 1),
('咪咪', 'cat', '英短', 'male', '3岁', 4.2, '["https://example.com/cat2.jpg"]', '安静乖巧，适合公寓饲养', '["安静", "乖巧", "独立"]', 'healthy,vaccinated', 'available', '阳光宠物救助站', '2024-01-20', 1),
('豆豆', 'dog', '柴犬', 'female', '1.5岁', 10.0, '["https://example.com/dog2.jpg"]', '忠诚护主，笑起来特别治愈', '["忠诚", "活泼", "爱笑"]', 'healthy,neutered,vaccinated', 'pending', '流浪动物救助中心', '2024-02-10', 1),
('小白', 'cat', '波斯猫', 'female', '4岁', 3.8, '["https://example.com/cat3.jpg"]', '优雅安静，需要定期毛发护理', '["安静", "优雅", "粘人"]', 'healthy,vaccinated', 'available', '爱心宠物之家', '2024-01-25', 1);

-- Insert sample donation campaigns
INSERT INTO `donation_campaigns` (`title`, `description`, `image_url`, `target_amount`, `current_amount`, `status`, `created_by`) VALUES
('流浪猫狗救助计划', '为流浪猫狗提供食物、医疗和庇护所', 'https://example.com/campaign1.jpg', 50000.00, 23500.00, 'active', 1),
('绝育基金', '资助流浪动物绝育手术，控制繁殖', 'https://example.com/campaign2.jpg', 30000.00, 15800.00, 'active', 1),
('医疗救助金', '帮助生病或受伤的流浪动物获得及时治疗', 'https://example.com/campaign3.jpg', 80000.00, 45000.00, 'active', 1);
