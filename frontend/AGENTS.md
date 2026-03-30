# frontend/AGENTS.md — 前端实现规范

## 1. 技术栈

| 平台 | 技术选型 |
|---|---|
| 后台管理 Web | Vue 3 + Composition API + TypeScript + Element Plus |
| 微信小程序 | 原生小程序 / UniApp |
| 跨端方案 | UniApp（同时支持 H5、微信小程序、App） |
| 状态管理 | Pinia |
| 构建工具 | Vite |
| 包管理 | pnpm / npm |
| HTTP 请求 | axios（Web）/ uni.request（UniApp） |

> 后台管理端默认强制使用 Element Plus，不使用其他 UI 组件库作为默认脚手架。

## 2. 目录结构

### 2.1 后台管理 Web（默认）

```text
frontend/
└── <project-name>/
    └── web/
        ├── src/
        │   ├── api/
        │   ├── assets/
        │   ├── components/
        │   │   ├── base/
        │   │   └── business/
        │   ├── composables/
        │   ├── layouts/
        │   ├── pages/
        │   ├── router/
        │   ├── stores/
        │   ├── types/
        │   └── utils/
        ├── public/
        ├── index.html
        └── package.json
```

### 2.2 UniApp（按需）

```text
frontend/
└── <project-name>/
    └── uniapp/
        ├── src/
        │   ├── api/
        │   ├── components/
        │   ├── pages/
        │   ├── static/
        │   ├── stores/
        │   ├── types/
        │   ├── utils/
        │   ├── App.vue
        │   ├── main.ts
        │   ├── manifest.json
        │   └── pages.json
        └── package.json
```

### 2.3 原生微信小程序（按需）

```text
frontend/
└── <project-name>/
    └── miniprogram/
        ├── app.js
        ├── app.json
        ├── app.wxss
        ├── pages/
        └── project.config.json
```

## 3. 组件规范

### 3.1 组件分类

| 类型 | 存放位置 | 说明 |
|---|---|---|
| 基础组件 | `components/base/` | 按钮、输入框、表格封装等基础 UI |
| 业务组件 | `components/business/` | 带业务语义的可复用组件 |
| 页面组件 | `pages/模块/index.vue` | 路由入口页面 |
| 页面私有组件 | `pages/模块/components/` | 仅在该页面使用 |

### 3.2 组件命名

- 文件名使用 PascalCase：`MemberTable.vue`、`PointsPanel.vue`
- 基础组件加 `Base` 前缀：`BaseButton.vue`、`BaseDialog.vue`
- 页面组件使用 `index.vue`

### 3.3 组件编写原则

- 使用 `<script setup lang="ts">`
- Props 使用 `defineProps<T>()`
- Emits 使用 `defineEmits<T>()`
- 组件单一职责，一个组件只做一件事

## 4. Element Plus 规范（强制）

- 后台管理端页面组件默认使用 Element Plus 组件（`el-table`、`el-form`、`el-dialog` 等）
- 不得在同一项目中混用多套管理端组件体系
- 全局注册和主题变量必须统一在入口与样式层维护
- 业务组件可二次封装 Element Plus，但禁止在页面内大量重复样板代码

## 5. 状态管理

### 5.1 使用 Pinia

- 全局状态（用户信息、Token、权限）放 `stores/`
- 页面级状态用组件内 `ref` / `reactive`
- Store 按模块拆分：`useUserStore`、`useMemberStore`

### 5.2 状态划分原则

| 状态类型 | 管理方式 | 示例 |
|---|---|---|
| 全局共享 | Pinia Store | 用户信息、Token、系统配置 |
| 页面级 | 组件内 ref/reactive | 表单数据、筛选条件 |
| 组件内部 | 组件内 ref/reactive | 弹窗开关、加载状态 |

## 6. 接口对接规范

### 6.1 API 封装

- 按模块拆分 API：`api/member.ts`、`api/points.ts`
- 统一使用封装后的请求函数，不直接调用 axios
- 请求和响应类型必须使用 TypeScript

### 6.2 请求封装

- 统一拦截器处理 Token 注入、错误码处理、登录过期跳转
- 统一返回体与后端 `Result<T>` 对齐
- 网络异常统一提示

### 6.3 错误处理

- 业务错误（code !== 0）：展示后端返回 message
- 网络错误（HTTP 4xx/5xx）：统一错误提示
- 登录过期（401）：自动跳转登录页

## 7. 与后端接口边界

- 前端调用仅走外部接口：`/api/v1/**`
- 禁止前端调用内部微服务接口：`/internal/v1/**`
- 新增页面需要接口时，先更新 `API_CONTRACT.md` 再开发

## 8. 质量要求

| 检查项 | 工具 |
|---|---|
| 代码规范 | ESLint |
| 类型检查 | TypeScript strict mode |
| 格式化 | Prettier |
| 构建检查 | `vite build` 无报错 |

## 9. 禁止事项

- 禁止在页面组件中直接调用 axios / uni.request（必须走 api 层）
- 禁止跨模块直接修改其他模块 Store
- 禁止使用 `any` 类型（必须定义明确类型）
- 禁止在模板中写复杂逻辑（提取到 composable 或 computed）
- 禁止绕过 Element Plus 自建不一致的后台管理基础组件体系
