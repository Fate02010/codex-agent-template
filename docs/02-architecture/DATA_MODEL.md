# 数据模型

## 文档信息

- 文档类型：模板（首次执行 Skill 后覆盖）
- 生成 Skill：`solution-design`
- 版本：—
- 日期：—
- 关联需求：PRD_RECTIFIED.md
- 状态：待生成 → 草稿 → 已冻结

> 严格冻结，表结构变更必须先改文档。

## 目标

定义系统数据库表结构、字段规范和 ER 关系，作为后端持久化层实现的唯一依据。

## 范围

> 由 `solution-design` Skill 根据 PRD_RECTIFIED.md 的功能范围确定。

## 全局约定

### 公共字段

所有业务表必须包含以下公共字段：

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| id | bigint unsigned | 是 | AUTO_INCREMENT | 主键 |
| created_by | varchar(64) | 否 | NULL | 创建人 |
| created_time | datetime | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | varchar(64) | 否 | NULL | 更新人 |
| updated_time | datetime | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted | tinyint(1) | 是 | 0 | 逻辑删除，0=正常，1=已删除 |

### 命名规范

| 对象 | 规范 | 示例 |
|---|---|---|
| 表名 | 小写 + 下划线，`t_` 前缀 | `t_user`、`t_order` |
| 字段名 | 小写 + 下划线 | `user_name`、`order_status` |
| 普通索引 | `idx_表名_字段名` | `idx_user_phone` |
| 唯一索引 | `uk_表名_字段名` | `uk_user_email` |
| 外键 | 不使用物理外键，用逻辑关联 | — |

### 数据库引擎

- 引擎：InnoDB
- 字符集：utf8mb4
- 排序规则：utf8mb4_general_ci

## ER 关系概览

> 由 `solution-design` Skill 根据 PRD 实体分析自动生成。

## 表结构

> 由 `solution-design` Skill 根据 PRD 功能点自动生成。

## 异常与边界

> 数据迁移风险、存储容量边界、分库分表策略、数据一致性约束等。

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| — | — | — |
