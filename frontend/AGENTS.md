# PawFinder 宠物领养系统开发规范

## 项目概述

PawFinder 是一个温暖而专业的宠物领养平台，帮助流浪宠物找到温暖的新家。

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI Components**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **AI**: LLM SDK (豆包模型)

## 项目结构

```
/workspace/projects/
├── SPEC.md                    # 项目规格文档
├── .coze                      # Coze CLI 配置
├── package.json
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API Routes
│   │   │   ├── auth/         # 认证 API
│   │   │   ├── pets/         # 宠物 API
│   │   │   ├── adoptions/    # 领养 API
│   │   │   ├── donations/    # 捐赠 API
│   │   │   ├── videos/       # 视频 API
│   │   │   └── chat/         # 聊天 API (LLM)
│   │   ├── auth/            # 认证页面
│   │   ├── pets/            # 宠物列表和详情页
│   │   ├── dashboard/       # 个人中心
│   │   ├── donate/          # 捐赠页面
│   │   └── admin/           # 管理后台
│   ├── components/          # React 组件
│   │   ├── ui/              # shadcn/ui 组件
│   │   ├── layout/          # 布局组件
│   │   ├── pet/             # 宠物相关组件
│   │   └── chat/            # 聊天组件
│   └── storage/
│       └── database/        # Supabase 数据库
│           ├── supabase-client.ts
│           └── shared/
│               └── schema.ts # 数据库表定义
└── public/                   # 静态资源
```

## 数据库表

### users - 用户表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR(36) | 主键 |
| email | VARCHAR(255) | 邮箱（唯一）|
| phone | VARCHAR(20) | 手机号 |
| name | VARCHAR(100) | 姓名 |
| role | VARCHAR(20) | 角色：user/adopter/donor/admin |
| adopter_status | VARCHAR(20) | 领养人状态 |
| ... | ... | ... |

### sessions - 会话表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR(255) | 会话ID（主键）|
| user_id | TEXT | 用户ID |
| user_data | JSONB | 用户数据 |
| created_at | TIMESTAMP | 创建时间 |
| expires_at | TIMESTAMP | 过期时间 |

### pets - 宠物表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR(36) | 主键 |
| name | VARCHAR(100) | 名字 |
| species | VARCHAR(50) | 种类 |
| images | JSONB | 图片数组 |
| traits | JSONB | 特征标签 |
| status | VARCHAR(20) | available/pending/adopted |
| ... | ... | ... |

### adoption_applications - 领养申请表
### adoptions - 领养记录表
### pet_videos - 宠物视频表
### donation_campaigns - 捐赠项目表
### donations - 捐赠记录表
### chat_messages - 聊天记录表

## API 端点

### 认证
- `POST /api/auth/send-code` - 发送验证码
- `POST /api/auth/verify-code` - 验证验证码并登录（自动注册）
- `GET /api/auth/me` - 获取当前用户（基于会话）
- `PUT /api/auth/me` - 更新用户信息

### 宠物
- `GET /api/pets` - 获取宠物列表
- `GET /api/pets/:id` - 获取宠物详情
- `POST /api/pets` - 创建宠物（管理员）
- `PUT /api/pets/:id` - 更新宠物（管理员）
- `DELETE /api/pets/:id` - 删除宠物（管理员）

### 领养
- `GET /api/adoptions` - 获取领养申请
- `POST /api/adoptions` - 提交领养申请
- `PUT /api/adoptions/:id` - 审核申请（管理员）

### 视频
- `GET /api/videos` - 获取视频列表
- `POST /api/videos` - 上传视频

### 捐赠
- `GET /api/donations/campaigns` - 获取捐赠项目
- `POST /api/donations` - 提交捐赠

### 聊天 (LLM)
- `POST /api/chat` - 与小 paw 对话
- `POST /api/chat/recommend` - 宠物推荐

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发环境
pnpm dev

# 构建
pnpm build

# 生产环境
pnpm start
```

## 关键文件

- `SPEC.md` - 项目完整规格文档
- `src/storage/database/shared/schema.ts` - 数据库表定义
- `src/storage/database/supabase-client.ts` - Supabase 客户端
- `src/lib/session.ts` - 后端会话管理（数据库存储）
- `src/contexts/auth-context.tsx` - 认证上下文（前端）

## 注意事项

1. 所有用户输入必须验证
2. 敏感操作需要身份验证
3. 视频内容由管理员人工审核
4. 使用 Supabase RLS 实现数据隔离
5. **会话认证**：用户登录使用 `/api/auth/verify-code`，会话存储在数据库 `sessions` 表中
6. **验证码**：测试环境使用 `123456` 作为万能验证码
7. **会话有效期**：24小时，会话ID通过 HttpOnly Cookie 传递
