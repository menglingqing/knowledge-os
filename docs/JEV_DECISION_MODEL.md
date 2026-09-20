# Jev：System One 决策模型 —— 从「生成文字」到「输出判断」

> **日期**: 2026-09-20
> **来源**: TypeSafe AI 官方发布（2026-09-15 上线）+ 公开报道核实
> **知识类型**: AI 概念 / 技术范式
> **标签**: #AI #LLM #决策模型 #软件自动化 #TypeSafe

---

## 一、一句话定义

> **unstructured state in, typed probabilistic decisions out.**
> 非结构化状态进去，类型化概率判断出来。

Jev 是 TypeSafe AI（创始人 Diogo Almeida，前 OpenAI 研究员）发布的第一个 **System One 模型**：不做开放式文本生成，只对预先定义好的问题输出结构化判断。

---

## 二、核心命题：接口错了，不是智力不够

TypeSafe 的判断：**我们一直在用"聊天接口"承载"软件决策"。**

```
过去主流优化方向：让模型更会聊天、更会遵循指令、更让人满意
被忽略的事实：    "让人满意的回答" ≠ "让软件放心自动执行的判断"
```

LLM 生成的是 **words for people**，而软件需要的是可以直接消费的 **typed decisions**。
错配带来的旧流程：

```
信息 → LLM → 生成文字/JSON → 程序解析 → 检查格式 → 失败重试 → 执行
              （开放输出导致：不稳定 / 昂贵 / 慢 / 难控制）
```

Jev 的范式改变：

```
Prompt → Text    改造成    State → Decision
```

---

## 三、三个判断原语（Primitives）

| 原语 | 语义 | 返回 | 典型场景 |
| --- | --- | --- | --- |
| **Choice** | 从有限集合中选一个（≤255 个选项） | `choice` + 各选项概率 + `confidence` | 意图分类、Agent routing、工具选择 |
| **Score** | 在有语义定义的等级标尺上评分 | `score` + 概率分布 + `confidence` | 风险程度、严重度、质量等级 |
| **Noul** | 判断一个命题是否成立 | [0,1] 概率值（无独立 confidence） | "客户是否在要求退款？" → 0.97 |

复杂业务判断可以拆解为 `Choice + Score + Probability` 的组合。

---

## 四、可靠性设计：Calibrated Decisions

Jev 输出的不只是答案，还有**校准过的概率/置信度**，让系统可以按置信度分流：

```
高 confidence → 自动执行
中 confidence → 补充信息 / 二次模型复核
低 confidence → 人工处理
```

训练方法 **RLCD**（Reinforcement Learning for Calibrated Decisions）：
优化目标是"认知上诚实的概率"（epistemically honest），而不是 RLHF 的"人类更喜欢哪个回答"。

> **关键思想**：一个自动化 AI 最重要的不只是会判断，而是能把"不确定性"暴露给系统。

---

## 五、为什么快、为什么便宜

放弃了最贵的一件事：**逐 token 生成字符串**。非自回归，parallel sampler 一次前向完成所有问题的判断。

| 指标 | 数值（官方/早期数据） |
| --- | --- |
| 延迟 | 70–500ms（多问题并行） |
| 输入价格 | $0.042 / 百万 token，输出免费 |
| 上下文 | 64k token / 请求 |
| 输入类型 | 仅文本/JSON（无图像音频） |
| API | `POST https://api.typesafe.ai/v1/systemone`，模型别名 `jev-latest` |

⚠️ 边界：这些数字只在**它适合的判断任务**上成立，不代表 Jev 在通用 AI 任务上强于 GPT 类模型。

---

## 六、系统观：智能作为基础数据类型

TypeSafe 的野心不是"一个便宜的分类器"，而是让 intelligence 成为软件的基础数据类型：

```
boolean / integer / string / enum    →    + semantic judgment
```

```text
is_fraud(transaction)
route_request(message)
needs_review(output)
choose_agent(task)
judge_quality(result)

      ↓ 统一为

decision = AI(state)        ← "frontier-intelligence function call"
```

---

## 七、本质压缩

> **Jev 要解决的不是"AI 怎么更聪明"，而是"智能怎样才能成为软件基础设施"。**

---

## 附：相关事实与争议

- 2026-09-15 上线早期访问，发布后因需求过载短暂限流
- "Hallucination-free" 的官方含义 = **schema 一致性有保证**，不等于判断永远正确
- 有研究者（Nandakishor Mukkunnoth）主张 2025-03 论文为先验技术，并发布了开源回应项目 **Laya**

## 参考来源

- [awesome-jev (GitHub)](https://github.com/kraayenjon/awesome-jev)
- [TypeSafe Jev: the First Decision-Only Model Class, Benchmarked and Priced](https://www.developersdigest.tech/blog/typesafe-jev-system-one-models-release-guide-2026)
- [ChatGPT Co-Creator Launches TypeSafe AI With 'Jev' (VKTR)](https://www.vktr.com/ai-platforms/chatgpt-cocreator-launches-typesafe-ai-with-jev/)
- 配套公众号文章：`article-studio` 仓库 `articles/jev.md`
