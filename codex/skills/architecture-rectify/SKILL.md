---
name: architecture-rectify
description: 基于 architecture-review 输出的问题清单整改并冻结架构、接口、数据模型设计基线；仅用于关闭评审问题、定点更新现有设计文档与判定冻结，不替代 solution-design 的初版设计产出、architecture-review 的结构化评审或 doc-check 的元数据/追溯校验。
---

# Skill: architecture-rectify — 架构设计整改

## 触发条件

当 `architecture-review` 已输出 `docs/02-architecture/ARCHITECTURE_REVIEW_ISSUES.md`，且需要在进入 `qa-design` / `dev-implement` 前关闭设计问题并完成设计冻结时使用。

以下场景不触发本 Skill：

- 仍在编写设计初稿或补充设计内容（应先使用 `solution-design`）
- 尚未完成结构化评审、没有问题清单（应先使用 `architecture-review`）
- 仅需要检查文档元数据、引用、冻结状态和追溯形式（应使用 `doc-check`）

## 输入

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/02-architecture/ARCHITECTURE.md`
3. `docs/02-architecture/API_CONTRACT.md`
4. `docs/02-architecture/DATA_MODEL.md`
5. `docs/02-architecture/ARCHITECTURE_REVIEW_ISSUES.md`
6. 相关增量变更文档（迭代场景）
7. `docs/01-requirements/MVP_SCOPE.md`（如有）
8. `docs/01-requirements/OUT_OF_SCOPE.md`（如有）
9. `docs/01-requirements/FEATURE_PRIORITY.md`（如有）
10. `openspec/project.md`（如有）

## 输出

- 更新后的 `docs/02-architecture/ARCHITECTURE.md`
- 更新后的 `docs/02-architecture/API_CONTRACT.md`
- 更新后的 `docs/02-architecture/DATA_MODEL.md`
- 回写后的 `docs/02-architecture/ARCHITECTURE_REVIEW_ISSUES.md`

## 规则

1. 整改必须仅针对评审问题和其直接关联项，不得扩展需求范围或重做整套设计。
2. 不得脱离 `PRD_RECTIFIED.md` 自行发明需求，不得把后续路线图能力提前写入当前设计基线。
3. 不允许新增 `ARCHITECTURE_RECTIFIED.md`、`API_CONTRACT_RECTIFIED.md`、`DATA_MODEL_RECTIFIED.md` 等副本文件，整改直接更新现有基线文档。
4. 整改只能使用现有正文标记：`【修改】`、`【变更】`、`【待确认】`、`【风险】`。
5. 若无法关闭的问题仍影响实现，必须保留在评审问题清单中，并将设计文档状态置为 `已整改`，不得强行冻结。

## 执行流程

### 步骤 0：校验评审问题清单与设计基线

1. 读取 `docs/02-architecture/ARCHITECTURE_REVIEW_ISSUES.md`，提取所有 `🔴 阻塞` 和 `🟠 重要` 问题。
2. 读取 `docs/02-architecture/ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md`。
3. 校验 `PRD_RECTIFIED.md` 状态为 `已冻结`。
4. 若评审问题清单不存在、设计文档不存在或需求基线未冻结，则终止并返回对应上游阶段。

### 步骤 1：逐条映射问题到设计文档

针对每个问题：

1. 找到对应设计文档落点：
   - 模块划分 / 服务拓扑 / 非功能设计 → `ARCHITECTURE.md`
   - 参数约束 / 示例 / 错误码 / 兼容策略 / 写操作边界 → `API_CONTRACT.md`
   - 字段 / 约束 / 索引 / SQL / 关联关系 → `DATA_MODEL.md`
2. 确定问题影响的追溯链：
   - `F -> API`
   - `F -> T`
   - `F -> API -> T -> TC`
3. 将问题的 `整改状态` 初始化或保持为 `待整改`。

### 步骤 2：按文档整改并补齐缺口

按问题驱动更新现有设计基线，至少补齐以下内容：

| 文档 | 整改重点 |
|---|---|
| `ARCHITECTURE.md` | 模块划分与职责、服务拓扑、事务/幂等/并发边界、状态流转与异常处理、非功能量化目标、追溯矩阵 |
| `API_CONTRACT.md` | 参数级约束、成功/失败示例、错误码、兼容策略、写操作边界 |
| `DATA_MODEL.md` | 字段、约束、索引、可执行 SQL、索引用途、关联关系、审计字段 |

执行整改时：

1. 使用 `【修改】` 或 `【变更】` 标注正文修订。
2. 对仍无法确认但不影响当前记录保真的内容，使用 `【待确认】`。
3. 对存在外部依赖、性能、安全或数据一致性风险的内容，使用 `【风险】`。
4. 同步修正 `F -> API -> T -> TC` 追溯矩阵，确保需求、接口、数据表可回链。

### 步骤 3：回写整改状态与残留风险

对 `ARCHITECTURE_REVIEW_ISSUES.md` 中每个问题回写：

| 状态 | 含义 | 何时进入 |
|---|---|---|
| `待整改` | 问题已识别但尚未完成整改，或尚未满足关闭条件 | 评审输出后默认状态 |
| `已整改` | 文档已按建议修改，但仍存在未关闭阻塞、影响实现的 `【待确认】` / `【冲突】`，或仍需复核 | 已完成定点修改但暂不能关闭 |
| `已关闭` | 问题对应内容已落地到设计基线，且满足关闭条件，不再阻塞冻结 | 整改完成并通过本轮自检后 |

不得关闭的情况：

1. 关键 API 仍缺字段约束
2. 关键表仍缺 SQL 或关键索引
3. 关键流程仍缺事务 / 幂等 / 并发策略
4. 仍存在影响开发的 `【待确认】` / `【冲突】`
5. `F -> API -> T` 仍断链

### 步骤 4：重新判定是否可冻结

对三份设计基线执行冻结判定：

1. 若仍有未关闭 `🔴 阻塞`，将 `ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md` 状态置为 `已整改`，中止下游阶段。
2. 若无 `🔴 阻塞`，但仍存在影响实现的 `【待确认】` / `【冲突】`，将三份设计文档状态置为 `已整改`。
3. 若阻塞问题全部关闭，且无影响实现的 `【待确认】` / `【冲突】`，将三份设计文档状态更新为 `已冻结`。
4. 在三份设计文档的 `变更记录` 中增加冻结或整改记录（示例：`v1.1 / YYYY-MM-DD / 完成 architecture-review 问题整改并冻结设计基线`）。

## 整改后文档要求

### `ARCHITECTURE.md`

- 必须补齐模块划分与职责。
- 必须补齐服务拓扑、接口分层、关键流程实现边界。
- 必须补齐非功能量化目标（性能 / 审计 / 可观测性 / 安全边界）。
- 必须补齐或修正 `F -> API -> T -> TC` 追溯矩阵。

### `API_CONTRACT.md`

- 每个关键接口必须有参数级约束。
- 至少保留 1 组成功示例和 1 组失败示例。
- 错误码映射必须可落到错误键、触发条件和提示口径。
- 写操作必须补齐事务 / 幂等 / 并发边界。

### `DATA_MODEL.md`

- 每张关键表必须补齐字段、约束、关联关系。
- 必须存在可执行建表 SQL 和关键索引 SQL。
- 每个关键索引必须说明设计理由和查询场景。
- 审计字段和逻辑删除 / 状态字段约束必须完整。

### `ARCHITECTURE_REVIEW_ISSUES.md`

- 每个问题必须包含 `整改状态`、`整改说明`、`关联修改文档`。
- 问题关闭前不得删除原始问题描述和整改建议。
- 当仍有未关闭阻塞项时，文档状态应保持 `已整改`。
- 当阻塞与重要问题均已完成关闭，文档状态可更新为 `已关闭`。

## 完成检查

- [ ] 所有 `🔴 阻塞` 问题均已整改并回写状态
- [ ] 所有 `🟠 重要` 问题已整改、关闭或显式保留为不阻塞冻结的改进项
- [ ] `ARCHITECTURE.md` 已补齐模块职责、关键边界、非功能量化目标和追溯矩阵
- [ ] `API_CONTRACT.md` 已补齐参数约束、示例、错误码、兼容策略和写操作边界
- [ ] `DATA_MODEL.md` 已补齐字段、约束、索引、SQL 和索引用途说明
- [ ] 三份设计基线文档状态已按规则更新为 `已整改` 或 `已冻结`
- [ ] `ARCHITECTURE_REVIEW_ISSUES.md` 的问题状态与实际整改结果一致
- [ ] 未新增任何设计基线副本文件名

## 下游建议

- 若仍有阻塞项：继续停留在 `architecture-rectify`，关闭问题后重新判定冻结
- 若三份设计基线已冻结：下一步进入 `qa-design`
- 完成冻结后：建议执行 `doc-check` 校验元数据、引用和追溯链一致性

## 注意事项

- `solution-design` 负责产出设计草案或更新设计版本，不负责替代本 Skill 关闭评审问题
- `architecture-review` 负责结构化评审，不直接修改设计文档
- `architecture-rectify` 负责关闭评审问题、更新设计基线、判定并完成设计冻结
- `doc-check` 负责文档规范性、元数据、追溯形式完整性和流程符合性，不替代本 Skill 的设计整改
- 整改逻辑必须体现“问题驱动、定点修订、完成冻结”，不得退化为重新设计整套系统
