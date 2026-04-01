# 原型 Skills 升级说明

## 文档信息

- 文档类型：产物
- 生成 Skill：`doc-check` / 手工维护
- 上游输入：`AGENTS.md`、`docs/AGENTS.md`、`codex/skills/*`
- 版本：v1.0
- 日期：2026-03-31
- 状态：已冻结

## 改造清单

本次完成 4 个原型相关 Skill 的结构化升级，并进一步明确 display / acceptance 双轨口径：

1. 升级：`ui-design-spec`
2. 升级：`prototype-check`
3. 新增：`prototype-build`
4. 新增：`prototype-rectify`

## 新职责定义

- `ui-design-spec`：产出共享设计基线文档，并补充 `DISPLAY_PROTOTYPE_SPEC.md`、`ACCEPTANCE_PROTOTYPE_SPEC.md` 两份双轨规则文档。
- `prototype-build`：按设计基线生成 display / acceptance HTML 原型与样式资产，默认构建 display。
- `prototype-check`：仅对 acceptance 执行开发前门禁，可附带 display 观察项。
- `prototype-rectify`：按检查报告做修复闭环并回写修复日志，优先关闭 acceptance 门禁问题。

## 新旧流程差异

旧流程：

`solution-design -> ui-design-spec -> prototype-check -> qa-design`

新流程：

`solution-design -> ui-design-spec -> prototype-build -> prototype-check -> prototype-rectify（按需循环） -> qa-design -> dev-implement`

主要变化：

- 将“共享设计基线”和“display / acceptance 双轨差异”显式拆开。
- 将 `prototype-build` 的默认产物改为 display，不再默认同时生成两版。
- 将 `prototype-check` 的门禁对象固定为 acceptance，避免 display 被误当开发前门禁。
- 引入“修复闭环”阶段，确保问题编号级追溯。

## 建议新流程

`solution-design`
`-> ui-design-spec`
`-> prototype-build`
`-> prototype-check`
`-> prototype-rectify（按需循环）`
`-> qa-design`
`-> dev-implement`
