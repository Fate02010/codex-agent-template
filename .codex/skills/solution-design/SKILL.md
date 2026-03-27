# Skill: solution-design — 方案设计

## 触发条件

当整改后的 PRD 已确认（`PRD_RECTIFIED.md` 已完成），需要生成架构设计、接口契约、数据模型时使用。

## 输入

- `docs/01-requirements/PRD_RECTIFIED.md` — 整改后的需求文档

## 输出

1. `docs/02-architecture/ARCHITECTURE.md` — 架构设计
2. `docs/02-architecture/API_CONTRACT.md` — 接口契约
3. `docs/02-architecture/DATA_MODEL.md` — 数据模型

## 执行流程

### 步骤 1：读取需求

读取 `docs/01-requirements/PRD_RECTIFIED.md`，梳理：
- 所有功能模块及其编号
- 角色与权限
- 核心业务流程
- 数据实体与关系

### 步骤 2：输出架构设计（ARCHITECTURE.md）

```markdown
# 架构设计

## 文档信息
- 版本：v1.0
- 日期：YYYY-MM-DD
- 关联需求：PRD_RECTIFIED.md

## 1. 系统概述
整体架构说明和设计目标。

## 2. 技术选型
| 层级 | 技术 | 版本 | 说明 |
|---|---|---|---|
| 后端框架 | Spring Boot | 3.x | |
| ORM | MyBatis + MyBatis-Plus | | |
| 数据库 | MySQL | 8.x | |
| 缓存 | Redis | | |
| 前端 | Vue 3 / UniApp | | |

## 3. 系统架构图
用文字或 ASCII 描述分层架构。

## 4. 模块划分
| 模块 | 职责 | 关联需求 |
|---|---|---|

## 5. 核心流程
针对每个核心业务流程，描述系统内部交互：
### 流程 1：[流程名称]（关联 F001）
1. 用户发起请求
2. Controller 接收并校验
3. ApplicationService 编排
4. DomainService 处理业务
5. Repository 持久化

## 6. 部署架构
描述部署方式（单体/微服务、容器化等）。

## 7. 安全设计
认证、授权、数据安全方案。

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

### 步骤 3：输出接口契约（API_CONTRACT.md）

按 RESTful 规范设计所有接口：

```markdown
# 接口契约

## 文档信息
- 版本：v1.0
- 日期：YYYY-MM-DD
- 关联需求：PRD_RECTIFIED.md

## 全局约定

### Base URL
`/api/v1`

### 统一返回体
| 字段 | 类型 | 说明 |
|---|---|---|
| code | int | 业务状态码，0=成功 |
| message | string | 提示信息 |
| data | object/array | 业务数据 |

### 统一错误码
| 错误码 | HTTP 状态码 | 说明 |
|---|---|---|
| 0 | 200 | 成功 |
| 400xx | 400 | 参数校验失败 |
| 401xx | 401 | 未认证 |
| 403xx | 403 | 无权限 |
| 404xx | 404 | 资源不存在 |
| 500xx | 500 | 系统异常 |

### 认证方式
Bearer Token（JWT），通过 Header `Authorization: Bearer <token>` 传递。

### 分页约定
| 参数 | 类型 | 说明 |
|---|---|---|
| pageNum | int | 页码，从 1 开始 |
| pageSize | int | 每页条数，默认 20，最大 100 |

分页响应：
| 字段 | 类型 | 说明 |
|---|---|---|
| total | long | 总记录数 |
| pages | int | 总页数 |
| list | array | 数据列表 |

## 接口清单

### 模块：[模块名]

#### API-XXX-001: [接口名称]
- **关联需求**：F001
- **URL**：`POST /api/v1/xxx`
- **认证**：需要
- **幂等性**：是 / 否
- **请求参数**：
  | 参数 | 类型 | 必填 | 说明 |
  |---|---|---|---|
- **响应数据**：
  | 字段 | 类型 | 说明 |
  |---|---|---|
- **错误码**：
  | 错误码 | 说明 |
  |---|---|
- **示例**：
  请求：`json { ... }`
  响应：`json { "code": 0, "message": "success", "data": { ... } }`

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

### 步骤 4：输出数据模型（DATA_MODEL.md）

```markdown
# 数据模型

## 文档信息
- 版本：v1.0
- 日期：YYYY-MM-DD
- 关联需求：PRD_RECTIFIED.md

## 全局约定

### 公共字段
所有业务表必须包含以下公共字段：

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint | 主键，自增 |
| created_by | varchar(64) | 创建人 |
| created_time | datetime | 创建时间 |
| updated_by | varchar(64) | 更新人 |
| updated_time | datetime | 更新时间 |
| deleted | tinyint(1) | 逻辑删除标记，0=未删除，1=已删除 |

### 命名规范
- 表名：小写 + 下划线，业务前缀，如 `t_user`、`t_order`
- 字段名：小写 + 下划线，如 `user_name`、`created_time`
- 索引名：`idx_表名_字段名`（普通索引）、`uk_表名_字段名`（唯一索引）

## ER 关系概览
用文字描述核心实体之间的关系。

## 表结构

### t_xxx — [表说明]（关联 F001）

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| id | bigint | 是 | 自增 | 主键 |
| ... | ... | ... | ... | ... |

**索引**：
| 索引名 | 类型 | 字段 | 说明 |
|---|---|---|---|

**SQL**：
（附建表 SQL）

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

### 步骤 5：交叉验证

设计完成后进行以下验证：

- [ ] 每个 PRD 功能点都有对应的接口
- [ ] 每个接口的请求/响应字段都能在数据模型中找到来源
- [ ] 数据模型覆盖了所有业务实体
- [ ] 接口 URL 全部使用 `/api/v1/` 前缀
- [ ] 统一返回体和错误码一致
- [ ] 架构设计与技术栈约束一致（Spring Boot 3.x, MyBatis-Plus, MySQL 8.x, Redis）

### 步骤 6：提示下一步

设计完成后提示用户：
- 如需开发实现，使用 `dev-implement`
- 如需生成测试计划，使用 `qa-design`

## 注意事项

- 所有设计必须基于 PRD_RECTIFIED.md，不自行增加未定义的需求
- 接口 URL 必须带版本号 `/api/v1/`
- Controller DTO 不能进入 Domain Service（在架构设计中体现）
- MyBatis-Plus Service 只能作为仓储扩展（在架构设计中体现）
- 数据模型必须遵循 MySQL 8.x 语法
