---
name: qa-review
description: 在 qa-design 产出测试计划与用例后、dev-implement 开始前执行工程化评审，识别追溯断链、覆盖缺口、可执行性与规范问题并输出问题清单；不直接修改测试文档，评审结果作为 qa-design 修复迭代的输入。
---

# Skill: qa-review — 测试用例评审

## 触发条件

当 `qa-design` 已产出 `TEST_PLAN.md` 和 `TEST_CASES.md`，且需要在进入 `dev-implement` 前
做测试评审时使用本 Skill。

以下场景不触发本 Skill：

- 仍在编写测试用例（应先使用 `qa-design`）
- 已进入开发实现阶段（应使用 `backend-implement` / `frontend-implement`）
- 需要执行测试并出具报告（应使用 `qa-execute`）

## 输入

1. `docs/03-testing/TEST_PLAN.md` — 测试计划
2. `docs/03-testing/TEST_CASES.md` — 测试用例
3. `docs/01-requirements/PRD_RECTIFIED.md` — 整改后的需求文档（已冻结）
4. `docs/02-architecture/ARCHITECTURE.md` — 架构设计（第 11 节序列图、第 12 节权限矩阵）
5. `docs/02-architecture/API_CONTRACT.md` — 接口契约（第 1 节全局约定）

## 输出

- `docs/03-testing/TEST_REVIEW_ISSUES.md` — 测试用例评审问题清单

## 执行层级导读（Progressive Disclosure）

- `P0 必检（阻塞）`：输入文档可读、追溯关系可判定、P0 用例存在。
- `P1 扩展（覆盖）`：追溯完整性、权限矩阵覆盖、可执行性、全局约定断言、规范一致性完整。
- `P2 参考（说明）`：模板、示例与说明文本仅作参考，不参与放行。
- 执行顺序必须为：先过 `P0 Gate`，再进入 `P1`；`P2` 不得覆盖 `P0` 结论。

## 执行流程

### 步骤 0：P0 Gate（阻塞）

- `TEST_PLAN.md` 和 `TEST_CASES.md` 必须存在且可读。
- `PRD_RECTIFIED.md` 必须存在且状态为 `已冻结`。
- `ARCHITECTURE.md` 必须存在。
- `TEST_CASES.md` 必须包含"2. 用例清单"和"3. TC 与测试代码绑定规则"章节。
- 任一不满足时，结论必须为 `BLOCKED/FAIL`，并返回 `qa-design`。

### 步骤 1：建立需求-测试追溯映射

基于 `PRD_RECTIFIED.md` 与 `TEST_CASES.md` 建立以下映射：

- `F → TC`：每个功能点是否有对应测试用例
- `API → TC`：每个接口是否有对应接口测试用例
- `角色（ARCHITECTURE.md 第 12 节）→ TC`：每个角色的接口权限是否有对应用例

优先标记以下情况为高风险：

- 功能点存在但无任何 TC
- 接口存在但无接口测试用例
- 权限矩阵中的角色-接口组合无对应权限测试用例
- TC 无法回链到 FNNN

### 步骤 2：逐维度审查

按以下维度逐项检查，记录发现的问题：

| 评审维度 | 检查要点 |
|---|---|
| F → TC 追溯完整性 | 每个 PRD 功能点（FNNN）是否至少有一个对应测试用例？TC 编号是否可回链需求？ |
| 接口 → TC 覆盖 | 每个 API_CONTRACT.md 接口是否有对应接口测试用例？ |
| 权限矩阵覆盖 | ARCHITECTURE.md 第 12 节每个角色-接口权限组合是否有对应角色权限测试用例？ |
| 序列图调用链覆盖 | ARCHITECTURE.md 第 11 节关键写操作流程是否有对应调用链验证用例？ |
| P0 冒烟完整性 | P0 用例是否覆盖所有核心主流程？是否存在空步骤或无断言的 P0 用例？ |
| 用例可执行性 | 测试步骤是否具体可操作？预期结果是否包含可判定的断言（非"正常显示"等模糊表述）？ |
| 统一返回体断言 | 接口测试用例的预期结果是否标注外层结构 `code/message/data/timestamp` 的验证点？ |
| TC 编号规范 | TC 编号的模块部分是否与关联接口/需求的模块部分一致（TC-USER-001 关联 API-USER-001）？ |
| 测试代码映射 | TEST_CASES.md 第 3 节测试代码映射表中每个 TC 是否有对应的测试类/文件/方法？ |
| 测试层级合理性 | P0/P1/P2/P3 分级是否合理？异常流/边界值是否至少为 P1？幂等重复提交是否已覆盖？ |

### 步骤 3：问题分类与定级

对每个问题进行分类和定级：

| 级别 | 含义 | 处理要求 |
|---|---|---|
| 🔴 阻塞 | 无法进入开发实现或 qa-execute | 必须修复后重新评审 |
| 🟠 重要 | 影响测试质量或追溯完整性，可在短期收敛 | 建议在 qa-design 修复后关闭 |
| 🟡 建议 | 优化项，不影响当前主链推进 | 可后续迭代处理 |

以下情况直接判定为 `🔴 阻塞`：

