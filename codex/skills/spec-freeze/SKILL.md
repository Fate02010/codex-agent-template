---
name: spec-freeze
description: 将冻结 PRD 转化为开发可消费的精简规格书、结构化功能清单、验收骨架与 OpenAPI 草稿，作为设计与开发阶段的唯一机读入口。
---

# Skill: spec-freeze — 规格冻结

## 触发条件

当 `PRD_RECTIFIED.md` 状态为 `已冻结`，且 `PRD_RECTIFIED_GATE_REPORT.md` 门禁结论为 `✅ 通过` 时使用本 Skill。

以下场景不触发本 Skill：

- PRD 仍在编写或评审中（应先使用 `prd-compose` / `prd-review` / `prd-rectify`）
- 已进入架构设计阶段（应使用 `solution-design`）
- 需要增量更新设计文档（应使用 `architecture-rectify`）

## 输入

1. `docs/01-requirements/PRD_RECTIFIED.md` — 整改后的需求文档（状态必须为 `已冻结`）
2. `docs/01-requirements/PRD_RECTIFIED_GATE_REPORT.md` — 冻结前门禁报告（结论必须为 `✅ 通过`）
3. `docs/01-requirements/MVP_SCOPE.md`（可选）— 范围边界参考

## 输出

1. `docs/01-requirements/product-spec.md` — 面向开发的精简规格书（实现合同）
2. `docs/01-requirements/feature_list.json` — 结构化功能清单（机器可读）
3. `docs/01-requirements/acceptance_harness.md` — 验收测试骨架
4. `docs/01-requirements/openapi.yaml` — OpenAPI 3.0 草稿（基于 PRD 追溯矩阵与字段清单生成，供 `solution-design` 细化）

## 执行层级导读（Progressive Disclosure）

- `P0 必检（阻塞）`：PRD 冻结状态校验、四份输出文件结构完整、`feature_list.json` 为合法 JSON、`openapi.yaml` 为合法 YAML、功能数量与 PRD 一致。
- `P1 扩展（覆盖）`：每个 FNNN 的全部字段/规则/状态机/AC 均已提取且无遗漏，追溯矩阵完整。
- `P2 参考（说明）`：格式美观度、代码骨架示例仅作参考，不参与放行。
- 执行顺序必须为：先过 `P0 Gate`，再进入 `P1`；`P2` 不得覆盖 `P0` 结论。

## 执行规则

1. 冷启动规则（强制）：
   - 若目标目录不存在，先创建目录。
   - 若目标文件不存在，按本 Skill 内置结构创建完整文档。
   - 若目标文件状态为 `模板`，整文件覆盖为正式产物结构。
   - 若目标文件状态不为 `模板`，整文件覆盖重新生成（四份产物与 PRD 严格绑定，不支持增量更新）。
2. 本 Skill 为 **纯提取/转换** 性质，禁止新增、修改或扩展 `PRD_RECTIFIED.md` 中的任何需求内容。
3. `feature_list.json` 必须是合法 JSON，可被 `JSON.parse()` 直接解析。
4. 编号必须与 PRD 完全一致（F001、BR-MODULE-001、EX-MODULE-001、AC-MODULE-001）。
5. 模块命名在展示字段使用 `EN（中文）` 格式（如 `MEM（会员管理）`），在 JSON key 和 ID 段使用纯英文缩写。
6. `PRD_RECTIFIED.md` 中的 `【待确认】` 项必须保留：
   - `product-spec.md` 中显式列出。
   - `feature_list.json` 中对应条目增加 `"pending": true` 标记。
7. `P0 Gate` 未通过时，结论必须为 `BLOCKED/FAIL`，不得进入后续步骤。
8. 规则去重：`执行规则` 保留主定义，`执行流程` 与 `Quality Gate` 仅引用编号与结论。

## 执行流程

> 本 Skill 按章节标题读取上游文档，不依赖章节序号。

### 步骤 0：P0 Gate（阻塞）

#### [断点恢复扫描]

按 `## 断点恢复` 检查点表格从后向前扫描各步骤完成状态，确定续执起点后输出恢复摘要（格式见 `AGENTS.md` § 14.5 第 3 条），然后跳转到续执起点。若无断点，继续执行以下步骤 0 主体。

