---
name: prototype-build
description: 当高保真设计基线文档已齐备、需要生成 display 或 acceptance 高保真 HTML 原型时触发；不用于重新定义需求/架构、接入真实接口或实现业务代码。
---

# Skill: prototype-build — 高保真原型构建

## Purpose

根据高保真设计基线，将页面落地为高保真 HTML 原型，并支持 display / acceptance 双轨输出。

- `display`：对外展示版，默认构建目标。
- `acceptance`：内部验收版，仅在开发前门禁链路中显式构建与消费。

共享页面定义来自同一套设计基线，双轨差异由专用文档控制，而不是重新定义两套页面。

## When to Use

- `ui-design-spec` 已产出完整共享基线和双轨专用文档。
- 需要把设计基线转成可浏览、可演示、交互接近真实场景的 HTML 原型。
- 需要面向对外展示或内部验收分别构建原型。

## When Not to Use

- 重新定义页面范围、字段和业务规则（回到 `ui-design-spec` 或上游阶段）。
- 做原型验收门禁（使用 `prototype-check`）。
- 做问题修复闭环（使用 `prototype-rectify`）。
- 接入真实后端接口或实现业务状态管理。

## Inputs

1. `docs/02-design/SCREEN_INVENTORY.md`
2. `docs/02-design/UI_DESIGN_SPEC.md`
3. `docs/02-design/PAGE_FLOW.md`
4. `docs/02-design/DESIGN_TOKENS.md`
5. `docs/02-design/COMPONENT_GUIDELINES.md`
6. `docs/02-design/STATE_MATRIX.md`
7. `docs/02-design/MOCK_DATA_SPEC.md`
8. `docs/02-design/DISPLAY_PROTOTYPE_SPEC.md`
9. `docs/02-design/ACCEPTANCE_PROTOTYPE_SPEC.md`
10. `docs/02-design/BACKOFFICE_UI_SPEC.md`（后台管理页面强制）
11. `docs/01-requirements/MVP_SCOPE.md`
12. `docs/01-requirements/OUT_OF_SCOPE.md`
13. current change artifact（如项目启用 OpenSpec）：`<current-change>`
14. 构建参数（可选）：`build_profile=display|acceptance|both`（默认 `display`）
15. 视觉门禁参数（可选）：
    - `visual_gate=on|off`（默认 `on`）
    - `visual_gate_mode=build|strict`（默认 `build`）

输入降级策略：

- 双轨专用文档缺失时，不得私自猜测模式差异。
- 必要信息不足时标记 `【待确认】`，禁止私自扩展范围。
- 涉及后台管理页面但缺少 `BACKOFFICE_UI_SPEC.md` 时，结论必须为 build FAIL，并回退执行 `backoffice-ui-spec` / `ui-design-spec`。

## Outputs

`display` 版输出：

1. `frontend/design-prototype/display/*.html`
2. `frontend/design-prototype/display/assets/styles.css`
3. `frontend/design-prototype/display/assets/tokens.css`
4. `frontend/design-prototype/display/assets/layout.css`
5. `frontend/design-prototype/display/assets/components.css`

`acceptance` 版输出：

1. `frontend/design-prototype/acceptance/*.html`
2. `frontend/design-prototype/acceptance/assets/styles.css`
3. `frontend/design-prototype/acceptance/assets/tokens.css`
4. `frontend/design-prototype/acceptance/assets/layout.css`
5. `frontend/design-prototype/acceptance/assets/components.css`

通用输出：

1. `docs/02-design/PROTOTYPE_BUILD_NOTES.md`
2. `docs/02-design/.visual-check/<run-id>/audit-result.json`
3. `docs/02-design/.visual-check/<run-id>/screenshots/<side>/<breakpoint>/*.png`
4. `docs/02-design/.visual-check/<run-id>/VISUAL_GATE_REPORT.md`
5. `docs/02-design/.visual-check/latest`（指向最新一次视觉门禁结果）
6. `frontend/design-prototype/<side>/data/*.json`（模拟数据文件）

## 执行层级导读（Progressive Disclosure）

- `P0 必检（阻塞）`：构建范围、`BUILD-RULE-010~015`、关键 `BO-RULE`、视觉门禁阻塞项。
- `P1 扩展（覆盖）`：双轨一致性、自动化覆盖维度、结构化报告完整性。
- `P2 参考（说明）`：示例与背景说明，仅用于复用，不参与放行。
- 执行顺序必须为：先过 `P0 Gate`，再执行 `P1`；`P2` 不得覆盖 `P0` 结论。

