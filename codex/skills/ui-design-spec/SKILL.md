---
name: ui-design-spec
description: 当需求与架构基线已冻结、需要产出高保真设计基线并为 display/acceptance 双轨原型提供输入时触发；不用于直接生成 HTML 原型、执行原型验收门禁或做原型修复闭环。
---

# Skill: ui-design-spec — 高保真设计基线

## Purpose

基于需求与设计基线，产出一套共享设计基线，并补充 display / acceptance 双轨专用文档，作为后续 `prototype-build` 的唯一设计输入。

本 Skill 聚焦“设计基线定义”，不承担原型构建、门禁检查与修复闭环。

## When to Use

满足以下条件时触发：

- `PRD_RECTIFIED.md` 已冻结，且需要进入前端设计阶段。
- 已完成范围收敛，需要将页面、流程、组件、双轨展示策略规范化。
- 需要同时支持“对外展示版”和“内部验收版”原型。
- 增量迭代中 current change 涉及页面或交互变更。

## When Not to Use

以下场景不应使用本 Skill：

- 直接生成 HTML 原型（使用 `prototype-build`）。
- 对原型进行开发前门禁判断（使用 `prototype-check`）。
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

必须输出共享基线文档：

1. `docs/02-design/SCREEN_INVENTORY.md`
2. `docs/02-design/UI_DESIGN_SPEC.md`
3. `docs/02-design/PAGE_FLOW.md`
4. `docs/02-design/UI_REVIEW_CHECKLIST.md`
5. `docs/02-design/DESIGN_TOKENS.md`
6. `docs/02-design/COMPONENT_GUIDELINES.md`
7. `docs/02-design/STATE_MATRIX.md`

必须输出双轨专用文档：

8. `docs/02-design/DISPLAY_PROTOTYPE_SPEC.md`
9. `docs/02-design/ACCEPTANCE_PROTOTYPE_SPEC.md`

输出边界：

- 本 Skill 只输出设计基线文档，不直接输出 HTML/CSS 原型文件。

## Rules

1. 页面设计必须受 `PRD_RECTIFIED.md`、`MVP_SCOPE.md`、`OUT_OF_SCOPE.md`、`<current-change>` 共同约束。
2. 不得发明未定义页面、字段、交互动作。
3. 共享基线只定义共用页面、主流程、布局和交互，不把 display / acceptance 的差异混写成同一要求。
4. `display` 轨目标是主视觉清晰、用户可理解、内部实现信息隐藏优先。
5. `acceptance` 轨目标是状态覆盖、结构完整、门禁可检查优先。
6. 页面状态覆盖仍需在 `STATE_MATRIX.md` 中包含以下 9 类：
   - `normal`
   - `loading`
   - `empty`
   - `error`
   - `forbidden`
   - `disabled`
   - `no-result`
   - `submit-success`
   - `submit-fail`
7. `STATE_MATRIX.md` 属于 acceptance 强约束输入，不要求 display 原型显式展示全部状态。
8. 信息不足时必须标记 `【待确认】`，并说明影响范围。
9. 依据上下文做合理补足时必须标记 `【设计推断】`，并注明推断依据。
10. 设计结论必须可追溯到需求编号、页面编号和接口编号。
11. 默认仅覆盖本期范围与 `<current-change>`，不得越权扩展。
12. 冷启动规则（强制）：
   - 若目标目录不存在，先创建目录。
   - 若目标文件不存在，按本 Skill 的最小章节结构创建完整文档。
   - 若目标文件状态为 `模板`，整文件覆盖为正式产物结构。
   - 若目标文件状态不为 `模板`，按章节标题增量更新，不按章节序号硬编码。

## Workflow

### 步骤 0：初始化输出载体（冷启动）

- 确保 `docs/02-design/` 存在。
- 对 9 份输出文档执行初始化（缺失则创建、模板则覆盖）。

每份文档最小章节要求：

| 文档 | 最小章节 |
|---|---|
| `SCREEN_INVENTORY.md` | 文档信息、目标、范围、页面清单、异常与边界、变更记录 |
| `UI_DESIGN_SPEC.md` | 文档信息、目标、范围、页面结构、关键交互、权限差异、异常与边界、变更记录 |
| `PAGE_FLOW.md` | 文档信息、目标、范围、入口与出口、主流程、分支流程、异常流程、跳转矩阵、变更记录 |
| `UI_REVIEW_CHECKLIST.md` | 文档信息、目标、范围、display review、acceptance review、结论、变更记录 |
| `DESIGN_TOKENS.md` | 文档信息、目标、范围、颜色、字体、间距、圆角、阴影、层级、断点、动效、变更记录 |
| `COMPONENT_GUIDELINES.md` | 文档信息、目标、范围、组件清单、变体规则、状态规则、组合规则、可访问性、变更记录 |
| `STATE_MATRIX.md` | 文档信息、目标、范围、页面状态矩阵、触发条件、动作与反馈、变更记录 |
| `DISPLAY_PROTOTYPE_SPEC.md` | 文档信息、目标、范围、展示叙事、信息隐藏规则、动作后置规则、非目标、变更记录 |
| `ACCEPTANCE_PROTOTYPE_SPEC.md` | 文档信息、目标、范围、状态覆盖规则、关键字段核对、门禁可见性、验收辅助信息、变更记录 |

