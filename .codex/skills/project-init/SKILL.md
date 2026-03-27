# Skill: project-init — 项目脚手架初始化

## 触发条件

当从本模板开始新项目，且 `backend/` 和 `frontend/` 目录下除 `AGENTS.md` 外没有代码文件时使用。本 Skill 应在开发实现之前执行。

## 输入

1. `AGENTS.md` — 项目总规则与技术栈
2. `backend/AGENTS.md` — 后端架构规范
3. `frontend/AGENTS.md` — 前端架构规范
4. 可选：`docs/02-architecture/ARCHITECTURE.md`（如 `solution-design` 已执行）

## 输出

- `backend/` 目录下的可编译后端项目脚手架
- `frontend/web/` 目录下的可运行前端项目脚手架
- `tests/api/` 目录下的测试基础结构

## 执行流程

### 步骤 1：读取约束

1. 读取根 `AGENTS.md` 获取技术栈（Java 17+、Spring Boot 3.x、MyBatis-Plus、MySQL 8.x、Redis）
2. 读取 `backend/AGENTS.md` 获取 DDD 分包结构
3. 读取 `frontend/AGENTS.md` 获取目录结构约定
4. 如果 `ARCHITECTURE.md` 已存在，读取其中的项目名称和模块信息

### 步骤 2：确定项目元数据

向用户确认或从 `ARCHITECTURE.md` 中推断：

| 参数 | 默认值 | 来源 |
|---|---|---|
| groupId | com.example | ARCHITECTURE.md 或用户指定 |
| artifactId | demo | ARCHITECTURE.md 或用户指定 |
| 项目名称 | demo | ARCHITECTURE.md 或用户指定 |
| Java 版本 | 17 | AGENTS.md |
| Spring Boot 版本 | 3.2.x（最新 3.x） | AGENTS.md |
| MyBatis-Plus 版本 | 3.5.x（最新） | AGENTS.md |

### 步骤 3：生成后端脚手架

#### 3.1 Maven 配置（pom.xml）

在 `backend/` 下生成 `pom.xml`：

- parent：`spring-boot-starter-parent` 3.2.x
- Java 17 编译器设置
- 核心依赖：
  - `spring-boot-starter-web`
  - `spring-boot-starter-validation`
  - `mybatis-plus-spring-boot3-starter`
  - `mysql-connector-j`
  - `spring-boot-starter-data-redis`
  - `lombok`
- 测试依赖：
  - `spring-boot-starter-test`
  - `mybatis-plus-boot-starter-test`（如有）
- 构建插件：`spring-boot-maven-plugin`

#### 3.2 启动类

创建 `src/main/java/[groupId]/[artifactId]/Application.java`：

```java
@SpringBootApplication
@MapperScan("[groupId].[artifactId].infrastructure.persistence.mapper")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

#### 3.3 DDD 分包结构

按 `backend/AGENTS.md` 第 2 章创建空包（含 `package-info.java`）：

```
[base]/
├── interfaces/
│   ├── controller/
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

#### 3.4 基础类

创建 `backend/AGENTS.md` 中引用的基础设施类：

**Result.java**（`interfaces/dto/`）：
```java
public class Result<T> {
    private int code;
    private String message;
    private T data;
    // success()、fail() 静态工厂方法
}
```

**BusinessException.java**（`domain/`）：
```java
public class BusinessException extends RuntimeException {
    private int errorCode;
    private String message;
}
```

**SystemException.java**（`infrastructure/`）：
```java
public class SystemException extends RuntimeException {
    private int errorCode;
    private String message;
}
```

**GlobalExceptionHandler.java**（`infrastructure/config/`）：
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    // 处理 BusinessException → Result.fail(errorCode, message)
    // 处理 SystemException → Result.fail(50000, message)
    // 处理 MethodArgumentNotValidException → Result.fail(40001, ...)
    // 处理 Exception → Result.fail(99999, ...)
}
```

#### 3.5 配置文件

在 `src/main/resources/` 下创建：

**application.yml**：
```yaml
server:
  port: 8080
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/${DB_NAME}?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: ${DB_USER:root}
    password: ${DB_PASS:root}
    driver-class-name: com.mysql.cj.jdbc.Driver
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
mybatis-plus:
  mapper-locations: classpath:mapper/**/*.xml
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

**application-dev.yml**：开发环境覆盖配置
**application-test.yml**：测试环境覆盖配置

