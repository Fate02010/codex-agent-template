---
name: qa-rectify
description: 基于 qa-review 输出的问题清单，以 ISSUE 编号为驱动逐条整改 TEST_PLAN.md 和 TEST_CASES.md，回写整改状态并冻结测试用例基线；不直接执行测试，整改完成后重新执行 qa-review 确认关闭。
---

# Skill: qa-rectify — 测试用例整改

## 触发条件

当 `qa-review` 已输出 `TEST_REVIEW_ISSUES.md` 且结论为 `不通过` 或 `有条件通过`，
需要在进入 `dev-implement` 前关闭测试设计问题时使用本 Skill。

以下场景不触发本 Skill：

- 首次设计测试用例（使用 `qa-design`）
- 尚未执行测试评审（使用 `qa-review`）
- 评审已通过、无需整改（直接进入 `dev-implement`）
- 需要执行测试并出具报告（使用 `qa-execute`）

## 输入

1. `docs/04-testing/TEST_REVIEW_ISSUES.md` — 测试用例评审问题清单（qa-review 输出）
2. `docs/04-testing/TEST_PLAN.md` — 现有测试计划
3. `docs/04-testing/TEST_CASES.md` — 现有测试用例
4. `docs/01-requirements/PRD_RECTIFIED.md` — 整改后的需求文档（已冻结）
5. `docs/03-architecture/ARCHITECTURE.md` — 架构设计（第 11 节序列图、第 12 节权限矩阵）
6. `docs/03-architecture/API_CONTRACT.md` — 接口契约（第 1 节全局约定）

## 输出

1. 更新后的 `docs/04-testing/TEST_CASES.md`
2. 更新后的 `docs/04-testing/TEST_PLAN.md`（如涉及计划层问题）
3. 回写整改状态后的 `docs/04-testing/TEST_REVIEW_ISSUES.md`

## 执行层级导读（Progressive Disclosure）

- `P0 必检（阻塞）`：输入文档可读、ISSUE 编号可追溯、所有阻塞问题已处置。
- `P1 扩展（覆盖）`：追溯链闭环、可执行性、规范一致性、整改状态回写完整。
- `P2 参考（说明）`：示例与说明文本仅作参考，不参与放行。
- 执行顺序必须为：先过 `P0 Gate`，再进入 `P1`；`P2` 不得覆盖 `P0` 结论。

## 执行流程

### 步骤 0：P0 Gate（阻塞）

- `TEST_REVIEW_ISSUES.md`、`TEST_PLAN.md`、`TEST_CASES.md` 必须存在且可读。
- `PRD_RECTIFIED.md` 必须存在且状态为 `已冻结`。
- `TEST_REVIEW_ISSUES.md` 必须包含至少一条待整改问题。
- 任一不满足时，结论必须为 `BLOCKED/FAIL`，告知用户先完成 `qa-review`。

### 步骤 1：解析问题清单，建立整改映射

读取 `TEST_REVIEW_ISSUES.md` 中所有问题，按优先级排序：

1. 🔴 阻塞（必须全部关闭才能进入 dev-implement）
2. 🟠 重要（建议关闭，否则标注残留风险）
3. 🟡 建议（可后续处理，记录处置方式即可）

对每条问题提取：
- 问题编号（ISSUE-NNN）
- 定位：文档章节路径（如 `TEST_CASES.md > 2. 用例清单 > TC-USER-001`）
- 整改建议
- 关联需求 / 接口 / 用例编号

### 步骤 2：逐条整改

按优先级从高到低，针对每条问题精准修改对应文档章节：

**整改规则：**
- 整改范围仅限评审问题所涉及的章节，不得扩展范围
- 使用标记注解变更内容：`【修改】` / `【新增】` / `【待确认】`
- 无法确认的内容标记 `【待确认】`，并在 `TEST_REVIEW_ISSUES.md` 中说明原因
- 不允许新增副本文件（如 TEST_CASES_RECTIFIED.md）

**按维度整改要点：**

