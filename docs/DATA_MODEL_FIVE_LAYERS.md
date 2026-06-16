# 五层爆款图谱 · 完整数据模型

> **日期**: 2026-06-16
> **目的**: 每一层存什么字段、数据从哪取、什么时候更新

---

## 总览：五层的数据依赖关系

```
CRM/ERP/气象/第三方
        ↓
   ┌────────────────────────────────────────────┐
   │              原始数据层（ODS）               │
   │  订单 · 退货 · 会员 · 商品档案 · 天气 · 竞品  │
   └────────────────────────────────────────────┘
        ↓  ETL / 实时流
   ┌────────────────────────────────────────────┐
   │              计算与推理层                    │
   │                                             │
   │  ② 约束权重计算                              │
   │  ③ 候选基因推理引擎                          │
   │  ④ 证据匹配 & 基因交集                       │
   │  ⑤ 场域满足度 & 优先级评分                    │
   │  ① 场域快照（⑤ 的回灌）                      │
   └────────────────────────────────────────────┘
        ↓
   ┌────────────────────────────────────────────┐
   │              展示层（图谱 UI）               │
   └────────────────────────────────────────────┘
```

---

## 第①层：场域中心

**本质**：一个场景 × 目标 × 客群的交叉点。是系统中最稳定的实体。场域由品牌战略部定义，数据层由 CRM 和信号层回灌填充。

### 数据表：`field_definition`

| 字段 | 类型 | 来源 | 更新触发 | 频率 |
| --- | --- | --- | --- | --- |
| `field_id` | PK | 系统生成 | 场域新建 | 一次性 |
| `scene_line` | ENUM(行走线, 觅寻线, 上班通勤, …) | 品牌战略部人工定义 | 品牌战略调整 | 年 |
| `scene_subtype` | VARCHAR | 同上 | 同上 | 年 |
| `goal_type` | VARCHAR (轻社交/通勤/出行/…) | 同上 | 同上 | 年 |
| `season` | VARCHAR (春季/早春/夏季/早秋/秋季/冬季) | 商品企划日历 | 按日历自动切换 | 季 |
| `region` | VARCHAR (长江以南/华北/华南/…) | 品牌战略部定义 | 战略调整 | 年 |
| `target_age_range` | VARCHAR (25-30/30-35/35-40/…) | 品牌战略部定义 + CRM 客群画像校准 | 战略调整 | 季 |
| `target_body_type` | VARCHAR (梨形/H型/苹果型/…) | CRM 尺码分布 + 退换货体型标签 NLP | 自动更新 | 季 |
| `active_vip_count` | INT | CRM `member_profile` 表，WHERE 购买记录在近12月 AND 该场域商品 | 自动更新 | 周 |
| `satisfaction_score` | DECIMAL(3,1) | ⑤ `field_satisfaction` 表回灌 | 自动更新 | 周 |
| `core_problem` | TEXT | ⑤ `pain_point` 表取 TOP 1 | 自动更新 | 季 |
| `external_flow_brand` | VARCHAR | ⑤ `competitor_capture` 表取 TOP 1 | 自动更新 | 季 |
| `external_flow_rate` | DECIMAL(3,1) | 同上 | 自动更新 | 季 |
| `created_at` | TIMESTAMP | 系统 | 新建 | 一次性 |
| `updated_at` | TIMESTAMP | 系统 | 任何子表更新 | 实时 |

### 数据回流路径

```
CRM 会员画像变化 → active_vip_count 重算
⑤ 场域满足度刷新 → satisfaction_score 回灌
⑤ 失分点排序变化 → core_problem 更新
⑤ 竞品截获率变化 → external_flow_* 更新
```

---

## 第②层：约束环

**本质**：场域中必须同时成立的客观条件。分物理/社会/身体三类。约束本身稳定，但**权重**随市场反馈动态调整。

### 数据表：`constraint_def`

