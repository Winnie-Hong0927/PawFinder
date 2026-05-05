# PawFinder 未来规划文档

> 版本：v1.0  
> 更新时间：2025-01-13  
> 文档状态：规划中

---

## 目录

1. [文档概述](#1-文档概述)
2. [支付模块规划](#2-支付模块规划)
3. [人工智能助手模块规划](#3-人工智能助手模块规划)
4. [技术演进路线图](#4-技术演进路线图)
5. [风险评估与应对](#5-风险评估与应对)
6. [总结](#6-总结)

---

## 1. 文档概述

### 1.1 当前系统现状

PawFinder 宠物领养系统已完成基础架构搭建，实现了用户管理、宠物管理、领养申请、搜索等核心功能。本文档规划两大重要模块的未来发展方向。

```mermaid
graph LR
    subgraph "当前已实现"
        A1[用户管理]
        A2[宠物管理]
        A3[领养申请]
        A4[搜索服务]
        A5[机构管理]
    end
    
    subgraph "未来规划"
        B1[支付模块]
        B2[AI助手模块]
    end
    
    A3 -.->|需要| B1
    A4 -.->|增强| B2
    A1 -.->|增强| B2
```

### 1.2 规划目标

| 模块 | 目标 | 预期价值 |
|------|------|---------|
| **支付模块** | 实现完整的支付闭环 | 支持领养费用支付、保证金、公益捐赠 |
| **AI助手模块** | 提供智能咨询服务 | 提升用户体验、降低人工客服成本 |

---

## 2. 支付模块规划

### 2.1 功能概览

```mermaid
mindmap
  root((支付模块))
    支付方式
      支付宝
      微信支付
      银行卡
    支付场景
      领养费用
      领养保证金
      宠物用品
      公益捐赠
    核心功能
      订单创建
      支付回调
      退款处理
      对账系统
    管理功能
      支付流水
      财务报表
      风险控制
```

### 2.2 支付场景设计

```mermaid
graph TB
    subgraph "支付场景架构"
        subgraph "领养场景"
            A1[领养费用支付]
            A2[领养保证金]
            A3[疫苗费用]
        end
        
        subgraph "商城场景"
            B1[宠物用品]
            B2[宠物食品]
            B3[医疗服务]
        end
        
        subgraph "公益场景"
            C1[爱心捐赠]
            C2[救助基金]
        end
        
        subgraph "支付网关"
            PG[Payment Gateway]
        end
        
        A1 --> PG
        A2 --> PG
        A3 --> PG
        B1 --> PG
        B2 --> PG
        B3 --> PG
        C1 --> PG
        C2 --> PG
    end
```

### 2.3 支付流程时序图

```mermaid
sequenceDiagram
    autonumber
    participant U as 用户
    participant F as 前端
    participant G as Gateway
    participant OS as Order Service
    participant PS as Payment Service
    participant ALI as 支付宝
    participant WX as 微信支付
    participant DB as MySQL
    participant MQ as RabbitMQ
    participant N as 通知服务

    Note over U,N: ═════════════════════════════════════════════════════
    Note over U,N: 领养费用支付流程
    Note over U,N: ═════════════════════════════════════════════════════

    U->>F: 确认领养，发起支付
    F->>G: POST /api/order/v1/orders
    G->>OS: 创建订单
    OS->>DB: INSERT INTO orders
    OS-->>F: 返回订单号 orderNo
    
    F->>G: POST /api/payment/v1/pay
    G->>PS: 创建支付请求
    
    PS->>PS: 生成支付参数
    PS->>DB: INSERT INTO payment_transactions
    
    alt 支付宝支付
        PS->>ALI: 调用支付宝下单接口
        ALI-->>PS: 返回支付链接
        PS-->>F: 返回支付宝支付链接
        F->>U: 跳转支付宝支付页面
    else 微信支付
        PS->>WX: 调用微信统一下单
        WX-->>PS: 返回预支付ID
        PS-->>F: 返回微信支付参数
        F->>U: 唤起微信支付
    end

    Note over U,N: 用户完成支付
    
    ALI->>PS: 支付回调通知
    PS->>PS: 验签处理
    PS->>DB: UPDATE payment_transactions<br/>SET status='SUCCESS'
    PS->>MQ: 发送支付成功消息
    
    MQ->>OS: 消费消息，更新订单状态
    OS->>DB: UPDATE orders SET status='PAID'
    
    MQ->>N: 发送支付成功通知
    N->>U: 短信/站内信通知
    
    PS-->>ALI: 返回 success
    U->>F: 查看支付结果
    F->>G: GET /api/payment/v1/query/{orderNo}
    G->>PS: 查询支付状态
    PS-->>F: 返回支付结果
    F-->>U: 显示支付成功页面
```

### 2.4 订单状态流转图

```mermaid
stateDiagram-v2
    [*] --> PENDING: 创建订单
    PENDING --> PAYING: 发起支付
    PAYING --> PAID: 支付成功
    PAYING --> PAY_FAILED: 支付失败
    PAY_FAILED --> PAYING: 重新支付
    PAY_FAILED --> CANCELED: 取消订单
    PAID --> COMPLETED: 订单完成
    PAID --> REFUNDING: 申请退款
    REFUNDING --> REFUNDED: 退款成功
    REFUNDED --> COMPLETED: 退款完成
    COMPLETED --> [*]
    CANCELED --> [*]
    
    note right of PENDING: 订单已创建<br/>等待支付
    note right of PAYING: 支付处理中
    note right of PAID: 支付成功<br/>等待确认
    note right of REFUNDING: 退款处理中
```

### 2.5 数据库设计

```mermaid
erDiagram
    orders {
        varchar order_no PK "订单号"
        varchar user_id FK "用户ID"
        varchar pet_id FK "宠物ID"
        decimal total_amount "总金额"
        decimal paid_amount "实付金额"
        varchar status "订单状态"
        datetime expire_time "过期时间"
        datetime created_at "创建时间"
    }
    
    payment_transactions {
        bigint id PK "主键"
        varchar transaction_id UK "交易流水号"
        varchar order_no FK "订单号"
        varchar channel "支付渠道"
        decimal amount "支付金额"
        varchar status "支付状态"
        varchar prepay_id "预支付ID"
        datetime paid_at "支付时间"
        json extra "扩展信息"
    }
    
    refunds {
        bigint id PK "主键"
        varchar refund_no UK "退款单号"
        varchar transaction_id FK "交易流水号"
        decimal refund_amount "退款金额"
        varchar reason "退款原因"
        varchar status "退款状态"
        datetime created_at "创建时间"
    }
    
    orders ||--o{ payment_transactions : has
    payment_transactions ||--o{ refunds : has
```

### 2.6 技术架构图

```mermaid
graph TB
    subgraph "支付模块技术架构"
        subgraph "接入层"
            G1[Gateway 8080]
            G2[HTTPS/WSS]
        end
        
        subgraph "应用层"
            PS[Payment Service 8085]
            OS[Order Service 8084]
            NS[Notification Service]
        end
        
        subgraph "支付渠道"
            ALI[支付宝 SDK]
            WX[微信支付 SDK]
            UNION[银联 SDK]
        end
        
        subgraph "数据层"
            DB[(MySQL<br/>payment_db)]
            RDS[(Redis<br/>幂等性控制)]
            MQ[RabbitMQ<br/>异步消息]
        end
        
        subgraph "安全层"
            SEC1[签名验证]
            SEC2[加密存储]
            SEC3[风控规则]
        end
        
        G1 --> PS
        G1 --> OS
        PS --> ALI
        PS --> WX
        PS --> UNION
        PS --> DB
        PS --> RDS
        PS --> MQ
        PS --> SEC1
        PS --> SEC2
        PS --> SEC3
        MQ --> NS
        MQ --> OS
    end
```

### 2.7 核心功能清单

| 功能模块 | 功能点 | 优先级 | 状态 |
|---------|--------|--------|------|
| **订单管理** | 创建订单 | P0 | ✅ 已实现 |
| | 订单查询 | P0 | ✅ 已实现 |
| | 订单取消 | P0 | ✅ 已实现 |
| | 订单超时处理 | P1 | 📋 规划中 |
| **支付处理** | 支付宝支付 | P0 | ⚠️ 部分实现 |
| | 微信支付 | P1 | 📋 规划中 |
| | 支付状态查询 | P0 | ✅ 已实现 |
| | 支付回调处理 | P0 | ✅ 已实现 |
| **退款管理** | 退款申请 | P1 | 📋 规划中 |
| | 退款查询 | P1 | 📋 规划中 |
| | 退款回调 | P1 | 📋 规划中 |
| **对账系统** | 每日对账 | P2 | 📋 规划中 |
| | 差错处理 | P2 | 📋 规划中 |
| **风控系统** | 频率限制 | P1 | 📋 规划中 |
| | 异常检测 | P2 | 📋 规划中 |

---

## 3. 人工智能助手模块规划

### 3.1 功能概览

```mermaid
mindmap
  root((AI助手))
    核心能力
      多轮对话
      意图识别
      知识问答
      情感分析
    应用场景
      领养咨询
      宠物百科
      健康诊断
      行为训练
    技术架构
      大语言模型
      知识库RAG
      向量数据库
      多模态理解
    集成方式
      网页聊天
      小程序
      APP内嵌
```

### 3.2 AI助手架构设计

```mermaid
graph TB
    subgraph "AI助手系统架构"
        subgraph "用户接入层"
            WEB[Web Chat]
            APP[App SDK]
            MP[小程序]
        end
        
        subgraph "网关层"
            GW[API Gateway]
            WS[WebSocket]
        end
        
        subgraph "AI服务层"
            CS[Chat Service]
            NLU[意图识别]
            QA[问答引擎]
            EM[情感分析]
        end
        
        subgraph "LLM层"
            LLM[大语言模型<br/>GPT-4/Claude/文心]
            EMB[Embedding模型]
        end
        
        subgraph "知识库层"
            KB[知识库管理]
            VDB[(向量数据库<br/>Milvus/Pinecone)]
            ES[(Elasticsearch)]
        end
        
        subgraph "数据层"
            MYSQL[(MySQL)]
            REDIS[(Redis)]
            MINIO[(MinIO<br/>文件存储)]
        end
        
        WEB --> GW
        APP --> GW
        MP --> GW
        GW --> CS
        CS --> WS
        CS --> NLU
        CS --> QA
        CS --> EM
        NLU --> LLM
        QA --> LLM
        QA --> VDB
        QA --> ES
        LLM --> EMB
        CS --> KB
        KB --> VDB
        CS --> MYSQL
        CS --> REDIS
        CS --> MINIO
    end
```

### 3.3 对话流程时序图

```mermaid
sequenceDiagram
    autonumber
    participant U as 用户
    participant F as 前端
    participant CS as Chat Service
    participant NLU as 意图识别
    participant KB as 知识库
    participant LLM as 大语言模型
    participant VDB as 向量数据库
    participant DB as MySQL

    Note over U,DB: ═════════════════════════════════════════════════════
    Note over U,DB: AI对话流程
    Note over U,DB: ═════════════════════════════════════════════════════

    U->>F: 输入问题
    Note right of U: "我想领养一只金毛，<br/>需要什么条件？"
    
    F->>CS: WebSocket发送消息
    
    CS->>DB: 保存用户消息
    CS->>DB: 获取历史对话上下文
    
    CS->>NLU: 意图识别
    NLU->>NLU: 分析用户意图
    Note right of NLU: intent: adoption_inquiry<br/>entity: 金毛
    NLU-->>CS: 返回意图结果
    
    alt 需要知识库检索
        CS->>VDB: 向量相似度检索
        Note right of VDB: query_embedding<br/>top_k=5
        VDB-->>CS: 返回相关知识片段
        
        CS->>CS: 构建Prompt
        Note right of CS: System: 你是宠物领养助手<br/>Context: {知识库内容}<br/>User: {用户问题}
    end
    
    CS->>LLM: 发送Prompt
    LLM->>LLM: 生成回复
    Note right of LLM: 流式输出
    
    loop 流式返回
        LLM-->>CS: 返回token片段
        CS-->>F: WebSocket推送
        F-->>U: 打字机效果显示
    end
    
    CS->>DB: 保存AI回复
    CS->>DB: 更新对话历史
    
    Note over U,DB: ═════════════════════════════════════════════════════
    Note over U,DB: 多模态场景：图片理解
    Note over U,DB: ═════════════════════════════════════════════════════
    
    U->>F: 上传宠物图片
    Note right of U: "帮我看看这只狗<br/>是什么品种？"
    
    F->>CS: 上传图片 + 问题
    CS->>LLM: 多模态请求<br/>image + text
    LLM-->>CS: 图片分析结果
    CS-->>F: 返回分析结果
    F-->>U: 显示品种信息
```

### 3.4 RAG知识库架构

```mermaid
graph LR
    subgraph "RAG知识库架构"
        subgraph "数据源"
            D1[官方文档]
            D2[宠物百科]
            D3[领养指南]
            D4[常见问题FAQ]
            D5[用户手册]
        end
        
        subgraph "数据处理"
            P1[文档解析]
            P2[文本分割]
            P3[向量化]
        end
        
        subgraph "存储层"
            S1[(向量数据库<br/>Milvus)]
            S2[(全文检索<br/>Elasticsearch)]
        end
        
        subgraph "检索层"
            R1[向量检索]
            R2[关键词检索]
            R3[混合检索]
        end
        
        subgraph "生成层"
            G1[Prompt构建]
            G2[LLM生成]
            G3[答案后处理]
        end
        
        D1 --> P1
        D2 --> P1
        D3 --> P1
        D4 --> P1
        D5 --> P1
        
        P1 --> P2
        P2 --> P3
        P3 --> S1
        P2 --> S2
        
        S1 --> R1
        S2 --> R2
        R1 --> R3
        R2 --> R3
        
        R3 --> G1
        G1 --> G2
        G2 --> G3
    end
```

### 3.5 意图识别分类

```mermaid
graph TB
    subgraph "意图识别体系"
        ROOT[用户输入]
        
        ROOT --> A[领养咨询]
        ROOT --> B[宠物百科]
        ROOT --> C[健康咨询]
        ROOT --> D[行为训练]
        ROOT --> E[服务查询]
        ROOT --> F[闲聊]
        
        A --> A1[领养条件]
        A --> A2[领养流程]
        A --> A3[领养费用]
        A --> A4[宠物推荐]
        
        B --> B1[品种介绍]
        B --> B2[饲养指南]
        B --> B3[食物禁忌]
        B --> B4[日常护理]
        
        C --> C1[症状分析]
        C --> C2[用药咨询]
        C --> C3[疫苗知识]
        C --> C4[疾病预防]
        
        D --> D1[训练技巧]
        D --> D2[行为纠正]
        D --> D3[社交训练]
        
        E --> E1[订单查询]
        E --> E2[申请状态]
        E --> E3[机构查询]
        
        F --> F1[问候]
        F --> F2[感谢]
        F --> F3[再见]
    end
```

### 3.6 功能模块清单

| 模块 | 功能 | 描述 | 优先级 |
|------|------|------|--------|
| **对话管理** | 多轮对话 | 保持上下文连贯 | P0 |
| | 会话管理 | 创建、恢复、结束会话 | P0 |
| | 历史记录 | 对话历史存储和查询 | P1 |
| **意图理解** | 意图分类 | 识别用户真实需求 | P0 |
| | 实体抽取 | 提取关键信息（品种、症状等） | P0 |
| | 槽位填充 | 引导用户提供必要信息 | P1 |
| **知识问答** | FAQ问答 | 基于知识库的精准回答 | P0 |
| | 文档问答 | RAG检索增强生成 | P1 |
| | 多模态问答 | 图片+文字理解 | P2 |
| **智能推荐** | 宠物推荐 | 根据用户偏好推荐 | P1 |
| | 内容推荐 | 推荐相关文章/视频 | P2 |
| **情感分析** | 情绪识别 | 识别用户情绪状态 | P2 |
| | 智能回复 | 根据情绪调整回复风格 | P2 |

### 3.7 技术选型对比

| 技术领域 | 方案A | 方案B | 推荐 | 理由 |
|---------|-------|-------|------|------|
| **大语言模型** | OpenAI GPT-4 | 国产大模型（文心/通义） | 方案B | 国内合规、成本可控 |
| **向量数据库** | Milvus | Pinecone | Milvus | 开源、可私有部署 |
| **Embedding** | OpenAI Embedding | BGE/M3E | BGE | 中文效果更好 |
| **对话框架** | LangChain | 自研 | LangChain | 成熟稳定、生态丰富 |
| **流式输出** | SSE | WebSocket | WebSocket | 双向通信、实时性强 |

---

## 4. 技术演进路线图

### 4.1 整体规划时间线

```mermaid
gantt
    title PawFinder 技术演进路线图
    dateFormat  YYYY-MM
    axisFormat  %Y年%m月
    
    section 支付模块
    支付宝集成           :done, 2025-01, 1M
    微信支付集成         :p1, 2025-02, 1M
    退款功能             :p2, 2025-03, 1M
    对账系统             :p3, 2025-04, 1M
    
    section AI助手
    基础对话能力         :a1, 2025-02, 2M
    知识库RAG            :a2, 2025-03, 2M
    意图识别优化         :a3, 2025-04, 1M
    多模态能力           :a4, 2025-05, 2M
    
    section 基础设施
    性能优化             :i1, 2025-03, 2M
    监控告警             :i2, 2025-04, 1M
    安全加固             :i3, 2025-05, 1M
```

### 4.2 版本规划

```mermaid
graph LR
    subgraph "版本演进"
        V1[v1.0<br/>基础功能] --> V2[v2.0<br/>+支付模块]
        V2 --> V3[v2.5<br/>+AI助手]
        V3 --> V4[v3.0<br/>+多模态]
    end
    
    subgraph "v2.0 功能"
        P1[支付宝支付]
        P2[微信支付]
        P3[退款功能]
    end
    
    subgraph "v2.5 功能"
        A1[智能问答]
        A2[意图识别]
        A3[知识库]
    end
    
    subgraph "v3.0 功能"
        M1[图片理解]
        M2[语音交互]
        M3[视频分析]
    end
```

### 4.3 各阶段目标

| 阶段 | 版本 | 核心目标 | 预计完成时间 |
|------|------|---------|-------------|
| **Phase 1** | v2.0 | 支付闭环 | 2025-03 |
| **Phase 2** | v2.5 | AI助手上线 | 2025-05 |
| **Phase 3** | v3.0 | 多模态能力 | 2025-07 |

---

## 5. 风险评估与应对

### 5.1 支付模块风险

```mermaid
graph TB
    subgraph "风险矩阵"
        R1[支付安全风险<br/>影响:高 概率:中]
        R2[渠道稳定性<br/>影响:高 概率:低]
        R3[资金安全<br/>影响:高 概率:低]
        R4[用户体验<br/>影响:中 概率:中]
    end
    
    subgraph "应对措施"
        M1[多重签名验证<br/>加密传输]
        M2[多渠道备份<br/>优雅降级]
        M3[风控系统<br/>异常监控]
        M4[多种支付方式<br/>简化流程]
    end
    
    R1 --> M1
    R2 --> M2
    R3 --> M3
    R4 --> M4
```

| 风险类型 | 风险描述 | 应对措施 |
|---------|---------|---------|
| **安全风险** | 支付数据泄露 | 1. 全链路HTTPS加密<br/>2. 敏感信息脱敏存储<br/>3. PCI DSS合规 |
| **稳定性风险** | 支付渠道故障 | 1. 多渠道冗余<br/>2. 本地降级方案<br/>3. 实时监控告警 |
| **合规风险** | 支付牌照要求 | 1. 接入持牌支付机构<br/>2. 资金分账合规<br/>3. 反洗钱机制 |

### 5.2 AI助手模块风险

| 风险类型 | 风险描述 | 应对措施 |
|---------|---------|---------|
| **内容风险** | AI生成不当内容 | 1. 内容审核过滤<br/>2. 敏感词拦截<br/>3. 人工审核机制 |
| **准确性风险** | 回答错误/幻觉 | 1. RAG增强准确性<br/>2. 人工标注反馈<br/>3. 置信度阈值控制 |
| **成本风险** | LLM调用成本高 | 1. 缓存热门问答<br/>2. 小模型+大模型结合<br/>3. 请求频率限制 |
| **合规风险** | 数据隐私合规 | 1. 数据本地化存储<br/>2. 用户授权机制<br/>3. 数据脱敏处理 |

---

## 6. 总结

### 6.1 功能全景图

```mermaid
graph TB
    subgraph "PawFinder 完整功能架构"
        subgraph "现有功能"
            C1[用户管理]
            C2[宠物管理]
            C3[领养申请]
            C4[机构管理]
            C5[搜索服务]
        end
        
        subgraph "支付模块"
            P1[支付宝支付]
            P2[微信支付]
            P3[订单管理]
            P4[退款处理]
            P5[对账系统]
        end
        
        subgraph "AI助手"
            A1[智能问答]
            A2[意图识别]
            A3[知识库]
            A4[多模态]
        end
        
        C3 -.->|需要| P1
        C3 -.->|需要| P2
        C5 -.->|增强| A1
        C1 -.->|增强| A2
    end
```

### 6.2 预期收益

| 模块 | 业务价值 | 技术价值 |
|------|---------|---------|
| **支付模块** | 完善商业闭环、支持多元化收入 | 分布式事务实践、支付安全能力 |
| **AI助手** | 提升用户体验、降低客服成本 | LLM应用实践、RAG技术积累 |

### 6.3 资源需求

| 阶段 | 人力投入 | 预算预估 |
|------|---------|---------|
| **支付模块** | 2人月 | ¥50,000（支付渠道接入费） |
| **AI助手基础版** | 3人月 | ¥80,000（LLM API费用/年） |
| **AI助手进阶版** | 4人月 | ¥150,000（向量库、GPU等） |

---

## 附录

### A. 相关文档

| 文档 | 路径 | 说明 |
|------|------|------|
| 系统设计文档 | `docs/SYSTEM-DESIGN.md` | 当前系统架构设计 |
| 系统实现文档 | `docs/SYSTEM-IMPLEMENTATION.md` | 当前系统实现细节 |
| API接口文档 | `docs/API-INTERFACE.md` | 前后端接口定义 |
| 数据库设计 | `docs/DATABASE.md` | 数据库表结构设计 |

### B. 参考资料

1. [支付宝开放平台文档](https://opendocs.alipay.com/)
2. [微信支付开发文档](https://pay.weixin.qq.com/wiki/doc/apiv3/wxpay/pages/index.shtml)
3. [LangChain官方文档](https://python.langchain.com/docs/)
4. [Milvus向量数据库文档](https://milvus.io/docs)

---

> 📝 **文档维护**：本文档将随项目进展持续更新，请定期关注最新版本。
