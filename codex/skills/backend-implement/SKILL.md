---
name: backend-implement
description: 按冻结需求与设计文档实现后端代码，严格遵循 Maven 多模块、Mapper XML、错误码国际化规则，并绑定 TC 测试；由 dev-implement 或 parallel-dev-orchestrator 调用，不直接由用户触发。
---

# Skill: backend-implement — 后端开发实现

## Purpose

在设计文档与测试文档已冻结的前提下，完成后端代码实现（领域模型、应用服务、接口层、持久层）及绑定 TC 的后端测试。

## When to Use

- 由 `dev-implement` 路由至本 Skill（单端后端变更）
- 由 `parallel-dev-orchestrator` 分派为 backend worker（双端并行）
- 不直接由用户触发

## When Not to Use

- 需要同时修改前端代码（使用 `dev-implement` 入口由其路由）
- 设计文档未冻结（回到上游阶段）
- 前端实现（使用 `frontend-implement`）

## Inputs

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/02-architecture/ARCHITECTURE.md`
3. `docs/02-architecture/API_CONTRACT.md`
4. `docs/02-architecture/DATA_MODEL.md`
5. `docs/03-testing/TEST_PLAN.md`
6. `docs/03-testing/TEST_CASES.md`
7. `backend/AGENTS.md`
8. 并行模式下额外：`parallel-task-splitter` 生成的 Backend Prompt（功能范围与边界）

## Outputs

- `backend/` 下对应模块代码
- 绑定 TC 的后端测试代码

## 前置条件

- 后端工程骨架已存在（`backend/<project-name>-parent` 或等效）
- `PRD_RECTIFIED.md`、`API_CONTRACT.md`、`DATA_MODEL.md` 状态为 `已冻结`

## Rules

1. 严格按文档实现，不越权扩展功能。
2. 发现设计缺口时先更新设计文档再改代码。
3. 并行模式下：仅修改 `backend/**`，禁止修改 `frontend/**` 与共享基线文档。
4. 模块展示使用 `EN（中文）`，编号与路径判定仅使用英文缩写（如 `TC-ORDER-001`）。

## Workflow

### 步骤 0：验证前置

1. 工程骨架缺失时先回到 `project-init` / `backend-bootstrap`。
2. 文档未冻结时中止并回到对应上游阶段。
3. 并行模式下确认 Backend Prompt 中的功能范围与边界。

### 步骤 1：后端实现

必须遵守：

- Maven 多模块结构（父模块 + common + 业务服务）
- 外部 Controller 与内部 Controller 分离
- MyBatis Mapper 接口与 Mapper XML 成对落地
- 错误码和消息走 `resources/error/*.properties`

实现顺序：

1. `infrastructure`：PO、Mapper、Repository
2. `domain`：模型、仓储接口、领域服务
3. `application`：命令/查询与应用服务
4. `interfaces`：DTO、Assembler、Controller

### 步骤 2：注释与规范检查

- 类/接口 Javadoc 必须包含：作者、时间、用途
- 实体类/DTO/PO 字段必须有注释
- 复杂业务分支必须有行内注释

### 步骤 3：后端测试实现（强制 TC 绑定）

- 测试类使用 `@DisplayName("TC-XXX-NNN: ...")`
- TC 编号必须来自 `TEST_CASES.md`，不得自造编号

### 步骤 4：自检

- [ ] 编译通过
- [ ] Controller 与 `API_CONTRACT.md` 一致
- [ ] PO/实体与 `DATA_MODEL.md` 一致
- [ ] Mapper XML 路径和内容可加载
- [ ] 错误码国际化配置已接入
- [ ] 后端测试与 TC 编号映射通过

### 步骤 5：提示下一步

- 单端模式：进入 `qa-execute`
- 并行模式：回传完成状态给 `parallel-dev-orchestrator`，等待统一收口后进入 `qa-execute`
