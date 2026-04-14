---
name: parallel-task-splitter
description: 根据当前冻结需求与设计基线按功能点拆分前后端并行任务，并在终端输出可直接执行的 backend/frontend 开发提示词。
---

# Skill: parallel-task-splitter — 并行任务拆分与提示词生成

## Purpose

在进入并行开发前，先把需求按功能点拆成可独立执行的任务包，并生成后端与前端可直接使用的提示词。

## When to Use

- 同一迭代需求同时涉及 `backend/**` 与 `frontend/**`
- 需要把需求明确拆分给后端与前端并行开发
- 需要统一提示词格式，避免并行执行时边界不清

## Inputs

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/03-architecture/API_CONTRACT.md`
3. `docs/03-architecture/DATA_MODEL.md`
4. `docs/04-testing/TEST_CASES.md`
5. `backend/AGENTS.md`
6. `frontend/AGENTS.md`
7. `docs/01-requirements/feature_list.json`（如有，优先使用结构化数据替代手动解析 PRD）

## Outputs

仅在终端输出，不写入文档文件：

- 功能拆分结果（按功能点逐条）
- 每个功能点对应的 Backend Prompt
- 每个功能点对应的 Frontend Prompt
- 共享依赖与完成判定

## 执行流程

### 步骤 1：抽取功能点

#### [断点恢复扫描]

按 `## 断点恢复` 检查点表格从后向前扫描各步骤完成状态，确定续执起点后输出恢复摘要（格式见 `AGENTS.md` § 14.5 第 3 条），然后跳转到续执起点。若无断点，继续执行以下步骤 1 主体。

从需求与设计基线中抽取本轮功能点，要求每条都具备：

- 功能编号（如 `F-XXX` 或当前文档编号）
- 功能名称
- 所属模块（`EN（中文）`，如 `ORDER（订单管理）`）
- 影响端（backend/frontend/both）
- 对应 TC 编号集合

### 步骤 2：按功能点拆分任务包

对每个功能点拆分：

- backend 任务：接口、应用服务、领域、数据持久化、后端测试
- frontend 任务：页面、组件、状态、API 调用、前端测试
- shared 前置：依赖接口、数据模型、公共规则

若某功能点仅单端变更，另一端标记为 `N/A`。

### 步骤 3：生成可执行提示词

每个功能点必须输出以下结构：

1. `Feature: <编号> <名称>`
2. `Module: <EN（中文）>`
3. `Backend Prompt: ...`
4. `Frontend Prompt: ...`
5. `Shared Preconditions: ...`
6. `Done Criteria: ...`

提示词必须包含：

- 调用的 Skill：Backend Prompt 引用 `backend-implement`，Frontend Prompt 引用 `frontend-implement`
- 允许修改目录边界
- 禁止越权修改项
- 与 `TEST_CASES.md` 对应的 TC 编号
- 完成后需要回传的验收信息
- 模块展示使用 `EN（中文）`，但编号中的模块段仅使用英文缩写（如 `TC-ORDER-001`）

### 步骤 4：并行前置检查

输出提示词后，提示下一步：

- 若依赖可解耦，进入 `parallel-dev-orchestrator`
- 若依赖不可解耦，回退单线 `dev-implement`

## 注意事项

- 本 Skill 只负责拆分和提示词生成，不直接修改代码。
- 输出必须是终端可复制内容，不新增 `docs/` 产物。
- 发现需求、接口、数据模型存在冲突时，先标记【待确认】，禁止直接进入并行开发。

## 断点恢复

> 通用恢复原则见根目录 `AGENTS.md` § 14。本章节声明本 Skill 的步骤级检查点；未列出的项回退到 `AGENTS.md` § 14.4 默认规则。

### 检查点表格

本 Skill 输出为终端文本，不写入文档文件。步骤状态无法通过文件判定，断点恢复以"对话上下文中是否已有功能拆分结果"为依据。

| 步骤 | 步骤名称 | 完成判定条件 | 续执起点 |
|---|---|---|---|
| 步骤 1 | 抽取功能点 | 对话上下文中已有功能点列表（含编号、名称、所属模块、影响端） | 步骤 2 |
| 步骤 2 | 按功能点拆分任务包 | 对话上下文中已有 Backend Prompt / Frontend Prompt 区分 | 步骤 3 |
| 步骤 3 | 生成可执行提示词 | 对话上下文中已有完整提示词输出 | 步骤 4 |
| 步骤 4 | 并行前置检查 | 并行可行性已明确（PARALLEL_ENABLED 或 PARALLEL_DISABLED） | — |

### 默认恢复原则（兜底）

1. 若无法从上下文判断任何步骤已完成，从步骤 1 全量重新执行。
2. 本 Skill 无持久化产物，重新执行成本低，建议优先全量执行而非尝试续执。
3. 若用户在对话中保留了上次的拆分结果，可从步骤 3（生成提示词）续执。