1. 校验 `PRD_RECTIFIED.md` 存在且文档信息中状态行包含 `已冻结`。
2. 校验 `PRD_RECTIFIED_GATE_REPORT.md` 存在且门禁结论为 `✅ 通过`。
3. 任一校验失败时输出 `BLOCKED/FAIL` 并停止，不进入步骤 1~6。

### 步骤 1：解析 PRD 结构

读取 `docs/01-requirements/PRD_RECTIFIED.md`，逐章节提取以下数据：

**全局数据：**
- 基线概述（项目背景、本期目标、成功标准、范围界定）
- 角色与权限（角色定义表 + 角色-权限-动作矩阵）
- 追溯矩阵（需求编号 → 计划接口 → 计划数据表 → 计划测试）
- 全局规则与非功能需求（性能/安全/审计/兼容）
- 遗留待确认与风险

**逐 FNNN 提取：**
- 所属模块、业务目标、参与角色、前置条件、触发条件
- 主流程（步骤列表）
- 字段清单（9 列表格：字段名|类型|长度/精度|必填|默认值|校验规则|空值策略|错误提示|说明）
- 业务规则（编号|规则|说明|影响接口|影响表结构）
- 状态流转（当前状态|触发动作|下一状态|说明）或"无独立状态流转"声明
- 异常场景（编号|场景|处理方式|用户提示|恢复动作）
- 边界条件（编号|边界条件|限制值|说明）
- 验收标准 GWT（编号|验收项|Given|When|Then）
- UI约束必填块（页面类型、布局模板、主操作、字段展示映射、状态标签规则、反馈规则）
- `【待确认】`/`【设计推断】`/`【冲突】` 标记

### 步骤 2：生成 product-spec.md

将解析结果转化为面向开发的精简规格书。**product-spec.md 是摘要而非全文复制**，完整细节仍以 PRD_RECTIFIED.md 为准。

输出结构：

```markdown
# 产品规格书（Product Specification）

## 文档信息
- 文档类型：产物
- 生成 Skill：`spec-freeze`
- 上游输入：`PRD_RECTIFIED.md`
- 版本：v1.0
- 日期：YYYY-MM-DD
- 状态：已冻结

## 1. 模块总览

| 模块编号 | 模块名称 | 功能数量 | 涉及端（后端/前端/双端） |
|---|---|---|---|

## 2. 角色-权限矩阵

| 角色 | 描述 | 核心权限 | 关联功能 |
|---|---|---|---|

## 3. 功能规格

### F001: [功能名称]
- 模块：MEM（会员管理）
- 业务目标：[一句话摘要]
- 范围：后端 ✅ / 前端 ✅

#### 关键字段约束

| 字段名 | 类型 | 必填 | 核心约束 | 空值策略 |
|---|---|---|---|---|

> 仅列出有 non-trivial 约束的字段。完整字段清单见 `PRD_RECTIFIED.md`。

#### 核心业务规则

| 编号 | 规则摘要 | 影响接口 | 影响表结构 |
|---|---|---|---|

#### 状态机

| 当前状态 | 触发动作 | 下一状态 |
|---|---|---|

> 若无独立状态流转则标注"无独立状态流转"。

#### API 提示

- `POST /api/members` — 会员注册
- ...

#### 数据表提示

- `t_member` — 会员主表
- ...

#### 待确认项

> 仅当该功能存在 `【待确认】` 时输出此小节。

| 编号 | 事项 | 影响范围 |
|---|---|---|

---

## 4. 非功能基线

| 类别 | 指标 | 目标值 |
|---|---|---|

## 5. 追溯矩阵

| 需求编号 | 计划接口 | 计划数据表 | 计划测试 |
|---|---|---|---|

## 6. 遗留待确认与风险

| 编号 | 事项 | 影响范围 | 对下游影响 |
|---|---|---|---|

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| v1.0 | YYYY-MM-DD | 从 PRD_RECTIFIED.md 生成初始规格书 |
```

**生成规则：**

