# Claude Code 踩坑：第三方模型读 PDF 导致 400，会话「历史带毒」卡死

> **日期**: 2026-09-20
> **来源**: 个人网站 session 实战排障（session 2d5a2b5b，83MB jsonl）
> **知识类型**: AI 工作流 / 工具链踩坑
> **标签**: #ClaudeCode #LLM #API #多模态 #排障方法

---

## 一、现象

会话中持续报错：

```
API Error: 400 Invalid request Error
```

且每一轮都报、重试无效——**不是上下文满了**（当时输入仅约 7 万 tokens），而是会话被一条「有毒」的历史记录卡死。

## 二、根因

1. 会话中 Claude 用 Read 工具直接读了一份 PDF（187.5KB），PDF 以 `document` 内容块（base64）进入消息历史。
2. 当前模型是 `k3-256k`（第三方接入），其后端**不支持 PDF document 块**，下一轮请求被 API 拒掉 → 400。
3. **关键机制：历史带毒会每轮重放**。document 块留在会话历史里，之后每个请求都携带它重发，所以永久报错，`/compact` 也救不了（压缩本身也要走同一个 API）。

## 三、可迁移的规律

- **多模态内容块（document / image）的兼容性取决于后端模型，不取决于客户端。** 第三方接入模型对 Anthropic 内容块类型的支持常有缺口，官方模型能读不代表网关模型能读。
- **工具把二进制文件读进历史 = 不可逆注入。** 一旦后端不认，毒就在历史里，此后每轮重放。读非文本文件前先确认模型支持该块类型。
- **报错后先查会话 jsonl 定位触发点，别猜。** 路径：`~/.claude/projects/<cwd-slug>/<session-id>.jsonl`，搜 `"apiErrorStatus":400`，检查报错时间戳之前的最后一条 tool_result——元凶通常在那里。

## 四、修复（会话抢救）

编辑 session jsonl，把所有 `type: "document"` 块原地替换为占位文本（不能整条删除，否则 tool_use/tool_result 配对断裂，会话结构损坏）：

```python
# 递归遍历每行 JSON，替换 {'type':'document','source':...} 为
# {'type':'text','text':'[PDF 内容已移除]'}，其余原样保留
```

实操注意：

- 先备份（`cp file.jsonl file.jsonl.bak`）。
- 修改前关闭该 session 的终端窗口，避免运行中写入新记录。
- Claude Code 的权限系统会拦截「改 session transcript」类操作（防篡改机制），需用户亲自执行脚本。
- 修完用 `claude --resume` 恢复原会话即可。

## 五、预防

- 读 PDF 先转文本，再让模型读文本：

```bash
pdftotext 文件.pdf -        # 直接输出文本
```

- 图片同理：第三方模型对 image 块的支持也要先验证（本机 k3-256k 实测 image 块可用，document 块不可用）。