| 字段 | 类型 | 来源 | 更新触发 | 频率 |
| --- | --- | --- | --- | --- |
| `constraint_id` | PK | 系统生成 | 新建 | 一次性 |
| `field_id` | FK → ① | 关联场域 | 场域新建 | 一次性 |
| `category` | ENUM(物理, 社会, 身体) | 领域专家录入 | 新类型发现 | 年 |
| `constraint_name` | VARCHAR | 领域专家 + NLP 发现 | 新约束发现 | 季 |
| `description` | TEXT | 领域专家 | 录入 | 一次性 |
| `weight` | DECIMAL(2,1) 1-10 | 初始：专家赋值；后续：NLP 反馈校准 | 退货/评论 NLP 检测到关联 | 季 |
| `weight_confidence` | DECIMAL(3,2) 0-1 | 该权重被市场数据验证的次数 | 每次回流校准 | 季 |
| `data_source` | ENUM(专家, CRM_NLP, 天气API, 尺码统计) | 系统标注 | — | 不变 |
| `source_evidence` | TEXT (如: "退货原因'太薄'聚类, 样本量 N=342") | 回流数据自动写回 | 每次权重更新 | 季 |
| `status` | ENUM(active, deprecated, new_discovered) | 系统 | 权重置信度 < 0.3 超过 2 季 → deprecated | 季 |

### 三类约束的具体数据来源

**物理约束**

| 约束示例 | 数据来源 | 取数方式 |
| --- | --- | --- |
| 温度范围 12-22°C | 中国气象局历史数据 + 商品上市日历 | API / 离线导入 |
| 全天穿着 ≈ 6h | 商品企划的场景定义 | 人工录入 |
| 不起静电 | 退货 NLP 聚类 "静电" | 季末批量 NLP |
| 透气不闷 | 退货 NLP 聚类 "闷""不透气" | 季末批量 NLP |

**社会约束**

| 约束示例 | 数据来源 | 取数方式 |
| --- | --- | --- |
| 随意但不随便 | 设计师/造型师访谈 → 结构化录入 | 季初人工 |
| 被记住不被议论 | 客服反馈 NLP + 试穿放弃 NLP | 季末 NLP |
| 质感不显年龄 | 退货原因 NLP "显老""廉价感" | 季末 NLP |

**身体约束**

| 约束示例 | 数据来源 | 取数方式 |
| --- | --- | --- |
| 遮腰腹/大腿 | CRM 会员尺码分布 + 退换货"显胖" | 统计 + NLP |
| 收而不紧 | 试衣间放弃率 + 退换货"太紧""太松" | 统计 |
| 露锁骨/手腕 | 设计师经验 → 录入 | 人工 |

### 数据回流路径

```
商品上市 → 销售/退货数据产生
    ↓
退货原因 NLP 聚类
    ↓
匹配到对应 constraint_id
    ↓
weight 调整 + source_evidence 写回
    ↓
weight_confidence 更新（被验证次数+1）
    ↓
新 NLP 聚类未匹配 → 候选新约束 → 人工审核 → constraint_def 新增行
```

### 关键设计：约束发现

```
SELECT
  return_reason,
  COUNT(*) as cnt
FROM erp_returns
WHERE field_id = 'F003'
  AND return_date > CURRENT_SEASON_START
  AND return_reason NOT IN (已知约束关联词)
GROUP BY return_reason
ORDER BY cnt DESC
LIMIT 5;
-- 如果某未匹配关键词连续两季出现在 TOP 5 → 触发人工审核 → 可能成为新约束
```

---

## 第③层：候选基因环

**本质**：约束 → 商品属性的逻辑翻译。是系统中**唯一以推理合成为主**的数据层。所有候选基因必须可追溯到约束。

### 数据表：`candidate_gene`

