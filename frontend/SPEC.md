# 宠物领养系统 - PawFinder

## 1. Concept & Vision

PawFinder 是一个温暖而专业的宠物领养平台，将失散的宠物与爱心人士重新连接。系统以"每一个生命都值得被爱"为核心理念，通过严格的领养审核流程确保宠物找到真正负责的新主人，同时为捐赠者提供便捷的贡献渠道。智能助理"小 paw"24 小时在线，为用户提供个性化的宠物推荐和领养指导。

整体视觉风格：**温暖治愈系** — 柔和的米色与暖橙色调，搭配圆润的卡片设计和舒适的留白，传递出家的温馨感。

## 2. Design Language

### 色彩系统
```css
:root {
  /* 主色 - 温暖橙 */
  --primary-50: #FFF7ED;
  --primary-100: #FFEDD5;
  --primary-200: #FED7AA;
  --primary-500: #F97316;
  --primary-600: #EA580C;
  --primary-700: #C2410C;
  
  /* 辅助色 - 治愈蓝绿 */
  --accent-500: #14B8A6;
  --accent-600: #0D9488;
  
  /* 中性色 */
  --neutral-50: #FAFAFA;
  --neutral-100: #F5F5F5;
  --neutral-200: #E5E5E5;
  --neutral-400: #A3A3A3;
  --neutral-600: #525252;
  --neutral-800: #262626;
  --neutral-900: #171717;
  
  /* 状态色 */
  --success: #22C55E;
  --warning: #EAB308;
  --error: #EF4444;
  
  /* 背景 */
  --bg-primary: #FFFBF7;
  --bg-card: #FFFFFF;
  --bg-muted: #FEF3E2;
}
```

### 字体系统
- **标题**: "Nunito" (Google Fonts) - 圆润友好，传递温暖感
- **正文**: "Noto Sans SC" - 清晰易读的中文字体
- **英文辅助**: "Quicksand" - 活泼俏皮，用于标签和装饰

### 间距系统
- 基础单位: 4px
- 组件内间距: 12px / 16px / 20px / 24px
- 卡片间距: 16px / 24px
- 区块间距: 40px / 64px / 80px

### 动效哲学
- **入场动画**: 卡片 fade-in + translateY(20px)，stagger 100ms
- **交互反馈**: hover 时 scale(1.02)，transition 200ms ease-out
- **页面切换**: 淡入淡出，300ms ease-in-out
- **加载状态**: 骨架屏 + shimmer 动画

### 视觉元素
- **图标库**: Lucide React (圆润风格)
- **图片风格**: 高质量宠物摄影，暖色调，背景虚化
- **装饰元素**: 爪印、爱心、波浪线等可爱图形
- **圆角**: 卡片 16px，按钮 12px，输入框 8px

## 3. Layout & Structure

### 页面结构

```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo | 导航 | 搜索 | 用户/登录                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    Hero Section                         │
│              大图展示 + 核心 CTA 按钮                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                  智能助理入口                            │
│              "小 paw" 对话气泡                            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   Pet Gallery                           │
│           网格布局: 响应式 1-2-3-4 列                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│               Donation Section                           │
│            捐赠信息展示 + 参与入口                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Footer: 版权 | 联系方式 | 社交媒体                        │
└─────────────────────────────────────────────────────────┘
```

### 响应式断点
- Mobile: < 640px (1列)
- Tablet: 640px - 1024px (2列)
- Desktop: 1024px - 1280px (3列)
- Large: > 1280px (4列)

## 4. Features & Interactions

### 4.1 用户系统

#### 用户角色
| 角色 | 权限 |
|------|------|
| 普通用户 | 浏览宠物、捐赠信息、与小 paw 对话 |
| 领养人 | 普通用户权限 + 申请领养、上传宠物视频 |
| 捐赠人 | 普通用户权限 + 参与捐赠 |
| 管理员 | 全功能管理：审核领养、管理宠物、审查视频、用户管理 |

