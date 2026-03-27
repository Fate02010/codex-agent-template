# Skill: doc-check — 文档追溯性校验

## 触发条件

在工作流的任意节点，需要验证全部文档内部一致性和跨文档引用有效性时使用。建议在以下时机执行：

- `biz-research` 完成后（校验调研覆盖）
- `prd-compose` 完成后（校验需求完整性）
- `solution-design` 完成后
- `qa-design` 完成后
- `defect-fix` 完成后
- 发布前

## 输入

1. `docs/00-research/RESEARCH_SUMMARY.md`（如存在）
2. `docs/00-research/REQUIREMENTS_CLARIFIED.md`（如存在）
3. `docs/01-requirements/PRD_RAW.md`（如存在）
4. `docs/01-requirements/PRD_RECTIFIED.md`（如存在）
5. `docs/02-architecture/ARCHITECTURE.md`（如存在）
6. `docs/02-architecture/API_CONTRACT.md`（如存在）
7. `docs/02-architecture/DATA_MODEL.md`（如存在）
8. `docs/03-testing/TEST_CASES.md`（如存在）
9. `docs/03-testing/TEST_REPORT.md`（如存在）
10. `docs/03-testing/DEFECT_LOG.md`（如存在）
11. `docs/04-iteration/CHANGE_REQUEST.md`（如存在）
12. `docs/04-iteration/CHANGE_IMPACT.md`（如存在）
13. `docs/04-iteration/ITERATION_PLAN.md`（如存在）
14. `docs/04-iteration/RELEASE_BASELINE.md`（如存在）
15. `docs/04-iteration/CHANGELOG.md`（如存在）
16. `docs/AGENTS.md` — 引用规则参考

## 输出

- `docs/DOC_CHECK_REPORT.md` — 校验报告（按规则分类的通过/失败结果）

## 执行流程

### 步骤 1：提取全部标识符

扫描每份文档，收集所有标识符：

| 标识符类型 | 格式 | 来源文档 |
|---|---|---|
| 调研功能要点 | 编号（流水号） | RESEARCH_SUMMARY.md |
| 澄清问题编号 | CQ-001、CQ-002、… | REQUIREMENTS_CLARIFIED.md |
| 功能编号 | F001、F002、… | PRD_RECTIFIED.md |
| 接口编号 | API-XXX-001、API-XXX-002、… | API_CONTRACT.md |
| 数据表编号 | T-XXX-001、T-XXX-002、… | DATA_MODEL.md |
| 用例编号 | TC-XXX-001、… | TEST_CASES.md |
| 缺陷编号 | BUG-XXX-001、… | DEFECT_LOG.md |
| 变更请求编号 | CR-001、CR-002、… | CHANGE_REQUEST.md / CHANGE_IMPACT.md / ITERATION_PLAN.md |
| 迭代编号 | ITER-001、ITER-002、… | ITERATION_PLAN.md / RELEASE_BASELINE.md |
| 版本号 | v1.0.0、v1.1.0、… | RELEASE_BASELINE.md / CHANGELOG.md |

### 步骤 2：校验 调研→需求 覆盖

对 `RESEARCH_SUMMARY.md` 中 `4. 功能要点归纳` 的每个条目：

- **检查**：`REQUIREMENTS_CLARIFIED.md` 中 `3. 更新后的功能要点` 是否有对应条目（确认、修改或明确放弃）
- **检查**：`PRD_RAW.md` 或 `PRD_RECTIFIED.md` 中是否有对应的 F 编号
- **记录**：PASS 或 FAIL（含详情）
- **结果**：列出孤立调研项（调研中出现但下游未覆盖的功能要点）

### 步骤 3：校验 需求→接口 覆盖

对 `PRD_RECTIFIED.md` 中的每个 F 编号：

- **检查**：`API_CONTRACT.md` 中是否至少有一个接口引用了该 F 编号
- **记录**：PASS 或 FAIL（含详情）
- **结果**：列出孤立需求（有功能定义但无对应接口）

### 步骤 4：校验 接口→用例 覆盖

对 `API_CONTRACT.md` 中的每个 API-XXX-NNN：

- **检查**：`TEST_CASES.md` 中是否至少有一条用例的"关联接口"为该接口编号
- **记录**：PASS 或 FAIL
- **结果**：列出未测试的接口

### 步骤 5：校验 用例→需求/接口 引用有效性

对 `TEST_CASES.md` 中的每个 TC-XXX-NNN：

- **检查 1**："关联需求"中的 F 编号是否在 `PRD_RECTIFIED.md` 中存在
- **检查 2**："关联接口"中的 API 编号是否在 `API_CONTRACT.md` 中存在
- **记录**：每项 PASS 或 FAIL
- **结果**：列出引用无效的测试用例

### 步骤 6：校验 数据模型覆盖

对 `DATA_MODEL.md` 中的每个 `T-模块-NNN` 条目：

- **检查**：该数据表编号是否有效，且其关联功能编号（F 编号）在 `PRD_RECTIFIED.md` 中存在
- **检查**：是否至少有一个接口涉及该表的数据
- **结果**：列出孤立的表（无需求关联）

### 步骤 7：校验 CR → 迭代纳入一致性（如 04-iteration 文档存在）

对 `CHANGE_REQUEST.md`、`CHANGE_IMPACT.md`、`ITERATION_PLAN.md` 执行以下检查：