1. **关键字段约束**：仅提取有明确校验规则、长度限制、枚举值、跨字段依赖的字段，不搬运所有字段。
2. **核心业务规则**：保留 `影响接口=是` 或 `影响表结构=是` 的规则，纯展示类规则省略。
3. **API 提示 / 数据表提示**：从追溯矩阵提取，格式为 `HTTP方法 路径 — 中文说明` / `表名 — 中文说明`。
4. **待确认项**：从 PRD 的遗留待确认与风险表和正文 `【待确认】` 标记中汇总。
5. **涉及端判断**：根据 UI约束必填块和追溯矩阵中的 API/表信息判断后端/前端/双端。

### 步骤 3：生成 feature_list.json

将解析结果转化为结构化 JSON。

输出 Schema：

```json
{
  "meta": {
    "version": "1.0.0",
    "generatedAt": "YYYY-MM-DDTHH:mm:ssZ",
    "source": "docs/01-requirements/PRD_RECTIFIED.md",
    "generator": "spec-freeze",
    "status": "frozen"
  },
  "modules": [
    {
      "en": "MEM",
      "zh": "会员管理",
      "featureCount": 3
    }
  ],
  "features": [
    {
      "id": "F001",
      "name": "功能名称",
      "module": { "en": "MEM", "zh": "会员管理" },
      "objective": "业务目标一句话",
      "scope": { "backend": true, "frontend": true },
      "pending": false,
      "fields": [
        {
          "name": "member_name",
          "type": "VARCHAR",
          "required": true,
          "constraints": {
            "maxLength": 50,
            "minLength": 2,
            "pattern": "中文/英文/数字",
            "enumValues": null,
            "nullStrategy": "不允许空值",
            "errorHint": "会员名称长度为2-50个字符"
          }
        }
      ],
      "businessRules": [
        {
          "id": "BR-MEM-001",
          "summary": "会员名称不能重复",
          "affectsApi": true,
          "affectsTable": true
        }
      ],
      "stateMachine": [
        {
          "from": "正常",
          "action": "冻结会员",
          "to": "冻结"
        }
      ],
      "exceptions": [
        {
          "id": "EX-MEM-101",
          "category": "输入校验",
          "scenario": "手机号格式错误",
          "recovery": "用户修正输入后重新提交"
        }
      ],
      "boundaries": [
        {
          "condition": "分页大小上限",
          "limit": "100"
        }
      ],
      "apis": ["POST /api/members"],
      "tables": ["t_member"],
      "allowedRoles": ["管理员", "运营人员"],
      "testHints": ["接口测试：会员注册成功/失败"],
      "acceptanceCriteria": [
        {
          "id": "AC-MEM-001",
          "item": "手机号精确匹配查询",
          "given": "系统中存在手机号为13800138000的会员张三",
          "when": "在手机号输入框输入\"13800138000\"，点击「查询」",
          "then": "列表仅返回1条记录，会员姓名为\"张三\"，响应时间<2秒"
        }
      ]
    }
  ],
  "traceabilityMatrix": [
    {
      "featureId": "F001",
      "source": "CQ-001",
      "apis": ["POST /api/members"],
      "tables": ["t_member"],
      "tests": ["接口测试：会员注册成功/失败"]
    }
  ],
  "roles": [
    {
      "name": "管理员",
      "description": "系统管理员",
      "permissions": ["会员管理", "数据导出"],
      "features": ["F001", "F002"]
    }
  ],
  "nfr": {
    "performance": [
      { "metric": "接口响应时间", "target": "P99 < 500ms" }
    ],
    "security": ["数据加密传输", "密码不可明文存储"],
    "audit": ["关键操作日志保留 180 天"],
    "compatibility": ["Chrome 90+", "Safari 15+"]
  }
}
```

**生成规则：**

1. `features[]` 中的 `fields` 提取 PRD 字段清单的全部字段（不做精简）。
2. `apis` / `tables` / `testHints` 从追溯矩阵逐条提取。
3. `scope.backend` / `scope.frontend` 根据以下逻辑判断：
   - 存在 API 提示或数据表提示 → `backend: true`
   - 存在 UI约束必填块 → `frontend: true`
   - 两者都存在 → 双端
