# AGENTS.md — 项目总规则

## 1. 项目定位

本仓库是一套基于 Codex 的 AI Agent 软件研发模板工程，目标不是提供“文档目录示例”，而是提供一套可以直接执行的研发闭环：

- 输入可以是业务资料、调研材料、Word PRD、设计稿、高保真图、增量需求和缺陷信息
- 输出必须沉淀为可追溯文档、可验证代码、可复用规则和可冻结版本基线
- 适用范围覆盖从 0 到 1 首次交付，以及已交付系统的新增功能、需求变更、缺陷修复和版本迭代

> 模板说明：`docs/` 下所有文件都是预置模板，不代表真实产物。首次执行对应 Skill 后，模板必须被真实内容覆盖。

## 2. 核心执行原则

### 2.1 文档优先

- 先确认或更新文档，再修改代码
- 设计、接口、表结构、测试范围均以冻结文档为准
- 文档与代码冲突时，先判断文档是否为当前基线，再决定修正文档或代码

### 2.2 不跳阶段

- 上游输入缺失时，不允许直接推进下游阶段
- 首次交付若 `backend/` 和 `frontend/` 下没有可运行工程文件，进入 `dev-implement` 前必须先执行 `project-init`
- 增量需求必须先经过 `change-intake` 和 `iteration-plan`，再进入需求/设计/开发主链

### 2.3 单阶段闭环

每次只解决一个明确阶段的问题。任一阶段都必须回答以下 5 个问题：

1. 当前阶段的输入是什么
2. 当前阶段的产出写入哪些文件
3. 当前阶段的完成判定是什么
4. 有哪些待确认项和风险
5. 下一阶段可以使用哪些冻结产物继续推进

### 2.4 追溯优先

- 需求、接口、数据表、测试用例、缺陷、变更请求、迭代版本必须使用统一编号
- 复盘根因、改进项、豁免单必须使用统一编号
- 任何功能上线前，必须能从版本基线反向追溯到需求、设计、测试和变更记录

### 2.5 架构默认基线（条件强制）

- 后端默认采用 Maven 多模块：父模块（仅做版本与依赖管理）+ `common` 公共模块 + 业务模块
- 0-1 项目最小结构：`父项目` + `公共模块` + `业务模块`
- 若需求/架构识别为多端（如后台管理端 + 移动端），必须拆分为独立业务服务（如 `admin-service` 与 `app-service`）
- 前端调用接口与微服务内部调用接口必须分离，分别使用外部 Controller 与内部 Controller

## 3. 进入项目后的必读顺序

1. 本文件 `AGENTS.md`
2. `docs/01-requirements/PRD_RECTIFIED.md`
3. `docs/02-architecture/ARCHITECTURE.md`
4. `docs/02-architecture/API_CONTRACT.md`
5. `docs/02-architecture/DATA_MODEL.md`
6. 对应目录下的 `AGENTS.md`

若上述文档仍是模板或未冻结，则回到上游阶段补齐，不得继续假设。

## 4. 启动检查清单

开始任何实际工作前，先完成以下检查：

- [ ] 已识别当前是“首次交付”还是“增量迭代”
- [ ] 已确认本次阶段对应的上游文档是否存在且可用
- [ ] 原始材料已经放入仓库内可追溯位置，且将在文档中登记来源
- [ ] 已确认后端/前端工程是否存在，不存在则先执行 `project-init`
- [ ] 已确认本次工作是否涉及接口变更、表结构变更、业务规则变更、原型变更或版本变更
- [ ] 若为迭代收尾，已确认 `IMPROVEMENT_BACKLOG.md` 是否存在逾期改进项
- [ ] 已确认本次输出要覆盖哪些文档和代码目录

## 5. 首次交付主链

### 5.1 标准流程

```
project-init → biz-research → prd-compose → prd-review → prd-rectify
    → solution-design → ui-design-spec → prototype-check → qa-design
    → dev-implement → qa-execute → [defect-fix ⟲] → [doc-check ✓]
    → iteration-retro → iteration-plan（冻结 v1.0.0 基线）
```

