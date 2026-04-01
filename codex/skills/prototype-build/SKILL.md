---
name: prototype-build
description: 当高保真设计基线文档已齐备、需要生成对外展示版或内部验收版高保真 HTML 原型时触发；不用于重新定义需求/架构、接入真实接口或实现业务代码。
---

# Skill: prototype-build — 高保真原型构建

## Purpose

根据高保真设计基线，将页面落地为高保真 HTML 原型，并支持双版本输出：

- `display`：对外展示版（去掉验收辅助区，不显式展示状态矩阵）。
- `acceptance`：内部验收版（用于 `prototype-check` 门禁检查）。

默认同时输出两版，兼顾对外展示和内部门禁。

## When to Use

- `ui-design-spec` 已产出完整设计基线文档。
- 需要把设计基线转成可浏览、可演示、交互接近真实场景的 HTML 原型。
- 需要对外展示版与内部门禁版并行交付。

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
10. 构建参数（可选）：`build_profile=display|acceptance|both`（默认 `both`）

输入降级策略：

- 设计基线缺失时，不得构建对应页面。
- 必要信息不足时标记 `【待确认】`，禁止私自扩展范围。

## Outputs

`display` 版输出（对外展示）：

1. `frontend/design-prototype/display/*.html`
2. `frontend/design-prototype/display/assets/styles.css`
3. `frontend/design-prototype/display/assets/tokens.css`
4. `frontend/design-prototype/display/assets/layout.css`
5. `frontend/design-prototype/display/assets/components.css`

`acceptance` 版输出（内部验收）：

1. `frontend/design-prototype/acceptance/*.html`
2. `frontend/design-prototype/acceptance/assets/styles.css`
3. `frontend/design-prototype/acceptance/assets/tokens.css`
4. `frontend/design-prototype/acceptance/assets/layout.css`
5. `frontend/design-prototype/acceptance/assets/components.css`

通用输出：

1. `docs/02-design/PROTOTYPE_BUILD_NOTES.md`

## Rules

1. 仅覆盖本期确认范围与 `<current-change>` 页面。
2. 必须使用 `DESIGN_TOKENS.md`、`COMPONENT_GUIDELINES.md`、`STATE_MATRIX.md` 作为设计输入。
3. 输出用于评审和前端参考，不替代生产前端工程。
4. 不得生成超出 `<current-change>` 的页面。
5. 页面必须可本地打开，且页面间静态跳转可用。
6. 必须保证统一视觉风格与组件风格。
7. 不接真实接口，不写业务实现代码。
8. `display` 版必须去掉验收辅助区，不得显式展示状态矩阵区块。
9. `acceptance` 版允许保留验收辅助信息，供 `prototype-check` 消费。
10. 交互必须接近真实场景，至少包括：
   - 菜单展示与高亮联动
   - 页面跳转与返回路径
   - 按钮可用/禁用与反馈
   - 编辑流程（打开、校验、提交、取消）
   - 弹窗流程（打开、关闭、确认、取消）
11. `display` 与 `acceptance` 两版的业务路径必须一致，不得出现流程分叉。

## Workflow

### 步骤 0：解析构建参数

- 读取 `build_profile`。
- 取值规则：
  - `display`：仅输出对外展示版
  - `acceptance`：仅输出内部验收版
  - `both` 或未指定：同时输出两版

### 步骤 1：锁定构建范围

- 从 `SCREEN_INVENTORY.md` 与 `<current-change>` 提取页面白名单。
- 排除 Out of Scope 页面。

### 步骤 2：生成样式基线

- 先生成共享样式策略（颜色/字体/间距/组件）。
- 再分别输出到 `display/assets/` 与 `acceptance/assets/`。

### 步骤 3：逐页生成 HTML

- 按页面编号生成两版 `*.html`。
- 页面结构、字段、交互元素需与 `UI_DESIGN_SPEC.md` 一致。
- `display` 版：不显示验收辅助区与显式状态矩阵内容。
- `acceptance` 版：可保留用于门禁检查的验收辅助信息。

### 步骤 4：补齐静态跳转

- 根据 `PAGE_FLOW.md` 配置页面间链接与返回路径。
- 确保主流程与异常流程可演示。
- 校验菜单、按钮、编辑、弹窗交互与真实场景一致。

### 步骤 5：记录构建说明

- 产出 `PROTOTYPE_BUILD_NOTES.md`，至少包含：
  - 构建参数与输出目录
  - display/acceptance 差异说明
  - 页面清单、资产说明、已知限制

### 步骤 6：自检

- 检查页面可打开、样式一致、交互链路完整。

## Quality Gate

- [ ] 仅生成本期范围与 `<current-change>` 页面。
- [ ] `display` 与/或 `acceptance` 输出符合 `build_profile` 约定。
- [ ] HTML 页面全部可本地打开。
- [ ] 主流程页面静态跳转可达，菜单联动正常。
- [ ] 按钮、编辑、弹窗交互可完整演示。
- [ ] 样式资产拆分完整（`tokens/layout/components/styles`）。
- [ ] `display` 版未出现验收辅助区和显式状态矩阵区块。
- [ ] 已产出 `PROTOTYPE_BUILD_NOTES.md` 并登记版本差异。

## Example

示例：会员管理系统

输入：

- 页面：`SCR-MEMBER-001` 会员列表、`SCR-MEMBER-002` 会员详情、`SCR-POINTS-001` 积分流水
- 设计系统：统一主色、状态色、表格/表单组件规范
- 范围：仅会员模块，不含营销自动化
- 参数：`build_profile=both`

输出思路：

1. 资产
- 在 `display/assets` 与 `acceptance/assets` 各生成 4 个 CSS：`tokens.css`、`layout.css`、`components.css`、`styles.css`。

2. 页面
- 两版均生成 3 个 HTML 页面，包含导航、筛选、表格、详情抽屉、编辑弹窗。
- `display` 版不展示验收辅助区；`acceptance` 版保留验收检查辅助信息。

3. 跳转
- 会员列表 -> 会员详情 -> 积分流水，支持返回列表；菜单高亮与页面保持一致。

4. 说明文档
- 在 `PROTOTYPE_BUILD_NOTES.md` 记录两版差异、页面映射、未覆盖项、后续验收重点。