#### 注册/登录流程
1. 用户输入手机号/邮箱 + 验证码注册
2. 首次登录完善个人资料（姓名、地址、自我介绍）
3. 可选：成为领养人（需提交身份证）或捐赠人

### 4.2 宠物管理

#### 宠物信息结构
```typescript
interface Pet {
  id: string;
  name: string;                    // 名字
  species: 'dog' | 'cat' | 'rabbit' | 'bird' | 'hamster' | 'other';
  breed: string;                    // 品种
  age: string;                      // 年龄描述
  gender: 'male' | 'female' | 'unknown';
  size: 'small' | 'medium' | 'large';
  images: string[];                 // 图片 URL 列表
  description: string;               // 详细介绍
  traits: string[];                  // 特征标签
  health_status: string;            // 健康状况
  vaccination_status: boolean;      // 是否已接种疫苗
  sterilization_status: boolean;    // 是否已绝育
  shelter_location: string;         // 所在救助站
  adoption_fee: number;             // 领养费用 (0 表示免费)
  status: 'available' | 'pending' | 'adopted';
  created_at: string;
  updated_at: string;
}
```

#### 宠物展示交互
- 卡片 hover: 显示"查看详情"按钮，轻微放大
- 详情页: 图片画廊轮播，详细信息分标签展示
- 筛选: 按种类、性别、体型、年龄、地区筛选
- 搜索: 支持关键词搜索（名字、品种）

### 4.3 领养流程

#### 申请阶段
1. 用户点击"申请领养" → 填写申请表
2. 上传证明材料:
   - 身份证正反面照片
   - 居住证明
   - 收入证明或工作证明
   - 家庭情况说明
3. 签署领养协议承诺书

#### 审核阶段
1. 管理员初审材料完整性
2. 电话/视频回访确认
3. 实地考察（如需要）
4. 审核结果通知（通过/拒绝/补充材料）

#### 领养后管理
1. 领养成功后:
   - 系统发送欢迎礼包
   - 定时提醒上传宠物视频（每周/每月）
   - 建立宠物健康档案

2. 视频审核:
   - 领养人上传宠物近况视频
   - 管理员审核视频内容
   - 评估领养人是否合格
   - 不合格 → 警告 → 撤销资格 → 宠物重新进入领养池

### 4.4 捐赠系统

#### 捐赠类型
| 类型 | 说明 |
|------|------|
| 物资捐赠 | 宠物粮、玩具、窝、清洁用品等 |
| 资金捐赠 | 任意金额，用于宠物医疗、饲养 |
| 定向捐赠 | 指定用于某只宠物或某个救助站 |

#### 捐赠流程
1. 选择捐赠类型
2. 选择/输入物资清单或金额
3. 填写收件信息（用于物资捐赠）
4. 完成支付/寄送
5. 获得捐赠证书和积分

### 4.5 智能助理 "小 paw"

#### 核心功能
1. **宠物推荐**
   - 用户描述理想宠物特征
   - AI 分析并推荐匹配的宠物
   - 展示推荐理由和匹配度

2. **领养指导**
   - 解答领养流程问题
   - 提醒准备材料
   - 预约实地考察

3. **视频提醒**
   - 自动提醒领养人上传宠物视频
   - 追踪提醒周期
   - 记录提醒历史

#### 对话界面
- 浮动聊天按钮（右下角）
- 点击展开对话窗口
- 支持文字输入
- 显示 AI 回复动画

### 4.6 管理后台

#### 管理员功能
- 宠物管理: 添加/编辑/上架/下架宠物
- 领养审核: 查看申请、审核材料、做出决定
- 视频审查: 查看领养人上传的宠物视频
- 用户管理: 查看用户、设置权限、处理投诉
- 数据统计: 领养数量、捐赠金额、活跃度

## 5. Component Inventory

### 5.1 Navigation
- **Header**: 固定顶部，毛玻璃背景，Logo + 导航链接 + 用户菜单
- **MobileNav**: 汉堡菜单，侧边栏滑出
- **Breadcrumb**: 页面路径导航

