---
name: jar-decompile
description: 将 JAR 包反编译为 Java 源码，自动补全 Javadoc 与行内注释，可选生成 Maven 骨架并执行编译验证。
---

# Skill: jar-decompile — JAR 反编译与注释补全

## Purpose

对用户提供的一个或多个 JAR 包执行反编译，还原 Java 源码结构，并由 Claude 逐类分析、补写完整的 Javadoc 与中文行内注释，最终输出可读性高、注释完备的源码工程。

本 Skill 的目标：

- 从无源码的 JAR 包还原可阅读的 Java 源码文件。
- 对还原出的所有类/接口/枚举、方法、字段补写中文 Javadoc 和行内注释。
- 可选生成 Maven 标准目录骨架，使输出可直接被 IDE 导入并尝试编译。
- 输出注释覆盖率报告，为后续阅读和二次开发提供基础。

## When to Use

满足以下任一条件时触发：

- 用户持有 JAR 文件但缺少对应源码，需要阅读或二次开发。
- 需要对第三方库、遗留系统 JAR 补写文档注释以便团队理解。
- 需要将反编译产物整理为 Maven 工程供 IDE 浏览。

## When Not to Use

- JAR 包经过强混淆（ProGuard/R8 混淆至 `a/b/c` 类名）：Claude 无法还原业务语义，注释质量极低，应先告知用户风险并由用户决定是否继续。
- 用户已有源码：直接阅读源码，无需本 Skill。
- 需要逆向分析并修改字节码（使用专项安全工具，不在本 Skill 范围内）。

## Inputs

1. `JAR_PATH`：JAR 文件绝对路径，或包含多个 JAR 的目录路径（必填）。
2. `OUTPUT_DIR`：反编译产物输出目录（必填；若目录不存在，步骤 0 创建）。
3. `MAVEN_SCAFFOLD`：是否生成 Maven 标准骨架（`yes` / `no`，默认 `no`）。
4. `CFR_JAR`：CFR 工具 JAR 路径（可选；未填时步骤 0 自动定位或提示下载）。
5. `BATCH_SIZE`：注释补全每批处理的 `.java` 文件数量（可选，默认 `5`）。

## Outputs

1. `{OUTPUT_DIR}/src/`（或 Maven 骨架下的 `src/main/java/`）：带注释的 `.java` 源文件，按包名组织目录层次。
2. `{OUTPUT_DIR}/DECOMPILE_REPORT.md`：反编译与注释完成报告，包含统计、覆盖率、编译验证结果、已知限制。
3. `{OUTPUT_DIR}/pom.xml`（仅当 `MAVEN_SCAFFOLD=yes`）：Maven 骨架 POM。

## Rules

1. CFR 工具必须可用（优先用户指定路径；其次检查当前目录及常见工具路径；均不存在时给出下载指引并阻塞）。
2. Java 运行时（`java` 命令）必须可在当前环境执行。
3. 反编译产物为还原近似代码，**不保证**与原始源码完全一致；Claude 在注释中须标注此声明。
4. 注释语言：统一使用**中文**，Javadoc 标签（`@param`、`@return`、`@throws`）的描述内容使用中文。
5. 每批注释补全文件数不超过 `BATCH_SIZE`（默认 5），防止单次上下文过大。
6. 经过强混淆的文件，必须在文件顶部添加 `// [WARN] 疑似混淆类，注释为推断，请人工复核` 警告注释。
7. 不得修改反编译产物的类结构、方法签名、包名；仅允许添加注释与 `import` 整理。
8. Maven 编译验证为可选步骤，失败不阻塞输出，但须在报告中标记失败原因。

## Workflow

### 步骤 0：验证前置

#### [断点恢复扫描]

按 `## 断点恢复` 检查点表格从后向前扫描各步骤完成状态，确定续执起点后输出恢复摘要（格式见 `AGENTS.md` § 14.5 第 3 条），然后跳转到续执起点。若无断点，继续执行以下步骤 0 主体。

执行以下检查，任一失败则输出 `BLOCKED` 并说明原因：

1. **检查 JAR 输入**：确认 `JAR_PATH` 存在。若为目录，列出其下所有 `.jar` 文件并确认数量；若为单文件，确认后缀为 `.jar`。收集最终待处理 JAR 列表（`jar_list`），向用户展示清单并确认。

