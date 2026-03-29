---
name: frontend-bootstrap
description: Bootstrap a minimal runnable frontend scaffold aligned with AGENTS rules, docs baselines, OpenSpec, and UI design inputs.
---

# Skill: frontend-bootstrap — 前端最小工程骨架初始化

## Purpose

本 Skill 的职责是创建或补齐 `frontend/` 下的前端最小可运行工程骨架，不负责完整页面业务实现。

- 创建前端工程骨架并保证最小可启动
- 补充最小构建文件、最小启动入口、基础目录结构
- 为后续页面开发和接口接入提供稳定起点
- 与 HTML 高保真设计稿和 UI 设计说明建立衔接位
- 与 `docs/`、OpenSpec change、`AGENTS.md` 规则保持一致

边界说明：

- 本 Skill 只做 scaffold，不落地完整业务页面
- 不替代 `dev-implement` 的业务开发职责

## When to Use

以下场景应触发本 Skill：

- 新项目开始，`frontend/` 目录尚不存在
- `frontend/` 已存在，但仅有空目录或占位文件（例如仅有 `AGENTS.md`）
- 需求和 UI 设计已基本明确，准备进入前端开发
- 需要统一多个项目的前端基础工程结构
- 单人使用 Codex，需要标准化前端初始化流程

## Inputs

执行前按如下顺序读取输入（存在则读取，不存在需标记【待确认】）：

1. 根规则：`AGENTS.md`
2. 前端规则：`frontend/AGENTS.md`
3. OpenSpec 基线：`openspec/project.md`
4. MVP 范围：`docs/01-requirements/MVP_SCOPE.md`
5. 需求基线（如已存在）：`docs/01-requirements/PRD_RECTIFIED.md`
6. UI 设计说明（如已存在）：`docs/02-design/UI_DESIGN_SPEC.md`
7. 页面流转（如已存在）：`docs/02-design/PAGE_FLOW.md`
8. HTML 高保真设计稿目录（如已存在）：`frontend/design-prototype/` 或 `docs/02-design/prototype/`
9. 技术栈约束（Vue 3 + TypeScript 或 React + TypeScript）
10. 可选后续对接参考：`docs/02-architecture/API_CONTRACT.md`

输入处理要求：

- 若 `openspec/project.md` 或 `MVP_SCOPE.md` 缺失，必须在输出说明中登记【待确认】
- 若框架或版本约束冲突，优先根 `AGENTS.md` 与 `frontend/AGENTS.md`，并标记【冲突】
- 若 UI 设计文档仍为模板或未冻结，仅创建骨架与占位，不推断完整页面行为

## Outputs

固定输出结果采用“双模式并存”，按项目约束自动择一：

模式 A（模板默认，推荐）：

- `frontend/web/` 下的最小前端工程骨架
- `frontend/web/package.json`
- `frontend/web/tsconfig.json`（如适用）
- `frontend/web/src/` 最小目录结构
- `frontend/web/src/main.*` 或等效入口
- 必要时 `frontend/web/README.md`

模式 B（单层兼容）：

- `frontend/` 下的最小前端工程骨架
- `frontend/package.json`
- `frontend/tsconfig.json`（如适用）
- `frontend/src/` 最小目录结构
- `frontend/src/main.*` 或等效入口
- 必要时 `frontend/README.md`

输出内容至少覆盖：

- 最小启动入口
- 页面目录（`pages`）
- 组件目录（`components`）
- `services/api` 目录
- `stores` 目录
- `router` 目录
- `styles` 目录
- `types` 目录
- 与 HTML 高保真设计稿后续落地兼容的目录映射位

## Rules

执行时必须遵守：

- 必须优先遵循根 `AGENTS.md` 和 `frontend/AGENTS.md`
- 先创建工程骨架，再进入页面业务实现
- scaffold 阶段不要擅自实现复杂页面逻辑
- 在没有明确前端技术栈约束时，不要臆测框架，必须标记【待确认】
- 若 `frontend/` 已存在文件，不要直接覆盖，应先检查差异并谨慎补充
- 只创建前端最小可运行结构，不做无关扩展
- 不直接实现完整业务页面、复杂状态管理、真实接口联调
- 不越过 UI 设计文档边界
- API 层仅做占位封装，不落地业务接口细节
- 同一项目内目录命名与分层语义必须统一，避免 `api/` 与 `services/api/` 语义漂移

## Suggested Default Stack

默认建议技术栈：

- Vue 3 + TypeScript + Vite（优先）
- React + TypeScript + Vite（备选）

选择规则：

- 若 `frontend/AGENTS.md` 已明确框架，优先遵循
- 若无法确认二选一，必须标记【待确认】
- 若 OpenSpec 或冻结设计文档另有约束，以冻结基线为准

目录结构建议至少包括：

- `pages`
- `components`
- `services`
- `stores`
- `router`
- `styles`
- `utils`
- `types`

## Frontend Structure Guidance

建议结构（`<root>` 指 `frontend/web` 或 `frontend`）与职责如下：

