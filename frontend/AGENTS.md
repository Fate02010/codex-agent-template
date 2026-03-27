# frontend/AGENTS.md — 前端实现规范

## 1. 技术栈

| 平台 | 技术选型 |
|---|---|
| Web 端 | Vue 3 + Composition API + TypeScript |
| 微信小程序 | 原生小程序 / UniApp |
| 跨端方案 | UniApp（同时支持 H5、微信小程序、App） |
| 状态管理 | Pinia |
| 构建工具 | Vite |
| 包管理 | pnpm / npm |
| HTTP 请求 | axios（Web）/ uni.request（UniApp） |

## 2. 目录结构

### Vue 3 Web 项目

```
frontend/web/
├── src/
│   ├── api/              # 接口请求封装（按模块拆分）
│   ├── assets/           # 静态资源（图片、字体、样式）
│   ├── components/       # 通用组件（跨页面复用）
│   ├── composables/      # 组合式函数（可复用逻辑）
│   ├── layouts/          # 布局组件
│   ├── pages/            # 页面组件（一个路由一个文件夹）
│   │   └── user/
│   │       ├── index.vue
│   │       └── components/  # 页面级私有组件
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   ├── types/            # TypeScript 类型定义
│   └── utils/            # 工具函数
├── public/
└── index.html
```

### UniApp 项目

```
frontend/uniapp/
├── src/
│   ├── api/              # 接口请求封装
│   ├── components/       # 通用组件
│   ├── pages/            # 页面
│   ├── static/           # 静态资源
│   ├── stores/           # Pinia 状态管理
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── App.vue
│   ├── main.ts
│   ├── manifest.json     # UniApp 配置
│   ├── pages.json        # 页面路由配置
│   └── uni.scss          # 全局样式变量
└── package.json
```

## 3. 组件规范

### 3.1 组件分类

| 类型 | 存放位置 | 说明 |
|---|---|---|
| 基础组件 | `components/base/` | 按钮、输入框等基础 UI，无业务逻辑 |
| 业务组件 | `components/business/` | 带业务逻辑的可复用组件 |
| 页面组件 | `pages/模块/index.vue` | 路由入口页面 |
| 页面私有组件 | `pages/模块/components/` | 仅在该页面使用的组件 |

### 3.2 组件命名

- 文件名使用 PascalCase：`UserCard.vue`、`OrderList.vue`
- 基础组件加 `Base` 前缀：`BaseButton.vue`、`BaseInput.vue`
- 页面组件使用 `index.vue`

### 3.3 组件编写原则

- 使用 `<script setup lang="ts">` 语法
- Props 使用 `defineProps<T>()` 定义类型
- Emits 使用 `defineEmits<T>()` 定义类型
- 组件单一职责，一个组件只做一件事

## 4. 状态管理

### 4.1 使用 Pinia

- 全局状态（用户信息、Token、权限）放 `stores/`
- 页面级状态用组件内 `ref` / `reactive` 管理，不放 Store
- Store 按模块拆分：`useUserStore`、`useOrderStore`

### 4.2 状态划分原则

| 状态类型 | 管理方式 | 示例 |
|---|---|---|
| 全局共享 | Pinia Store | 用户信息、Token、系统配置 |
| 页面级 | 组件内 ref/reactive | 表单数据、列表筛选条件 |
| 组件内部 | 组件内 ref/reactive | 弹窗开关、输入状态 |

## 5. 接口对接规范

### 5.1 API 封装

- 按模块拆分 API 文件：`api/user.ts`、`api/order.ts`
- 统一使用封装后的请求函数，不直接调用 axios / uni.request
- 请求和响应类型必须用 TypeScript 定义

```typescript
// api/user.ts
import { request } from '@/api/request'
import type { CreateUserRequest, UserResponse } from '@/types/user'

export function createUser(data: CreateUserRequest): Promise<Result<UserResponse>> {
  return request.post('/api/v1/users', data)
}
```

### 5.2 请求封装

- 统一拦截器处理 Token 注入、错误码处理、登录过期跳转
- 统一返回体类型与后端 `Result<T>` 对齐
- 网络异常统一提示

### 5.3 错误处理

- 业务错误（code !== 0）：展示后端返回的 message
- 网络错误（HTTP 4xx/5xx）：统一错误提示
- 登录过期（401）：自动跳转登录页

## 6. 质量要求

| 检查项 | 工具 |
|---|---|
| 代码规范 | ESLint |
| 类型检查 | TypeScript strict mode |
| 格式化 | Prettier |
| 构建检查 | `vite build` 无报错 |

## 7. 微信小程序特殊规范

- 遵循微信小程序官方组件和 API 规范
- 分包加载：主包控制在 2MB 以内
- 敏感数据（手机号、支付）走后端接口，不在前端处理
- 小程序码、分享等能力按官方文档接入

## 8. 禁止事项

- 禁止在页面组件中直接调用 axios / uni.request（必须走 api 层）
- 禁止将 Token 明文存储在 localStorage（小程序用 storage 加密存储）
- 禁止跨模块直接修改其他模块的 Store 状态
- 禁止使用 `any` 类型（必须定义明确类型）
- 禁止在模板中写复杂逻辑（提取到 composable 或 computed）
