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
7. `docs/02-design/BACKOFFICE_UI_SPEC.md`（后台管理项目强制）
8. current change artifact（如项目启用 OpenSpec）：`<current-change>`
9. 现有设计稿/页面截图（如有）

输入降级策略：

- 缺少 `MVP_SCOPE.md` / `OUT_OF_SCOPE.md` / `<current-change>` 时，必须显式标注范围风险为 `【待确认】`。
- 对缺失但可合理补足的信息，可使用 `【设计推断】`，并注明依据来源。
- 涉及后台管理页面但缺少 `BACKOFFICE_UI_SPEC.md` 时，结论必须为 `BLOCKED`，并回退执行 `backoffice-ui-spec`。

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
10. `docs/02-design/MOCK_DATA_SPEC.md`

输出边界：

- 本 Skill 只输出设计基线文档，不直接输出 HTML/CSS 原型文件。
- 设计基线文档必须显式承载“产品体验目标与指标”，不得仅描述页面字段与布局。
- 后续原型必须可直接验证“产品体验目标与指标”，否则视为阻塞信息缺口。
- 设计基线文档必须显式承载体验目标编号，并建立 `UX-TARGET -> BUILD-RULE -> BO-RULE -> UX-BLOCK` 映射。

## 执行层级导读（Progressive Disclosure）

- `P0 必检（阻塞）`：范围边界、后台规则消费、体验目标映射、列表主视图结构约束齐备。
- `P1 扩展（覆盖）`：双轨专用文档、自动化可测性、评审清单映射齐备。
- `P2 参考（说明）`：示例与说明文本仅作参考，不得覆盖 `P0` 判定。
- 执行顺序必须为：先过 `P0 Gate`，再进入 `P1`；`P2` 不参与放行。

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
   - 必须在 `UI_REVIEW_CHECKLIST.md` 显式维护 `UX-TARGET -> BUILD-RULE -> BO-RULE -> UX-BLOCK` 映射表
   - 每个 `UX-TARGET` 必须有至少一条 `BUILD-RULE`、一条 `BO-RULE` 与一条 `UX-BLOCK` 对应项
15. 后台规范消费约束（强制）：
   - 涉及后台管理页面时，必须消费 `BACKOFFICE_UI_SPEC.md` 中 `BO-RULE-001~022`
   - `UI_DESIGN_SPEC.md` 必须逐页回写：页面目标、主任务、主/次/危险操作、字段映射、状态标签语义、反馈规则
   - `UI_DESIGN_SPEC.md` 必须逐页回写：筛选字段清单、查询与重置动作、主操作语义约束（是否含“选中/批量”）、选择机制声明、页面区块白名单
   - `UI_DESIGN_SPEC.md` 必须逐页回写：页面类型、布局模板、首屏主任务区块、主路径滚动预算、列表/维护解耦策略、工具栏顺序、筛选后分页重置规则
   - 当布局模板为 `列表主视图` 时，页面主结构必须为“筛选区 -> 结果区 -> 分页区”三段式
   - `列表主视图` 的结果区下方不允许定义业务工作台、处理卡片、迁移动作面板、评估面板、映射维护面板等下置业务处理区
   - 列表处理动作承载方式必须限定为：弹窗、独立处理页、同页 Tab；不允许与列表主流程并列抢焦点
   - `UI_DESIGN_SPEC.md` 必须逐页回写 `data-layout-template` 与 `data-block-id` 命名约束，供门禁脚本自动判定
   - `UI_REVIEW_CHECKLIST.md` 必须逐项回写 `BO-RULE-001~022` 的可判定检查项
16. 冷启动规则（强制）：
   - 若目标目录不存在，先创建目录。
   - 若目标文件不存在，按本 Skill 的最小章节结构创建完整文档。
   - 若目标文件状态为 `模板`，整文件覆盖为正式产物结构。
   - 若目标文件状态不为 `模板`，按章节标题增量更新，不按章节序号硬编码。
17. 自动化可测性约束（强制）：
   - 页面关键元素必须提供稳定选择器（推荐 `data-testid`）
   - 至少覆盖：导航项、主按钮、新建按钮、编辑按钮、筛选区、查询按钮、重置按钮、分页区、弹窗容器、状态标签
   - `data-testid` 命名建议：`<page-id>-<region>-<role>`（示例：`lvl-list-filter-query-btn`）
18. 自动化门禁对齐约束（强制）：
   - `UI_REVIEW_CHECKLIST.md` 必须补充“自动化检查映射表”
	 - 映射表至少包含：`检查项`、`选择器`、`预期行为`、`对应 BUILD-RULE`、`对应 BO-RULE`、`对应 UX-BLOCK`
