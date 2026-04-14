---
name: project-init
description: 初始化项目可运行骨架（后端 Maven 多模块 + MyBatis-Plus + 公共模块 + 前端 Element Plus 管理端）。
---

# Skill: project-init — 项目脚手架初始化

## 触发条件

当项目处于首次交付，且 `backend/`、`frontend/` 下没有可运行工程时使用。

## 输入

1. `AGENTS.md`
2. `backend/AGENTS.md`
3. `frontend/AGENTS.md`
4. `docs/01-requirements/PRD_RECTIFIED.md`（如有）
5. `docs/03-architecture/ARCHITECTURE.md`（如有）
6. `docs/03-architecture/API_CONTRACT.md`（如有）
7. `docs/03-architecture/DATA_MODEL.md`（如有）
8. `docs/01-requirements/MVP_SCOPE.md`（如有）

## 输出

- 后端：`backend/<project-name>-parent` 多模块骨架
- 前端：`frontend/<project-name>/web` 后台管理骨架（Vue3 + TS + Element Plus）
- 测试：`tests/api/` 基础目录

## 执行层级导读（Progressive Disclosure）

- `P0 必检（阻塞）`：技术栈约束解析、目录骨架可运行、后端多模块与前端管理端结构满足基线。
- `P1 扩展（覆盖）`：配置补齐、测试目录初始化、注释规范占位完整。
- `P2 参考（说明）`：说明文本仅作参考，不参与放行。
- 执行顺序必须为：先过 `P0 Gate`，再进入 `P1`；`P2` 不得覆盖 `P0` 结论。

## 执行流程

### 步骤 0：P0 Gate（阻塞）

1. 校验 `AGENTS.md` 与局部约束可读。
2. 校验当前仓库确实处于“无可运行工程骨架”或“需补齐骨架”场景。
3. 任一不满足时输出 `BLOCKED` 并停止，不进入后续步骤。

### 步骤 1：读取约束并判定场景

1. 从 `AGENTS.md` 与局部 `AGENTS.md` 读取技术栈约束。
2. 判定是否多端场景：
   - 若明确存在后台管理端 + 移动端/小程序端，按双服务初始化。
   - 否则按单服务初始化。
3. 提取项目元数据：`groupId`、`artifactId`、`projectName`、Java 版本。

### 步骤 2：生成后端 Maven 多模块骨架

在 `backend/<project-name>-parent/` 生成：

```text
<project-name>-parent/
├── pom.xml
├── <project-name>-common/
│   ├── pom.xml
│   └── src/main/java/.../common/
├── <project-name>-admin-service/
│   ├── pom.xml
│   ├── src/main/java/.../
│   └── src/main/resources/
└── <project-name>-app-service/   # 多端时生成
    ├── pom.xml
    ├── src/main/java/.../
    └── src/main/resources/
```

要求：

1. 父模块 `pom.xml` 只做依赖与插件版本管理，不放业务代码。
2. `common` 模块提供：`Result<T>`、异常基类、错误键定义。
3. 业务服务模块提供 DDD 目录：`interfaces/application/domain/infrastructure`。
4. 父模块必须管理 MyBatis-Plus 依赖版本，服务模块必须声明 MyBatis-Plus starter 依赖。

### 步骤 3：补齐后端强制配置

每个服务模块必须补齐以下内容：

1. 启动类（`@SpringBootApplication`）
2. Mapper 扫描配置（`@MapperScan` 或等效配置类）
3. MyBatis-Plus 配置类（注册 `MybatisPlusInterceptor`，至少包含分页插件）
4. 至少一个 Mapper 接口继承 `BaseMapper<T>`
5. `application.yml`，包含：
   - `mybatis-plus.mapper-locations: classpath:mapper/**/*.xml`
   - `mybatis-plus.type-aliases-package: ...infrastructure.persistence.po`
6. `src/main/resources/mapper/**/*.xml` 占位 Mapper XML
7. `src/main/resources/error/`：
   - `error-codes.properties`
   - `error-messages_zh_CN.properties`
   - `error-messages_en_US.properties`
8. 外部与内部 Controller 分层目录：
   - `interfaces/controller/external`
   - `interfaces/controller/internal`

### 步骤 4：生成前端后台骨架（Element Plus）

在 `frontend/<project-name>/web/` 生成：

1. `package.json`：Vue3、TypeScript、Vite、Vue Router、Pinia、Axios、Element Plus
2. `src/main.ts`：注册 Router、Pinia、Element Plus
3. `src/App.vue`
4. `src/router/index.ts`
5. `src/stores/`
6. `src/api/request.ts`（统一返回体对齐后端 `Result<T>`）
7. `src/types/common.ts`

### 步骤 5：注释与规范占位

生成的 Java 类模板需包含 Javadoc，占位字段至少包含：

- 作者名
- 时间说明
- 类用途

实体/DTO/PO 字段需保留字段注释占位。

### 步骤 6：测试目录初始化

- 创建 `tests/api/`
- 创建后端最小 `ApplicationTests`
- 测试示例应体现 TC 绑定规范（`@DisplayName("TC-...")`）

### 步骤 7：自检

至少检查：

- [ ] 后端父模块 + common + 业务模块存在
- [ ] 父模块不含业务代码
- [ ] 服务模块已接入 MyBatis-Plus（依赖、Mapper 扫描、拦截器）
- [ ] Mapper XML 路径和配置存在
- [ ] `resources/error` 多语言配置存在
- [ ] 前端默认包含 Element Plus
- [ ] 前端目录使用 `frontend/<project-name>/web`

## Quality Gate（分层）

### P0 Gate（阻塞，最小必检）

- [ ] 后端父模块 + common + 至少 1 个业务模块存在。
- [ ] 前端后台管理骨架存在且可安装运行。
- [ ] 任一结构性缺失时结论必须为 `FAIL/BLOCKED`。

### P1 Coverage Checklist（扩展覆盖）

- [ ] MyBatis-Plus 基线接入完整（依赖、扫描、拦截器）。
- [ ] 前端基础能力与目录规范完整。
- [ ] 测试目录与示例初始化完成。

### P2 Reference Checklist（参考）

- [ ] 说明文本已更新，且不改变 `P0` 判定口径。

## 注意事项

- 本 Skill 只做骨架，不实现完整业务逻辑。
- 若已有同名模块，优先补齐缺口，不直接覆盖已有文件。
- 若文档仍为模板状态，仅创建占位，不推断具体业务字段。
