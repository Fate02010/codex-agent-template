---
name: dev-implement
description: 开发实现
---

# Skill: dev-implement — 开发实现

## 触发条件

当设计文档已完成（`ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md` 齐备），需要编写代码时使用。

## 前置条件

- `backend/pom.xml` 或 `frontend/web/package.json` / `frontend/uniapp/package.json` 存在（否则先执行 `project-init`）
- 需求与设计基线已冻结（`PRD_RECTIFIED.md`、`ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md`）

## 完成标准

- 代码编译通过，无 warning
- Domain Service 有单元测试覆盖
- Controller 接口与 `API_CONTRACT.md` 一致

## 输入

1. `docs/01-requirements/PRD_RECTIFIED.md` — 整改后需求文档
2. `docs/02-architecture/ARCHITECTURE.md` — 架构设计
3. `docs/02-architecture/API_CONTRACT.md` — 接口契约
4. `docs/02-architecture/DATA_MODEL.md` — 数据模型
5. `docs/03-testing/TEST_PLAN.md` — 测试计划
6. `docs/03-testing/TEST_CASES.md` — 已分配 TC 编号的测试用例
7. `backend/AGENTS.md` — 后端规范（后端开发时）
8. `frontend/AGENTS.md` — 前端规范（前端开发时）

## 输出

- 后端代码：`backend/` 目录下
- 前端代码：`frontend/` 目录下

## 执行流程

### 步骤 0：验证前置条件

1. **检查工程骨架**：
   - 后端：`backend/pom.xml` 是否存在？
   - 前端：`frontend/web/package.json` 或 `frontend/uniapp/package.json` 是否存在？
   - 如不存在，**中止执行**并提示："请先执行 `project-init` 初始化项目骨架"
2. **检查设计文档状态**：
   - `PRD_RECTIFIED.md` 状态是否为"已冻结"？
   - `ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md` 状态是否为"已冻结"？
   - 如未冻结或不存在，**中止执行**并提示缺失的前置文档

### 步骤 1：读取设计文档

按以下顺序读取：

1. `docs/02-architecture/ARCHITECTURE.md` — 理解整体架构和模块划分
2. `docs/02-architecture/API_CONTRACT.md` — 理解接口契约
3. `docs/02-architecture/DATA_MODEL.md` — 理解数据模型
4. `docs/03-testing/TEST_CASES.md` — 获取已分配的 TC 编号和测试代码映射
5. 对应目录的 `AGENTS.md` — 理解编码规范

### 步骤 2：后端开发（按 backend/AGENTS.md 规范）

#### 2.1 基础设施层（infrastructure）

按 DATA_MODEL.md 创建：

1. **PO（持久化对象）**：与数据库表一一对应
2. **Mapper 接口**：MyBatis Mapper，定义 SQL 操作
3. **Repository 实现**：实现 domain 层的 Repository 接口，内部可使用 MyBatis-Plus

#### 2.2 领域层（domain）

按 PRD 和架构设计创建：

1. **领域模型**：Entity、Value Object
2. **Repository 接口**：定义数据访问契约
3. **领域服务**：核心业务逻辑（不依赖 Spring 框架）

#### 2.3 应用层（application）

按接口契约创建：

1. **Command / Query 对象**：写操作命令和查询对象
2. **应用服务**：编排领域服务和仓储，实现用例

#### 2.4 接口层（interfaces）

按 API_CONTRACT.md 创建：

1. **DTO**：请求和响应对象
2. **Assembler**：DTO ↔ Command/Query/Domain 转换器
3. **Controller**：REST 接口，URL 带版本号 `/api/v1/`

#### 开发检查清单

- [ ] Controller URL 带版本号 `/api/v1/`
- [ ] Controller DTO 未进入 Domain Service
- [ ] MyBatis-Plus Service 仅在 Repository 实现中使用
- [ ] 分层依赖正确：interfaces → application → domain ← infrastructure
- [ ] 统一返回体 `Result<T>`
- [ ] 统一异常处理
- [ ] 代码符合阿里巴巴 Java 开发手册
- [ ] Domain 层不依赖 Spring 框架注解

### 步骤 3：前端开发（按 frontend/AGENTS.md 规范）

#### 3.1 API 层

按 API_CONTRACT.md 创建：

1. **类型定义**：请求/响应的 TypeScript 类型
2. **API 函数**：按模块封装接口调用

#### 3.2 页面与组件

按 PRD 功能点创建：

1. **页面组件**：路由入口
2. **业务组件**：可复用的业务 UI
3. **通用组件**：基础 UI 组件

#### 3.3 状态管理

1. **Store**：Pinia Store 按模块拆分
2. **全局状态**：用户信息、Token、权限

### 步骤 4：按已分配 TC 编号编写测试

- Domain Service 必须有单元测试
- 关键 Application Service 编排逻辑需要测试
- 前端关键组件需要组件测试
- 测试编号来源于 `qa-design` 已生成的 `TEST_CASES.md`，`dev-implement` 不得自行发明或重排 TC 编号
- 测试方法的 `@DisplayName` 注解必须包含关联的 TC 编号，格式：`@DisplayName("TC-XXX-NNN: 用例标题")`
  - 示例：`@DisplayName("TC-USER-001: 正常创建用户")`
- 前端测试的 `describe`/`it` 描述必须包含 TC 编号
  - 示例：`it('TC-USER-001: 正常创建用户', () => { ... })`

### 步骤 5：自检验证

开发完成后执行以下验证：

1. **编译检查**：代码编译通过，无 warning
2. **接口一致性**：Controller 接口与 API_CONTRACT.md 一致
3. **数据模型一致性**：Entity/PO 与 DATA_MODEL.md 一致
4. **分层依赖**：无跨层调用
5. **代码规范**：符合 AGENTS.md 中的规范要求
6. **单元测试**：核心逻辑有测试覆盖
7. **TC 绑定**：测试代码中的 TC 编号均来自 `TEST_CASES.md`

### 步骤 6：提示下一步

开发完成后提示用户：
- 如需执行测试，使用 `qa-execute`

## 注意事项

- 严格按照设计文档实现，不自行增加未设计的功能
- 先改文档再改代码的原则也适用于开发阶段
- 发现设计问题时，先更新设计文档，再调整代码
- 遵循对应目录 AGENTS.md 中的所有约束