2. **检查 CFR 工具**：
   - 若用户指定了 `CFR_JAR`，确认该路径文件存在。
   - 若未指定，按以下顺序探测：`./cfr.jar`、`~/tools/cfr.jar`、`/usr/local/lib/cfr.jar`。
   - 若均未找到，向用户输出如下提示并阻塞（状态 `BLOCKED`）：
     ```
     CFR 工具未找到。请按以下方式获取：
     1. 访问 https://github.com/leibnitz27/cfr/releases 下载最新 cfr-x.x.x.jar
     2. 将下载的 JAR 放置到任意目录，并以 CFR_JAR=<路径> 参数重新触发本 Skill
     验证命令示例：java -jar cfr-x.x.x.jar --version
     ```

3. **检查 Java 运行时**：运行 `java -version` 确认 Java 可用。若不可用，输出 `BLOCKED`，提示用户安装 JDK/JRE。

4. **准备输出目录**：若 `OUTPUT_DIR` 不存在，创建该目录及子目录 `src/`（或 Maven 骨架结构，若 `MAVEN_SCAFFOLD=yes`）。

5. **初始化报告文件**：在 `OUTPUT_DIR` 创建 `DECOMPILE_REPORT.md` 最小结构，状态设为 `进行中`。

`DECOMPILE_REPORT.md` 最小结构：

```
# JAR 反编译与注释报告

## 文档信息
- 生成 Skill：jar-decompile
- 输入 JAR：（待填）
- 输出目录：{OUTPUT_DIR}
- 日期：YYYY-MM-DD
- 状态：进行中

## 1. JAR 清单与反编译状态
| JAR 文件 | 反编译状态 | 生成 .java 数 | 备注 |
|---|---|---|---|

## 2. 注释补全进度
| 批次 | 文件数 | 状态 | 混淆文件数 |
|---|---|---|---|

## 3. 编译验证结果
- 状态：待执行
- 错误数：—
- 警告数：—

## 4. 注释覆盖率统计
| 指标 | 数量 | 覆盖率 |
|---|---|---|
| 类/接口/枚举 Javadoc | | |
| public 方法 Javadoc | | |
| 字段注释 | | |
| 混淆类（已标警告） | | |

## 5. 已知限制与人工复核建议

## 变更记录
| 版本 | 日期 | 说明 |
|---|---|---|
```

### 步骤 1：反编译 JAR

对 `jar_list` 中每个 JAR 文件，依次执行以下操作：

1. **确定单个 JAR 的输出目录**：
   - 若 `MAVEN_SCAFFOLD=no`：输出到 `{OUTPUT_DIR}/src/{jar-stem}/`（`jar-stem` 为 JAR 文件名去掉 `.jar` 后缀）。
   - 若 `MAVEN_SCAFFOLD=yes`：统一输出到 `{OUTPUT_DIR}/src/main/java/`（多个 JAR 合并到同一 Maven 源码树）。

2. **执行反编译**：调用以下命令：
   ```
   java -jar {CFR_JAR} {jar文件路径} --outputdir {单个JAR输出目录} --silent true --comments false
   ```
   - `--comments false`：关闭 CFR 自带注释，由 Claude 在步骤 3 统一补写。
   - `--caseinsensitivefs true`：跨平台文件系统兼容，按需添加。

3. **确认输出**：反编译完成后，统计该 JAR 产出的 `.java` 文件总数；若为 0，标记该 JAR 为 `反编译失败` 并记录可能原因（空 JAR、纯资源 JAR、加密 JAR 等）。

4. **更新报告**：在 `DECOMPILE_REPORT.md` § 1 追加本条记录。

5. **混淆检测**：扫描产出 `.java` 文件，若类名或方法名中超过 30% 为单字母或纯随机串（`\b[a-z]\b` 或 `[a-zA-Z]{1,2}\d*`），将该文件加入混淆文件列表 `obfuscated_files`。

### 步骤 2：整理目录结构

1. **包名目录验证**：检查反编译产物的目录层级是否与 `.java` 文件顶部 `package` 声明一致；若 CFR 已按包名组织，跳过；若存在偏差，按 `package` 声明移动文件到正确位置。

2. **Maven 骨架生成**（仅当 `MAVEN_SCAFFOLD=yes`）：在 `OUTPUT_DIR` 创建 `pom.xml` 最小骨架，创建标准目录 `src/main/java/`、`src/main/resources/`、`src/test/java/`。

   `pom.xml` 最小模板：
   ```xml
   <project>
     <modelVersion>4.0.0</modelVersion>
     <groupId>com.decompiled</groupId>
     <artifactId>{jar-stem}</artifactId>
     <version>1.0-SNAPSHOT</version>
     <properties>
       <java.version>8</java.version>
       <maven.compiler.source>${java.version}</maven.compiler.source>
       <maven.compiler.target>${java.version}</maven.compiler.target>
       <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
     </properties>
   </project>
   ```

