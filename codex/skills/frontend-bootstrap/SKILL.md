---
name: frontend-bootstrap
description: 初始化或补齐前端后台工程骨架（frontend/<project-name>/web），默认 Vue3 + TypeScript + Element Plus。
---

# Skill: frontend-bootstrap — 前端最小工程骨架初始化

## Purpose

创建或补齐 `frontend/` 下最小可运行前端工程，默认面向后台管理端，保证后续可直接衔接 `dev-implement`。

## When to Use

- `frontend/` 不存在可运行工程
- 已有目录但缺少可启动骨架
- 需要统一前端目录到 `frontend/<project-name>/web`

## Inputs

1. `AGENTS.md`
2. `frontend/AGENTS.md`
3. `docs/01-requirements/PRD_RECTIFIED.md`（如有）
4. `docs/02-architecture/API_CONTRACT.md`（如有）
5. `docs/02-design/UI_DESIGN_SPEC.md`（如有）
6. `docs/02-design/PAGE_FLOW.md`（如有）
7. `docs/01-requirements/MVP_SCOPE.md`（如有）

## Outputs

默认输出：`frontend/<project-name>/web/`

至少包含：

- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `src/main.ts`
- `src/App.vue`
- `src/router/index.ts`
- `src/stores/`
- `src/api/request.ts`
- `src/types/common.ts`
- `src/pages/`
- `src/components/base` + `src/components/business`

按需输出：

- `frontend/<project-name>/uniapp/`
- `frontend/<project-name>/miniprogram/`

## Rules

- 后台管理默认强制 Element Plus
- 目录必须使用 `frontend/<project-name>/web`
- API 调用路径仅允许 `/api/v1/**`
- 不在本阶段实现完整业务页面
- 已有文件优先补齐，不直接覆盖

## Steps

### 1. 读取约束并提取项目名

从文档中提取 `project-name`，若缺失则使用统一默认并标记【待确认】。

### 2. 检查当前状态

- `create`：无工程
- `patch`：缺入口或缺基础目录
- `skip`：已满足要求

### 3. 生成基础工程

创建 `frontend/<project-name>/web` 并初始化：

- Vue3 + TS + Vite
- Vue Router + Pinia + Axios
- Element Plus

### 4. 生成基础目录和占位页面

- `pages/dashboard/index.vue`（示例页）
- 路由默认跳转到示例页
- 样式与类型占位文件齐全

### 5. 请求封装与返回体对齐

`src/api/request.ts` 需包含：

- Token 注入
- 统一错误处理
- 与后端 `Result<T>` 对齐的响应类型

### 6. 自检

- [ ] `npm run build` 可通过（或等效）
- [ ] Element Plus 已注册
- [ ] 目录符合 `frontend/<project-name>/web`
- [ ] API 层与类型层已建立

## Quality Gate

- [ ] 工程可启动
- [ ] 工程可构建
- [ ] 目录与技术栈符合基线
- [ ] 后续可直接进入 `dev-implement`
