# docs/AGENTS.md — 文档规范

## 1. 总则

本项目采用文档驱动开发。文档不是“交付后的说明书”，而是 Agent 执行研发任务时的输入、约束和验收依据。

- 冻结文档优先于口头描述和代码现状
- 文档必须支持追溯，不允许只写结论不写来源
- 文档必须可执行，不允许只写空泛章节标题

## 2. 目录结构

```text
docs/
├── AGENTS.md
├── DOC_CHECK_REPORT.md
├── 00-research/
│   ├── RESEARCH_SUMMARY.md
│   └── REQUIREMENTS_CLARIFIED.md
├── 01-requirements/
│   ├── CAPABILITY_CANDIDATES.md
│   ├── MVP_SCOPE.md
│   ├── OUT_OF_SCOPE.md
│   ├── FEATURE_PRIORITY.md
│   ├── CHANGE_SPLIT_HINTS.md
│   ├── PRD_RAW.md
│   ├── PRD_REVIEW_ISSUES.md
│   └── PRD_RECTIFIED.md
├── 02-architecture/
│   ├── ARCHITECTURE.md
│   ├── API_CONTRACT.md
│   └── DATA_MODEL.md
├── 02-design/
│   ├── UI_DESIGN_SPEC.md
│   ├── PAGE_FLOW.md
│   ├── SCREEN_INVENTORY.md
│   ├── UI_REVIEW_CHECKLIST.md
│   └── PROTOTYPE_CHECK_REPORT.md
├── 03-testing/
│   ├── TEST_PLAN.md
│   ├── TEST_CASES.md
│   ├── TEST_REPORT.md
│   └── DEFECT_LOG.md
├── 04-iteration/
│   ├── CHANGE_REQUEST.md
│   ├── CHANGE_IMPACT.md
│   ├── ITERATION_PLAN.md
│   ├── RELEASE_BASELINE.md
│   └── CHANGELOG.md
└── 05-retrospective/
    ├── ITERATION_REVIEW.md
    └── IMPROVEMENT_BACKLOG.md
```

## 3. 文档命名规范

- 文件名统一使用全大写 + 下划线，如 `PRD_RECTIFIED.md`
- 目录统一使用编号前缀，如 `00-research`
- 禁止中文文件名
- 新增正式文档时，优先复用现有目录，不新增随意命名的散落文件

## 4. 文档生命周期

| 状态 | 说明 | 使用要求 |
|---|---|---|
| 模板 | 仓库预置占位内容 | 首次执行相关 Skill 时必须覆盖 |
| 草稿 | 当前正在编写 | 允许补充，但不得作为开发唯一依据 |
| 评审中 | 等待评审或澄清 | 应显式记录待确认项 |
| 已整改 | 评审问题已处理 | 可以进入冻结确认 |
| 已冻结 | 当前基线 | 只能通过正式流程变更 |
| 已废弃 | 已被后续版本替代 | 保留追溯价值，不再引用为当前依据 |

## 5. 文档信息必填字段

每份正式文档至少包含以下元数据：

| 字段 | 必填 | 说明 |
|---|---|---|
| 文档类型 | 是 | 模板 / 产物 |
| 生成 Skill | 是 | 当前文档由哪个 Skill 负责生成或维护 |
| 版本 | 是 | 文档版本号或基线版本 |
| 日期 | 是 | 最近一次更新日期 |
| 状态 | 是 | 必须使用生命周期中的标准状态 |
| 上游输入 | 是 | 本文档依赖的主要输入文档 |
| 关联需求/接口/变更 | 视情况 | 能建立追溯关系时必须填写 |

若文档没有这些字段，`doc-check` 视为元数据不完整。

## 6. 文档标记规范

| 标记 | 含义 | 使用场景 |
|---|---|---|
| 【新增】 | 新增内容 | 首次出现的需求、接口、字段、用例 |
| 【修改】 | 既有内容调整 | 规格、规则、返回结构、流程改动 |
| 【删除】 | 删除内容 | 明确不再支持的功能或字段 |
| 【待确认】 | 尚未定论 | 不能直接作为开发依据 |
| 【风险】 | 风险项 | 技术、依赖、性能、合规等风险 |
| 【设计推断】 | 来自设计稿推断 | 调研、PRD 或 UI 设计阶段 |
| 【冲突】 | 输入材料矛盾 | 调研或 PRD 阶段 |
| 【澄清结论】 | 已确认结论 | 澄清阶段 |
| 【变更】 | 增量变化 | 迭代阶段更新基线 |

## 7. 统一编号体系

