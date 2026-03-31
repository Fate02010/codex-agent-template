---
name: prototype-build
description: 当高保真设计基线文档已齐备、需要落地 HTML 原型用于评审与开发参考时触发；不用于重新定义需求/架构、接入真实接口或实现业务代码。
---

# Skill: prototype-build — 高保真原型构建

## Purpose

根据高保真设计基线，将页面落地为可本地打开、可静态跳转、风格统一的 HTML 原型资产，供评审与前端实现参考。

## When to Use

- `ui-design-spec` 已产出完整设计基线文档。
- 需要把设计基线转成可浏览、可演示的 HTML 原型。
- 开发前需要一份稳定的视觉与交互参考物。

## When Not to Use

- 重新定义页面范围、字段和业务规则（回到 `ui-design-spec` 或上游阶段）。
- 做原型验收门禁（使用 `prototype-check`）。
- 做问题修复闭环（使用 `prototype-rectify`）。
- 接入真实后端接口或实现业务状态管理。

## Inputs

1. `docs/02-design/SCREEN_INVENTORY.md`
2. `docs/02-design/UI_DESIGN_SPEC.md`
3. `docs/02-design/PAGE_FLOW.md`
4. `docs/02-design/DESIGN_TOKENS.md`
5. `docs/02-design/COMPONENT_GUIDELINES.md`
6. `docs/02-design/STATE_MATRIX.md`
7. `docs/01-requirements/MVP_SCOPE.md`
8. `docs/01-requirements/OUT_OF_SCOPE.md`
9. current change artifact（如项目启用 OpenSpec）：`<current-change>`

输入降级策略：

- 设计基线缺失时，不得构建对应页面。
- 必要信息不足时标记 `【待确认】`，禁止私自扩展范围。

## Outputs

1. `frontend/design-prototype/*.html`
2. `frontend/design-prototype/assets/styles.css`
3. `frontend/design-prototype/assets/tokens.css`
4. `frontend/design-prototype/assets/layout.css`
5. `frontend/design-prototype/assets/components.css`
6. `docs/02-design/PROTOTYPE_BUILD_NOTES.md`

## Rules

1. 仅覆盖本期确认范围与 `<current-change>` 页面。
2. 必须使用 `DESIGN_TOKENS.md`、`COMPONENT_GUIDELINES.md`、`STATE_MATRIX.md` 作为设计输入。
3. 输出用于评审和前端参考，不替代生产前端工程。
4. 不得生成超出 `<current-change>` 的页面。
5. 页面必须可本地打开，且页面间静态跳转可用。
6. 必须保证统一视觉风格与组件风格。
7. 不接真实接口，不写业务实现代码。

## Workflow

### 步骤 1：锁定构建范围

- 从 `SCREEN_INVENTORY.md` 与 `<current-change>` 提取页面白名单。
- 排除 Out of Scope 页面。

### 步骤 2：生成样式基线

- 先生成 `assets/tokens.css`（颜色/字体/间距等）。
- 再生成 `assets/layout.css`、`assets/components.css`、`assets/styles.css`。

### 步骤 3：逐页生成 HTML

- 按页面编号生成 `*.html`。
- 页面结构、字段、交互元素需与 `UI_DESIGN_SPEC.md` 一致。

### 步骤 4：补齐静态跳转

- 根据 `PAGE_FLOW.md` 配置页面间链接与返回路径。
- 确保主流程与异常流程可演示。

### 步骤 5：记录构建说明

- 产出 `PROTOTYPE_BUILD_NOTES.md`：构建范围、页面清单、资产说明、已知限制。

### 步骤 6：自检

- 检查页面可打开、样式一致、关键状态可展示。

## Quality Gate

- [ ] 仅生成本期范围与 `<current-change>` 页面。
- [ ] HTML 页面全部可本地打开。
- [ ] 主流程页面静态跳转可达。
- [ ] 样式资产拆分完整（`tokens/layout/components/styles`）。
- [ ] 页面风格与组件规范一致，无明显漂移。
- [ ] 已产出 `PROTOTYPE_BUILD_NOTES.md` 并登记已知限制。

## Example

示例：会员管理系统

输入：

- 页面：`SCR-MEMBER-001` 会员列表、`SCR-MEMBER-002` 会员详情、`SCR-POINTS-001` 积分流水
- 设计系统：统一主色、状态色、表格/表单组件规范
- 范围：仅会员模块，不含营销自动化

输出思路：

1. 资产
- 生成 4 个 CSS：`tokens.css`、`layout.css`、`components.css`、`styles.css`。

2. 页面
- 生成 3 个 HTML 页面，包含导航、筛选、表格、详情抽屉、状态占位区。

3. 跳转
- 会员列表 -> 会员详情 -> 积分流水，支持返回列表。

4. 说明文档
- 在 `PROTOTYPE_BUILD_NOTES.md` 记录页面映射、未覆盖项、后续验收重点。