### 5.2 阶段执行表

| 阶段 | 何时触发 | 必备输入 | 必做动作 | 标准输出 | 完成判定 |
|---|---|---|---|---|---|
| `project-init` | 仓库没有可运行工程骨架 | 根 `AGENTS.md` + 技术栈约束 | 初始化 `backend/`、`frontend/` 项目骨架，补局部 `AGENTS.md` 约束落点 | 可编译/可安装的工程目录 | 工程可启动，目录结构与规范一致 |
| `biz-research` | 已拿到原始业务资料 | Word/PDF/设计稿/访谈记录/竞品材料 | 归纳目标、角色、场景、规则、矛盾和缺口 | `RESEARCH_SUMMARY.md` + `REQUIREMENTS_CLARIFIED.md` | 输入材料全部登记，矛盾项被澄清或明确标记为待确认 |
| `prd-compose` | 调研与澄清已形成结论 | 调研摘要 + 澄清记录 + 设计稿 | 结构化输出原始 PRD，沉淀功能、流程、字段、验收标准 | `docs/01-requirements/PRD_RAW.md` | 每个功能点具备编号、描述、规则、异常和验收标准 |
| `prd-review` | 原始 PRD 完成 | `PRD_RAW.md` | 从完整性、一致性、可实现性、可测试性角度审查 | `PRD_REVIEW_ISSUES.md` | 评审结论明确，问题按级别归类 |
| `prd-rectify` | 评审存在问题 | `PRD_RAW.md` + `PRD_REVIEW_ISSUES.md` | 逐项整改并执行基线冻结（将状态从`已整改`推进为`已冻结`） | `PRD_RECTIFIED.md` | 阻塞问题全部关闭且 `PRD_RECTIFIED.md` 状态=`已冻结` |
| `solution-design` | `PRD_RECTIFIED.md` 已冻结 | `PRD_RECTIFIED.md` | 完成架构、接口、数据设计并建立追溯关系 | `ARCHITECTURE.md` + `API_CONTRACT.md` + `DATA_MODEL.md` | 接口、数据表、模块职责与需求一一对应，且 `DATA_MODEL.md` 包含建表 SQL 与索引 SQL |
| `ui-design-spec` | 需求与架构基线可用，准备前端实现 | `PRD_RECTIFIED.md` + 架构文档 + 设计稿（如有） | 输出 UI 说明、页面清单、页面流转和高保真 HTML 原型 | `docs/02-design/*` + 原型文件 | 页面与流程覆盖完整，可评审 |
| `prototype-check` | 已生成高保真原型 | `docs/02-design/*` + 原型文件 | 执行防变形检查（布局、尺寸、断点、溢出、跳转） | `PROTOTYPE_CHECK_REPORT.md` | 关键页面检查通过或风险项可追溯 |
| `qa-design` | 设计文档冻结，准备进入开发 | `PRD_RECTIFIED.md` + `API_CONTRACT.md` + `DATA_MODEL.md` | 设计测试策略和测试用例，预分配 TC 编号并建立测试代码映射 | `TEST_PLAN.md` + `TEST_CASES.md` | P0/P1/P2 用例齐备，TC 编号可直接供开发绑定测试代码 |
| `dev-implement` | 设计与测试基线已齐备 | 整改后 PRD + 设计文档 + `TEST_PLAN.md` + `TEST_CASES.md` + 局部 `AGENTS.md` | 按文档实现代码，并按 TC 编号补测试 | `backend/`、`frontend/` 代码 | 代码可编译，可说明每个改动对应的需求、设计和 TC |
| `qa-execute` | 测试计划与用例已齐备 | `TEST_PLAN.md` + `TEST_CASES.md` + 源代码 | 执行测试并回写结果、覆盖率、风险和准出建议 | `TEST_REPORT.md` | 结果真实可追溯，可明确是否准出 |
| `defect-fix` | 测试失败或缺陷新增 | `TEST_REPORT.md` + 代码 + 设计文档 | 修复缺陷、补回归测试、更新缺陷状态 | 修复代码 + `DEFECT_LOG.md` | 缺陷闭环，回归结果已记录 |
| `doc-check` | 任意关键节点 | 全部文档 | 校验追溯链、元数据、冻结状态和引用有效性 | `DOC_CHECK_REPORT.md` | 所有阻塞性文档问题关闭 |
| `iteration-retro` | 文档校验通过，准备收尾冻结 | `ITERATION_PLAN.md` + `TEST_REPORT.md` + `DEFECT_LOG.md` + `DOC_CHECK_REPORT.md` | 产出复盘结论、RCA、改进项和豁免记录 | `docs/05-retrospective/ITERATION_REVIEW.md` + `docs/05-retrospective/IMPROVEMENT_BACKLOG.md` | 复盘门禁结论为 `PASS` 或 `PASS WITH WAIVER` |
| `iteration-plan` | 首次交付完成并通过复盘门禁 | 已通过测试报告 + `DOC_CHECK_REPORT.md` + `ITERATION_REVIEW.md` + 当前冻结文档 + 代码状态 | 冻结版本、记录计划和变更日志 | `ITERATION_PLAN.md` + `RELEASE_BASELINE.md` + `CHANGELOG.md` | 版本基线明确，可作为后续增量迭代起点 |