- 入口文件（`<root>/src/main.ts` 或 `main.tsx`）：应用启动与全局依赖挂载
- `pages`：页面级路由入口，承接页面编排与布局
- `components/base`：基础 UI 组件（通用、无业务语义）
- `components/business`：业务复用组件（有业务语义、跨页面复用）
- `services/api`：请求封装与模块化 API 入口，避免页面直连 HTTP 客户端
- `stores`：全局状态管理（用户态、全局配置等）
- `router`：路由定义、守卫与页面映射
- `styles`：全局样式、变量与主题入口
- `utils`：通用工具函数与 helper
- `types`：跨模块类型定义（Result、DTO、路由元信息等）

与高保真稿衔接要求：

- 页面命名需与设计稿页面清单可映射
- 路由组织需与 `PAGE_FLOW.md` 主流程可对齐
- 组件拆分粒度应与 `UI_DESIGN_SPEC.md` 结构分区一致

## Steps

### 1. 读取项目基线、需求与 UI 设计约束

- 读取 `AGENTS.md`、`frontend/AGENTS.md`、OpenSpec、需求文档、UI 文档
- 提取框架、包管理、目录规范、页面流转与设计稿约束

### 2. 检查 `frontend/` 是否存在

- 判断目录是否存在
- 判断是否仅占位目录
- 判断是否已有构建文件与可启动入口

### 3. 判断是否创建或补齐骨架

- `create`：无工程，创建最小骨架
- `patch`：已有部分结构，按缺口补齐
- `skip`：已满足最小骨架，输出检查结果与建议

### 4. 创建 `package.json`

- 创建最小 scripts：`dev`、`build`、`preview`、`type-check`
- 注入框架最小依赖与开发依赖
- 遵循项目包管理约束（pnpm 或 npm）

### 5. 创建最小入口文件

- 创建 `src/main.ts`（或 `src/main.tsx`）
- 创建根组件 `App.vue`（或 `App.tsx`）
- 接入 router、store、全局样式

### 6. 创建基础目录结构

- 创建 `pages`、`components/base`、`components/business`
- 创建 `services/api`、`stores`、`router`
- 创建 `styles`、`utils`、`types`

### 7. 创建基础路由与页面占位

- 创建最小路由配置
- 创建至少一个占位页面（如 `dashboard`）
- 确保本地启动可进入占位页

### 8. 创建基础样式与类型目录

- 初始化 `styles` 入口文件（如 `styles/index.css`）
- 初始化公共类型（如 `types/common.ts`，包含 `Result<T>` 占位）

### 9. 输出结构说明与后续开发建议

- 输出已创建与补齐的结构清单
- 显式记录【待确认】与【冲突】项
- 给出后续建议：进入 `dev-implement`，按 `API_CONTRACT.md` 与 UI 设计文档实现业务

## Quality Gate

完成前必须满足：

- `frontend` 工程结构完整
- 至少具备最小可启动入口
- 构建文件存在（`package.json`）
- 基础目录存在（`pages/components/services/stores/router/styles/types`）
- 目录结构符合 `AGENTS.md` 与 `frontend/AGENTS.md` 规则
- 后续 `dev-implement` Skill 可直接继续开发
- 未越界实现完整业务页面

推荐验收动作（可执行时执行）：

- `pnpm dev` 或 `npm run dev` 可启动
- `pnpm build` 或 `npm run build` 可通过
- `pnpm type-check` 或 `npm run type-check` 可通过

## Example

场景：会员管理系统（Member Management）

已知输入：

- `openspec/project.md` 已存在
- `docs/01-requirements/MVP_SCOPE.md` 已存在
- `docs/01-requirements/PRD_RECTIFIED.md` 已存在
- `docs/02-design/UI_DESIGN_SPEC.md` 已存在

本 Skill 应执行：

1. 读取 `AGENTS.md` 与 `frontend/AGENTS.md`，确认技术栈与目录规则
2. 检查 `frontend/` 当前状态（仅占位或空目录）
3. 按模式 A（默认 `frontend/web`）或模式 B（单层 `frontend`）创建最小工程骨架
4. 创建入口文件、路由占位、页面占位、样式与类型目录
5. 输出结构说明，并提示后续进入 `dev-implement`

典型输出结构（模式 A 示例）：

```text
frontend/
├── AGENTS.md
└── web
    ├── package.json
    ├── tsconfig.json
    └── src
        ├── main.ts
        ├── App.vue
        ├── pages
        │   └── dashboard
        │       └── index.vue
        ├── components
        │   ├── base
        │   └── business
        ├── services
        │   └── api
        │       └── request.ts
        ├── stores
        ├── router
        │   └── index.ts
        ├── styles
        │   └── index.css
        ├── utils
        └── types
            └── common.ts
```

本阶段不应实现：

- 会员列表、会员详情、会员编辑等完整业务页面逻辑
- 复杂跨页状态协同与权限细粒度策略
- 真实后端接口联调与鉴权闭环
- 超出 UI 设计文档范围的业务扩展

完成定义：

- 达到“最小可启动 + 结构可扩展 + 规则可追溯”，再交由 `dev-implement` 开展业务开发。