### 步骤 1：范围与双轨约束对齐

- 提取 In Scope、Out of Scope、current change 边界。
- 生成页面候选清单，并排除范围外页面。
- 明确哪些信息属于共享基线，哪些只属于 display / acceptance 其中一轨。

### 步骤 2：构建共享页面与流程基线

- 产出 `SCREEN_INVENTORY.md`：页面编号、角色、入口、优先级、关联需求。
- 产出 `PAGE_FLOW.md`：主流程、分支流程、异常流程、跳转矩阵。
- 产出 `UI_DESIGN_SPEC.md`：布局结构、信息层级、共享字段展示、共享交互动作、权限差异。

### 步骤 3：构建 acceptance 强约束基线

- 产出 `STATE_MATRIX.md`：按页面列出 9 类状态的触发条件、展示与动作。
- 在 `ACCEPTANCE_PROTOTYPE_SPEC.md` 中定义：
  - 哪些状态必须显式可见
  - 哪些关键字段必须可核对
  - 哪些流程与边界态必须可被 `prototype-check` 消费
  - 哪些验收辅助信息允许出现

### 步骤 4：构建 display 展示轨基线

- 在 `DISPLAY_PROTOTYPE_SPEC.md` 中定义：
  - 主视觉与叙事优先级
  - 哪些实现字段与边界信息应隐藏或后置
  - 哪些动作只保留展示必需路径
  - 哪些内容不应显式暴露为“验收辅助信息”

### 步骤 5：构建设计系统与双轨评审清单

- 产出 `DESIGN_TOKENS.md`：颜色、字体、间距、圆角、阴影、层级、断点、动效规范。
- 产出 `COMPONENT_GUIDELINES.md`：组件变体、状态、禁用条件、组合规则、可访问性要求。
- 产出 `UI_REVIEW_CHECKLIST.md`：拆分为 `display review` 与 `acceptance review` 两组检查项。

### 步骤 6：交付下游输入

- 明确标注“共享基线由两轨共用，双轨差异以 `DISPLAY_PROTOTYPE_SPEC.md` 与 `ACCEPTANCE_PROTOTYPE_SPEC.md` 为准”。

## Quality Gate

- [ ] 已输出 9 份设计基线文档且路径正确。
- [ ] 页面与流程全部在 In Scope / `<current-change>` 内。
- [ ] 未出现超范围页面、字段、交互。
- [ ] `STATE_MATRIX.md` 覆盖 9 类状态且作为 acceptance 强约束输入。
- [ ] `DISPLAY_PROTOTYPE_SPEC.md` 已明确隐藏规则、动作后置规则与展示优先级。
- [ ] `ACCEPTANCE_PROTOTYPE_SPEC.md` 已明确状态覆盖、关键字段、门禁可见性要求。
- [ ] `UI_REVIEW_CHECKLIST.md` 已区分 display / acceptance 两类检查。
- [ ] 所有 `【待确认】` 与 `【设计推断】` 已显式标记并附依据。
- [ ] 输出可直接进入 `prototype-build`，无阻塞信息缺口。

## Example

示例：会员管理系统

输入：

- 需求：会员档案、等级规则、积分流水、权益发放、订单关联查询
- 范围：MVP 仅包含会员档案、等级、积分查询；自动营销与外部触达在 Out of Scope
- 变更：`<current-change>` 仅涉及“会员列表页 + 会员详情页 + 积分流水页”

输出思路：

1. 共享基线
- `SCREEN_INVENTORY.md` 登记 `SCR-MEMBER-001`、`SCR-MEMBER-002`、`SCR-POINTS-001`
- `PAGE_FLOW.md` 输出“会员列表 -> 会员详情 -> 积分流水”的主流程
- `UI_DESIGN_SPEC.md` 定义列表区、详情抽屉、流水分页区等共享结构

2. display 专用
- `DISPLAY_PROTOTYPE_SPEC.md` 规定：
  - 列表页优先展示会员核心画像，不显式暴露状态矩阵
  - 编辑失败提示只保留自然反馈，不暴露验收辅助文案
  - 积分流水仅保留展示叙事必需字段

3. acceptance 专用
- `ACCEPTANCE_PROTOTYPE_SPEC.md` 规定：
  - 3 个页面必须可演示 `loading`、`error`、`no-result` 等关键状态
  - 会员编辑流程的 `submit-success` / `submit-fail` 必须可检查
  - 关键字段口径需可与契约抽检对齐

4. 双轨评审
- `UI_REVIEW_CHECKLIST.md` 中 display 检查主视觉和叙事，acceptance 检查状态与门禁消费性。
