# AGENTS.md — 项目总规则

## 1. 项目概述

本项目是一个 Agent 驱动的开发模板工程，采用**文档驱动开发**模式。所有开发活动以文档为输入和输出，确保调研、需求、设计、实现、测试全链路可追溯。

> **模板说明**：`docs/` 目录下的文件是**仓库预置模板**，不是已完成的 Skill 产出。首次执行对应 Skill 后，模板内容将被真实产物覆盖。每份模板文件的"文档信息"区域标注了文档类型和生成 Skill。

## 2. 工作主链

### 2.1 首次交付主链

```
project-init → biz-research → prd-compose → prd-review → prd-rectify
    → solution-design → dev-implement → qa-design → qa-execute → [defect-fix ⟲] → [doc-check ✓]
    → iteration-plan（冻结 v1.0.0 基线）
```

> - 若 `backend/` 和 `frontend/` 下无工程文件（如 `pom.xml`、`package.json`），进入 `dev-implement` 前**必须**先执行 `project-init`
> - `biz-research` 包含两个阶段：阶段一为调研归纳，阶段二为需求澄清（存在矛盾或缺口时触发）
> - `doc-check` 为可在任意节点执行的校验工具；`defect-fix` 在测试失败时触发循环

### 2.2 增量迭代支链

```
change-intake → iteration-plan → prd-rectify → solution-design（局部更新）
    → dev-implement → qa-design → qa-execute → [defect-fix ⟲] → [doc-check ✓]
    → iteration-plan（冻结新版本基线）
```

> - `change-intake` 是增量需求/变更的统一入口，负责变更受理和影响分析
> - `iteration-plan` 负责迭代规划、版本基线冻结和变更日志记录
> - 增量迭代复用主链的 Skill（prd-rectify → design → dev → qa），不重新定义流程

### 2.3 全量 Skill 清单

| 阶段 | Skill | 输入 | 输出 |
|---|---|---|---|
| 项目初始化 | `project-init` | AGENTS.md 规范文件 | 后端/前端项目脚手架 |
| 需求调研 | `biz-research` | 业务资料（Word/PDF/设计稿/调研材料） | `RESEARCH_SUMMARY.md` + `REQUIREMENTS_CLARIFIED.md` |
| 需求编写 | `prd-compose` | 调研摘要 + 澄清记录 + 可选设计稿 | `docs/01-requirements/PRD_RAW.md` |
| PRD 评审 | `prd-review` | 原始 PRD | `docs/01-requirements/PRD_REVIEW_ISSUES.md` |
| PRD 整改 | `prd-rectify` | 评审问题清单 + 原始 PRD | `docs/01-requirements/PRD_RECTIFIED.md` |
| 方案设计 | `solution-design` | 整改后 PRD | `ARCHITECTURE.md` + `API_CONTRACT.md` + `DATA_MODEL.md` |
| 开发实现 | `dev-implement` | 整改后 PRD + 设计文档 | `backend/` 或 `frontend/` 下代码 |
| 测试设计 | `qa-design` | 整改后 PRD + `API_CONTRACT.md` + `DATA_MODEL.md` | `TEST_PLAN.md` + `TEST_CASES.md` |
| 测试执行 | `qa-execute` | `TEST_PLAN.md` + `TEST_CASES.md` + 源代码 | `docs/03-testing/TEST_REPORT.md` |
| 缺陷修复 | `defect-fix` | `TEST_REPORT.md` + 源代码 + 设计文档 | 修复代码 + `docs/03-testing/DEFECT_LOG.md` |
| 文档校验 | `doc-check` | 全部文档 | `docs/DOC_CHECK_REPORT.md` |
| 变更受理 | `change-intake` | 增量需求资料 + 现有基线文档 | `CHANGE_REQUEST.md` + `CHANGE_IMPACT.md` |
| 版本迭代 | `iteration-plan` | 已批准 CR + 影响分析 + 现有基线 | `ITERATION_PLAN.md` + `RELEASE_BASELINE.md` + `CHANGELOG.md` |

## 3. 必读顺序

进入项目时，按以下顺序读取文档：

