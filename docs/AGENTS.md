# docs/AGENTS.md — 文档规范

## 1. 总则

本项目采用文档驱动开发，文档既是输入也是输出。所有文档以冻结后的版本为准，不脑补业务。

> **模板说明**：`docs/` 目录下的文件是**仓库预置模板**，不是已完成的 Skill 产出。每份模板文件的"文档信息"区域标注了文档类型（模板/产物）、生成 Skill 和当前状态。首次执行对应 Skill 后，模板内容将被真实产物覆盖。

## 2. 目录结构

```
docs/
├── AGENTS.md                      # 本文件：文档规范
├── DOC_CHECK_REPORT.md            # 文档追溯性校验报告
├── 00-research/                   # 调研与澄清文档
│   ├── RESEARCH_SUMMARY.md        # 需求调研摘要
│   └── REQUIREMENTS_CLARIFIED.md  # 需求澄清记录
├── 01-requirements/               # 需求文档
│   ├── PRD_RAW.md                 # 原始 PRD（由 prd-compose 编写）
│   ├── PRD_REVIEW_ISSUES.md       # PRD 评审问题清单
│   └── PRD_RECTIFIED.md           # 整改后 PRD（冻结基线）
├── 02-architecture/               # 设计文档
│   ├── ARCHITECTURE.md            # 架构设计（冻结）
│   ├── API_CONTRACT.md            # 接口契约（严格冻结）
│   └── DATA_MODEL.md              # 数据模型（严格冻结）
└── 03-testing/                    # 测试文档
    ├── TEST_PLAN.md               # 测试计划
    ├── TEST_CASES.md              # 测试用例
    ├── TEST_REPORT.md             # 测试报告
    └── DEFECT_LOG.md              # 缺陷记录
```

## 3. 文档命名规范

- 使用全大写 + 下划线命名：`PRD_RECTIFIED.md`、`API_CONTRACT.md`
- 目录使用序号前缀：`00-research`、`01-requirements`、`02-architecture`、`03-testing`
- 禁止中文文件名

## 4. 文档标记规范

在文档内容中使用以下标记标注变更：

| 标记 | 含义 | 使用场景 |
|---|---|---|
| 【新增】 | 新增内容 | 首次添加的需求、接口、字段 |
| 【修改】 | 修改内容 | 对已有内容的调整 |
| 【删除】 | 删除内容 | 移除的需求、接口、字段 |
| 【待确认】 | 待确认 | 需要产品/业务方确认的内容 |
| 【风险】 | 风险项 | 技术风险、业务风险、依赖风险 |
| 【设计推断】 | 设计稿推断 | 从设计稿图片推断的需求（`biz-research` / `prd-compose` 产出） |
| 【冲突】 | 矛盾项 | 不同材料之间的矛盾（`biz-research` / `prd-compose` 产出） |
| 【澄清结论】 | 澄清决策 | 需求澄清阶段的最终决策（`biz-research` 阶段二产出） |

## 5. 编号体系

全链路使用以下统一编号，确保追溯性：

| 编号类型 | 格式 | 说明 | 示例 |
|---|---|---|---|
| 澄清问题 | CQ-NNN | 需求澄清阶段的问题编号 | CQ-001: 订单状态流转是否支持跳过待付款？ |
| 功能需求 | FNNN | PRD 中的功能编号 | F001: 用户注册 |
| 接口 | API-模块-NNN | 接口编号，模块如 USER、ORDER | API-USER-001: POST /api/v1/users |
| 测试用例 | TC-模块-NNN | 测试用例编号，模块与接口对应 | TC-USER-001: 用户注册成功（P0） |
| 缺陷 | BUG-模块-NNN | 缺陷编号，按发现顺序 | BUG-USER-001: 注册后未发送验证邮件 |

**编号规则**：
- NNN 从 001 开始，在模块内连续递增
- 模块名使用大写英文缩写（如 USER、ORDER、PAYMENT）
- 编号一旦分配不可重用，即使对应条目被删除

## 6. 文档结构要求

每份文档至少包含以下章节：

| 章节 | 说明 |
|---|---|
| 文档信息 | 文档类型、生成 Skill、状态、版本、日期 |
| 目标 | 本文档要解决什么问题 |
| 范围 | 涉及哪些模块、功能 |
| 正文 | 具体内容（流程、字段、规则等） |
| 异常与边界 | 异常场景、边界条件 |
| 变更记录 | 版本号、日期、变更说明 |

## 7. 文档引用关系

```
RESEARCH_SUMMARY.md（调研归纳）
    ↓ biz-research 阶段二
REQUIREMENTS_CLARIFIED.md（需求澄清）
    ↓ prd-compose
PRD_RAW.md（初始 PRD）
    ↓ prd-review + prd-rectify
PRD_RECTIFIED.md（需求基线，冻结）
    ↓
ARCHITECTURE.md（架构） → API_CONTRACT.md（接口） → DATA_MODEL.md（数据）
    ↓
TEST_PLAN.md（测试计划） → TEST_CASES.md（测试用例）
    ↓ qa-execute
TEST_REPORT.md（测试报告）
    ↓ defect-fix（失败时）
DEFECT_LOG.md（缺陷记录） ⟲ 回到代码修复 → 回归测试
    ↓ doc-check（任意节点）
DOC_CHECK_REPORT.md（追溯性校验报告）
```

- 需求引用格式：`关联需求：F001`
- 接口引用格式：`关联接口：API-XXX-001`
- 跨文档引用格式：`参见 PRD_RECTIFIED.md § F001`
- 澄清引用格式：`关联澄清：CQ-001`

## 8. 文档优先级

以冻结后的文档为准。当文档与代码冲突时：

1. 先确认文档是否为最新版本
2. 如果文档是最新的，以文档为准修改代码
3. 如果需要变更需求，先更新文档，再改代码

## 9. 禁止事项

- 禁止在文档中写代码实现细节（伪代码和流程图除外）
- 禁止跳过文档直接写代码
- 禁止文档和代码不同步
