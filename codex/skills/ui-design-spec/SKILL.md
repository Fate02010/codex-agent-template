---
name: ui-design-spec
description: 当需求与架构基线已冻结、需要产出高保真设计基线并为 prototype-build 提供输入时触发；不用于直接生成 HTML 原型、执行原型验收门禁或做原型修复闭环。
---

# Skill: ui-design-spec — 高保真设计基线

## Purpose

基于需求与设计基线，产出可评审、可追溯、可复用的高保真设计基线文档，作为后续 `prototype-build` 的唯一设计输入。

本 Skill 聚焦“设计基线定义”，不承担原型构建与修复闭环。

## When to Use

满足以下条件时触发：

- `PRD_RECTIFIED.md` 已冻结，且需要进入前端设计阶段。
- 已完成范围收敛，需要将页面、流程、状态、组件规范化。
- 需要为 `prototype-build` 输出稳定输入，避免原型阶段反复补需求。
- 增量迭代中 current change 涉及页面或交互变更。

## When Not to Use

以下场景不应使用本 Skill：

- 直接生成 HTML 原型（使用 `prototype-build`）。
- 对原型进行验收门禁判断（使用 `prototype-check`）。
- 根据问题报告做修复闭环（使用 `prototype-rectify`）。
- 重新定义业务需求、架构方案或接口契约（使用上游需求/设计 Skill）。

## Inputs

按优先顺序读取：

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/01-requirements/MVP_SCOPE.md`
3. `docs/01-requirements/OUT_OF_SCOPE.md`
4. `docs/02-architecture/ARCHITECTURE.md`
5. `docs/02-architecture/API_CONTRACT.md`
6. `docs/02-architecture/DATA_MODEL.md`
7. current change artifact（如项目启用 OpenSpec）：`<current-change>`
8. 现有设计稿/页面截图（如有）

输入降级策略：

- 缺少 `MVP_SCOPE.md` / `OUT_OF_SCOPE.md` / `<current-change>` 时，必须显式标注范围风险为 `【待确认】`。
- 对缺失但可合理补足的信息，可使用 `【设计推断】`，并注明依据来源。

## Outputs

必须输出：

1. `docs/02-design/SCREEN_INVENTORY.md`
2. `docs/02-design/UI_DESIGN_SPEC.md`
3. `docs/02-design/PAGE_FLOW.md`
4. `docs/02-design/UI_REVIEW_CHECKLIST.md`
5. `docs/02-design/DESIGN_TOKENS.md`
6. `docs/02-design/COMPONENT_GUIDELINES.md`
7. `docs/02-design/STATE_MATRIX.md`

输出边界：

- 本 Skill 只输出设计基线文档，不直接输出 HTML/CSS 原型文件。

## Rules

1. 页面设计必须受 `PRD_RECTIFIED.md`、`MVP_SCOPE.md`、`OUT_OF_SCOPE.md`、`<current-change>` 共同约束。
2. 不得发明未定义页面、字段、交互动作。
3. 页面状态覆盖必须包含以下 9 类：
   - `normal`
   - `loading`
   - `empty`
   - `error`
   - `forbidden`
   - `disabled`
   - `no-result`
   - `submit-success`
   - `submit-fail`
4. 信息不足时必须标记 `【待确认】`，并说明影响范围。
5. 依据上下文做合理补足时必须标记 `【设计推断】`，并注明推断依据。
6. 设计结论必须可追溯到需求编号、页面编号和接口编号。
7. 默认仅覆盖本期范围与 `<current-change>`，不得越权扩展。

## Workflow

### 步骤 1：范围与约束对齐

- 提取 In Scope、Out of Scope、current change 边界。
- 生成页面候选清单，并排除范围外页面。

### 步骤 2：构建页面与流程基线

- 产出 `SCREEN_INVENTORY.md`：页面编号、角色、入口、优先级、关联需求。
- 产出 `PAGE_FLOW.md`：主流程、分支流程、异常流程、跳转矩阵。

### 步骤 3：构建 UI 说明基线

- 产出 `UI_DESIGN_SPEC.md`：布局结构、字段展示、交互动作、权限差异。
- 产出 `STATE_MATRIX.md`：按页面列出 9 类状态的触发条件、展示与动作。

### 步骤 4：构建设计系统基线

- 产出 `DESIGN_TOKENS.md`：颜色、字体、间距、圆角、阴影、层级、断点、动效规范。
- 产出 `COMPONENT_GUIDELINES.md`：组件变体、状态、禁用条件、组合规则、可访问性要求。

### 步骤 5：输出评审检查清单

- 产出 `UI_REVIEW_CHECKLIST.md`：产品、设计、开发、测试四类检查项与门禁结论。

### 步骤 6：交付下游输入

- 明确标注“下游由 `prototype-build` 消费的关键章节与字段”。

## Quality Gate

- [ ] 已输出 7 份设计基线文档且路径正确。
- [ ] 页面与流程全部在 In Scope / `<current-change>` 内。
- [ ] 未出现超范围页面、字段、交互。
- [ ] `STATE_MATRIX.md` 覆盖 9 类状态且页面级可追溯。
- [ ] `DESIGN_TOKENS.md` 与 `COMPONENT_GUIDELINES.md` 可直接指导原型构建。
- [ ] 所有 `【待确认】` 与 `【设计推断】` 已显式标记并附依据。
- [ ] 输出可直接进入 `prototype-build`，无阻塞信息缺口。

## Example

示例：会员管理系统

输入：

- 需求：会员档案、等级规则、积分流水、权益发放、订单关联查询
- 范围：MVP 仅包含会员档案、等级、积分查询；自动营销与外部触达在 Out of Scope
- 变更：`<current-change>` 仅涉及“会员列表页 + 会员详情页 + 积分流水页”

输出思路：

1. `SCREEN_INVENTORY.md`
- 登记 `SCR-MEMBER-001`（会员列表）、`SCR-MEMBER-002`（会员详情）、`SCR-POINTS-001`（积分流水）。

2. `UI_DESIGN_SPEC.md`
- 定义列表筛选区、表格区、详情抽屉、流水分页区及字段映射。
- 对“等级阈值文案展示规则”若未明确，标记 `【待确认】`。

3. `PAGE_FLOW.md`
- 输出“会员列表 → 会员详情 → 积分流水查询”的主流程与异常回路。

4. `DESIGN_TOKENS.md` + `COMPONENT_GUIDELINES.md`
- 统一主色、语义色、按钮尺寸、表格间距、标签状态规范。

5. `STATE_MATRIX.md`
- 对 3 个页面逐一覆盖 9 类状态；例如：
  - `submit-fail`：会员编辑提交失败时展示错误提示与重试动作。
  - `forbidden`：无权限角色仅可见不可操作。

6. `UI_REVIEW_CHECKLIST.md`
- 形成可评审结论并列出需下游处理项，进入 `prototype-build`。
