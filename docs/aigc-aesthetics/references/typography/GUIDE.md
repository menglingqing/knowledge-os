---
status: experimental
evidence:
  - ../../cases/2026-09-26-editorial-typography.md#source
---

# 字体搭配与创作使用指南

## 后续设计的使用约定

用户希望后续设计图片、网站等产品时，主动借鉴本库，增强视觉效果。每次先选择与内容相符的气质，再决定字形、层级和版式；不要求固定使用某一种字体，也不要求把全部字体放入每个项目。

本页是设计建议，尚未通过独立任务验证。字体完整目录见 [40 种字体参考](README.md)，布局关系可结合 [海报视觉系统](../../methods/poster-system-design.md) 使用。

## 一、三层分工

| 层级 | 职责 | 示例方向 | 使用要点 |
|---|---|---|---|
| 主标题 | 定义气质与第一眼焦点 | Didot、Canela、Futura、Bebas Neue | 按主题选一种主导性格；短标题可大胆放大 |
| 正文与信息 | 保持清楚和秩序 | Helvetica Neue、Graphik、Avenir；长文可考虑 Tiempos、Caslon、Garamond 的适合正文的版本 | 结合字重、字号、行距和实际阅读尺寸判断 |
| 可选手写点缀 | 加入个人痕迹 | 圆珠笔手写、Caveat、Sacramento、SignPainter | 一句批注或落款即可；不要承担关键操作说明 |

三层是信息职责，不是必须使用三种字体。先用两种字体建立层级，确有叙事需要再加入第三种。

## 二、五组可练习的组合

以下为待实践的搭配起点，不是已完成的真实字形样张。

| 主题 | 主标题 | 信息层 | 可选点缀 | 练习重点 |
|---|---|---|---|---|
| 时装人物 | Didot | Neue Haas Grotesk | 圆珠笔手写 | 大标题与人物关系，避免细线在小尺寸消失 |
| 艺术摄影 | Instrument Serif | Graphik | 无 | 字形曲线、留白与照片边缘的关系 |
| 咖啡生活 | Recoleta | Avenir | Sacramento | 温暖字形与简洁信息层形成主次 |
| 运动活动 | DIN Condensed | Helvetica Neue | Permanent Marker | 窄体标题为主，马克笔只强调短词 |
| 建筑工作室 | Futura | Suisse International | 无 | 几何比例、不对称网格与清晰导航 |

不要随机混合所有字体。可以在同一职责的候选集合内替换，每次只改变一个变量，再比较结果。

## 三、从字体名转成视觉描述

```text
[Font Name]-inspired
+ [font category]
+ [stroke characteristics]
+ [letter proportion]
+ [era / mood]
+ [usage scene]
```

示例：

```text
Didot-inspired high-contrast fashion serif,
ultra-thin hairlines,
elegant vertical stress,
sharp refined serifs,
luxury editorial typography,
large-scale magazine headline.
```

需要约束时追加：

```text
clean readable typography,
accurate letterforms,
no distorted letters,
no decorative fantasy font.
```

名称只提供参考方向。用粗细反差、笔触、宽度、比例和用途描述字形，更便于说明创作意图；具体模型的稳定性仍需实际生成对照。

## 四、完整海报提示词

此模板采用高反差衬线主标题、瑞士无衬线信息层、可选圆珠笔批注。替换输入字段即可；更换风格时应同时改写主标题的名称与视觉特征，避免矛盾描述。