## Rules

1. 仅覆盖本期确认范围与 `<current-change>` 页面。
2. 共享页面结构必须以 `SCREEN_INVENTORY.md`、`UI_DESIGN_SPEC.md`、`PAGE_FLOW.md` 为准。
3. 模式差异必须以 `DISPLAY_PROTOTYPE_SPEC.md` 与 `ACCEPTANCE_PROTOTYPE_SPEC.md` 为准。
4. 默认输出用于对外展示，不再默认同时产出验收版。
5. 不得生成超出 `<current-change>` 的页面。
6. 页面必须可本地打开，且页面间静态跳转可用。
7. 必须保证统一视觉风格与组件风格。
8. 不接真实接口，不写业务实现代码。
9. `display` 版必须优先：
   - 主视觉清晰
   - 用户可理解
   - 动作后置
   - 内部实现信息隐藏
10. `display` 版不得显式展示：
   - 验收辅助区
   - 状态矩阵区块
   - 仅供实施核对的过量字段
   - 为门禁而暴露的内部说明
11. `acceptance` 版必须优先：
   - 状态覆盖
   - 结构完整
   - 关键字段可核对
   - 门禁可消费
12. `acceptance` 版允许保留验收辅助信息，供 `prototype-check` 消费。
13. 两版的核心业务路径必须一致，不得出现流程分叉为两套产品。
14. 交互必须按 `UI_DESIGN_SPEC.md` 中的“交互实现清单”实现：
   - 必须实现的交互：全部实现
   - 可选实现的交互：根据时间和资源决定是否实现
   - 不需要实现的交互：不实现
15. 必须实现的交互至少包括：
   - 菜单展示与高亮联动
   - 页面跳转与返回路径
   - 按钮可用/禁用与反馈
   - 筛选查询与重置
   - 分页点击与数据更新
   - 新建/编辑弹窗打开与关闭
   - 编辑弹窗预填当前行数据
   - 表单提交模拟（加载态 -> 成功态 -> 关闭弹窗 -> 刷新列表）
   - 表单取消
   - 批量操作（勾选 -> 批量按钮可用 -> 确认框 -> 执行）
16. 可选实现的交互包括：
   - 表单字段级校验（如：手机号格式校验）
   - 表单提交失败模拟（失败态 -> 错误提示）
17. 不需要实现的交互包括：
   - 真实接口调用
   - 真实业务逻辑
   - 真实数据持久化
18. 后台管理硬约束：
   - 后台管理列表页默认必须包含分页组件，不得仅以滚动加载或整页长列表替代
   - 后台管理“新建 / 编辑”默认必须采用弹窗交互
   - 仅当 `UI_DESIGN_SPEC.md`、`SCREEN_INVENTORY.md`、`PAGE_FLOW.md` 显式声明并给出依据时，才允许使用抽屉或独立页替代弹窗
   - 仅当上游设计基线显式声明“无分页”并给出业务理由时，才允许列表页不分页
19. 列表分页区硬约束（强制）：
   - `BUILD-RULE-001`：含列表页面必须包含分页区
   - `BUILD-RULE-001`：分页区必须同时包含：总数、当前页、页码、上一页、下一页
20. 后台管理维护页交互硬约束（强制）：
   - 适用于 `MEM / LVL / TAG / BNF-001` 的后台管理维护页
   - `BUILD-RULE-002`：新建与编辑必须使用模拟态弹窗
   - `BUILD-RULE-002`：不允许跳转独立编辑页
21. 列表编辑入口与回填硬约束（强制）：
   - `BUILD-RULE-003`：列表行内必须有编辑入口
   - `BUILD-RULE-003`：编辑弹窗必须预填当前行数据
22. 弹窗表单反馈闭环硬约束（强制）：
   - `BUILD-RULE-004`：弹窗表单必须包含取消与确认动作
   - `BUILD-RULE-006`：弹窗表单必须包含字段级校验反馈、全局失败反馈、提交成功状态回写
23. 交互效率硬约束（强制）：
   - `BUILD-RULE-005`：关键任务路径必须无断链、无死路返回、无隐藏入口
   - `BUILD-RULE-005`：关键任务步数必须满足 `UX-TARGET-003` 定义的上限
