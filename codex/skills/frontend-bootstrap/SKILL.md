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
4. `docs/03-architecture/API_CONTRACT.md`（如有）
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

#### [断点恢复扫描]

按 `## 断点恢复` 检查点表格从后向前扫描各步骤完成状态，确定续执起点后输出恢复摘要（格式见 `AGENTS.md` § 14.5 第 3 条），然后跳转到续执起点。若无断点，继续执行以下步骤 1 主体。

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

## 断点恢复

> 通用恢复原则见根目录 `AGENTS.md` § 14。本章节声明本 Skill 的步骤级检查点；未列出的项回退到 `AGENTS.md` § 14.4 默认规则。

### 检查点表格

| 步骤 | 步骤名称 | 完成判定条件 | 续执起点 |
|---|---|---|---|
| 步骤 1 | 读取约束并提取项目名 | 已确定 `project-name`（可从上下文或已生成目录名推断） | 步骤 2 |
| 步骤 2 | 检查当前状态 | `frontend/<project-name>/web/package.json` 不存在（全新）或已存在（补齐模式） | 步骤 3 |
| 步骤 3 | 生成基础工程 | `frontend/<project-name>/web/package.json` 存在 | 步骤 4 |
| 步骤 4 | 生成基础目录和占位页面 | `src/pages/` 目录存在且有至少一个占位页面文件 | 步骤 5 |
| 步骤 5 | 请求封装与返回体对齐 | `src/api/request.ts` 存在且非空 | 步骤 6 |
| 步骤 6 | 自检 | 工程可构建（`package.json` 完整，无缺失依赖） | — |

### 默认恢复原则（兜底）

1. 若 `frontend/<project-name>/web/package.json` 不存在，从步骤 1 全量执行。
2. 若目录已存在但部分文件缺失，从第一个缺失文件对应步骤续执，已有文件不覆盖。
3. Gate Report 结论为 `BLOCKED` 时，从步骤 1 重新评估（参见 `AGENTS.md` § 14.5 第 4 条）。
