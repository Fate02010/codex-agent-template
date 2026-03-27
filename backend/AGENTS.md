# backend/AGENTS.md — 后端实现规范

## 1. 技术栈

| 项目 | 选型 |
|---|---|
| 语言 | Java 17+ |
| 框架 | Spring Boot 3.x |
| ORM | MyBatis + MyBatis-Plus |
| 数据库 | MySQL 8.x |
| 缓存 | Redis |
| 构建工具 | Maven / Gradle |
| 代码规范 | 阿里巴巴 Java 开发手册 |

## 2. 分层架构

采用 DDD 分层架构：

```
backend/
└── src/main/java/com/example/项目名/
    ├── interfaces/          # 接口层（Controller）
    │   ├── controller/      # REST 控制器
    │   ├── dto/             # 请求/响应 DTO
    │   └── assembler/       # DTO ↔ Domain 转换器
    ├── application/         # 应用层（编排）
    │   ├── service/         # 应用服务（编排领域服务）
    │   ├── command/         # 写操作命令对象
    │   └── query/           # 查询对象
    ├── domain/              # 领域层（核心业务）
    │   ├── model/           # 领域模型（Entity、Value Object）
    │   ├── service/         # 领域服务
    │   ├── repository/      # 仓储接口
    │   └── event/           # 领域事件
    └── infrastructure/      # 基础设施层
        ├── persistence/     # 持久化实现
        │   ├── mapper/      # MyBatis Mapper 接口
        │   ├── po/          # 持久化对象
        │   └── repository/  # 仓储实现
        ├── cache/           # Redis 缓存实现
        └── config/          # 配置类
```

## 3. 核心规则

### 3.1 分层依赖

```
interfaces → application → domain ← infrastructure
```

- `interfaces` 只依赖 `application`，不跳层调用 `domain` 或 `infrastructure`
- `application` 编排 `domain` 层的服务和仓储接口
- `domain` 不依赖任何外层，是纯业务逻辑
- `infrastructure` 实现 `domain` 层定义的接口（依赖倒置）

### 3.2 Controller 规范

- **URL 必须带版本号**：`/api/v1/users`、`/api/v1/orders`
- Controller 只做：参数校验、DTO 转换、调用应用服务、返回结果
- **Controller 的 DTO 禁止进入 domain 层的 Service**
- 必须通过 Assembler 将 DTO 转换为 Command/Query 或领域对象后再传入

```java
// 正确示例
@PostMapping("/api/v1/users")
public Result<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
    CreateUserCommand command = userAssembler.toCommand(request);
    User user = userApplicationService.createUser(command);
    return Result.success(userAssembler.toDTO(user));
}

// 错误示例 — DTO 直接传入领域服务
@PostMapping("/api/v1/users")
public Result<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
    User user = userDomainService.createUser(request); // 禁止！
    return Result.success(userAssembler.toDTO(user));
}
```

### 3.3 MyBatis-Plus 使用规范

- MyBatis-Plus 生成的 `IService` / `ServiceImpl` **只能作为仓储（Repository）的扩展实现**使用
- 禁止在 application 或 domain 层直接调用 MyBatis-Plus 的 `IService`
- 所有数据访问必须通过 `domain/repository` 接口，由 `infrastructure/persistence/repository` 实现

```java
// 正确：Repository 实现内部使用 MyBatis-Plus
@Repository
public class UserRepositoryImpl implements UserRepository {
    private final UserMapper userMapper; // MyBatis Mapper
    private final UserMpService userMpService; // MyBatis-Plus Service（仅作为工具）

    @Override
    public User findById(Long id) {
        UserPO po = userMapper.selectById(id);
        return UserConverter.toDomain(po);
    }
}

// 错误：应用服务直接使用 MyBatis-Plus Service
@Service
public class UserApplicationService {
    private final IService<UserPO> userService; // 禁止！
}
```

### 3.4 数据访问边界

- **禁止 Controller 直连 Mapper**
- **禁止跨聚合直接访问其他聚合的 Mapper**
- 数据访问链路：`Controller → ApplicationService → DomainService/Repository → Mapper`

## 4. 编码规范（阿里巴巴 Java 开发手册）

### 4.1 命名规范

| 类型 | 规范 | 示例 |
|---|---|---|
| 类名 | UpperCamelCase | `UserService`、`OrderController` |
| 方法名 | lowerCamelCase | `getUserById`、`createOrder` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 包名 | 全小写 | `com.example.user.domain` |
| DTO | 以用途结尾 | `CreateUserRequest`、`UserResponse` |
| PO | 以 PO 结尾 | `UserPO`、`OrderPO` |

### 4.2 注释规范

- 类、接口必须有 Javadoc 注释
- 公共方法必须有 Javadoc，说明功能、参数、返回值
- 业务逻辑复杂处必须加行内注释

### 4.3 异常规范

- 使用统一异常体系：`BusinessException`（业务异常）、`SystemException`（系统异常）
- 错误码格式：`模块编号（整数） + 错误序号`，如 `10001`（10=用户模块，001=序号），类型为 int，与 `Result<T>` 的 code 字段对齐
- Controller 层通过全局异常处理器统一捕获和返回

### 4.4 统一返回体

```java
public class Result<T> {
    private int code;        // 业务状态码，0 表示成功
    private String message;  // 提示信息
    private T data;          // 业务数据

    public static <T> Result<T> success(T data) { ... }
    public static <T> Result<T> fail(int code, String message) { ... }
}
```

## 5. 单元测试要求

| 层级 | 测试要求 |
|---|---|
| Domain Service | 必须有单元测试，覆盖核心业务逻辑 |
| Application Service | 关键编排流程需要集成测试 |
| Repository | 关键查询需要集成测试 |
| Controller | 接口级集成测试（MockMvc） |

## 6. 变更要求

- 改接口前：先更新 `docs/02-architecture/API_CONTRACT.md`
- 改表结构前：先更新 `docs/02-architecture/DATA_MODEL.md`
- 改业务规则前：先确认 `docs/01-requirements/PRD_RECTIFIED.md` 是否已更新

## 7. 禁止事项

- 禁止在 Controller 中写业务逻辑
- 禁止 Controller 的 DTO 传入 Domain Service
- 禁止 Controller 直连 Mapper
- 禁止在 Domain 层依赖 Spring 框架注解（`@Autowired` 等）
- 禁止直接在 Application/Domain 层使用 MyBatis-Plus 的 `IService`
- 禁止裸写 SQL 拼接（防止 SQL 注入）
- 禁止吞掉异常不处理