4. 含 `【待确认】` 标记的功能 → `"pending": true`。
5. `stateMachine` 为空数组时表示"无独立状态流转"。
6. JSON 中所有字符串值使用 UTF-8 编码，中文内容原样保留。
7. `allowedRoles`：从 PRD 角色-权限-动作矩阵提取可操作该功能的角色名称列表；若 PRD 无角色权限矩阵则置为空数组 `[]`。

### 步骤 4：生成 acceptance_harness.md

将验收标准转化为测试骨架文档。

输出结构：

```markdown
# 验收测试骨架（Acceptance Harness）

## 文档信息
- 文档类型：产物
- 生成 Skill：`spec-freeze`
- 上游输入：`PRD_RECTIFIED.md`
- 版本：v1.0
- 日期：YYYY-MM-DD
- 状态：已冻结

## 1. 总览

| 功能编号 | 功能名称 | 模块 | AC 数量 | 覆盖测试类型 |
|---|---|---|---|---|

## 2. 验收用例骨架

### F001: [功能名称]

模块：MEM（会员管理）

#### AC-MEM-001: [验收项]
- **Given**: [前置条件]
- **When**: [操作步骤]
- **Then**: [预期结果]
- **建议测试类型**: 接口测试
- **建议测试层级**: Integration

#### AC-MEM-002: [验收项]
- **Given**: [前置条件]
- **When**: [操作步骤]
- **Then**: [预期结果]
- **建议测试类型**: E2E 测试
- **建议测试层级**: E2E

#### 测试代码骨架（参考）

**后端（JUnit 5）：**
```java
@DisplayName("F001: [功能名称]")
class F001Test {
    @Test
    @DisplayName("AC-MEM-001: [验收项]")
    void testAcMem001() {
        // Given: [前置条件]
        // When: [操作步骤]
        // Then: [预期结果]
    }

    @Test
    @DisplayName("AC-MEM-002: [验收项]")
    void testAcMem002() {
        // Given: [前置条件]
        // When: [操作步骤]
        // Then: [预期结果]
    }
}
```

**前端（Vitest）：**
```typescript
describe('F001: [功能名称]', () => {
  it('AC-MEM-001: [验收项]', () => {
    // Given: [前置条件]
    // When: [操作步骤]
    // Then: [预期结果]
  });

  it('AC-MEM-002: [验收项]', () => {
    // Given: [前置条件]
    // When: [操作步骤]
    // Then: [预期结果]
  });
});
```

---

## 3. 测试类型映射矩阵

| AC 编号 | 关联功能 | 建议测试类型 | 测试层级 | 判定理由 |
|---|---|---|---|---|
| AC-MEM-001 | F001 | 接口测试 | Integration | 涉及后端业务逻辑校验 |
| AC-MEM-002 | F001 | E2E 测试 | E2E | 涉及前端交互与页面跳转 |

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| v1.0 | YYYY-MM-DD | 从 PRD_RECTIFIED.md 生成初始验收骨架 |
```

**测试类型映射规则：**

| AC 特征 | 建议测试类型 | 测试层级 |
|---|---|---|
| 涉及 API 行为（CRUD、业务校验） | 接口测试 | Integration |
| 涉及 UI 交互（点击、跳转、表单） | E2E 测试 | E2E |
| 仅涉及数据校验（格式、长度、枚举） | 单元测试 | Unit |
| 涉及状态流转（状态机变更） | 接口测试 + 单元测试 | Integration + Unit |
| 涉及权限校验（角色、操作权限） | 接口测试 | Integration |
| 涉及并发/边界（乐观锁、超时） | 接口测试 | Integration |

**多特征 AC 处理规则**：若一个 AC 同时涉及多种特征，按以下优先级选择主测试类型：
`E2E 测试 > 接口测试 > 单元测试`；需要多层覆盖时，在"建议测试类型"列用 `+` 分隔，
如 `接口测试 + 单元测试`，并在"判定理由"列分别说明。

### 步骤 4.5：生成 openapi.yaml

将追溯矩阵中的计划接口和字段清单转化为 OpenAPI 3.0 草稿。此阶段生成的是**基于 PRD 的 stub 规格**，`solution-design` 阶段负责细化完整的请求/响应 schema 和错误码。

**生成规则：**

