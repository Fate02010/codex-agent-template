# Skill: qa-design — 测试设计

## 触发条件

当需求和设计基线已稳定，需要在开发前预分配可追溯的测试编号与测试范围时使用。通常在 `solution-design` 完成后、`dev-implement` 之前触发；如增量迭代扩大范围，可再次执行补充用例。

## 输入

1. `docs/01-requirements/PRD_RECTIFIED.md` — 整改后的需求文档
2. `docs/02-architecture/API_CONTRACT.md` — 接口契约
3. `docs/02-architecture/DATA_MODEL.md` — 数据模型
4. `tests/AGENTS.md` — 测试规范

## 输出

1. `docs/03-testing/TEST_PLAN.md` — 测试计划
2. `docs/03-testing/TEST_CASES.md` — 测试用例

## 执行流程

### 步骤 1：读取输入文档

按以下顺序读取：

1. `tests/AGENTS.md` — 理解测试规范和模板要求
2. `docs/01-requirements/PRD_RECTIFIED.md` — 理解业务需求
3. `docs/02-architecture/API_CONTRACT.md` — 理解接口设计
4. `docs/02-architecture/DATA_MODEL.md` — 理解数据结构

### 步骤 2：输出测试计划（TEST_PLAN.md）

```markdown
# 测试计划

## 文档信息
- 文档类型：产物
- 生成 Skill：`qa-design`
- 上游输入：`PRD_RECTIFIED.md`、`API_CONTRACT.md`、`DATA_MODEL.md`
- 版本：v1.0
- 日期：YYYY-MM-DD
- 状态：草稿 / 已冻结
- 关联需求：PRD_RECTIFIED.md

## 1. 测试目标
验证系统功能是否满足 PRD_RECTIFIED.md 中定义的所有需求。

## 2. 测试范围
### 2.1 在范围内
| 模块 | 关联需求 | 测试类型 |
|---|---|---|

### 2.2 不在范围内
列出本轮不测试的内容及原因。

## 3. 测试策略
### 3.1 测试层级
| 层级 | 工具 | 覆盖目标 |
|---|---|---|
| 单元测试 | JUnit 5 + Mockito | Domain Service 核心逻辑 |
| 集成测试 | SpringBootTest | Application Service 编排 |
| 接口测试 | MockMvc / Postman | REST API 端到端 |
| 前端测试 | Vitest / Cypress | 组件测试、E2E |

### 3.2 执行顺序
1. 冒烟测试（P0）
2. 主流程测试（P1）
3. 异常流测试（P1-P2）
4. 边界值测试（P2-P3）

## 4. 测试环境
| 环境 | 说明 |
|---|---|
| 数据库 | MySQL 8.x 测试库 |
| 缓存 | Redis 测试实例 |
| 应用 | 本地 / 测试服务器 |

## 5. 准入/准出标准
### 准入
- 代码编译通过
- 设计文档已冻结
- 测试环境就绪

### 准出
- P0 用例 100% 通过
- P1 用例 ≥ 95% 通过
- 无致命和严重缺陷遗留
- 测试报告已输出

## 6. 风险与应对
| 风险 | 影响 | 应对措施 |
|---|---|---|

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

### 步骤 3：输出测试用例（TEST_CASES.md）

按 `tests/AGENTS.md` 中的用例模板，为每个功能点生成测试用例：

```markdown
# 测试用例

## 文档信息
- 文档类型：产物
- 生成 Skill：`qa-design`
- 上游输入：`TEST_PLAN.md`、`PRD_RECTIFIED.md`、`API_CONTRACT.md`
- 版本：v1.0
- 日期：YYYY-MM-DD
- 状态：草稿 / 已冻结
- 关联需求：PRD_RECTIFIED.md

## 用例统计
| 优先级 | 数量 |
|---|---|
| P0（冒烟） | N |
| P1（核心） | N |
| P2（一般） | N |
| P3（边界） | N |

## 模块：[模块名]

### TC-XXX-001: [用例标题]
- **关联需求**：F001
- **关联接口**：API-XXX-001
- **优先级**：P0
- **前置条件**：
  - 条件 1
  - 条件 2
- **测试步骤**：
  1. 步骤 1
  2. 步骤 2
  3. 步骤 3
- **预期结果**：
  - 验证点 1
  - 验证点 2
- **实际结果**：—
- **状态**：—
```

**编号约束**：TC 编号的模块部分必须与关联接口的模块部分一致：
- 正确：TC-USER-001 关联 API-USER-001
- 错误：TC-USER-001 关联 API-ORDER-001

### 步骤 4：用例覆盖检查

按 `tests/AGENTS.md` 中的覆盖要求，确保每个功能点至少覆盖：

| 场景 | 是否覆盖 |
|---|---|
| 主流程（正常路径） | ✅ |
| 异常流（参数错误、权限不足、数据不存在） | ✅ |
| 边界值（最大值、最小值、空值、特殊字符） | ✅ |
| 权限（不同角色） | ✅ |
| 幂等性（重复提交） | ✅ |

### 步骤 5：生成测试代码骨架映射表

为每个 TC 生成对应的测试代码位置和方法签名建议，确保 TC 编号与测试代码强绑定：

```markdown
## 测试代码映射表

| TC 编号 | 测试类/文件 | 方法/描述 | 层级 |
|---|---|---|---|
| TC-USER-001 | `UserTest.java` | `tc_user_001_createUserSuccess()` | 单元测试 |
| TC-USER-002 | `UserTest.java` | `tc_user_002_createUserWithEmptyName()` | 单元测试 |
| TC-USER-003 | `UserApiTest.java` | `tc_user_003_registerApi()` | 接口测试 |
| TC-USER-004 | `user.test.ts` | `it('TC-USER-004: ...')` | 前端测试 |
```

此映射表追加到 `TEST_CASES.md` 末尾，作为 `dev-implement` 和 `qa-execute` 的参照。

### 步骤 6：交叉验证

- [ ] 每个 PRD 功能点都有对应的测试用例
- [ ] 每个接口都有对应的接口测试用例
- [ ] P0 用例覆盖所有冒烟路径
- [ ] 用例编号连续、唯一
- [ ] 用例格式符合 tests/AGENTS.md 模板
- [ ] TC 编号模块部分与关联接口模块部分一致
- [ ] 每个 TC 编号在映射表中都有对应的测试代码位置
- [ ] 映射表中的方法名符合 `tests/AGENTS.md` § 3.1 的命名规范
- [ ] `TEST_PLAN.md` 与 `TEST_CASES.md` 文档信息状态均已更新为`已冻结`

### 步骤 7：提示结果

输出完成后告知用户：
- 测试计划、用例和代码映射表已生成
- 开发实现时，须按映射表中的类名和方法名编写测试代码，不得自行变更 TC 编号
- 下一步进入开发实现（`dev-implement`），测试执行在代码完成后使用 `qa-execute`

## 注意事项

- 用例必须关联需求编号和接口编号，确保可追溯
- 不测试未在 PRD 中定义的功能
- 异常场景的预期结果必须包含具体的错误码和提示信息
- 用例步骤要具体可执行，不能写"输入正确的参数"这样的模糊描述
- `qa-design` 负责分配 TC 编号和测试代码映射，`dev-implement` 负责按该映射实现测试代码
