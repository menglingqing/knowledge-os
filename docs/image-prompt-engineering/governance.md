---
status: validated
evidence:
  - cases/64-hexagram-gate/
---

# 知识治理 · Governance

本领域知识的晋升、验证与更新规则。

## 核心原则

1. 知识不是"记下来"，而是经历版本晋升。
2. Agent 可以提出知识，但不能批准自己的知识——晋升由人类建筑师裁决。
3. 没人维护的元数据比没有元数据更糟——frontmatter 保持最小集。

## 晋升链路

一次生成经验 → `experiments/`（status: experimental）→ 验证 → `methodology/` 或案例改动说明（status: validated）。

**validated 的判定（≥3 是必要条件，不是充分条件）：**

- ≥3 个独立案例验证
- 没有足以推翻该规律的明显反例
- evidence 可追溯（链接到具体案例文件）

**独立案例**：指具有独立生成任务、输入条件或验证场景的案例；同一项目的连续迭代默认视为一个案例，除非验证变量与场景明确独立。

## frontmatter 约定（最小集）

```yaml
---
status: experimental | validated
evidence:
  - 案例文件相对链接
---
```

不加 confidence / evidence_count / last_verified——evidence 链接本身就是计数，日期由 git 管理。

## 心跳（Knowledge Review Pipeline）

定期复盘是自动化任务，不写入任何 prompt：

1. 收集近期新增案例与实验
2. 找出重复出现的规律与冲突
3. 生成晋升建议（diff / PR），人类 review 后合并

当前单人仓库，PR 流程在多贡献者出现时启用；现阶段核心机制是 status 字段 + learning-log。

## 双日志

- `git log` = 工程历史（文件发生了什么）
- `ledger/learning-log.md` = 认知历史（学会了什么），每条 ≤50 字核心经验
