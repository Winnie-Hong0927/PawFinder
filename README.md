# PawFinder - 宠物领养平台

一个温暖而专业的宠物领养平台，帮助流浪宠物找到温暖的新家。

## 项目结构

```
pawfinder/
├── frontend/                 # Next.js 前端应用
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   │   ├── api/         # API Routes (如果需要)
│   │   │   ├── pets/        # 宠物列表和详情
│   │   │   ├── dashboard/   # 个人中心
│   │   │   ├── donate/      # 捐赠页面
│   │   │   ├── guidelines/  # 领养指南
│   │   │   ├── faq/         # 常见问题
│   │   │   └── about/       # 关于我们
│   │   └── components/      # React 组件
│   │       ├── ui/          # shadcn/ui 组件
│   │       ├── layout/      # 布局组件
│   │       ├── pet/         # 宠物相关组件
│   │       └── chat/        # 智能助手组件
│   ├── package.json
│   └── ...
│
├── backend/                  # Spring Boot 微服务后端
│   ├── pawfinder-parent/     # Maven 多模块项目
│   │   ├── common/          # 公共模块
│   │   ├── gateway/         # API 网关
│   │   ├── user-service/    # 用户服务
│   │   ├── pet-service/     # 宠物服务
│   │   ├── adoption-service/ # 领养服务
│   │   ├── donation-service/ # 捐赠服务
│   │   ├── chat-service/    # 聊天服务 (LLM)
│   │   ├── database/        # 数据库脚本
│   │   ├── docker-compose.yml
│   │   └── README.md
│
├── .coze                     # Coze CLI 配置
└── README.md                 # 本文件
```

## 技术栈

### 前端
- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI Components**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

### 后端
- **Framework**: Spring Cloud Alibaba 2022.0.0.0
- **Core**: Spring Boot 3.2.0
- **ORM**: MyBatis 3.0.3
- **Database**: MySQL 8.0
- **Service Discovery**: Nacos
- **AI**: Doubao (豆包模型)

## 快速开始

### 前端启动

```bash
cd frontend
pnpm install
pnpm dev
```

访问 http://localhost:5000

### 后端启动

```bash
cd backend/pawfinder-parent

# 1. 启动基础设施 (MySQL + Nacos)
docker-compose up -d

# 2. 等待约30秒让服务完全启动

# 3. 初始化数据库 (如需要)
docker exec -i pawfinder-mysql mysql -uroot -proot123 pawfinder < database/schema.sql

# 4. 构建项目
mvn clean package -DskipTests

# 5. 运行各个服务 (在独立终端)
java -jar gateway/target/gateway.jar
java -jar user-service/target/user-service.jar
java -jar pet-service/target/pet-service.jar
java -jar adoption-service/target/adoption-service.jar
java -jar donation-service/target/donation-service.jar
java -jar chat-service/target/chat-service.jar
```

## 功能模块

### 前端功能
- [x] 首页 - 宠物展示与搜索
- [x] 宠物列表页 - 分类筛选
- [x] 宠物详情页 - 详细信息
- [x] 个人中心 - 申请记录、捐赠记录
- [x] 捐赠页面 - 捐赠项目
- [x] 管理后台 - 用户/宠物/申请管理
- [x] 领养指南 - 领养流程说明
- [x] 常见问题 - FAQ页面
- [x] 关于我们 - 平台介绍
- [x] 智能助手 - AI聊天机器人

### 后端服务
| 服务 | 端口 | API前缀 | 功能 |
|------|------|---------|------|
| Gateway | 8080 | /api | 路由、认证 |
| User | 8081 | /api/auth | 用户认证 |
| Pet | 8082 | /api/pets | 宠物CRUD |
| Adoption | 8083 | /api/adoptions | 领养申请 |
| Donation | 8084 | /api/donations | 捐赠 |
| Chat | 8085 | /api/chat | AI聊天 |

## 角色说明

| 角色 | 说明 |
|------|------|
| user | 普通访客，可浏览宠物 |
| adopter | 领养人，可申请领养 |
| donor | 捐赠人，可发起捐赠 |
| admin | 管理员，审核申请、管理宠物 |

## 环境变量

### 后端环境变量
| 变量 | 默认值 | 说明 |
|------|-------|------|
| NACOS_HOST | localhost | Nacos地址 |
| NACOS_PORT | 8848 | Nacos端口 |
| DB_HOST | localhost | MySQL地址 |
| DB_PORT | 3306 | MySQL端口 |
| DB_NAME | pawfinder | 数据库名 |
| DB_USERNAME | root | 数据库用户 |
| DB_PASSWORD | root | 数据库密码 |
| DOUBAN_API_KEY | - | 豆包API密钥 |

## 开发说明

### 前端开发
- 使用 `pnpm` 作为包管理器
- shadcn/ui 组件位于 `src/components/ui/`
- 页面位于 `src/app/` 目录
- 遵循 Next.js App Router 规范

### 后端开发
- 使用 Maven 管理依赖
- 每个服务独立运行
- 通过 Nacos 进行服务发现
- MyBatis XML Mapper 位于 `src/main/resources/mapper/`

## 许可证

MIT License