19. 规则去重约束（强制）：
   - `Rules` 保留主定义，`Workflow` 与 `Quality Gate` 仅引用编号与结论，不重复长段规则文本。

## Workflow

### 步骤 0：初始化输出载体（冷启动）

- 确保 `docs/02-design/` 存在。
- 对 10 份输出文档执行初始化（缺失则创建、模板则覆盖）。

### 步骤 0.5：P0 Gate（阻塞）

- 校验范围边界输入（In Scope / Out of Scope / `<current-change>`）可用。
- 校验后台场景已具备 `BACKOFFICE_UI_SPEC.md`（含 `BO-RULE-001~022`）消费条件。
- 任一不满足时必须 `BLOCKED`，不得进入步骤 1~6。

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
| `MOCK_DATA_SPEC.md` | 文档信息、目标、范围、页面模拟数据清单、字段规则、数据量规则、状态覆盖、边界值覆盖、变更记录 |

### 步骤 1：范围与双轨约束对齐

- 提取 In Scope、Out of Scope、current change 边界。
- 生成页面候选清单，并排除范围外页面。
- 明确哪些信息属于共享基线，哪些只属于 display / acceptance 其中一轨。
- 若页面类型包含“后台管理”，必须读取并对齐 `BACKOFFICE_UI_SPEC.md` 的 `BO-RULE-001~022`；缺失则 `BLOCKED`。

### 步骤 2：构建共享页面与流程基线

- 产出 `SCREEN_INVENTORY.md`：页面编号、角色、入口、优先级、关联需求。
- 产出 `PAGE_FLOW.md`：主流程、分支流程、异常流程、跳转矩阵。
- 产出 `UI_DESIGN_SPEC.md`：布局结构、信息层级、共享字段展示、共享交互动作、权限差异。
- 对后台管理页面必须额外声明：
  - 页面类型（查看型 / 维护型 / 处理型）
  - 布局模板（列表主视图 / 表单主视图 / 双栏处理视图）
  - 页面是否为列表页
  - 分页策略
  - 筛选字段清单（至少 1 个）
  - 查询与重置动作（必须同时存在）
  - 新建/编辑交互载体（默认弹窗）
  - 页面目标与主任务（Top3）
  - 主操作（唯一）、次操作、危险操作
  - 主操作语义约束（文案若含“选中/批量”时必须声明选择机制）
  - 选择机制声明（无/单选/多选 + 已选反馈）
  - 技术字段与业务中文标签映射
  - 状态标签颜色语义、禁用态、可点击态
  - 空态/加载态/失败态/成功态反馈
  - 页面区块白名单（允许出现的功能卡片/区块）
  - 首屏主任务区块（首屏必须可见）
  - `data-layout-template`（列表主视图 / 表单主视图 / 双栏处理视图）
  - 当 `data-layout-template=列表主视图` 时，`data-block-id` 仅允许：`filter/query/result/table/pagination` 及其同义命名
  - 当 `data-layout-template=列表主视图` 时，`data-block-id` 不允许：`workbench/workspace/action-panel/processing-panel/migrate-panel/evaluation-panel/mapping-panel` 及其同义命名
  - 当 `data-layout-template=列表主视图` 时，禁入检测必须同时覆盖“命名枚举 + 语义识别”（评估/处理/迁移/映射/执行/工作台）
  - 当 `data-layout-template=列表主视图` 时，`data-block-whitelist` 不允许豁免禁入项
  - 主路径滚动预算（默认 <= 1 屏）
  - 列表/维护解耦策略（弹窗 / 抽屉 / Tab / 独立页）
  - 工具栏顺序（筛选 -> 结果 -> 分页）
  - 分页视觉一致性（强制）：统一容器结构 `table-footer + summary + pagination`
  - 筛选后分页重置规则（默认回到第 1 页）
  - 自动化定位选择器清单（`data-testid`）
- 对每个页面必须补充“产品体验目标与指标”：
  - `UX-TARGET-001` 关键任务路径（Top3 主任务）
  - `UX-TARGET-002` 首屏决策信息
  - `UX-TARGET-003` 交互效率指标（关键任务步数上限）
  - `UX-TARGET-004` 风险动作防呆（确认、可撤销、危险分级）
  - `UX-TARGET-005` 默认值与批量操作策略（如适用）
- 对每个页面必须补充“交互实现清单”：
  - 必须实现的交互（如：菜单高亮、页面跳转、按钮点击）
  - 可选实现的交互（如：表单校验、加载态模拟）
  - 不需要实现的交互（如：真实接口调用、业务逻辑）
