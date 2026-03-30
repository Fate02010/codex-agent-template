---
name: solution-design
description: 基于冻结 PRD 输出架构、接口、数据模型设计，并强制落地多模块后端基线与内外部接口分层策略。
---

# Skill: solution-design — 方案设计

## 触发条件

当 `PRD_RECTIFIED.md` 状态为 `已冻结`，且需要输出/更新架构、接口、数据模型时使用。

## 输入

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/01-requirements/MVP_SCOPE.md`（如有）
3. 相关变更文档（迭代场景）

## 输出

1. `docs/02-architecture/ARCHITECTURE.md`
2. `docs/02-architecture/API_CONTRACT.md`
3. `docs/02-architecture/DATA_MODEL.md`

## 执行流程

### 步骤 0：校验需求基线

- `PRD_RECTIFIED.md` 必须是 `已冻结`
- 非冻结状态时终止并返回 `prd-rectify`

### 步骤 1：识别系统形态（条件强制）

从需求和范围文档判断：

- 单端：后台管理端
- 多端：后台管理端 + 移动端/小程序端

根据结果在设计中强制落地：

- 单端：`admin-service`
- 多端：`admin-service + app-service`

### 步骤 2：输出 ARCHITECTURE.md

架构文档必须包含：

1. Maven 多模块基线：父模块 + common + 业务服务
2. 父模块职责：仅版本管理
3. 公共模块职责：统一返回体、错误键、通用异常
4. 服务拓扑与调用关系
5. 外部接口与内部接口分层策略

### 步骤 3：输出 API_CONTRACT.md

接口文档必须包含两个接口域：

1. 外部接口域（前端调用）：`/api/v1/**`
2. 内部接口域（微服务调用）：`/internal/v1/**`

每个接口需明确：

- 接口编号
- 关联需求
- 调用方
- 鉴权方式
- 错误码与错误键

### 步骤 4：输出 DATA_MODEL.md

数据模型文档需：

- 保证表结构与需求和接口字段一致
- 明确每张表关联的服务模块
- 对跨服务共享数据给出边界说明
- 每张表必须包含建表 SQL（CREATE TABLE）
- 每张表必须包含索引 SQL（CREATE INDEX / ADD INDEX）

### 步骤 5：错误码国际化设计

在 `ARCHITECTURE.md` / `API_CONTRACT.md` 中明确：

- 错误码配置目录：`resources/error/`
- 文件规范：`error-codes.properties`、`error-messages_zh_CN.properties`、`error-messages_en_US.properties`
- 错误响应按 `code + message + data` 输出

### 步骤 6：交叉校验

- [ ] 模块拆分与项目形态一致
- [ ] 接口路径区分外部/内部
- [ ] 接口、数据表、需求编号可追溯
- [ ] `DATA_MODEL.md` 每张表均有建表 SQL 与索引 SQL
- [ ] 错误码规则在架构与接口文档一致

## 注意事项

- 不得在本阶段实现代码。
- 不得新增 PRD 未定义的业务能力。
- 增量场景应局部更新，保留历史基线可追溯性。
