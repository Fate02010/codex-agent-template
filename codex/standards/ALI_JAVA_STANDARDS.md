# 阿里巴巴 Java 开发规范摘要（嵩山版）

> 来源：《阿里巴巴 Java 开发手册（嵩山版）》
> 本文件为精华提炼，供 `backend-implement` **按层按需读取**，避免一次性加载全文导致 context 过大。
> 标注【强制】/【推荐】，严重度与原书一致。

## 使用方式（按实现层读取）

| 实现层 | 必读章节 |
|---|---|
| infrastructure（PO / Mapper / Repository） | 第 0 节 + 第 1 节 + 第 5 节 + 第 6 节 |
| domain（Entity / Value Object / Domain Service） | 第 0 节 + 第 2 节 + 第 5 节 + 第 6 节 |
| application（Application Service / Command / Query） | 第 0 节 + 第 3 节 + 第 5 节 + 第 6 节 |
| interfaces（Controller / DTO / Assembler） | 第 0 节 + 第 4 节 + 第 5 节 + 第 6 节 |
| 测试代码（src/test/java） | 第 7 节 |

---

## 0. 通用命名规范（所有层必读）

- 【强制】包名统一小写，点分隔符之间只有一个自然语义英文单词，禁止数字开头
- 【强制】类名使用 UpperCamelCase；方法名/参数名/变量名使用 lowerCamelCase；常量使用 UPPER_SNAKE_CASE
- 【强制】异常类以 `Exception` 结尾；抽象类以 `Abstract` 或 `Base` 开头；测试类以 `Test` 结尾
- 【强制】数据对象命名规约：`xxxDO`（数据库映射）、`xxxDTO`（传输层）、`xxxVO`（视图层）、`xxxPO` 等，禁用 `xxxPOJO`
- 【强制】数组类型与中括号紧连：`String[] args`，不写成 `String args[]`
- 【推荐】名称应完整表达语义，不为缩短命名牺牲可读性
- 【推荐】使用了设计模式的类/方法，命名中体现模式（如 `XxxFactory`、`XxxStrategy`、`XxxProxy`）

---

## 1. Infrastructure 层规范（PO / Mapper / Repository）

### 数据库字段 & ORM 映射
- 【强制】布尔字段命名 `is_xxx`，数据类型 `unsigned tinyint`（1 表示是，0 表示否）
- 【强制】表名/字段名全小写字母或数字，禁用保留字（`desc`、`range`、`match`、`delayed` 等）
- 【强制】小数类型用 `decimal`，禁止使用 `float` 和 `double`（精度丢失）
- 【强制】`varchar` 长度不超 5000，超出改用 `text` 类型并拆分独立表
- 【强制】主键索引名 `pk_字段名`；唯一索引名 `uk_字段名`；普通索引名 `idx_字段名`
- 【强制】表必备字段：`id`、`create_time`、`update_time`（与 DATA_MODEL.md 公共字段对齐）
- 【推荐】冗余字段须满足：非频繁修改、非唯一索引字段、非 varchar 超长字段

### Mapper / SQL
- 【强制】禁止在 SQL 中使用 `SELECT *`，必须列出所需字段
- 【强制】禁止在循环中执行 SQL，需改为批量操作（`INSERT INTO ... VALUES (...),(...)` 或批量 update）
- 【推荐】JOIN 表不超过 3 张；WHERE 条件超过 5 个考虑拆分或分页

---

## 2. Domain 层规范（Entity / Value Object / Domain Service）

### OOP
- 【强制】所有覆写方法必须加 `@Override` 注解
- 【强制】`equals` 和 `hashCode` 必须成对实现，只写 `equals` 不写 `hashCode` 会破坏集合行为
- 【强制】`equals` 调用方须为常量或确保非 null 的对象（`"constant".equals(variable)`），防止 NPE
- 【强制】整型包装对象（`Integer`/`Long` 等）比较全部使用 `equals`，不得用 `==`
- 【强制】禁止通过实例访问静态变量/方法，直接用类名调用
- 【强制】不使用已 `@Deprecated` 的类或方法
- 【推荐】设计模式在命名中体现（`XxxFactory`、`XxxStrategy`）

### 集合
- 【强制】判断集合是否为空用 `isEmpty()`，不得用 `size() == 0`
- 【强制】`Collectors.toMap()` 必须处理 key 重复（提供 mergeFunction）和 value 为 null 的情况
- 【强制】`Arrays.asList()` 返回结果不可调用 `add/remove/clear`（会抛 `UnsupportedOperationException`）
- 【强制】`ArrayList.subList()` 结果不可强转 `ArrayList`（会抛 `ClassCastException`）
- 【强制】`Collections.emptyList()` 等返回的 immutable 集合不可做增删操作

