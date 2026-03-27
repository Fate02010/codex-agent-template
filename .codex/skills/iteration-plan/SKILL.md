---
name: iteration-plan
description: 版本迭代管理
---

# Skill: iteration-plan — 版本迭代管理

## 触发条件

当需要规划新一轮迭代、管理版本基线或记录发布历史时使用。常见场景：

- 首次交付后需要规划后续迭代
- 变更受理（`change-intake`）完成后，需要将已批准的 CR 纳入迭代
- 一轮迭代完成后，需要冻结版本基线并记录变更日志
- 缺陷修复后需要发布补丁版本

## 输入

分两种模式读取输入：

1. **首次交付冻结模式**
   - `docs/03-testing/TEST_REPORT.md`
   - `docs/DOC_CHECK_REPORT.md`（结果须为 PASS）
   - 当前冻结文档：`PRD_RECTIFIED.md`、`ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md`
   - 当前代码状态（如可获得）
2. **增量迭代规划/冻结模式**
   - `docs/04-iteration/CHANGE_REQUEST.md` — 变更请求记录（状态为"已批准"的 CR）
   - `docs/04-iteration/CHANGE_IMPACT.md` — 变更影响分析报告
   - `docs/DOC_CHECK_REPORT.md`（收尾冻结时必需，结果须为 PASS）
   - `docs/04-iteration/RELEASE_BASELINE.md` — 当前版本基线（如已存在）
   - `docs/04-iteration/ITERATION_PLAN.md` — 已有迭代计划（如已存在）
   - `docs/01-requirements/PRD_RECTIFIED.md` — 当前需求基线

## 输出

1. `docs/04-iteration/ITERATION_PLAN.md` — 迭代计划（新建或更新）
2. `docs/04-iteration/CHANGE_REQUEST.md` — 变更请求（仅回写纳入迭代字段）
3. `docs/04-iteration/RELEASE_BASELINE.md` — 版本基线（迭代冻结时更新）
4. `docs/04-iteration/CHANGELOG.md` — 变更日志（迭代完成时追加）

## 执行流程

### 步骤 1：判定执行模式并读取输入

先判断当前属于哪种模式：

- **首次交付冻结模式**：当前已完成主链测试，目标是冻结首发版本 `v1.0.0`，但尚无已批准 CR 作为输入
- **增量迭代规划模式**：存在已批准 CR，需要确定本轮迭代范围
- **增量迭代收尾冻结模式**：迭代执行已完成，需要基于当前结果冻结新版本

读取对应输入：

1. 读取 `docs/04-iteration/RELEASE_BASELINE.md` — 了解当前版本号和基线状态（如存在）
2. 读取 `docs/04-iteration/ITERATION_PLAN.md` — 了解已有迭代历史（如存在）
3. 若为“首次交付冻结模式”或“增量收尾冻结模式”，读取 `docs/DOC_CHECK_REPORT.md` — 校验结果必须为 PASS
4. 首次交付冻结模式下，读取 `TEST_REPORT.md` 和当前冻结文档
5. 增量模式下，读取 `CHANGE_REQUEST.md` 与 `CHANGE_IMPACT.md`

### 步骤 2：确定迭代范围或冻结对象

- 首次交付冻结模式：
  - 默认生成 `ITER-001`
  - 默认目标版本为 `v1.0.0`
  - 范围描述为“首次交付范围，以当前冻结需求和测试结论为准”
  - 冻结前提：`DOC_CHECK_REPORT.md` 总体结果必须为 PASS
- 增量迭代规划模式：
  - 从 `CHANGE_REQUEST.md` 中筛选状态为"已批准"且未纳入任何迭代的 CR
  - 根据 `CHANGE_IMPACT.md` 中的工作量预估和优先级，确定本轮迭代纳入哪些 CR
  - 原则：优先纳入 P0、P1 级 CR；单轮迭代工作量不宜过大
  - 对已纳入本轮的 CR，回写 `CHANGE_REQUEST.md` 中对应条目的 `纳入迭代=ITER-NNN`
- 增量迭代收尾冻结模式：
  - 根据当前迭代计划、测试结果和缺陷状态确定是否满足发布条件
  - 冻结前提：`DOC_CHECK_REPORT.md` 总体结果必须为 PASS

### 步骤 3：输出迭代计划（ITERATION_PLAN.md）

