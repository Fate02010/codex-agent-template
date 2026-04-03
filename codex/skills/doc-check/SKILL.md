---
name: doc-check
description: 在关键节点执行跨文档追溯与门禁校验；当存在阻塞性结构缺失、引用断链或基线不一致时输出 FAIL 并阻止下游阶段。
---

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
3. `docs/01-requirements/MVP_SCOPE.md`（如存在）
4. `docs/01-requirements/PRD_RAW.md`（如存在）
5. `docs/01-requirements/PRD_RECTIFIED.md`（如存在）
6. `docs/02-architecture/ARCHITECTURE.md`（如存在）
7. `docs/02-architecture/API_CONTRACT.md`（如存在）
8. `docs/02-architecture/DATA_MODEL.md`（如存在）
9. `docs/02-design/UI_DESIGN_SPEC.md`（如存在）
10. `docs/02-design/PAGE_FLOW.md`（如存在）
11. `docs/02-design/SCREEN_INVENTORY.md`（如存在）
12. `docs/02-design/UI_REVIEW_CHECKLIST.md`（如存在）
13. `docs/02-design/DESIGN_TOKENS.md`（如存在）
14. `docs/02-design/COMPONENT_GUIDELINES.md`（如存在）
15. `docs/02-design/STATE_MATRIX.md`（如存在）
16. `docs/02-design/PROTOTYPE_BUILD_NOTES.md`（如存在）
17. `docs/02-design/PROTOTYPE_CHECK_REPORT.md`（如存在）
18. `docs/02-design/PROTOTYPE_FIX_LOG.md`（如存在）
19. `docs/03-testing/TEST_CASES.md`（如存在）
20. `docs/03-testing/TEST_REPORT.md`（如存在）
21. `docs/03-testing/DEFECT_LOG.md`（如存在）
22. `docs/04-iteration/CHANGE_REQUEST.md`（如存在）
23. `docs/04-iteration/CHANGE_IMPACT.md`（如存在）
24. `docs/04-iteration/ITERATION_PLAN.md`（如存在）
25. `docs/04-iteration/RELEASE_BASELINE.md`（如存在）
26. `docs/04-iteration/CHANGELOG.md`（如存在）
27. `docs/05-retrospective/ITERATION_REVIEW.md`（如存在）
28. `docs/05-retrospective/IMPROVEMENT_BACKLOG.md`（如存在）
29. `docs/AGENTS.md` — 引用规则参考

## 输出

- `docs/DOC_CHECK_REPORT.md` — 校验报告（按规则分类的通过/失败结果）

## 执行层级导读（Progressive Disclosure）

- `P0 必检（阻塞）`：阻塞性结构缺失、引用断链、冻结状态冲突等硬失败识别。
- `P1 扩展（覆盖）`：全链路追溯覆盖、元数据完整性、版本与迭代闭环检查。
- `P2 参考（说明）`：模板与说明文本仅作参考，不参与放行。
- 执行顺序必须为：先过 `P0 Gate`，再进入 `P1`；`P2` 不得覆盖 `P0` 结论。

## 执行流程

### 步骤 0：P0 Gate（阻塞）

- 校验最小输入集合可读（至少需求、设计、测试中的可用文档集合）。
- 校验报告输出路径可写。
- 任一不满足时输出 `BLOCKED/FAIL` 并停止，不进入步骤 1~13。

### 步骤 1：提取全部标识符

扫描每份文档，收集所有标识符：

