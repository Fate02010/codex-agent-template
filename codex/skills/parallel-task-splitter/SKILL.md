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
2. `docs/02-architecture/API_CONTRACT.md`
3. `docs/02-architecture/DATA_MODEL.md`
4. `docs/03-testing/TEST_CASES.md`
5. `backend/AGENTS.md`
6. `frontend/AGENTS.md`

## Outputs

仅在终端输出，不写入文档文件：

- 功能拆分结果（按功能点逐条）
- 每个功能点对应的 Backend Prompt
- 每个功能点对应的 Frontend Prompt
- 共享依赖与完成判定

## 执行流程

### 步骤 1：抽取功能点

从需求与设计基线中抽取本轮功能点，要求每条都具备：

- 功能编号（如 `F-XXX` 或当前文档编号）
- 功能名称
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
2. `Backend Prompt: ...`
3. `Frontend Prompt: ...`
4. `Shared Preconditions: ...`
5. `Done Criteria: ...`

提示词必须包含：

- 允许修改目录边界
- 禁止越权修改项
- 与 `TEST_CASES.md` 对应的 TC 编号
- 完成后需要回传的验收信息

### 步骤 4：并行前置检查

输出提示词后，提示下一步：

- 若依赖可解耦，进入 `parallel-dev-orchestrator`
- 若依赖不可解耦，回退单线 `dev-implement`

## 注意事项

- 本 Skill 只负责拆分和提示词生成，不直接修改代码。
- 输出必须是终端可复制内容，不新增 `docs/` 产物。
- 发现需求、接口、数据模型存在冲突时，先标记【待确认】，禁止直接进入并行开发。
