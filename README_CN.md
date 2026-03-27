# Codex Agent Template

[English](./README.md)

一套面向 Codex 的可执行软件研发模板工程。它不是“文档目录示例”，而是把调研、需求、设计、开发、测试、缺陷修复和版本迭代串成统一闭环的工作底座。

## 模板解决什么问题

这套模板用于把如下输入稳定转成可交付产物：

- 业务资料、访谈纪要、竞品调研、Word/PDF PRD
- Sketch 导出图、高保真图、页面截图
- 已交付系统的新增需求、变更单、缺陷单

输出包括：

- 可冻结的需求、设计、测试、迭代文档
- 可追溯的前后端代码与测试
- 可复用的 `AGENTS.md + Skills + docs/` 目录规范

## 项目结构

```
├── AGENTS.md
├── docs/
│   ├── AGENTS.md
│   ├── 00-research/
│   ├── 01-requirements/
│   ├── 02-architecture/
│   ├── 03-testing/
│   ├── 04-iteration/
│   └── 05-retrospective/
├── backend/
│   └── AGENTS.md
├── frontend/
│   └── AGENTS.md
└── tests/
    └── AGENTS.md
```

> `docs/` 下默认都是模板文件。首次执行相关 Skill 后，必须被真实产物覆盖。

## 两条执行主线

### 首次交付

```
project-init → biz-research → prd-compose → prd-review → prd-rectify
    → solution-design → qa-design → dev-implement → qa-execute → [defect-fix ⟲] → [doc-check ✓]
    → iteration-retro → iteration-plan
```

### 增量迭代

```
change-intake → iteration-plan → prd-rectify → solution-design
    → qa-design → dev-implement → qa-execute → [defect-fix ⟲] → [doc-check ✓]
    → iteration-retro → iteration-plan
```

## 快速开始

### 1. 初始化判断

- 如果 `backend/`、`frontend/` 还没有工程骨架，先执行 `project-init`
- 如果已经是存量系统，先执行 `change-intake`
- 如果已有冻结版 `PRD_RECTIFIED.md`、`ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md`，可以直接进入对应下游阶段

### 2. 放置输入材料

把业务资料放进仓库内可追溯的位置，然后在 `RESEARCH_SUMMARY.md` 或 `CHANGE_REQUEST.md` 中登记来源。不要只给口头描述，不落文件。

如果输入是 `.sketch` 源文件，先导出为图片、页面清单或结构化说明后再进入 `biz-research`。默认流程直接消费的是可读图片和文本，不直接解析 `.sketch` 二进制源文件。

### 3. 按阶段驱动 Codex

建议直接给 Codex 明确任务，而不是模糊地说“帮我做一下”。

示例：

```text
使用 biz-research Skill。
输入是仓库中的业务资料和设计稿，请先阅读根 AGENTS.md 和 docs/AGENTS.md，
输出 docs/00-research/RESEARCH_SUMMARY.md 与 docs/00-research/REQUIREMENTS_CLARIFIED.md。
要求登记全部输入材料、标注冲突和待确认项，并给出澄清结论。
```

```text
使用 prd-rectify Skill。
根据 docs/01-requirements/PRD_RAW.md 和 docs/01-requirements/PRD_REVIEW_ISSUES.md，
生成可冻结的 docs/01-requirements/PRD_RECTIFIED.md。
要求逐项关闭阻塞问题，保留追溯编号，并补齐验收标准、异常场景和边界条件。
```

```text
使用 dev-implement Skill。
以 docs/01-requirements/PRD_RECTIFIED.md、docs/02-architecture/ARCHITECTURE.md、
docs/02-architecture/API_CONTRACT.md、docs/02-architecture/DATA_MODEL.md 为唯一输入源，
在 backend/ 和 frontend/ 中完成实现，并补充与 TC 编号对应的测试代码。
```

## 每个阶段最少要产出什么

| 阶段 | 必须产出 |
|---|---|
| `biz-research` | 材料清单、角色、场景、冲突、待澄清项 |
| `prd-compose` | 带 F 编号的功能需求、字段、规则、验收标准 |
| `prd-review` | 分级问题清单和评审结论 |
| `prd-rectify` | 可冻结需求基线 |
| `solution-design` | 模块设计、接口契约、数据模型 |
| `qa-design` | 测试策略、TC 编号、覆盖矩阵、测试代码映射 |
| `dev-implement` | 按基线和已分配 TC 实现的代码与测试 |
| `qa-execute` | 真实执行结果、失败项、风险和准出建议 |
| `defect-fix` | 缺陷闭环记录和回归结果 |
| `doc-check` | 追溯性校验报告 |
| `change-intake` | CR 和影响分析 |
| `iteration-retro` | 迭代复盘报告和持续改进项台账 |
| `iteration-plan` | 迭代计划、版本基线、变更日志 |

## 使用这套模板时的硬约束

- 先改文档，再改代码
- 不允许跳过上游阶段直接推进下游
- 接口变更必须先改 `API_CONTRACT.md`
- 表结构变更必须先改 `DATA_MODEL.md`
- 业务规则变更必须先改 `PRD_RECTIFIED.md`
- 测试必须绑定 TC 编号，确保文档和测试代码可追溯
- 版本冻结前必须通过 `iteration-retro` 门禁（`PASS` 或 `PASS WITH WAIVER`）

## 推荐阅读顺序

1. [AGENTS.md](./AGENTS.md)
2. [docs/AGENTS.md](./docs/AGENTS.md)
3. [docs/01-requirements/PRD_RECTIFIED.md](./docs/01-requirements/PRD_RECTIFIED.md)
4. [docs/02-architecture/ARCHITECTURE.md](./docs/02-architecture/ARCHITECTURE.md)
5. [docs/02-architecture/API_CONTRACT.md](./docs/02-architecture/API_CONTRACT.md)
6. [docs/02-architecture/DATA_MODEL.md](./docs/02-architecture/DATA_MODEL.md)
7. 局部目录下的 `AGENTS.md`

## 适用团队形态

- 单人全栈高效交付
- 小团队多人协同，但共用同一文档基线
- 已交付系统需要长期演进和版本冻结

## 许可证

MIT
