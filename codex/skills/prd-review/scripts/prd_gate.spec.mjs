import { promises as fs } from "node:fs";
import path from "node:path";

const mode = (process.env.PRD_GATE_MODE || "compose").trim();
const repoRoot = process.env.PRD_GATE_REPO_ROOT || process.cwd();
const now = new Date().toISOString();

const prdRawFile = process.env.PRD_RAW_FILE || path.join(repoRoot, "docs", "01-requirements", "PRD_RAW.md");
const prdReviewFile = process.env.PRD_REVIEW_FILE || path.join(repoRoot, "docs", "01-requirements", "PRD_REVIEW_ISSUES.md");
const prdRectifiedFile = process.env.PRD_RECTIFIED_FILE || path.join(repoRoot, "docs", "01-requirements", "PRD_RECTIFIED.md");
const outputDir = process.env.PRD_GATE_OUTPUT_DIR || path.join(repoRoot, "docs", "01-requirements");

const MODE_CONFIG = {
  compose: {
    reportMd: path.join(outputDir, "PRD_RAW_GATE_REPORT.md"),
    reportJson: path.join(outputDir, "PRD_RAW_GATE_RESULT.json"),
  },
  review: {
    reportMd: path.join(outputDir, "PRD_REVIEW_FAILFAST_REPORT.md"),
    reportJson: path.join(outputDir, "PRD_REVIEW_FAILFAST_RESULT.json"),
  },
  rectify: {
    reportMd: path.join(outputDir, "PRD_RECTIFIED_GATE_REPORT.md"),
    reportJson: path.join(outputDir, "PRD_RECTIFIED_GATE_RESULT.json"),
  },
  "solution-precheck": {
    reportMd: path.join(outputDir, "PRD_SOLUTION_PRECHECK_REPORT.md"),
    reportJson: path.join(outputDir, "PRD_SOLUTION_PRECHECK_RESULT.json"),
  },
};

if (!MODE_CONFIG[mode]) {
  throw new Error(`Unsupported PRD_GATE_MODE: ${mode}`);
}

const readIfExists = async (filePath) => {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
};

const isBlankLike = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return true;
  if (["-", "--", "/", "N/A", "NA", "无", "待补充", "待确认"].includes(raw)) return true;
  if (/^\[.+\]$/.test(raw)) return true;
  if (/^(示例|示意|TBD|TODO)$/i.test(raw)) return true;
  return false;
};

const splitFSections = (content) => {
  const re = /^###\s*(F\d{3})\b[^\n]*$/gm;
  const matches = [...content.matchAll(re)];
  if (matches.length === 0) return [];
  return matches.map((m, idx) => {
    const start = m.index;
    const end = idx + 1 < matches.length ? matches[idx + 1].index : content.length;
    const id = m[1];
    return { id, title: m[0].trim(), text: content.slice(start, end) };
  });
};

const parseTableAfterHeading = (sectionText, headingRegex) => {
  const lines = sectionText.split(/\r?\n/);
  const headingIdx = lines.findIndex((line) => headingRegex.test(line.trim()));
  if (headingIdx < 0) return null;

  let i = headingIdx + 1;
  while (i < lines.length && !lines[i].trim()) i += 1;
  if (i >= lines.length || !lines[i].trim().startsWith("|")) return null;

  const tableLines = [];
  while (i < lines.length && lines[i].trim().startsWith("|")) {
    tableLines.push(lines[i].trim());
    i += 1;
  }
  if (tableLines.length < 2) return null;

  const parseRow = (row) =>
    row
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());

  const header = parseRow(tableLines[0]);
  const rows = tableLines
    .slice(2)
    .map(parseRow)
    .filter((r) => r.some((c) => String(c || "").trim().length > 0));

  return { header, rows };
};

