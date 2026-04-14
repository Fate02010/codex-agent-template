---
name: sprint-planner
description: 基于冻结的 feature_list.json 自动评估功能复杂度、检测依赖关系，并按优先级与容量约束将功能点分配到 Sprint，输出可供 iteration-plan 和 parallel-task-splitter 消费的 SPRINT_PLAN.md。
---

# Skill: sprint-planner — Sprint 规划

## 触发条件

当 `docs/01-requirements/feature_list.json` 的 `meta.status` 为 `"frozen"` 时使用本 Skill。

以下场景不触发本 Skill：

- `feature_list.json` 尚未生成（应先执行 `spec-freeze`）
- `feature_list.json` 的 `meta.status` 不为 `"frozen"`（规格尚未冻结）
- 仅需要长期产品阶段规划（应使用 `product-roadmap`）
- 仅需要管理 ITER-NNN 版本基线（应使用 `iteration-plan`）
- 仅需要按功能点拆分前后端任务包（应使用 `parallel-task-splitter`）

## 输入

1. `docs/01-requirements/feature_list.json`（必须，`meta.status` 须为 `"frozen"`）
2. `docs/01-requirements/FEATURE_PRIORITY.md`（可选，有则优先用于覆盖默认优先级）
3. `docs/01-requirements/MVP_SCOPE.md`（可选，用于识别 MVP 范围内功能）
4. 用户配置参数（可选，通过对话传入）：
   - `sprintCapacity`：每个 Sprint 容量（默认 20 故事点/Sprint）
   - `sprintDurationWeeks`：每个 Sprint 时长（默认 2 周）
   - `startDate`：第一个 Sprint 起始日期（默认今日）

## 输出

1. `docs/05-iteration/SPRINT_PLAN.md` — Sprint 规划主文档

## 执行层级导读（Progressive Disclosure）

- `P0 必检（阻塞）`：输入合法性校验、所有功能点已分配到 Sprint（无漏分）、Sprint 容量未溢出超过 20%、依赖约束无违反。
- `P1 扩展（覆盖）`：依赖关系完整检测、风险项全部标记、故事点计算明细透明可审计、SPRINT_PLAN.md 可被下游直接消费。
- `P2 参考（说明）`：故事点估算说明、拆分建议、日期范围仅作参考，不参与放行。
- 执行顺序必须为：先过 `P0 Gate`，再进入步骤 1~7；`P2` 不得覆盖 `P0` 结论。

## 执行规则

1. 冷启动规则（强制）：
   - 若 `docs/05-iteration/` 不存在，先创建目录。
   - 若 `SPRINT_PLAN.md` 不存在，创建完整文档。
   - 若 `SPRINT_PLAN.md` 已存在且状态不为 `模板`，整文件覆盖重新生成（与冻结的 `feature_list.json` 严格绑定，不支持增量更新）。
2. 复杂度评分（强制，详见步骤 2）：
   - 每个功能点必须基于 `feature_list.json` 的结构化数据自动计算原始分，折算为斐波那契故事点（1/2/3/5/8）。
   - 原始分公式：`fields×0.3 + businessRules×0.8 + stateMachine×1.0 + apis×1.2 + tables×0.6 + exceptions×0.4 + acceptanceCriteria×0.5 + 双端?2.0:0 + pending?1.5:0`
   - 映射规则：[0,4)→1, [4,8)→2, [8,14)→3, [14,22)→5, [22,+∞)→8
   - 故事点为 8 的功能点必须输出【建议拆分】提示。
3. 依赖检测（强制）：
   - 共享 `tables`：两个功能点引用相同表名，则存在数据依赖。
   - 共享 `apis`：两个功能点引用相同 API 路径，则存在接口依赖。
   - 依赖方不得早于被依赖方进入 Sprint（依赖方 Sprint 编号 >= 被依赖方 Sprint 编号）。
4. Sprint 分配原则（强制）：
   - 优先级 P0 功能先于 P1，P1 先于 P2 分配。
   - 相同优先级内，被更多功能依赖（依赖深度大）的功能排前。
   - 相同优先级和依赖深度内，故事点小的先排（降低早期 Sprint 溢出风险）。
   - `pending: true` 的功能不得分配到 Sprint-1，从 Sprint-2 开始尝试。
   - 单 Sprint 故事点总和不得超过 `sprintCapacity × 1.2`（20% 缓冲上限）。
   - 若当前 Sprint 不满足容量或依赖约束，顺延到下一个 Sprint（动态追加）。