3. **汇总文件清单**：生成完整的 `.java` 文件路径列表 `java_files`，按包名排序，作为步骤 3 注释补全的输入队列。

4. **记录混淆文件**：将 `obfuscated_files` 列表记录到报告 § 5，提示人工复核。

### 步骤 3：注释补全

这是本 Skill 的核心步骤。Claude 以批次方式逐一分析并修改 `.java` 文件，补写完整注释。

#### 3.1 批次划分策略

- 将 `java_files` 按每批 `BATCH_SIZE`（默认 5）个文件划分为若干批次。
- 若单个文件超过 500 行，该文件单独作为一个批次。
- 优先将同包类归入同批，便于 Claude 感知类间关系。
- 批次间维护轻量摘要表（类名 → 一句话用途），供后续批次参考依赖关系。

#### 3.2 每个文件的注释补全规则

对 `java_files` 中每个 `.java` 文件，依序执行：

**A. 混淆文件处理**：
若在 `obfuscated_files` 中，在文件最顶部插入：
```java
// [WARN] 疑似混淆类，以下注释基于代码结构推断，请人工复核后使用
```

**B. 类/接口/枚举 Javadoc**：
若顶层声明无 Javadoc，添加：
```java
/**
 * <根据类名、字段名、方法名推断的中文一句话用途描述>
 *
 * <p>反编译自 JAR，源码为还原近似结果，请以原始二进制为准。</p>
 *
 * @author unknown（反编译还原）
 * @since unknown
 */
```

**C. 字段注释**：
对每个字段（`private`/`protected`/`public` 均处理），若无注释，在字段声明上方添加：
```java
/** <字段含义中文描述，根据字段名和类型推断> */
```
若字段名完全无意义（混淆），注释为 `/** 混淆字段，含义未知 */`。

**D. 方法 Javadoc**：
- `public`/`protected` 方法：完整 Javadoc，包含中文功能描述 + `@param`（每个参数）+ `@return`（非 void）+ `@throws`（checked exception）。
- `private` 方法：仅需一行中文说明 `/** <中文功能描述> */`。
- getter/setter：若符合 JavaBeans 规范且字段已有注释，简写为 `/** 获取/设置 {字段含义} */`。

```java
/**
 * <根据方法名和方法体推断的中文功能描述>
 *
 * @param {参数名} {参数含义中文描述}
 * @return {返回值含义中文描述}
 * @throws {异常类型} {触发条件中文描述}
 */
```

**E. 枚举常量注释**：
对枚举每个常量，若无注释，添加：
```java
/** <枚举常量含义中文描述> */
```

**F. 复杂逻辑行内注释**：
在以下位置添加中文行内注释：
- 循环体超过 5 行时，在循环头部注释循环目的。
- 条件分支超过 3 层嵌套时，在关键 `if` 前注释判断意图。
- 位运算、魔法数字（如 `0xFF`、`1024`）处注释业务含义。
- `try-catch` 块中注释异常处理策略。
- 反编译产生的 `label`、`goto` 等结构旁注释控制流意图。

#### 3.3 批次执行流程

对每个批次：
1. 读取本批次所有文件内容。
2. 分析类层次与依赖关系。
3. 逐文件按 A→F 顺序补写注释。
4. 将修改后的文件写回原路径。
5. 在 `DECOMPILE_REPORT.md` § 2 追加本批次记录（批次号、文件数、状态、混淆文件数）。
6. 输出本批次处理摘要（处理文件数、主要业务模式、遇到的困难）。

### 步骤 4：编译验证（可选，推荐）

> 本步骤在 `MAVEN_SCAFFOLD=yes` 时自动执行；`MAVEN_SCAFFOLD=no` 时提示用户是否执行。

1. **执行 Maven 编译**：在 `OUTPUT_DIR` 运行 `mvn compile -q 2>&1`。若 `mvn` 不可用，记录"Maven 未安装，跳过编译验证"并继续步骤 5。

2. **分析编译结果**：
   - 编译通过（exit code 0）：记录"编译通过"。
   - 编译失败，分类统计：
     - **缺失依赖**（`cannot find symbol`）：属正常现象，建议用户补充 `pom.xml` 依赖；Claude 根据缺失类名推断可能的 Maven 坐标，追加到报告 § 5。
     - **语法错误**：CFR 还原不完整，列出具体文件和行号，建议改用 Fernflower 或 Procyon 作为备选。
     - **注释引入的错误**（极少见）：检查 Claude 补写的注释是否误插入代码区域，修正后重新验证。

3. **更新报告**：将编译结果填入 `DECOMPILE_REPORT.md` § 3。

### 步骤 5：输出报告

