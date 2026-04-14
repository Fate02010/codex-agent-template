---
name: dev-implement
description: 开发实现入口：判断变更范围后路由到 backend-implement（后端单端）、frontend-implement（前端单端）或双端并行链路（parallel-task-splitter → parallel-dev-orchestrator → backend-implement + frontend-implement）。
---

# Skill: dev-implement — 开发实现入口

## Purpose

根据本次变更范围，路由到正确的实现路径。本 Skill 不直接实现代码，由子 Skill 负责具体实现。

## When to Use

当设计文档（`ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md`）与测试文档（`TEST_PLAN.md`、`TEST_CASES.md`）齐备并冻结后使用。

## 前置条件

- `PRD_RECTIFIED.md`、核心设计文档状态为 `已冻结`
- 后端工程骨架已存在（`backend/<project-name>-parent` 或等效）
- 前端工程骨架已存在（`frontend/<project-name>/web` 或等效）

## Inputs

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/03-architecture/ARCHITECTURE.md`
3. `docs/03-architecture/API_CONTRACT.md`
4. `docs/03-architecture/DATA_MODEL.md`
5. `docs/04-testing/TEST_PLAN.md`
6. `docs/04-testing/TEST_CASES.md`
7. `backend/AGENTS.md`（涉及后端时）
8. `frontend/AGENTS.md`（涉及前端时）

## 路由规则

### 情况 A：仅后端变更

直接调用 `backend-implement`。

### 情况 B：仅前端变更

直接调用 `frontend-implement`。

### 情况 C：同时涉及前后端

满足以下条件时，先执行 `parallel-task-splitter`，再执行 `parallel-dev-orchestrator`：

1. 同一需求同时影响 `backend/**` 与 `frontend/**`
2. `API_CONTRACT.md`、`DATA_MODEL.md` 已冻结且无【待确认】
3. 前后端任务可拆分并行推进

执行链路：

```
parallel-task-splitter
  → parallel-dev-orchestrator
      → backend-implement（backend worker）
      → frontend-implement（frontend worker）
      → 统一收口（联调 + TC 映射校验）
      → qa-execute
```

若 `parallel-dev-orchestrator` 判定 `PARALLEL_DISABLED`，回退为先调 `backend-implement` 再调 `frontend-implement`（串行）。

## 注意事项

- 严格按文档实现，不越权扩展功能。
- 发现设计缺口时先更新设计文档再改代码。
- 本 Skill 不直接产出代码，具体实现规则见 `backend-implement` / `frontend-implement`。