24. 后台高保真规范硬约束（强制）：
   - 涉及后台管理页面时，必须满足 `BO-RULE-001~022`
   - 任一页面出现信息层级不清晰、主按钮不唯一、技术字段直出、状态语义缺失、反馈闭环缺失、表格/筛选/分页闭环缺失、主操作语义不一致、页面区块越界，直接判定 build FAIL
25. 列表筛选闭环硬约束（强制）：
   - `BUILD-RULE-007`：含列表页面必须具备筛选区，且至少包含 1 个筛选字段
   - `BUILD-RULE-007`：筛选区必须同时包含“查询”与“重置”动作
26. 主操作语义一致性硬约束（强制）：
   - `BUILD-RULE-008`：主操作文案含“选中/批量”时，页面必须存在选择机制（单选/多选）与已选反馈
27. 页面区块白名单硬约束（强制）：
   - `BUILD-RULE-009`：页面出现的功能卡片/区块必须在 `UI_DESIGN_SPEC.md` 的页面区块白名单声明
28. 任一硬约束未满足时，结论必须为 build FAIL，且必须阻塞进入 `prototype-check`。
29. 后台排版结构硬约束（强制）：
   - `BUILD-RULE-010`：页面类型必须与布局模板匹配；当 `data-layout-template=列表主视图` 时，页面主结构必须为筛选区 -> 结果区 -> 分页区三段式，且主任务关键区块首屏可见
   - `BUILD-RULE-011`：列表主视图结果区下方不允许出现业务工作台/处理卡片/迁移面板/评估面板/映射维护面板等下置业务处理区；命中即 build FAIL
   - `BUILD-RULE-011`：禁入检测必须同时覆盖“命名枚举 + 语义识别”（含 `tag-evaluation`、`xxx-evaluation`、`assessment`、`workbench/workspace/action-panel/processing-panel/migrate-panel/mapping-panel` 及同义命名）
   - `BUILD-RULE-011`：`data-block-whitelist` 不得豁免禁入项；命中时必须按固定映射输出：`BUILD-RULE-011 + BO-RULE-017 + UX-BLOCK-008`（Blocker/FAIL）
   - `BUILD-RULE-012`：列表页工具栏顺序必须为筛选 -> 结果 -> 分页，且分页区必须承接结果区
   - `BUILD-RULE-012`：列表主视图分页视觉一致性必须满足统一容器结构 `table-footer + summary + pagination`；布局错位或独立漂浮分页必须按 `BUILD-RULE-011 + BO-RULE-017 + UX-BLOCK-008` 输出 Blocker/FAIL
   - `BUILD-RULE-013`：关键任务路径滚动预算默认 <= 1 屏，超限需有上游例外声明
   - `BUILD-RULE-014`：分页语义必须完整且筛选后默认重置到第 1 页
   - `BUILD-RULE-015`：同页不得并列双主流程（双主按钮/双主任务链）
30. 任一 `BUILD-RULE-010~015` 不满足时，结论必须为 build FAIL 并阻塞进入 `prototype-check`。
31. 视觉几何硬约束（layout deformation / geometric consistency）：
   - 强制断点覆盖（breakpoint coverage）：`1440`、`1200`、`992`、`768`、`375`
   - 关键页面在任一强制断点下不得出现以下问题：
     - 横向滚动
     - 布局错位
     - 组件重叠
     - 文本溢出
     - 按钮 / 输入框高度异常
     - 表格列挤压不可读
32. 构建后必须执行视觉几何自检：
   - 自检属于 build 阶段前置门禁，不是建议项
   - 任一关键页面在任一强制断点不满足 geometric consistency，或影响 readable/actionable，立即判定 build 未通过
   - build 未通过时，不得进入 `prototype-check`
33. 当 `visual_gate=on` 时，必须执行自动化视觉门禁脚本（Playwright + Chromium）：
   - 脚本入口：`scripts/run_visual_gate.sh --phase build --profile <build_profile>`
   - 自动安装策略：若 `playwright/chromium` 不存在，脚本必须先执行全局安装（`npm install -g playwright` + `playwright install chromium`）再执行检查
   - 自动安装失败时，结论必须为 `BLOCKED`，并输出失败原因与重试命令
   - 降级策略：
     - 若脚本执行失败（包含安装失败、执行失败），且用户明确豁免，可降级为人工检查
     - 人工检查必须覆盖：五个断点截图（1440/1200/992/768/375）、几何检查（横向滚动、错位、重叠、文本溢出、控件高度异常、表格可读性）
     - 人工检查结果必须记录到 `PROTOTYPE_BUILD_NOTES.md`，并标记 `【人工检查】` + `【风险】`
     - 人工检查结果必须包含：检查人、检查时间、检查结论、证据（截图路径）