1. **统计注释覆盖率**：扫描所有 `.java` 文件，统计：
   - 顶级类/接口/枚举总数 vs 有 Javadoc 数 → 覆盖率百分比。
   - `public` 方法总数 vs 有 Javadoc 数 → 覆盖率百分比。
   - 字段总数 vs 有注释数 → 覆盖率百分比。
   - 混淆类数量及占比。

2. **完成报告填写**：将所有统计数据填入 `DECOMPILE_REPORT.md`，状态更新为 `已完成`，在 § 5 列出混淆文件清单和编译失败修复建议。

3. **向用户输出完成摘要**：
   ```
   JAR 反编译与注释补全完成
   ─────────────────────────
   处理 JAR：N 个
   生成 .java 文件：N 个
   注释覆盖率：
     类/接口/枚举 Javadoc：N%
     public 方法 Javadoc：N%
     字段注释：N%
   混淆文件（需人工复核）：N 个
   编译验证：通过 / 失败（N 个错误）
   报告路径：{OUTPUT_DIR}/DECOMPILE_REPORT.md
   ```

4. **后续建议**（追加到输出摘要末尾）：
   - 若存在混淆文件：建议人工复核报告 § 5 中的混淆文件清单。
   - 若编译失败且原因为缺失依赖：参考报告 § 5 的推断依赖列表，补充 `pom.xml` 后重新执行 `mvn compile`。
   - 若编译失败且原因为语法错误：建议检查具体文件，考虑改用 Fernflower（IntelliJ 内置）或 Procyon 反编译器。

## Quality Gate

完成前必须全部满足：

- [ ] `jar_list` 中每个 JAR 均有反编译结果记录（成功或失败原因）。
- [ ] `java_files` 中所有文件均已进行注释补全（包括混淆文件的警告注释）。
- [ ] 类/接口/枚举 Javadoc 覆盖率 ≥ 90%（混淆类除外）。
- [ ] `public` 方法 Javadoc 覆盖率 ≥ 85%（混淆类方法除外）。
- [ ] 字段注释覆盖率 ≥ 80%。
- [ ] 混淆文件已在报告中列出并标注 `[WARN]`。
- [ ] `DECOMPILE_REPORT.md` 状态已更新为 `已完成`，所有统计数据已填入。
- [ ] 编译验证结果已记录（即使跳过也须注明原因）。
- [ ] 注释内容为中文，未修改任何类结构、方法签名或包名。

## 断点恢复

> 通用恢复原则见根目录 `AGENTS.md` § 14。本章节声明本 Skill 的步骤级检查点；未列出的项回退到 `AGENTS.md` § 14.4 默认规则。

### 检查点表格

| 步骤 | 步骤名称 | 完成判定条件 | 续执起点 |
|---|---|---|---|
| 步骤 0 | 验证前置 | `OUTPUT_DIR` 已存在，`DECOMPILE_REPORT.md` 已创建（状态为进行中），CFR 工具与 Java 运行时已确认可用，`jar_list` 已确认 | 步骤 1 |
| 步骤 1 | 反编译 JAR | `DECOMPILE_REPORT.md` § 1 表格中所有 JAR 均有记录，且 `OUTPUT_DIR/src/` 下存在 `.java` 文件 | 步骤 2 |
| 步骤 2 | 整理目录结构 | 包名目录与 `package` 声明一致，Maven 骨架（若启用）已生成，`java_files` 清单已完整汇总 | 步骤 3 |
| 步骤 3 | 注释补全 | `DECOMPILE_REPORT.md` § 2 记录显示所有批次状态均为"完成"，且 `java_files` 中所有文件已含 Javadoc | 步骤 4 |
| 步骤 4 | 编译验证 | `DECOMPILE_REPORT.md` § 3 编译验证结果已填写（通过、失败或跳过均可） | 步骤 5 |
| 步骤 5 | 输出报告 | `DECOMPILE_REPORT.md` 状态为 `已完成`，覆盖率统计已填入 § 4，向用户输出完成摘要 | — |

### 默认恢复原则（兜底）

1. 若 `OUTPUT_DIR` 不存在或 `DECOMPILE_REPORT.md` 不存在，从步骤 0 全量执行。
2. 若 `DECOMPILE_REPORT.md` 存在且 § 2 有部分批次记录，从最后一个未完成批次续执注释补全（步骤 3），已完成批次不重复处理。
3. 若反编译已完成（`.java` 文件存在）但注释批次记录全部缺失，跳过步骤 1，从步骤 2 续执。
4. Gate Report 结论为 `BLOCKED` 时，从步骤 0 重新评估前置条件。