#### 3.6 测试基础类

创建 `src/test/java/[groupId]/[artifactId]/ApplicationTests.java`：

```java
@SpringBootTest
class ApplicationTests {
    @Test
    void contextLoads() {
    }
}
```

### 步骤 4：生成前端脚手架（Vue 3 Web）

#### 4.1 package.json

在 `frontend/web/` 下生成 `package.json`：

```json
{
  "name": "[项目名称]-web",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "lint": "eslint src --ext .ts,.vue --fix"
  },
  "dependencies": {
    "vue": "^3.4.x",
    "vue-router": "^4.x",
    "pinia": "^2.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "@vitejs/plugin-vue": "^5.x",
    "typescript": "^5.x",
    "vue-tsc": "^2.x",
    "vitest": "^1.x",
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```

#### 4.2 Vite 配置（vite.config.ts）

- Vue 插件
- 路径别名 `@/` → `src/`
- 开发代理：`/api` → 后端地址占位

#### 4.3 TypeScript 配置（tsconfig.json）

- strict 模式
- 路径别名
- Vue SFC 类型支持

#### 4.4 目录结构与基础文件

按 `frontend/AGENTS.md` 第 2 章创建：

| 文件 | 说明 |
|---|---|
| `src/api/request.ts` | axios 实例封装（Token 注入、错误码处理、401 跳转），与后端 `Result<T>` 对齐 |
| `src/router/index.ts` | Vue Router 初始化，空路由数组 |
| `src/stores/index.ts` | Pinia createPinia |
| `src/stores/user.ts` | `useUserStore` 骨架（token、userInfo） |
| `src/types/common.ts` | `Result<T>` 类型定义，与后端统一返回体匹配 |
| `src/App.vue` | 根组件，包含 `<router-view />` |
| `src/main.ts` | createApp + use router + use pinia |
| `index.html` | 入口 HTML |

#### 4.5 配置文件

- `.eslintrc.cjs` — ESLint 配置
- `.prettierrc` — Prettier 配置
- `.gitignore` — 忽略 node_modules、dist 等

### 步骤 5：生成测试目录结构

- 创建 `tests/api/` 空目录（用于接口测试）
- 测试代码命名与组织必须携带 TC 编号，以便执行结果自动映射回 `TEST_CASES.md` 中的用例：
  - **后端（JUnit 5）**：测试方法使用 `@DisplayName("TC-MODULE-NNN: 用例标题")` 注解
  - **前端（Vitest）**：使用 `describe("TC-MODULE-NNN: 用例标题", () => { ... })` 或 `it("TC-MODULE-NNN: 用例标题", ...)` 描述
  - **接口测试**：测试文件或用例同样以 TC 编号为前缀或标注
- 此约束确保 `qa-design` → `qa-execute` → `defect-fix` 闭环中，测试结果可按 TC 编号自动回写到测试报告

### 步骤 6：自检验证

检查清单：

- [ ] `backend/pom.xml` 存在且 XML 结构正确
- [ ] Application 启动类包含 `@SpringBootApplication`
- [ ] DDD 四层包结构已按 `backend/AGENTS.md` 第 2 章创建
- [ ] `Result<T>`、`BusinessException`、`GlobalExceptionHandler` 已创建
- [ ] `frontend/web/package.json` 存在且依赖正确
- [ ] 前端请求封装的 `Result<T>` 类型与后端一致
- [ ] Router 和 Pinia 已初始化
- [ ] 已有的 `AGENTS.md` 文件未被覆盖

### 步骤 7：提示下一步

脚手架创建完成后提示用户：
- 如已有业务资料（Word/PDF/设计稿/调研材料）：进入 `biz-research`
- 如已有结构化 Markdown PRD：可直接进入 `prd-review`
- 如尚无 PRD 或业务资料：等待需求输入

## 注意事项

- 本 Skill 创建的是**实际可编译/运行的代码文件**，不是文档
- **不添加业务逻辑**，只创建基础设施和基础类
- 脚手架必须能通过编译（`mvn compile`、`npm run build`）
- 如果 `ARCHITECTURE.md` 已存在，使用其中的模块名进行包命名；否则使用通用默认值
- **保留已有的 AGENTS.md 文件**，不得覆盖
- 生成的代码必须符合对应 `AGENTS.md` 中定义的所有规范
