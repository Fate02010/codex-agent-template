---
name: dev-implement
description: 按冻结需求与设计文档实现代码，并强制遵循多模块后端、Mapper XML、错误码国际化、Element Plus 和 TC 绑定测试规则。
---

# Skill: dev-implement — 开发实现

## 触发条件

当设计文档（`ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md`）与测试文档（`TEST_PLAN.md`、`TEST_CASES.md`）齐备并冻结后使用。

当同一需求同时涉及前后端时，先执行 `parallel-task-splitter` 生成按功能点拆分的后端/前端提示词，再执行 `parallel-dev-orchestrator` 做并行判定后进入本 Skill。

## 前置条件

- 后端工程骨架已存在（`backend/<project-name>-parent` 或等效）
- 前端工程骨架已存在（`frontend/<project-name>/web` 或等效）
- `PRD_RECTIFIED.md`、核心设计文档状态为 `已冻结`

## 输入

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/02-architecture/ARCHITECTURE.md`
3. `docs/02-architecture/API_CONTRACT.md`
4. `docs/02-architecture/DATA_MODEL.md`
5. `docs/03-testing/TEST_PLAN.md`
6. `docs/03-testing/TEST_CASES.md`
7. `backend/AGENTS.md`
8. `frontend/AGENTS.md`

## 输出

- `backend/` 代码
- `frontend/` 代码
- 与 TC 绑定的测试代码

## 执行流程

### 步骤 0：验证前置

1. 工程骨架缺失时先回到 `project-init` / bootstrap。
2. 文档未冻结时中止并回到对应上游阶段。

### 步骤 0.4：并行任务拆分（条件触发）

满足以下条件时，先执行 `parallel-task-splitter`：

1. 同一需求同时影响 `backend/**` 与 `frontend/**`
2. `API_CONTRACT.md`、`DATA_MODEL.md` 已冻结且无【待确认】
3. 前后端任务可拆分并行推进

执行动作：

- 先调用 `parallel-task-splitter`
- 在终端输出按功能点拆分的 Backend/Frontend 提示词
- 按提示词分派并行开发任务

### 步骤 0.5：并行模式判定（条件触发）

在步骤 0.4 完成后，执行 `parallel-dev-orchestrator`：

- 若判定 `PARALLEL_ENABLED`，按并行模式执行本 Skill
- 若判定 `PARALLEL_DISABLED`，回退本 Skill 单线执行

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

并行模式额外约束：

- backend worker 仅修改 `backend/**`
- 不允许并行修改共享基线文档

### 步骤 2：后端注释与规范检查

- 类/接口 Javadoc 必须包含：作者、时间、用途
- 实体类/DTO/PO 字段必须有注释
- 复杂业务分支必须有行内注释

### 步骤 3：前端实现

必须遵守：

- 后台管理端默认 Element Plus
- API 调用仅使用 `/api/v1/**`
- 请求必须走 `api/request` 封装
- 类型定义与后端返回体保持一致

并行模式额外约束：

- frontend worker 仅修改 `frontend/**`
- 契约缺口先回写文档再继续实现

### 步骤 4：测试实现（强制 TC 绑定）

- 后端测试：`@DisplayName("TC-XXX-NNN: ...")`
- 前端测试：`it('TC-XXX-NNN: ...', () => {})`
- TC 编号必须来自 `TEST_CASES.md`

### 步骤 5：自检

- [ ] 编译通过
- [ ] Controller 与 API_CONTRACT 一致
- [ ] PO/实体与 DATA_MODEL 一致
- [ ] Mapper XML 路径和内容可加载
- [ ] 错误码国际化配置已接入
- [ ] 测试代码与 TC 映射通过

### 步骤 6：提示下一步

- 开发完成后进入 `qa-execute`
- 并行模式下先完成统一联调与 TC 映射校验，再进入 `qa-execute`

## 注意事项

- 严格按文档实现，不越权扩展功能。
- 发现设计缺口时先更新设计文档再改代码。
