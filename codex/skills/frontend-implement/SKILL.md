---
name: frontend-implement
description: 按冻结需求与设计文档实现前端代码，严格遵循 Element Plus、API 封装规范，并绑定 TC 测试；由 dev-implement 或 parallel-dev-orchestrator 调用，不直接由用户触发。
---

# Skill: frontend-implement — 前端开发实现

## Purpose

在设计文档与测试文档已冻结的前提下，完成前端代码实现（页面、组件、状态、API 调用）及绑定 TC 的前端测试。

## When to Use

- 由 `dev-implement` 路由至本 Skill（单端前端变更）
- 由 `parallel-dev-orchestrator` 分派为 frontend worker（双端并行）
- 不直接由用户触发

## When Not to Use

- 需要同时修改后端代码（使用 `dev-implement` 入口由其路由）
- 设计文档未冻结（回到上游阶段）
- 后端实现（使用 `backend-implement`）

## Inputs

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/02-architecture/API_CONTRACT.md`
3. `docs/02-architecture/DATA_MODEL.md`
4. `docs/03-testing/TEST_PLAN.md`
5. `docs/03-testing/TEST_CASES.md`
6. `frontend/AGENTS.md`
7. 并行模式下额外：`parallel-task-splitter` 生成的 Frontend Prompt（功能范围与边界）

## Outputs

- `frontend/` 下对应模块代码
- 绑定 TC 的前端测试代码

## 前置条件

- 前端工程骨架已存在（`frontend/<project-name>/web` 或等效）
- `PRD_RECTIFIED.md`、`API_CONTRACT.md` 状态为 `已冻结`

## Rules

1. 严格按文档实现，不越权扩展功能。
2. 发现契约缺口时先回写 `API_CONTRACT.md` 再继续实现。
3. 并行模式下：仅修改 `frontend/**`，禁止修改 `backend/**` 与共享基线文档。
4. 模块展示使用 `EN（中文）`，编号与路径判定仅使用英文缩写（如 `TC-ORDER-001`）。

## Workflow

### 步骤 0：验证前置

1. 工程骨架缺失时先回到 `project-init` / `frontend-bootstrap`。
2. 文档未冻结时中止并回到对应上游阶段。
3. 并行模式下确认 Frontend Prompt 中的功能范围与边界。

### 步骤 1：前端实现

必须遵守：

- 后台管理端默认 Element Plus
- API 调用仅使用 `/api/v1/**`
- 请求必须走 `api/request` 封装
- 类型定义与后端返回体（`API_CONTRACT.md`）保持一致

### 步骤 2：前端测试实现（强制 TC 绑定）

- 测试使用 `it('TC-XXX-NNN: ...', () => {})`
- TC 编号必须来自 `TEST_CASES.md`，不得自造编号

### 步骤 3：自检

- [ ] 页面可正常渲染，无控制台报错
- [ ] API 调用路径与 `API_CONTRACT.md` 一致
- [ ] 类型定义与后端返回体一致
- [ ] 请求走 `api/request` 封装，未直接使用 axios/fetch
- [ ] 前端测试与 TC 编号映射通过

### 步骤 4：提示下一步

- 单端模式：进入 `qa-execute`
- 并行模式：回传完成状态给 `parallel-dev-orchestrator`，等待统一收口后进入 `qa-execute`