---

## 3. Application 层规范（Application Service / Command / Query）

### 并发
- 【强制】禁止直接 `new Thread()`，必须通过线程池管理线程
- 【强制】禁止使用 `Executors` 工厂方法创建线程池（有资源耗尽风险），改用 `ThreadPoolExecutor` 显式配置
- 【强制】线程池和线程必须指定有业务含义的名称，便于排查问题
- 【强制】`SimpleDateFormat` 不可定义为 `static`（线程不安全），或必须加锁，推荐用 `DateTimeFormatter`
- 【强制】`ThreadLocal` 变量必须在 `try-finally` 中调用 `remove()` 回收，防止内存泄漏
- 【强制】同时加锁多个资源时保持全局一致的加锁顺序，防止死锁
- 【推荐】锁粒度：优先无锁数据结构 → 锁区块 → 锁方法体 → 类锁，从小到大

### 异常处理
- 【强制】可通过预检查规避的 `RuntimeException`（NPE、`IndexOutOfBoundsException` 等）不得用 `catch` 规避，应主动判断
- 【强制】不得用异常控制业务流程
- 【强制】`catch` 后必须处理或向上抛出，禁止空 `catch` 块吃掉异常
- 【强制】事务场景中，`catch` 后需要回滚时必须手动调用回滚（`TransactionAspectSupport.currentTransactionStatus().setRollbackOnly()`）
- 【强制】`finally` 块必须关闭资源（流/连接），且禁止在 `finally` 中 `return`
- 【推荐】调用 RPC 或二方包时，用 `Throwable` 捕获而非 `Exception`，防止漏捕 `Error`

---

## 4. Interfaces 层规范（Controller / DTO / Assembler）

### 接口与参数
- 【强制】对外暴露的接口签名（方法名、参数类型、顺序）不允许修改，避免影响调用方
- 【强制】禁止使用已 `@Deprecated` 的类或方法
- 【强制】可变参数（`...`）只在相同参数类型且同一业务含义时使用，禁止用 `Object` 可变参数
- 【推荐】接口参数和返回值优先使用基础类型包装类（`Integer` 而非 `int`），便于判空

---

## 5. 日志规范（所有层）

- 【强制】只使用 SLF4J / JCL 日志门面，禁止直接调用 Log4j、Logback 等实现类 API
- 【强制】日志输出使用占位符：`log.info("userId={}, result={}", userId, result)`，禁止字符串拼接
- 【强制】禁止使用 `System.out`、`System.err` 输出日志，禁止 `e.printStackTrace()`
- 【强制】`trace`/`debug`/`info` 级别输出前，必须先判断日志级别是否开启（`if (log.isDebugEnabled())`）
- 【强制】避免重复打印：日志配置 `additivity=false`
- 【强制】异常日志必须同时包含：现场上下文信息 + 完整堆栈（`log.error("msg={}", msg, e)`）
- 【推荐】生产环境禁止开启 debug 日志；谨慎使用 warn（频繁告警会掩盖真实问题）

---

## 6. 注释规范（所有层）

- 【强制】类/属性/方法注释使用 Javadoc（`/** ... */`），禁止用 `// xxx` 替代类级注释
- 【强制】所有类必须在 Javadoc 中注明 `@author` 和创建日期
- 【强制】所有抽象方法（含接口方法）必须有 Javadoc，说明：功能描述、`@param`、`@return`、`@throws`
- 【强制】枚举类型每个字段必须注释说明用途
- 【强制】方法内单行注释：另起一行，使用 `//`，与被注释代码对齐；多行注释使用 `/* ... */`
- 【推荐】注释随代码同步修改，删除废弃的注释；宁可用中文写清楚，也不要写半生不熟的英文
- 【推荐】删除方法中未使用的参数声明和变量声明

---

## 7. 单元测试规范（Test 层）

- 【强制】遵守 AIR 原则：Automatic（全自动执行，无需人工干预）、Independent（用例间独立，不互相调用，不依赖执行顺序）、Repeatable（可重复执行，不受外部环境影响）
- 【强制】测试代码放 `src/test/java`，禁止放业务代码目录
- 【强制】单元测试中禁止直接访问数据库，必须使用 Mock（`@MockBean`、`Mockito.mock()` 等）
- 【强制】测试用例之间不允许互相调用，不依赖执行顺序
- 【推荐】语句覆盖率 ≥ 70%；核心模块语句覆盖率和分支覆盖率均达 100%
- 【推荐】增量代码必须保证单元测试通过（核心业务、核心应用、核心模块）