const parseUiBullets = (sectionText) => {
  const uiStart = sectionText.search(/^####\s*UI约束必填块（强制）\s*$/m);
  if (uiStart < 0) return {};
  const rest = sectionText.slice(uiStart);
  const stopMatch = rest.match(/^####\s+/m);
  const block = stopMatch ? rest.slice(0, stopMatch.index) : rest;

  const map = {};
  const lineRe = /^-\s*([^：:]+)[:：]\s*(.*)$/gm;
  for (const m of block.matchAll(lineRe)) {
    map[m[1].trim()] = m[2].trim();
  }
  return map;
};

const getColumnIndex = (header, keys) => {
  for (let i = 0; i < header.length; i += 1) {
    const h = header[i];
    if (keys.some((k) => h.includes(k))) return i;
  }
  return -1;
};

const collectIdDuplicates = (content, prefix) => {
  const re = new RegExp(`\\b${prefix}-[A-Z]+-\\d{3}\\b`, "g");
  const all = [...content.matchAll(re)].map((m) => m[0]);
  const count = new Map();
  all.forEach((id) => count.set(id, (count.get(id) || 0) + 1));
  return [...count.entries()].filter(([, n]) => n > 1).map(([id, n]) => ({ id, count: n }));
};

const numberingCheck = (fSections) => {
  const ids = fSections.map((s) => Number(s.id.slice(1)));
  const unique = new Set(ids);
  const duplicate = [...unique]
    .filter((n) => ids.filter((x) => x === n).length > 1)
    .map((n) => `F${String(n).padStart(3, "0")}`);
  const max = ids.length ? Math.max(...ids) : 0;
  const missing = [];
  for (let i = 1; i <= max; i += 1) {
    if (!unique.has(i)) missing.push(`F${String(i).padStart(3, "0")}`);
  }
  return { missing, duplicate };
};

const REQUIRED_UI_KEYS = [
  "页面类型",
  "布局模板",
  "页面目标",
  "主任务",
  "首屏主任务区块",
  "主操作",
  "次操作",
  "危险操作",
  "字段展示映射",
  "文案规范",
  "状态标签规则",
  "反馈规则",
];

const REQUIRED_LAYOUT_KEYS = [
  "首屏主任务区块",
  "主任务滚动预算",
  "列表/维护解耦策略",
  "工具栏顺序",
  "筛选后分页重置规则",
];

const scanCompose = (content) => {
  const checks = [];
  const fSections = splitFSections(content);
  const numberResult = numberingCheck(fSections);
  const brDup = collectIdDuplicates(content, "BR");
  const exDup = collectIdDuplicates(content, "EX");
  const acDup = collectIdDuplicates(content, "AC");

  const numberingFailed = fSections.length === 0 || numberResult.missing.length > 0 || numberResult.duplicate.length > 0 || brDup.length > 0 || exDup.length > 0 || acDup.length > 0;

  checks.push({
    id: "COMPOSE-NUM-001",
    name: "编号完整性检查",
    status: numberingFailed ? "FAIL" : "PASS",
    message: numberingFailed
      ? `F缺失:${numberResult.missing.join(",") || "无"}; F重复:${numberResult.duplicate.join(",") || "无"}; BR重复:${brDup.map((x) => `${x.id}x${x.count}`).join(",") || "无"}; EX重复:${exDup.map((x) => `${x.id}x${x.count}`).join(",") || "无"}; AC重复:${acDup.map((x) => `${x.id}x${x.count}`).join(",") || "无"}`
      : "编号连续且唯一",
    evidence: [
      `F_total=${fSections.length}`,
      `missing=${numberResult.missing.join(",") || "none"}`,
      `duplicate=${numberResult.duplicate.join(",") || "none"}`,
    ],
  });

  const fieldMissing = [];
  const uiMissing = [];
  const layoutMissing = [];

  for (const section of fSections) {
    const fieldTable = parseTableAfterHeading(section.text, /^####\s*字段清单\s*$/);
    if (!fieldTable) {
      fieldMissing.push({ f: section.id, field: "(字段清单)", missing: ["字段清单表格缺失"] });
    } else {
      const idxField = getColumnIndex(fieldTable.header, ["字段名"]);
      const idxType = getColumnIndex(fieldTable.header, ["类型"]);
      const idxLen = getColumnIndex(fieldTable.header, ["长度", "精度"]);
      const idxRequired = getColumnIndex(fieldTable.header, ["必填"]);
      const idxValidate = getColumnIndex(fieldTable.header, ["校验规则", "格式", "枚举"]);
      const idxNull = getColumnIndex(fieldTable.header, ["空值策略", "空值"]);
      const idxErr = getColumnIndex(fieldTable.header, ["错误提示"]);

      if ([idxType, idxLen, idxRequired, idxValidate, idxNull, idxErr].some((x) => x < 0)) {
        fieldMissing.push({
          f: section.id,
          field: "(字段清单表头)",
          missing: ["缺少必需列: 类型/长度精度/必填/校验规则/空值策略/错误提示"],
        });
      } else {
        for (const row of fieldTable.rows) {
          const fieldName = idxField >= 0 ? row[idxField] || "(未命名字段)" : "(未命名字段)";
          const miss = [];
          if (isBlankLike(row[idxType])) miss.push("类型");
          if (isBlankLike(row[idxLen])) miss.push("长度/精度");
          if (isBlankLike(row[idxRequired])) miss.push("必填");
          if (isBlankLike(row[idxValidate])) miss.push("校验规则");
          if (isBlankLike(row[idxNull])) miss.push("空值策略");
          if (isBlankLike(row[idxErr])) miss.push("错误提示");
          if (miss.length > 0) {
            fieldMissing.push({ f: section.id, field: fieldName, missing: miss });
          }
        }
      }
    }

    const uiMap = parseUiBullets(section.text);
    const uiMiss = REQUIRED_UI_KEYS.filter((k) => !(k in uiMap) || isBlankLike(uiMap[k]));
    if (uiMiss.length > 0) uiMissing.push({ f: section.id, missing: uiMiss });

    const layoutMiss = REQUIRED_LAYOUT_KEYS.filter((k) => !(k in uiMap) || isBlankLike(uiMap[k]));
    if (layoutMiss.length > 0) layoutMissing.push({ f: section.id, missing: layoutMiss });
  }

  checks.push({
    id: "COMPOSE-FIELD-001",
    name: "字段约束完整性检查",
    status: fieldMissing.length > 0 ? "FAIL" : "PASS",
    message: fieldMissing.length > 0 ? `存在 ${fieldMissing.length} 条字段约束缺失` : "字段约束完整",
    evidence: fieldMissing.map((x) => `${x.f}:${x.field}:${x.missing.join("/")}`).slice(0, 50),
    details: fieldMissing,
  });

  checks.push({
    id: "COMPOSE-UI-001",
    name: "UI约束必填块检查",
    status: uiMissing.length > 0 ? "FAIL" : "PASS",
    message: uiMissing.length > 0 ? `存在 ${uiMissing.length} 个功能点缺失UI必填项` : "UI约束必填块完整",
    evidence: uiMissing.map((x) => `${x.f}:${x.missing.join("/")}`).slice(0, 50),
    details: uiMissing,
  });

  checks.push({
    id: "COMPOSE-LAYOUT-001",
    name: "后台排版约束检查",
    status: layoutMissing.length > 0 ? "FAIL" : "PASS",
    message: layoutMissing.length > 0 ? `存在 ${layoutMissing.length} 个功能点缺失排版约束` : "后台排版约束完整",
    evidence: layoutMissing.map((x) => `${x.f}:${x.missing.join("/")}`).slice(0, 50),
    details: layoutMissing,
  });

  return checks;
};

const scanReviewFailfast = (content) => {
  const checks = [];
  const fSections = splitFSections(content);
  const failRows = [];

  const pushFail = (gate, reason, f) => failRows.push({ gate, reason, f });

  for (const section of fSections) {
    const uiMap = parseUiBullets(section.text);

    const infoMiss = ["页面目标", "主任务", "首屏主任务区块"].filter((k) => !(k in uiMap) || isBlankLike(uiMap[k]));
    if (infoMiss.length > 0) pushFail("信息层级", `${section.id} 缺失 ${infoMiss.join("/")}`, section.id);

    const primaryLines = [...section.text.matchAll(/^-\s*主操作[:：]\s*(.*)$/gm)];
    if (primaryLines.length !== 1 || isBlankLike(primaryLines[0]?.[1] || "")) {
      pushFail("主按钮唯一性", `${section.id} 主操作定义异常（数量=${primaryLines.length}）`, section.id);
    } else {
      const value = primaryLines[0][1];
      const tokenCount = value
        .split(/[、，,;；\/]/)
        .map((x) => x.trim())
        .filter((x) => x.length > 0).length;
      if (tokenCount > 1) pushFail("主按钮唯一性", `${section.id} 主操作疑似多个动作`, section.id);
    }

    const technicalFieldHit = section.text.match(/\bfrom_status\b|\bto_status\b|\bbiz_id\b|\buser_id\b|\b\w+_(?:id|status|time|date|at|by|flag|code|no|num)\b|\bbiz_\w+\b|\buser_\w+\b|\bis_\w+\b|\bhas_\w+\b|\bcreate[d]?_\w+\b|\bupdate[d]?_\w+\b|\bdelete[d]?_\w+\b/gi);
    if (technicalFieldHit && technicalFieldHit.length > 0) {
      pushFail("文案中文化", `${section.id} 存在技术字段直出: ${[...new Set(technicalFieldHit)].slice(0, 5).join(",")}`, section.id);
    }

    const statusTable = parseTableAfterHeading(section.text, /^#####\s*状态标签规则\s*$/);
    if (!statusTable) {
      pushFail("状态标签完整性", `${section.id} 缺少状态标签规则表`, section.id);
    } else {
      const idxLabel = getColumnIndex(statusTable.header, ["标签文案"]);
      const idxColor = getColumnIndex(statusTable.header, ["颜色语义"]);
      const idxDisabled = getColumnIndex(statusTable.header, ["禁用态规则"]);
      const idxClickable = getColumnIndex(statusTable.header, ["可点击态规则"]);
      if ([idxLabel, idxColor, idxDisabled, idxClickable].some((x) => x < 0)) {
        pushFail("状态标签完整性", `${section.id} 状态标签规则表头缺失`, section.id);
      } else {
        const bad = statusTable.rows.some((row) => [idxLabel, idxColor, idxDisabled, idxClickable].some((idx) => isBlankLike(row[idx])));
        if (bad) pushFail("状态标签完整性", `${section.id} 状态标签规则存在空项`, section.id);
      }
    }

    const feedbackTable = parseTableAfterHeading(section.text, /^#####\s*反馈规则\s*$/);
    if (!feedbackTable) {
      pushFail("交互闭环", `${section.id} 缺少反馈规则表`, section.id);
    } else {
      const idxScene = getColumnIndex(feedbackTable.header, ["场景"]);
      const scenes = idxScene >= 0 ? feedbackTable.rows.map((r) => (r[idxScene] || "").trim()) : [];
      for (const s of ["空态", "加载态", "失败态", "成功态"]) {
        if (!scenes.some((x) => x.includes(s))) pushFail("交互闭环", `${section.id} 反馈规则缺少 ${s}`, section.id);
      }
    }

    const pageType = uiMap["页面类型"] || "";
    const layoutTemplate = uiMap["布局模板"] || "";
    if (isBlankLike(pageType) || isBlankLike(layoutTemplate)) {
      pushFail("页面类型与布局模板匹配", `${section.id} 页面类型或布局模板缺失`, section.id);
    } else {
      const matched =
        (pageType.includes("查看") && layoutTemplate.includes("列表主视图")) ||
        (pageType.includes("维护") && layoutTemplate.includes("表单主视图")) ||
        (pageType.includes("处理") && layoutTemplate.includes("双栏处理视图"));
      if (!matched) pushFail("页面类型与布局模板匹配", `${section.id} 页面类型与布局模板不匹配`, section.id);
    }

    const tool = uiMap["工具栏顺序"] || "";
    if (!tool.includes("筛选") || !tool.includes("结果") || !tool.includes("分页")) {
      pushFail("工具栏顺序与分页语义", `${section.id} 工具栏顺序缺失筛选/结果/分页`, section.id);
    }

    if (!("筛选后分页重置规则" in uiMap) || isBlankLike(uiMap["筛选后分页重置规则"])) {
      pushFail("筛选后分页重置", `${section.id} 筛选后分页重置规则缺失`, section.id);
    }

    // 主任务首屏可见检查
    const firstScreen = uiMap["首屏主任务区块"] || "";
    if (isBlankLike(firstScreen)) {
      pushFail("主任务首屏可见", `${section.id} 首屏主任务区块缺失或未明确说明首屏可见信息`, section.id);
    }

    // 列表页前置重表单检查
    if (pageType.includes("查看") && layoutTemplate.includes("列表主视图")) {
      const decoupleStrategy = uiMap["列表/维护解耦策略"] || "";
      // 检查主流程中是否存在"上重表单下长列表"相关描述且无解耦策略
      const hasHeavyFormPattern = /上.*表单.*下.*列表|表单.*前置|表单.*压制/i.test(section.text);
      if (hasHeavyFormPattern && isBlankLike(decoupleStrategy)) {
        pushFail("列表页前置重表单", `${section.id} 列表页存在前置重表单布局且无解耦策略`, section.id);
      }
      if (isBlankLike(decoupleStrategy)) {
        pushFail("列表页前置重表单", `${section.id} 列表主视图页面未定义列表/维护解耦策略`, section.id);
      }
    }

    // 主任务跨屏依赖检查
    const scrollBudget = uiMap["主任务滚动预算"] || "";
    if (isBlankLike(scrollBudget)) {
      pushFail("主任务跨屏依赖", `${section.id} 主任务滚动预算未定义`, section.id);
    } else if (/超过\s*1\s*屏|[2-9]\s*屏|多屏/i.test(scrollBudget) && !/例外|补偿|原因|理由/i.test(scrollBudget)) {
      pushFail("主任务跨屏依赖", `${section.id} 滚动预算超过1屏但未说明例外理由与补偿策略`, section.id);
    }

    // 双主流程冲突检查（补充：检测同页存在多个主动作链）
    const primaryOps = [...section.text.matchAll(/^-\s*主操作[:：]\s*(.*)$/gm)];
    if (primaryOps.length > 1) {
      pushFail("双主流程冲突", `${section.id} 同页存在 ${primaryOps.length} 个主操作定义，疑似双主流程冲突`, section.id);
    } else if (primaryOps.length === 1) {
      const value = primaryOps[0][1] || "";
      const actionChains = value.split(/[、，,;；]/).map((x) => x.trim()).filter((x) => x.length > 0);
      if (actionChains.length > 1) {
        pushFail("双主流程冲突", `${section.id} 主操作包含多个动作链（${actionChains.length}个），疑似双主流程冲突`, section.id);
      }
    }
  }

  const gates = [
    "信息层级",
    "主按钮唯一性",
    "文案中文化",
    "状态标签完整性",
    "交互闭环",
    "页面类型与布局模板匹配",
    "主任务首屏可见",
    "列表页前置重表单",
    "主任务跨屏依赖",
    "双主流程冲突",
    "工具栏顺序与分页语义",
    "筛选后分页重置",
  ];

  for (const gate of gates) {
    const rows = failRows.filter((x) => x.gate === gate);
    checks.push({
      id: `REVIEW-${gate}`,
      name: gate,
      status: rows.length > 0 ? "FAIL" : "PASS",
      message: rows.length > 0 ? rows.map((x) => x.reason).join("; ") : "通过",
      evidence: rows.map((x) => x.reason),
      details: rows,
    });
  }

  return checks;
};

const parseBlockerIssueIds = (reviewContent) => {
  const lines = reviewContent.split(/\r?\n/);
  let inBlocker = false;
  const ids = new Set();
  for (const line of lines) {
    if (/^###\s*🔴/.test(line.trim())) {
      inBlocker = true;
      continue;
    }
    if (/^###\s*/.test(line.trim()) && !/^###\s*🔴/.test(line.trim())) {
      inBlocker = false;
    }
    if (inBlocker) {
      for (const m of line.matchAll(/\bISSUE-\d+\b/g)) ids.add(m[0]);
    }
  }
  return [...ids];
};

const statusLine = (content) => {
  const m = content.match(/^\s*-\s*状态[:：]\s*(.+)$/m);
  return (m?.[1] || "").trim();
};

const isExplicitFrozen = (content) => {
  const s = statusLine(content);
  if (!s) return false;
  if (/模板|草稿|评审中|已整改|->|→|\//.test(s)) return false;
  return /已冻结/.test(s);
};

const buildReport = (modeName, checks) => {
  const failChecks = checks.filter((c) => c.status === "FAIL");
  const verdict = failChecks.length > 0 ? "FAIL" : "PASS";
  return {
    meta: { mode: modeName, generatedAt: now, repoRoot },
    summary: {
      verdict,
      totalChecks: checks.length,
      failCount: failChecks.length,
      passCount: checks.length - failChecks.length,
      blockerCount: failChecks.length,
      level: failChecks.length > 0 ? "Blocker" : "Pass",
    },
    checks,
  };
};

const writeReport = async (report, reportMd, reportJson, title) => {
  await fs.mkdir(path.dirname(reportMd), { recursive: true });
  await fs.writeFile(reportJson, JSON.stringify(report, null, 2), "utf8");

  const rows = report.checks
    .map((c) => `| ${c.name} | ${c.status === "PASS" ? "✅" : "❌"} | ${c.message.replace(/\|/g, "\\|")} |`)
    .join("\n");

  const failRows = report.checks
    .filter((c) => c.status === "FAIL")
    .map((c) => `- ${c.name}: ${c.message}`)
    .join("\n");

  const md = `# ${title}\n\n## 检查结果：${report.summary.verdict === "PASS" ? "✅ 通过" : "❌ 未通过"}\n\n- 模式：\`${report.meta.mode}\`\n- 时间：${report.meta.generatedAt}\n- 总检查项：${report.summary.totalChecks}\n- 失败项：${report.summary.failCount}\n\n## 检查项明细\n| 检查项 | 结果 | 说明 |\n|---|---|---|\n${rows || "| - | - | - |"}\n\n## 阻塞项\n${failRows || "- 无"}\n\n## 机器可读结果\n- JSON: \`${path.relative(repoRoot, reportJson)}\`\n`;

  await fs.writeFile(reportMd, md, "utf8");
};

const runCompose = async (content) => {
  const checks = [];

  // 前置校验：检查上游输入文件是否存在且非模板状态
  const researchFile = path.join(repoRoot, "docs", "00-research", "RESEARCH_SUMMARY.md");
  const clarifiedFile = path.join(repoRoot, "docs", "00-research", "REQUIREMENTS_CLARIFIED.md");

  const researchContent = await readIfExists(researchFile);
  const clarifiedContent = await readIfExists(clarifiedFile);

  const isTemplateState = (text) => {
    if (!text) return true;
    const s = statusLine(text);
    return !s || /模板|草稿|TBD|TODO/i.test(s);
  };

  const precondFail = [];
  if (!researchContent) precondFail.push("RESEARCH_SUMMARY.md 不存在");
  else if (isTemplateState(researchContent)) precondFail.push("RESEARCH_SUMMARY.md 处于模板状态");

  if (!clarifiedContent) precondFail.push("REQUIREMENTS_CLARIFIED.md 不存在");
  else if (isTemplateState(clarifiedContent)) precondFail.push("REQUIREMENTS_CLARIFIED.md 处于模板状态");

  checks.push({
    id: "COMPOSE-PRECOND-001",
    name: "前置输入文件校验",
    status: precondFail.length > 0 ? "FAIL" : "PASS",
    message: precondFail.length > 0 ? precondFail.join("; ") : "上游输入文件就绪",
    evidence: precondFail,
  });

  // 继续执行内容检查
  checks.push(...scanCompose(content));
  return buildReport("compose", checks);
};

const runReview = async (content) => {
  const checks = scanReviewFailfast(content);
  return buildReport("review", checks);
};

const runRectify = async (rectifiedContent, reviewContent) => {
  const composeChecks = scanCompose(rectifiedContent);
  const reviewChecks = scanReviewFailfast(rectifiedContent);

  const blockerIds = parseBlockerIssueIds(reviewContent || "");
  const unresolved = blockerIds.filter((id) => !rectifiedContent.includes(id));

  const checks = [
    ...composeChecks.map((c) => ({ ...c, id: `RECTIFY-${c.id}` })),
    ...reviewChecks.map((c) => ({ ...c, id: `RECTIFY-${c.id}` })),
    {
      id: "RECTIFY-BLOCKER-CLOSE-001",
      name: "阻塞问题关闭检查",
      status: unresolved.length > 0 ? "FAIL" : "PASS",
      message:
        unresolved.length > 0
          ? `未在 PRD_RECTIFIED.md 中识别到已闭环阻塞问题: ${unresolved.join(",")}`
          : "阻塞问题已闭环",
      evidence: unresolved,
      details: unresolved,
    },
  ];

  // 阻塞设计类待确认项检查
  const blockDesignPattern = /【待确认】.*(?:影响接口|影响表结构|主流程|状态机|权限|接口拆分)|(?:影响接口|影响表结构|主流程|状态机|权限|接口拆分).*【待确认】/g;
  const blockDesignHits = [...rectifiedContent.matchAll(blockDesignPattern)].map((m) => m[0].slice(0, 80));

  // 检查待确认事项表格中类型为"阻塞设计"的行
  const pendingTable = parseTableAfterHeading(rectifiedContent, /^##\s*(?:7\.\s*)?遗留待确认与风险|^##\s*(?:8\.\s*)?待确认事项/);
  const blockDesignRows = [];
  if (pendingTable) {
    const typeIdx = getColumnIndex(pendingTable.header, ["类型"]);
    const markIdx = getColumnIndex(pendingTable.header, ["标记"]);
    if (typeIdx >= 0) {
      for (const row of pendingTable.rows) {
        const typeVal = (row[typeIdx] || "").trim();
        const markVal = markIdx >= 0 ? (row[markIdx] || "").trim() : "";
        if (typeVal.includes("阻塞设计") && (markVal.includes("待确认") || markVal.includes("【待确认】"))) {
          blockDesignRows.push(row.join(" | "));
        }
      }
    }
  }

  const allBlockDesign = [...blockDesignHits, ...blockDesignRows];
  checks.push({
    id: "RECTIFY-BLOCK-DESIGN-001",
    name: "阻塞设计类待确认项检查",
    status: allBlockDesign.length > 0 ? "FAIL" : "PASS",
    message:
      allBlockDesign.length > 0
        ? `存在 ${allBlockDesign.length} 个未收敛的阻塞设计类待确认项`
        : "无未收敛的阻塞设计类待确认项",
    evidence: allBlockDesign.slice(0, 20),
    details: allBlockDesign,
  });

  return buildReport("rectify", checks);
};

const runSolutionPrecheck = async (rectifiedContent) => {
  const checks = [];
  checks.push({
    id: "SOLUTION-PRECHECK-001",
    name: "PRD冻结状态检查",
    status: isExplicitFrozen(rectifiedContent) ? "PASS" : "FAIL",
    message: isExplicitFrozen(rectifiedContent)
      ? "PRD_RECTIFIED.md 状态已冻结"
      : `PRD_RECTIFIED.md 状态未显式冻结（状态行=${statusLine(rectifiedContent) || "未找到"}）`,
    evidence: [statusLine(rectifiedContent) || "状态行缺失"],
  });

  const rectifyGateJson = await readIfExists(path.join(outputDir, "PRD_RECTIFIED_GATE_RESULT.json"));
  if (!rectifyGateJson) {
    checks.push({
      id: "SOLUTION-PRECHECK-002",
      name: "冻结门禁报告检查",
      status: "FAIL",
      message: "缺少 PRD_RECTIFIED_GATE_RESULT.json",
      evidence: [path.join(outputDir, "PRD_RECTIFIED_GATE_RESULT.json")],
    });
  } else {
    let parsed = null;
    try {
      parsed = JSON.parse(rectifyGateJson);
    } catch {
      parsed = null;
    }
    const pass = parsed?.summary?.verdict === "PASS";
    checks.push({
      id: "SOLUTION-PRECHECK-002",
      name: "冻结门禁报告检查",
      status: pass ? "PASS" : "FAIL",
      message: pass ? "冻结门禁报告通过" : "冻结门禁报告不存在或未通过",
      evidence: [path.join(outputDir, "PRD_RECTIFIED_GATE_RESULT.json")],
    });
  }

  return buildReport("solution-precheck", checks);
};

const main = async () => {
  const { reportMd, reportJson } = MODE_CONFIG[mode];
  let report;

  if (mode === "compose") {
    const content = await readIfExists(prdRawFile);
    if (!content) throw new Error(`Missing file: ${prdRawFile}`);
    report = await runCompose(content);
    await writeReport(report, reportMd, reportJson, "PRD_RAW 门禁检查报告");
  } else if (mode === "review") {
    const content = await readIfExists(prdRawFile);
    if (!content) throw new Error(`Missing file: ${prdRawFile}`);
    report = await runReview(content);
    await writeReport(report, reportMd, reportJson, "PRD_REVIEW Fail-fast 门禁扫描报告");
  } else if (mode === "rectify") {
    const rectified = await readIfExists(prdRectifiedFile);
    const reviewIssues = await readIfExists(prdReviewFile);
    if (!rectified) throw new Error(`Missing file: ${prdRectifiedFile}`);
    if (!reviewIssues) throw new Error(`Missing file: ${prdReviewFile}`);
    report = await runRectify(rectified, reviewIssues);
    await writeReport(report, reportMd, reportJson, "PRD_RECTIFIED 冻结前门禁检查报告");
  } else if (mode === "solution-precheck") {
    const rectified = await readIfExists(prdRectifiedFile);
    if (!rectified) throw new Error(`Missing file: ${prdRectifiedFile}`);
    report = await runSolutionPrecheck(rectified);
    await writeReport(report, reportMd, reportJson, "Solution Design 前置冻结检查报告");
  }

  if (report.summary.verdict === "PASS") {
    process.exit(0);
  }
  process.exit(2);
};

main().catch(async (err) => {
  const { reportMd, reportJson } = MODE_CONFIG[mode];
  const fallback = {
    meta: { mode, generatedAt: now, repoRoot },
    summary: {
      verdict: "BLOCKED",
      totalChecks: 1,
      failCount: 1,
      passCount: 0,
      blockerCount: 1,
      level: "Blocker",
    },
    checks: [
      {
        id: "PRD-GATE-BLOCKED-001",
        name: "执行异常",
        status: "FAIL",
        message: String(err?.message || err),
        evidence: ["script runtime"],
      },
    ],
  };

  try {
    await writeReport(fallback, reportMd, reportJson, "PRD 门禁检查报告（阻塞）");
  } catch {
    // ignore
  }
  process.exit(20);
});