| 编号类型 | 格式 | 示例 |
|---|---|---|
| 澄清问题 | `CQ-NNN` | `CQ-001` |
| 功能需求 | `FNNN` | `F001` |
| 页面 | `SCR-模块-NNN` | `SCR-MEMBER-001` |
| 原型检查项 | `PC-模块-NNN` | `PC-MEMBER-001` |
| 接口 | `API-模块-NNN` | `API-ORDER-001` |
| 数据表 | `T-模块-NNN` | `T-ORDER-001` |
| 测试用例 | `TC-模块-NNN` | `TC-ORDER-001` |
| 缺陷 | `BUG-模块-NNN` | `BUG-ORDER-001` |
| 变更请求 | `CR-NNN` | `CR-001` |
| 迭代 | `ITER-NNN` | `ITER-001` |
| 复盘根因 | `RCA-NNN` | `RCA-001` |
| 改进项 | `IMP-NNN` | `IMP-001` |
| 豁免单 | `WV-ITER-NNN-NN` | `WV-ITER-002-01` |

编号规则：

- 序号从 `001` 开始，保持连续
- 编号中的模块名仅使用大写英文缩写
- 编号一旦分配，不重复使用
- 同一条内容跨文档引用时必须沿用同一编号

模块展示规则：

- 文档中的模块展示字段统一使用 `EN（中文）`，例如 `USER（用户管理）`
- `EN（中文）` 仅用于阅读展示，不替代编号
- `API-USER-001`、`TC-USER-001`、`BUG-USER-001` 等编号格式不允许混入中文

## 8. 文档结构要求

每份文档至少具备以下章节：

| 章节 | 要求 |
|---|---|
| 文档信息 | 元数据完整 |
| 目标 | 说明本文档要解决什么问题 |
| 范围 | 写清楚包含和不包含的内容 |
| 正文 | 必须落到可执行信息，如规则、字段、流程、表格 |
| 异常与边界 | 记录失败路径、限制条件、风险 |
| 变更记录 | 记录版本、日期、改动说明 |

## 9. 阶段读写契约

跨阶段传递信息时，默认按“章节标题 + 表名/字段名”读取，不按章节序号硬编码。章节序号可调整，标题语义不可漂移。

| 上游文档 | 读取位置 | 下游文档 | 写入位置 | 契约说明 |
|---|---|---|---|---|
| `RESEARCH_SUMMARY.md` | `4. 功能要点归纳` | `REQUIREMENTS_CLARIFIED.md` | `3. 更新后的功能要点` | 调研功能条目进入澄清后的功能基线 |
| `RESEARCH_SUMMARY.md` | `5. 业务规则与约束` | `REQUIREMENTS_CLARIFIED.md` | `4. 更新后的业务规则与边界` | 仅把已确认或带风险说明的规则传入 |
| `RESEARCH_SUMMARY.md` + `REQUIREMENTS_CLARIFIED.md` + `CAPABILITY_CANDIDATES.md`（可选） + `openspec/project.md` | 候选能力、业务目标、约束条件 | `MVP_SCOPE.md` + `OUT_OF_SCOPE.md` + `FEATURE_PRIORITY.md` + `CHANGE_SPLIT_HINTS.md` | 范围与优先级章节 | `scope-definition` 用于收敛本期范围并给出 change 拆分参考 |
| `MVP_SCOPE.md` + `OUT_OF_SCOPE.md` + `FEATURE_PRIORITY.md` | In Scope / Out of Scope / 优先级结论 | `PRD_RAW.md` | `4. 功能需求` | `prd-compose` 只展开 In Scope 能力，Out of Scope 不得进入 PRD 主体 |
| `REQUIREMENTS_CLARIFIED.md` | `3. 更新后的功能要点` | `PRD_RAW.md` | `4. 功能需求` | `prd-compose` 从这里分配 F 编号 |
| `PRD_RECTIFIED.md` | `3. 功能需求基线` | `ARCHITECTURE.md` | `3. 模块划分` | 架构模块职责必须回链到 F 编号 |
| `PRD_RECTIFIED.md` | `3. 功能需求基线` | `API_CONTRACT.md` | `3. 接口清单` / `4. 接口明细` | 接口必须显式关联 F 编号 |
| `PRD_RECTIFIED.md` | `3. 功能需求基线` | `DATA_MODEL.md` | `4. 表结构明细` + `建表 SQL` + `索引 SQL` | 数据表主标识符使用 `T-模块-NNN`，并输出可执行 SQL |
| `PRD_RECTIFIED.md` + `ARCHITECTURE.md` | 页面流程、角色、规则 | `UI_DESIGN_SPEC.md` / `PAGE_FLOW.md` / `SCREEN_INVENTORY.md` | 页面与交互章节 | 页面与流程必须关联需求编号 |
| `UI_DESIGN_SPEC.md` + 原型文件 | 页面布局与交互 | `PROTOTYPE_CHECK_REPORT.md` | 检查明细 | 原型变形检查必须记录可追溯问题和结论 |
| `TEST_CASES.md` | `2. 用例清单` / `3. TC 与测试代码绑定规则` | 测试代码 | `@DisplayName` / `it()` | 测试代码必须绑定已分配的 TC 编号 |
| `CHANGE_REQUEST.md` | `1. 变更请求列表` / `2. 变更明细` | `ITERATION_PLAN.md` | `2.1 纳入项` | 仅已批准且`纳入迭代=未纳入`的 CR 可被纳入当前迭代 |
| `ITERATION_PLAN.md` + `TEST_REPORT.md` + `DEFECT_LOG.md` + `DOC_CHECK_REPORT.md` | 迭代范围、测试结果、缺陷状态、阻塞项 | `ITERATION_REVIEW.md` | `1. 迭代信息` / `2. KPI 快照` / `3. 根因分析` / `4. 门禁结论` | 复盘结论必须可追溯 |
| `ITERATION_REVIEW.md` | `3. 根因分析` / `5. 改进项映射` | `IMPROVEMENT_BACKLOG.md` | `1. 改进项总表` | 每条 `RCA-NNN` 至少映射一个 `IMP-NNN` |
| `IMPROVEMENT_BACKLOG.md` | `1. 改进项总表` | `ITERATION_PLAN.md` | `4. 风险与阻塞` / `5. 准出标准` | 逾期改进项必须在下一迭代显式处理或豁免 |
| `ITERATION_REVIEW.md` | `4. 门禁结论` / `5. 豁免记录` | `RELEASE_BASELINE.md` | `5. 复盘门禁` | 版本冻结时必须记录复盘结论和豁免引用 |

