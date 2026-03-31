# OpenSpec Change 拆分参考

## 文档信息

- 文档类型：模板（首次执行 Skill 后覆盖）
- 生成 Skill：`scope-definition`
- 上游输入：`MVP_SCOPE.md`、`OUT_OF_SCOPE.md`、`FEATURE_PRIORITY.md`、`openspec/project.md`
- 版本：v0.0
- 日期：—
- 状态：模板 → 草稿 → 已冻结

## 目标

为后续 OpenSpec change 规划提供可执行拆分建议，降低跨能力耦合和发布风险。

## 范围

- 在范围内：change 包拆分建议、依赖关系、实施顺序
- 不在范围内：直接创建或修改 `openspec/changes/*` 内容

## 1. Change 拆分建议

| 建议编号 | 建议 change 名称 | 覆盖能力 | 依赖 change | 推荐顺序 | 风险说明 |
|---|---|---|---|---|---|
| SPLIT-001 |  | CAP-001,CAP-002 | 无 | 1 |  |

## 2. 拆分原则

| 原则 | 说明 |
|---|---|
| 低耦合优先 |  |
| 先基础后扩展 |  |
| 可独立验收 |  |
| 关键依赖前置 |  |

## 3. 待确认事项

| 编号 | 问题 | 影响的拆分建议 | 处理建议 |
|---|---|---|---|
| SPLIT-Q-001 |  | SPLIT-001 |  |

## 异常与边界

- 本文档仅作为拆分提示，不替代 `change-intake` / `iteration-plan`。
- 若拆分建议涉及未确认规则，必须标记【待确认】。

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| — | — | — |