## 6. 增量迭代支链

### 6.1 标准流程

```
change-intake → iteration-plan → prd-rectify → solution-design（局部更新）
    → ui-design-spec（按需）→ prototype-check（按需）→ qa-design
    → dev-implement → qa-execute → [defect-fix ⟲] → [doc-check ✓]
    → iteration-retro → iteration-plan（冻结新版本基线）
```

### 6.2 阶段执行表

| 阶段 | 核心目标 | 必备输入 | 标准输出 | 完成判定 |
|---|---|---|---|---|
| `change-intake` | 接收新增需求、缺陷、调整项并完成受理 | 增量资料 + 当前版本基线 | `CHANGE_REQUEST.md` + `CHANGE_IMPACT.md` | 每个 CR 都有范围、优先级、影响面和建议 |
| `iteration-plan` | 决定本轮迭代做什么、不做什么 | 已批准 CR + 影响分析 + 当前基线 + `IMPROVEMENT_BACKLOG.md`（如存在） | `ITERATION_PLAN.md` | 迭代目标、范围、里程碑和准出标准明确 |
| `prd-rectify` | 只更新受影响需求基线 | 已批准 CR + 当前 `PRD_RECTIFIED.md` | 更新后的 `PRD_RECTIFIED.md` | 变更项被清晰标记，未受影响需求保持稳定 |
| `solution-design` | 局部更新架构/接口/数据设计 | 更新后的需求基线 | 更新后的设计文档 | 每项变更均有受影响设计说明 |
| `ui-design-spec` | 更新受影响页面设计与原型 | 更新后的需求/设计文档 + 原型基线 | 更新后的 `docs/02-design/*` 与原型 | 增量页面可评审 |
| `prototype-check` | 校验增量页面视觉和交互稳定性 | 最新原型 + 基线原型（如有） | 更新后的 `PROTOTYPE_CHECK_REPORT.md` | 不存在阻塞性变形问题 |
| `qa-design` | 为增量范围预分配 TC 并补测试策略 | 增量需求 + 受影响接口/数据模型 | 更新测试文档 | 新增功能和回归范围均具备可执行 TC |
| `dev-implement` | 仅修改批准范围内的代码 | 更新后的设计文档 + 更新后的 `TEST_CASES.md` + 代码基线 | 代码与增量测试 | 变更范围受控，无越权开发，测试代码绑定有效 TC |
| `qa-execute` | 覆盖新增功能、受影响回归和高风险路径 | 更新测试文档 + 源代码 | 新测试结果 | 新功能通过，受影响旧功能回归通过 |
| `iteration-retro` | 迭代执行收尾复盘 | `ITERATION_PLAN.md` + `TEST_REPORT.md` + `DEFECT_LOG.md` + `DOC_CHECK_REPORT.md` + 现有改进项清单 | 输出 KPI、根因、改进行动与豁免记录 | `docs/05-retrospective/ITERATION_REVIEW.md` + `docs/05-retrospective/IMPROVEMENT_BACKLOG.md` | 复盘门禁结论可追溯，阻塞项已关闭或豁免 |
| `iteration-plan`（收尾） | 冻结新版本 | 全量通过结果 + `DOC_CHECK_REPORT.md` + `ITERATION_REVIEW.md` + 当前基线 | 更新版本基线和变更日志 | 新版本可发布、可追溯 |