| 问题维度 | 整改动作 |
|---|---|
| F → TC 追溯断链 | 在用例清单中补充对应 TC，关联 FNNN 需求编号 |
| 接口 → TC 覆盖缺口 | 补充接口测试用例，标注 API-XXX-NNN |
| 权限矩阵覆盖缺口 | 补充角色权限测试用例，覆盖 ARCHITECTURE.md 第 12 节角色-接口组合 |
| 序列图调用链覆盖缺口 | 补充调用链验证用例，覆盖 ARCHITECTURE.md 第 11 节关键写操作 |
| P0 用例步骤为空或无断言 | 补充具体步骤和可判定的预期结果（含 code/message/data/timestamp 验证点） |
| 用例描述模糊 | 改写步骤为可操作的具体动作，预期结果改写为可判定的断言 |
| 统一返回体断言缺失 | 在接口测试用例预期结果中补充外层结构 `code/message/data/timestamp` 验证要求 |
| TC 编号模块不一致 | 修正 TC 编号模块部分与关联接口/需求模块保持一致 |
| 测试代码映射表缺失或不完整 | 在 TEST_CASES.md 第 3 节补充或更新测试代码映射表 |
| 测试层级分级不合理 | 调整 P0/P1/P2/P3 优先级，异常流/边界值至少为 P1 |

### 步骤 3：回写整改状态

整改完成后，逐条更新 `TEST_REVIEW_ISSUES.md` 中每个问题的状态：

| 状态 | 含义 |
|---|---|
| 已整改 | 对应文档已按整改建议修改，可在 qa-review 中验证 |
| 待确认 | 整改内容存在不确定项，已标记 `【待确认】`，需用户决策 |
| 已关闭 | 经确认问题已消除（通常在重新 qa-review 后更新） |

同时更新 `TEST_REVIEW_ISSUES.md` 文档信息中的状态为 `已整改`。

### 步骤 4：不得冻结的条件

以下情况不得将 TEST_CASES.md 状态更新为 `已冻结`：

- 存在未关闭的 🔴 阻塞问题
- 任一 P0 用例步骤仍为空或预期结果无可判定断言
- 权限矩阵角色-接口组合仍缺测试用例
- `F → TC` 仍存在断链（功能点无对应用例）
- 存在影响开发的 `【待确认】` 标记项

### 步骤 5：提示下一步

整改完成后提示用户：

- 所有阻塞问题已整改：重新执行 `qa-review` 确认关闭，通过后进入 `dev-implement`
- 存在 `【待确认】` 项：告知用户需要确认的内容列表，确认后可继续整改或触发 `qa-review`
- 若需验证文档追溯完整性，可运行 `doc-check`

## Quality Gate（分层）

### P0 Gate（阻塞，最小必检）

- [ ] `TEST_REVIEW_ISSUES.md`、`TEST_PLAN.md`、`TEST_CASES.md`、`PRD_RECTIFIED.md` 均存在且可读。
- [ ] 所有 🔴 阻塞问题已处置（已整改或已关闭）。
- [ ] 无 P0 用例步骤为空或预期结果无可判定断言。
- [ ] 任一基线缺失或阻塞问题未关闭时，不得标记文档为 `已冻结`。

### P1 Coverage Checklist（扩展覆盖）

- [ ] 每个 PRD 功能点（FNNN）至少有一个对应 TC（`F → TC` 追溯完整）。
- [ ] 每个 API 接口至少有一个接口测试用例。
- [ ] ARCHITECTURE.md 第 12 节权限矩阵的角色-接口权限组合均有对应测试用例。
- [ ] 接口测试用例至少标注统一返回体外层结构验证要求。
- [ ] TC 编号模块部分与关联接口/需求模块一致。
- [ ] 测试代码映射表覆盖所有 TC 编号。
- [ ] `TEST_REVIEW_ISSUES.md` 中所有问题整改状态已回写。

### P2 Reference Checklist（参考）

- [ ] 示例与说明文本已更新，不改变 `P0` 判定口径。

## 注意事项

- `qa-rectify` 整改范围仅限评审问题所涉及的章节，不得扩展范围或新增无关用例
- 整改完成后必须重新执行 `qa-review` 验证关闭，不得跳过复检直接进入 `dev-implement`
- 存在 `【待确认】` 的内容不得标记为已关闭
- 整改必须精准定点修订，避免重新生成整个文档（区别于 `qa-design`）
- `qa-design` 负责从需求生成测试用例；`qa-rectify` 负责基于问题清单整改已有用例
