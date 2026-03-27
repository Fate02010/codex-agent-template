# AGENTS.md — 项目总规则

## 1. 项目概述

本项目是一个 Agent 驱动的开发模板工程，采用**文档驱动开发**模式。所有开发活动以文档为输入和输出，确保需求、设计、实现、测试全链路可追溯。

## 2. 工作主链

```
PRD 评审 → PRD 整改 → 方案设计 → 开发实现 → 测试验证
```

| 阶段 | Skill | 输入 | 输出 |
|---|---|---|---|
| PRD 评审 | `prd-review` | 原始 PRD | `docs/01-requirements/PRD_REVIEW_ISSUES.md` |
| PRD 整改 | `prd-rectify` | 评审问题清单 + 原始 PRD | `docs/01-requirements/PRD_RECTIFIED.md` |
| 方案设计 | `solution-design` | 整改后 PRD | `ARCHITECTURE.md` + `API_CONTRACT.md` + `DATA_MODEL.md` |
| 开发实现 | `dev-implement` | 整改后 PRD + 设计文档 | `backend/` 或 `frontend/` 下代码 |
| 测试验证 | `qa-design` | 整改后 PRD + `API_CONTRACT.md` + `DATA_MODEL.md` | `TEST_PLAN.md` + `TEST_CASES.md` |

## 3. 必读顺序

进入项目时，按以下顺序读取文档：

1. 本文件（`AGENTS.md`）— 了解项目总规则
2. `docs/01-requirements/PRD_RECTIFIED.md` — 了解业务需求
3. `docs/02-architecture/ARCHITECTURE.md` — 了解架构设计
4. `docs/02-architecture/API_CONTRACT.md` — 了解接口契约
5. `docs/02-architecture/DATA_MODEL.md` — 了解数据模型
6. 对应子目录的 `AGENTS.md` — 了解局部规范

## 4. 技术栈约束

### 后端

| 项目 | 技术选型 |
|---|---|
| 语言 | Java 17+ |
| 框架 | Spring Boot 3.x |
| ORM | MyBatis + MyBatis-Plus |
| 数据库 | MySQL 8.x |
| 缓存 | Redis |
| 代码规范 | 阿里巴巴 Java 开发手册 |

### 前端

| 项目 | 技术选型 |
|---|---|
| Web 端 | Vue 3 + Composition API + TypeScript |
| 小程序 | 微信小程序原生 / UniApp |
| 跨端方案 | UniApp |

### 文档格式

所有文档使用 Markdown 格式，存放于 `docs/` 目录下。

## 5. 变更规则

| 变更类型 | 必须先更新的文档 | 再修改的代码 |
|---|---|---|
| 接口变更 | `docs/02-architecture/API_CONTRACT.md` | 后端 Controller / 前端 API 调用 |
| 表结构变更 | `docs/02-architecture/DATA_MODEL.md` | 后端 Entity / Mapper |
| 业务规则变更 | `docs/01-requirements/PRD_RECTIFIED.md` | 对应业务代码 |
| 架构调整 | `docs/02-architecture/ARCHITECTURE.md` | 对应模块代码 |

**原则：先改文档，再改代码。文档是唯一事实来源。**

## 6. 质量门槛

- [ ] 代码编译通过，无 warning
- [ ] 单元测试通过
- [ ] 接口契约与实现一致
- [ ] 数据模型与实现一致
- [ ] 文档已同步更新

## 7. Skill 使用指引

| 任务场景 | 推荐 Skill |
|---|---|
| 拿到新 PRD，需要评审 | `prd-review` |
| PRD 评审完，需要整改 | `prd-rectify` |
| 需求明确，需要出设计方案 | `solution-design` |
| 设计完成，需要写代码 | `dev-implement` |
| 需要生成测试计划和用例 | `qa-design` |

## 8. 文档标记规范

所有文档中使用以下标记：

- 【新增】— 新增的内容
- 【修改】— 修改的内容
- 【删除】— 删除的内容
- 【待确认】— 需要确认的内容
- 【风险】— 存在风险的内容

## 9. 目录规则

- `AGENTS.md` 管目录级长期稳定约束
- `Skill` 管按任务触发的流程能力
- 不按角色拆 `AGENTS.md`，按目录拆
