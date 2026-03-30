---
name: ui-design-spec
description: 生成可执行 UI 设计文档与高保真 HTML 原型，并在输出后衔接 prototype-check 做防变形校验。
---

# Skill: ui-design-spec — UI 设计说明与高保真原型

## Purpose

在开发前输出可评审、可追溯、可落地的 UI 设计基线。

## When to Use

- `PRD_RECTIFIED.md` 已冻结，需要进入页面设计阶段
- 需要从需求文档快速产出一版高保真 HTML 原型
- 增量需求涉及页面新增或改造

## Inputs

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/01-requirements/MVP_SCOPE.md`（如有）
3. `docs/02-architecture/ARCHITECTURE.md`（如有）
4. `docs/02-architecture/API_CONTRACT.md`（如有）
5. 现有设计稿/截图（如有）

## Outputs

文档输出：

1. `docs/02-design/UI_DESIGN_SPEC.md`
2. `docs/02-design/PAGE_FLOW.md`
3. `docs/02-design/SCREEN_INVENTORY.md`
4. `docs/02-design/UI_REVIEW_CHECKLIST.md`

原型输出（二选一）：

1. `frontend/design-prototype/`（优先）
2. `docs/02-design/prototype/`（备用）

## Rules

- 设计必须回链需求编号，不可脱离 PRD 自行扩展核心业务
- 页面必须覆盖：正常态、空态、异常态、权限差异（如适用）
- 原型文件必须可本地打开并支持主流程跳转
- 变更内容需标记【新增】/【修改】/【删除】

## Steps

### 1. 提取页面与流程

从 PRD 提取页面清单、关键流程、交互动作和字段。

### 2. 输出设计文档

补齐 `UI_DESIGN_SPEC.md`、`PAGE_FLOW.md`、`SCREEN_INVENTORY.md`、`UI_REVIEW_CHECKLIST.md`。

### 3. 生成 HTML 原型

至少输出首页导航和核心页面；核心页面之间可互跳。

### 4. 一致性自检

- [ ] 页面清单与原型文件一一对应
- [ ] 页面字段与 PRD 对齐
- [ ] 流程跳转与 PAGE_FLOW 一致

### 5. 触发原型校验

原型产出后，必须继续执行 `prototype-check`：

- 输入：`docs/02-design/*` + 原型目录
- 输出：`docs/02-design/PROTOTYPE_CHECK_REPORT.md`

若检查结论为阻塞，不得进入 `dev-implement`。

## 注意事项

- 本 Skill 产出的是“设计稿级原型”，不是生产前端代码。
- 不在本阶段实现真实接口联调和业务状态管理。
