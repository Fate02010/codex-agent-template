---
name: backend-bootstrap
description: Bootstrap a minimal runnable backend scaffold aligned with AGENTS rules, docs baselines, and OpenSpec inputs.
---

# Skill: backend-bootstrap — 后端最小工程骨架初始化

## Purpose

本 Skill 的职责是创建或补齐 `backend/` 下的最小可运行后端工程骨架，不负责完整业务实现。

- 创建 `backend/` 下的最小可运行工程结构
- 补充最小构建文件（`pom.xml`）、最小启动入口、最小配置文件
- 落地与当前模板一致的目录结构与分层边界
- 为后续 `dev-implement` Skill 提供可直接接续的工程起点
- 与根 `AGENTS.md`、`backend/AGENTS.md`、`docs/` 基线、OpenSpec 基线保持一致

## When to Use

以下场景使用本 Skill：

- 新项目开始，`backend/` 目录尚不存在
- `backend/` 已存在，但只有空目录或仅有占位文件（例如仅有 `AGENTS.md`）
- 需求与设计已初步明确，准备进入后端开发
- 需要在多个项目中统一后端基础工程结构
- 单人使用 Codex，需要标准化后端初始化流程并降低脚手架差异

## Inputs

执行前按如下顺序读取输入（存在则读取，不存在必须标记【待确认】）：

1. 根规则：`AGENTS.md`
2. 后端规则：`backend/AGENTS.md`
3. OpenSpec 项目基线：`openspec/project.md`
4. MVP 范围：`docs/01-requirements/MVP_SCOPE.md`
5. 需求基线（如已存在）：`docs/01-requirements/PRD_RECTIFIED.md`
6. 架构设计（如已存在）：`docs/02-architecture/ARCHITECTURE.md`
7. 接口契约（如已存在）：`docs/02-architecture/API_CONTRACT.md`
8. 数据模型（如已存在）：`docs/02-architecture/DATA_MODEL.md`
9. 技术栈约束：Java 17/21、Maven、Spring Boot 3.x、DDD 或分层风格

输入处理要求：

- 若 `openspec/project.md` 或 `MVP_SCOPE.md` 缺失，必须在输出说明中登记【待确认】
- 若技术栈版本存在冲突，优先以根 `AGENTS.md` 和 `backend/AGENTS.md` 为准，并标记【冲突】
- 若设计文档仍为模板或未冻结，仅创建骨架，不推断业务实现细节

## Outputs

固定输出结果至少包括：

- `backend/` 下最小后端工程骨架
- `backend/pom.xml`
- `backend/src/main/java/...` 最小目录结构
- `backend/src/main/resources/application.yml`
- `backend/src/test/...` 占位测试目录与最小测试类
- 必要时补充 `backend/README.md`（运行说明、待确认项、追溯说明）

输出内容至少覆盖：

- 最小启动类（Spring Boot 启动入口）
- 基础包结构（`interfaces`、`application`、`domain`、`infrastructure`、`shared`）
- 占位配置文件（端口、Profile、数据源/Redis 占位）
- 基础异常/响应/配置目录（模板需要时创建占位类或包）
- 与 `API_CONTRACT.md` / `DATA_MODEL.md` 后续实现兼容的扩展位

建议最小文件集合：

- `backend/pom.xml`
- `backend/src/main/java/<basePackage>/BackendApplication.java`
- `backend/src/main/java/<basePackage>/interfaces/rest/`
- `backend/src/main/java/<basePackage>/interfaces/dto/`
- `backend/src/main/java/<basePackage>/application/`
- `backend/src/main/java/<basePackage>/domain/`
- `backend/src/main/java/<basePackage>/infrastructure/`
- `backend/src/main/java/<basePackage>/shared/`
- `backend/src/main/resources/application.yml`
- `backend/src/test/java/<basePackage>/BackendApplicationTests.java`

## Rules

执行时必须遵守：

- 必须优先遵循根 `AGENTS.md` 与 `backend/AGENTS.md`
- 必须先创建工程骨架，再进入业务实现
- scaffold 阶段禁止擅自实现复杂业务逻辑
- 在没有明确技术栈约束时，不得臆测版本，必须标记【待确认】
- 若 `backend/` 已存在文件，不直接覆盖；先检查差异后最小化补充
- 只创建后端最小可运行结构，不做无关扩展
- 不直接实现完整数据库表、复杂权限逻辑、第三方集成
- 不越过设计文档边界，不擅自新增接口语义和业务规则
- 创建内容需可追溯到输入文档与当前阶段目标

## Suggested Default Stack

若未给出更强约束，默认建议：

- Java 17 或 21（无法确认时标记【待确认】）
- Maven
- Spring Boot 3.x
- 包结构建议：`interfaces` / `application` / `domain` / `infrastructure` / `shared`

结构选择依据：

- 若 `backend/AGENTS.md` 强制 DDD，优先 DDD 分层
- 若模板未强制 DDD，可采用标准分层（Controller-Service-Repository）
- 必须在工程说明中记录选择依据，避免后续层次混用

## Backend Structure Guidance

建议创建以下结构并明确职责：

