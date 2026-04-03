# 原型检查报告

## 文档信息

- 文档类型：模板（首次执行 Skill 后覆盖）
- 生成 Skill：`prototype-check`
- 上游输入：`PRD_RECTIFIED.md`、`MVP_SCOPE.md`、`OUT_OF_SCOPE.md`、`UI_DESIGN_SPEC.md`、`PAGE_FLOW.md`、`SCREEN_INVENTORY.md`、`DESIGN_TOKENS.md`、`COMPONENT_GUIDELINES.md`、`STATE_MATRIX.md`、`DISPLAY_PROTOTYPE_SPEC.md`、`ACCEPTANCE_PROTOTYPE_SPEC.md`、`BACKOFFICE_UI_SPEC.md`、`API_CONTRACT.md`、原型文件
- 版本：v0.0
- 日期：—
- 状态：模板 → 草稿 → 已冻结

## 目标

记录 acceptance 高保真原型验收门禁结果，并可附带 display 观察项，作为是否允许进入 `dev-implement` 的直接依据。

## 范围

- 在范围内：acceptance 的视觉质量、页面流质量、状态质量、范围一致性、契约抽检，以及可选的 display 观察项
- 不在范围内：业务实现逻辑正确性

## 1. 检查环境

| 项目 | 值 |
|---|---|
| 门禁原型目录 | `frontend/design-prototype/acceptance/` |
| display 参考目录 | `frontend/design-prototype/display/`（如有） |
| 关联变更 | `<current-change>` |
| 检查分辨率 | 1366/1440（默认） |
| 是否检查移动端 | 否/是（375） |

## 2. 检查结果汇总

| 级别 | 数量 |
|---|---|
| 阻塞 | 0 |
| 重要 | 0 |
| 建议 | 0 |

## 3. 问题明细

每条问题必须包含：问题编号、问题级别、问题类型、页面编号/页面名称、断点、关联 `UX-TARGET`、关联 `BUILD-RULE`、关联 `BO-RULE`、问题描述、影响、建议修复、证据、是否阻塞进入 `dev-implement`。

### PC-XXX-001

- 问题级别：阻塞 / 重要 / 建议
- 问题类型：视觉一致性 / 页面流 / 状态覆盖 / 范围一致性 / 契约一致性 / 双轨漂移 / 展示过曝 / 验收缺失
- 页面：`SCR-XXX-001` / [页面名称]
- 断点：1440 / 1200 / 992 / 768 / 375
- 关联 `UX-TARGET`：
- 关联 `BUILD-RULE`：
- 关联 `BO-RULE`：
- 问题描述：
- 影响：
- 建议修复：
- 证据：
- 是否阻塞进入 `dev-implement`：是 / 否

### 后台可冻结门禁（Fail-fast）

| BO-RULE | 门禁项 | 结果（通过/不通过） | 是否阻塞 |
|---|---|---|---|
| BO-RULE-001 | 信息层级清晰 |  | 是 |
| BO-RULE-002 | 主按钮唯一且位置一致 |  | 是 |
| BO-RULE-005 | 文案中文化且术语统一 |  | 是 |
| BO-RULE-006 | 状态可辨识（颜色/禁用态/可点击态） |  | 是 |
| BO-RULE-008 | 表格/筛选/分页交互闭环 |  | 是 |

## 4. 结论

- 总结：
- 主门禁对象：acceptance
- 结论：PASS / PASS WITH RISK / FAIL
- 是否允许进入 `dev-implement`：是 / 否
- 下一步建议：进入开发 / 执行 `prototype-rectify` 后复检

## 5. display 观察项（可选）

| 问题编号 | 页面 | 观察说明 | 是否阻塞开发 |
|---|---|---|---|
| PC-DISPLAY-001 | `SCR-XXX-001` |  | 否 |

## 异常与边界

- acceptance 存在阻塞问题时，结论必须为 `FAIL`，且不得进入 `dev-implement`。
- 命中任一后台 Fail-fast 门禁项（`BO-RULE-001/002/005/006/008`）时，结论必须为 `FAIL`，且不得进入 `dev-implement`。
- display 隐藏内部信息或不显式展示完整状态，不得单独作为阻塞依据。
- 原型不得超出 `MVP_SCOPE.md` 与 `<current-change>`。
- 本报告问题编号必须在 `PROTOTYPE_FIX_LOG.md` 中复用。

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| — | — | — |
