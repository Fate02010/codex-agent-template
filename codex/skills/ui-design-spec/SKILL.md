---
name: ui-design-spec
description: Generate executable UI design specs and high-fidelity HTML prototypes from requirements.
---

# Skill: ui-design-spec — UI 设计说明与 HTML 高保真原型输出

## 1. Purpose

本 Skill 用于在“需求整改完成后、前端正式开发前”产出可执行 UI 设计结果，核心职责如下：

1. 基于需求文档与调研资料，输出结构化 UI 设计说明，明确页面目标、信息层级、关键交互与展示规则。
2. 输出页面清单、页面流转、字段展示、状态设计（正常/空/异常）与权限差异说明。
3. 输出可本地预览、可跨页面跳转的 HTML 高保真静态设计稿，供产品、前端、测试评审与对齐。

边界说明：

- 本 Skill 产出的是“设计稿级别 HTML 原型”，不是生产级前端工程代码。
- 本 Skill 不直接实现业务前端代码、不对接真实后端接口、不落地后端实现。

## 2. When to Use

以下场景应触发本 Skill：

1. `prd-rectify` 完成后，`docs/01-requirements/PRD_RECTIFIED.md` 已形成可执行需求基线，需要进入 UI 设计阶段。
2. 当前只有需求文档，没有正式高保真设计图（Figma/Sketch 完整稿缺失）。
3. 需要先由 Codex 生成一版 HTML 高保真设计稿，供产品/UI/研发联合评审。
4. 前端开发前需要冻结页面结构、字段展示方案和主要交互路径。
5. 增量需求进入迭代时，需要补充新增页面/改动页面的 UI 设计说明与 HTML 原型。

## 3. Inputs

执行前按顺序读取以下输入：

必选输入：

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/01-requirements/MVP_SCOPE.md`
3. `docs/00-research/RESEARCH_SUMMARY.md`

可选输入（存在则必须纳入分析）：

1. `openspec/project.md`
2. `openspec/changes/<change-name>/proposal.md`
3. `openspec/changes/<change-name>/design.md`
4. `openspec/changes/<change-name>/specs/`
5. `openspec/changes/<change-name>/tasks.md`
6. 前端技术栈约束（Vue/React/TypeScript、组件库偏好、目录规范）
7. 视觉与品牌约束（后台管理风格、移动端风格、主色、品牌规范、字体规范）

输入校验要求：

- 若 `PRD_RECTIFIED.md` 仍为模板或缺失关键章节，必须先阻塞并返回补齐。
- 若 `MVP_SCOPE.md` 缺失，需在输出中标注【待确认】并给出临时范围假设。
- 若多份输入冲突，先记录冲突，不得直接强行定稿。

## 4. Outputs

输出物必须落盘到固定路径，禁止仅在对话中给结论。

文档输出（固定）：

1. `docs/02-design/UI_DESIGN_SPEC.md`
2. `docs/02-design/PAGE_FLOW.md`
3. `docs/02-design/SCREEN_INVENTORY.md`
4. `docs/02-design/UI_REVIEW_CHECKLIST.md`

HTML 设计稿输出（固定二选一，优先前者）：

1. `frontend/design-prototype/`（优先：存在前端目录时使用）
2. `docs/02-design/prototype/`（备用：无前端目录时使用）

HTML 输出强制要求：

1. 输出为静态 HTML 文件，可包含 CSS 与少量 JS（仅用于交互演示）。
2. 目标是高保真设计稿/页面原型，不是生产级前端工程。
3. 页面视觉与布局需贴近真实后台管理系统（导航、内容区、表格、表单、弹窗、标签等）。
4. 页面可通过浏览器本地打开预览（双击 HTML 或本地静态服务）。
5. 主要页面之间必须可链接跳转，体现核心业务流程。

建议文件组织：

```text
docs/02-design/
  UI_DESIGN_SPEC.md
  PAGE_FLOW.md
  SCREEN_INVENTORY.md
  UI_REVIEW_CHECKLIST.md
