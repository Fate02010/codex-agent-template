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
4. `docs/02-architecture/ARCHITECTURE.md`（如有）
5. `docs/02-architecture/API_CONTRACT.md`（如有）
6. `docs/02-architecture/DATA_MODEL.md`（如有）
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
- 每个服务模块必须有 `mapper/**/*.xml`
- 每个服务模块必须有 `resources/error/*.properties`
- 外部接口与内部接口必须分开目录和 URL 前缀

## Steps

### 1. 读取基线并提取项目参数

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
- `src/main/resources/mapper/**/*.xml`
- `src/main/resources/error/error-codes.properties`
- `src/main/resources/error/error-messages_zh_CN.properties`
- `src/main/resources/error/error-messages_en_US.properties`
- `interfaces/controller/external`
- `interfaces/controller/internal`
- `infrastructure/config/MybatisPlusConfig.java`（注册 `MybatisPlusInterceptor` + `PaginationInnerInterceptor`）
- 至少一个 `infrastructure/persistence/mapper/*Mapper.java`（继承 `BaseMapper<T>`）

`application.yml` 至少包含：

- `mybatis-plus.mapper-locations: classpath:mapper/**/*.xml`
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
- [ ] 后续可直接衔接 `dev-implement`