- 启动类：应用启动入口，负责最小启动与扫描配置
- `interfaces/rest`：REST 控制器入口层，仅做参数校验、调用应用层、统一返回
- `interfaces/dto`：请求/响应 DTO，禁止直接进入领域层
- `application`：用例编排层，组织流程与事务边界
- `domain`：核心业务模型与规则，不依赖 Web/ORM 细节
- `infrastructure`：技术实现层，承载持久化、配置、外部依赖适配
- `shared`：跨层公共对象（统一响应、异常、通用常量等）
- `resources`：配置资源（`application.yml`、日志、mapper 路径占位）
- `test`：测试目录，至少具备最小上下文加载测试

注意：

- 若现有项目已使用 `interfaces/controller` 命名，可保持一致，不强制改名
- 目录命名必须在同一项目内保持单一标准，避免并存漂移

## Steps

### 1. 读取项目基线与技术约束

- 读取 `AGENTS.md` 与 `backend/AGENTS.md`
- 读取 `openspec/project.md` 与可用需求/设计文档
- 提取项目名、包名、Java 版本、构建工具、架构风格约束

### 2. 检查 `backend/` 当前状态

- 判断目录是否存在
- 判断是否仅空目录/占位目录
- 判断是否已有 `pom.xml`、`src/main`、`src/test`、`resources`
- 输出状态判定：`create`（新建）/ `patch`（补齐）/ `skip`（已满足）

### 3. 判断骨架策略

- `create`：全量创建最小骨架
- `patch`：保留现有内容，按缺口补齐
- `skip`：记录已满足项与后续建议，不重复生成

### 4. 创建 `pom.xml`

- 使用 Maven + Spring Boot 3.x 最小依赖集
- 设置 Java 版本（无法确认时记录【待确认】）
- 包含最小测试依赖与启动插件

### 5. 创建最小启动类

- 生成 `BackendApplication` 启动入口
- 确保可通过标准命令启动（如 `mvn spring-boot:run`）

### 6. 创建基础包结构

- 创建 `interfaces`、`application`、`domain`、`infrastructure`、`shared`
- 创建 `interfaces/rest`、`interfaces/dto`、`infrastructure/config` 等占位目录
- 必要时创建统一响应/异常的占位类（仅骨架）

### 7. 创建配置文件

- 创建 `src/main/resources/application.yml`
- 写入最小端口与 profile 配置
- 写入 datasource/redis 占位配置，敏感信息通过环境变量占位

### 8. 创建测试目录

- 创建 `src/test/java/...` 目录
- 创建最小 `BackendApplicationTests`，仅校验上下文可加载

### 9. 输出结构说明与后续建议

- 说明已创建与补齐的结构
- 标记【待确认】与【冲突】项
- 给出下一步建议：进入 `dev-implement`，按 `API_CONTRACT.md` / `DATA_MODEL.md` 实现业务

## Quality Gate

完成后必须满足：

- `backend/` 工程结构完整
- 至少具备最小可运行入口
- 构建文件存在（`pom.xml`）
- 配置文件存在（`application.yml`）
- 目录结构符合根 `AGENTS.md` 与 `backend/AGENTS.md` 规则
- 后续 `dev-implement` Skill 可直接继续开发
- 未越界实现业务逻辑

推荐验收动作（可执行时执行）：

- `cd backend && mvn -q -DskipTests compile`
- `cd backend && mvn -q test -Dtest=*ApplicationTests`

## Example

场景：会员管理系统（Member Management）

已知输入：

- `openspec/project.md` 已存在，定义项目基线
- `docs/01-requirements/MVP_SCOPE.md` 已存在
- `docs/01-requirements/PRD_RECTIFIED.md` 已存在

本 Skill 执行方式：

1. 读取根 `AGENTS.md` 与 `backend/AGENTS.md`，确认 Java 17+、Spring Boot 3.x、Maven
2. 检查 `backend/` 是否仅有 `AGENTS.md`，判定为 `patch` 或 `create`
3. 创建 `pom.xml`、启动类、配置文件、测试目录
4. 创建 `interfaces/application/domain/infrastructure/shared` 基础结构
5. 输出后续建议：按 `API_CONTRACT.md`、`DATA_MODEL.md` 进入 `dev-implement`

典型输出结构：

```text
backend/
├── AGENTS.md
├── pom.xml
└── src
    ├── main
    │   ├── java/com/example/member
    │   │   ├── BackendApplication.java
    │   │   ├── interfaces
    │   │   │   ├── rest
    │   │   │   └── dto
    │   │   ├── application
    │   │   ├── domain
    │   │   ├── infrastructure
    │   │   └── shared
    │   └── resources
    │       └── application.yml
    └── test
        └── java/com/example/member
            └── BackendApplicationTests.java
```

本阶段不应实现：

- 会员注册/登录/积分等完整业务逻辑
- 完整数据库建表 SQL 与复杂索引设计
- 复杂权限模型（RBAC/ABAC）与 SSO 集成
- 第三方服务集成（短信、支付、消息中间件）

完成定义：

- 达到“最小可运行 + 结构可扩展 + 规则可追溯”，再交由 `dev-implement` 实现业务。
