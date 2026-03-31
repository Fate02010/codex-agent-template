# prd-compose Validation Fixture

本目录用于验证强化后的 `prd-compose` 契约，不属于正式项目基线文档。

## 目的

- 提供一组非模板、可追溯的输入样例：
  - `RESEARCH_SUMMARY.md`
  - `REQUIREMENTS_CLARIFIED.md`
- 提供一份按新版契约整理的目标输出样例：
  - `PRD_RAW.md`

## 覆盖点

- 一个无独立状态机的功能
- 一个有明确状态流转的功能
- `角色-权限-动作矩阵`
- `追溯矩阵`
- `BR-*` / `EX-*` / `AC-*` 编号
- 普通待确认与阻塞设计区分

## 使用方式

1. 以 `RESEARCH_SUMMARY.md` 和 `REQUIREMENTS_CLARIFIED.md` 作为 `prd-compose` 输入参考。
2. 对照 `PRD_RAW.md` 检查新版 Skill 是否能稳定输出所需结构。
3. 执行 `doc-check` 时，可将本目录文档作为人工对照样例，验证新校验规则是否覆盖关键结构。
