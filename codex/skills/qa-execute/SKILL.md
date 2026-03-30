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

## 执行流程

### 1. 读取计划与用例

按 `TEST_PLAN.md` 执行顺序和 `TEST_CASES.md` 用例列表准备执行。

### 2. 执行后端测试

- 单元测试：`mvn test`
- 集成测试：`mvn verify -Dspring.profiles.active=test`

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
