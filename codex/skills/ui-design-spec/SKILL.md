---
name: ui-design-spec
description: 生成可执行 UI 设计文档与高保真 HTML 原型，支持 review-mode（偏评审）与 production-mock-mode（偏生产一致）；默认 production-mock-mode，且仅 production 模式强制衔接 prototype-check。
---

# Skill: ui-design-spec — UI 设计说明与高保真原型

## Purpose

在开发前输出可评审、可追溯、可落地的 UI 设计基线，并根据目标选择两种执行模式：

- `review-mode`：偏评审，强调信息架构、页面流转和评审沟通效率。
- `production-mock-mode`：偏生产一致，强调与需求/契约/数据模型对齐，可直接支撑前端实现。

## When to Use

- `PRD_RECTIFIED.md` 已冻结，需要进入页面设计阶段
- 需要从需求文档快速产出一版高保真 HTML 原型
- 增量需求涉及页面新增或改造

模式触发约定：

- 未显式指定 `mode` 时，默认 `production-mock-mode`
- 显式指定 `mode=review-mode` 时，走评审优先链路
- 同时出现两个模式或模式值无效时，标记 `【待确认】` 并停止输出

## Inputs

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/01-requirements/MVP_SCOPE.md`（如有）
3. `docs/02-architecture/ARCHITECTURE.md`（如有）
4. `docs/02-architecture/API_CONTRACT.md`（如有）
5. 现有设计稿/截图（如有）
6. 模式参数：`mode=review-mode | production-mock-mode`（可选）

## Outputs

按模式分目录隔离输出，避免相互覆盖。

`review-mode` 输出：

1. `docs/02-design/review/UI_DESIGN_SPEC.md`
2. `docs/02-design/review/PAGE_FLOW.md`
3. `docs/02-design/review/SCREEN_INVENTORY.md`
4. `docs/02-design/review/UI_REVIEW_CHECKLIST.md`
5. 原型（可选）：`docs/02-design/review/prototype/`

`production-mock-mode` 输出：

1. `docs/02-design/production/UI_DESIGN_SPEC.md`
2. `docs/02-design/production/PAGE_FLOW.md`
3. `docs/02-design/production/SCREEN_INVENTORY.md`
4. `docs/02-design/production/UI_REVIEW_CHECKLIST.md`
5. 原型（必选，二选一）：
   - `frontend/design-prototype/production/`（优先）
   - `docs/02-design/production/prototype/`（备用）

## Rules

- 设计必须回链需求编号，不可脱离 PRD 自行扩展核心业务
- 页面必须覆盖：正常态、空态、异常态、权限差异（如适用）
- 原型文件必须可本地打开并支持主流程跳转
- 变更内容需标记【新增】/【修改】/【删除】
- 默认只处理本次范围内页面，不做无边界全站重绘

模式差异规则：

1. `review-mode`
   - 重点：流程可评审、信息层级清晰、关键交互可解释
   - 允许使用评审导向 mock 数据与简化交互
   - `prototype-check` 为可选（建议执行）
2. `production-mock-mode`
   - 重点：字段命名、状态定义、交互路径与契约一致
   - 必须体现关键接口字段映射与异常/权限分支
   - `prototype-check` 为必选；未通过不得进入 `dev-implement`

## Steps

### 0. 解析模式与输出目录

- 读取 `mode` 参数，确定执行模式。
- 未指定 `mode` 时默认 `production-mock-mode`。
- 初始化对应输出目录：`review/` 或 `production/`。

### 1. 提取页面与流程（公共）

从 PRD 提取页面清单、关键流程、交互动作和字段，并建立需求回链。

### 2. 输出设计文档（按模式）

- `review-mode`：侧重评审可读性与流程完整性。
- `production-mock-mode`：侧重与 `API_CONTRACT.md`、`DATA_MODEL.md` 对齐的一致性说明。
- 按模式目录补齐 `UI_DESIGN_SPEC.md`、`PAGE_FLOW.md`、`SCREEN_INVENTORY.md`、`UI_REVIEW_CHECKLIST.md`。

### 3. 生成 HTML 原型（按模式）

- `review-mode`：原型可选；若输出，至少覆盖首页导航和核心流程页。
- `production-mock-mode`：原型必选；必须覆盖核心流程全链路，并体现正常态、空态、异常态、权限差异。

### 4. 一致性自检（按模式）

- [ ] 页面清单与原型文件一一对应
- [ ] 页面字段与 PRD 对齐
- [ ] 流程跳转与 PAGE_FLOW 一致
- [ ] `production-mock-mode` 下关键字段命名与接口契约一致
- [ ] `production-mock-mode` 下关键状态与数据模型约束一致

### 5. 触发原型校验

`production-mock-mode`：

- 原型产出后必须继续执行 `prototype-check`。
- 输入使用 `production/` 目录文档与对应原型目录。
- 若检查结论为阻塞，不得进入 `dev-implement`。

`review-mode`：

- `prototype-check` 为可选。
- 若当前目标仅为方案评审，可暂缓到 production 模式前统一执行。

`prototype-check` 产出文件建议：

- `docs/02-design/review/PROTOTYPE_CHECK_REPORT.md`（review）
- `docs/02-design/production/PROTOTYPE_CHECK_REPORT.md`（production）


## 注意事项

- 本 Skill 产出的是“设计稿级原型”，不是生产前端代码。
- 不在本阶段实现真实接口联调和业务状态管理。
- 若需进入开发，请优先使用 `production-mock-mode` 结果作为实现基线。