| 标识符类型 | 格式 | 来源文档 |
|---|---|---|
| 调研功能要点 | 编号（流水号） | RESEARCH_SUMMARY.md |
| 澄清问题编号 | CQ-001、CQ-002、… | REQUIREMENTS_CLARIFIED.md |
| 功能编号 | F001、F002、… | PRD_RAW.md / PRD_RECTIFIED.md |
| 业务规则编号 | BR-XXX-001、BR-XXX-002、… | PRD_RAW.md |
| 异常场景编号 | EX-XXX-001、EX-XXX-002、… | PRD_RAW.md |
| 验收标准编号 | AC-XXX-001、AC-XXX-002、… | PRD_RAW.md |
| 页面编号 | SCR-XXX-001、… | SCREEN_INVENTORY.md / UI_DESIGN_SPEC.md |
| 接口编号 | API-XXX-001、API-XXX-002、… | API_CONTRACT.md |
| 数据表编号 | T-XXX-001、T-XXX-002、… | DATA_MODEL.md |
| 用例编号 | TC-XXX-001、… | TEST_CASES.md |
| 缺陷编号 | BUG-XXX-001、… | DEFECT_LOG.md |
| 变更请求编号 | CR-001、CR-002、… | CHANGE_REQUEST.md / CHANGE_IMPACT.md / ITERATION_PLAN.md |
| 迭代编号 | ITER-001、ITER-002、… | ITERATION_PLAN.md / RELEASE_BASELINE.md |
| 版本号 | v1.0.0、v1.1.0、… | RELEASE_BASELINE.md / CHANGELOG.md |
| 根因编号 | RCA-001、RCA-002、… | ITERATION_REVIEW.md |
| 改进项编号 | IMP-001、IMP-002、… | ITERATION_REVIEW.md / IMPROVEMENT_BACKLOG.md |
| 豁免编号 | WV-ITER-001-01、… | ITERATION_REVIEW.md / IMPROVEMENT_BACKLOG.md |

### 步骤 2：校验 调研→需求 覆盖

对 `RESEARCH_SUMMARY.md` 中 `4. 功能要点归纳` 的每个条目：

- **检查**：`REQUIREMENTS_CLARIFIED.md` 中 `3. 更新后的功能要点` 是否有对应条目（确认、修改或明确放弃）
- **检查**：`PRD_RAW.md` 或 `PRD_RECTIFIED.md` 中是否有对应的 F 编号
- **记录**：PASS 或 FAIL（含详情）
- **结果**：列出孤立调研项（调研中出现但下游未覆盖的功能要点）

### 步骤 2.5：校验 `PRD_RAW.md` 结构完整性（如存在）

对 `PRD_RAW.md` 中的每个 `FNNN` 条目执行以下检查：

- **检查**：是否存在 `所属模块`，且模块展示符合 `EN（中文）`
- **检查**：是否存在 `关联来源`、`关联澄清`、`用户价值`、`参与角色`、`前置条件`、`触发条件`、`主流程`、`替代流程`、`后置结果`
- **检查**：`字段清单` 是否存在，且列至少包含字段名、类型、长度/精度、必填、默认值、校验规则（最小/最大/格式/枚举）、空值策略、错误提示、说明
- **检查**：`字段清单` 是否达到参数级约束粒度，不得仅出现“按规范校验”“前端校验”这类笼统描述
- **检查**：`业务规则` 是否存在，且编号符合 `BR-模块-NNN`，同时包含“是否影响接口/表结构”列
- **检查**：是否存在跨字段规则（可在业务规则或单独章节），并明确联动/互斥/优先级/冲突处理
- **检查**：`状态流转` 是否存在；若无独立状态机，是否明确声明“无独立状态流转”
- **检查**：`异常场景` 是否存在，且编号符合 `EX-模块-NNN`
- **检查**：`边界条件` 是否存在
- **检查**：`验收标准` 是否存在，且编号符合 `AC-模块-NNN`
- **检查**：`验收标准` 是否可测试，未出现“支持正常使用”“体验良好”等空泛表述；优先采用 Given/When/Then（或等价三段式）

对 `PRD_RAW.md` 全文执行以下检查：