- “交互实现清单”示例：
  - 页面：会员列表
  - 必须实现：
    - 菜单高亮
    - 页面跳转（查看详情）
    - 筛选查询与重置
    - 分页点击与数据更新（使用模拟数据）
    - 新建/编辑弹窗打开与关闭
    - 编辑弹窗预填当前行数据
    - 表单提交模拟（加载态 -> 成功态 -> 关闭弹窗 -> 刷新列表）
    - 表单取消
    - 批量操作（勾选 -> 批量按钮可用 -> 确认框 -> 执行）
  - 可选实现：
    - 表单字段级校验（如：手机号格式校验）
    - 表单提交失败模拟（失败态 -> 错误提示）
  - 不需要实现：
    - 真实接口调用
    - 真实业务逻辑
    - 真实数据持久化

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
- `COMPONENT_GUIDELINES.md` 必须新增组件库映射表：
  - 映射目标组件库统一采用 `Element Plus`
  - 映射表至少包含：设计组件、组件库、组件名称、属性映射、样式覆盖、说明
  - 示例映射：
    - 主按钮 -> `Element Plus` -> `ElButton` -> `type="primary"`
    - 次按钮 -> `Element Plus` -> `ElButton` -> `type="default"`
    - 危险按钮 -> `Element Plus` -> `ElButton` -> `type="danger"`
    - 表格 -> `Element Plus` -> `ElTable`
    - 分页 -> `Element Plus` -> `ElPagination`
    - 状态标签 -> `Element Plus` -> `ElTag`
    - 弹窗 -> `Element Plus` -> `ElDialog`
    - 表单 -> `Element Plus` -> `ElForm`
  - 若组件库无法满足设计要求，必须在 `COMPONENT_GUIDELINES.md` 中标记 `【需要自定义】`
- 产出 `UI_REVIEW_CHECKLIST.md`：拆分为 `display review` 与 `acceptance review` 两组检查项，并包含分页与新建/编辑交互形态检查。
- 在 `UI_REVIEW_CHECKLIST.md` 中必须新增体验闭环映射表：
  - `UX-TARGET-001 -> BUILD-RULE-001/007 -> BO-RULE-001/008 -> UX-BLOCK-001/004`
  - `UX-TARGET-002 -> BUILD-RULE-005/009 -> BO-RULE-001/010 -> UX-BLOCK-003/006`
  - `UX-TARGET-003 -> BUILD-RULE-005/008 -> BO-RULE-002/009 -> UX-BLOCK-003/005`
  - `UX-TARGET-004 -> BUILD-RULE-004/006 -> BO-RULE-003/006 -> UX-BLOCK-003`
  - `UX-TARGET-005 -> BUILD-RULE-007/008 -> BO-RULE-004/009 -> UX-BLOCK-004/005`
- 在 `UI_REVIEW_CHECKLIST.md` 中必须新增后台 Fail-fast 清单（`BO-RULE-001~010`），任一缺失标记为阻塞。
- 在 `UI_REVIEW_CHECKLIST.md` 中必须新增后台排版 Fail-fast 清单（`BO-RULE-011~022`），任一缺失标记为阻塞。
- 在 `UI_REVIEW_CHECKLIST.md` 中必须新增“自动化视觉/点击检查映射”：
  - 导航选中态 -> `BUILD-RULE-005` / `BO-RULE-001/002` / `UX-BLOCK-005`
  - 新建/编辑弹窗 -> `BUILD-RULE-002/003/004` / `BO-RULE-002/007` / `UX-BLOCK-002/003`
  - 筛选查询重置 -> `BUILD-RULE-007` / `BO-RULE-008` / `UX-BLOCK-004`
  - 分页交互 -> `BUILD-RULE-001` / `BO-RULE-008` / `UX-BLOCK-001`
  - 主操作语义一致性 -> `BUILD-RULE-008` / `BO-RULE-009` / `UX-BLOCK-005`
  - 页面类型匹配 -> `BUILD-RULE-010` / `BO-RULE-011` / `UX-BLOCK-009`
  - 首屏主任务可见 -> `BUILD-RULE-010` / `BO-RULE-012` / `UX-BLOCK-007`
  - 列表主视图下置业务处理区禁止（含前置重表单压制） -> `BUILD-RULE-011` / `BO-RULE-013/017` / `UX-BLOCK-008`
  - 跨屏依赖禁止 -> `BUILD-RULE-013` / `BO-RULE-014` / `UX-BLOCK-008`
  - 双主流程冲突 -> `BUILD-RULE-015` / `BO-RULE-015` / `UX-BLOCK-010`
  - 分页语义与重置 -> `BUILD-RULE-014` / `BO-RULE-021/022` / `UX-BLOCK-011/012`