5. `pending: true` 处理（强制）：
   - `pending` 功能可以分配 Sprint，但必须在 Sprint 清单和风险项中双重标记。
   - 禁止分配到 Sprint-1。
6. P0 Gate 未通过时，结论必须为 `BLOCKED/FAIL`，不得进入后续步骤。
7. 规则去重：`执行规则` 保留主定义，`执行流程` 与 `Quality Gate` 仅引用编号与结论。

## 执行流程

### 步骤 0：P0 Gate（阻塞）

#### [断点恢复扫描]

按 `## 断点恢复` 检查点表格从后向前扫描各步骤完成状态，确定续执起点后输出恢复摘要（格式见 `AGENTS.md` § 14.5 第 3 条），然后跳转到续执起点。若无断点，继续执行以下步骤 0 主体。

1. 校验 `docs/01-requirements/feature_list.json` 存在且可被 `JSON.parse()` 解析。
2. 校验 `meta.status === "frozen"`，否则输出 `BLOCKED/FAIL`：`feature_list.json` 状态不为 frozen，请先执行 `spec-freeze`。
3. 校验 `features` 数组非空，否则输出 `BLOCKED/FAIL`：`feature_list.json` 中无功能点。
4. 读取用户参数（如未提供，使用默认值：容量 20 故事点/Sprint，时长 2 周，起始日期 = 今日）。
5. 若 `FEATURE_PRIORITY.md` 存在，校验格式可读；若不可读，降级为使用默认优先级规则。

### 步骤 1：读取上游输入

读取 `feature_list.json`，提取 `features[]` 全部功能点。

若 `FEATURE_PRIORITY.md` 存在，建立 **功能名称/模块 → 优先级** 映射表（P0/P1/P2）。

若 `MVP_SCOPE.md` 存在，建立 **MVP 内功能清单**，用于默认优先级推断。

**优先级归一化规则（当 `FEATURE_PRIORITY.md` 不存在时）：**

| 情形 | 默认优先级 |
|---|---|
| 功能点出现在 `MVP_SCOPE.md` 的 In Scope 列表 | P0 |
| 功能点 `pending: false` 且不在 MVP 中 | P1 |
| 功能点 `pending: true` | P2（自动降级，另列入风险项） |
| 三者均不适用 | P1 |

### 步骤 2：计算每个功能点的故事点

对 `features[]` 中每个功能点执行：

**计算各指标数量：**

```
nFields    = features[i].fields.length
nRules     = features[i].businessRules.length
nStates    = features[i].stateMachine.length
nApis      = features[i].apis.length
nTables    = features[i].tables.length
nExc       = features[i].exceptions.length
nAC        = features[i].acceptanceCriteria.length
isDual     = features[i].scope.backend && features[i].scope.frontend
isPending  = features[i].pending
```

**计算原始分：**

```
rawScore = nFields×0.3 + nRules×0.8 + nStates×1.0 + nApis×1.2
         + nTables×0.6 + nExc×0.4 + nAC×0.5
         + (isDual ? 2.0 : 0)
         + (isPending ? 1.5 : 0)
```

**映射到故事点：**

```
storyPoints:
  rawScore < 4  → 1
  rawScore < 8  → 2
  rawScore < 14 → 3
  rawScore < 22 → 5
  rawScore >= 22→ 8   【建议拆分】
```

**权重设计依据：**

| 指标 | 权重 | 理由 |
|---|---|---|
| 字段数 | 0.3 | 字段多说明数据模型复杂，但单字段工作量小 |
| 业务规则数 | 0.8 | 每条规则对应后端逻辑分支 + 单元测试 |
| 状态机行数 | 1.0 | 需状态枚举、迁移逻辑、前端状态展示三层代码 |
| API 数 | 1.2 | 每个 API = 接口定义 + 实现 + 测试，工作量最重 |
| 表数 | 0.6 | DDL + ORM + 迁移脚本，中等工作量 |
| 异常场景数 | 0.4 | 异常处理代码 + 测试补充 |
| 验收标准数 | 0.5 | 验收项多意味着验收工作量高 |
| 双端 | +2.0 | 前后端联调工作量是固定增量，而非乘数 |
| pending | +1.5 | 不确定性带来返工风险，加分惩罚 |

