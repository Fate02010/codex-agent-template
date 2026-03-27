# Codex Agent Template

[English](./README.md)

一个由 AI Agent 驱动的文档驱动开发模板。本模板定义了从需求调研到交付和持续迭代的完整工作流，包含分层项目规则和可复用的 Skill。支持从 0 到 1 的全新开发，也支持已交付系统的增量演进（变更受理、版本迭代、基线管理）。

## 项目结构

```
├── AGENTS.md                          # 项目总规则与工作流
├── .codex/skills/                     # 可复用 Skill 定义
│   ├── project-init/SKILL.md          # 项目脚手架初始化
│   ├── biz-research/SKILL.md          # 需求调研、信息归纳与需求澄清
│   ├── prd-compose/SKILL.md           # 详细需求文档编写
│   ├── prd-review/SKILL.md            # PRD 评审
│   ├── prd-rectify/SKILL.md           # PRD 整改
│   ├── solution-design/SKILL.md       # 架构/接口/数据设计
│   ├── dev-implement/SKILL.md         # 开发实现
│   ├── qa-design/SKILL.md             # 测试计划与用例生成
│   ├── qa-execute/SKILL.md            # 测试执行与报告
│   ├── defect-fix/SKILL.md            # 缺陷修复闭环
│   ├── doc-check/SKILL.md             # 文档追溯性校验
│   ├── change-intake/SKILL.md         # 增量变更受理与影响分析
│   └── iteration-plan/SKILL.md        # 版本迭代与基线管理
├── docs/                              # 文档（文档驱动，预置模板）
│   ├── AGENTS.md                      # 文档规范
│   ├── DOC_CHECK_REPORT.md            # 追溯性校验报告
│   ├── 00-research/                   # 调研与澄清文档
│   │   ├── RESEARCH_SUMMARY.md        # 需求调研摘要
│   │   └── REQUIREMENTS_CLARIFIED.md  # 需求澄清记录
│   ├── 01-requirements/               # 需求文档
│   │   ├── PRD_RAW.md                 # 原始 PRD（由 prd-compose 编写）
│   │   ├── PRD_REVIEW_ISSUES.md       # PRD 评审问题清单
│   │   └── PRD_RECTIFIED.md           # 整改后 PRD（冻结基线）
│   ├── 02-architecture/               # 设计文档（生成后冻结）
│   │   ├── ARCHITECTURE.md            # 架构设计
│   │   ├── API_CONTRACT.md            # 接口契约
│   │   └── DATA_MODEL.md              # 数据模型
│   ├── 03-testing/                    # 测试文档
│   │   ├── TEST_PLAN.md               # 测试计划
│   │   ├── TEST_CASES.md              # 测试用例
│   │   ├── TEST_REPORT.md             # 测试执行报告
│   │   └── DEFECT_LOG.md              # 缺陷记录
│   └── 04-iteration/                  # 迭代与版本管理
│       ├── CHANGE_REQUEST.md          # 变更请求记录
│       ├── CHANGE_IMPACT.md           # 变更影响分析报告
│       ├── ITERATION_PLAN.md          # 迭代计划
│       ├── RELEASE_BASELINE.md        # 版本基线
│       └── CHANGELOG.md               # 变更日志
├── backend/                           # 后端代码
│   └── AGENTS.md                      # 后端编码规范
├── frontend/                          # 前端代码
│   └── AGENTS.md                      # 前端编码规范
└── tests/                             # 测试产物
    └── AGENTS.md                      # 测试规范
```

> **模板说明**：`docs/` 目录下的文件是**仓库预置模板**，不是已完成的 Skill 产出。首次执行对应 Skill 后，模板内容将被真实产物覆盖。

## 工作流

### 首次交付（0 → 1）

```
project-init → biz-research → prd-compose → prd-review → prd-rectify
    → solution-design → dev-implement → qa-design → qa-execute → [defect-fix ⟲] → [doc-check ✓]
    → iteration-plan（冻结 v1.0.0 基线）
```

### 增量迭代

```
change-intake → iteration-plan → prd-rectify → solution-design（局部更新）
    → dev-implement → qa-design → qa-execute → [defect-fix ⟲] → [doc-check ✓]
    → iteration-plan（冻结新版本基线）
```