frontend/design-prototype/  (or docs/02-design/prototype/)
  index.html
  member-list.html
  member-detail.html
  member-edit.html
  member-level.html
  points-ledger.html
  assets/
    styles.css
    app.js
```

## 5. Rules

执行本 Skill 时必须遵守以下规则：

1. 必须先完整阅读需求文档与范围文档，再开始页面设计。
2. 不允许凭空发明超出 PRD 的核心业务能力或新增业务闭环。
3. 可对缺失交互/状态做合理推断，但必须在文档中标注【设计推断】。
4. 页面设计必须覆盖以下维度：
   - 页面目标
   - 页面入口
   - 页面字段
   - 交互动作
   - 正常状态
   - 空状态
   - 异常状态
   - 权限差异（如适用）
5. HTML 设计稿必须与 `UI_DESIGN_SPEC.md` 一致，禁止文档与原型脱节。
6. 若需求冲突或信息不足，先在 UI 文档中列出【待确认】，不得擅自定稿关键业务规则。
7. 不得将 HTML 原型写成纯文案页面，必须体现接近真实产品界面的结构与组件布局。
8. 不得直接进入前端业务代码实现（如 `frontend/web/src/` 业务模块开发）。
9. 不做后端接口实现、不修改后端服务逻辑。
10. 不做与本次页面设计无关的代码重构或目录重组。
11. 设计文档中涉及变更的段落需使用【新增】/【修改】/【删除】标记。
12. 文档信息区需包含至少：文档类型、生成 Skill、上游输入、版本、日期、状态。

## 6. Steps

按以下步骤执行，不可跳步：

### 步骤 1：读取并归档输入

1. 读取 `PRD_RECTIFIED.md`、`MVP_SCOPE.md`、`RESEARCH_SUMMARY.md`。
2. 读取可选 OpenSpec 资料与增量变更资料。
3. 记录本次采用的输入清单与版本时间，写入 `UI_DESIGN_SPEC.md` 文档信息区。

### 步骤 2：提取页面与功能点

1. 从 PRD 功能章节提取页面实体、主任务流、关键字段。
2. 建立“功能点 -> 页面 -> 关键动作”映射。
3. 标出需要跨页面协作的关键流程（如列表 -> 详情 -> 编辑 -> 回列表）。

### 步骤 3：归纳页面清单

1. 输出 `SCREEN_INVENTORY.md`，按模块列出页面编码、页面名称、角色、入口、优先级。
2. 标识新增页/改造页/只读页，并标注来源需求编号。

### 步骤 4：绘制页面流转关系

1. 输出 `PAGE_FLOW.md`，描述主流程、分支流程、异常回流路径。
2. 每条流转需标注触发动作与结果状态（成功/失败/无权限/无数据）。

### 步骤 5：输出 UI 设计说明

1. 输出 `UI_DESIGN_SPEC.md`，按页面描述布局结构、字段规则、交互行为与状态方案。
2. 对推断项标注【设计推断】，对冲突项标注【待确认】。

### 步骤 6：输出 HTML 高保真设计稿

1. 在固定目录输出 HTML 原型文件（单页或多页）。
2. 首页 `index.html` 作为导航入口，能跳转到各核心页面。
3. 每个核心页面都提供可视化布局和假数据示例。

### 步骤 7：一致性自检

1. 核对 HTML 页面与 `UI_DESIGN_SPEC.md` 的字段、状态、动作是否一致。
2. 核对 `SCREEN_INVENTORY.md` 页面是否都有对应 HTML 文件。
3. 核对 `PAGE_FLOW.md` 主流程是否能通过页面链接演示。

### 步骤 8：输出评审检查清单

1. 输出 `UI_REVIEW_CHECKLIST.md`，覆盖产品、设计、前端、测试四类检查项。
2. 标记必审项、可选项、阻塞项，并给出评审结论记录位。

## 7. HTML Prototype Requirements

Codex 生成 HTML 设计稿时必须满足：

1. 风格：采用真实后台管理界面风格（左侧导航 + 顶部栏 + 内容工作区）。
2. 组件：至少体现导航、列表、表单、详情、弹窗、状态标签等常见组件。
3. 端形态：桌面端优先（建议宽度 1366/1440 设计基线）。
4. 视觉：简洁现代、层级清晰，避免花哨动画和无意义视觉噪音。
5. 组织：优先多页 HTML 原型；若单页，也必须提供明确锚点或局部切换机制。
6. 覆盖：每个核心页面必须有独立 HTML 文件或独立可定位区块。
7. 流程：核心页面之间必须可跳转，至少覆盖主流程闭环。
8. 数据：允许使用假数据占位，但字段命名需与 PRD 一致。
9. 集成：不要求真实接口，不绑定生产构建链路。
10. 评审：页面可直接用于产品、开发、测试联合评审与需求澄清。

## 8. Quality Gate

完成本 Skill 前必须全部满足：

- [ ] 页面清单完整，覆盖本次范围内所有核心页面。
- [ ] 页面流转形成闭环，主流程可演示。
- [ ] 主要页面均已生成 HTML 原型文件。
- [ ] 字段、状态、交互与 `PRD_RECTIFIED.md` 对齐。
- [ ] 所有【设计推断】与【待确认】均已明确标记。
- [ ] 文档输出路径与命名符合项目模板规范。
- [ ] HTML 原型可本地打开并完成跨页跳转。
- [ ] 结果可直接作为前端正式开发输入，不需二次重排结构。

未通过任一项时，必须回到对应步骤补齐，不得宣布完成。

## 9. Example

示例场景：会员管理系统（后台管理端）

需求范围示例：

1. 会员列表管理
2. 会员详情查看
3. 会员信息编辑
4. 会员等级配置
5. 积分流水查询

应产出文档：

1. `docs/02-design/UI_DESIGN_SPEC.md`
   - 定义会员列表筛选区、表格列、操作按钮、详情布局、编辑字段校验、等级规则展示、积分流水状态规则。
2. `docs/02-design/SCREEN_INVENTORY.md`
   - 页面清单至少包含：会员列表页、会员详情页、会员编辑页、会员等级页、积分流水页。
3. `docs/02-design/PAGE_FLOW.md`
   - 至少描述：列表 -> 详情 -> 编辑 -> 保存返回；列表 -> 积分流水；等级页配置 -> 生效反馈。
4. `docs/02-design/UI_REVIEW_CHECKLIST.md`
   - 产品评审（字段正确性）、设计评审（视觉一致性）、开发评审（可实现性）、测试评审（状态覆盖）。

应产出 HTML 文件（示例）：

1. `frontend/design-prototype/index.html`
2. `frontend/design-prototype/member-list.html`
3. `frontend/design-prototype/member-detail.html`
4. `frontend/design-prototype/member-edit.html`
5. `frontend/design-prototype/member-level.html`
6. `frontend/design-prototype/points-ledger.html`
7. `frontend/design-prototype/assets/styles.css`

示例页面最小能力要求：

- 会员列表页：筛选、分页、状态标签、批量操作入口。
- 会员详情页：基础信息、账户状态、最近行为摘要。
- 会员编辑页：表单分组、字段校验提示、保存/取消操作。
- 会员等级页：等级规则列表、升级条件展示、启停状态。
- 积分流水页：流水列表、类型筛选、异常流水标识。

---

执行提示（给 Codex）：

1. 本 Skill 的完成定义是“文档 + HTML 原型同时落盘”，缺一不可。
2. 若输入不足，先输出带【待确认】标记的可评审版本，不得空转。
3. 任何超出 PRD 的扩展必须明确标注【设计推断】并可回滚。
