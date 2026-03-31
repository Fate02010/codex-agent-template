# 原型 Skills 升级说明

## 文档信息

- 文档类型：产物
- 生成 Skill：`doc-check` / 手工维护
- 上游输入：`AGENTS.md`、`docs/AGENTS.md`、`codex/skills/*`
- 版本：v1.0
- 日期：2026-03-31
- 状态：已冻结

## 改造清单

本次完成 4 个原型相关 Skill 的结构化升级：

1. 升级：`ui-design-spec`
2. 升级：`prototype-check`
3. 新增：`prototype-build`
4. 新增：`prototype-rectify`

## 新职责定义

- `ui-design-spec`：产出高保真设计基线文档（页面、流程、Token、组件、状态矩阵）。
- `prototype-build`：按设计基线生成 HTML 原型与样式资产。
- `prototype-check`：执行原型验收门禁，输出是否允许进入开发。
- `prototype-rectify`：按检查报告做修复闭环并回写修复日志。

## 新旧流程差异

旧流程：

`solution-design -> ui-design-spec -> prototype-check -> qa-design`

新流程：

`solution-design -> ui-design-spec -> prototype-build -> prototype-check -> prototype-rectify（按需循环） -> qa-design -> dev-implement`

主要变化：

- 将“设计基线定义”和“原型构建”解耦。
- 将“原型检查”升级为门禁，不再是普通可视化检查。
- 引入“修复闭环”阶段，确保问题编号级追溯。

## 建议新流程

`solution-design`
`-> ui-design-spec`
`-> prototype-build`
`-> prototype-check`
`-> prototype-rectify（按需循环）`
`-> qa-design`
`-> dev-implement`