1. 任一 PRD 功能点（FNNN）无对应 TC（`F → TC` 断链）
2. 任一 P0 用例步骤为空或预期结果无可判定断言
3. 任一 P0 用例缺失主流程覆盖
4. ARCHITECTURE.md 第 12 节权限矩阵存在角色-接口组合，但无对应权限测试用例
5. 接口测试用例预期结果完全未提及返回体结构验证（统一返回体断言全部缺失）
6. TC 编号模块与关联接口/需求模块不一致（如 TC-USER-001 关联 API-ORDER-001）
7. TEST_CASES.md 缺少"3. TC 与测试代码绑定规则"章节或映射表为空

### 步骤 4：输出问题清单

将所有问题写入 `docs/03-testing/TEST_REVIEW_ISSUES.md`：

```markdown
# 测试用例评审问题清单

## 文档信息
- 文档类型：产物
- 生成 Skill：`qa-review`
- 上游输入：`TEST_PLAN.md`、`TEST_CASES.md`、`PRD_RECTIFIED.md`、`ARCHITECTURE.md`、`API_CONTRACT.md`
- 版本：v1.0
- 日期：YYYY-MM-DD
- 状态：评审中 / 已整改 / 已关闭

## 评审范围
- 评审日期：YYYY-MM-DD
- 测试计划：`docs/03-testing/TEST_PLAN.md`
- 测试用例：`docs/03-testing/TEST_CASES.md`
- 需求基线：`docs/01-requirements/PRD_RECTIFIED.md`
- 架构基线：`docs/02-architecture/ARCHITECTURE.md`

## 总体结论
- 评审结论：[通过 / 有条件通过 / 不通过]
- 是否允许进入 dev-implement：[是 / 否]
- 结论说明：

## 问题统计
| 级别 | 数量 |
|---|---|
| 🔴 阻塞 | N |
| 🟠 重要 | N |
| 🟡 建议 | N |

## 问题清单

### 🔴 阻塞问题

#### ISSUE-001: [问题标题]
- **定位**：文档章节路径（如：`TEST_CASES.md > 2. 用例清单 > TC-USER-001`）
- **问题描述**：具体说明问题
- **影响**：对开发实现、测试执行的具体影响
- **整改建议**：如何在 qa-design 中修复
- **关联需求 / 接口 / 用例**：`F001` / `API-USER-001` / `TC-USER-001`
- **整改状态**：待整改 / 已整改 / 已关闭
- **整改说明**：

### 🟠 重要问题
...

### 🟡 建议事项
...

## 阻塞项汇总
| 问题编号 | 阻塞原因 | 阻塞下游阶段 | 建议动作 |
|---|---|---|---|

## 评审结论与下一步建议
- 存在阻塞问题时：返回 `qa-design` 修复后重新执行 `qa-review`
- 无阻塞问题时：可进入 `dev-implement`（`backend-implement` / `frontend-implement`）
- 建议在修复完成后使用 `doc-check` 验证追溯链完整性

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
| v1.0 | YYYY-MM-DD | 初始评审 |
```

评审结论口径：

| 结论 | 条件 |
|---|---|
| 通过 | 无阻塞和重要问题，允许直接进入 `dev-implement` |
| 有条件通过 | 无阻塞问题，有重要问题但不影响开发推进 |
| 不通过 | 有阻塞问题，必须返回 `qa-design` 修复后重新评审 |

### 步骤 5：提示下一步

评审完成后提示用户：

- 通过/有条件通过：进入 `dev-implement` → `backend-implement` / `frontend-implement`
- 不通过：返回 `qa-design` 修复阻塞问题，修复完成后重新执行 `qa-review`
- 若需验证文档追溯完整性，可运行 `doc-check`

## Quality Gate（分层）

### P0 Gate（阻塞，最小必检）

- [ ] `TEST_PLAN.md`、`TEST_CASES.md`、`PRD_RECTIFIED.md`、`ARCHITECTURE.md` 均存在且可读。
- [ ] `TEST_CASES.md` 包含"2. 用例清单"和"3. TC 与测试代码绑定规则"章节。
- [ ] `PRD_RECTIFIED.md` 状态为 `已冻结`。
- [ ] 任一基线缺失或不可读时，评审结论必须为 `BLOCKED/FAIL`。

### P1 Coverage Checklist（扩展覆盖）

- [ ] 每个 PRD 功能点（FNNN）至少有一个对应 TC（`F → TC` 追溯完整）。
- [ ] 每个 API 接口至少有一个接口测试用例。
- [ ] ARCHITECTURE.md 第 12 节权限矩阵的角色-接口权限组合均有对应测试用例。
- [ ] ARCHITECTURE.md 第 11 节序列图关键写操作有对应调用链验证用例。
- [ ] 所有 P0 用例步骤具体、预期结果包含可判定断言。
- [ ] 接口测试用例至少标注统一返回体外层结构验证要求。
- [ ] TC 编号模块部分与关联接口/需求模块一致。
- [ ] 测试代码映射表覆盖所有 TC 编号。

### P2 Reference Checklist（参考）

- [ ] 示例与说明文本已更新，不改变 `P0` 判定口径。

## 注意事项

- `qa-review` 只输出问题清单，不直接修改 `TEST_PLAN.md` / `TEST_CASES.md`
- 问题修复由 `qa-design` 重新执行完成，修复后需重新执行 `qa-review` 确认关闭
- 每个问题必须给出定位、影响和整改建议，不能只写"用例不足"
- 对权限矩阵覆盖缺口和 P0 用例缺失，默认按 `🔴 阻塞` 处理
- `qa-review` 聚焦测试设计质量与追溯完整性；`qa-execute` 聚焦实际测试执行结果