34. 自动化视觉门禁脚本必须至少覆盖：
   - 五个断点截图：`1440/1200/992/768/375`
   - 几何检查：横向滚动、错位、重叠、文本溢出、控件高度异常、表格可读性
   - 点击检查：导航选中态、新建/编辑弹窗、筛选查询/重置、分页可点击闭环
35. 自动化视觉门禁结果必须包含：`layoutType`、`scrollCost`、`firstScreenCoverage`、`formDensityBeforeList`、`toolbarOrderCheck`、`pageResetCheck`。
36. 自动化门禁结果写入 `docs/02-design/.visual-check/<run-id>/audit-result.json`，并同步生成 `VISUAL_GATE_REPORT.md`。
37. `visual_gate_mode=strict` 时，`Major` 及以上问题均阻塞进入 `prototype-check`；`visual_gate_mode=build` 时，仅 `Blocker` 阻塞。
38. 自动化门禁脚本返回非 0 时，结论必须为 build FAIL；不得以人工观察替代通过。
39. `visual_gate=off` 仅允许在上游明确豁免时使用，并必须在 `PROTOTYPE_BUILD_NOTES.md` 标记 `【风险】`。
40. 规则去重约束（强制）：
   - `Rules` 保留主定义，`Workflow` 与 `Quality Gate` 仅引用规则编号与结论，不重复整段规则文本。
41. 原型样式必须基于生产环境组件库（`Element Plus`）：
   - 按钮样式必须与 `Element Plus ElButton` 一致
   - 表格样式必须与 `Element Plus ElTable` 一致
   - 分页样式必须与 `Element Plus ElPagination` 一致
   - 表单样式必须与 `Element Plus ElForm` 一致
   - 弹窗样式必须与 `Element Plus ElDialog` 一致
42. 若组件库无法满足设计要求，必须在 `COMPONENT_GUIDELINES.md` 中标记 `【需要自定义】`
43. 原型必须引入组件库 CDN 或等价静态样式来源，基于 `Element Plus` 组件库样式生成原型样式

## Workflow

### 步骤 0：解析构建参数

- 读取 `build_profile`。
- 取值规则：
  - `display`：仅输出对外展示版
  - `acceptance`：仅输出内部验收版
  - `both`：同时输出两版
- 未指定时默认按 `display` 执行。
- 读取 `visual_gate`，未指定时默认 `on`。
- 读取 `visual_gate_mode`，未指定时默认 `build`。

### 步骤 0.5：P0 Gate（阻塞）

- 校验 `docs/02-design/` 基线输入是否齐备且可消费。
- 校验涉及后台页面时 `BACKOFFICE_UI_SPEC.md` 可用。
- 任一缺失时输出 `build FAIL/BLOCKED` 并停止，不进入步骤 1~9。

### 步骤 1：锁定构建范围

- 从 `SCREEN_INVENTORY.md` 与 `<current-change>` 提取页面白名单。
- 排除 Out of Scope 页面。
- 提取共享页面结构与双轨差异规则。

### 步骤 2：生成样式基线

- 先生成共享样式策略（颜色/字体/间距/组件）。
- 再按模式输出到 `display/assets/` 与/或 `acceptance/assets/`。

### 步骤 3：按模式逐页生成 HTML

- 页面结构、主路径、核心交互与 `UI_DESIGN_SPEC.md` 一致。
- `display`：
  - 强化主视觉与用户理解路径
  - 隐藏实现细节与验收痕迹
  - 不以显式状态覆盖为展示目标
- `acceptance`：
  - 保留门禁所需的状态、字段和辅助信息
  - 可显式承接 `STATE_MATRIX.md` 与契约抽检要求

### 步骤 3.5：生成模拟数据

- 读取 `MOCK_DATA_SPEC.md`
- 为每个页面生成模拟数据 JSON 文件
- 输出到 `frontend/design-prototype/<side>/data/*.json`
- 模拟数据必须覆盖：
  - 典型值（用于展示正常场景）
  - 边界值（用于验证溢出、截断）
  - 空值（用于验证空态）
  - 特殊字符（用于验证转义、安全）
