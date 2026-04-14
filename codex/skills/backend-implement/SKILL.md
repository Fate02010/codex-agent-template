---
name: backend-implement
description: 按冻结需求与设计文档实现后端代码，严格遵循 Maven 多模块、Mapper XML、错误码国际化规则，并绑定 TC 测试；由 dev-implement 或 parallel-dev-orchestrator 调用，不直接由用户触发。
---

# Skill: backend-implement — 后端开发实现

## Purpose

在设计文档与测试文档已冻结的前提下，完成后端代码实现（领域模型、应用服务、接口层、持久层）及绑定 TC 的后端测试。

## When to Use

- 由 `dev-implement` 路由至本 Skill（单端后端变更）
- 由 `parallel-dev-orchestrator` 分派为 backend worker（双端并行）
- 不直接由用户触发

## When Not to Use

- 需要同时修改前端代码（使用 `dev-implement` 入口由其路由）
- 设计文档未冻结（回到上游阶段）
- 前端实现（使用 `frontend-implement`）

## Inputs

1. `docs/01-requirements/PRD_RECTIFIED.md`
2. `docs/03-architecture/ARCHITECTURE.md`
3. `docs/03-architecture/API_CONTRACT.md`
4. `docs/03-architecture/DATA_MODEL.md`
5. `docs/04-testing/TEST_PLAN.md`
6. `docs/04-testing/TEST_CASES.md`
7. `backend/AGENTS.md`
8. `codex/standards/ALI_JAVA_STANDARDS.md` — 阿里巴巴 Java 开发规范摘要（按层按需读取）
9. 并行模式下额外：`parallel-task-splitter` 生成的 Backend Prompt（功能范围与边界）

## Outputs

- `backend/` 下对应模块代码
- 绑定 TC 的后端测试代码

## 前置条件

- 后端工程骨架已存在（`backend/<project-name>-parent` 或等效）
- `PRD_RECTIFIED.md`、`API_CONTRACT.md`、`DATA_MODEL.md` 状态为 `已冻结`

## Rules

1. 严格按文档实现，不越权扩展功能。
2. 发现设计缺口时先更新设计文档再改代码。
3. 并行模式下：仅修改 `backend/**`，禁止修改 `frontend/**` 与共享基线文档。
4. 模块展示使用 `EN（中文）`，编号与路径判定仅使用英文缩写（如 `TC-ORDER-001`）。
5. 代码实现必须遵守 `codex/standards/ALI_JAVA_STANDARDS.md` 中对应层的规范；**按层按需读取**，不得一次性加载全文（infrastructure 层读第 0+1 节，domain 读第 0+2 节，application 读第 0+3 节，interfaces 读第 0+4 节，所有层额外读第 5+6 节，测试代码读第 7 节）。

## Workflow

### 步骤 0：验证前置

#### [断点恢复扫描]

按 `## 断点恢复` 检查点表格从后向前扫描各步骤完成状态，确定续执起点后输出恢复摘要（格式见 `AGENTS.md` § 14.5 第 3 条），然后跳转到续执起点。若无断点，继续执行以下步骤 0 主体。

1. 工程骨架缺失时先回到 `project-init` / `backend-bootstrap`。
2. 文档未冻结时中止并回到对应上游阶段。
3. 并行模式下确认 Backend Prompt 中的功能范围与边界。

### 步骤 1：后端实现

必须遵守：

- 构建工具与多模块结构以 `ARCHITECTURE.md` 构建工具基线章节为准（Maven 或 Gradle，不得自行假设）
- 外部 Controller 与内部 Controller 分离
- MyBatis Mapper 接口与 Mapper XML 成对落地
- 错误码和消息走 `resources/error/*.properties`

实现前必须读取：

- `ARCHITECTURE.md` 第 11 节（核心业务流程序列图）：以序列图为准实现 Controller → Service → Repository 调用链，不得自行推断调用顺序
- `ARCHITECTURE.md` 第 12 节（安全与鉴权设计 / 接口权限矩阵）：按权限矩阵为各接口添加鉴权注解（如 `@PreAuthorize`），角色权限不得自行扩展
- `API_CONTRACT.md` 第 1 节（全局约定）：统一返回体结构（`code/message/data/timestamp`）、HTTP 状态码映射须在所有 Controller 中一致落地
- `DATA_MODEL.md` 第 1 节（全局约定）：公共字段、软删除策略、乐观锁字段须在所有 PO/实体中一致落地
- `codex/standards/ALI_JAVA_STANDARDS.md` 对应层章节（按 Rule 5 按需读取，不全文加载）

实现顺序：

1. `infrastructure`：PO、Mapper、Repository
2. `domain`：模型、仓储接口、领域服务
3. `application`：命令/查询与应用服务
4. `interfaces`：DTO、Assembler、Controller

### 步骤 2：注释与规范检查（含阿里规范合规）

**注释要求（强制）：**
- 类/接口 Javadoc 必须包含：`@author`、创建日期、类用途说明
- 实体类/DTO/PO 每个字段必须有注释
- 抽象方法 Javadoc 必须说明功能、`@param`、`@return`、`@throws`
- 枚举类型每个字段必须注释说明用途
- 复杂业务分支必须有行内注释（`//`，另起一行与代码对齐）

**阿里规范合规检查（逐层生成中间产物）：**

为当前实现模块生成临时检查文件 `backend/{module-name}/.std_check.md`，写入对应层的规范检查清单，
作为步骤 3、4 的执行参照；**步骤 4 自检全部通过后立即删除此文件**，不得提交到仓库。