## 7. 文档状态与冻结规则

### 7.1 标准状态

| 状态 | 含义 | 可否继续编辑 |
|---|---|---|
| `模板` | 仓库预置占位内容 | 可以 |
| `草稿` | 正在编写，尚未评审 | 可以 |
| `评审中` | 等待审查或澄清 | 可以，但必须记录变更 |
| `已整改` | 问题已处理，待冻结 | 可以 |
| `已冻结` | 当前唯一有效基线 | 不允许随意编辑，变更必须走流程 |
| `已废弃` | 已被新版本替代 | 不再作为实现依据 |

### 7.2 冻结规则

- `PRD_RECTIFIED.md`、`ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md`、`UI_DESIGN_SPEC.md`、`PAGE_FLOW.md`、`SCREEN_INVENTORY.md`、`RELEASE_BASELINE.md` 默认属于基线文档
- `prd-rectify` 负责需求基线冻结：整改完成后必须将 `PRD_RECTIFIED.md` 状态更新为 `已冻结`，否则不得进入 `solution-design`
- `solution-design` 负责设计基线冻结：输出 `ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md` 后需更新为 `已冻结`，否则不得进入 `qa-design` / `dev-implement`
- `ui-design-spec` 与 `prototype-check` 负责原型基线：原型检查未通过时不得进入 `dev-implement`
- 修改基线文档时，必须在正文中使用【修改】或【变更】标记，并同步更新变更记录
- 接口、表结构、业务规则、原型交互变更必须先更新对应文档，再改代码

## 8. 技术栈约束

### 8.1 后端

| 项目 | 技术选型 |
|---|---|
| 语言 | Java 17+ |
| 框架 | Spring Boot 3.x |
| ORM | MyBatis + MyBatis-Plus |
| 数据库 | MySQL 8.x |
| 缓存 | Redis |
| 构建 | Maven 多模块（父模块 + common + 业务模块） |
| 代码规范 | 阿里巴巴 Java 开发手册 |

### 8.2 前端

| 项目 | 技术选型 |
|---|---|
| Web 端 | Vue 3 + Composition API + TypeScript |
| 后台管理组件库 | Element Plus（默认强制） |
| 小程序 | 微信小程序原生 / UniApp |
| 跨端方案 | UniApp |

### 8.3 文档格式

所有正式文档统一使用 Markdown，存放于 `docs/`。

### 8.4 目录与命名约束

- 后端工程初始化默认命名为 `backend/<project-name>-parent`，子模块至少包含 `common` 与一个业务模块
- 前端工程初始化默认命名为 `frontend/<project-name>/web`
- 单仓多服务时，服务命名需与 `ARCHITECTURE.md` 模块命名一致

## 9. 变更规则