- 模拟数据文件示例：
  - `frontend/design-prototype/display/data/member-list.json`
  - 字段至少包含：`total`、`current_page`、`page_size`、`data[]`
  - `data[]` 示例需包含正常值、超长名称、边界积分值、不同状态值
- HTML 页面必须使用本地模拟数据驱动渲染，例如：
  - `fetch('./data/member-list.json').then(...).then(renderMemberList)`

### 步骤 4：补齐静态跳转与真实感交互

- 根据 `PAGE_FLOW.md` 配置页面间链接与返回路径。
- 确保主流程与必要异常流程可演示。
- 校验菜单、按钮、编辑、弹窗交互与真实场景一致。
- 对后台管理页面强制补齐：
  - `BUILD-RULE-001`：列表页分页区（总数、当前页、页码、上一页、下一页）
  - `BUILD-RULE-002`：“新建”按钮打开模拟态弹窗
  - `BUILD-RULE-003`：列表行内“编辑”入口打开预填当前行数据的模拟态弹窗
  - `BUILD-RULE-004`：弹窗表单具备取消、确认动作
  - `BUILD-RULE-006`：弹窗表单具备字段级校验反馈、全局失败反馈、提交成功状态回写
- 对关键任务路径强制补齐：
  - `BUILD-RULE-005`：路径无断链、无死路返回、无隐藏入口
  - `BUILD-RULE-005`：关键任务步数不超过上游体验目标上限
- 若上游明确声明使用抽屉或独立页，必须按 `PAGE_FLOW.md` 和 `UI_DESIGN_SPEC.md` 原样落地，不得自行改回弹窗或弱化流程。

### 步骤 5：记录构建说明

- 产出 `PROTOTYPE_BUILD_NOTES.md`，至少包含：
  - 构建模式与输出目录
  - 共享基线与双轨差异来源
  - 哪些元素只在 acceptance 可见
  - 哪些动作在 display 被后置或隐藏
  - 页面清单、资产说明、已知限制
  - `BUILD-RULE-001~015` 结构化自检结果表（页面编号、规则编号、结果 PASS/FAIL、证据位置）
  - `BO-RULE-001~022` 结构化自检结果表（页面编号、规则编号、结果 PASS/FAIL、证据位置）

### 步骤 6：自检

- 检查页面可打开、样式一致、交互链路完整。
- 若输出两版，检查核心业务路径一致。

### 步骤 7：构建后硬规则自检（阻塞）

- 检查含列表页面是否存在分页区，且必须包含总数、当前页、页码、上一页、下一页。
- 检查 `MEM / LVL / TAG / BNF-001` 维护页是否全部使用模拟态弹窗承载新建与编辑，不允许独立编辑页。
- 检查列表行内是否存在编辑入口，且编辑弹窗必须预填当前行数据。
- 检查弹窗表单是否具备取消、确认动作。
- 检查弹窗表单是否具备字段级校验反馈、全局失败反馈、提交成功状态回写。
- 检查关键任务路径是否无断链、无死路返回、无隐藏入口，且步数满足上游步数上限。
- 检查含列表页面是否具备筛选字段与“查询+重置”动作（`BUILD-RULE-007`）。
- 检查主操作文案含“选中/批量”的页面是否具备选择机制与已选反馈（`BUILD-RULE-008`）。
- 检查页面功能卡片/区块是否全部在页面白名单声明（`BUILD-RULE-009`）。
- 检查页面类型与布局模板是否匹配，且主任务关键区块是否首屏可见（`BUILD-RULE-010`）。
- 检查 `data-layout-template=列表主视图` 是否满足三段式（筛选区 -> 结果区 -> 分页区）（`BUILD-RULE-010`）。
- 检查列表页是否存在前置重表单压制主列表，或结果区下方出现业务工作台/处理卡片/迁移面板/评估面板/映射维护面板（`BUILD-RULE-011`）。
- 检查工具栏顺序是否符合筛选 -> 结果 -> 分页，且分页承接结果区（`BUILD-RULE-012`）。
- 检查关键任务路径滚动预算是否超限（`BUILD-RULE-013`）。
- 检查分页语义是否完整，且筛选后是否重置第 1 页（`BUILD-RULE-014`）。
- 检查同页是否存在双主流程冲突（`BUILD-RULE-015`）。
- 检查后台页面是否满足 `BO-RULE-001~022`（含页面类型匹配、首屏可见、跨屏依赖、工具栏顺序、分页语义等）。
- 将 `BUILD-RULE-001~015` 与 `BO-RULE-001~022` 检查结果写入 `PROTOTYPE_BUILD_NOTES.md` 结构化自检结果表。
- 任一检查项不满足，结论必须为 build FAIL，必须阻塞并返回修复，不得进入 `prototype-check`。

