---
name: backoffice-ui-spec
description: 当需要为后台管理高保真原型建立统一版式、文案、状态与交互门禁时触发；输出可被 ui-design-spec / prototype-build / prototype-check 直接消费的规范基线。
---

# Skill: backoffice-ui-spec — 后台高保真设计规范

## Purpose

输出后台管理页面的统一设计规范，约束信息层级、主次操作、字段展示、文案、状态标签与反馈规则，避免原型生成出现不符合业务用户习惯的排版和交互。

本 Skill 产出的规范用于被下游 Skill 直接消费，不替代业务需求、架构设计和代码实现。

## When to Use

- 需要生成后台管理高保真原型（display / acceptance）且希望先冻结布局与交互规范。
- 当前项目出现信息层级混乱、主按钮不唯一、技术字段直出、文案研发化、状态反馈不一致等问题。
- 需要为 `ui-design-spec`、`prototype-build`、`prototype-check` 提供统一门禁依据。

## When Not to Use

- 仅做移动端或营销落地页视觉探索。
- 仅做业务需求梳理但尚未进入 UI 基线阶段。
- 直接生成 HTML 原型（应使用 `prototype-build`）。

## Inputs

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/01-requirements/MVP_SCOPE.md`
3. `docs/01-requirements/OUT_OF_SCOPE.md`
4. `docs/02-design/SCREEN_INVENTORY.md`（如已存在）
5. `docs/02-design/UI_DESIGN_SPEC.md`（如已存在）
6. current change artifact（如项目启用 OpenSpec）：`<current-change>`

## Outputs

1. `docs/02-design/BACKOFFICE_UI_SPEC.md`

## Rules

1. 规范默认适用桌面后台（`>=1200`），移动端仅定义降级可读规则，不扩展为完整移动后台规范。
2. 文案口径默认纯中文业务文案；技术字段仅允许出现在字段映射表，不得在展示文案中直出。
3. 规范必须覆盖以下 10 条强制规则（`BO-RULE-001~010`），任一缺失视为规范不完整：
   - `BO-RULE-001`：信息层级清晰（页面目标、主任务、首屏决策信息）
   - `BO-RULE-002`：主操作唯一（每页仅 1 个主按钮，位置固定）
   - `BO-RULE-003`：操作优先级（主/次/危险分级，危险动作不得与主操作同层抢焦点）
   - `BO-RULE-004`：字段展示映射（技术字段 -> 业务中文标签）
   - `BO-RULE-005`：文案中文化（禁 `from_status/to_status/biz_id/user_id` 等技术字段直出）
   - `BO-RULE-006`：状态标签语义（颜色语义、禁用态、可点击态）
   - `BO-RULE-007`：反馈闭环（空态、加载态、失败态、成功态）
   - `BO-RULE-008`：表格/筛选/分页闭环（筛选动作、结果反馈、分页区完整）
   - `BO-RULE-009`：主操作语义一致（主按钮文案含“选中/批量”时必须存在选择机制与已选反馈）
   - `BO-RULE-010`：页面区块白名单（页面出现的功能卡片/区块必须在白名单声明）
4. 每条 `BO-RULE` 必须提供“检查方式 + 失败判定 + 修复建议”，确保可执行、可判定。
5. 规范必须声明与既有 `BUILD-RULE-001~009`、`UX-TARGET-*` 的关联映射，不得形成两套冲突标准。
6. 若信息不足，使用 `【待确认】` 标记；不得自行发明未定义业务动作。
7. 冷启动规则（强制）：
   - 若 `docs/02-design/` 不存在，先创建目录。
   - 若 `BACKOFFICE_UI_SPEC.md` 不存在，按本 Skill 内置结构创建完整文档。
   - 若文档状态为 `模板`，整文件覆盖为正式产物结构。
   - 若文档状态不为 `模板`，按章节标题增量更新，不按章节序号硬编码。

## Workflow

### 步骤 0：初始化输出载体（冷启动）

- 确保 `docs/02-design/` 存在。
- 初始化 `BACKOFFICE_UI_SPEC.md`（缺失则创建、模板则覆盖）。

`BACKOFFICE_UI_SPEC.md` 最小结构：

```markdown
# 后台高保真设计规范