1. `info.title` 取 PRD 基线概述中的项目名称，`info.version` 默认 `"1.0.0-draft"`，标注 `x-generated-by: spec-freeze`。
2. `tags` 按模块生成，每个模块一个 tag，`name` 为英文缩写，`description` 为中文名称（如 `name: MEM, description: 会员管理`）。
3. `paths` 从每个 FNNN 的追溯矩阵 `计划接口` 字段提取（格式：`HTTP方法 路径`）：
   - `summary` = `"FNNN: 功能名称"`
   - `description` = 业务目标
   - `operationId` = 小驼峰，由 HTTP 方法 + 路径段生成（如 `POST /api/members` → `createMember`）
   - `tags` = 所属模块英文缩写
4. `requestBody`（POST/PUT/PATCH）和 `parameters`（GET/DELETE path/query）：
   - 从字段清单提取，`required` 字段列入 `required[]`
   - 字段类型映射：`VARCHAR/TEXT → string`、`INT/BIGINT → integer`、`DECIMAL/FLOAT → number`、`DATETIME/DATE → string (format: date-time/date)`、`BOOLEAN → boolean`、`ENUM → string (enum: [...])`
   - 字段约束映射：`最大长度 → maxLength`、`最小长度 → minLength`、`正则 → pattern`、`最大值 → maximum`、`最小值 → minimum`、`精度 → multipleOf`
   - `description` = 字段清单中的"说明"列内容
5. `responses`：每个 path 固定生成以下响应码骨架（供 `solution-design` 细化，与全局约定对齐）：
   - `200`：成功（schema 引用 `$ref: '#/components/schemas/[OperationId]Response'`）
   - `400`：参数错误
   - `401`：未授权（若 PRD 有权限控制需求）
   - `403`：无权限（若 PRD 有角色控制需求）
   - `404`：资源不存在（GET / PUT / PATCH / DELETE 类接口必须包含）
   - `409`：冲突（POST / PUT 写操作接口必须包含，覆盖幂等重复与唯一约束冲突场景）
   - `422`：业务规则违反（写操作接口必须包含，覆盖参数合法但业务校验失败场景）
   - `500`：系统错误
6. `components.schemas`：
   - 每个 POST/PUT/PATCH 接口生成 `[OperationId]Request` schema（提取字段约束）
   - 每个接口生成 `[OperationId]Response` schema，统一包含以下外层结构（与 solution-design 全局约定对齐）：
     - `code`（string）：业务状态码，SUCCESS 或错误码键
     - `message`（string）：提示文案
     - `data`（object）：业务数据体，待 `solution-design` 细化；列表类接口的 `data` 预置分页结构占位（`list / total / pageNo / pageSize`）
     - `timestamp`（integer，format: int64）：Unix 毫秒时间戳
   - 含 `【待确认】` 的字段增加 `x-pending: true`

7. 若 PRD 存在角色权限定义，在 `components.securitySchemes` 生成 Bearer Token 占位骨架，并在涉及权限控制的接口 path 下增加 `security: [{ BearerAuth: [] }]` 字段（供 `solution-design` 细化 Token 结构与有效期）。

**输出格式（示例）：**

```yaml
openapi: "3.0.3"
info:
  title: "[项目名称]"
  version: "1.0.0-draft"
  description: "[项目背景一句话]"
  x-generated-by: spec-freeze
  x-source: docs/01-requirements/PRD_RECTIFIED.md

tags:
  - name: MEM
    description: 会员管理

paths:
  /api/members:
    post:
      tags: [MEM]
      summary: "F001: 会员注册"
      description: "业务目标一句话"
      operationId: createMember
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateMemberRequest'
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreateMemberResponse'
        '400':
          description: 参数错误
        '401':
          description: 未授权
        '500':
          description: 系统错误

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: "待 solution-design 细化 Token 结构与有效期"
  schemas:
    CreateMemberRequest:
      type: object
      required:
        - member_name
        - mobile
      properties:
        member_name:
          type: string
          minLength: 2
          maxLength: 50
          description: 会员姓名
        mobile:
          type: string
          pattern: '^1[3-9]\d{9}$'
          description: 手机号
    CreateMemberResponse:
      type: object
      description: "统一返回体，data 字段内容待 solution-design 细化"
      properties:
        code:
          type: string
          description: "业务状态码，SUCCESS 或错误码键"
        message:
          type: string
          description: "提示文案（面向用户）"
        data:
          type: object
          description: "业务数据体，待 solution-design 细化"
          properties: {}
        timestamp:
          type: integer
          format: int64
          description: "Unix 毫秒时间戳"
```

