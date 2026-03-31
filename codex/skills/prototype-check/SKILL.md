---
name: prototype-check
description: 当高保真原型已构建、需要在开发前执行原型验收门禁并判断是否允许进入 dev-implement 时触发；不用于生成原型、修复原型或替代功能测试执行。
---

# Skill: prototype-check — 原型验收门禁

## Purpose

对高保真原型执行开发前验收门禁，检查视觉质量、页面流质量、状态质量与范围一致性，并给出是否允许进入 `dev-implement` 的明确建议。

## When to Use

- `prototype-build` 已输出原型，准备进入开发前验收。
- 增量迭代中页面改造完成，需要判断是否可进入实现。
- 需要基于需求/设计/契约对原型做结构化差异审查。

## When Not to Use

- 生成或更新 HTML/CSS 原型（使用 `prototype-build` / `prototype-rectify`）。
- 编写 UI 设计基线（使用 `ui-design-spec`）。
- 替代功能测试执行、性能压测或接口联调。

## Inputs

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/01-requirements/MVP_SCOPE.md`
3. `docs/01-requirements/OUT_OF_SCOPE.md`
4. `docs/02-design/UI_DESIGN_SPEC.md`
5. `docs/02-design/SCREEN_INVENTORY.md`
6. `docs/02-design/PAGE_FLOW.md`
7. `docs/02-design/DESIGN_TOKENS.md`
8. `docs/02-design/COMPONENT_GUIDELINES.md`
9. `docs/02-design/STATE_MATRIX.md`
10. `docs/02-architecture/API_CONTRACT.md`
11. `frontend/design-prototype/*.html`
12. `frontend/design-prototype/assets/*.css`
13. current change artifact（如项目启用 OpenSpec）：`<current-change>`

输入降级策略：

- 缺失关键输入时继续输出报告，但必须标记 `【待确认】` 并说明对门禁结论的影响。

## Outputs

1. `docs/02-design/PROTOTYPE_CHECK_REPORT.md`

报告必须包含：

- 门禁结论（是否允许进入 `dev-implement`）
- 问题分级统计（阻塞/重要/建议）
- 问题明细与修复建议

## Rules

1. 默认只检查本次范围与 `<current-change>`，不做无边界全站巡检。
2. 问题级别固定为：`阻塞`、`重要`、`建议`。
3. 每条问题必须包含以下字段：
   - 问题编号
   - 问题级别
   - 问题类型
   - 页面编号/页面名称
   - 问题描述
   - 影响
   - 建议修复
   - 是否阻塞进入 `dev-implement`
4. 重点检查维度：
   - 视觉一致性（token/组件风格）
   - 页面流与跳转完整性
   - 状态覆盖完整性
   - 范围一致性（MVP 与 current change）
   - 契约一致性（关键字段与 API 展示口径）
5. 无法确认的信息必须标记 `【待确认】`。
6. 基于上下文推断的结论必须标记 `【推断】`。
7. 不得仅以“HTML 可打开”作为通过依据。

## Workflow

### 步骤 1：建立验收边界

- 读取 MVP、Out of Scope、`<current-change>`，确定检查范围页面。
- 以 `SCREEN_INVENTORY.md` 作为页面主清单。

### 步骤 2：执行四类核心检查

1. 视觉质量检查：对齐 `DESIGN_TOKENS.md` 与 `COMPONENT_GUIDELINES.md`。
2. 页面流质量检查：对齐 `PAGE_FLOW.md`，检查主流程与异常回路。
3. 状态质量检查：对齐 `STATE_MATRIX.md`，核对 9 类状态落地。
4. 范围一致性检查：核对是否超出 `MVP_SCOPE.md` 与 `<current-change>`。

### 步骤 3：执行契约一致性抽检

- 对关键页面字段展示与 `API_CONTRACT.md` 做一致性抽检。
- 标记“页面口径与契约口径不一致”问题。

### 步骤 4：输出问题清单

- 按 `阻塞 > 重要 > 建议` 顺序整理问题。
- 每条问题按固定字段落盘。

### 步骤 5：输出门禁结论

- 生成 `PROTOTYPE_CHECK_REPORT.md`。
- 明确写出：
  - 是否允许进入 `dev-implement`（是/否）
  - 建议下一步（进入开发 / 执行 `prototype-rectify`）

## Quality Gate

- [ ] 已输出 `PROTOTYPE_CHECK_REPORT.md` 且问题字段完整。
- [ ] 原型与 `UI_DESIGN_SPEC.md`、`PAGE_FLOW.md`、`SCREEN_INVENTORY.md` 一致。
- [ ] 原型状态覆盖与 `STATE_MATRIX.md` 一致。
- [ ] 原型视觉规范与 `DESIGN_TOKENS.md`、`COMPONENT_GUIDELINES.md` 一致。
- [ ] 原型未超出 `MVP_SCOPE.md` 与 `<current-change>`。
- [ ] 无阻塞项才建议进入 `dev-implement`。

## Example

示例：会员管理系统

输入：

- 范围：会员列表、会员详情、积分流水页面
- 资产：3 个 HTML 页面 + 4 份 CSS 资产
- 设计基线：`UI_DESIGN_SPEC.md` / `PAGE_FLOW.md` / `STATE_MATRIX.md`

输出思路（`PROTOTYPE_CHECK_REPORT.md`）：

1. 结论摘要
- 门禁结论：`不允许进入 dev-implement`
- 原因：存在 2 条阻塞问题（主流程断链、关键错误态缺失）

2. 问题示例
- `PC-MEMBER-001`（阻塞，页面流）
  - 页面：`SCR-MEMBER-001 会员列表`
  - 问题：点击“查看详情”未跳转 `SCR-MEMBER-002`
  - 影响：主流程中断，无法支撑开发联调路径
  - 建议修复：补齐静态跳转与返回路径
  - 是否阻塞进入开发：是
- `PC-POINTS-002`（重要，状态覆盖）
  - 页面：`SCR-POINTS-001 积分流水`
  - 问题：缺失 `no-result` 状态展示
  - 影响：边界场景评审不完整
  - 建议修复：补齐 `no-result` 占位与引导动作
  - 是否阻塞进入开发：否

3. 下一步
- 先执行 `prototype-rectify` 关闭阻塞项，再复检。
