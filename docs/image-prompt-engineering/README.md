# 生图提示词工程 · Image Prompt Engineering

面向图像生成模型（即梦 / 可灵 / Seedream / Midjourney / SDXL）的提示词设计方法论与案例库。

核心命题：**提示词写得好不好，不是文笔问题，是系统设计能力的外化。**

## 上游审美与创作意图

- [AIGC 审美认知](../aigc-aesthetics/README.md)——自然美感、世界主导、克制与减法、尺度与存在；独立组织审美原则、概念方法与品鉴案例。
- [如何转化为创作控制](../aigc-aesthetics/methods/creative-control.md)——选定核心命题后，再进入本模块的执行方法。七层架构仅用于视觉生成执行，不作为所有审美认知的分类框架。

## 现行执行规范入口

2026-11-10 核查：执行时以 [aigc-framework 的现行源文件](https://github.com/menglingqing/aigc-framework)为准；本库保留方法讨论、历史实验与证据，不维护第二套默认输出格式。以下版本号是本次核查记录，后续版本沿原路径更新。

- 角色资产：[人物三视图 Skill v0.1.1](https://github.com/menglingqing/aigc-framework/blob/main/skills/character-three-view/SKILL.md)。
- 生图理解与交付：[七层视觉架构 v2.0](https://github.com/menglingqing/aigc-framework/blob/main/framework/seven-layers.md)用于创作理解与检查；普通生图默认使用[概念探索 v0.2](https://github.com/menglingqing/aigc-framework/blob/main/skills/concept-exploration-prompt/SKILL.md)，完整执行与按需精修使用[七段式执行 v1.3](https://github.com/menglingqing/aigc-framework/blob/main/workflow/prompt-output.md)。
- 视频交付：[视频提示词格式 v0.3](https://github.com/menglingqing/aigc-framework/blob/main/skills/video-prompt-format/SKILL.md)，保持既有三章节及分镜字段。
- 专业内容：[动作武术指导 v0.1.1](https://github.com/menglingqing/aigc-framework/blob/main/skills/action-martial-director/SKILL.md)设计攻防、镜头与动效，完整视频提示词仍由视频格式 Skill 组织。

## 方法论

- [七层视觉生成架构 v2.0](../aigc-aesthetics/methods/concept-driven-seven-layer-methodology.md)——概念与情绪、主体主次、跨层因果、视觉可信度、五项检查及街头人像两版示例；新增机制待验证。

- [7 层架构拆解法](methodology/seven-layer-architecture.md)——从“元素清单”到“关系网络”的结构化拆解
- [迭代手册：诊断、验收与预算](methodology/iteration-playbook.md)——只改一个变量的诊断法、验收分级、文字预算审计
- [模型适配](methodology/model-adaptation.md)——中文模型 vs MJ/SDXL、否定词归位、画幅、权重语法

## 实验

- [2026-11-04：概念先导 → 成图品鉴 → 七段式按需精修](experiments/2026-11-04-concept-first-two-stage-workflow.md)——综合《青笼听雨》《隔窗补月》《银色神谕》《佛眼·归枷》等正反实验；区分用户确认的创作流程与待验证的模型因果。

- [R-002：动物／观察者视角锚定法](experiments/animal-observer-viewpoint-anchoring.md)——观察者身份与栖息点间接控制机位、视距和前景的候选技法；附蝴蝶、蠕虫、乌鸦人物案例与 A/B/C 验证设计。

- [v2.0 技法库与案例验证计划](experiments/seven-layer-v2-techniques-and-validation.md)——风格／光效／情绪／真实感、九条假设、真实感 A/B 与独立案例方案；尚未实施。

- [环境人像视觉生成技法](experiments/environmental-portrait-techniques.md)——东方玄幻构图提炼的十条技法、七层对应、四组 A/B 方案与跨题材调用；单案例实践归纳，待对照验证。

- [哥特教堂神圣感人像：七层执行版](experiments/gothic-cathedral-sacred-portrait.md)——概念统一、空间与光的主次、简洁提示词及单变量迭代；尚未生成验证。

- [参考图选择性迁移](experiments/reference-image-selective-transfer.md)——Transfer + Lock、17 维度与五个控制域、三图验收及中文模板；实践归纳，待独立验证。

- [从视觉系统到生成提示词：2026-09-22](experiments/2026-09-22-visual-system-to-prompt.md)——Concept 驱动、IP 锚点、跨风格职能分工、系列固定 DNA / 开放变量与执行检查。
- [幻墨造像：视觉导演方法提纯 v1.1](experiments/huanmo-visual-direction-v1.1.md)——导演表与执行卡、镜头闭合、视觉主次与可见叙事证据

- [动态场提示法：对冲运动轴与光幕](experiments/dynamic-field-luminous-curtain.md)——从宇宙骑手迭代提炼“主体轴 × 环境轴 × 受力证据”，并记录不可命名结构与光幕三层法；单案例实践归纳，待跨题材验证。

## 治理

- [知识治理](governance.md)——晋升链路、frontmatter 约定、心跳定义
- [实验区](experiments/)——未验证的观察与假设
- [认知日志](ledger/learning-log.md)——Agent 学会了什么

## 案例库

- [64卦能量天门](cases/64-hexagram-gate/)——六轮迭代完整版本链（v1→v6），本领域种子案例
- [宇宙骑手：光幕与对冲运动场](cases/cosmic-rider-luminous-curtain/)——从产品展示感到斜向穿越感的连续迭代，沉淀光幕、运动轴、信息损失与精致感控制

版本：v1.9 · 2026-10-01
