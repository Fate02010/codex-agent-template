---
name: prototype-check
description: 检查高保真 HTML 原型是否出现变形、溢出、断点错位和跳转异常，并输出可追溯检查报告。
---

# Skill: prototype-check — 原型防变形检查

## Purpose

对已生成原型执行结构化质检，避免“页面变形但仍进入开发”的问题。

## When to Use

- `ui-design-spec` 产出原型后立即执行
- 增量迭代中页面改版后执行
- 进入 `dev-implement` 前做最后可视化校验

## Inputs

1. `docs/02-design/UI_DESIGN_SPEC.md`
2. `docs/02-design/PAGE_FLOW.md`
3. `docs/02-design/SCREEN_INVENTORY.md`
4. 原型目录：`frontend/design-prototype/` 或 `docs/02-design/prototype/`
5. 基线截图或基线原型（如有）

## Output

- `docs/02-design/PROTOTYPE_CHECK_REPORT.md`

## 检查范围

1. 页面尺寸与布局
2. 组件溢出与遮挡
3. 字体与间距一致性
4. 断点表现（桌面宽度优先，必要时补移动宽度）
5. 页面跳转与主流程连通性
6. 空态/异常态展示

## 执行流程

### 步骤 1：确定检查清单

按页面生成检查编号：`PC-模块-NNN`。

### 步骤 2：逐页检查

每页至少检查：

- 容器是否拉伸变形
- 表格/表单是否溢出
- 弹窗/抽屉是否遮挡异常
- 关键按钮和标签是否错位

### 步骤 3：流程跳转检查

按 `PAGE_FLOW.md` 验证核心路径可达且无死链。

### 步骤 4：断点检查

至少检查桌面宽度（1366/1440）；若文档要求移动端，再补 375。

### 步骤 5：输出报告

报告必须包含：

- 检查范围与环境
- 按页面的问题明细
- 严重级别（阻塞/一般/建议）
- 结论（PASS / PASS WITH RISK / FAIL）

## 结论规则

- 出现阻塞级问题：结论 `FAIL`，不得进入 `dev-implement`
- 无阻塞但有一般问题：`PASS WITH RISK`
- 无问题：`PASS`

## 注意事项

- 本 Skill 不修改业务代码，只输出检查结论与修正建议。
- 报告中问题条目必须可定位到页面和具体组件。