### 步骤 8：视觉几何门禁自检（阻塞）

- 对关键页面执行强制断点覆盖检查：`1440`、`1200`、`992`、`768`、`375`。
- 逐页逐断点检查 layout deformation：
  - 横向滚动
  - 布局错位
  - 组件重叠
  - 文本溢出
  - 按钮 / 输入框高度异常
  - 表格列挤压不可读
- 若任一页面任一断点不满足 geometric consistency，或影响 readable/actionable，直接阻塞并返回修复，不得流转 `prototype-check`。

### 步骤 9：执行自动化视觉门禁（Playwright + Chromium）

- 当 `visual_gate=on` 时，执行：
  - `scripts/run_visual_gate.sh --phase build --profile <build_profile>`
- 脚本职责：
  - 自动检测 `node/npm` 可用性
  - 自动全局安装 `playwright` 与 `chromium`（若缺失）
  - 生成截图、JSON 结果与 Markdown 报告
- 若脚本返回非 0（包含安装失败、执行失败、命中阻塞），结论必须为 build FAIL 并停止流转。
- 若 `visual_gate=off`，必须在 `PROTOTYPE_BUILD_NOTES.md` 记录豁免理由、风险影响、责任人。

## Quality Gate（分层）

### P0 Gate（阻塞，最小必检）

- [ ] 仅生成本期范围与 `<current-change>` 页面。
- [ ] `BUILD-RULE-010`：页面类型与布局模板匹配；`data-layout-template=列表主视图` 时必须满足三段式（筛选区 -> 结果区 -> 分页区）且主任务关键区块首屏可见；不满足即阻塞且 build FAIL。
- [ ] `BUILD-RULE-011`：列表页禁止前置重表单压制主列表，且禁止在结果区下方放置业务工作台/处理卡片/迁移面板/评估面板/映射维护面板；命中即阻塞且 build FAIL。
- [ ] `BUILD-RULE-011`：禁入检测必须覆盖命名枚举 + 语义识别，且 `data-block-whitelist` 不得豁免禁入项；命中时必须输出 `BUILD-RULE-011 + BO-RULE-017 + UX-BLOCK-008` 的 Blocker/FAIL。
- [ ] `BUILD-RULE-012`：工具栏顺序为筛选 -> 结果 -> 分页，且分页承接结果区；不满足即阻塞且 build FAIL。
- [ ] 列表主视图分页视觉一致性必须满足 `table-footer + summary + pagination`；布局错位或独立漂浮分页必须阻塞且 build FAIL。
- [ ] 任一硬规则不满足时，结论必须为 build FAIL 且阻塞进入 `prototype-check`。
- [ ] `visual_gate=on` 时已执行 `run_visual_gate.sh`，并产出 `audit-result.json` 与 `VISUAL_GATE_REPORT.md`。

### P1 Coverage Checklist（扩展覆盖）

