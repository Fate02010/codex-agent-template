import { promises as fs } from "node:fs";
import path from "node:path";

const runDir = process.env.VG_RUN_DIR;
if (!runDir) {
  throw new Error("VG_RUN_DIR is required.");
}

const auditFile = path.join(runDir, "audit-result.json");
const reportFile = path.join(runDir, "VISUAL_GATE_REPORT.md");

const raw = await fs.readFile(auditFile, "utf8");
const audit = JSON.parse(raw);

const meta = audit.meta || {};
const summary = audit.summary || {};
const issues = Array.isArray(audit.issues) ? audit.issues : [];
const layoutMetrics = Array.isArray(audit.layoutMetrics) ? audit.layoutMetrics : [];

const rows = issues
  .map(
    (issue) =>
      `| ${issue.issueId || "-"} | ${issue.level || "-"} | ${issue.side || "-"} | ${issue.page || "-"} | ${issue.breakpoint || "-"} | ${issue.buildRule || "-"} | ${issue.boRule || "-"} | ${issue.uxBlock || "-"} | ${issue.description || "-"} | ${issue.evidence || "-"} |`
  )
  .join("\n");

const markdown = `# 视觉门禁报告

## 文档信息
- 生成时间：${meta.generatedAt || new Date().toISOString()}
- 运行阶段：${meta.phase || "-"}
- 检查侧别：${meta.profile || "-"}
- 门禁模式：${meta.mode || "-"}
- Run ID：${meta.runId || "-"}

## 结论
- 结论：${summary.verdict || "-"}
- Blocker：${summary.blockerCount ?? 0}
- Major：${summary.majorCount ?? 0}
- Minor：${summary.minorCount ?? 0}
- 总问题数：${summary.totalIssues ?? 0}

## 问题清单
| 编号 | 级别 | 侧别 | 页面 | 断点 | BUILD-RULE | BO-RULE | UX-BLOCK | 描述 | 证据 |
|---|---|---|---|---|---|---|---|---|---|
${rows || "| - | - | - | - | - | - | - | - | - | - |"}

## 布局度量
- layoutType：${summary.layoutType || "-"}
- scrollCost：${summary.scrollCost || "-"}
- firstScreenCoverage：${summary.firstScreenCoverage || "-"}
- formDensityBeforeList：${summary.formDensityBeforeList || "-"}
- toolbarOrderCheck：${summary.toolbarOrderCheck || "-"}
- pageResetCheck：${summary.pageResetCheck || "-"}

| 侧别 | 页面 | layoutType | inferredLayoutType | scrollCost | firstScreenCoverage | formDensityBeforeList | toolbarOrderCheck | pageResetCheck |
|---|---|---|---|---|---|---|---|---|
${layoutMetrics
  .map(
    (m) =>
      `| ${m.side || "-"} | ${m.page || "-"} | ${m.layoutType || "-"} | ${m.inferredLayoutType || "-"} | ${m.scrollCost ?? "-"} | ${m.firstScreenCoverage ? `${m.firstScreenCoverage.hasFilter ? 1 : 0}/${m.firstScreenCoverage.hasTableHeader ? 1 : 0}/${m.firstScreenCoverage.hasFirstRow ? 1 : 0}` : "-"} | ${m.formDensityBeforeList ? `${m.formDensityBeforeList.fieldCount}/${m.formDensityBeforeList.heightRatio}` : "-"} | ${m.toolbarOrderCheck || "-"} | ${m.pageResetCheck || "-"} |`
  )
  .join("\n") || "| - | - | - | - | - | - | - | - | - |"}

## 判定说明
- \`FAIL\`：命中任意 Blocker，或在 strict 模式命中 Major。
- \`PASS\`：未命中阻塞判定条件。
- \`BLOCKED\`：运行环境或自动安装失败，无法完成门禁。
`;

await fs.writeFile(reportFile, markdown, "utf8");