```text
Create a contemporary editorial poster using the supplied subject,
photograph if provided, and exact text.

INPUT
Subject: {{subject}}
Main headline: {{headline}}
Secondary text: {{secondary_text}}
Optional handwritten accent: {{handwritten_text}}
Aspect ratio: {{ratio}}

TEXT ACCURACY
Render only the supplied text.
Preserve spelling, capitalization, and punctuation.
Do not invent captions, labels, logos, or additional words.
If an input field is empty, omit that text layer.

1. MAIN HEADLINE — EDITORIAL SERIF
Use a coherent serif style inspired by Didot:
dramatic thick-and-thin contrast,
fine hairlines, vertical stress,
sharp refined serifs, elegant fashion-editorial presence.

Use a large headline and one dominant typographic gesture:
an oversized horizontal title,
a deliberate multiline arrangement,
or a carefully placed vertical title.
Keep all essential words readable.
Do not stretch or warp individual letters.

2. SECONDARY INFORMATION — SWISS SANS SERIF
Use a clean neo-grotesque inspired by Neue Haas Grotesk:
neutral proportions, precise spacing,
clear readable letterforms, restrained editorial character.
Make it visibly smaller than the headline,
but readable at the intended viewing size.
Align supporting text consistently.

3. OPTIONAL ACCENT — BALLPOINT-PEN HANDWRITING
If handwritten text is supplied, use a brief spontaneous annotation:
thin imperfect pen strokes, a slightly irregular baseline,
natural spacing, small variations in letter shape.
Keep it secondary and avoid elaborate calligraphic flourishes.

COMPOSITION
Treat typography and imagery as one composition.
Use deliberate asymmetry and generous negative space.
Maintain a clear focal point.
Text may frame or lightly overlap the photograph,
provided essential words and important subject details remain visible.
Use one dominant typographic gesture and keep supporting text quiet.

VISUAL DIRECTION
Contemporary independent magazine,
refined fashion editorial,
confident scale contrasts,
a limited coherent color palette,
carefully balanced image, text, and empty space.

AVOID
Distorted letters, misspelled or duplicated text,
decorative fantasy fonts, excessive flourishes,
too many font families, competing headlines,
unreadably small information, unnecessary captions,
and cluttered compositions.

FINAL CHECK
Preserve the supplied wording.
Make the hierarchy immediately clear.
Keep the headline dominant and supporting text readable.
```

提示词不保证文字准确。要求准确品牌字形或可发布文字时，先生成图像，再在排版软件或网页中添加实际文字。

## 五、用于网站与 HTML 的落地检查

- 字体名称不是字体文件。先确认可用字体、具体版本及 Web 使用授权，再定义实际字体；本库不提供商业字体二进制文件。
- 标题可以使用展示字体；导航、按钮、表单和正文优先考虑辨识度。避免细发丝线、高度压缩字形或连笔手写承担小字号关键内容。
- 中英文分别设计字体栈，比较视觉字重、字面大小与行距。英文库不能自动解决中文排版。
- 加载失败时有明确后备字体。未加载目标字体的预览必须标注为后备显示，不能作为该字体的真实样张。
- 桌面和手机都检查换行、溢出、长标题、数字与标点；文字应保持可选择，关键文字不只存在于图片中。
- 字距、行距、留白和图片构图一起调整。只更换字体名并不能保证设计改善。

## 六、结构化索引

[fonts.json](fonts.json) 包含连续编号 1–40、字体名称、创作分类、使用场景、气质分组、建议职责、英文提示词和备注。`reference_type` 区分字体名称参考与纯风格方向；`license_status: not_verified` 表示未核实具体产品授权，不能推导为免费或可商用。

该索引便于后续建立筛选、提示词复制和学习卡片，目前未接入应用界面，也不包含字体加载地址。

## 七、练习与复盘

1. 固定一张图片、一套文字和一个版式。
2. 对比高反差衬线、几何无衬线、工业窄体三种标题方向。
3. 先只换标题字体，记录性格和可读性的变化；随后再单独调整字距或比例。
4. 分别检查手机尺寸与完整画面，记录主次、字形准确性和中英文协调性。
5. 保存真实输入、输出与用户反馈。AI 生图即使固定提示词仍可能改变其他因素，不能把所有差异都归因于字体。

只有形成独立任务的对照结果，才按照仓库治理规则讨论验证与晋升。本次材料整理不计为生成实验。