### 5.2 Cards
- **PetCard**: 宠物卡片
  - Default: 图片 + 名字 + 品种 + 状态标签
  - Hover: 轻微放大，显示快捷操作
  - Loading: 骨架屏
- **DonationCard**: 捐赠项目卡片
- **UserCard**: 用户信息卡片（管理后台）

### 5.3 Forms
- **Input**: 文本输入，状态: default/focus/error/disabled
- **Select**: 下拉选择
- **FileUpload**: 文件上传，支持拖拽，显示上传进度
- **DatePicker**: 日期选择
- **Checkbox/Radio**: 多选/单选

### 5.4 Buttons
- **Primary**: 橙色主按钮，用于主要操作
- **Secondary**: 白底边框按钮，用于次要操作
- **Ghost**: 透明背景，用于辅助操作
- **Icon Button**: 仅图标按钮
- 状态: default/hover/active/loading/disabled

### 5.5 Feedback
- **Toast**: 顶部通知，3秒自动消失
- **Modal**: 模态框，居中显示
- **Skeleton**: 加载骨架屏
- **Empty**: 空状态展示

### 5.6 Chat
- **ChatButton**: 浮动聊天入口按钮
- **ChatWindow**: 对话窗口容器
- **ChatMessage**: 消息气泡（用户/AI）
- **ChatInput**: 输入框 + 发送按钮

### 5.7 Data Display
- **Avatar**: 用户头像
- **Badge**: 状态标签
- **Tag**: 特征标签
- **Progress**: 进度条
- **Timeline**: 时间线（审核进度）

## 6. Technical Approach

### 技术栈
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **File Storage**: S3 兼容对象存储
- **AI**: LLM SDK (豆包模型)

### 数据库设计

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  name VARCHAR(100),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user', -- user, adopter, donor, admin
  id_card_number VARCHAR(20),      -- 身份证号（领养人）
  id_card_front_url TEXT,          -- 身份证正面
  id_card_back_url TEXT,           -- 身份证背面
  address TEXT,
  bio TEXT,
  adopter_status VARCHAR(20),      -- pending, approved, rejected
  verification_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 宠物表
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50) NOT NULL,
  breed VARCHAR(100),
  age VARCHAR(50),
  gender VARCHAR(20),
  size VARCHAR(20),
  images TEXT[],                   -- 图片 URL 数组
  description TEXT,
  traits TEXT[],                   -- 特征标签
  health_status VARCHAR(100),
  vaccination_status BOOLEAN DEFAULT false,
  sterilization_status BOOLEAN DEFAULT false,
  shelter_location VARCHAR(255),
  adoption_fee DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'available', -- available, pending, adopted
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 领养申请表
CREATE TABLE adoption_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  reason TEXT,                     -- 领养理由
  living_condition TEXT,            -- 居住环境
  experience TEXT,                 -- 养宠经验
  has_other_pets BOOLEAN,
  other_pets_detail TEXT,
  documents TEXT[],                -- 证明材料 URL
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, cancelled
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 领养记录表
CREATE TABLE adoptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  application_id UUID REFERENCES adoption_applications(id),
  adoption_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active', -- active, terminated
  termination_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 宠物视频表