### 步骤 5：交叉验证

生成完成后，逐项校验三份产物的一致性：

- [ ] PRD_RECTIFIED.md 中每个 FNNN 在 `product-spec.md`、`feature_list.json`、`acceptance_harness.md`、`openapi.yaml` 中均有对应条目
- [ ] `feature_list.json` 可被 `JSON.parse()` 解析且无语法错误
- [ ] `feature_list.json` 的 `features` 数组长度与 PRD 中 FNNN 数量一致
- [ ] `feature_list.json` 中每个 feature 的 `acceptanceCriteria` 数量与 PRD 中对应 FNNN 的验收标准条数一致
- [ ] `feature_list.json` 中每个 feature 的 `businessRules` 编号与 PRD 中 BR 编号一致
- [ ] `acceptance_harness.md` 中每个 AC 编号与 PRD 中 AC 编号一致
- [ ] `product-spec.md` 追溯矩阵与 `feature_list.json` 的 `traceabilityMatrix` 数据一致
- [ ] `openapi.yaml` 的 paths 数量与追溯矩阵中计划接口条数一致
- [ ] `openapi.yaml` 为合法 YAML，可被标准解析器解析
- [ ] 含 `【待确认】` 字段在 `openapi.yaml` 中已标记 `x-pending: true`
- [ ] 模块命名在四份产物中保持一致（`EN（中文）` 格式）
- [ ] 含 `【待确认】` 的功能在四份产物中均有标记
- [ ] `product-spec.md` 未引入 PRD 中不存在的内容

### 步骤 6：提示下一步

生成完成后提示用户：

- 下一步使用 `solution-design` 进行架构、接口、数据模型设计
- `solution-design` 可将 `product-spec.md`、`feature_list.json`、`openapi.yaml` 作为补充结构化输入，在草稿基础上细化完整接口契约
- `qa-design` 可使用 `acceptance_harness.md` 作为测试用例设计的骨架输入
- `parallel-task-splitter` 可直接消费 `feature_list.json` 进行任务拆分

## Quality Gate（分层）

### P0 Gate（阻塞，最小必检）

- [ ] `PRD_RECTIFIED.md` 状态为 `已冻结`。
- [ ] `PRD_RECTIFIED_GATE_REPORT.md` 门禁结论为 `✅ 通过`。
- [ ] `product-spec.md` 已生成且包含所有 FNNN 对应章节。
- [ ] `feature_list.json` 是合法 JSON 且可被 `JSON.parse()` 解析。
- [ ] `feature_list.json` 中 `features` 数量与 PRD 中 FNNN 数量一致。
- [ ] `acceptance_harness.md` 已生成且包含所有 AC 条目。
- [ ] `openapi.yaml` 已生成，为合法 YAML，paths 数量与追溯矩阵计划接口条数一致。
- [ ] PRD 中无 FNNN 在任一输出产物中缺失。
- [ ] `product-spec.md` 未引入 PRD 中不存在的需求内容。

### P1 Coverage Checklist（扩展覆盖）

- [ ] 每个有 non-trivial 约束的字段已出现在 `product-spec.md` 的关键字段约束表中。
- [ ] 每个 `影响接口=是` 或 `影响表结构=是` 的业务规则已出现在 `feature_list.json` 的 `businessRules` 中。
- [ ] 状态机完整提取（PRD 中所有状态流转行均已录入 `feature_list.json`）。
- [ ] 追溯矩阵在 `product-spec.md` 和 `feature_list.json` 间保持一致。
- [ ] `acceptance_harness.md` 测试类型映射覆盖全部 AC 条目。
- [ ] `openapi.yaml` 字段约束（minLength/maxLength/pattern/minimum/maximum/enum）已从字段清单完整提取。
- [ ] 含 `【待确认】` 的条目在四份产物中均已标记且未被静默丢弃。
- [ ] 模块命名在四份产物中保持 `EN（中文）` 格式一致。

