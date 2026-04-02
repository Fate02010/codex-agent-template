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
- 设计基线文档必须显式承载“产品体验目标与指标”，不得仅描述页面字段与布局。
- 后续原型必须可直接验证“产品体验目标与指标”，否则视为阻塞信息缺口。
- 设计基线文档必须显式承载体验目标编号，并建立 `UX-TARGET -> BUILD-RULE -> UX-BLOCK` 映射。

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
12. 后台管理共享基线硬约束：
   - 后台管理列表页默认必须分页
   - 后台管理“新建 / 编辑”默认必须使用弹窗
   - 若采用抽屉或独立页，必须在 `UI_DESIGN_SPEC.md`、`SCREEN_INVENTORY.md`、`PAGE_FLOW.md` 中显式声明交互载体与依据
   - 若列表页不分页，必须在共享基线中显式声明原因，不得由下游原型阶段自行推断
13. 产品体验目标与指标（强制）：
   - `UX-TARGET-001`：每个页面必须定义关键任务路径，且必须给出页面 Top3 主任务
   - `UX-TARGET-002`：每个页面必须定义首屏决策信息，明确首屏必须看到什么信息才能做下一步决策
   - `UX-TARGET-003`：每条关键任务路径必须定义交互效率指标，明确关键任务步数上限
   - `UX-TARGET-004`：每个危险动作必须定义风险动作防呆策略，至少包含确认、可撤销、危险分级
   - `UX-TARGET-005`：每个适用页面必须定义默认值与批量操作策略，明确默认值来源、批量入口和批量反馈
14. 体验目标追溯映射（强制）：
   - 必须在 `UI_REVIEW_CHECKLIST.md` 显式维护 `UX-TARGET -> BUILD-RULE -> UX-BLOCK` 映射表
   - 每个 `UX-TARGET` 必须有至少一条 `BUILD-RULE` 与一条 `UX-BLOCK` 对应项
15. 冷启动规则（强制）：
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
- 对后台管理页面必须额外声明：
  - 页面是否为列表页
  - 分页策略
  - 新建/编辑交互载体（默认弹窗）
- 对每个页面必须补充“产品体验目标与指标”：
  - `UX-TARGET-001` 关键任务路径（Top3 主任务）
  - `UX-TARGET-002` 首屏决策信息
  - `UX-TARGET-003` 交互效率指标（关键任务步数上限）
  - `UX-TARGET-004` 风险动作防呆（确认、可撤销、危险分级）
  - `UX-TARGET-005` 默认值与批量操作策略（如适用）

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
- 产出 `UI_REVIEW_CHECKLIST.md`：拆分为 `display review` 与 `acceptance review` 两组检查项，并包含分页与新建/编辑交互形态检查。
- 在 `UI_REVIEW_CHECKLIST.md` 中必须新增体验闭环映射表：
  - `UX-TARGET-001 -> BUILD-RULE-001/002 -> UX-BLOCK-001`
  - `UX-TARGET-002 -> BUILD-RULE-005 -> UX-BLOCK-003`
  - `UX-TARGET-003 -> BUILD-RULE-005 -> UX-BLOCK-003`
  - `UX-TARGET-004 -> BUILD-RULE-004/006 -> UX-BLOCK-003`
  - `UX-TARGET-005 -> BUILD-RULE-001/005 -> UX-BLOCK-001/003`

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
- [ ] 后台管理列表页已声明分页策略，未出现“由原型阶段自行决定是否分页”。
- [ ] 后台管理新建/编辑已声明交互载体，默认弹窗，例外情况有明确依据。
- [ ] 每个页面已定义 `UX-TARGET-001/002/003/004/005` 对应内容；任一缺失即阻塞。
- [ ] `UI_REVIEW_CHECKLIST.md` 已建立 `UX-TARGET -> BUILD-RULE -> UX-BLOCK` 映射，且无断链；任一断链即阻塞。
- [ ] 设计基线产物可被后续原型直接验证上述体验目标与指标；若无法验证，结论必须为 FAIL 且阻塞进入下游。
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

5. 后台管理页体验目标示例
- 列表页主任务（Top3）：筛选会员、定位会员、执行行内编辑
- 首屏关键决策信息：会员状态分布、当页数量与总数、高风险状态告警
- 新建/编辑维护动作：新建与编辑均定义为弹窗流程，且编辑承接行内入口
- 风险动作与防呆：禁用/删除等危险操作必须二次确认、支持可撤销、按危险分级展示
- 批量操作或默认值策略：默认筛选条件必须显式定义，批量启用/停用必须定义入口与批量反馈

6. 体验闭环映射示例
- `UX-TARGET-001`（关键任务路径） -> `BUILD-RULE-001`（分页区完整） -> `UX-BLOCK-001`（分页覆盖缺失）
- `UX-TARGET-003`（步数上限） -> `BUILD-RULE-005`（关键路径无断链/无死路返回/无隐藏入口） -> `UX-BLOCK-003`（编辑闭环缺失）

## 版本信息

- 当前版本：v1.2.0
- 更新时间：2026-04-02

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| v1.2.0 | 2026-04-02 | 【修改】新增 UX-TARGET 编号与 `UX-TARGET -> BUILD-RULE -> UX-BLOCK` 闭环映射规则，强化追溯与门禁一致性。 |
| v1.1.0 | 2026-04-02 | 【修改】补强产品体验目标与指标，新增可验证性与阻塞/FAIL 门禁约束。 |