- [ ] 输出符合 `build_profile` 约定，未指定时默认仅生成 `display`。
- [ ] HTML 页面全部可本地打开。
- [ ] 主流程页面静态跳转可达，菜单联动正常。
- [ ] 按钮、编辑、弹窗交互可完整演示。
- [ ] 后台管理列表页默认已生成分页组件；若无分页，已在上游设计基线中显式声明并给出理由。
- [ ] 后台管理新建/编辑默认已生成弹窗交互；若非弹窗，已在上游设计基线中显式声明交互载体与页面流依据。
- [ ] `BUILD-RULE-001`：含列表页面必须具备分页区，且必须包含总数、当前页、页码、上一页、下一页；任一缺失即阻塞且 build FAIL。
- [ ] `BUILD-RULE-002`：`MEM / LVL / TAG / BNF-001` 维护页新建/编辑必须为模拟态弹窗；出现独立编辑页即阻塞且 build FAIL。
- [ ] `BUILD-RULE-003`：列表行内必须有编辑入口，且编辑弹窗必须预填当前行数据；任一缺失即阻塞且 build FAIL。
- [ ] `BUILD-RULE-004`：弹窗表单必须具备取消、确认动作；任一缺失即阻塞且 build FAIL。
- [ ] `BUILD-RULE-005`：关键任务路径必须无断链、无死路返回、无隐藏入口，且步数不超过上游上限；任一不满足即阻塞且 build FAIL。
- [ ] `BUILD-RULE-006`：弹窗表单必须具备字段级校验反馈、全局失败反馈、提交成功状态回写；任一缺失即阻塞且 build FAIL。
- [ ] `BUILD-RULE-007`：含列表页面必须具备筛选区（>=1 筛选字段）且同时包含查询与重置动作；任一缺失即阻塞且 build FAIL。
- [ ] `BUILD-RULE-008`：主操作文案含“选中/批量”时必须具备选择机制与已选反馈；任一缺失即阻塞且 build FAIL。
- [ ] `BUILD-RULE-009`：页面功能卡片/区块必须在页面白名单声明；出现未声明区块即阻塞且 build FAIL。
- [ ] `BUILD-RULE-010`：页面类型与布局模板匹配；`data-layout-template=列表主视图` 时必须满足三段式（筛选区 -> 结果区 -> 分页区）且主任务关键区块首屏可见；不满足即阻塞且 build FAIL。
- [ ] `BUILD-RULE-011`：列表页禁止前置重表单压制主列表，且禁止在结果区下方放置业务工作台/处理卡片/迁移面板/评估面板/映射维护面板；命中即阻塞且 build FAIL。
- [ ] `BUILD-RULE-012`：工具栏顺序为筛选 -> 结果 -> 分页，且分页承接结果区；不满足即阻塞且 build FAIL。
- [ ] `BUILD-RULE-013`：关键任务路径滚动预算默认 <= 1 屏；超限且无例外即阻塞且 build FAIL。
- [ ] `BUILD-RULE-014`：分页语义完整且筛选后默认重置第 1 页；不满足即阻塞且 build FAIL。
- [ ] `BUILD-RULE-015`：同页无双主流程冲突；不满足即阻塞且 build FAIL。
- [ ] `BO-RULE-001`：页面目标、主任务、首屏决策信息齐备；任一缺失即阻塞且 build FAIL。
- [ ] `BO-RULE-002`：每页仅 1 个主按钮，且位置一致；不满足即阻塞且 build FAIL。
- [ ] `BO-RULE-003`：主/次/危险操作分级清晰，危险操作不与主操作混淆；不满足即阻塞且 build FAIL。
- [ ] `BO-RULE-004`：字段展示存在“技术字段 -> 业务中文标签”映射；缺失即阻塞且 build FAIL。
- [ ] `BO-RULE-005`：UI 文案无技术字段直出，术语中文化且统一；不满足即阻塞且 build FAIL。
- [ ] `BO-RULE-006`：状态标签定义颜色语义、禁用态、可点击态；缺任一即阻塞且 build FAIL。
- [ ] `BO-RULE-007`：反馈覆盖空态/加载态/失败态/成功态；缺任一即阻塞且 build FAIL。
- [ ] `BO-RULE-008`：列表页具备筛选-表格-分页完整闭环；缺任一即阻塞且 build FAIL。
- [ ] `BO-RULE-009`：主操作语义与选择机制一致；不满足即阻塞且 build FAIL。
- [ ] `BO-RULE-010`：页面区块白名单声明完整且无越界区块；不满足即阻塞且 build FAIL。
- [ ] `BO-RULE-011~022`：页面类型匹配、首屏可见、前置重表单限制、跨屏依赖、工具栏顺序、分页语义、筛选后分页重置等均满足；任一不满足即阻塞且 build FAIL。
- [ ] 样式资产拆分完整（`tokens/layout/components/styles`）。
- [ ] `display` 版未出现验收辅助区、显式状态矩阵区块和过量实施字段。
- [ ] `acceptance` 版可承接门禁检查所需状态、字段与辅助信息。
- [ ] 已产出 `PROTOTYPE_BUILD_NOTES.md` 并登记双轨差异，且包含 `BUILD-RULE-001~015` 与 `BO-RULE-001~022` 结构化自检结果表。
- [ ] 已完成强制断点覆盖（`1440/1200/992/768/375`）并通过视觉几何门禁自检。
- [ ] 任一关键页面在任一断点出现 layout deformation 且影响 readable/actionable 时，结论必须为 build FAIL 且阻塞进入 `prototype-check`。
- [ ] 任一硬规则不满足时，结论必须为 build FAIL 且阻塞进入 `prototype-check`。
- [ ] `visual_gate=on` 时已执行 `run_visual_gate.sh`，并产出 `audit-result.json` 与 `VISUAL_GATE_REPORT.md`。
- [ ] 自动化视觉门禁已覆盖导航选中态、新建/编辑弹窗、筛选查询/重置、分页可点击闭环。
- [ ] 自动化视觉门禁结果已包含 `layoutType`、`scrollCost`、`firstScreenCoverage`、`formDensityBeforeList`、`toolbarOrderCheck`、`pageResetCheck`。
- [ ] `visual_gate_mode=build` 下 `Blocker` 阻塞已生效；`visual_gate_mode=strict` 下 `Major` 阻塞已生效。
- [ ] 自动全局安装 `playwright/chromium` 失败时已输出 `BLOCKED` 并终止构建。