### P2 Reference Checklist（参考）

- [ ] `product-spec.md` 表格格式可扫描、对齐。
- [ ] `acceptance_harness.md` 代码骨架使用项目一致的命名风格。
- [ ] 示例模板与说明文本已更新，且不改变 P0 判定口径。

## 断点恢复

> 通用恢复原则见根目录 `AGENTS.md` § 14。本章节声明本 Skill 的步骤级检查点；未列出的项回退到 `AGENTS.md` § 14.4 默认规则。

### 检查点表格

| 步骤 | 步骤名称 | 完成判定条件 | 续执起点 |
|---|---|---|---|
| 步骤 0 | P0 Gate | `PRD_RECTIFIED.md` 状态为已冻结，`PRD_RECTIFIED_GATE_REPORT.md` 门禁结论为 `✅ 通过`，未输出 BLOCKED/FAIL | 步骤 1 |
| 步骤 1 | 解析 PRD 结构 | PRD 全局数据与逐 FNNN 数据已提取 | 步骤 2 |
| 步骤 2 | 生成 product-spec.md | `docs/01-requirements/product-spec.md` 存在且包含所有 FNNN 对应章节 | 步骤 3 |
| 步骤 3 | 生成 feature_list.json | `docs/01-requirements/feature_list.json` 存在且为合法 JSON，`meta.status = "frozen"` | 步骤 4 |
| 步骤 4 | 生成 acceptance_harness.md | `docs/01-requirements/acceptance_harness.md` 存在且包含所有 AC 条目 | 步骤 4.5 |
| 步骤 4.5 | 生成 openapi.yaml | `docs/01-requirements/openapi.yaml` 存在且为合法 YAML，paths 数量与追溯矩阵计划接口条数一致 | 步骤 5 |
| 步骤 5 | 交叉验证 | 四份产物一致性校验通过，无 FNNN 缺失 | 步骤 6 |
| 步骤 6 | 提示下一步 | 已输出下游消费提示 | — |

### 默认恢复原则（兜底）

1. 若所有输出文件均不存在，从步骤 0 全量执行。
2. 若部分输出文件存在，从最早未完成步骤续执，已有内容按增量更新处理。
3. Gate Report 结论为 `BLOCKED` 时，从步骤 0 重新评估（参见 `AGENTS.md` § 14.5 第 4 条）。

## 注意事项

- 本 Skill 执行纯提取/转换，不得杜撰、新增或扩展任何需求。所有内容必须可追溯到 `PRD_RECTIFIED.md`。
- `feature_list.json` 是下游工具链的唯一机读入口；`parallel-task-splitter`、`solution-design` 应优先消费 JSON 而非手动解析 Markdown。
- `product-spec.md` 是精简摘要，不是 PRD 的全文复制。完整细节以 `PRD_RECTIFIED.md` 为准。
- 四份输出与 `PRD_RECTIFIED.md` 严格绑定同一冻结版本。PRD 版本变更时必须重新执行 `spec-freeze` 重新生成，不支持手动局部更新。
- `openapi.yaml` 是 PRD 阶段的草稿规格（`version: 1.0.0-draft`），仅包含路径骨架和字段级约束。完整的请求/响应 schema、错误码、鉴权方案由 `solution-design` 负责细化。`solution-design` 应以此文件为起点，不得丢弃已有的字段约束。
- `acceptance_harness.md` 中的测试代码骨架仅供参考，正式 TC 编号和测试实现由 `qa-design` 和 `dev-implement` 负责。
- 含 `【待确认】` 标记的功能不会被排除，但会在 JSON 中以 `"pending": true` 标记、在 Markdown 中以"待确认项"小节显式列出，供下游 skill 识别和处理。
- **重新执行覆盖警告**：若 `solution-design` 已基于 `openapi.yaml` 草稿完成细化，重新执行 `spec-freeze` 前必须先提交或备份 `openapi.yaml` 及三份设计文档（`ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md`），否则 `openapi.yaml` 的细化内容将被整体覆盖；`solution-design` 输入规则第 8 条（"细化时必须保留已有字段约束，不得丢弃"）仅适用于**在现有文件基础上细化**，不适用于 `spec-freeze` 重新生成后的覆盖场景。