- **检查**：`CHANGE_REQUEST.md` 中状态为"已批准"的 CR，是否都在 `ITERATION_PLAN.md` 的 `2.1 纳入项` 或明确列入 `2.2 不纳入项`
- **检查**：`CHANGE_REQUEST.md` 中 `纳入迭代=ITER-NNN` 的 CR，`ITERATION_PLAN.md` 中是否存在对应迭代编号与 CR 记录
- **检查**：`CHANGE_IMPACT.md` 中每个 CR 编号是否都能在 `CHANGE_REQUEST.md` 中找到
- **结果**：列出纳入状态断裂项、孤立影响分析项

### 步骤 8：校验 版本基线完整性（如 04-iteration 文档存在）

对 `ITERATION_PLAN.md`、`RELEASE_BASELINE.md`、`CHANGELOG.md` 执行以下检查：

- **检查**：`RELEASE_BASELINE.md` 中的版本号、迭代编号是否存在
- **检查**：`RELEASE_BASELINE.md` 中列出的基线文档是否真实存在且状态为已冻结
- **检查**：`CHANGELOG.md` 中是否存在对应版本号的发布记录
- **检查**：`ITERATION_PLAN.md` 中是否存在对应的 ITER 编号和里程碑记录
- **结果**：列出版本基线断裂项

### 步骤 9：校验 文档元数据完整性

对每份文档检查：

| 检查项 | 规则 |
|---|---|
| 文档类型 | 必须存在，且值为`模板`或`产物` |
| 生成 Skill | 必须存在，且为有效 Skill 名称 |
| 上游输入 | 必须存在，且引用文档名可解析 |
| 版本号 | 不得为"—" |
| 日期 | 不得为"—" |
| 状态 | 必须存在，且属于生命周期定义（模板/草稿/评审中/已整改/已冻结/已废弃） |
| 变更记录 | 至少有一条非占位条目 |

### 步骤 10：校验 缺陷引用（如 DEFECT_LOG.md 存在）

对每个 BUG-XXX-NNN：

- **检查**：关联的 TC-XXX-NNN 是否在 `TEST_CASES.md` 中存在
- **检查**：关联的 F 编号是否在 `PRD_RECTIFIED.md` 中存在
- **结果**：列出引用断裂的缺陷记录

### 步骤 11：生成 DOC_CHECK_REPORT.md

```markdown
# 文档追溯性校验报告

## 文档信息
- 文档类型：产物
- 生成 Skill：`doc-check`
- 上游输入：`docs/` 全量文档（按实际存在范围）
- 版本：vX.Y
- 日期：YYYY-MM-DD
- 状态：草稿 / 已冻结

## 校验信息
- 校验日期：YYYY-MM-DD
- 校验文档：[列出实际检查的文档]

## 汇总
| 校验项 | 总数 | 通过 | 失败 |
|---|---|---|---|
| 调研→需求覆盖 | N | N | N |
| 需求→接口覆盖 | N | N | N |
| 接口→用例覆盖 | N | N | N |
| 用例→需求引用有效性 | N | N | N |
| 用例→接口引用有效性 | N | N | N |
| CR→迭代纳入一致性（如适用） | N | N | N |
| 文档元数据完整性 | N | N | N |
| 数据模型→需求覆盖 | N | N | N |
| 缺陷引用有效性（如适用） | N | N | N |
| 版本基线完整性（如适用） | N | N | N |

## 总体结果：PASS / FAIL
> 任一校验项存在失败即为 FAIL。

## 详细发现

### 1. 孤立调研项（调研中出现但需求未覆盖）
| 调研编号 | 功能要点 | 状态 |
|---|---|---|

### 2. 孤立需求（有功能但无接口）
| F 编号 | 功能名称 | 状态 |
|---|---|---|

### 3. 未测试接口
| 接口编号 | 接口名称 | 状态 |
|---|---|---|

### 4. 无效用例引用
| 用例编号 | 无效引用 | 问题说明 |
|---|---|---|

### 5. 不完整文档元数据
| 文档 | 字段 | 问题说明 |
|---|---|---|

### 6. 孤立数据表
| 数据表编号 | 问题说明 |
|---|---|

### 7. 缺陷引用问题
| 缺陷编号 | 问题说明 |
|---|---|

### 8. 版本基线问题
| 版本/迭代 | 问题说明 |
|---|---|

### 9. CR 纳入一致性问题
| CR 编号 | 问题说明 |
|---|---|

## 修复建议
按优先级列出需要执行的修复动作。

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

### 步骤 12：提示后续动作

- **全部 PASS**：文档一致性良好，可以继续后续工作流
- **存在 FAIL**：列出具体需要执行的修复动作（如"为 API-USER-003 添加测试用例"、"填写 TEST_PLAN.md 的版本号"）

## 注意事项

- 本 Skill **只读取和报告**，不自动修复问题
- Agent 通过文本匹配标识符模式进行校验，不执行脚本
- 在主工作流的各个关键节点执行本 Skill，可以尽早发现偏差
- **允许部分执行**：如果某些文档尚不存在（如开发前 TEST_CASES.md 不存在），跳过相关校验项
- 校验标准遵循 `docs/AGENTS.md` 中“统一编号体系”“阶段读写契约”“跨文档引用规则”定义的规范
