---
name: prototype-rectify
description: 当 prototype-check 已输出问题报告、需要在 current change 范围内完成 display/acceptance 原型与设计文档修复闭环时触发；不用于重新做完整设计或扩展需求范围。
---

# Skill: prototype-rectify — 原型修复闭环

## Purpose

基于 `PROTOTYPE_CHECK_REPORT.md` 对原型与设计文档执行修复闭环，确保“问题编号 -> 修改落点 -> 修复结果”可追溯。

本 Skill 需兼容 display / acceptance 双轨，但修复优先级始终以 acceptance 门禁问题为先。

## When to Use

- `prototype-check` 输出了阻塞/重要/建议问题，需要修复后复检。
- 开发前需清理原型门禁问题，保证可进入 `dev-implement`。
- 增量迭代中原型变更需要闭环记录。

## When Not to Use

- 首次产出设计基线（使用 `ui-design-spec`）。
- 首次构建原型（使用 `prototype-build`）。
- 在无问题报告前提下做大范围重构或新功能扩展。

## Inputs

1. `docs/02-design/PROTOTYPE_CHECK_REPORT.md`
2. `docs/02-design/UI_DESIGN_SPEC.md`
3. `docs/02-design/PAGE_FLOW.md`
4. `docs/02-design/SCREEN_INVENTORY.md`
5. `docs/02-design/UI_REVIEW_CHECKLIST.md`
6. `docs/02-design/DISPLAY_PROTOTYPE_SPEC.md`（如有）
7. `docs/02-design/ACCEPTANCE_PROTOTYPE_SPEC.md`（如有）
8. `docs/02-design/DESIGN_TOKENS.md`（如有）
9. `docs/02-design/COMPONENT_GUIDELINES.md`（如有）
10. `docs/02-design/STATE_MATRIX.md`（如有）
11. `frontend/design-prototype/display/*.html`
12. `frontend/design-prototype/display/assets/*.css`
13. `frontend/design-prototype/acceptance/*.html`
14. `frontend/design-prototype/acceptance/assets/*.css`
15. current change artifact（如项目启用 OpenSpec）：`<current-change>`

## Outputs

1. 更新后的 `docs/02-design/UI_DESIGN_SPEC.md`
2. 更新后的 `docs/02-design/PAGE_FLOW.md`
3. 更新后的 `docs/02-design/SCREEN_INVENTORY.md`（如需）
4. 更新后的 `docs/02-design/UI_REVIEW_CHECKLIST.md`
5. 更新后的 `docs/02-design/DISPLAY_PROTOTYPE_SPEC.md`（如需）
6. 更新后的 `docs/02-design/ACCEPTANCE_PROTOTYPE_SPEC.md`（如需）
7. 更新后的 `frontend/design-prototype/display/*.html`
8. 更新后的 `frontend/design-prototype/display/assets/*.css`
9. 更新后的 `frontend/design-prototype/acceptance/*.html`
10. 更新后的 `frontend/design-prototype/acceptance/assets/*.css`
11. `docs/02-design/PROTOTYPE_FIX_LOG.md`

## Rules

1. 修复顺序必须为：先 `阻塞`，再 `重要`，最后 `建议`。
2. 文档和原型必须同步更新，禁止只改其一。
3. 必须输出“已关闭问题清单”。
4. 必须输出“未关闭问题清单”。
5. 未关闭问题必须写明原因和后续建议。
6. 不得超出 `<current-change>` 范围。
7. 问题编号必须与 `PROTOTYPE_CHECK_REPORT.md` 保持一致。
8. 无法确认的信息必须标记 `【待确认】`。
9. 若问题同时影响 display 与 acceptance，必须分别说明修复落点。
10. 若问题仅为 display 观感问题，默认不影响 acceptance 门禁优先级。

## Workflow

### 步骤 1：解析问题并排序

- 从 `PROTOTYPE_CHECK_REPORT.md` 提取问题清单。
- 按 `阻塞 > 重要 > 建议` 重新排序。

### 步骤 2：建立修复映射

- 为每个问题建立修复映射：
  - 问题编号
  - 修改落点（共享文档 / display / acceptance / HTML / CSS）
  - 预期结果

### 步骤 3：执行修复

- 先处理 acceptance 阻塞问题，再处理 acceptance 重要问题，最后评估 display 观感建议项。
- 同步修订设计文档与原型文件。

### 步骤 4：复核与回写

- 验证问题是否真正关闭。
- 将结果写入 `PROTOTYPE_FIX_LOG.md`：已关闭 / 未关闭。

### 步骤 5：输出下一步建议

- 若仍有阻塞项，建议继续 `prototype-rectify`。
- 若无阻塞项，建议回到 `prototype-check` 复检并申请进入开发。

## Quality Gate

- [ ] 阻塞问题优先关闭，未跳过优先级顺序。
- [ ] 修复项已同步到文档与原型。
- [ ] `PROTOTYPE_FIX_LOG.md` 已包含已关闭与未关闭问题清单。
- [ ] 未关闭问题均有明确原因与后续处理建议。
- [ ] 修复内容未超出 `<current-change>`。
- [ ] acceptance 门禁问题优先于 display 观感问题处理。

## Example

示例：会员管理系统

输入：

- `PROTOTYPE_CHECK_REPORT.md` 中 5 条问题：阻塞 2、重要 2、建议 1
- 受影响页面：会员列表、会员详情、积分流水

输出思路：

1. 先关阻塞
- 修复 `PC-MEMBER-001`：补齐“列表 -> 详情”跳转与返回。
- 修复 `PC-POINTS-003`：补齐 `error` 状态展示。

2. 再关重要
- 修复组件间距与按钮禁用态不一致问题。

3. 记录日志
- `PROTOTYPE_FIX_LOG.md` 中输出：
  - 已关闭：4 条（含修改文件落点）
  - 未关闭：1 条（原因：依赖上游规则未冻结，标记 `【待确认】`）

4. 门禁建议
- 若无阻塞项，进入 `prototype-check` 复检。