| 阶段 | Skill | 输入 | 输出 |
|---|---|---|---|
| 项目初始化 | `project-init` | AGENTS.md 规范文件 | 后端/前端项目脚手架 |
| 需求调研 | `biz-research` | 业务资料（Word/PDF/设计稿/调研材料） | `RESEARCH_SUMMARY.md` + `REQUIREMENTS_CLARIFIED.md` |
| 需求编写 | `prd-compose` | 调研摘要 + 澄清记录 + 可选设计稿 | `PRD_RAW.md` |
| PRD 评审 | `prd-review` | 原始 PRD | `PRD_REVIEW_ISSUES.md` |
| PRD 整改 | `prd-rectify` | 评审问题清单 + 原始 PRD | `PRD_RECTIFIED.md` |
| 方案设计 | `solution-design` | 整改后 PRD | `ARCHITECTURE.md` + `API_CONTRACT.md` + `DATA_MODEL.md` |
| 开发实现 | `dev-implement` | 整改后 PRD + 设计文档 | `backend/` 或 `frontend/` 下代码 |
| 测试设计 | `qa-design` | 整改后 PRD + 设计文档 | `TEST_PLAN.md` + `TEST_CASES.md` |
| 测试执行 | `qa-execute` | 测试计划 + 测试用例 + 源代码 | `TEST_REPORT.md` |
| 缺陷修复 | `defect-fix` | 测试报告 + 源代码 + 设计文档 | 修复代码 + `DEFECT_LOG.md` |
| 文档校验 | `doc-check` | 全部文档 | `DOC_CHECK_REPORT.md` |
| 变更受理 | `change-intake` | 增量需求资料 + 现有基线文档 | `CHANGE_REQUEST.md` + `CHANGE_IMPACT.md` |
| 版本迭代 | `iteration-plan` | 已批准 CR + 影响分析 + 现有基线 | `ITERATION_PLAN.md` + `RELEASE_BASELINE.md` + `CHANGELOG.md` |

## 技术栈

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
| 小程序 | 微信小程序 / UniApp |
| 跨端方案 | UniApp（H5、微信小程序、App） |

## 核心架构规则

- **DDD 分层架构**：`interfaces → application → domain ← infrastructure`
- **Controller URL 必须带版本前缀**：`/api/v1/...`
- **Controller 的 DTO 禁止进入 Domain Service** — 必须通过 Assembler 转换
- **MyBatis-Plus Service 只能作为仓储（Repository）的扩展实现**，禁止在 application 或 domain 层直接使用
- **文档优先原则**：先改文档，再改代码

## AGENTS.md 设计理念

- `AGENTS.md` 定义**目录级长期稳定约束**
- `SKILL.md` 定义**按任务触发的流程能力**
- 按目录拆分规则（而非按角色），避免重复和冲突

| 文件 | 管理范围 |
|---|---|
| 根 `AGENTS.md` | 项目总规则、工作流、技术栈 |
| `docs/AGENTS.md` | 文档命名、结构、标记、编号体系规范 |
| `backend/AGENTS.md` | 后端分层、编码、异常处理规范 |
| `frontend/AGENTS.md` | 前端组件、状态管理、接口对接规范 |
| `tests/AGENTS.md` | 测试用例模板、覆盖要求、报告规范 |

## 快速开始

1. 克隆本仓库
2. 若 `backend/` 和 `frontend/` 下无工程文件，先执行 `project-init` 初始化项目骨架
3. 将原始业务资料放入项目中（Word、PDF、设计稿图片、调研材料、访谈记录）
4. 按顺序执行 Skill：
   - `biz-research` — 调研归纳原始业务资料，澄清矛盾和缺口
   - `prd-compose` — 将澄清后的需求编写为正式 PRD
   - `prd-review` — 评审 PRD，生成问题清单
   - `prd-rectify` — 根据评审结果整改 PRD
   - `solution-design` — 生成架构设计、接口契约、数据模型
   - `dev-implement` — 按设计文档进行开发实现
   - `qa-design` — 生成测试计划和测试用例
   - `qa-execute` — 执行测试，生成测试报告
   - `defect-fix` — 如有失败用例，修复缺陷（循环直至通过）
   - `doc-check` — 校验文档追溯性和一致性（可在任意节点执行）
5. 已交付系统的增量迭代：
   - `change-intake` — 接收新增需求或变更单，执行影响分析
   - `iteration-plan` — 规划迭代范围，迭代完成后冻结版本基线
   - 然后按需执行 `prd-rectify → solution-design → dev-implement → qa-design → qa-execute`

## 许可证

MIT
