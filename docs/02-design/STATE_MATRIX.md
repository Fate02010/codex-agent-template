# 页面状态矩阵

## 文档信息

- 文档类型：模板（首次执行 Skill 后覆盖）
- 生成 Skill：`ui-design-spec`
- 上游输入：`UI_DESIGN_SPEC.md`、`SCREEN_INVENTORY.md`、`PAGE_FLOW.md`
- 版本：v0.0
- 日期：—
- 状态：模板 → 草稿 → 已冻结

## 目标

按页面定义完整状态覆盖和交互反馈，避免原型与实现阶段遗漏关键边界场景。

## 范围

- 在范围内：页面状态、触发条件、展示规则、交互动作
- 不在范围内：后端业务处理细节

## 1. 状态定义

必选状态：

- `normal`
- `loading`
- `empty`
- `error`
- `forbidden`
- `disabled`
- `no-result`
- `submit-success`
- `submit-fail`

## 2. 页面状态矩阵

| 页面编号 | 页面名称 | 状态 | 触发条件 | 展示规则 | 交互动作 | 关联需求 |
|---|---|---|---|---|---|---|
| SCR-XXX-001 |  | normal |  |  |  | F001 |
| SCR-XXX-001 |  | loading |  |  |  | F001 |
| SCR-XXX-001 |  | empty |  |  |  | F001 |
| SCR-XXX-001 |  | error |  |  |  | F001 |
| SCR-XXX-001 |  | forbidden |  |  |  | F001 |
| SCR-XXX-001 |  | disabled |  |  |  | F001 |
| SCR-XXX-001 |  | no-result |  |  |  | F001 |
| SCR-XXX-001 |  | submit-success |  |  |  | F001 |
| SCR-XXX-001 |  | submit-fail |  |  |  | F001 |

## 3. 状态缺口与待确认

| 编号 | 页面编号 | 问题 | 标记 | 处理建议 |
|---|---|---|---|---|
| ST-Q-001 | SCR-XXX-001 |  | 【待确认】/【设计推断】 |  |

## 异常与边界

- 页面状态缺失时不得进入 `prototype-build`。
- 状态定义与 `UI_DESIGN_SPEC.md` 不一致时，必须先修正文档基线。

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| — | — | — |
