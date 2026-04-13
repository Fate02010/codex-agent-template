---
name: qa-execute
description: 执行真实测试并回写报告；若失败则强制进入 defect-fix 与回归闭环。
---

# Skill: qa-execute — 测试执行

## 触发条件

当 `TEST_PLAN.md` 和 `TEST_CASES.md` 已就绪，且代码实现已完成时使用。

## 输入

1. `docs/03-testing/TEST_PLAN.md`
2. `docs/03-testing/TEST_CASES.md`
3. `backend/` 代码
4. `frontend/` 代码
5. `tests/AGENTS.md`

## 输出

1. `docs/03-testing/TEST_REPORT.md`
2. 更新后的 `docs/03-testing/TEST_CASES.md`

## 执行规则

1. 本 Skill 不补造上游业务输入；缺失关键输入时必须输出 `BLOCKED` 并回退上游阶段。
2. 允许在输入缺失时创建或更新 `TEST_REPORT.md`，用于记录阻塞结论与回退建议。
3. 若 `TEST_PLAN.md` 或 `TEST_CASES.md` 缺失，不得执行测试命令。

## 执行流程

### 0. 前置校验与阻塞回写

- 检查 `TEST_PLAN.md` 与 `TEST_CASES.md` 是否存在且可读取。
- 若任一缺失：
  - 生成或更新 `docs/03-testing/TEST_REPORT.md`。
  - 写入结论：`BLOCKED`。
  - 写入缺失输入清单、影响范围、回退建议（回到 `qa-design`）。
  - 终止后续测试执行步骤。

阻塞报告最小结构：

```markdown
# 测试报告

## 文档信息
- 文档类型：产物
- 生成 Skill：`qa-execute`
- 上游输入：`TEST_PLAN.md`、`TEST_CASES.md`、代码基线
- 版本：vX.Y
- 日期：YYYY-MM-DD
- 状态：草稿

## 1. 执行结论
- 结论：BLOCKED
- 原因：测试计划或测试用例缺失

## 2. 缺失输入

## 3. 影响范围

## 4. 回退建议
- 回退阶段：`qa-design`

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

### 1. 读取计划与用例

按 `TEST_PLAN.md` 执行顺序和 `TEST_CASES.md` 用例列表准备执行。

### 2. 执行后端测试

按工程骨架判断构建工具，执行对应命令：
- **Maven**（存在 `pom.xml`）：`mvn test`（单元测试）/ `mvn verify -Dspring.profiles.active=test`（集成测试）
- **Gradle**（存在 `build.gradle`）：`./gradlew test`（单元测试）/ `./gradlew integrationTest`（集成测试，按项目配置）
- 若工程中同时存在两种构建文件，以 `ARCHITECTURE.md` 构建工具基线章节为准

若依赖不可用（如 MySQL/Redis），记录为 BLOCKED。

### 3. 执行前端测试

- 组件/单测：`vitest run`（或项目等效命令）

### 4. TC 映射校验

校验测试代码中的 TC 编号与 `TEST_CASES.md` 一致：

- `@DisplayName("TC-...")`
- `it('TC-...', ...)`

### 5. 回写报告

写入 `TEST_REPORT.md`：

- 执行统计
- 失败用例
- 阻塞项
- 风险项
- 准出结论（Go / No-Go）

### 6. 失败闭环规则（强制）

- 若存在失败或阻塞缺陷，必须进入 `defect-fix`
- 修复后重新执行 `qa-execute`
- 直到满足准出标准或用户明确终止

## 注意事项

- 本阶段只执行测试并更新测试文档，不修改业务源代码。
- 若工程骨架缺失（无 `pom.xml` / `package.json`），报告必须标注阻塞并回到初始化阶段。
