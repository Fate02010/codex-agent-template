# 数据模型

## 文档信息

- 文档类型：模板（首次执行 Skill 后覆盖）
- 生成 Skill：`solution-design`
- 上游输入：`PRD_RECTIFIED.md`、`ARCHITECTURE.md`
- 版本：v0.0
- 日期：—
- 状态：模板 → 草稿 → 已整改 → 已冻结

> 表结构变更必须先更新本文档。

## 目标

定义系统数据实体、表结构、索引、约束、SQL DDL 和追溯关系，作为持久化实现依据。

## 范围

- 在范围内：实体、表、字段、索引、建表 SQL、索引 SQL、逻辑关系、状态字段和数据约束
- 不在范围内：Repository 实现细节

## 1. 全局约定

### 1.1 公共字段

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| id | bigint unsigned | 是 | AUTO_INCREMENT | 主键 |
| created_by | varchar(64) | 否 | NULL | 创建人 |
| created_time | datetime | 是 | CURRENT_TIMESTAMP | 创建时间 |
| updated_by | varchar(64) | 否 | NULL | 更新人 |
| updated_time | datetime | 是 | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted | tinyint(1) | 是 | 0 | 逻辑删除标记 |

### 1.2 命名规范

| 对象 | 规范 | 示例 |
|---|---|---|
| 表名 | 小写 + 下划线，`t_` 前缀 | `t_user` |
| 字段名 | 小写 + 下划线 | `user_name` |
| 普通索引 | `idx_表名_字段名` | `idx_user_phone` |
| 唯一索引 | `uk_表名_字段名` | `uk_user_email` |

### 1.3 存储约定

- 引擎：InnoDB
- 字符集：utf8mb4
- 排序规则：utf8mb4_general_ci
- 默认不使用物理外键，使用逻辑关联

### 1.4 SQL 注释规范

- 所有 `CREATE TABLE` 字段定义必须带 `COMMENT`，且注释内容必须为中文业务说明
- 禁止字段缺失注释，禁止使用纯英文占位注释（如 `name`、`status`）
- 表级 `COMMENT='...'` 必填，描述该表业务用途

## 2. 实体概览

| 实体编号 | 实体名称 | 说明 | 关联需求 | 对应表 | 所属服务 |
|---|---|---|---|---|---|

## 3. ER 关系概览

| 主实体 | 关系 | 从实体 | 说明 |
|---|---|---|---|

## 4. 表结构明细

### T-XXX-001: `t_xxx`

- 关联需求：
- 实体说明：
- 所属服务：admin-service / app-service
- 数据量预估：
- 写入频率：
- 更新频率：

#### 字段清单

| 字段名 | 类型 | 必填 | 默认值 | 索引 | 说明 |
|---|---|---|---|---|---|

#### 索引设计

| 索引名 | 类型 | 字段 | 设计理由 |
|---|---|---|---|

#### 建表 SQL

```sql
-- 请填写完整 CREATE TABLE 语句（MySQL 8.x）
-- 强制要求：每个字段都必须包含中文 COMMENT 注释
CREATE TABLE IF NOT EXISTS `t_xxx` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `created_by` varchar(64) DEFAULT NULL COMMENT '创建人',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` varchar(64) DEFAULT NULL COMMENT '更新人',
  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '逻辑删除标记'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='表说明';
```

#### 索引 SQL

```sql
-- 请填写该表的 CREATE INDEX / ALTER TABLE ADD INDEX 语句
-- 示例：
-- CREATE UNIQUE INDEX `uk_xxx_field` ON `t_xxx` (`field`);
-- CREATE INDEX `idx_xxx_created_time` ON `t_xxx` (`created_time`);
```

#### 约束与规则

| 编号 | 规则 | 说明 |
|---|---|---|

#### 状态字段说明

| 字段 | 状态值 | 说明 |
|---|---|---|

## 5. 数据追溯矩阵

| 数据表编号 | 表名 | 所属服务 | 关联需求 | 关联接口 |
|---|---|---|---|---|

## 6. 数据风险与迁移策略

| 编号 | 风险/迁移项 | 影响 | 处理方式 |
|---|---|---|---|

## 异常与边界

- 表结构未冻结前，不得生成最终实体和 Mapper
- 删除字段或破坏性变更必须在版本计划中明确记录

## 完成检查

- [ ] 每张表都能追溯到需求
- [ ] 每张表都定义字段、索引和约束
- [ ] 每张表都提供可执行的建表 SQL（CREATE TABLE）
- [ ] 建表 SQL 的所有字段均带中文 COMMENT 注释（无缺失、无英文占位）
- [ ] 每张表都提供可执行的索引 SQL（CREATE INDEX / ADD INDEX）
- [ ] 状态字段和枚举值含义明确
- [ ] 可以直接指导后端持久化实现

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| — | — | — |