- **检查**：`2.1 角色-权限-动作矩阵` 是否存在，且覆盖核心角色与关键动作
- **检查**：`7. 追溯矩阵` 是否存在，且每个 `FNNN` 都有对应条目
- **检查**：`8. 待确认事项` 是否存在，且已区分“普通待确认”与“阻塞设计”
- **检查**：标记为“阻塞设计”的事项是否带 `【待确认】` / `【设计推断】` / `【冲突】` 之一
- **检查**：关键流程是否提供伪流程图文本（或等价步骤化流程）且能对齐角色、状态和关键字段
- **检查**：非功能需求是否提供可验证阈值（性能/安全/兼容/日志审计至少包含目标值与验证口径）
- **记录**：PASS 或 FAIL（含详情）
- **结果**：列出结构缺失、编号不合规、追溯入口缺失、阻塞设计标识不完整的条目

### 步骤 2.6：校验 `PRD_RECTIFIED.md` 冻结可用性（如存在）

对 `PRD_RECTIFIED.md` 执行以下检查：

- **检查**：文档状态是否为 `已冻结`（若当前阶段要求冻结）
- **检查**：每个 `FNNN` 是否仍保留字段参数级约束列（同 `PRD_RAW.md` 要求）
- **检查**：关键业务规则是否保留“是否影响接口/表结构”标记
- **检查**：验收标准是否可测试，并可映射测试级别/验证方式
- **检查**：是否保留遗留风险与待确认项，且未关闭阻塞项不会误标记为“已冻结”
- **记录**：PASS 或 FAIL（含详情）
- **结果**：列出“已冻结状态与内容不一致”的条目

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

### 步骤 4.5：校验 需求→页面设计 覆盖（如 02-design 文档存在）

对 `PRD_RECTIFIED.md` 中每个 F 编号：

- **检查**：`UI_DESIGN_SPEC.md` 或 `SCREEN_INVENTORY.md` 是否存在对应页面/交互条目
- **检查**：`PAGE_FLOW.md` 是否覆盖核心流程
- **检查**：`STATE_MATRIX.md` 是否覆盖关键页面状态
- **检查**：`DESIGN_TOKENS.md` 与 `COMPONENT_GUIDELINES.md` 是否存在并可被原型阶段消费
- **结果**：列出“有需求但无页面设计映射”的条目

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

### 步骤 9：校验 复盘闭环一致性（如 05-retrospective 文档存在）

对 `ITERATION_REVIEW.md`、`IMPROVEMENT_BACKLOG.md`、`ITERATION_PLAN.md`、`RELEASE_BASELINE.md` 执行以下检查：

- **检查**：每个冻结版本对应的 `ITER-NNN`，是否存在同编号复盘记录
- **检查**：`ITERATION_REVIEW.md` 的门禁结论是否为 `PASS / PASS WITH WAIVER / FAIL`
- **检查**：`PASS WITH WAIVER` 场景是否存在有效 `WV-ITER-NNN-NN` 记录，并带失效迭代
- **检查**：每个 `RCA-NNN` 是否映射至少一个 `IMP-NNN`
- **检查**：`IMPROVEMENT_BACKLOG.md` 中逾期改进项是否在当前迭代计划风险清单中体现
- **结果**：列出复盘断链项、无主改进项、失效豁免项

### 步骤 10：校验 文档元数据完整性

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

### 步骤 11：校验 缺陷引用（如 DEFECT_LOG.md 存在）

对每个 BUG-XXX-NNN：

- **检查**：关联的 TC-XXX-NNN 是否在 `TEST_CASES.md` 中存在
- **检查**：关联的 F 编号是否在 `PRD_RECTIFIED.md` 中存在
- **结果**：列出引用断裂的缺陷记录