## 10. 跨文档引用规则

- 需求引用：`关联需求：F001`
- 页面引用：`关联页面：SCR-MEMBER-001`
- 原型检查引用：`关联检查项：PC-MEMBER-001`
- 接口引用：`关联接口：API-USER-001`
- 数据表引用：`关联数据表：T-USER-001`
- 测试引用：`关联用例：TC-USER-001`
- 缺陷引用：`关联缺陷：BUG-USER-001`
- 变更引用：`关联变更：CR-001`
- 迭代引用：`关联迭代：ITER-001`
- 根因引用：`关联根因：RCA-001`
- 改进项引用：`关联改进项：IMP-001`
- 豁免引用：`关联豁免：WV-ITER-002-01`

跨文档引用优先使用“编号 + 文件”组合，例如：

- `参见 PRD_RECTIFIED.md § F001`
- `参见 UI_DESIGN_SPEC.md § SCR-MEMBER-001`
- `参见 API_CONTRACT.md § API-ORDER-002`

## 11. 追溯链要求

默认要求建立以下追溯关系：

```text
原始材料 → RESEARCH_SUMMARY
RESEARCH_SUMMARY / REQUIREMENTS_CLARIFIED → CAPABILITY_CANDIDATES（可选）
RESEARCH_SUMMARY / REQUIREMENTS_CLARIFIED / CAPABILITY_CANDIDATES（可选） / project.md
→ MVP_SCOPE / OUT_OF_SCOPE / FEATURE_PRIORITY / CHANGE_SPLIT_HINTS
MVP_SCOPE / OUT_OF_SCOPE / FEATURE_PRIORITY → PRD_RAW
PRD_RECTIFIED → ARCHITECTURE / API_CONTRACT / DATA_MODEL / UI_DESIGN_SPEC / PAGE_FLOW
UI_DESIGN_SPEC / PAGE_FLOW / SCREEN_INVENTORY → 原型文件 → PROTOTYPE_CHECK_REPORT
PRD_RECTIFIED / API_CONTRACT → TEST_PLAN / TEST_CASES
TEST_CASES → 测试代码
TEST_CASES / 测试代码 → TEST_REPORT
TEST_REPORT → DEFECT_LOG
CHANGE_REQUEST / CHANGE_IMPACT → ITERATION_PLAN / RELEASE_BASELINE / CHANGELOG
ITERATION_PLAN / TEST_REPORT / DEFECT_LOG / DOC_CHECK_REPORT → ITERATION_REVIEW
ITERATION_REVIEW → IMPROVEMENT_BACKLOG → 下一轮 ITERATION_PLAN
```

任何一环缺失，都必须在文档中显式写明原因，不允许静默跳过。

## 12. 冻结与变更规则

- `PRD_RECTIFIED.md`、`ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md`、`UI_DESIGN_SPEC.md`、`PAGE_FLOW.md`、`SCREEN_INVENTORY.md`、`RELEASE_BASELINE.md` 视为基线文档
- 基线文档更新时，正文必须带【修改】或【变更】标记，并补充变更记录
- 增量迭代优先局部更新，不允许整体重写导致基线丢失
- 如果文档已废弃，需在文档信息中标注状态为 `已废弃`

## 13. 文档完成定义

一份文档只有满足以下条件，才算“可用”：

- [ ] 章节完整，非空壳
- [ ] 元数据完整
- [ ] 引用编号有效
- [ ] 上游输入可追溯
- [ ] 当前结论可以被下游直接消费
- [ ] 风险和待确认项明确列出

## 14. 禁止事项

- 禁止跳过上游文档直接写下游文档
- 禁止在冻结基线里混入未确认内容
- 禁止文档只保留标题、不填可执行内容
- 禁止文档和代码长期不一致
- 禁止测试文档不绑定需求、接口和 TC 编号
- 禁止 Skill 依赖固定章节序号而不是章节标题