CREATE TABLE pet_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adoption_id UUID REFERENCES adoptions(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 视频提醒表
CREATE TABLE video_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adoption_id UUID REFERENCES adoptions(id) NOT NULL,
  due_date TIMESTAMP NOT NULL,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 捐赠项目表
CREATE TABLE donation_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_amount DECIMAL(10,2),
  current_amount DECIMAL(10,2) DEFAULT 0,
  cover_image TEXT,
  status VARCHAR(20) DEFAULT 'active',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 捐赠记录表
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES donation_campaigns(id),
  user_id UUID REFERENCES users(id) NOT NULL,
  type VARCHAR(20) NOT NULL,        -- money, goods
  amount DECIMAL(10,2),             -- 金额（如果是资金捐赠）
  goods_detail TEXT,               -- 物资详情
  goods_address TEXT,               -- 物资收货地址
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 聊天记录表
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES users(id),
  role VARCHAR(20) NOT NULL,        -- user, assistant
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_applications_status ON adoption_applications(status);
CREATE INDEX idx_applications_user ON adoption_applications(user_id);
CREATE INDEX idx_applications_pet ON adoption_applications(pet_id);
CREATE INDEX idx_adoptions_user ON adoptions(user_id);
CREATE INDEX idx_adoptions_pet ON adoptions(pet_id);
CREATE INDEX idx_videos_adoption ON pet_videos(adoption_id);
CREATE INDEX idx_videos_status ON pet_videos(status);
CREATE INDEX idx_reminders_adoption ON video_reminders(adoption_id);
CREATE INDEX idx_reminders_due ON video_reminders(due_date);
CREATE INDEX idx_donations_user ON donations(user_id);
CREATE INDEX idx_donations_campaign ON donations(campaign_id);
CREATE INDEX idx_chat_session ON chat_messages(session_id);
```

### API 设计

#### 用户相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/users/me` - 获取当前用户信息
- `PUT /api/users/me` - 更新用户信息
- `POST /api/users/me/id-verification` - 提交身份证验证

#### 宠物相关
- `GET /api/pets` - 获取宠物列表（支持筛选、分页）
- `GET /api/pets/:id` - 获取宠物详情
- `POST /api/pets` - 创建宠物（管理员）
- `PUT /api/pets/:id` - 更新宠物（管理员）
- `DELETE /api/pets/:id` - 删除宠物（管理员）

#### 领养相关
- `POST /api/adoptions/apply` - 提交领养申请
- `GET /api/adoptions/my` - 我的领养申请
- `PUT /api/adoptions/:id/review` - 审核申请（管理员）
- `GET /api/adoptions/pending` - 待审核列表（管理员）

#### 视频相关
- `POST /api/videos/upload` - 上传宠物视频
- `GET /api/videos/my` - 我的视频列表
- `PUT /api/videos/:id/review` - 审核视频（管理员）
- `GET /api/videos/pending` - 待审核视频（管理员）

#### 捐赠相关
- `GET /api/donations/campaigns` - 捐赠项目列表
- `POST /api/donations` - 提交捐赠
- `GET /api/donations/my` - 我的捐赠记录

#### 智能助理
- `POST /api/chat/recommend` - 宠物推荐
- `POST /api/chat/chat` - 对话咨询

### 文件上传
- 宠物图片: `/pets/{pet_id}/{filename}`
- 身份证照片: `/users/{user_id}/id-card/{filename}`
- 领养材料: `/applications/{app_id}/documents/{filename}`
- 宠物视频: `/adoptions/{adoption_id}/videos/{filename}`

### 安全考虑
- 所有用户输入进行验证和消毒
- 敏感操作需要身份验证
- RLS (Row Level Security) 确保数据隔离
- 视频内容由管理员人工审核

## 7. 页面清单

1. **首页** (`/`)
   - Hero + 搜索入口
   - 宠物展示网格
   - 捐赠入口
   - 小 paw 聊天入口

2. **宠物详情** (`/pets/[id]`)
   - 图片画廊
   - 宠物信息
   - 领养申请入口

3. **用户注册/登录** (`/auth/login`, `/auth/register`)
   - 表单验证
   - 验证码登录

4. **用户中心** (`/dashboard`)
   - 个人资料
   - 我的领养
   - 我的捐赠
   - 宠物视频管理

5. **领养申请** (`/adopt/[petId]`)
   - 申请表单
   - 材料上传

6. **管理员后台** (`/admin`)
   - 宠物管理
   - 领养审核
   - 视频审查
   - 用户管理
   - 数据统计

7. **捐赠页面** (`/donate`)
   - 捐赠项目
   - 在线捐赠

8. **聊天页面** (侧边栏组件)
   - 小 paw 对话界面
