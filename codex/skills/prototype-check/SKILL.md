---
name: prototype-check
description: 当 acceptance 高保真原型已构建、需要在开发前执行原型验收门禁并判断是否允许进入 dev-implement 时触发；不用于生成原型、修复原型或替代功能测试执行。
---

# Skill: prototype-check — 原型验收门禁

## Purpose

对 acceptance 高保真原型执行开发前验收门禁，检查视觉质量、页面流质量、状态质量与范围一致性，并给出是否允许进入 `dev-implement` 的明确建议。

本 Skill 以 acceptance 为主门禁对象，同时对 display / acceptance 两侧执行量化判定；凡影响 `readable/actionable` 的视觉问题均可触发 FAIL。

## When to Use

- `prototype-build` 已输出 acceptance 原型，准备进入开发前验收。
- 增量迭代中页面改造完成，需要判断 acceptance 是否可进入实现。
- 需要基于需求/设计/契约对 acceptance 原型做结构化差异审查。

## When Not to Use

- 生成或更新 HTML/CSS 原型（使用 `prototype-build` / `prototype-rectify`）。
- 编写 UI 设计基线（使用 `ui-design-spec`）。
- 用 `display` 原型直接替代开发前门禁。
- 替代功能测试执行、性能压测或接口联调。

## Inputs

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/01-requirements/MVP_SCOPE.md`
3. `docs/01-requirements/OUT_OF_SCOPE.md`
4. `docs/02-design/UI_DESIGN_SPEC.md`
5. `docs/02-design/SCREEN_INVENTORY.md`
6. `docs/02-design/PAGE_FLOW.md`
7. `docs/02-design/DESIGN_TOKENS.md`
8. `docs/02-design/COMPONENT_GUIDELINES.md`
9. `docs/02-design/STATE_MATRIX.md`
10. `docs/02-design/DISPLAY_PROTOTYPE_SPEC.md`
11. `docs/02-design/ACCEPTANCE_PROTOTYPE_SPEC.md`
12. `docs/02-design/BACKOFFICE_UI_SPEC.md`（后台管理页面强制）
13. `docs/02-architecture/API_CONTRACT.md`
14. `frontend/design-prototype/acceptance/*.html`
15. `frontend/design-prototype/acceptance/assets/*.css`
16. current change artifact（如项目启用 OpenSpec）：`<current-change>`

可选参考输入：

- `frontend/design-prototype/display/*.html`
- `frontend/design-prototype/display/assets/*.css`

输入降级策略：

- 缺失 acceptance 原型时，直接输出“不允许进入 `dev-implement`”。
- display 原型仅作为一致性参考，不作为主门禁对象。
- 涉及后台管理页面但缺少 `BACKOFFICE_UI_SPEC.md` 时，结论必须为 FAIL 并阻塞进入 `dev-implement`。

## Outputs

1. `docs/02-design/PROTOTYPE_CHECK_REPORT.md`

报告必须包含：

- 主门禁结论（是否允许 acceptance 进入 `dev-implement`）
- 问题分级统计（阻塞/重要/建议）
- 问题明细与修复建议
- display 与 acceptance 两侧的可判定问题证据

## Rules

1. 默认只检查本次范围与 `<current-change>`，不做无边界全站巡检。
2. 问题级别固定为：`阻塞（Blocker）`、`重要（Major）`、`建议（Minor/Suggestion）`。
3. 每条问题必须包含以下字段：
   - 问题编号
   - 问题级别
   - 问题类型
   - 页面编号/页面名称
   - 断点（breakpoint）
   - 关联 UX-TARGET
   - 关联 BUILD-RULE
   - 关联 BO-RULE
   - 问题描述
   - 问题定位描述（元素/区域/状态）
   - 影响
   - 建议修复
   - 证据（截图引用 / 可复现命令 / 复现步骤，至少一项）
   - 是否阻塞进入 `dev-implement`
4. 主门禁检查对象固定为 acceptance 原型；同时 display 必须纳入视觉几何量化门禁。
5. 视觉检查清单（layout deformation / geometric consistency）必须逐页面逐断点执行：
   - 横向滚动
   - 错位
   - 重叠
   - 文本溢出
   - 不可点击 / 点击区域异常
   - 表格压缩不可读
   - 按钮 / 输入框高度异常
   - 关键区域不可见或被遮挡
6. 以下情况必须直接判定 FAIL：
   - 任一关键页面在任一断点出现视觉变形，且影响 readable/actionable
   - `display` 或 `acceptance` 任一侧主流程页面不可读或不可操作
   - 影响主路径完成的 display 视觉问题
7. display 门禁升级：
   - display 不再只是观察项
   - 只要影响 readable/actionable，必须进入主问题清单并可判定为阻塞
8. 重点检查维度：
   - acceptance 与 `ACCEPTANCE_PROTOTYPE_SPEC.md` 的一致性
   - 页面流与跳转完整性
   - 状态覆盖完整性
   - 范围一致性（MVP 与 current change）
   - 契约一致性（关键字段与 API 展示口径）
   - 后台管理列表页分页完整性
   - 后台管理新建/编辑交互形态一致性
9. 允许新增问题类型：
   - `双轨漂移`
   - `展示过曝`
   - `验收缺失`
10. 体验门禁阻塞类型（固定）：
   - `UX-BLOCK-001`：分页覆盖缺失（对应 `BUILD-RULE-001`，追溯 `UX-TARGET-001/005`）
   - `UX-BLOCK-002`：新建/编辑未使用模拟态弹窗（对应 `BUILD-RULE-002/003`，追溯 `UX-TARGET-001/004`）
   - `UX-BLOCK-003`：编辑弹窗无预填或无反馈闭环（对应 `BUILD-RULE-004/005/006`，追溯 `UX-TARGET-002/003/004`）
   - `UX-BLOCK-004`：列表筛选闭环缺失（对应 `BUILD-RULE-007`，追溯 `UX-TARGET-001/005`）
   - `UX-BLOCK-005`：主操作语义与选择机制不一致（对应 `BUILD-RULE-008`，追溯 `UX-TARGET-003/005`）
   - `UX-BLOCK-006`：页面区块越界（对应 `BUILD-RULE-009`，追溯 `UX-TARGET-002/003`）
11. 命中 `UX-BLOCK-001~006` 任一项时，结论必须为 FAIL，且不允许进入 `dev-implement`。
12. `UX-BLOCK-003` 判定必须同时覆盖以下项：
   - 编辑弹窗无预填当前行数据
   - 缺少字段级校验反馈
   - 缺少全局失败反馈
   - 缺少提交成功状态回写
13. 命中任一 `UX-BLOCK` 后，必须立即结束准入判定并输出“FAIL，且不允许进入 `dev-implement`”，不得继续以其他通过项抵消。
14. 后台可冻结门禁（Fail-fast）：
   - `BO-RULE-001` 信息层级清晰：页面目标/主任务/首屏决策信息缺失即 FAIL
   - `BO-RULE-002` 主按钮唯一：同层多个主按钮或位置不一致即 FAIL
   - `BO-RULE-005` 文案中文化：技术字段直出（如 `from_status`、`to_status`、`biz_id`、`user_id`）即 FAIL
   - `BO-RULE-006` 状态可辨识：颜色语义/禁用态/可点击态任一缺失即 FAIL
   - `BO-RULE-008` 表格闭环：筛选/表格/分页任一关键要素缺失即 FAIL
   - `BO-RULE-009` 主操作语义一致：主按钮文案含“选中/批量”但无选择机制或已选反馈即 FAIL
   - `BO-RULE-010` 页面区块白名单：出现未声明功能卡片/区块即 FAIL
15. 命中任一后台 Fail-fast 门禁项时，必须直接判定 `阻塞（Blocker）`，不得降级为建议。
16. 主问题清单中的阻塞项必须填写关联 `UX-TARGET`、关联 `BUILD-RULE` 与关联 `BO-RULE` 字段。
17. 无法确认的信息必须标记 `【待确认】`。
18. 基于上下文推断的结论必须标记 `【推断】`。
19. 不得仅以“HTML 可打开”作为通过依据。
20. 后台管理硬门禁：
   - 后台管理列表页缺少分页组件，直接判定 FAIL
   - 后台管理新建/编辑未按设计基线呈现为弹窗，且上游文档未显式声明抽屉/独立页例外时，直接判定 FAIL
   - 例外必须能在 `UI_DESIGN_SPEC.md`、`SCREEN_INVENTORY.md`、`PAGE_FLOW.md` 中找到一致依据
21. 冷启动规则（强制）：
   - 若目标目录不存在，先创建目录。
   - 若 `PROTOTYPE_CHECK_REPORT.md` 不存在，按本 Skill 内置结构创建完整报告。
   - 若报告状态为 `模板`，整文件覆盖为正式产物结构。
   - 若报告状态不为 `模板`，按章节标题增量更新，不按章节序号硬编码。

## Workflow

### 步骤 0：初始化输出载体（冷启动）

- 确保 `docs/02-design/` 存在。
- 初始化 `PROTOTYPE_CHECK_REPORT.md`（缺失则创建、模板则覆盖）。

`PROTOTYPE_CHECK_REPORT.md` 最小结构：

```markdown
# 原型验收门禁报告

## 文档信息
- 文档类型：产物
- 生成 Skill：`prototype-check`
- 上游输入：需求边界文档、设计基线文档、acceptance 原型文件
- 版本：vX.Y
- 日期：YYYY-MM-DD
- 状态：草稿 / 已冻结

## 1. 主门禁结论
- 是否允许进入 `dev-implement`：是 / 否
- 结论级别：PASS / FAIL
- 结论依据：

## 2. 问题分级统计
| 级别 | 数量 |
|---|---|
| 阻塞 | 0 |
| 重要 | 0 |
| 建议 | 0 |

## 3. 问题清单（按 阻塞 > 重要 > 建议）
| 问题编号 | 问题级别 | 问题类型 | 侧别（display/acceptance） | 页面编号/页面名称 | 断点 | 关联 UX-TARGET | 关联 BUILD-RULE | 关联 BO-RULE | 问题定位描述 | 问题描述 | 影响 | 建议修复 | 证据 | 是否阻塞进入 dev-implement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## 3.1 体验门禁阻塞类型（固定）
| 编号 | 类型 | 判定条件 | 结论 |
|---|---|---|---|
| UX-BLOCK-001 | 分页覆盖缺失 | 含列表页面未覆盖分页区或缺少总数/当前页/页码/上一页/下一页任一元素 | FAIL（阻塞） |
| UX-BLOCK-002 | 交互载体不符 | 新建/编辑未使用模拟态弹窗，或跳转独立编辑页 | FAIL（阻塞） |
| UX-BLOCK-003 | 编辑闭环缺失 | 编辑弹窗未预填当前行数据，或缺少字段级校验反馈/全局失败反馈/提交成功状态回写任一项 | FAIL（阻塞） |
| UX-BLOCK-004 | 筛选闭环缺失 | 含列表页面缺少筛选字段，或缺少查询/重置动作任一项 | FAIL（阻塞） |
| UX-BLOCK-005 | 语义一致性缺失 | 主操作文案含“选中/批量”但无选择机制或已选反馈 | FAIL（阻塞） |
| UX-BLOCK-006 | 页面区块越界 | 页面出现未在白名单声明的功能卡片/区块 | FAIL（阻塞） |

## 3.2 后台可冻结门禁（Fail-fast）
| 编号 | 门禁项 | 判定条件 | 结论 |
|---|---|---|---|
| BO-RULE-001 | 信息层级清晰 | 页面目标/主任务/首屏决策信息缺失任一项 | FAIL（阻塞） |
| BO-RULE-002 | 主按钮唯一且位置一致 | 同层多个主按钮或位置不一致 | FAIL（阻塞） |
| BO-RULE-005 | 文案中文化且术语统一 | 技术字段直出或术语不一致 | FAIL（阻塞） |
| BO-RULE-006 | 状态可辨识 | 缺少颜色语义/禁用态/可点击态任一项 | FAIL（阻塞） |
| BO-RULE-008 | 表格/筛选/分页闭环 | 缺筛选、表格或分页关键元素任一项 | FAIL（阻塞） |
| BO-RULE-009 | 主操作语义一致 | 主按钮文案含“选中/批量”但无选择机制或已选反馈 | FAIL（阻塞） |
| BO-RULE-010 | 页面区块白名单 | 出现未声明的功能卡片/区块 | FAIL（阻塞） |

## 4. 非门禁观察（display，可选）
| 编号 | 类型 | 页面 | 观察项 | 影响 | 建议 |
|---|---|---|---|---|---|

## 5. 待确认与推断

## 6. 下一步建议

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

### 步骤 1：建立验收边界

- 读取 MVP、Out of Scope、`<current-change>`，确定检查范围页面。
- 以 `SCREEN_INVENTORY.md` 作为页面主清单。
- 锁定主门禁对象为 `frontend/design-prototype/acceptance/**`。

### 步骤 2：执行 acceptance 核心检查

1. 视觉质量检查：对齐 `DESIGN_TOKENS.md` 与 `COMPONENT_GUIDELINES.md`。
2. 页面流质量检查：对齐 `PAGE_FLOW.md`，检查主流程与异常回路。
3. 状态质量检查：对齐 `STATE_MATRIX.md` 与 `ACCEPTANCE_PROTOTYPE_SPEC.md`，核对关键状态落地。
4. 范围一致性检查：核对是否超出 `MVP_SCOPE.md` 与 `<current-change>`。
5. 对关键页面执行强制断点覆盖（breakpoint coverage）：`1440`、`1200`、`992`、`768`、`375`。
6. 量化核对 layout deformation / geometric consistency：横向滚动、错位、重叠、文本溢出、不可点击、表格不可读、控件高度异常、关键区域遮挡。
7. 对后台管理页面补充专项检查：
   - 列表型页面是否存在分页组件，分页位置与交互是否可见可用
   - 列表型页面筛选区是否存在，且具备查询与重置动作
   - “新建 / 编辑”动作是否采用设计基线声明的交互载体（默认弹窗）
   - 若声明为抽屉或独立页，页面流和跳转矩阵中是否存在一致证据
   - 页面目标、主任务、首屏决策信息是否完整
   - 主按钮是否唯一且位置一致
   - 主操作文案含“选中/批量”时是否具备选择机制与已选反馈
   - 文案是否中文业务化、是否存在技术字段直出
   - 状态标签是否定义颜色语义、禁用态、可点击态
   - 是否存在筛选-表格-分页闭环
   - 页面区块是否全部在白名单声明
8. 对体验门禁阻塞项执行专项检查：
   - `UX-BLOCK-001`：检查分页覆盖是否完整（总数、当前页、页码、上一页、下一页）
   - `UX-BLOCK-002`：检查新建/编辑是否使用模拟态弹窗且未跳独立编辑页
   - `UX-BLOCK-003`：检查编辑弹窗是否预填当前行数据，且具备字段级校验反馈、全局失败反馈、提交成功状态回写闭环
9. 对关键路径效率执行专项检查：
   - 关键任务路径必须无断链、无死路返回、无隐藏入口
   - 关键任务步数必须不超过上游 `UX-TARGET-003` 定义的上限

### 步骤 3：执行契约一致性抽检

- 对关键页面字段展示与 `API_CONTRACT.md` 做一致性抽检。
- 标记“页面口径与契约口径不一致”问题。

### 步骤 4：执行 display 量化门禁检查

- 若存在 display 原型，检查其与 acceptance 的核心业务路径是否一致。
- 对 display 同步执行强制断点覆盖（`1440/1200/992/768/375`）与视觉检查清单。
- display 若影响 readable/actionable，必须写入主问题清单，且可直接判定 FAIL。
- display 仅可保留不影响主路径的观察项到“非门禁观察”章节。

### 步骤 5：输出问题清单

- 按 `阻塞 > 重要 > 建议` 顺序整理问题。
- 主问题清单覆盖 acceptance 与 display 两侧可阻塞问题。
- 每条问题必须带页面、断点、关联 `UX-TARGET`、关联 `BUILD-RULE`、关联 `BO-RULE`、定位描述与证据。
- 仅不影响 readable/actionable 的 display 事项可单列为“非门禁观察”。
- 必须优先使用固定阻塞编号输出体验门禁问题：
  - `UX-BLOCK-001`（分页覆盖缺失）
  - `UX-BLOCK-002`（新建/编辑未使用模拟态弹窗）
  - `UX-BLOCK-003`（编辑弹窗无预填或无反馈闭环）
  - `UX-BLOCK-004`（列表筛选闭环缺失）
  - `UX-BLOCK-005`（主操作语义与选择机制不一致）
  - `UX-BLOCK-006`（页面区块越界）
  - `BO-RULE-001/002/005/006/008/009/010`（后台可冻结门禁 Fail-fast）
- 其余问题类型可继续使用：
  - `双轨漂移`
  - `展示过曝`
  - `验收缺失`

### 步骤 6：输出门禁结论

- 生成 `PROTOTYPE_CHECK_REPORT.md`。
- 明确写出：
  - acceptance 是否允许进入 `dev-implement`（是/否）
  - 若 acceptance 缺失或不合格，建议执行 `prototype-build` / `prototype-rectify`
- 命中任一 FAIL 条件时，结论级别必须为 FAIL，不得降级为观察项。
- 命中 `UX-BLOCK-001~006` 任一项时，必须写明“阻塞，且不允许进入 `dev-implement`”。
- 命中任一后台 Fail-fast 门禁项（`BO-RULE-001/002/005/006/008/009/010`）时，必须写明“阻塞，且不允许进入 `dev-implement`”。
- 命中任一 `UX-BLOCK` 后必须立即结束准入判定，不得继续输出“有条件通过”或等价结论。
- 命中任一后台 Fail-fast 门禁项后必须立即结束准入判定，不得继续输出“有条件通过”或等价结论。

## Quality Gate

- [ ] 已输出 `PROTOTYPE_CHECK_REPORT.md` 且问题字段完整。
- [ ] 主门禁对象为 acceptance，且 display 已执行量化门禁检查。
- [ ] acceptance 与 `UI_DESIGN_SPEC.md`、`PAGE_FLOW.md`、`SCREEN_INVENTORY.md` 一致。
- [ ] acceptance 与 `STATE_MATRIX.md`、`ACCEPTANCE_PROTOTYPE_SPEC.md` 一致。
- [ ] acceptance 视觉规范与 `DESIGN_TOKENS.md`、`COMPONENT_GUIDELINES.md` 一致。
- [ ] acceptance 未超出 `MVP_SCOPE.md` 与 `<current-change>`。
- [ ] 后台管理列表页均已验证分页存在，或已在上游设计基线中显式声明例外。
- [ ] 后台管理新建/编辑均已验证为弹窗，或已在上游设计基线中显式声明为抽屉/独立页并给出页面流依据。
- [ ] `BO-RULE-001` 信息层级清晰门禁已检查并通过；命中时结论必须 FAIL。
- [ ] `BO-RULE-002` 主按钮唯一门禁已检查并通过；命中时结论必须 FAIL。
- [ ] `BO-RULE-005` 文案中文化门禁已检查并通过；命中时结论必须 FAIL。
- [ ] `BO-RULE-006` 状态可辨识门禁已检查并通过；命中时结论必须 FAIL。
- [ ] `BO-RULE-008` 表格/筛选/分页闭环门禁已检查并通过；命中时结论必须 FAIL。
- [ ] `BO-RULE-009` 主操作语义一致门禁已检查并通过；命中时结论必须 FAIL。
- [ ] `BO-RULE-010` 页面区块白名单门禁已检查并通过；命中时结论必须 FAIL。
- [ ] `UX-BLOCK-001` 未命中；若命中，结论必须为 FAIL，且阻塞进入 `dev-implement`。
- [ ] `UX-BLOCK-002` 未命中；若命中，结论必须为 FAIL，且阻塞进入 `dev-implement`。
- [ ] `UX-BLOCK-003` 未命中；若命中，结论必须为 FAIL，且阻塞进入 `dev-implement`。
- [ ] `UX-BLOCK-004` 未命中；若命中，结论必须为 FAIL，且阻塞进入 `dev-implement`。
- [ ] `UX-BLOCK-005` 未命中；若命中，结论必须为 FAIL，且阻塞进入 `dev-implement`。
- [ ] `UX-BLOCK-006` 未命中；若命中，结论必须为 FAIL，且阻塞进入 `dev-implement`。
- [ ] 关键任务路径已验证无断链、无死路返回、无隐藏入口，且步数不超过上游上限。
- [ ] display / acceptance 已覆盖断点 `1440/1200/992/768/375`。
- [ ] display 影响 readable/actionable 的问题已进入主问题清单并参与 FAIL 判定。
- [ ] 体验门禁失败时结论必须为 FAIL，且必须阻塞，不允许进入 `dev-implement`。
- [ ] 命中任一 `UX-BLOCK` 时已立即结束准入判定并输出 FAIL，不存在通过项抵消。
- [ ] 无阻塞项才允许进入 `dev-implement`。

## Example

示例：会员管理系统

输入：

- 范围：会员列表、会员详情、积分流水页面
- acceptance 资产：3 个 HTML 页面 + 4 份 CSS 资产
- 设计基线：`UI_DESIGN_SPEC.md` / `PAGE_FLOW.md` / `STATE_MATRIX.md`

输出思路（`PROTOTYPE_CHECK_REPORT.md`）：

1. 结论摘要
- 门禁结论：`不允许进入 dev-implement`
- 原因：acceptance 存在 2 条阻塞问题（主流程断链、关键错误态缺失）

2. 问题示例
- `PC-MEMBER-001`（阻塞，页面流）
  - 页面：`SCR-MEMBER-001 会员列表`
  - 问题：点击“查看详情”未跳转 `SCR-MEMBER-002`
  - 影响：主流程中断，无法支撑开发联调路径
  - 建议修复：补齐静态跳转与返回路径
  - 是否阻塞进入开发：是
- `PC-MEMBER-002`（阻塞，分页缺失）
  - 页面：`SCR-MEMBER-001 会员列表`
  - 问题：后台管理列表页缺少分页组件，原型仅展示长列表
  - 影响：不符合共享 UI 基线，分页交互无法验收
  - 建议修复：补齐分页组件，或在上游设计基线中显式声明无分页并说明依据
  - 是否阻塞进入开发：是
- `UX-BLOCK-002`（阻塞，交互形态不符）
  - 页面：`SCR-MEMBER-001 会员列表`
  - 关联：`UX-TARGET-001` / `BUILD-RULE-002`
  - 问题：点击“编辑”跳转独立编辑页，未使用模拟态弹窗
  - 影响：维护页交互不符合设计基线，门禁 FAIL
  - 建议修复：改为模拟态编辑弹窗并保持列表上下文
  - 是否阻塞进入开发：是
- `UX-BLOCK-003`（阻塞，编辑闭环缺失）
  - 页面：`SCR-MEMBER-001 会员列表`
  - 关联：`UX-TARGET-003` / `BUILD-RULE-006`
  - 问题：编辑弹窗未预填当前行数据，且缺少字段级校验反馈与全局失败反馈
  - 影响：编辑流程不可验收，门禁 FAIL
  - 建议修复：补齐预填逻辑与提交成功/失败反馈
  - 是否阻塞进入开发：是
- `PC-POINTS-002`（重要，验收缺失）
  - 页面：`SCR-POINTS-001 积分流水`
  - 问题：缺失 `no-result` 状态展示
  - 影响：边界场景验收不完整
  - 建议修复：补齐 `no-result` 占位与引导动作
  - 是否阻塞进入开发：否

3. 非门禁观察
- `PC-DISPLAY-001`（建议，展示过曝）
  - 页面：`SCR-MEMBER-001 会员列表`
  - 问题：display 版暴露了验收辅助提示
  - 影响：对外展示观感受损
  - 是否阻塞进入开发：否

4. 下一步
- 先执行 `prototype-rectify` 关闭 acceptance 阻塞项，再复检。

## 版本信息

- 当前版本：v1.4.0
- 更新时间：2026-04-03

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| v1.4.0 | 2026-04-03 | 【修改】新增 `UX-BLOCK-004/005/006` 与 `BO-RULE-009/010` Fail-fast 门禁，强化筛选闭环、选中语义与区块白名单阻塞判定。 |
| v1.3.0 | 2026-04-03 | 【修改】接入 `BACKOFFICE_UI_SPEC.md` 与 `BO-RULE-001~008` Fail-fast 门禁，主问题清单新增 `关联 BO-RULE` 字段。 |
| v1.2.0 | 2026-04-02 | 【修改】新增 UX-BLOCK 命中 FAIL 早停规则、阻塞项追溯字段（UX-TARGET/BUILD-RULE）与关键路径效率门禁。 |
| v1.1.0 | 2026-04-02 | 【修改】新增 UX-BLOCK-001/002/003 阻塞门禁，并将体验门禁失败统一提升为 FAIL 且禁止进入 `dev-implement`。 |