### 步骤 5.5：定义模拟数据规范

- 产出 `MOCK_DATA_SPEC.md`，至少包含：
  - 每个页面的模拟数据清单
  - 每个字段的模拟数据规则（类型、长度、边界值）
  - 列表数据量规则（最少、最多、典型）
  - 状态覆盖规则（每个状态至少 1 条数据）
  - 边界值覆盖规则（最小值、最大值、空值、特殊字符）
- 模拟数据规范示例：
  - 页面：会员列表
  - 字段：`member_name`
    - 数据类型：`string`
    - 最小长度：`2`
    - 最大长度：`50`
    - 边界值：`张三`（2字符）、`这是一个非常非常长的会员名称用于测试溢出情况`（50字符）
    - 典型值：`张三`、`李四`、`王五`
  - 字段：`member_level`
    - 数据类型：`enum`
    - 边界值：`1/2/3`
    - 典型值：`1（普通会员）`、`2（银卡会员）`、`3（金卡会员）`
  - 字段：`member_points`
    - 数据类型：`decimal`
    - 边界值：`0.00`、`999999.99`
    - 典型值：`100.00`、`1000.00`、`10000.00`
  - 字段：`member_status`
    - 数据类型：`enum`
    - 边界值：`1/2/3`
    - 典型值：`1（正常）`、`2（冻结）`、`3（注销）`
- 列表数据量规则示例：
  - 会员列表：最少 `0`（空态）、最多 `100`（分页）、典型 `20`（首页）
  - 积分流水：最少 `0`（空态）、最多 `50`（分页）、典型 `10`（首页）
- 状态覆盖规则示例：
  - 会员列表：正常 `>=10`、冻结 `>=2`、注销 `>=1`

### 步骤 6：交付下游输入

- 明确标注“共享基线由两轨共用，双轨差异以 `DISPLAY_PROTOTYPE_SPEC.md` 与 `ACCEPTANCE_PROTOTYPE_SPEC.md` 为准”。

## Quality Gate（分层）

### P0 Gate（阻塞，最小必检）

- [ ] 页面与流程全部在 In Scope / `<current-change>` 内。
- [ ] 后台管理页面已消费 `BACKOFFICE_UI_SPEC.md`，并覆盖 `BO-RULE-001~022`。
- [ ] `列表主视图` 已声明三段式结构（筛选区 -> 结果区 -> 分页区）；缺失即阻塞。
- [ ] `列表主视图` 已声明禁止下置业务处理区（workbench/workspace/action-panel/processing-panel/migrate-panel/evaluation-panel/mapping-panel）；命中即阻塞。
- [ ] 已声明“命名枚举 + 语义识别”禁入检测，且 `data-block-whitelist` 不得豁免禁入项；不满足即阻塞。
- [ ] 已声明分页视觉一致性强制门禁（`table-footer + summary + pagination`）；不满足即阻塞。
- [ ] 列表处理动作承载已限定为弹窗/独立处理页/同页 Tab；未限定即阻塞。
- [ ] `UI_REVIEW_CHECKLIST.md` 已建立 `UX-TARGET -> BUILD-RULE -> BO-RULE -> UX-BLOCK` 映射，且无断链；任一断链即阻塞。

### P1 Coverage Checklist（扩展覆盖）