| 变更类型 | 必须先更新的文档 | 再修改的对象 |
|---|---|---|
| 接口变更 | `docs/02-architecture/API_CONTRACT.md` | 后端 Controller / 前端 API 调用 |
| 表结构变更 | `docs/02-architecture/DATA_MODEL.md` | Entity / Mapper / SQL |
| 业务规则变更 | `docs/01-requirements/PRD_RECTIFIED.md` | 对应业务代码 |
| 架构调整 | `docs/02-architecture/ARCHITECTURE.md` | 对应模块代码 |
| 原型或页面交互变更 | `docs/02-design/UI_DESIGN_SPEC.md` + `docs/02-design/PAGE_FLOW.md` | 前端页面 / 组件 / 原型文件 |
| 新增需求/变更 | `docs/04-iteration/CHANGE_REQUEST.md` + `CHANGE_IMPACT.md` | 受影响文档和代码 |
| 过程改进/复盘豁免 | `docs/05-retrospective/ITERATION_REVIEW.md` + `docs/05-retrospective/IMPROVEMENT_BACKLOG.md` | 下轮迭代计划、对应整改文档与代码 |
| 发布基线变化 | `docs/04-iteration/RELEASE_BASELINE.md` + `CHANGELOG.md` | Tag / 版本号 / 发布说明 |

## 10. 质量门槛

交付前至少满足以下条件：

- [ ] 调研文档已完成并可追溯到输入材料
- [ ] `PRD_RECTIFIED.md` 已冻结
- [ ] 架构、接口、数据模型已冻结并与代码一致，数据模型已包含建表 SQL 与索引 SQL
- [ ] 页面设计与原型检查报告可追溯（如本迭代涉及前端页面变更）
- [ ] 代码可编译通过，无阻塞性 warning
- [ ] 单元测试、集成测试、关键回归测试通过
- [ ] `TEST_REPORT.md` 达到准出标准
- [ ] `DOC_CHECK_REPORT.md` 无阻塞项
- [ ] `ITERATION_REVIEW.md` 门禁结论为 `PASS` 或 `PASS WITH WAIVER`
- [ ] `IMPROVEMENT_BACKLOG.md` 逾期项已关闭或登记有效豁免
- [ ] 测试代码与 TC 编号映射校验通过
- [ ] 版本基线已冻结，变更日志已登记

## 11. Skill 使用指引

| 任务场景 | 推荐 Skill |
|---|---|
| 新项目，需要一次初始化前后端代码骨架 | `project-init` |
| 仅初始化后端骨架 | `backend-bootstrap` |
| 仅初始化前端骨架 | `frontend-bootstrap` |
| 拿到业务资料/调研材料，需要调研归纳和澄清 | `biz-research` |
| 需求已澄清，需要编写正式 PRD | `prd-compose` |
| 拿到 PRD，需要评审 | `prd-review` |
| PRD 评审完，需要整改 | `prd-rectify` |
| 需求明确，需要出设计方案 | `solution-design` |
| 需求与架构已定，需要补 UI 设计说明和高保真原型 | `ui-design-spec` |
| 原型已生成，需要做防变形检查 | `prototype-check` |
| 需要生成测试计划和用例 | `qa-design` |
| 设计完成，需要写代码 | `dev-implement` |
| 用例就绪，需要执行测试 | `qa-execute` |
| 测试有失败，需要修复缺陷 | `defect-fix` |
| 需要校验文档一致性和追溯链 | `doc-check` |
| 已交付系统收到新需求/变更单/增量资料 | `change-intake` |
| 需要做迭代复盘、沉淀改进项并判断冻结门禁 | `iteration-retro` |
| 需要规划迭代、冻结版本基线、记录发布 | `iteration-plan` |

## 12. 文档标记规范

- 【新增】新增内容
- 【修改】对已有内容的调整
- 【删除】删除内容
- 【待确认】尚未定论，不能直接进入实现
- 【风险】存在交付、技术、依赖或合规风险
- 【设计推断】根据设计稿或上下文推断出的需求
- 【冲突】不同输入材料之间存在矛盾
- 【澄清结论】需求澄清阶段已确认的结论
- 【变更】增量迭代中新增或变更的内容

## 13. 目录规则

- `AGENTS.md` 负责目录级长期稳定约束
- `SKILL.md` 负责按任务触发的执行流程
- 所有 `SKILL.md` 顶部必须包含 YAML Front Matter，至少含 `name` 与 `description`
- 目录规则按范围拆分，不按角色拆分
- 未经流程确认的临时结论，不得写入冻结基线文档