| 字段 | 类型 | 来源 | 更新触发 | 频率 |
| --- | --- | --- | --- | --- |
| `candidate_id` | PK | 系统生成 | 新建 | 一次性 |
| `field_id` | FK → ① | 关联场域 | — | — |
| `gene_category` | ENUM(面料, 版型, 颜色, 设计元素) | 推理引擎分类 | — | — |
| `gene_name` | VARCHAR | 推理引擎：知识图谱匹配 | 约束变化 | 季 |
| `gene_score` | DECIMAL(3,1) | 初始：多约束同时满足度 × 历史场域表现；后续：④ 验证数据校准 | 约束权重变化 / 市场验证 | 季 |
| `score_confidence_interval` | VARCHAR (如: "91 ± 8") | 标准差计算 | 校准次数 ↑ → 区间收窄 | 季 |
| `derived_from_constraints` | JSON [constraint_id, …] | 推理链路记录 | — | 不变 |
| `reasoning_trace` | TEXT (如: "因约束 C1(12-22°C) 排除薄料; 约束 C2(久坐不皱) 排除纯棉; 约束 C6(收而不紧) 要求垂感; 交集 = 天丝混纺") | 推理引擎自动生成 | — | 不变 |
| `market_validation_count` | INT | ④ 证据层匹配次数 | 新证据产生 | 季 |
| `market_performance_delta` | DECIMAL(3,1) | 预测分 vs 实际市场表现均值 | 季末校准 | 季 |
| `supply_chain_available` | BOOLEAN | 供应链系统 | 供应商变更 | 季 |

### 推理引擎逻辑（知识图谱）

```
输入：field_id → 该场域的所有 active 约束 (含权重)
      ↓
规则引擎（知识图谱）：
  ┌─ 面料知识库 ─────────────────────┐
  │ 天丝混纺 = {                       │
  │   适应温度: [10, 25],              │
  │   抗皱等级: 4/5,                   │
  │   垂感等级: 4/5,                   │
  │   透气等级: 4/5,                   │
  │   厚度等级: 2/5,  ← 排除 ＜3 的约束│
  │   静电风险: low,                   │
  │   适用场景: [通勤, 轻社交, 日常],   │
  │   不适用: [户外, 运动]             │
  │ }                                 │
  └───────────────────────────────────┘
        ↓
  与约束条件做多维度匹配
        ↓
  满足所有约束 → score = 同时满足度 × 历史场域表现分
  有任何一项不满足 → 排除
        ↓
输出：候选基因列表 + reasoning_trace
```

| 知识库 | 数据来源 | 维护方式 |
| --- | --- | --- |
| 面料属性库 | 面料供应商参数 + 实验室测试 + 历史退货关联 | 半自动 |
| 版型-体型适配库 | 设计师经验 + CRM 尺码/退货关联 | 人工 + 统计校准 |
| 色域-场景-肤色库 | 色彩理论 + 历史销售色域×场域关联 | 统计学习 |
| 设计元素-场景库 | 设计师经验 + 竞品分析 | 人工 + NLP |

### 数据回流路径

```
④ 证据环发现"天丝混纺"在市场中被验证 N 次
    ↓
market_validation_count += N
    ↓
market_performance_delta = 预测 score - 实际表现均值
    ↓
score 校准：91 → 94 (表现超预期) 或 91 → 85 (预测过乐观)
    ↓
score_confidence_interval 收窄：±8 → ±4 (因为验证样本增加)
```

---

## 第④层：商品证据环

**本质**：市场上已经发生的事实。自有商品 + 竞品。是全系统唯一直接连接"真实世界交易"的数据层。

### 数据表：`product_evidence`

