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
7. `docs/02-design/DISPLAY_PROTOTYPE_SPEC.md`
8. `docs/02-design/ACCEPTANCE_PROTOTYPE_SPEC.md`
9. `docs/01-requirements/MVP_SCOPE.md`
10. `docs/01-requirements/OUT_OF_SCOPE.md`
11. current change artifact（如项目启用 OpenSpec）：`<current-change>`
12. 构建参数（可选）：`build_profile=display|acceptance|both`（默认 `display`）

输入降级策略：

- 双轨专用文档缺失时，不得私自猜测模式差异。
- 必要信息不足时标记 `【待确认】`，禁止私自扩展范围。

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
14. 交互必须接近真实场景，至少包括：
   - 菜单展示与高亮联动
   - 页面跳转与返回路径
   - 按钮可用/禁用与反馈
   - 编辑流程（打开、校验、提交、取消）
   - 弹窗流程（打开、关闭、确认、取消）
15. 后台管理硬约束：
   - 后台管理列表页默认必须包含分页组件，不得仅以滚动加载或整页长列表替代
   - 后台管理“新建 / 编辑”默认必须采用弹窗交互
   - 仅当 `UI_DESIGN_SPEC.md`、`SCREEN_INVENTORY.md`、`PAGE_FLOW.md` 显式声明并给出依据时，才允许使用抽屉或独立页替代弹窗
   - 仅当上游设计基线显式声明“无分页”并给出业务理由时，才允许列表页不分页
16. 列表分页区硬约束（强制）：
   - 含列表页面必须包含分页区
   - 分页区必须同时包含：总数、当前页、页码、上一页、下一页
17. 后台管理维护页交互硬约束（强制）：
   - 适用于 `MEM / LVL / TAG / BNF-001` 的后台管理维护页
   - 新建与编辑必须使用模拟态弹窗
   - 不允许跳转独立编辑页
18. 列表编辑入口与回填硬约束（强制）：
   - 列表行内必须有编辑入口
   - 编辑弹窗必须预填当前行数据
19. 弹窗表单反馈闭环硬约束（强制）：
   - 弹窗表单必须包含取消、确认、校验反馈、提交结果反馈
20. 任一硬约束未满足时，结论必须为 build FAIL，且必须阻塞进入 `prototype-check`。
21. 视觉几何硬约束（layout deformation / geometric consistency）：
   - 强制断点覆盖（breakpoint coverage）：`1440`、`1200`、`992`、`768`、`375`
   - 关键页面在任一强制断点下不得出现以下问题：
     - 横向滚动
     - 布局错位
     - 组件重叠
     - 文本溢出
     - 按钮 / 输入框高度异常
     - 表格列挤压不可读
22. 构建后必须执行视觉几何自检：
   - 自检属于 build 阶段前置门禁，不是建议项
   - 任一关键页面在任一强制断点不满足 geometric consistency，或影响 readable/actionable，立即判定 build 未通过
   - build 未通过时，不得进入 `prototype-check`

## Workflow

### 步骤 0：解析构建参数

- 读取 `build_profile`。
- 取值规则：
  - `display`：仅输出对外展示版
  - `acceptance`：仅输出内部验收版
  - `both`：同时输出两版
- 未指定时默认按 `display` 执行。

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

### 步骤 4：补齐静态跳转与真实感交互

- 根据 `PAGE_FLOW.md` 配置页面间链接与返回路径。
- 确保主流程与必要异常流程可演示。
- 校验菜单、按钮、编辑、弹窗交互与真实场景一致。
- 对后台管理页面强制补齐：
  - 列表页分页区（总数、当前页、页码、上一页、下一页）
  - “新建”按钮打开模拟态弹窗
  - 列表行内“编辑”入口打开预填当前行数据的模拟态弹窗
  - 弹窗表单必须具备取消、确认、校验反馈、提交结果反馈
- 若上游明确声明使用抽屉或独立页，必须按 `PAGE_FLOW.md` 和 `UI_DESIGN_SPEC.md` 原样落地，不得自行改回弹窗或弱化流程。

### 步骤 5：记录构建说明

- 产出 `PROTOTYPE_BUILD_NOTES.md`，至少包含：
  - 构建模式与输出目录
  - 共享基线与双轨差异来源
  - 哪些元素只在 acceptance 可见
  - 哪些动作在 display 被后置或隐藏
  - 页面清单、资产说明、已知限制

### 步骤 6：自检

- 检查页面可打开、样式一致、交互链路完整。
- 若输出两版，检查核心业务路径一致。

### 步骤 7：构建后硬规则自检（阻塞）

- 检查含列表页面是否存在分页区，且必须包含总数、当前页、页码、上一页、下一页。
- 检查 `MEM / LVL / TAG / BNF-001` 维护页是否全部使用模拟态弹窗承载新建与编辑，不允许独立编辑页。
- 检查列表行内是否存在编辑入口，且编辑弹窗必须预填当前行数据。
- 检查弹窗表单是否具备取消、确认、校验反馈、提交结果反馈。
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

## Quality Gate

- [ ] 仅生成本期范围与 `<current-change>` 页面。
- [ ] 输出符合 `build_profile` 约定，未指定时默认仅生成 `display`。
- [ ] HTML 页面全部可本地打开。
- [ ] 主流程页面静态跳转可达，菜单联动正常。
- [ ] 按钮、编辑、弹窗交互可完整演示。
- [ ] 后台管理列表页默认已生成分页组件；若无分页，已在上游设计基线中显式声明并给出理由。
- [ ] 后台管理新建/编辑默认已生成弹窗交互；若非弹窗，已在上游设计基线中显式声明交互载体与页面流依据。
- [ ] 含列表页面必须具备分页区，且必须包含总数、当前页、页码、上一页、下一页；任一缺失即阻塞且 build FAIL。
- [ ] `MEM / LVL / TAG / BNF-001` 维护页新建/编辑必须为模拟态弹窗；出现独立编辑页即阻塞且 build FAIL。
- [ ] 列表行内必须有编辑入口，且编辑弹窗必须预填当前行数据；任一缺失即阻塞且 build FAIL。
- [ ] 弹窗表单必须具备取消、确认、校验反馈、提交结果反馈；任一缺失即阻塞且 build FAIL。
- [ ] 样式资产拆分完整（`tokens/layout/components/styles`）。
- [ ] `display` 版未出现验收辅助区、显式状态矩阵区块和过量实施字段。
- [ ] `acceptance` 版可承接门禁检查所需状态、字段与辅助信息。
- [ ] 已产出 `PROTOTYPE_BUILD_NOTES.md` 并登记双轨差异。
- [ ] 已完成强制断点覆盖（`1440/1200/992/768/375`）并通过视觉几何门禁自检。
- [ ] 任一关键页面在任一断点出现 layout deformation 且影响 readable/actionable 时，结论必须为 build FAIL 且阻塞进入 `prototype-check`。
- [ ] 任一硬规则不满足时，结论必须为 build FAIL 且阻塞进入 `prototype-check`。

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

- 当前版本：v1.1.0
- 更新时间：2026-04-02

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| v1.1.0 | 2026-04-02 | 【修改】将分页、模拟态弹窗、行内编辑预填、弹窗反馈闭环升级为构建阻塞规则并纳入 FAIL 门禁。 |
