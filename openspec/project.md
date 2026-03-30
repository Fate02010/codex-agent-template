# OpenSpec 项目基线

## 基本信息

- 项目名称：
- 项目代号：
- 当前基线版本：v0.0.0
- 维护人：
- 更新时间：

## 范围说明

- 当前阶段：首次交付 / 增量迭代
- 核心业务域：
- 非目标范围：

## 技术与架构约束

- 后端：Java 17+ / Spring Boot 3.x / MyBatis + MyBatis-Plus / Maven 多模块
- 前端：Vue3 + TypeScript + Element Plus（后台管理）
- 数据：MySQL 8.x + Redis

## 服务与模块

| 模块 | 类型 | 说明 |
|---|---|---|
| parent | 构建 | 版本与依赖管理 |
| common | 公共模块 | 统一返回体、错误码、通用能力 |
| admin-service | 业务服务 | 后台管理端 |
| app-service | 业务服务 | 移动端/小程序端（按需） |

## 设计与接口边界

- 外部接口：`/api/v1/**`
- 内部接口：`/internal/v1/**`
- 错误码目录：`resources/error/`

## 关联文档

- `docs/01-requirements/PRD_RECTIFIED.md`
- `docs/02-architecture/ARCHITECTURE.md`
- `docs/02-architecture/API_CONTRACT.md`
- `docs/02-architecture/DATA_MODEL.md`
- `docs/02-design/UI_DESIGN_SPEC.md`