### P2 Reference Checklist（参考）

- [ ] Example 与说明文本已更新，且不改变 `P0` 判定口径。

## Example

示例：会员管理系统

输入：

- 页面：`SCR-MEMBER-001` 会员列表、`SCR-MEMBER-002` 会员详情、`SCR-POINTS-001` 积分流水
- 设计系统：统一主色、状态色、表格/表单组件规范
- 范围：仅会员模块，不含营销自动化
- 参数：未传 `build_profile`

输出思路：

1. 默认构建
- 仅输出 `frontend/design-prototype/display/**`

2. display 页面
- 突出会员核心画像、列表筛选和详情浏览路径
- 不显式展示状态矩阵与验收辅助区
- 仅保留展示叙事需要的编辑与弹窗动作

3. acceptance 页面
- 当显式传 `build_profile=acceptance` 或 `both` 时，再补输出验收版
- 验收版保留 `loading`、`error`、`no-result` 等状态可见入口及必要辅助信息

4. 说明文档
- 在 `PROTOTYPE_BUILD_NOTES.md` 记录：
  - 本次默认构建为 `display`
  - acceptance 专属可见元素
  - 两版业务路径保持一致

## 版本信息

- 当前版本：v1.9.0
- 更新时间：2026-04-03

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| v1.9.0 | 2026-04-03 | 【修改】补强列表主视图硬门禁：禁入检测升级为“命名枚举 + 语义识别”，白名单不得豁免禁入项；新增分页视觉一致性强制门禁（`table-footer + summary + pagination`），命中统一按 `BUILD-RULE-011 + BO-RULE-017 + UX-BLOCK-008` 输出 Blocker/FAIL。 |
| v1.8.0 | 2026-04-03 | 【修改】按 Progressive Disclosure 重排：新增 `P0/P1/P2` 导读、`P0 Gate` 阻塞前置、分层 Quality Gate，并约束 Workflow/Quality Gate 采用规则编号引用。 |
| v1.7.0 | 2026-04-03 | 【修改】强化 `BUILD-RULE-010/011/012`：列表主视图三段式结构强制化，禁止结果区下方下置业务处理区，命中即 build FAIL（阻塞）。 |
| v1.6.1 | 2026-04-03 | 【修改】将视觉门禁依赖策略明确为全局安装：`playwright` 缺失时全局安装，`chromium` 缺失时全局安装。 |
| v1.6.0 | 2026-04-03 | 【修改】新增 `BUILD-RULE-010~015` 与后台排版结构门禁，扩展 `BO-RULE` 消费范围到 `001~022` 并要求输出布局治理度量字段。 |
| v1.5.0 | 2026-04-03 | 【修改】新增自动化视觉门禁参数（`visual_gate`/`visual_gate_mode`）、`run_visual_gate.sh` 执行要求与 Playwright+Chromium 自动安装策略。 |
| v1.4.0 | 2026-04-03 | 【修改】新增 `BUILD-RULE-007/008/009`（筛选闭环、主操作语义一致性、页面区块白名单）并扩展 `BO-RULE-001~010` 构建门禁。 |
| v1.3.0 | 2026-04-03 | 【修改】接入 `BACKOFFICE_UI_SPEC.md` 与 `BO-RULE-001~008` 构建期强制自检，命中即 build FAIL 并阻塞下游。 |
| v1.2.0 | 2026-04-02 | 【修改】新增 BUILD-RULE-001~006、关键路径效率硬校验与结构化自检结果表，强化构建期可判定性。 |
| v1.1.0 | 2026-04-02 | 【修改】将分页、模拟态弹窗、行内编辑预填、弹窗反馈闭环升级为构建阻塞规则并纳入 FAIL 门禁。 |
