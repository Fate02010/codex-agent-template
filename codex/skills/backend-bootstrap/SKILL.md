---
name: backend-bootstrap
description: 初始化或补齐后端 Maven 多模块骨架（父模块 + common + 业务服务），并强制接入 MyBatis-Plus、Mapper XML 与错误码国际化目录规范。
---

# Skill: backend-bootstrap — 后端最小工程骨架初始化

## Purpose

创建或补齐 `backend/` 下可运行的后端基础工程，确保直接满足模板硬约束：

- Maven 多模块
- 父模块仅做版本管理
- `common` 公共模块
- MyBatis-Plus 依赖与最小配置
- MyBatis Mapper XML
- `resources/error` 国际化错误码配置

## When to Use

- `backend/` 不存在可运行工程
- 仅有占位目录，缺少模块化结构
- 需要把单模块后端重整为模板基线结构

## Inputs

1. `AGENTS.md`
2. `backend/AGENTS.md`
3. `docs/01-requirements/PRD_RECTIFIED.md`（如有）
4. `docs/03-architecture/ARCHITECTURE.md`（如有）
5. `docs/03-architecture/API_CONTRACT.md`（如有）
6. `docs/03-architecture/DATA_MODEL.md`（如有）
7. `docs/01-requirements/MVP_SCOPE.md`（如有）

## Outputs

至少输出：

- `backend/<project-name>-parent/pom.xml`
- `backend/<project-name>-parent/<project-name>-common/`
- `backend/<project-name>-parent/<project-name>-admin-service/`
- `backend/<project-name>-parent/<project-name>-app-service/`（多端时）

## Rules

- 父模块 `pom.xml` 仅管理版本、依赖和插件
- 公共能力必须集中在 `common` 模块
- 服务模块必须使用 DDD 目录
- 服务模块必须接入 MyBatis-Plus（依赖 + Mapper 扫描 + 分页插件）
- 每个服务模块必须有 `mapper/*.xml`
- 每个服务模块必须有 `resources/error/*.properties`
- 外部接口与内部接口必须分开目录和 URL 前缀

## Steps

### 1. 读取基线并提取项目参数

#### [断点恢复扫描]

按 `## 断点恢复` 检查点表格从后向前扫描各步骤完成状态，确定续执起点后输出恢复摘要（格式见 `AGENTS.md` § 14.5 第 3 条），然后跳转到续执起点。若无断点，继续执行以下步骤 1 主体。

提取：`project-name`、`groupId`、Java 版本、是否多端。

### 2. 判定当前状态

对 `backend/` 判定：

- `create`：无后端工程
- `patch`：有后端但缺模块/缺规范目录
- `skip`：已满足基线

### 3. 创建/补齐父模块

创建 `backend/<project-name>-parent/pom.xml`：

- packaging=`pom`
- 维护 Spring Boot/MyBatis-Plus/MySQL/Redis/JUnit 等版本
- 声明 `common` 和业务服务模块

### 4. 创建/补齐 common 模块

创建 `Result<T>`、通用异常、错误键常量等公共能力占位。

### 5. 创建/补齐业务服务模块

每个服务模块至少包含：

- 启动类
- DDD 分层目录
- `pom.xml`（包含 `mybatis-plus-spring-boot3-starter` 依赖，版本由父模块管理）
- `application.yml`
- `src/main/resources/mapper/*.xml`
- `src/main/resources/error/error-codes.properties`
- `src/main/resources/error/error-messages_zh_CN.properties`
- `src/main/resources/error/error-messages_en_US.properties`
- `interfaces/controller/external`
- `interfaces/controller/internal`
- `infrastructure/config/MybatisPlusConfig.java`（注册 `MybatisPlusInterceptor` + `PaginationInnerInterceptor`）
- 至少一个 `infrastructure/persistence/mapper/*Mapper.java`（继承 `BaseMapper<T>`）