| 字段 | 类型 | 来源 | 更新触发 | 频率 |
| --- | --- | --- | --- | --- |
| `evidence_id` | PK | 系统生成 | — | — |
| `field_id` | FK → ① | 场域标签匹配 | — | — |
| `product_type` | ENUM(自有, 竞品) | 录入来源 | — | 不变 |
| `brand_name` | VARCHAR | 自有=ERP; 竞品=第三方/人工 | — | 不变 |
| `product_sku` | VARCHAR | ERP / 人工 | 新品上市 | 季 |
| `product_name` | VARCHAR | ERP / 人工 | — | 季 |
| `category` | VARCHAR (外套/裤/裙/上衣/…) | 商品档案 | — | 不变 |
| `season` | VARCHAR | 商品档案 | — | 季 |
| `sales_volume` | INT | 自有=ERP; 竞品=第三方估算 | 日/周 | 周 |
| `repurchase_rate` | DECIMAL(3,1) | CRM 同款/同品类复购 | 滚动 12 月 | 月 |
| `return_rate` | DECIMAL(3,1) | ERP 退货 | 滚动 12 月 | 月 |
| `vip_capture_rate` | DECIMAL(3,1) | 自有=NULL; 竞品=流失 VIP 在该竞品消费推断 | 季度模型 | 季 |

### 数据表：`evidence_gene_match`

| 字段 | 类型 | 来源 | 更新触发 | 频率 |
| --- | --- | --- | --- | --- |
| `match_id` | PK | 系统生成 | — | — |
| `evidence_id` | FK → ④ | — | — | — |
| `candidate_gene_id` | FK → ③ | 匹配算法 | 商品档案更新 | 季 |
| `match_status` | ENUM(confirmed, inferred, manual) | 自有=商品档案标签匹配 confirmed; 竞品=图像识别+人工 inferred | 人审 | 季 |
| `match_score` | DECIMAL(3,1) | 该基因在本商品中的显著度 | 算法 | 季 |

### 数据表：`gene_intersection_family`

| 字段 | 类型 | 来源 | 更新触发 | 频率 |
| --- | --- | --- | --- | --- |
| `family_id` | PK | 系统生成 | 新交集发现 | 季 |
| `field_id` | FK → ① | — | — | — |
| `shared_gene_ids` | JSON [candidate_gene_id, …] | ④ evidence_gene_match 交集计算 | 新证据/旧证据过期 | 季 |
| `shared_gene_names` | JSON [gene_name, …] | 同上 | 同上 | 季 |
| `evidence_count` | INT | 多少个不同产品共享此交集 | 同上 | 季 |
| `confidence_level` | ENUM(偶然, 规律, 法则) | evidence_count=1→偶然; ≥2→规律; ≥5+跨品牌→法则 | 同上 | 季 |

### 基因交集算法

```
SELECT
  candidate_gene_id,
  COUNT(DISTINCT evidence_id) as product_count,
  COUNT(DISTINCT brand_name) as brand_count
FROM evidence_gene_match
WHERE evidence_id IN (该场域的 active 证据)
GROUP BY candidate_gene_id
HAVING product_count >= 2;

-- product_count ≥ 2 且 brand_count ≥ 2 → 跨品牌验证 → 场域法则
-- product_count ≥ 2 但 brand_count = 1 → 单品牌验证 → 有待跨品牌观察
```

### 竞品数据获取

| 数据类型 | 获取方式 | 可信度 |
| --- | --- | --- |
| 竞品款式/品类 | 第三方情报平台（如知衣、魔镜）+ 电商公开数据 | 中高 |
| 竞品面料/版型推测 | 图像识别 + 电商详情页 NLP 提取 | 中（标注 inferred） |
| 竞品销量估算 | 电商平台月销/评价数推算 | 中低（标注估算） |
| 竞品客群画像 | 来自 CRM：Xmoom VIP 中同时购买/浏览竞品的人 | 中（算法推断） |
| 竞品截获率 | CRM 流失 VIP × 该 VIP 在竞品消费概率模型 | 低（标注不确定性·模型推算） |

---

## 第⑤层：信号环

**本质**：①~④ 的汇总与商业翻译。不产生新数据，只对现有数据做加权聚合与优先级排序。

