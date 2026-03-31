# 原型检查报告

## 文档信息

- 文档类型：模板（首次执行 Skill 后覆盖）
- 生成 Skill：`prototype-check`
- 上游输入：`PRD_RECTIFIED.md`、`MVP_SCOPE.md`、`OUT_OF_SCOPE.md`、`UI_DESIGN_SPEC.md`、`PAGE_FLOW.md`、`SCREEN_INVENTORY.md`、`DESIGN_TOKENS.md`、`COMPONENT_GUIDELINES.md`、`STATE_MATRIX.md`、`API_CONTRACT.md`、原型文件
- 版本：v0.0
- 日期：—
- 状态：模板 → 草稿 → 已冻结

## 目标

记录高保真原型验收门禁结果，作为是否允许进入 `dev-implement` 的直接依据。

## 范围

- 在范围内：视觉质量、页面流质量、状态质量、范围一致性、契约抽检
- 不在范围内：业务实现逻辑正确性

## 1. 检查环境

| 项目 | 值 |
|---|---|
| 原型目录 | `frontend/design-prototype/` |
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

每条问题必须包含：问题编号、问题级别、问题类型、页面编号/页面名称、问题描述、影响、建议修复、是否阻塞进入 `dev-implement`。

### PC-XXX-001

- 问题级别：阻塞 / 重要 / 建议
- 问题类型：视觉一致性 / 页面流 / 状态覆盖 / 范围一致性 / 契约一致性
- 页面：`SCR-XXX-001` / [页面名称]
- 问题描述：
- 影响：
- 建议修复：
- 是否阻塞进入 `dev-implement`：是 / 否

## 4. 结论

- 总结：
- 结论：PASS / PASS WITH RISK / FAIL
- 是否允许进入 `dev-implement`：是 / 否
- 下一步建议：进入开发 / 执行 `prototype-rectify` 后复检

## 异常与边界

- 存在阻塞问题时，结论必须为 `FAIL`，且不得进入 `dev-implement`。
- 原型不得超出 `MVP_SCOPE.md` 与 `<current-change>`。
- 本报告问题编号必须在 `PROTOTYPE_FIX_LOG.md` 中复用。

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| — | — | — |