1. 本文件（`AGENTS.md`）— 了解项目总规则
2. `docs/01-requirements/PRD_RECTIFIED.md` — 了解业务需求
3. `docs/02-architecture/ARCHITECTURE.md` — 了解架构设计
4. `docs/02-architecture/API_CONTRACT.md` — 了解接口契约
5. `docs/02-architecture/DATA_MODEL.md` — 了解数据模型
6. 对应子目录的 `AGENTS.md` — 了解局部规范

## 4. 技术栈约束

### 后端

| 项目 | 技术选型 |
|---|---|
| 语言 | Java 17+ |
| 框架 | Spring Boot 3.x |
| ORM | MyBatis + MyBatis-Plus |
| 数据库 | MySQL 8.x |
| 缓存 | Redis |
| 代码规范 | 阿里巴巴 Java 开发手册 |

### 前端

| 项目 | 技术选型 |
|---|---|
| Web 端 | Vue 3 + Composition API + TypeScript |
| 小程序 | 微信小程序原生 / UniApp |
| 跨端方案 | UniApp |

### 文档格式

所有文档使用 Markdown 格式，存放于 `docs/` 目录下。

## 5. 变更规则

| 变更类型 | 必须先更新的文档 | 再修改的代码 |
|---|---|---|
| 接口变更 | `docs/02-architecture/API_CONTRACT.md` | 后端 Controller / 前端 API 调用 |
| 表结构变更 | `docs/02-architecture/DATA_MODEL.md` | 后端 Entity / Mapper |
| 业务规则变更 | `docs/01-requirements/PRD_RECTIFIED.md` | 对应业务代码 |
| 架构调整 | `docs/02-architecture/ARCHITECTURE.md` | 对应模块代码 |
| 增量需求/变更 | `docs/04-iteration/CHANGE_REQUEST.md` + 影响分析 | 受影响的文档和代码 |

**原则：先改文档，再改代码。文档是唯一事实来源。**

## 6. 质量门槛

- [ ] 调研文档已完成（`RESEARCH_SUMMARY.md`、`REQUIREMENTS_CLARIFIED.md`）
- [ ] 代码编译通过，无 warning
- [ ] 单元测试通过
- [ ] 接口契约与实现一致
- [ ] 数据模型与实现一致
- [ ] 文档已同步更新
- [ ] `qa-execute` 生成的 `TEST_REPORT.md` 达到准出标准
- [ ] `doc-check` 生成的 `DOC_CHECK_REPORT.md` 全部 PASS
- [ ] 测试代码与 TC 编号映射校验通过（无遗漏、无孤立测试）
- [ ] 版本基线已冻结（发布前）

## 7. Skill 使用指引

| 任务场景 | 推荐 Skill |
|---|---|
| 新项目，需要初始化代码骨架 | `project-init` |
| 拿到业务资料/调研材料，需要调研归纳和澄清 | `biz-research` |
| 需求已澄清，需要编写正式 PRD | `prd-compose` |
| 拿到 PRD，需要评审 | `prd-review` |
| PRD 评审完，需要整改 | `prd-rectify` |
| 需求明确，需要出设计方案 | `solution-design` |
| 设计完成，需要写代码 | `dev-implement` |
| 需要生成测试计划和用例 | `qa-design` |
| 用例就绪，需要执行测试 | `qa-execute` |
| 测试有失败，需要修复缺陷 | `defect-fix` |
| 需要校验文档一致性和追溯链 | `doc-check` |
| 已交付系统收到新需求/变更单/增量资料 | `change-intake` |
| 需要规划迭代、冻结版本基线、记录发布 | `iteration-plan` |

## 8. 文档标记规范

所有文档中使用以下标记：

- 【新增】— 新增的内容
- 【修改】— 修改的内容
- 【删除】— 删除的内容
- 【待确认】— 需要确认的内容
- 【风险】— 存在风险的内容
- 【设计推断】— 从设计稿推断的内容（`biz-research` / `prd-compose` 使用）
- 【冲突】— 材料之间的矛盾（`biz-research` / `prd-compose` 使用）
- 【澄清结论】— 需求澄清阶段的决策结果（`biz-research` 阶段二使用）
- 【变更】— 增量迭代中的变更内容（`change-intake` / `prd-rectify` 增量更新时使用）

## 9. 目录规则

- `AGENTS.md` 管目录级长期稳定约束
- `Skill` 管按任务触发的流程能力
- 不按角色拆 `AGENTS.md`，按目录拆