**包结构约定（强制）：**
- mapper XML 统一存于 `src/main/resources/mapper/`（单层，不建子目录）
- Mapper 接口统一存于 `infrastructure.persistence.mapper`（单层根包）；同一领域/功能超过 5 个时才允许按领域建子包；禁止为每个功能单独建子包
- repository 实现统一存于 `infrastructure.persistence.repository`（单包）；若采用接口与实现分离，实现类放 `infrastructure.persistence.repository.impl`；同一领域超过 5 个时才允许在对应包下按领域建子包
- MyBatis-Plus `IService`/`ServiceImpl` 可在 `infrastructure.persistence.repository`（含 impl）内作为 repository 的扩展接口与实现基类，不对外暴露
- 领域模型统一存于 `domain.model` 根包；禁止为每个领域或每个模型单独建子包；同一业务域模型超过 5 个时才允许在 `model/` 下按业务域建子包
- 领域服务统一存于 `domain.service` 根包；禁止为每个领域或每个 Service 单独建子包；同一业务域服务超过 5 个时才允许在 `service/` 下按业务域建子包

`application.yml` 至少包含：

- `mybatis-plus.mapper-locations: classpath:mapper/*.xml`
- `mybatis-plus.type-aliases-package: ...infrastructure.persistence.po`

### 6. 创建测试目录

- `src/test/java/.../ApplicationTests.java`

### 7. 结果说明

输出已创建/补齐项，并标记【待确认】（如多端判断依据不足）。

## Quality Gate

- [ ] 存在父模块 + common + 至少一个业务服务模块
- [ ] 父模块不含业务代码
- [ ] 服务模块已接入 MyBatis-Plus（依赖、Mapper 扫描、分页插件）
- [ ] 服务模块可识别 mapper XML 与 error 目录
- [ ] 至少一个 Mapper 继承 `BaseMapper<T>`
- [ ] DDD 分层目录齐全
- [ ] mapper XML 存于单层 `mapper/` 目录（无子目录）
- [ ] Mapper 接口位于 `infrastructure.persistence.mapper` 单层根包（未按功能建子包）
- [ ] repository 实现位于 `infrastructure.persistence.repository`（或 `.impl`），未违规分包（≤5 个时无子包）
- [ ] domain.model/domain.service 各自存于根包（未按领域/实体/Service 单独建子包；同一业务域 ≤5 个时无子包）
- [ ] 后续可直接衔接 `dev-implement`

## 断点恢复

> 通用恢复原则见根目录 `AGENTS.md` § 14。本章节声明本 Skill 的步骤级检查点；未列出的项回退到 `AGENTS.md` § 14.4 默认规则。

### 检查点表格

| 步骤 | 步骤名称 | 完成判定条件 | 续执起点 |
|---|---|---|---|
| 步骤 1 | 读取基线并提取项目参数 | `project-name`、`groupId`、Java 版本已提取 | 步骤 2 |
| 步骤 2 | 判定当前状态 | 已判定 `create` / `patch` / `skip` 状态 | 步骤 3 |
| 步骤 3 | 创建/补齐父模块 | `backend/<project-name>-parent/pom.xml` 存在且 `packaging=pom` | 步骤 4 |
| 步骤 4 | 创建/补齐 common 模块 | `backend/<project-name>-parent/<project-name>-common/` 目录存在，含 `Result<T>`、通用异常占位 | 步骤 5 |
| 步骤 5 | 创建/补齐业务服务模块 | 各服务模块的 `pom.xml`、`application.yml`、`mapper/*.xml`、`resources/error/*.properties` 均存在 | 步骤 6 |
| 步骤 6 | 创建测试目录 | 各服务模块的 `src/test/java/.../ApplicationTests.java` 存在 | 步骤 7 |
| 步骤 7 | 结果说明 | 已输出已创建/补齐项清单 | — |

### 默认恢复原则（兜底）

1. 若所有输出文件均不存在，从步骤 0 全量执行。
2. 若部分输出文件存在，从最早未完成步骤续执，已有内容按增量更新处理。
3. Gate Report 结论为 `BLOCKED` 时，从步骤 0 重新评估（参见 `AGENTS.md` § 14.5 第 4 条）。
