---
name: scope-definition
description: 在业务调研与需求澄清完成后，基于候选能力收敛本期 MVP 范围并输出边界文档；不用于编写完整 PRD、架构设计、代码实现或 UI 原型生成。
---

# Skill: scope-definition — MVP 范围定义

## Purpose

将“候选能力集合”收敛为“本期可交付的 MVP 范围边界”，并为后续 `prd-compose` 与 OpenSpec change 拆分提供可执行输入。

本 Skill 的核心目标：

- 基于调研结论定义本期 MVP。
- 明确输出本期不做能力（Out of Scope）。
- 给出功能优先级排序与取舍理由。
- 输出 change 拆分参考，供后续 OpenSpec 规划使用。

## When to Use

满足以下任一条件时触发：

- 已完成 `biz-research`，需要在写 PRD 前先收敛范围。
- 候选能力较多，需要明确“本期做什么 / 不做什么”。
- 需要将范围决策沉淀为可追溯文档供多角色对齐。
- 需要为后续 OpenSpec change 拆分提供初步分组和依赖顺序。

## When Not to Use

以下场景不得使用本 Skill 替代下游阶段：

- 需要编写完整 PRD（使用 `prd-compose`）。
- 需要产出架构、接口、数据模型设计（使用 `solution-design`）。
- 需要直接实现后端/前端代码（使用 `dev-implement`）。
- 需要直接生成 UI 设计说明或原型（使用 `ui-design-spec` / `prototype-build` / `prototype-check`）。

## Inputs

按以下顺序读取输入：

1. `docs/00-research/RESEARCH_SUMMARY.md`
2. `docs/00-research/REQUIREMENTS_CLARIFIED.md`
3. `docs/01-requirements/CAPABILITY_CANDIDATES.md`（可选）
4. `openspec/project.md`

输入降级策略：

- 若 `CAPABILITY_CANDIDATES.md` 缺失，从调研文档中提取候选能力并显式标注来源。
- 若关键信息不足，继续输出范围文档，但必须列出【待确认】问题，禁止臆造结论。

## Outputs

必须落盘输出以下文件：

1. `docs/01-requirements/MVP_SCOPE.md`
2. `docs/01-requirements/OUT_OF_SCOPE.md`
3. `docs/01-requirements/FEATURE_PRIORITY.md`
4. `docs/01-requirements/CHANGE_SPLIT_HINTS.md`

输出边界：

- 本 Skill 只定义范围与优先级，不写完整 PRD/架构/代码/原型。
- `CHANGE_SPLIT_HINTS.md` 仅提供拆分建议，不直接创建 OpenSpec `changes/*` 内容。

## 执行层级导读（Progressive Disclosure）

- `P0 必检（阻塞）`：输入可用、MVP/Out-of-Scope 可判定、下游可消费。
- `P1 扩展（覆盖）`：优先级与 change 拆分建议完整。
- `P2 参考（说明）`：示例与说明文本仅作参考，不参与放行。
- 执行顺序必须为：先过 `P0 Gate`，再进入 `P1`；`P2` 不得覆盖 `P0` 结论。

## Rules

执行时必须遵守：

1. 不能预设“会员系统最少一定包含哪些模块”或任何行业固定功能包。
2. 必须基于输入文档推导 MVP，所有结论需可追溯到来源。
3. 每个 In Scope / Out of Scope 条目都必须给出取舍理由。
4. 必须明确能力依赖关系（前置能力、外部依赖、顺序依赖）。
5. 必须明确“不做什么”，避免范围蔓延。
6. 若信息不足，必须输出【待确认】问题清单和影响说明。
7. 若做设计推断，必须显式标记【推断】并说明依据。
8. 范围决策应兼顾业务价值、交付风险、依赖复杂度，不以“偏好”替代事实。
9. 规则去重：`Rules` 保留主定义，`Workflow` 与 `Quality Gate` 仅引用编号与结论，不重复长段规则文本。