```markdown
# 迭代计划

## 文档信息
- 文档类型：产物
- 生成 Skill：`iteration-plan`
- 上游输入：首次交付模式=`TEST_REPORT.md`+`DOC_CHECK_REPORT.md`+冻结文档+代码状态；增量模式=`CHANGE_REQUEST.md`+`CHANGE_IMPACT.md`+当前版本基线（收尾冻结需 `DOC_CHECK_REPORT.md`）
- 版本：vX.Y
- 日期：YYYY-MM-DD
- 状态：草稿 / 已冻结

## 目标
明确本轮迭代范围、里程碑、交付边界和准出标准，并作为版本冻结输入。

## 范围
- 在范围内：本轮版本的目标、范围、时间、责任和风险
- 不在范围内：未批准 CR 和无关事项

## 1. 迭代概览
| 迭代编号 | 目标版本 | 状态 | 开始日期 | 计划完成日期 | 关联 CR |
|---|---|---|---|---|---|
| ITER-001 | v1.0.0 | 已发布 | YYYY-MM-DD | YYYY-MM-DD | 首次交付 |
| ITER-002 | v1.1.0 | 进行中 | YYYY-MM-DD | — | CR-001, CR-002 |

## 2. 本轮范围

### 2.1 纳入项
| CR 编号 | 标题 | 类型 | 优先级 | 目标结果 |
|---|---|---|---|---|
| CR-NNN | ... | 新增功能 | P1 | ... |

### 2.2 不纳入项
| CR 编号 | 原因 |
|---|---|
| CR-NNN | 工作量超限 / 依赖未就绪 |

## 3. 迭代目标
本轮迭代目标描述。

## 4. 执行计划
| 步骤 | 任务 | 责任 Skill | 输出物 | 状态 |
|---|---|---|---|---|
| 1 | 更新需求基线 | prd-rectify | PRD_RECTIFIED.md | — |
| 2 | 更新接口/数据模型 | solution-design | API_CONTRACT.md / DATA_MODEL.md | — |
| 3 | 测试设计 | qa-design | TEST_PLAN.md / TEST_CASES.md | — |
| 4 | 开发实现 | dev-implement | backend/ / frontend/ | — |
| 5 | 测试执行 | qa-execute | TEST_REPORT.md | — |
| 6 | 缺陷修复 | defect-fix | 修复代码 / DEFECT_LOG.md | — |
| 7 | 文档校验 | doc-check | DOC_CHECK_REPORT.md | — |
| 8 | 版本冻结 | iteration-plan | RELEASE_BASELINE.md / CHANGELOG.md | — |

## 5. 里程碑
| 里程碑 | 目标日期 | 完成标准 |
|---|---|---|
| 需求冻结 | YYYY-MM-DD | `PRD_RECTIFIED.md` 已冻结 |
| 设计冻结 | YYYY-MM-DD | 架构/接口/数据模型已冻结 |
| 开发完成 | YYYY-MM-DD | 代码可编译并通过基础测试 |
| 测试完成 | YYYY-MM-DD | `TEST_REPORT.md` 达到准出标准 |
| 版本冻结 | YYYY-MM-DD | `RELEASE_BASELINE.md` 与 `CHANGELOG.md` 已更新 |

## 6. 风险与阻塞
| 风险/阻塞 | 影响 | 应对措施 |
|---|---|---|

## 7. 历史迭代
### ITER-001: v1.0.0（首次交付）
- 状态：已发布
- 包含：全部初始功能（F001 - FNNN）
- 发布日期：YYYY-MM-DD

## 异常与边界
- 迭代计划必须明确“不做什么”，避免范围失控
- 迭代中新增高优先级 CR 时，必须同步回写 `2.1 纳入项`

## 完成检查
- [ ] 迭代范围明确且与已批准 CR 一致
- [ ] 里程碑与准出标准可执行
- [ ] `CHANGE_REQUEST.md` 的 `纳入迭代` 已按本轮回写
- [ ] 冻结场景下 `DOC_CHECK_REPORT.md` 总体结果为 PASS
- [ ] 可直接指导本轮执行与收尾

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

**迭代编号规则**：ITER-NNN 从 001 开始递增。首次交付为 ITER-001。

### 步骤 4：冻结版本基线（RELEASE_BASELINE.md）

当首次交付或某轮迭代所有步骤完成，且测试通过并完成 `doc-check PASS` 后，更新版本基线：

```markdown
# 版本基线

## 文档信息
- 文档类型：产物
- 生成 Skill：`iteration-plan`
- 上游输入：`ITERATION_PLAN.md`、冻结文档、`TEST_REPORT.md`、`DOC_CHECK_REPORT.md`、代码状态
- 版本：vX.Y
- 日期：YYYY-MM-DD
- 状态：草稿 / 已冻结

## 目标
记录当前可发布版本对应的文档基线、代码基线和测试结论，作为后续迭代起点。

