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
3. `docs/01-requirements/PRD_RECTIFIED.md`（如存在）
4. `docs/02-architecture/ARCHITECTURE.md`（如存在）
5. `docs/02-architecture/API_CONTRACT.md`（如存在）
6. `docs/02-architecture/DATA_MODEL.md`（如存在）
7. `docs/03-testing/TEST_CASES.md`（如存在）
8. `docs/03-testing/TEST_REPORT.md`（如存在）
9. `docs/03-testing/DEFECT_LOG.md`（如存在）
10. `docs/AGENTS.md` — 引用规则参考

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
| 表名 | t_xxx | DATA_MODEL.md |
| 用例编号 | TC-XXX-001、… | TEST_CASES.md |
| 缺陷编号 | BUG-XXX-001、… | DEFECT_LOG.md |

### 步骤 2：校验 调研→需求 覆盖

对 `RESEARCH_SUMMARY.md` 第 5 章（功能要点）中的每个条目：

- **检查**：`REQUIREMENTS_CLARIFIED.md` 中是否有对应条目（确认、修改或明确放弃）
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

对 `DATA_MODEL.md` 中的每张表：

- **检查**：该表的关联功能编号（F 编号）是否在 `PRD_RECTIFIED.md` 中存在
- **检查**：是否至少有一个接口涉及该表的数据
- **结果**：列出孤立的表（无需求关联）

### 步骤 7：校验 文档元数据完整性

对每份文档检查：

| 检查项 | 规则 |
|---|---|
| 版本号 | 不得为"—" |
| 日期 | 不得为"—" |
| 变更记录 | 至少有一条非占位条目 |
| 关联文档 | 必须引用有效的文档名 |

### 步骤 8：校验 缺陷引用（如 DEFECT_LOG.md 存在）

对每个 BUG-XXX-NNN：

- **检查**：关联的 TC-XXX-NNN 是否在 `TEST_CASES.md` 中存在
- **检查**：关联的 F 编号是否在 `PRD_RECTIFIED.md` 中存在
- **结果**：列出引用断裂的缺陷记录

### 步骤 9：生成 DOC_CHECK_REPORT.md

```markdown
# 文档追溯性校验报告

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
| 文档元数据完整性 | N | N | N |
| 数据模型→需求覆盖 | N | N | N |
| 缺陷引用有效性（如适用） | N | N | N |

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
| 表名 | 问题说明 |
|---|---|

### 7. 缺陷引用问题
| 缺陷编号 | 问题说明 |
|---|---|

## 修复建议
按优先级列出需要执行的修复动作。

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

### 步骤 10：提示后续动作

- **全部 PASS**：文档一致性良好，可以继续后续工作流
- **存在 FAIL**：列出具体需要执行的修复动作（如"为 API-USER-003 添加测试用例"、"填写 TEST_PLAN.md 的版本号"）

## 注意事项

- 本 Skill **只读取和报告**，不自动修复问题
- Agent 通过文本匹配标识符模式进行校验，不执行脚本
- 在主工作流的各个关键节点执行本 Skill，可以尽早发现偏差
- **允许部分执行**：如果某些文档尚不存在（如开发前 TEST_CASES.md 不存在），跳过相关校验项
- 校验标准遵循 `docs/AGENTS.md` 第 6 章定义的引用格式规范
