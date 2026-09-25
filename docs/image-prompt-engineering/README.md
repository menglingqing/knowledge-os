# 生图提示词工程 · Image Prompt Engineering

面向图像生成模型（即梦 / 可灵 / Seedream / Midjourney / SDXL）的提示词设计方法论与案例库。

核心命题：**提示词写得好不好，不是文笔问题，是系统设计能力的外化。**

## 上游审美与创作意图

- [AIGC 审美认知](../aigc-aesthetics/README.md)——自然美感、世界主导、克制与减法、尺度与存在；独立组织审美原则、概念方法与品鉴案例。
- [如何转化为创作控制](../aigc-aesthetics/methods/creative-control.md)——选定核心命题后，再进入本模块的执行方法。七层架构仅用于视觉生成执行，不作为所有审美认知的分类框架。

## 方法论

- [7 层架构拆解法](methodology/seven-layer-architecture.md)——从“元素清单”到“关系网络”的结构化拆解
- [迭代手册：诊断、验收与预算](methodology/iteration-playbook.md)——只改一个变量的诊断法、验收分级、文字预算审计
- [模型适配](methodology/model-adaptation.md)——中文模型 vs MJ/SDXL、否定词归位、画幅、权重语法

## 实验

- [哥特教堂神圣感人像：七层执行版](experiments/gothic-cathedral-sacred-portrait.md)——概念统一、空间与光的主次、简洁提示词及单变量迭代；尚未生成验证。

- [参考图选择性迁移](experiments/reference-image-selective-transfer.md)——Transfer + Lock、17 维度与五个控制域、三图验收及中文模板；实践归纳，待独立验证。

- [从视觉系统到生成提示词：2026-09-22](experiments/2026-09-22-visual-system-to-prompt.md)——Concept 驱动、IP 锚点、跨风格职能分工、系列固定 DNA / 开放变量与执行检查。
- [幻墨造像：视觉导演方法提纯 v1.1](experiments/huanmo-visual-direction-v1.1.md)——导演表与执行卡、镜头闭合、视觉主次与可见叙事证据

## 治理

- [知识治理](governance.md)——晋升链路、frontmatter 约定、心跳定义
- [实验区](experiments/)——未验证的观察与假设
- [认知日志](ledger/learning-log.md)——Agent 学会了什么

## 案例库

- [64卦能量天门](cases/64-hexagram-gate/)——六轮迭代完整版本链（v1→v6），本领域种子案例

版本：v1.7 · 2026-09-25
