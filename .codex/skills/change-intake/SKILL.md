# Skill: change-intake — 增量变更受理

## 触发条件

当已交付系统需要新增功能、变更需求或接收增量需求资料时使用。适用于系统已完成首次交付（主链至少走到 `qa-execute`）后的迭代场景。

## 输入

1. 增量需求资料（Word/PDF/设计稿/口头记录/变更单）
2. `docs/01-requirements/PRD_RECTIFIED.md` — 当前需求基线
3. `docs/02-architecture/ARCHITECTURE.md` — 当前架构设计
4. `docs/02-architecture/API_CONTRACT.md` — 当前接口契约
5. `docs/02-architecture/DATA_MODEL.md` — 当前数据模型
6. `docs/04-iteration/RELEASE_BASELINE.md` — 当前版本基线（如已存在）

## 输出

1. `docs/04-iteration/CHANGE_REQUEST.md` — 变更请求单（追加或更新）
2. `docs/04-iteration/CHANGE_IMPACT.md` — 变更影响分析报告

## 执行流程

### 步骤 1：读取现有基线

按以下顺序读取：

1. `docs/01-requirements/PRD_RECTIFIED.md` — 理解当前需求范围
2. `docs/02-architecture/API_CONTRACT.md` — 理解当前接口
3. `docs/02-architecture/DATA_MODEL.md` — 理解当前数据结构
4. `docs/04-iteration/RELEASE_BASELINE.md` — 了解当前版本（如已存在）
5. `docs/04-iteration/CHANGE_REQUEST.md` — 了解已有变更记录（如已存在）

### 步骤 2：解析增量需求资料

- 与 `biz-research` 一致的方式解析输入资料（Word/PDF/设计稿）
- 提取新增需求、修改需求、删除需求
- 识别与现有基线的差异点
- 标注【新增】【修改】【删除】标记

### 步骤 3：输出变更请求单（CHANGE_REQUEST.md）

每条变更请求使用以下格式，追加到已有记录末尾：

```markdown
# 变更请求记录

## 文档信息
- 文档类型：产物
- 生成 Skill：`change-intake`
- 上游输入：增量需求资料、`PRD_RECTIFIED.md`、`API_CONTRACT.md`、`DATA_MODEL.md`、`RELEASE_BASELINE.md`
- 版本：vX.Y
- 日期：YYYY-MM-DD
- 状态：草稿 / 已冻结

## 变更请求列表

### CR-NNN: [变更标题]
- **变更类型**：新增功能 / 需求变更 / 需求删除
- **来源**：[资料名称/会议记录/变更单编号]
- **优先级**：P0 / P1 / P2 / P3
- **描述**：变更的具体内容
- **关联现有需求**：FNNN（如为修改/删除）/ 无（如为新增）
- **验收标准**：
  1. 验收条件 1
  2. 验收条件 2
- **状态**：待分析 / 已批准 / 已拒绝 / 已取消

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

**编号规则**：CR 编号从 001 开始，在项目内全局连续递增，不可重用。

### 步骤 4：执行变更影响分析

对每条 CR 逐一分析影响范围：

| 影响维度 | 分析内容 |
|---|---|
| 需求影响 | 需要新增/修改/删除的 PRD 功能点（FNNN） |
| 接口影响 | 需要新增/修改/删除的接口（API-XXX-NNN） |
| 数据模型影响 | 需要新增/修改的表和字段 |
| 架构影响 | 是否涉及架构调整（新模块、新中间件等） |
| 测试影响 | 需要新增/修改的测试用例（TC-XXX-NNN） |
| 前端影响 | 涉及的页面和组件 |
| 风险评估 | 变更引入的技术风险和业务风险 |

### 步骤 5：输出变更影响分析报告（CHANGE_IMPACT.md）

```markdown
# 变更影响分析报告

## 文档信息
- 文档类型：产物
- 生成 Skill：`change-intake`
- 上游输入：`CHANGE_REQUEST.md`、`PRD_RECTIFIED.md`、`API_CONTRACT.md`、`DATA_MODEL.md`、`RELEASE_BASELINE.md`
- 版本：vX.Y
- 日期：YYYY-MM-DD
- 状态：草稿 / 已冻结

## 1. 变更概览
| CR 编号 | 标题 | 类型 | 优先级 | 影响范围 |
|---|---|---|---|---|

## 2. 逐项影响分析

### CR-NNN: [变更标题]

#### 需求影响
| 操作 | 功能编号 | 说明 |
|---|---|---|
| 新增 | F0XX | ... |
| 修改 | F0XX | ... |
| 删除 | F0XX | ... |

#### 接口影响
| 操作 | 接口编号 | 说明 |
|---|---|---|
| 新增 | API-XXX-NNN | ... |
| 修改 | API-XXX-NNN | ... |

#### 数据模型影响
| 操作 | 数据表编号 | 物理表名 | 字段 | 说明 |
|---|---|---|---|---|
| 新增/修改 | T-XXX-NNN | t_xxx | xxx | ... |

#### 架构影响
- 是否涉及架构调整：是 / 否
- 影响说明：...

#### 测试影响
| 操作 | 用例编号 | 说明 |
|---|---|---|
| 新增 | TC-XXX-NNN | ... |
| 修改 | TC-XXX-NNN | ... |

#### 风险评估
| 风险 | 影响 | 应对措施 |
|---|---|---|

## 3. 工作量预估
| CR 编号 | 后端工时 | 前端工时 | 测试工时 | 合计 |
|---|---|---|---|---|

## 4. 建议执行顺序
按 CR 优先级和依赖关系排列推荐的实施顺序。

## 5. 后续步骤
- 变更已批准的 CR → 更新 `ITERATION_PLAN.md` → 进入 `prd-rectify` 更新需求基线
- 涉及接口变更 → 先更新 `API_CONTRACT.md`
- 涉及数据模型变更 → 先更新 `DATA_MODEL.md`
- 涉及架构调整 → 先更新 `ARCHITECTURE.md`

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

### 步骤 6：提示下一步

输出完成后告知用户：

- 变更请求和影响分析已生成
- 请评审 `CHANGE_REQUEST.md` 中各 CR 的状态，标记为"已批准"或"已拒绝"
- 批准后的 CR 应纳入 `iteration-plan` 进行迭代规划
- 根据影响分析，走对应的文档更新流程（先改文档，再改代码）：
  - 需求变更 → `prd-rectify` 更新 PRD 基线
  - 接口变更 → 更新 `API_CONTRACT.md` → `dev-implement`
  - 架构变更 → 更新 `ARCHITECTURE.md` → `solution-design`（局部更新）

## 注意事项

- 变更请求编号（CR-NNN）全局唯一递增，不因迭代切换重置
- 每条 CR 必须关联来源资料，确保可追溯
- 已拒绝的 CR 保留记录但不纳入后续流程
- 影响分析必须覆盖全部 7 个维度，任一维度无影响则标注"无"
- 遵循"先改文档，再改代码"原则：影响分析确认后，先更新受影响的文档基线
