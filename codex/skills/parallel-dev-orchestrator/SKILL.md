---
name: parallel-dev-orchestrator
description: 在同一迭代同时涉及前后端时，先完成并行可行性判定，再编排 backend/frontend 双轨开发与统一收口验收。
---

# Skill: parallel-dev-orchestrator — 并行开发编排

## Purpose

在 `dev-implement` 前置执行并行编排，降低跨端并行开发的冲突和返工风险。
本 Skill 在 `parallel-task-splitter` 之后执行，负责并行可行性判定与收口编排，不重复生成提示词。

## When to Use

- 同一需求同时影响 `backend/**` 与 `frontend/**`
- `API_CONTRACT.md`、`DATA_MODEL.md` 已冻结且无【待确认】
- 前后端任务可以按职责边界拆分并独立推进

## 不适用场景（直接回退单线开发）

- 关键业务规则、接口或表结构仍在变更中
- 前后端改动强耦合，无法拆分并行顺序
- 需要高频同步修改共享基线文档

## Inputs

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/03-architecture/ARCHITECTURE.md`
3. `docs/03-architecture/API_CONTRACT.md`
4. `docs/03-architecture/DATA_MODEL.md`
5. `docs/04-testing/TEST_PLAN.md`
6. `docs/04-testing/TEST_CASES.md`
7. `backend/AGENTS.md`
8. `frontend/AGENTS.md`
9. `parallel-task-splitter` 在终端输出的功能拆分结果与提示词

## Output

- 并行判定结论：`PARALLEL_ENABLED` 或 `PARALLEL_DISABLED`
- 双轨任务拆分结果：backend 任务包、frontend 任务包、共享依赖清单
- 统一收口清单：联调项、TC 映射校验项、准出前置检查项

## 执行流程

### 步骤 1：并行可行性判定

满足以下条件才可并行：

1. 同时存在前后端代码改动需求
2. 接口与数据模型已冻结
3. 关键流程可拆分为两个独立任务包
4. 测试用例可按 backend/frontend 划分并保留端到端回归

若任一不满足，输出 `PARALLEL_DISABLED` 并回退 `dev-implement` 单线流程。

### 步骤 2：任务拆分与所有权

- backend worker：调用 `backend-implement`，仅负责 `backend/**` 的实现与测试
- frontend worker：调用 `frontend-implement`，仅负责 `frontend/**` 的实现与测试
- 共享文档（需求/接口/数据/测试基线）仅允许主线串行更新，不进入并行改写
- 从 `parallel-task-splitter` 读取模块时，展示统一为 `EN（中文）`，编号与目录归属判定仅使用英文缩写

### 步骤 3：并行执行约束

- 不得越权修改对方代码目录
- 不得私自扩展未批准需求
- 如发现设计缺口，先回写文档，再继续编码

### 步骤 4：统一收口

并行开发完成后，统一执行：

1. 联调验证（核心流程与错误分支）
2. TC 编号绑定校验（后端 + 前端 + 回归）
3. 进入 `qa-execute` 输出准出结论

## 注意事项

- 本 Skill 只负责编排和收口，由 `dev-implement` 路由进入，不直接由用户触发。
- 并行只是执行策略，不改变“文档先于代码”的主流程约束。