中间产物内容（按当前层勾选对应项）：
```markdown
# 规范检查清单 — {module-name}（临时，完成后删除）

## 通用命名
- [ ] 类名 UpperCamelCase / 方法名 lowerCamelCase / 常量 UPPER_SNAKE_CASE
- [ ] 异常类以 Exception 结尾，抽象类以 Abstract/Base 开头
- [ ] DO/DTO/VO/PO 命名规约正确，无 xxxPOJO

## 日志
- [ ] 只使用 SLF4J 门面，无直接 Log4j/Logback API 调用
- [ ] 日志输出使用占位符，无字符串拼接，无 System.out/err
- [ ] 异常日志包含现场信息 + 堆栈（log.error("msg={}", msg, e)）

## 注释
- [ ] 所有类有 @author + 创建日期的 Javadoc
- [ ] 抽象方法/接口方法有完整 Javadoc（功能/参数/返回值/异常）
- [ ] 枚举字段有注释

## 【infrastructure 层】
- [ ] 布尔字段命名 is_xxx，unsigned tinyint 类型
- [ ] 小数用 decimal，无 float/double
- [ ] 禁止 SELECT *，禁止循环中执行 SQL
- [ ] 索引命名：pk_ / uk_ / idx_ 前缀

## 【domain 层】
- [ ] 所有覆写方法有 @Override
- [ ] equals 和 hashCode 成对实现
- [ ] 集合判空用 isEmpty()，整型包装类比较用 equals

## 【application 层】
- [ ] 无直接 new Thread()，线程通过 ThreadPoolExecutor 管理
- [ ] ThreadLocal 在 try-finally 中回收
- [ ] 无空 catch 块，事务 catch 后手动触发回滚

## 【interfaces 层】
- [ ] 对外接口签名未修改
- [ ] 无已过时（@Deprecated）的类或方法调用
```

### 步骤 3：后端测试实现（强制 TC 绑定）

- 测试类使用 `@DisplayName("TC-XXX-NNN: ...")`
- TC 编号必须来自 `TEST_CASES.md`，不得自造编号

### 步骤 4：自检

- [ ] 编译通过
- [ ] Controller 与 `API_CONTRACT.md` 一致
- [ ] 所有接口返回体符合统一包装结构（`code/message/data/timestamp`）
- [ ] HTTP 状态码与 `API_CONTRACT.md` 第 1 节全局约定一致
- [ ] 接口鉴权注解与 `ARCHITECTURE.md` 第 12 节权限矩阵一致
- [ ] Controller → Service → Repository 调用链与 `ARCHITECTURE.md` 第 11 节序列图一致
- [ ] PO/实体与 `DATA_MODEL.md` 一致
- [ ] 所有 PO 包含公共字段（`created_by/created_at/updated_by/updated_at`）
- [ ] 软删除字段与 `DATA_MODEL.md` 第 1 节全局约定一致
- [ ] 乐观锁字段（`version`）按全局约定落地（如适用）
- [ ] Mapper XML 路径和内容可加载
- [ ] 错误码国际化配置已接入
- [ ] 后端测试与 TC 编号映射通过
- [ ] 命名符合阿里规范（类名 UpperCamelCase / 方法名 lowerCamelCase / 常量 UPPER_SNAKE_CASE）
- [ ] 日志使用 SLF4J 门面且使用占位符输出，无 System.out/err 和 e.printStackTrace()
- [ ] 异常处理符合规范（不以 catch 控制流、finally 关闭资源、事务场景手动回滚）
- [ ] 注释完整（Javadoc 含 @author + 日期 + 用途、抽象方法说明、枚举字段说明）
- [ ] `backend/{module-name}/.std_check.md` 中间产物已确认删除

### 步骤 5：提示下一步

- 单端模式：进入 `qa-execute`
- 并行模式：回传完成状态给 `parallel-dev-orchestrator`，等待统一收口后进入 `qa-execute`

## 断点恢复

> 通用恢复原则见根目录 `AGENTS.md` § 14。本章节声明本 Skill 的步骤级检查点；未列出的项回退到 `AGENTS.md` § 14.4 默认规则。

### 检查点表格

| 步骤 | 步骤名称 | 完成判定条件 | 续执起点 |
|---|---|---|---|
| 步骤 0 | 验证前置 | 工程骨架已确认存在，文档状态已确认冻结，并行模式下 Backend Prompt 已确认 | 步骤 1 |
| 步骤 1 | 后端实现 | `backend/` 下 infrastructure/domain/application/interfaces 四层代码已落地 | 步骤 2 |
| 步骤 2 | 注释与规范检查 | 注释完整，`backend/{module-name}/.std_check.md` 检查清单已生成 | 步骤 3 |
| 步骤 3 | 后端测试实现 | 绑定 TC 编号的测试类已创建 | 步骤 4 |
| 步骤 4 | 自检 | 所有自检项勾选通过，`.std_check.md` 中间产物已删除 | 步骤 5 |
| 步骤 5 | 提示下一步 | 已向用户/orchestrator 输出完成状态 | — |

### 默认恢复原则（兜底）

1. 若所有输出文件均不存在，从步骤 0 全量执行。
2. 若部分输出文件存在，从最早未完成步骤续执，已有内容按增量更新处理。
3. Gate Report 结论为 `BLOCKED` 时，从步骤 0 重新评估（参见 `AGENTS.md` § 14.5 第 4 条）。