- [ ] 已输出 10 份设计基线文档且路径正确。
- [ ] 未出现超范围页面、字段、交互。
- [ ] `STATE_MATRIX.md` 覆盖 9 类状态且作为 acceptance 强约束输入。
- [ ] `DISPLAY_PROTOTYPE_SPEC.md` 已明确隐藏规则、动作后置规则与展示优先级。
- [ ] `ACCEPTANCE_PROTOTYPE_SPEC.md` 已明确状态覆盖、关键字段、门禁可见性要求。
- [ ] `UI_REVIEW_CHECKLIST.md` 已区分 display / acceptance 两类检查。
- [ ] 后台管理列表页已声明分页策略，未出现“由原型阶段自行决定是否分页”。
- [ ] 后台管理列表页已声明筛选字段清单，且包含“查询+重置”动作。
- [ ] 后台管理新建/编辑已声明交互载体，默认弹窗，例外情况有明确依据。
- [ ] 主操作文案含“选中/批量”的页面已声明选择机制与已选反馈口径。
- [ ] 每个页面已声明页面区块白名单，未声明区块不得进入原型生成。
- [ ] 每个页面关键元素已声明自动化定位选择器（`data-testid` 或等价稳定选择器）。
- [ ] `UI_REVIEW_CHECKLIST.md` 已包含自动化视觉/点击检查映射表，且与 `BUILD-RULE/BO-RULE/UX-BLOCK` 对齐。
- [ ] 每个页面已声明页面类型与布局模板匹配关系；不匹配项已标阻塞。
- [ ] 每个页面已声明首屏主任务区块与主路径滚动预算（默认 <= 1 屏）。
- [ ] 列表页已声明列表/维护解耦策略，避免“上重表单下长列表”强耦合。
- [ ] 列表页已声明工具栏顺序与筛选后分页重置规则。
- [ ] 每个页面已定义 `UX-TARGET-001/002/003/004/005` 对应内容；任一缺失即阻塞。
- [ ] 设计基线产物可被后续原型直接验证上述体验目标与指标；若无法验证，结论必须为 FAIL 且阻塞进入下游。
- [ ] 所有 `【待确认】` 与 `【设计推断】` 已显式标记并附依据。
- [ ] 输出可直接进入 `prototype-build`，无阻塞信息缺口。
- [ ] 已输出 `MOCK_DATA_SPEC.md` 且包含每个页面的模拟数据规范。
- [ ] 模拟数据规范已覆盖典型值、边界值、空值、特殊字符。
- [ ] 模拟数据规范已定义列表数据量规则（最少、最多、典型）。
- [ ] 模拟数据规范已定义状态覆盖规则（每个状态至少 1 条数据）。
- [ ] `COMPONENT_GUIDELINES.md` 已包含组件库映射表。
- [ ] 组件库映射表已明确每个设计组件对应的组件库组件。
- [ ] 若组件库无法满足设计要求，已在 `COMPONENT_GUIDELINES.md` 中标记 `【需要自定义】`。
- [ ] 每个页面已定义交互实现清单（必须实现、可选实现、不需要实现）。

### P2 Reference Checklist（参考）

- [ ] Example 与说明文本已更新，且不改变 `P0` 门禁口径。

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
- `UX-TARGET-001`（关键任务路径） -> `BUILD-RULE-001`（分页区完整） -> `BO-RULE-008`（表格/筛选/分页闭环） -> `UX-BLOCK-001`（分页覆盖缺失）
- `UX-TARGET-003`（步数上限） -> `BUILD-RULE-005`（关键路径无断链/无死路返回/无隐藏入口） -> `BO-RULE-002/007`（主按钮唯一/反馈闭环） -> `UX-BLOCK-003`（编辑闭环缺失）

## 版本信息

- 当前版本：v1.9.0
- 更新时间：2026-04-03

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| v1.9.0 | 2026-04-03 | 【修改】新增“白名单不可豁免禁入项”与“命名枚举 + 语义识别”禁入口径；将分页视觉一致性（`table-footer + summary + pagination`）提升为强制门禁。 |
| v1.8.0 | 2026-04-03 | 【修改】按 Progressive Disclosure 重排：新增 `P0/P1/P2` 导读、`P0 Gate` 阻塞前置、分层 Quality Gate，并约束 Workflow/Quality Gate 采用规则编号引用。 |
| v1.7.0 | 2026-04-03 | 【修改】新增列表主视图三段式与下置业务处理区禁入硬约束，强制回写 `data-layout-template/data-block-id` 规则，直连 `BUILD-RULE-011`、`BO-RULE-013/017`、`UX-BLOCK-008`。 |
| v1.6.0 | 2026-04-03 | 【修改】接入 `BO-RULE-011~022` 后台排版治理：页面类型匹配、首屏可见、滚动预算、解耦策略、分页语义与重置规则。 |
| v1.5.0 | 2026-04-03 | 【修改】新增自动化可测性约束：关键元素稳定选择器（`data-testid`）与自动化视觉/点击检查映射表。 |
| v1.4.0 | 2026-04-03 | 【修改】接入 `BO-RULE-009/010`，新增后台筛选闭环、主操作语义一致性、页面区块白名单的设计输入强约束。 |
| v1.3.0 | 2026-04-03 | 【修改】接入 `BACKOFFICE_UI_SPEC.md` 与 `BO-RULE-001~008`，新增后台 Fail-fast 消费与 `UX-TARGET -> BUILD-RULE -> BO-RULE -> UX-BLOCK` 映射。 |
| v1.2.0 | 2026-04-02 | 【修改】新增 UX-TARGET 编号与 `UX-TARGET -> BUILD-RULE -> UX-BLOCK` 闭环映射规则，强化追溯与门禁一致性。 |
| v1.1.0 | 2026-04-02 | 【修改】补强产品体验目标与指标，新增可验证性与阻塞/FAIL 门禁约束。 |