## Workflow

### 步骤 0：P0 Gate（阻塞）

#### [断点恢复扫描]

按 `## 断点恢复` 检查点表格从后向前扫描各步骤完成状态，确定续执起点后输出恢复摘要（格式见 `AGENTS.md` § 14.5 第 3 条），然后跳转到续执起点。若无断点，继续执行以下步骤 0 主体。

- 校验输入文档可读，且至少包含候选能力来源与范围边界来源。
- 若无法形成可判定 MVP 边界，结论必须为 `BLOCKED`，不得进入后续步骤。

### 步骤 1：读取输入并登记来源

- 汇总输入文档中的能力、目标、约束、风险、依赖线索。
- 建立候选能力来源表：能力项 -> 来源章节 -> 证据摘要。

### 步骤 2：归一化候选能力

- 合并同义能力，拆分混合能力，形成唯一候选能力列表。
- 缺失 `CAPABILITY_CANDIDATES.md` 时，在本步骤生成临时候选列表并保留来源标识。

### 步骤 3：建立评估维度

对每个能力至少评估：

- 业务价值（用户价值/业务目标贡献）
- 实施复杂度（范围、改造深度、跨端影响）
- 风险与不确定性（规则未定、外部依赖）
- 依赖关系（被依赖项与前置能力）

### 步骤 4：确定本期 MVP 与范围外项

- 按评估结果划分 In Scope / Out of Scope。
- In Scope 需满足“本期目标可验证 + 依赖可落地”。
- Out of Scope 需附延后原因和回收条件。

### 步骤 5：生成功能优先级

- 对 In Scope 与关键 Out of Scope 能力进行优先级排序（如 P0/P1/P2）。
- 每个优先级项必须包含排序理由与风险提示。

### 步骤 6：生成 change 拆分参考

- 依据依赖关系把能力分为可独立实施的 change 包。
- 输出每个 change 包的建议范围、前置依赖、推荐顺序和风险点。

### 步骤 7：写入 4 份输出文档

文档要求：

- `MVP_SCOPE.md`：本期目标、In Scope 列表、依赖与边界。
- `OUT_OF_SCOPE.md`：不做项、延后原因、回收条件。
- `FEATURE_PRIORITY.md`：优先级、排序理由、依赖摘要。
- `CHANGE_SPLIT_HINTS.md`：OpenSpec change 拆分建议与顺序。

### 步骤 8：输出待确认与推断

- 单列【待确认】问题，说明不确认会阻塞哪个下游动作。
- 单列【推断】条目，说明依据来源和可能偏差。

## Quality Gate（分层）

完成前必须全部满足：

### P0 Gate（阻塞，最小必检）

- [ ] 已明确本期 MVP（In Scope）并具备取舍理由。
- [ ] 已明确 Out of Scope，并给出延后原因。
- [ ] 信息不足项已列为【待确认】，不存在隐式假设。

### P1 Coverage Checklist（扩展覆盖）

- [ ] 已明确本期 MVP（In Scope）并具备取舍理由。
- [ ] 已明确 Out of Scope，并给出延后原因。
- [ ] 已输出优先级排序，且排序依据可追溯。
- [ ] 已输出关键依赖关系，不存在依赖断点。
- [ ] 已输出 change 拆分参考，包含推荐顺序。
- [ ] 信息不足项已列为【待确认】，不存在隐式假设。
- [ ] 所有【推断】均有依据说明，且已明确标记。
- [ ] 未越界产出 PRD、架构、代码或 UI 原型内容。

### P2 Reference Checklist（参考）

- [ ] Example 与说明文本已更新，且不改变 `P0` 判定口径。

## Example

示例主题：会员管理系统

### 示例输入（候选能力）