## 文档信息
- 文档类型：产物
- 生成 Skill：`backoffice-ui-spec`
- 上游输入：`PRD_RECTIFIED.md`、`MVP_SCOPE.md`、`SCREEN_INVENTORY.md`（如有）
- 版本：v1.0
- 日期：YYYY-MM-DD
- 状态：草稿 / 已冻结

## 1. 适用范围与术语

## 2. 页面信息层级与版式骨架（BO-RULE-001）

## 3. 主操作唯一性与位置规则（BO-RULE-002）

## 4. 操作优先级与危险动作防呆（BO-RULE-003）

## 5. 字段展示映射规则（BO-RULE-004）

## 6. 中文业务文案规范（BO-RULE-005）

## 7. 状态标签语义规范（BO-RULE-006）

## 8. 反馈闭环规范（BO-RULE-007）

## 9. 表格/筛选/分页闭环（BO-RULE-008）

## 10. 主操作语义一致性（BO-RULE-009）

## 11. 页面区块白名单（BO-RULE-010）

## 12. 下游 Skill 消费映射（ui-design-spec / prototype-build / prototype-check）

## 13. Fail-fast 门禁判定

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

### 步骤 1：提取后台页面与关键任务

- 从 `PRD_RECTIFIED.md` 提取后台页面、关键任务、角色、字段与状态。
- 从 `MVP_SCOPE.md`、`OUT_OF_SCOPE.md`、`<current-change>` 提取范围边界。
- 若存在 `SCREEN_INVENTORY.md`，读取页面编号与页面类型，建立规范映射基线。

### 步骤 2：编写 10 条强制规则（BO-RULE-001~010）

每条规则按统一结构输出：

- 规则编号
- 规则描述（必须/不得）
- 检查方式（如何验证）
- 失败判定（触发阻塞条件）
- 修复建议（可执行动作）

### 步骤 3：定义可复用模板片段

在规范文档中提供可复制模板：

- 页面目标与主任务模板
- 主/次/危险操作模板
- 字段映射模板
- 状态标签模板
- 反馈闭环模板
- 表格/筛选/分页闭环模板
- 主操作语义与选择机制模板
- 页面区块白名单模板

### 步骤 4：建立下游消费映射

明确三类下游消费关系：

- `ui-design-spec`：用 `BO-RULE` 回填设计基线与评审清单
- `prototype-build`：用 `BO-RULE` 执行构建期硬规则自检
- `prototype-check`：用 `BO-RULE` 执行开发前 Fail-fast 门禁

### 步骤 5：输出 Fail-fast 规则

至少包含以下 Fail-fast 项：

1. 信息层级不清晰
2. 主按钮不唯一或位置不一致
3. 文案出现技术字段直出
4. 状态颜色语义或禁用/可点击态缺失
5. 表格/筛选/分页闭环缺失
6. 主按钮文案为“选中/批量”但页面缺少选择机制或已选反馈
7. 页面出现未声明的功能卡片/区块

上述任一命中时，结论必须为 FAIL，且阻塞进入 `dev-implement`。

## Quality Gate

- [ ] `BACKOFFICE_UI_SPEC.md` 已输出且结构完整。
- [ ] `BO-RULE-001~010` 全部存在，且每条均包含检查方式、失败判定、修复建议。
- [ ] 文案口径默认为中文业务文案，禁止技术字段直出规则已明示。
- [ ] 已提供可复制模板片段，供下游 Skill 与提示词复用。
- [ ] 已建立 `UX-TARGET -> BUILD-RULE -> BO-RULE` 对齐关系。
- [ ] Fail-fast 条件明确，任一命中均阻塞进入下游。

## Example

示例：会员管理系统后台

- 页面：会员档案、状态/生命周期、等级规则、积分台账、权益定义
- 规范结果：
  - 主按钮固定为“提交变更/发布/保存”，每页仅一处主按钮
  - 所有状态显示为中文业务标签，不展示 `ACTIVE/FROZEN` 原始码
  - 列表页统一具备筛选区、结果区、分页区
  - 所有表单动作具备空态/加载态/失败态/成功态反馈

## 版本信息

- 当前版本：v1.1.0
- 更新时间：2026-04-03

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| v1.1.0 | 2026-04-03 | 【修改】新增 `BO-RULE-009/010`：主操作语义一致性与页面区块白名单，并纳入 Fail-fast。 |
| v1.0.0 | 2026-04-03 | 【新增】新增后台高保真设计规范 Skill，定义 BO-RULE-001~008 与 Fail-fast 门禁。 |