所有计算明细记录在 SPRINT_PLAN.md 的"功能点复杂度评分明细"表中（透明可审计）。

### 步骤 3：依赖关系检测

**构建共享资源索引：**

- `tableIndex`：`表名 → [功能点 ID 列表]`（列表长度 >= 2 则这些功能点间有数据依赖）
- `apiIndex`：`API路径 → [功能点 ID 列表]`（列表长度 >= 2 则有接口依赖）

**依赖方向判定规则：**

- 同模块功能共享同一核心表：按功能点 ID 升序视为先后依赖（F001 先于 F002）。
- 不同模块间共享表：双方互为"需协调调度"，标注"跨模块共享表，建议同 Sprint 或先后 Sprint"。
- API 依赖：共享同一路径（不同 HTTP 方法）时，以 POST/PUT（写操作）为被依赖方，GET（读操作）为依赖方。

**输出依赖矩阵：**`被依赖功能 → [依赖它的功能列表]`，用于步骤 4 的分配约束和依赖深度计算。

### 步骤 4：Sprint 分配

1. 初始化 Sprint 列表，从 Sprint-1 开始，按需动态追加。
2. 按以下排序键对功能点排序（优先级从高到低）：
   - 优先级（P0 > P1 > P2）
   - 依赖深度（被依赖方数量越多排越前）
   - 故事点（相同优先级和依赖深度时，故事点小的先排）
3. 逐个功能点尝试分配到最早满足条件的 Sprint：
   - 检查容量：当前 Sprint 已用故事点 + 本功能故事点 <= `sprintCapacity × 1.2`
   - 检查依赖：所有被依赖功能已安排到此 Sprint 或更早的 Sprint
   - `pending: true` 的功能跳过 Sprint-1，从 Sprint-2 开始检查
4. 分配完成后校验每个 Sprint 总故事点是否在容量上限内。

### 步骤 5：生成 SPRINT_PLAN.md

按以下模板生成完整文档：