| 能力 ID | 候选能力 | 来源 |
|---|---|---|
| CAP-001 | 会员档案管理（列表/详情/编辑） | RESEARCH_SUMMARY |
| CAP-002 | 会员等级规则配置 | REQUIREMENTS_CLARIFIED |
| CAP-003 | 积分流水查询 | RESEARCH_SUMMARY |
| CAP-004 | 自动化营销旅程 | REQUIREMENTS_CLARIFIED |
| CAP-005 | 企业微信触达集成 | project.md |
| CAP-006 | 历史会员批量导入 | RESEARCH_SUMMARY |

### 示例输出思路

1. `MVP_SCOPE.md`
- In Scope：CAP-001、CAP-002、CAP-003、CAP-006
- 取舍理由：支持首期会员数据管理闭环；能力可独立交付；依赖清晰。
- 依赖关系：CAP-002 依赖 CAP-001 的会员主数据；CAP-003 依赖积分字段定义。

2. `OUT_OF_SCOPE.md`
- Out of Scope：CAP-004、CAP-005
- 延后原因：自动化旅程规则尚未冻结；企业微信接口能力存在外部依赖与联调风险。
- 回收条件：营销规则确认并完成外部接口可用性验证。

3. `FEATURE_PRIORITY.md`
- P0：CAP-001（会员主数据基础能力）
- P1：CAP-002、CAP-003（规则与查询能力）
- P2：CAP-006（可通过手工导入兜底，优先级低于核心运营链路）
- 所有优先级都附理由，不使用“行业惯例”作为唯一依据。

4. `CHANGE_SPLIT_HINTS.md`
- change-01：会员主数据与档案维护（CAP-001）
- change-02：等级规则与积分流水（CAP-002、CAP-003，依赖 change-01）
- change-03：历史数据导入（CAP-006，可并行评估，串行上线）
- change-04：营销自动化与企业微信集成（CAP-004、CAP-005，后续迭代）

若示例中”积分是否过期”未明确，应标记为【待确认】；
若”等级默认阈值”来源于经验判断，应标记为【推断】。

## 断点恢复

> 通用恢复原则见根目录 `AGENTS.md` § 14。本章节声明本 Skill 的步骤级检查点；未列出的项回退到 `AGENTS.md` § 14.4 默认规则。

### 检查点表格

| 步骤 | 步骤名称 | 完成判定条件 | 续执起点 |
|---|---|---|---|
| 步骤 0 | P0 Gate | 输入文档可读，可判定 MVP 边界（未 BLOCKED） | 步骤 1 |
| 步骤 1 | 读取输入并登记来源 | 候选能力来源表已建立 | 步骤 2 |
| 步骤 2 | 归一化候选能力 | 唯一候选能力列表已生成 | 步骤 3 |
| 步骤 3 | 建立评估维度 | 每个候选能力均有评估维度记录 | 步骤 4 |
| 步骤 4 | 确定本期 MVP 与范围外项 | In Scope / Out of Scope 划分完成并有取舍理由 | 步骤 5 |
| 步骤 5 | 生成功能优先级 | 优先级排序（P0/P1/P2）已产出 | 步骤 6 |
| 步骤 6 | 生成 change 拆分参考 | change 包分组与推荐顺序已产出 | 步骤 7 |
| 步骤 7 | 写入 4 份输出文档 | `docs/01-requirements/MVP_SCOPE.md`、`OUT_OF_SCOPE.md`、`FEATURE_PRIORITY.md`、`CHANGE_SPLIT_HINTS.md` 均存在且内容非模板 | 步骤 8 |
| 步骤 8 | 输出待确认与推断 | 【待确认】与【推断】条目已单列 | — |

### 默认恢复原则（兜底）

1. 若所有输出文件均不存在，从步骤 0 全量执行。
2. 若部分输出文件存在，从最早未完成步骤续执，已有内容按增量更新处理。
3. Gate Report 结论为 `BLOCKED` 时，从步骤 0 重新评估（参见 `AGENTS.md` § 14.5 第 4 条）。