## 范围
- 在范围内：发布版本号、冻结文档版本、代码提交点、测试结论
- 不在范围内：未发布实验性内容

## 当前版本
- **版本号**：vX.Y.Z
- **迭代编号**：ITER-NNN
- **发布日期**：YYYY-MM-DD
- **状态**：已发布 / 开发中

## 版本号规则
- **主版本号（Major）**：架构变更或不兼容改动
- **次版本号（Minor）**：新增功能（向后兼容）
- **修订号（Patch）**：缺陷修复或小改动

## 文档基线
| 文档 | 版本 | 冻结日期 | 状态 |
|---|---|---|---|
| PRD_RECTIFIED.md | vX.Y | YYYY-MM-DD | 已冻结 |
| ARCHITECTURE.md | vX.Y | YYYY-MM-DD | 已冻结 |
| API_CONTRACT.md | vX.Y | YYYY-MM-DD | 已冻结 |
| DATA_MODEL.md | vX.Y | YYYY-MM-DD | 已冻结 |
| TEST_PLAN.md | vX.Y | YYYY-MM-DD | 已冻结 |
| TEST_CASES.md | vX.Y | YYYY-MM-DD | 已冻结 |

## 代码基线
| 模块 | Git Tag / Commit | 状态 |
|---|---|---|
| backend/ | vX.Y.Z | 已标记 |
| frontend/ | vX.Y.Z | 已标记 |

## 版本历史
| 版本 | 迭代 | 发布日期 | 说明 |
|---|---|---|---|
| v1.0.0 | ITER-001 | YYYY-MM-DD | 首次交付 |

## 异常与边界
- 没有测试结论的版本不得冻结为正式基线
- 若文档基线与代码提交点不一致，应判定为阻塞

## 完成检查
- [ ] 文档基线完整
- [ ] 代码基线明确
- [ ] 测试结论明确
- [ ] `DOC_CHECK_REPORT.md` 总体结果为 PASS
- [ ] 可作为下一轮增量迭代输入

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

### 步骤 5：追加变更日志（CHANGELOG.md）

```markdown
# 变更日志

## 文档信息
- 文档类型：产物
- 生成 Skill：`iteration-plan`
- 上游输入：`ITERATION_PLAN.md`、`RELEASE_BASELINE.md`
- 版本：vX.Y
- 日期：YYYY-MM-DD
- 状态：草稿 / 已冻结

## 目标
记录每个发布版本对外可见的新增、修改、修复和废弃内容。

## 范围
- 在范围内：已发布版本的用户可见变化
- 不在范围内：未发布或内部实验性改动

## [vX.Y.Z] - YYYY-MM-DD

### 迭代信息
- 迭代编号：ITER-NNN
- 包含变更请求：CR-NNN, CR-NNN

### 新增功能
- F0XX: 功能描述（CR-NNN）

### 变更
- F0XX: 变更描述（CR-NNN）

### 修复
- BUG-XXX-NNN: 缺陷描述

### 删除
- F0XX: 删除说明（CR-NNN）

---

## [v1.0.0] - YYYY-MM-DD

### 迭代信息
- 迭代编号：ITER-001
- 首次交付

### 新增功能
- 全部初始功能

## 异常与边界
- 未发布内容不得写入变更日志
- 破坏性变更必须在 `Changed` 或 `Deprecated` 中明确提示

## 完成检查
- [ ] 每个版本都有发布日期
- [ ] 变更类别清晰
- [ ] 可对应到发布基线
```

### 步骤 6：提示下一步

- 如果是新建迭代计划：按执行计划中的步骤顺序开始，通常从 `prd-rectify` 开始更新需求基线
- 如果是冻结版本：迭代完成，可启动下一轮 `change-intake` 或进入运维阶段
- 若 `DOC_CHECK_REPORT.md` 非 PASS，必须先回到相关阶段整改，禁止冻结版本

## 注意事项

- 版本号遵循语义化版本（SemVer）：MAJOR.MINOR.PATCH
- 首次交付版本号为 v1.0.0，对应 ITER-001
- 首次交付冻结模式不依赖 CR，也必须能独立输出 `ITERATION_PLAN.md`、`RELEASE_BASELINE.md`、`CHANGELOG.md`
- 每轮迭代必须有明确的纳入 CR 列表，不允许"无计划变更"
- 版本基线冻结后，该版本对应的文档不可再修改，新变更必须进入新迭代
- CHANGELOG.md 按版本倒序排列（最新版本在最前）
- 迭代计划中的执行步骤复用主链 Skill，不重新定义流程
- 仅允许回写 `CHANGE_REQUEST.md` 的 `纳入迭代` 字段，不得在本 Skill 中改写 CR 业务内容
