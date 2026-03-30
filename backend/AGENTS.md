# backend/AGENTS.md — 后端实现规范

## 1. 技术栈

| 项目 | 选型 |
|---|---|
| 语言 | Java 17+ |
| 框架 | Spring Boot 3.x |
| ORM | MyBatis + MyBatis-Plus |
| 数据库 | MySQL 8.x |
| 缓存 | Redis |
| 构建工具 | Maven 多模块 |
| 代码规范 | 阿里巴巴 Java 开发手册 |

## 2. 工程结构（强约束）

### 2.1 多模块结构

后端默认采用 `backend/<project-name>-parent` 多模块结构：

```text
backend/
└── <project-name>-parent/
    ├── pom.xml                        # 父模块，仅做版本和依赖管理
    ├── <project-name>-common/
    │   ├── pom.xml
    │   └── src/main/java/.../common
    ├── <project-name>-admin-service/  # 后台管理端服务（默认）
    │   ├── pom.xml
    │   └── src/main/
    └── <project-name>-app-service/    # 多端场景才启用
        ├── pom.xml
        └── src/main/
```

### 2.2 父模块职责

- 父模块 `pom.xml` 仅负责：`dependencyManagement`、`pluginManagement`、`modules` 聚合
- 父模块禁止承载业务代码

### 2.3 公共模块职责

`<project-name>-common` 必须承载可复用公共能力：

- 统一返回体 `Result<T>`
- 错误码常量与错误键定义
- 通用异常基类与工具类
- 跨服务共享 DTO（仅通用，不含单服务私有业务语义）

### 2.4 服务拆分（条件强制）

- 单端场景：至少保留一个业务服务模块（如 `admin-service`）
- 多端场景（后台管理端 + 移动端/小程序端）：必须拆分 `admin-service` 与 `app-service`
- 外部接口与内部接口必须分离：
  - 外部接口：`/api/v1/**`
  - 内部服务接口：`/internal/v1/**`

## 3. 分层架构

每个业务服务模块采用 DDD 分层架构：

```text
<service>/src/main/java/com/example/<project>/
├── interfaces/
│   ├── controller/
│   │   ├── external/    # 对前端开放
│   │   └── internal/    # 对其他微服务开放
│   ├── dto/
│   └── assembler/
├── application/
│   ├── service/
│   ├── command/
│   └── query/
├── domain/
│   ├── model/
│   ├── service/
│   ├── repository/
│   └── event/
└── infrastructure/
    ├── persistence/
    │   ├── mapper/
    │   ├── po/
    │   └── repository/
    ├── cache/
    └── config/
```

## 4. 核心规则

### 4.1 分层依赖

```text
interfaces → application → domain ← infrastructure
```

- `interfaces` 只依赖 `application`
- `application` 编排 `domain` 服务与仓储接口
- `domain` 不依赖外层，不使用 Spring 注解
- `infrastructure` 实现 `domain` 接口

### 4.2 Controller 规范

- URL 必须带版本号：`/api/v1/**` 或 `/internal/v1/**`
- `external` 与 `internal` Controller 不得混放
- Controller 只做参数校验、DTO 转换、调用应用服务、统一返回
- Controller DTO 禁止直接进入 Domain Service

### 4.3 MyBatis / MyBatis-Plus 规范

- 服务模块 `pom.xml` 必须声明 `mybatis-plus-spring-boot3-starter` 依赖（版本由父模块统一管理）
- 数据访问必须通过 `domain/repository` 接口
- MyBatis-Plus `IService` / `ServiceImpl` 只能在 `infrastructure/persistence/repository` 内部使用
- 禁止 `application` 和 `domain` 直接依赖 MyBatis-Plus
- 禁止 Controller 直连 Mapper
- 每个服务模块必须提供 `MybatisPlusConfig` 并注册分页拦截器

### 4.4 Mapper XML 规范（强制）

- 至少保留一个 Mapper 接口继承 `BaseMapper<T>` 作为骨架能力校验
- 每个 Mapper 接口必须有对应 XML
- XML 路径统一：`src/main/resources/mapper/**/*.xml`
- 文件命名：`*Mapper.xml`
- `application.yml` 必须配置：`mybatis-plus.mapper-locations: classpath:mapper/**/*.xml`

## 5. 错误码与国际化（强制）

### 5.1 资源目录

错误码配置统一放在 `src/main/resources/error/`：

```text
error/
├── error-codes.properties
├── error-messages_zh_CN.properties
└── error-messages_en_US.properties
```

### 5.2 规则

- 错误码与错误文案分离
- 业务代码中禁止硬编码中文错误信息
- 通过错误键 + Locale 获取国际化消息
- `Result<T>.code` 与错误码配置保持一致

示例约定：

- `error-codes.properties`：`USER_NOT_FOUND=10001`
- `error-messages_zh_CN.properties`：`USER_NOT_FOUND=用户不存在`
- `error-messages_en_US.properties`：`USER_NOT_FOUND=User not found`

## 6. 注释规范（强制）

### 6.1 类注释

类/接口必须有 Javadoc，至少包含：

- 作者名
- 时间说明（创建日期）
- 类用途

### 6.2 字段注释

实体类、DTO、PO 的字段必须有说明性注释（Javadoc 或行注释）。

### 6.3 方法注释

公共方法必须有 Javadoc，说明参数与返回值；复杂业务分支需要行内注释。

## 7. 异常与返回体

- 统一异常体系：`BusinessException`、`SystemException`
- 全局异常处理器统一返回 `Result<T>`
- 错误码为 int，推荐格式：`模块编号 + 序号`，如 `10001`

## 8. 单元测试要求

| 层级 | 测试要求 |
|---|---|
| Domain Service | 必须有单元测试，覆盖核心业务逻辑 |
| Application Service | 关键编排流程需要测试 |
| Repository | 关键查询和写入需要测试 |
| Controller | 接口级集成测试（MockMvc） |

## 9. 变更要求

- 改接口前：先更新 `docs/02-architecture/API_CONTRACT.md`
- 改表结构前：先更新 `docs/02-architecture/DATA_MODEL.md`
- 改业务规则前：先更新 `docs/01-requirements/PRD_RECTIFIED.md`
- 改原型映射接口前：先确认 `docs/02-design/UI_DESIGN_SPEC.md` / `PAGE_FLOW.md`

## 10. 禁止事项

- 禁止在父模块写业务代码
- 禁止跳过 `common` 模块直接复制公共代码到各服务
- 禁止 Controller 中写业务逻辑
- 禁止 Controller DTO 传入 Domain Service
- 禁止 Controller 直连 Mapper
- 禁止在 Domain 层依赖 Spring 注解
- 禁止在 Application/Domain 直接使用 MyBatis-Plus 的 `IService`
- 禁止创建后端骨架时缺失 MyBatis-Plus 依赖或基础配置
- 禁止缺失 Mapper XML
- 禁止错误码文案不做国际化
- 禁止无注释的核心业务实体和公共接口