```markdown
# Sprint 规划

## 文档信息
- 文档类型：产物
- 生成 Skill：`sprint-planner`
- 上游输入：`docs/01-requirements/feature_list.json`（frozen）、`FEATURE_PRIORITY.md`（可选）、`MVP_SCOPE.md`（可选）
- feature_list 版本：[meta.version]
- 生成日期：YYYY-MM-DD
- Sprint 容量：XX 故事点/Sprint
- Sprint 时长：N 周
- 状态：草稿

---

## Sprint 总览

| Sprint | 日期范围 | 功能数 | 故事点合计 | 容量利用率 | 状态 |
|---|---|---|---|---|---|
| Sprint-1 | YYYY-MM-DD ~ YYYY-MM-DD | N | XX / 20 | XX% | 规划中 |
| Sprint-2 | YYYY-MM-DD ~ YYYY-MM-DD | N | XX / 20 | XX% | 待规划 |
| **合计** | | **N** | **XX** | | |

---

## 功能点复杂度评分明细

| 功能编号 | 功能名称 | 模块 | 字段 | 规则 | 状态机 | API | 表 | 异常 | AC | 双端 | Pending | 原始分 | 故事点 | 备注 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| F001 | ... | MOD（模块名） | N | N | N | N | N | N | N | ✅/❌ | ✅/❌ | X.X | N | |

> 原始分公式：`字段×0.3 + 规则×0.8 + 状态机×1.0 + API×1.2 + 表×0.6 + 异常×0.4 + AC×0.5 + 双端?2.0:0 + Pending?1.5:0`
> 故事点映射：[0,4)→1 | [4,8)→2 | [8,14)→3 | [14,22)→5 | [22+]→8 ⚠️ 建议拆分

---

## 依赖关系说明

### 共享数据表依赖

| 共享表 | 涉及功能 | 建议调度策略 |
|---|---|---|
| t_xxx | F001（功能A）、F002（功能B） | F001 先于 F002，建议 F001 在 Sprint-1 |

### 共享 API 接口依赖

| 共享接口 | 涉及功能 | 建议调度策略 |
|---|---|---|
| /api/xxx | F001（POST）、F002（GET） | F001 先行，F002 可同 Sprint 或后续 Sprint |

### 跨模块依赖矩阵

| 被依赖功能 | 依赖它的功能 | 依赖类型 | 约束 |
|---|---|---|---|
| FXXX | FYYY、FZZZ | 数据依赖 | FXXX Sprint <= FYYY Sprint |

---

## Sprint-1（YYYY-MM-DD ~ YYYY-MM-DD）

**目标**：[本 Sprint 核心交付目标，一句话]

**故事点：XX / 20（XX%）**

| 功能编号 | 功能名称 | 模块 | 优先级 | 范围 | 故事点 | 依赖项 | 风险 |
|---|---|---|---|---|---|---|---|
| F001 | ... | MOD（模块名） | P0 | 后端+前端 | N | — | |

**Sprint-1 验收标准摘要：**

- F001：[关键验收条件]

---

## Sprint-2（YYYY-MM-DD ~ YYYY-MM-DD）

**目标**：[本 Sprint 核心交付目标]

**故事点：XX / 20（XX%）**

| 功能编号 | 功能名称 | 模块 | 优先级 | 范围 | 故事点 | 依赖项 | 风险 |
|---|---|---|---|---|---|---|---|
| FXXX | ... | MOD（模块名） | P1 | 后端+前端 | N | F001 | |

> ⚠️ 若某功能故事点为 8：建议在 Sprint Planning 时评估是否拆分为两个子任务。

---

## 风险项

| 类型 | 功能编号 | 功能名称 | 风险描述 | 建议处置 |
|---|---|---|---|---|
| 规格未确认 | FXXX | ... | `pending: true`，存在【待确认】项，开发前需冻结规格 | 确认规格后重新执行 `spec-freeze` → 重新执行 `sprint-planner` |
| 高复杂度 | FXXX | ... | 故事点=8，超出单功能建议粒度 | Sprint Planning 时评估拆分为 2 个子功能点 |

---

## 下游消费接口说明

### 与 iteration-plan 的关系

`SPRINT_PLAN.md`（开发排期视图）与 `ITERATION_PLAN.md`（版本管理视图）职责不重叠，互为补充：

- 一个 ITER-NNN 通常对应 1-3 个 Sprint
- `iteration-plan` 将 `SPRINT_PLAN.md` 作为可选输入，读取 Sprint 总览后输出到 `ITERATION_PLAN.md` 第 3 节 Sprint 分配摘要
- `SPRINT_PLAN.md` 是两者之间唯一的 Sprint 数据来源，`ITERATION_PLAN.md` 引用而不重复维护

### 与 parallel-task-splitter 的关系

执行 `parallel-task-splitter` 时，可指定"仅处理 Sprint-N 的功能点"，避免一次性生成全部任务包：

> 示例：「请基于 Sprint-1 的功能点（FXXX、FYYY）执行 `parallel-task-splitter`」

---

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| v1.0 | YYYY-MM-DD | 基于 feature_list.json vX.X 初始生成 |
```

### 步骤 6：交叉校验

- [ ] `features[]` 中每个功能点均已分配到某 Sprint（无漏分）
- [ ] 无 Sprint 的故事点总和超过 `sprintCapacity × 1.2`
- [ ] 所有依赖约束未被违反（依赖方 Sprint 编号 >= 被依赖方 Sprint 编号）
- [ ] 所有 `pending: true` 功能已在风险项和 Sprint 清单中双重标记
- [ ] 故事点为 8 的功能均有【建议拆分】提示
- [ ] Sprint 总览表的日期范围已按 `startDate` + `sprintDurationWeeks` 推算

### 步骤 7：提示下一步

生成完成后提示用户：

- 下一步可使用 `iteration-plan` 将 Sprint 计划与 ITER-NNN 版本绑定（建议每个 ITER 对应 1-3 个 Sprint）
- 或使用 `parallel-task-splitter`，指定 Sprint-1 的功能点列表，生成前后端并行任务包
- `pending` 功能确认规格后需重新执行 `spec-freeze`，再重新执行 `sprint-planner`

## Quality Gate（分层）

### P0 Gate（阻塞，最小必检）

