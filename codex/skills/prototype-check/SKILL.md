---
name: prototype-check
description: 当 acceptance 高保真原型已构建、需要在开发前执行原型验收门禁并判断是否允许进入 dev-implement 时触发；不用于生成原型、修复原型或替代功能测试执行。
---

# Skill: prototype-check — 原型验收门禁

## Purpose

对 acceptance 高保真原型执行开发前验收门禁，检查视觉质量、页面流质量、状态质量与范围一致性，并给出是否允许进入 `dev-implement` 的明确建议。

本 Skill 的主门禁对象是 `acceptance`，不是 `display`。

## When to Use

- `prototype-build` 已输出 acceptance 原型，准备进入开发前验收。
- 增量迭代中页面改造完成，需要判断 acceptance 是否可进入实现。
- 需要基于需求/设计/契约对 acceptance 原型做结构化差异审查。

## When Not to Use

- 生成或更新 HTML/CSS 原型（使用 `prototype-build` / `prototype-rectify`）。
- 编写 UI 设计基线（使用 `ui-design-spec`）。
- 用 `display` 原型直接替代开发前门禁。
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
10. `docs/02-design/DISPLAY_PROTOTYPE_SPEC.md`
11. `docs/02-design/ACCEPTANCE_PROTOTYPE_SPEC.md`
12. `docs/02-architecture/API_CONTRACT.md`
13. `frontend/design-prototype/acceptance/*.html`
14. `frontend/design-prototype/acceptance/assets/*.css`
15. current change artifact（如项目启用 OpenSpec）：`<current-change>`

可选参考输入：

- `frontend/design-prototype/display/*.html`
- `frontend/design-prototype/display/assets/*.css`

输入降级策略：

- 缺失 acceptance 原型时，直接输出“不允许进入 `dev-implement`”。
- display 原型仅作为一致性参考，不作为主门禁对象。

## Outputs

1. `docs/02-design/PROTOTYPE_CHECK_REPORT.md`

报告必须包含：

- 主门禁结论（是否允许 acceptance 进入 `dev-implement`）
- 问题分级统计（阻塞/重要/建议）
- 问题明细与修复建议
- 可选的 display 观察项（如有）

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
4. 主门禁检查对象固定为 acceptance 原型。
5. `display` 仅做参考观察，不因“未显式展示所有状态/字段/验收信息”而阻塞开发。
6. 重点检查维度：
   - acceptance 与 `ACCEPTANCE_PROTOTYPE_SPEC.md` 的一致性
   - 页面流与跳转完整性
   - 状态覆盖完整性
   - 范围一致性（MVP 与 current change）
   - 契约一致性（关键字段与 API 展示口径）
7. 允许新增问题类型：
   - `双轨漂移`
   - `展示过曝`
   - `验收缺失`
8. 无法确认的信息必须标记 `【待确认】`。
9. 基于上下文推断的结论必须标记 `【推断】`。
10. 不得仅以“HTML 可打开”作为通过依据。
11. 冷启动规则（强制）：
   - 若目标目录不存在，先创建目录。
   - 若 `PROTOTYPE_CHECK_REPORT.md` 不存在，按本 Skill 内置结构创建完整报告。
   - 若报告状态为 `模板`，整文件覆盖为正式产物结构。
   - 若报告状态不为 `模板`，按章节标题增量更新，不按章节序号硬编码。

## Workflow

### 步骤 0：初始化输出载体（冷启动）

- 确保 `docs/02-design/` 存在。
- 初始化 `PROTOTYPE_CHECK_REPORT.md`（缺失则创建、模板则覆盖）。

`PROTOTYPE_CHECK_REPORT.md` 最小结构：