### 步骤 12：生成 DOC_CHECK_REPORT.md

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
| PRD 原始结构完整性 | N | N | N |
| PRD 原始参数级约束完整性 | N | N | N |
| PRD 整改基线可用性 | N | N | N |
| 需求→接口覆盖 | N | N | N |
| 需求→页面设计覆盖（如适用） | N | N | N |
| 接口→用例覆盖 | N | N | N |
| 用例→需求引用有效性 | N | N | N |
| 用例→接口引用有效性 | N | N | N |
| CR→迭代纳入一致性（如适用） | N | N | N |
| 复盘闭环一致性（如适用） | N | N | N |
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

### 2. PRD 原始结构问题
| 需求编号/章节 | 问题类型 | 问题说明 |
|---|---|---|

### 3. PRD 参数级约束问题
| 需求编号/字段 | 问题说明 |
|---|---|

### 4. PRD 整改基线问题
| 需求编号/章节 | 问题说明 |
|---|---|

### 5. 孤立需求（有功能但无接口）
| F 编号 | 功能名称 | 状态 |
|---|---|---|

### 6. 未测试接口
| 接口编号 | 接口名称 | 状态 |
|---|---|---|

### 7. 需求与页面设计断链
| 需求编号 | 问题说明 |
|---|---|

### 8. 无效用例引用
| 用例编号 | 无效引用 | 问题说明 |
|---|---|---|

### 9. 不完整文档元数据
| 文档 | 字段 | 问题说明 |
|---|---|---|

### 10. 孤立数据表
| 数据表编号 | 问题说明 |
|---|---|

### 11. 缺陷引用问题
| 缺陷编号 | 问题说明 |
|---|---|

### 12. 版本基线问题
| 版本/迭代 | 问题说明 |
|---|---|

### 13. CR 纳入一致性问题
| CR 编号 | 问题说明 |
|---|---|

### 14. 复盘闭环问题
| 迭代/改进项/豁免 | 问题说明 |
|---|---|

## 修复建议
按优先级列出需要执行的修复动作。

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

### 步骤 13：提示后续动作

- **全部 PASS**：文档一致性良好，可以继续后续工作流
- **存在 FAIL**：列出具体需要执行的修复动作（如"为 API-USER-003 添加测试用例"、"填写 TEST_PLAN.md 的版本号"）

## Quality Gate（分层）

### P0 Gate（阻塞，最小必检）

- [ ] 已识别并输出所有阻塞性失败（结构缺失/引用断链/冻结状态冲突）。
- [ ] 存在阻塞性失败时，总体结果必须为 `FAIL`。
- [ ] 报告中每个 `FAIL` 均有可复核证据与修复动作。

### P1 Coverage Checklist（扩展覆盖）

- [ ] 调研->需求->接口->测试->版本 的追溯检查覆盖完整。
- [ ] 元数据、缺陷、CR、复盘闭环检查已按存在性执行。
- [ ] 跳过项均有“文档不存在/阶段未到”的明确原因。

### P2 Reference Checklist（参考）

- [ ] 模板与说明文本已更新，且不改变 `P0` 判定口径。

## 注意事项

- 本 Skill **只读取和报告**，不自动修复问题
- Agent 通过文本匹配标识符模式进行校验，不执行脚本
- 在主工作流的各个关键节点执行本 Skill，可以尽早发现偏差
- **允许部分执行**：如果某些文档尚不存在（如开发前 TEST_CASES.md 不存在），跳过相关校验项
- `PRD_RAW.md` 结构校验主要用于 `prd-compose` 之后的早期质量门禁，不替代 `prd-review`
- 采用严格门禁：任一阻塞性失败（结构缺失、参数级约束缺失、引用断链、冻结状态不一致）均应在报告中标记为 `FAIL` 并阻止下游阶段
- 校验标准遵循 `docs/AGENTS.md` 中“统一编号体系”“阶段读写契约”“跨文档引用规则”定义的规范
- 模块展示字段校验遵循 `EN（中文）`；编号校验仍仅按英文模块段执行，不因中文展示影响编号有效性
- 历史基线中仅英文模块展示允许保留；本轮新增/修改内容应遵循 `EN（中文）`
