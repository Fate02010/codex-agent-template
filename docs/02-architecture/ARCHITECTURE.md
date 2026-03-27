# 架构设计

## 文档信息

- 文档类型：模板（首次执行 Skill 后覆盖）
- 生成 Skill：`solution-design`
- 版本：—
- 日期：—
- 关联需求：PRD_RECTIFIED.md
- 状态：待生成 → 草稿 → 已冻结

> 生成后冻结。

## 目标

定义系统整体架构，明确技术选型、模块划分和部署方案。

## 范围

> 由 `solution-design` Skill 根据 PRD_RECTIFIED.md 的功能范围确定。

## 1. 系统概述

## 2. 技术选型

| 层级 | 技术 | 版本 | 说明 |
|---|---|---|---|
| 后端框架 | Spring Boot | 3.x | |
| ORM | MyBatis + MyBatis-Plus | | |
| 数据库 | MySQL | 8.x | |
| 缓存 | Redis | | |
| Web 前端 | Vue 3 + TypeScript | | |
| 跨端方案 | UniApp | | 支持 H5、微信小程序、App |

## 3. 系统架构

### 3.1 分层架构

```
┌─────────────────────────────────────────────────────┐
│                   interfaces 层                      │
│           Controller / DTO / Assembler               │
├─────────────────────────────────────────────────────┤
│                  application 层                      │
│          ApplicationService / Command / Query         │
├─────────────────────────────────────────────────────┤
│                    domain 层                         │
│     Entity / ValueObject / DomainService / Repository│
├─────────────────────────────────────────────────────┤
│                infrastructure 层                     │
│        Mapper / PO / RepositoryImpl / Cache          │
└─────────────────────────────────────────────────────┘
```

### 3.2 依赖规则

- interfaces → application → domain ← infrastructure
- domain 层不依赖任何外层
- infrastructure 通过依赖倒置实现 domain 层接口

## 4. 模块划分

| 模块 | 职责 | 关联需求 |
|---|---|---|

## 5. 核心流程

## 6. 部署架构

## 7. 安全设计

### 7.1 认证

Bearer Token（JWT）

### 7.2 授权

基于角色的访问控制（RBAC）

### 7.3 数据安全

- 敏感数据加密存储
- SQL 注入防护（MyBatis 参数化查询）
- XSS 防护

## 异常与边界

> 全局性的架构风险、容灾策略、降级方案等。

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| — | — | — |