```markdown
# 原型验收门禁报告

## 文档信息
- 文档类型：产物
- 生成 Skill：`prototype-check`
- 上游输入：需求边界文档、设计基线文档、acceptance 原型文件
- 版本：vX.Y
- 日期：YYYY-MM-DD
- 状态：草稿 / 已冻结

## 1. 主门禁结论
- 是否允许进入 `dev-implement`：是 / 否
- 结论级别：PASS / FAIL
- 结论依据：

## 2. 问题分级统计
| 级别 | 数量 |
|---|---|
| 阻塞 | 0 |
| 重要 | 0 |
| 建议 | 0 |

## 3. 问题清单（按 阻塞 > 重要 > 建议）
| 问题编号 | 问题级别 | 问题类型 | 页面编号/页面名称 | 问题描述 | 影响 | 建议修复 | 是否阻塞进入 dev-implement |
|---|---|---|---|---|---|---|---|

## 4. 非门禁观察（display，可选）
| 编号 | 类型 | 页面 | 观察项 | 影响 | 建议 |
|---|---|---|---|---|---|

## 5. 待确认与推断

## 6. 下一步建议

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

### 步骤 1：建立验收边界

- 读取 MVP、Out of Scope、`<current-change>`，确定检查范围页面。
- 以 `SCREEN_INVENTORY.md` 作为页面主清单。
- 锁定主门禁对象为 `frontend/design-prototype/acceptance/**`。

### 步骤 2：执行 acceptance 核心检查

1. 视觉质量检查：对齐 `DESIGN_TOKENS.md` 与 `COMPONENT_GUIDELINES.md`。
2. 页面流质量检查：对齐 `PAGE_FLOW.md`，检查主流程与异常回路。
3. 状态质量检查：对齐 `STATE_MATRIX.md` 与 `ACCEPTANCE_PROTOTYPE_SPEC.md`，核对关键状态落地。
4. 范围一致性检查：核对是否超出 `MVP_SCOPE.md` 与 `<current-change>`。

### 步骤 3：执行契约一致性抽检

- 对关键页面字段展示与 `API_CONTRACT.md` 做一致性抽检。
- 标记“页面口径与契约口径不一致”问题。

### 步骤 4：执行双轨一致性观察（可选）

- 若存在 display 原型，检查其与 acceptance 的核心业务路径是否一致。
- 仅记录以下观察项，不默认阻塞开发：
  - display 是否暴露了本应隐藏的验收/实施信息
  - display 与 acceptance 是否出现主流程漂移

### 步骤 5：输出问题清单

- 按 `阻塞 > 重要 > 建议` 顺序整理问题。
- 主问题清单针对 acceptance。
- display 观察项单列为“非门禁观察”。

### 步骤 6：输出门禁结论

- 生成 `PROTOTYPE_CHECK_REPORT.md`。
- 明确写出：
  - acceptance 是否允许进入 `dev-implement`（是/否）
  - 若 acceptance 缺失或不合格，建议执行 `prototype-build` / `prototype-rectify`

## Quality Gate

- [ ] 已输出 `PROTOTYPE_CHECK_REPORT.md` 且问题字段完整。
- [ ] 主门禁对象为 acceptance，而非 display。
- [ ] acceptance 与 `UI_DESIGN_SPEC.md`、`PAGE_FLOW.md`、`SCREEN_INVENTORY.md` 一致。
- [ ] acceptance 与 `STATE_MATRIX.md`、`ACCEPTANCE_PROTOTYPE_SPEC.md` 一致。
- [ ] acceptance 视觉规范与 `DESIGN_TOKENS.md`、`COMPONENT_GUIDELINES.md` 一致。
- [ ] acceptance 未超出 `MVP_SCOPE.md` 与 `<current-change>`。
- [ ] display 未因隐藏内部信息而被误判为阻塞问题。
- [ ] 无阻塞项才建议进入 `dev-implement`。

## Example

示例：会员管理系统

输入：

- 范围：会员列表、会员详情、积分流水页面
- acceptance 资产：3 个 HTML 页面 + 4 份 CSS 资产
- 设计基线：`UI_DESIGN_SPEC.md` / `PAGE_FLOW.md` / `STATE_MATRIX.md`

输出思路（`PROTOTYPE_CHECK_REPORT.md`）：

1. 结论摘要
- 门禁结论：`不允许进入 dev-implement`
- 原因：acceptance 存在 2 条阻塞问题（主流程断链、关键错误态缺失）

2. 问题示例
- `PC-MEMBER-001`（阻塞，页面流）
  - 页面：`SCR-MEMBER-001 会员列表`
  - 问题：点击“查看详情”未跳转 `SCR-MEMBER-002`
  - 影响：主流程中断，无法支撑开发联调路径
  - 建议修复：补齐静态跳转与返回路径
  - 是否阻塞进入开发：是
- `PC-POINTS-002`（重要，验收缺失）
  - 页面：`SCR-POINTS-001 积分流水`
  - 问题：缺失 `no-result` 状态展示
  - 影响：边界场景验收不完整
  - 建议修复：补齐 `no-result` 占位与引导动作
  - 是否阻塞进入开发：否

3. 非门禁观察
- `PC-DISPLAY-001`（建议，展示过曝）
  - 页面：`SCR-MEMBER-001 会员列表`
  - 问题：display 版暴露了验收辅助提示
  - 影响：对外展示观感受损
  - 是否阻塞进入开发：否

4. 下一步
- 先执行 `prototype-rectify` 关闭 acceptance 阻塞项，再复检。