### 数据表：`field_satisfaction`

| 字段 | 类型 | 来源 | 计算逻辑 | 频率 |
| --- | --- | --- | --- | --- |
| `field_id` | FK → ① | — | — | — |
| `overall_score` | DECIMAL(3,1) 1-10 | 计算 | Σ(约束权重 × 基因覆盖度) / Σ(约束权重) × 10，再以实际复购率校准 | 周 |
| `score_trend` | ENUM(提升, 持平, 下降) | 计算 | 连续 N 季 score 变化方向 | 季 |
| `consecutive_no_improve` | INT | 计算 | 连续未提升季度数 | 季 |

### 数据表：`pain_point`

| 字段 | 类型 | 来源 | 计算逻辑 | 频率 |
| --- | --- | --- | --- | --- |
| `field_id` | FK → ① | — | — | — |
| `constraint_id` | FK → ② | 匹配 | 高权重约束 ∩ 低覆盖基因 = 失分 | 周 |
| `severity` | DECIMAL(3,1) | 计算 | 约束权重 × (1 - 基因覆盖率) | 周 |
| `evidence` | TEXT | ⑤ 回流 | "退货率 23%""投诉高频词"等 | 季 |

### 数据表：`competitor_capture`

| 字段 | 类型 | 来源 | 计算逻辑 | 频率 |
| --- | --- | --- | --- | --- |
| `field_id` | FK → ① | — | — | — |
| `competitor_brand` | VARCHAR | ④ 竞品证据 | — | — |
| `captured_vip_rate` | DECIMAL(3,1) | CRM 流失模型 | 近 12 月未复购 VIP ∩ 该竞品消费推断 / 该场域总 VIP | 季 |
| `captured_category` | VARCHAR | ④ | 被截获的品类 | 季 |
| `key_genes_captured` | JSON | ④ 基因交集 | 竞品证据中覆盖度最高、Xmoom 证据中缺失的基因 | 季 |

### 数据表：`field_priority`

| 字段 | 类型 | 来源 | 计算逻辑 | 频率 |
| --- | --- | --- | --- | --- |
| `field_id` | FK → ① | — | — | — |
| `priority_score` | DECIMAL(3,1) | 多因素加权 | active_vip_count × satisfaction_gap × competitor_validation × self_capability | 周 |
| `stars` | INT 1-5 | 分档 | priority_score 百分位分档 | 周 |
| `recommendation` | TEXT | 规则生成 | if priority ≥ 4.5 → "最高优先·建议本季投入" | 周 |

### 优先级计算公式

```
priority_score =
    active_vip_count_normalized    (VIP 规模，越大越优先)
  × (10 - satisfaction_score)     (满足度缺口，缺口越大越优先)
  × competitor_validation_factor  (竞品已验证 ≥ 1 个爆款 → 1.5, 否则 1.0)
  × self_capability_factor        (自有基因可复用 → 1.3, 否则 0.8)
```

---

## 全链路数据刷新周期

| 数据层 | 实时 | 日 | 周 | 月 | 季 |
| --- | --- | --- | --- | --- | --- |
| CRM VIP 数 | | | ✓ | | |
| ERP 订单/退货 | | ✓ | | | |
| 天气数据 | | | | | ✓ |
| 约束权重 | | | | | ✓ |
| 候选基因推理 | | | | | ✓ |
| 候选基因得分校准 | | | | | ✓ |
| 证据-基因匹配 | | | | | ✓ |
| 基因交集计算 | | | | | ✓ |
| 竞品情报 | | | | ✓ | |
| 场域满足度 | | | ✓ | | |
| 失分点排序 | | | ✓ | | |
| 优先级评分 | | | ✓ | | |
| 场域中心快照 | | | ✓ | | |

---

> **关联文档**: [[FIVE_LAYER_JOBS_ANALYSIS]] [[FIELD_DRIVEN_PRODUCT_MAP]]