- [ ] `feature_list.json` 存在、合法 JSON、`meta.status = "frozen"`。
- [ ] `features` 数组非空。
- [ ] 所有功能点均已分配到 Sprint（无漏分）。
- [ ] 无 Sprint 故事点超过 `sprintCapacity × 1.2`。
- [ ] 依赖约束无违反（被依赖方 Sprint <= 依赖方 Sprint）。
- [ ] `SPRINT_PLAN.md` 已生成，包含总览表和每 Sprint 功能清单。

### P1 Coverage Checklist（扩展覆盖）

- [ ] 每个功能点的故事点计算均有完整原始分明细（各指标数量均已列出）。
- [ ] 所有 `pending: true` 功能已在风险项和 Sprint 清单中双重标记。
- [ ] 跨模块共享表/API 依赖已在依赖关系说明中列出。
- [ ] 故事点为 8 的功能均有【建议拆分】提示。
- [ ] Sprint 总览表包含日期范围（基于 startDate + sprintDurationWeeks 推算）。
- [ ] 下游消费接口说明（iteration-plan / parallel-task-splitter）已写入文档。

### P2 Reference Checklist（参考）

- [ ] Sprint 总览表格式可扫描、列对齐。
- [ ] 故事点估算说明充分，便于团队 Planning Poker 时参考。
- [ ] 示例文本与模板已替换为真实数据，不影响 P0 判定口径。

## 断点恢复

> 通用恢复原则见根目录 `AGENTS.md` § 14。本章节声明本 Skill 的步骤级检查点；未列出的项回退到 `AGENTS.md` § 14.4 默认规则。

### 检查点表格

| 步骤 | 步骤名称 | 完成判定条件 | 续执起点 |
|---|---|---|---|
| 步骤 0 | P0 Gate | `feature_list.json` 存在、合法 JSON、`meta.status = "frozen"`，未输出 BLOCKED/FAIL | 步骤 1 |
| 步骤 1 | 读取上游输入 | `features[]` 全部功能点已读取，优先级/MVP 映射表已建立 | 步骤 2 |
| 步骤 2 | 计算每个功能点的故事点 | 所有功能点均有原始分与斐波那契故事点计算结果 | 步骤 3 |
| 步骤 3 | 依赖关系检测 | 共享表/API 依赖矩阵已构建 | 步骤 4 |
| 步骤 4 | Sprint 分配 | 所有功能点均已分配到 Sprint（无漏分），容量与依赖约束已校验 | 步骤 5 |
| 步骤 5 | 生成 SPRINT_PLAN.md | `docs/05-iteration/SPRINT_PLAN.md` 存在且包含总览表和每 Sprint 功能清单 | 步骤 6 |
| 步骤 6 | 交叉校验 | 所有校验项通过（无漏分、无溢出、无依赖违反） | 步骤 7 |
| 步骤 7 | 提示下一步 | 已输出下游消费提示 | — |

### 默认恢复原则（兜底）

1. 若所有输出文件均不存在，从步骤 0 全量执行。
2. 若部分输出文件存在，从最早未完成步骤续执，已有内容按增量更新处理。
3. Gate Report 结论为 `BLOCKED` 时，从步骤 0 重新评估（参见 `AGENTS.md` § 14.5 第 4 条）。

## 注意事项

- 本 Skill 的故事点为**自动估算基准**，不替代团队 Planning Poker。Sprint Planning 会议中应以本文档为起点，由团队确认最终故事点。
- `SPRINT_PLAN.md` 与 `feature_list.json` 严格绑定同一冻结版本。`feature_list.json` 变更后必须重新执行本 Skill，不支持手动局部更新。
- Sprint 容量默认值（20 故事点/Sprint）基于"2 名工程师，2 周 Sprint"估算。团队规模不同时，应通过用户参数覆盖。
- `pending: true` 功能的故事点含 1.5 的风险加权。确认规格后需重新执行 `spec-freeze` + `sprint-planner`。
- 依赖检测基于共享表/API 的结构化推断，不能替代技术负责人的依赖评估。Sprint Planning 时应由技术负责人补充确认。
- 本 Skill 与 `iteration-plan` 职责不重叠：`sprint-planner` 管"功能点如何分配到时间盒"，`iteration-plan` 管"版本基线与 ITER-NNN 冻结"。`SPRINT_PLAN.md` 是 Sprint 数据的唯一来源，`ITERATION_PLAN.md` 通过第 3 节引用，不重复维护 Sprint 细节。
