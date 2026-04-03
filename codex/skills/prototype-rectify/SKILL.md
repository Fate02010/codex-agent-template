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
11. `docs/02-design/MOCK_DATA_SPEC.md`（如有）
12. `frontend/design-prototype/display/*.html`
13. `frontend/design-prototype/display/assets/*.css`
14. `frontend/design-prototype/display/data/*.json`
15. `frontend/design-prototype/acceptance/*.html`
16. `frontend/design-prototype/acceptance/assets/*.css`
17. `frontend/design-prototype/acceptance/data/*.json`
18. current change artifact（如项目启用 OpenSpec）：`<current-change>`

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
11. 更新后的 `frontend/design-prototype/display/data/*.json`
12. 更新后的 `frontend/design-prototype/acceptance/data/*.json`
13. `docs/02-design/PROTOTYPE_FIX_LOG.md`

## 执行层级导读（Progressive Disclosure）

- `P0 必检（阻塞）`：阻塞问题优先级、断点复检闭环、关闭判定证据。
- `P1 扩展（覆盖）`：重要/建议项治理、文档与原型双侧同步完整。
- `P2 参考（说明）`：示例与说明文本仅作参考，不参与放行。
- 执行顺序必须为：先过 `P0 Gate`，再进入 `P1`；`P2` 不得覆盖 `P0` 结论。

## Rules

1. 严重度口径必须与 `prototype-check` 一致：`阻塞（Blocker）`、`重要（Major）`、`建议（Minor/Suggestion）`。
2. 修复顺序必须为：先 `阻塞`，再 `重要`，最后 `建议`。
3. display 视觉问题分级规则：
   - 凡影响 readable/actionable 的 display 视觉问题，最低定级为 `重要（Major）`
   - 凡阻断主流程或导致页面不可用的 display 视觉问题，必须定级为 `阻塞（Blocker）`
4. 视觉问题整改优先级必须先于流程状态与一般观感：
   - 先修复视觉变形（layout deformation）与几何一致性（geometric consistency）阻塞项
   - 再修复流程与状态问题
   - 最后处理一般观感与建议项
5. 复检必须执行强制断点覆盖（breakpoint coverage）：`1440`、`1200`、`992`、`768`、`375`。
6. 未完成断点复检的问题，不得标记“已关闭”。
7. 问题关闭必须附复检依据（页面、断点、结果、证据）。
8. 文档和原型必须同步更新，禁止只改其一。
9. 必须输出“已关闭问题清单”。
10. 必须输出“未关闭问题清单”。
11. 未关闭问题必须写明原因和后续建议。
12. 不得超出 `<current-change>` 范围。
13. 问题编号必须与 `PROTOTYPE_CHECK_REPORT.md` 保持一致。
14. 无法确认的信息必须标记 `【待确认】`。
15. 若问题同时影响 display 与 acceptance，必须分别说明修复落点。
16. 若问题仅为 display 观感建议且不影响 readable/actionable，可在后置阶段处理，但不得挤占阻塞视觉几何问题优先级。
17. 规则去重：`Rules` 保留主定义，`Workflow` 与 `Quality Gate` 仅引用编号与结论，不重复整段规则文本。

## Workflow

### 步骤 0：P0 Gate（阻塞）

- 校验 `PROTOTYPE_CHECK_REPORT.md` 可读，且问题编号可追溯到页面与断点。
- 若无法建立问题 -> 修复落点映射，结论必须为 `BLOCKED`，不得进入步骤 1~5。

### 步骤 1：解析问题并排序

- 从 `PROTOTYPE_CHECK_REPORT.md` 提取问题清单。
- 按 `阻塞 > 重要 > 建议` 重新排序。

### 步骤 2：建立修复映射

- 为每个问题建立修复映射：
  - 问题编号
  - 修改落点（共享文档 / display / acceptance / HTML / CSS）
  - 预期结果

### 步骤 3：执行修复

- 先修复阻塞级视觉几何问题（layout deformation / geometric consistency）。
- 再修复流程与状态问题（主路径、异常路径、状态落地）。
- 修复模拟数据问题：
  - 若问题涉及模拟数据缺失，补充模拟数据文件
  - 若问题涉及模拟数据不符合规范，修正模拟数据
  - 若问题涉及边界值缺失，补充边界值数据
  - 若问题涉及状态覆盖不完整，补充状态数据
- 最后处理一般观感与建议项（不影响 readable/actionable 的问题）。
- 同步修订设计文档与原型文件。

### 步骤 4：复核与回写

- 逐问题执行断点复检（`1440/1200/992/768/375`），并记录复检证据。
- 验证问题是否真正关闭；未完成断点复检的条目不得关闭。
- 将结果写入 `PROTOTYPE_FIX_LOG.md`：已关闭 / 未关闭。
- 已关闭条目必须包含：页面、断点、复检结果、证据引用。

### 步骤 5：输出下一步建议

- 若仍有阻塞项，建议继续 `prototype-rectify`。
- 若无阻塞项，建议回到 `prototype-check` 复检并申请进入开发。

## Quality Gate（分层）

### P0 Gate（阻塞，最小必检）

- [ ] 阻塞问题优先关闭，未跳过优先级顺序。
- [ ] 修复项已同步到文档与原型。
- [ ] 已完成断点覆盖复检（`1440/1200/992/768/375`）。
- [ ] 未完成断点复检的条目未被标记为已关闭，且关闭条目均附复检依据。

### P1 Coverage Checklist（扩展覆盖）

- [ ] `PROTOTYPE_FIX_LOG.md` 已包含已关闭与未关闭问题清单。
- [ ] 未关闭问题均有明确原因与后续处理建议。
- [ ] 修复内容未超出 `<current-change>`。
- [ ] 已按“视觉几何阻塞 -> 流程状态 -> 一般观感建议”顺序执行整改。
- [ ] display 影响 readable/actionable 的问题已按 `重要` 或 `阻塞` 处理，未降级。

### P2 Reference Checklist（参考）

- [ ] Example 与说明文本已更新，且不改变 `P0` 判定口径。

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
