import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const phase = process.env.VG_PHASE || "check";
const profile = process.env.VG_PROFILE || "both";
const mode = process.env.VG_MODE || "build";
const runId = process.env.VG_RUN_ID || new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
const repoRoot = process.env.VG_REPO_ROOT || process.cwd();
const prototypeRoot = process.env.VG_PROTOTYPE_ROOT || path.join(repoRoot, "frontend", "design-prototype");
const runDir = process.env.VG_RUN_DIR || path.join(repoRoot, "docs", "02-design", ".visual-check", runId);
const playwrightEntry = process.env.PLAYWRIGHT_NODE_ENTRY;

if (!playwrightEntry) {
  throw new Error("PLAYWRIGHT_NODE_ENTRY is required.");
}

const { chromium } = await import(pathToFileURL(playwrightEntry).href);

const breakpoints = [
  { name: "1440", width: 1440, height: 900 },
  { name: "1200", width: 1200, height: 900 },
  { name: "992", width: 992, height: 900 },
  { name: "768", width: 768, height: 1024 },
  { name: "375", width: 375, height: 812 },
];

await fs.mkdir(runDir, { recursive: true });
const screenshotsRoot = path.join(runDir, "screenshots");
await fs.mkdir(screenshotsRoot, { recursive: true });

const sides = profile === "both" ? ["display", "acceptance"] : [profile];
const issues = [];
let issueSeq = 1;
const pageMetrics = [];

const addIssue = ({
  level,
  type,
  side,
  page,
  breakpoint = "-",
  buildRule = "-",
  boRule = "-",
  uxBlock = "-",
  description,
  location = "-",
  impact,
  suggestion,
  evidence,
}) => {
  issues.push({
    issueId: `VG-${String(issueSeq).padStart(4, "0")}`,
    level,
    type,
    side,
    page,
    breakpoint,
    buildRule,
    boRule,
    uxBlock,
    description,
    location,
    impact,
    suggestion,
    evidence,
    blockDevImplement: level === "Blocker" ? "是" : "否",
  });
  issueSeq += 1;
};

const listHtmlFiles = async (dir) => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
      .map((entry) => path.join(dir, entry.name))
      .sort();
  } catch {
    return [];
  }
};

const absToFileUrl = (filePath) => pathToFileURL(path.resolve(filePath)).href;
const relRunPath = (filePath) => path.relative(runDir, filePath).replaceAll(path.sep, "/");

const toScreens = (px, viewportHeight) => {
  if (!viewportHeight || viewportHeight <= 0) return 0;
  return Number((px / viewportHeight).toFixed(2));
};

const geometryEval = () => {
  const visible = (el) => {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      parseFloat(style.opacity || "1") > 0 &&
      rect.width > 0 &&
      rect.height > 0
    );
  };

  const xOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;

  const textNodes = Array.from(document.querySelectorAll("p,span,td,th,label,a,button,h1,h2,h3,h4,h5,h6"));
  const textOverflowSamples = [];
  let textOverflowCount = 0;
  for (const el of textNodes) {
    if (!visible(el)) continue;
    if (el.clientWidth <= 0) continue;
    const text = (el.textContent || "").trim();
    if (!text) continue;
    if (el.scrollWidth > el.clientWidth + 2) {
      textOverflowCount += 1;
      if (textOverflowSamples.length < 5) {
        textOverflowSamples.push(text.slice(0, 32));
      }
    }
  }

  const controls = Array.from(
    document.querySelectorAll("button,input,select,textarea,.el-button,.ant-btn,[role='button']")
  ).filter(visible);
  let controlHeightCount = 0;
  for (const el of controls) {
    const h = el.getBoundingClientRect().height;
    if (h > 0 && (h < 28 || h > 60)) controlHeightCount += 1;
  }

  const overlapTargets = controls.slice(0, 80).map((el) => ({
    tag: el.tagName,
    rect: el.getBoundingClientRect(),
  }));
  let overlapCount = 0;
  for (let i = 0; i < overlapTargets.length; i += 1) {
    for (let j = i + 1; j < overlapTargets.length; j += 1) {
      const a = overlapTargets[i].rect;
      const b = overlapTargets[j].rect;
      const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (w > 0 && h > 0 && w * h >= 120 && a.width >= 40 && b.width >= 40) {
        overlapCount += 1;
        if (overlapCount >= 8) break;
      }
    }
    if (overlapCount >= 8) break;
  }

  let tableCompressed = false;
  if (window.innerWidth <= 992) {
    const tables = Array.from(document.querySelectorAll("table"));
    for (const table of tables) {
      const cells = Array.from(table.querySelectorAll("th,td"));
      if (!cells.length) continue;
      let minWidth = Infinity;
      for (const cell of cells) {
        const width = cell.getBoundingClientRect().width;
        if (width > 0 && width < minWidth) minWidth = width;
      }
      if (minWidth < 72) {
        tableCompressed = true;
        break;
      }
    }
  }

  return {
    xOverflow,
    textOverflowCount,
    textOverflowSamples,
    controlHeightCount,
    overlapCount,
    tableCompressed,
  };
};

const clickEvalForPrefill = () => {
  const dialog = document.querySelector(".el-dialog,.ant-modal,.modal,[role='dialog'],.dialog");
  if (!dialog) return null;
  const fields = Array.from(dialog.querySelectorAll("input,textarea,select")).filter((el) => {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  });
  if (!fields.length) return true;
  return fields.some((el) => {
    if (typeof el.value === "string" && el.value.trim().length > 0) return true;
    const text = (el.textContent || "").trim();
    return text.length > 0;
  });
};

const pageStructureEval = () => {
  const viewportHeight = window.innerHeight;
  const byVisible = (el) => {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  };

  const table =
    document.querySelector("table") ||
    document.querySelector(".el-table") ||
    document.querySelector(".ant-table") ||
    document.querySelector("[data-table]");
  const tableRect = table ? table.getBoundingClientRect() : null;

  let tableHeaderVisible = false;
  let firstRowVisible = false;
  if (table) {
    const firstHead = table.querySelector("thead tr th,thead tr");
    const firstRow = table.querySelector("tbody tr,[role='row']");
    if (firstHead) {
      const rect = firstHead.getBoundingClientRect();
      tableHeaderVisible = rect.top < viewportHeight && rect.bottom > 0;
    }
    if (firstRow) {
      const rect = firstRow.getBoundingClientRect();
      firstRowVisible = rect.top < viewportHeight && rect.bottom > 0;
    }
  }

  const filterQuery =
    document.querySelector("button[data-testid*='query']") ||
    Array.from(document.querySelectorAll("button,a,[role='button']")).find((el) =>
      /查询|搜索|search/i.test((el.textContent || "").trim())
    );
  const filterReset =
    document.querySelector("button[data-testid*='reset']") ||
    Array.from(document.querySelectorAll("button,a,[role='button']")).find((el) =>
      /重置|清空|reset/i.test((el.textContent || "").trim())
    );
  const filterVisible =
    !!filterQuery && byVisible(filterQuery) && !!filterReset && byVisible(filterReset);

  const pagination =
    document.querySelector(".el-pagination") ||
    document.querySelector(".ant-pagination") ||
    document.querySelector("[data-pagination]") ||
    Array.from(document.querySelectorAll("button,a,[role='button']")).some((el) =>
      /上一页|下一页|prev|next/i.test((el.textContent || "").trim())
    );
  const paginationNode =
    document.querySelector(".el-pagination,.ant-pagination,[data-pagination]") || null;
  const paginationTop = paginationNode ? paginationNode.getBoundingClientRect().top : null;

  const editable = Array.from(document.querySelectorAll("input,select,textarea")).filter(byVisible);
  let beforeListCount = 0;
  let beforeListHeight = 0;
  if (tableRect) {
    const tops = [];
    for (const field of editable) {
      const rect = field.getBoundingClientRect();
      if (rect.top < tableRect.top) {
        beforeListCount += 1;
        tops.push(rect.bottom);
      }
    }
    if (tops.length > 0) beforeListHeight = Math.max(...tops);
  }

  const bodyType = (document.body?.getAttribute("data-page-type") || "").trim();
  const layoutTemplate = (document.body?.getAttribute("data-layout-template") || "").trim();
  const declaredLayoutType = bodyType || "UNDECLARED";
  const declaredLayoutTemplate = layoutTemplate || "UNDECLARED";

  const inferredLayoutType = (() => {
    const hasTable = !!table;
    const formHeavy = beforeListCount > 6 || (beforeListHeight > 0 && beforeListHeight / viewportHeight > 0.45);
    if (hasTable && formHeavy) return "LIST_WITH_HEAVY_FORM";
    if (hasTable && !formHeavy) return "LIST_PRIMARY";
    if (!hasTable && editable.length > 6) return "FORM_PRIMARY";
    return "MIXED";
  })();

  const firstScreenCoverage = {
    hasFilter: !!filterVisible,
    hasTableHeader: !!tableHeaderVisible,
    hasFirstRow: !!firstRowVisible,
  };

  const tableTop = tableRect ? tableRect.top : null;
  const scrollCostScreens = tableTop && tableTop > 0 ? Number((tableTop / viewportHeight).toFixed(2)) : 0;

  const toolbarOrderCheck = {
    hasFilter: !!filterVisible,
    hasTable: !!table,
    hasPagination: !!pagination,
    pass:
      filterVisible &&
      !!table &&
      !!pagination &&
      tableRect &&
      paginationTop !== null &&
      filterQuery.getBoundingClientRect().top <= tableRect.top &&
      tableRect.top <= paginationTop,
  };

  return {
    viewportHeight,
    hasTable: !!table,
    tableTop,
    paginationTop,
    firstScreenCoverage,
    formDensityBeforeList: {
      fieldCount: beforeListCount,
      heightRatio: Number(((beforeListHeight || 0) / viewportHeight).toFixed(2)),
    },
    declaredLayoutType,
    declaredLayoutTemplate,
    inferredLayoutType,
    scrollCost: scrollCostScreens,
    toolbarOrderCheck,
  };
};

const analyzePage = async (browser, side, htmlFile) => {
  const pageName = path.basename(htmlFile);
  const pageUrl = absToFileUrl(htmlFile);
  const sideDir = path.join(screenshotsRoot, side);
  await fs.mkdir(sideDir, { recursive: true });

  for (const bp of breakpoints) {
    const bpDir = path.join(sideDir, bp.name);
    await fs.mkdir(bpDir, { recursive: true });
    const context = await browser.newContext({ viewport: { width: bp.width, height: bp.height } });
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(120);
    const shot = path.join(bpDir, pageName.replace(/\.html$/, ".png"));
    await page.screenshot({ path: shot, fullPage: true });
    const geometry = await page.evaluate(geometryEval);

    if (geometry.xOverflow) {
      addIssue({
        level: "Blocker",
        type: "layout-deformation",
        side,
        page: pageName,
        breakpoint: bp.name,
        buildRule: "BUILD-RULE-005",
        boRule: "BO-RULE-001",
        description: "页面出现横向滚动，影响可读与可操作性。",
        location: "documentElement.scrollWidth",
        impact: "关键内容可能被遮挡，主流程不可稳定完成。",
        suggestion: "收敛内容宽度，修复超宽容器并校正断点布局。",
        evidence: relRunPath(shot),
      });
    }

    if (geometry.overlapCount > 0) {
      addIssue({
        level: "Blocker",
        type: "layout-deformation",
        side,
        page: pageName,
        breakpoint: bp.name,
        buildRule: "BUILD-RULE-005",
        boRule: "BO-RULE-001",
        description: "交互控件发生重叠，点击区域不可判定。",
        location: "interactive-controls",
        impact: "误触概率高，关键任务中断。",
        suggestion: "调整栅格、间距与组件宽度，避免控件重叠。",
        evidence: `${relRunPath(shot)} (overlapCount=${geometry.overlapCount})`,
      });
    }

    if (geometry.tableCompressed) {
      addIssue({
        level: "Blocker",
        type: "layout-deformation",
        side,
        page: pageName,
        breakpoint: bp.name,
        buildRule: "BUILD-RULE-001",
        boRule: "BO-RULE-008",
        uxBlock: "UX-BLOCK-001",
        description: "表格列压缩不可读。",
        location: "table-layout",
        impact: "列表信息不可识别，分页/筛选闭环失效。",
        suggestion: "优化列宽策略，移动断点使用列折叠或横向信息分层。",
        evidence: relRunPath(shot),
      });
    }

    if (geometry.textOverflowCount >= 3) {
      addIssue({
        level: "Major",
        type: "layout-deformation",
        side,
        page: pageName,
        breakpoint: bp.name,
        buildRule: "BUILD-RULE-005",
        boRule: "BO-RULE-005",
        description: "检测到多处文本溢出。",
        location: geometry.textOverflowSamples.join(" | ") || "text-nodes",
        impact: "文案可读性下降，业务语义不完整。",
        suggestion: "调整字段文案长度、容器宽度与换行策略。",
        evidence: `${relRunPath(shot)} (textOverflowCount=${geometry.textOverflowCount})`,
      });
    }

    if (geometry.controlHeightCount >= 3) {
      addIssue({
        level: "Major",
        type: "layout-deformation",
        side,
        page: pageName,
        breakpoint: bp.name,
        buildRule: "BUILD-RULE-005",
        boRule: "BO-RULE-003",
        description: "按钮/输入框高度异常，视觉层级不一致。",
        location: "form-controls",
        impact: "控件语义优先级混乱，误操作风险增加。",
        suggestion: "统一控件高度并按主次操作规范排版。",
        evidence: `${relRunPath(shot)} (controlHeightCount=${geometry.controlHeightCount})`,
      });
    }

    await context.close();
  }

  const interactionContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await interactionContext.newPage();
  await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 25000 });
  await page.waitForTimeout(150);

  const interactionShot = path.join(sideDir, "1440", pageName.replace(/\.html$/, "-interaction.png"));
  const structure = await page.evaluate(pageStructureEval);

  const metricItem = {
    side,
    page: pageName,
    layoutType: `${structure.declaredLayoutType}/${structure.declaredLayoutTemplate}`,
    inferredLayoutType: structure.inferredLayoutType,
    scrollCost: structure.scrollCost,
    firstScreenCoverage: structure.firstScreenCoverage,
    formDensityBeforeList: structure.formDensityBeforeList,
    toolbarOrderCheck: structure.toolbarOrderCheck?.pass ? "PASS" : "FAIL",
    pageResetCheck: "UNKNOWN",
  };

  if (structure.hasTable) {
    if (!structure.firstScreenCoverage.hasFilter || !structure.firstScreenCoverage.hasTableHeader || !structure.firstScreenCoverage.hasFirstRow) {
      addIssue({
        level: "Blocker",
        type: "layout-structure",
        side,
        page: pageName,
        breakpoint: "1440",
        buildRule: "BUILD-RULE-010",
        boRule: "BO-RULE-012",
        uxBlock: "UX-BLOCK-007",
        description: "主任务关键区块首屏不可见（筛选/表头/首行缺失）。",
        location: "first-screen-coverage",
        impact: "用户无法在首屏进入主任务闭环。",
        suggestion: "将筛选区与列表主视图前置到首屏，确保首行可见。",
        evidence: relRunPath(interactionShot),
      });
    }

    if (
      structure.formDensityBeforeList.fieldCount > 6 ||
      structure.formDensityBeforeList.heightRatio > 0.45
    ) {
      addIssue({
        level: "Blocker",
        type: "layout-structure",
        side,
        page: pageName,
        breakpoint: "1440",
        buildRule: "BUILD-RULE-011",
        boRule: "BO-RULE-013",
        uxBlock: "UX-BLOCK-008",
        description: "列表页出现前置重表单，压制主列表任务。",
        location: "form-before-list",
        impact: "列表主任务被次任务占据首屏，操作效率显著下降。",
        suggestion: "改为弹窗/抽屉/Tab 解耦，或将列表主视图上移。",
        evidence: `${relRunPath(interactionShot)} (fieldCount=${structure.formDensityBeforeList.fieldCount}, ratio=${structure.formDensityBeforeList.heightRatio})`,
      });
    }

    if (structure.scrollCost > 1.2) {
      addIssue({
        level: "Blocker",
        type: "layout-structure",
        side,
        page: pageName,
        breakpoint: "1440",
        buildRule: "BUILD-RULE-013",
        boRule: "BO-RULE-014",
        uxBlock: "UX-BLOCK-008",
        description: "关键任务路径存在跨屏依赖，滚动预算超限。",
        location: "scroll-cost",
        impact: "关键操作需跨屏滚动才能触达，不符合后台处理效率预期。",
        suggestion: "压缩首屏结构，或拆分任务区块并提供就近入口。",
        evidence: `${relRunPath(interactionShot)} (scrollCost=${structure.scrollCost})`,
      });
    }

    if (!structure.toolbarOrderCheck?.pass) {
      addIssue({
        level: "Blocker",
        type: "layout-structure",
        side,
        page: pageName,
        breakpoint: "1440",
        buildRule: "BUILD-RULE-012",
        boRule: "BO-RULE-016",
        uxBlock: "UX-BLOCK-011",
        description: "工具栏顺序不满足筛选 -> 结果 -> 分页。",
        location: "toolbar-order",
        impact: "列表闭环顺序混乱，降低查询与处理效率。",
        suggestion: "调整页面结构顺序，确保筛选/结果/分页语义清晰。",
        evidence: relRunPath(interactionShot),
      });
    }
  }

  const declaredType = structure.declaredLayoutType;
  const declaredTemplate = structure.declaredLayoutTemplate;
  if (declaredType !== "UNDECLARED" && declaredTemplate !== "UNDECLARED") {
    const layoutMatched =
      (declaredType === "查看型页面" && declaredTemplate === "列表主视图") ||
      (declaredType === "维护型页面" && declaredTemplate === "表单主视图") ||
      (declaredType === "处理型页面" && declaredTemplate === "双栏处理视图");
    if (!layoutMatched) {
      addIssue({
        level: "Blocker",
        type: "layout-structure",
        side,
        page: pageName,
        breakpoint: "1440",
        buildRule: "BUILD-RULE-010",
        boRule: "BO-RULE-011",
        uxBlock: "UX-BLOCK-009",
        description: "页面类型与布局模板不匹配。",
        location: `data-page-type=${declaredType}, data-layout-template=${declaredTemplate}`,
        impact: "页面结构与任务模型错配，易导致主流程混乱。",
        suggestion: "按页面类型回归标准模板，或更新上游声明。",
        evidence: relRunPath(interactionShot),
      });
    }
  }

  const activeSelector = ".is-active,.active,[aria-current='page'],[aria-selected='true']";
  const clickable = page.locator("a,button,[role='button'],[role='tab'],[role='menuitem']");

  const navCandidate = clickable.filter({ hasText: /会员|状态|等级|积分|权益|标签|规则|审计/ }).first();
  if ((await navCandidate.count()) > 0) {
    await navCandidate.click({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(100);
    const activeCount = await page.locator(activeSelector).count();
    if (activeCount === 0) {
      addIssue({
        level: "Blocker",
        type: "interaction",
        side,
        page: pageName,
        breakpoint: "1440",
        buildRule: "BUILD-RULE-005",
        boRule: "BO-RULE-002",
        uxBlock: "UX-BLOCK-005",
        description: "导航点击后无选中态反馈。",
        location: "navigation",
        impact: "用户无法确认当前页面位置，主流程辨识失败。",
        suggestion: "为导航项补充 active 样式或 aria-current 标识。",
        evidence: relRunPath(interactionShot),
      });
    }
  }

  const tableCount = await page.locator("table,.el-table,.ant-table,[data-table]").count();

  if (tableCount > 0) {
    const queryBtn = clickable.filter({ hasText: /查询|搜索|search/i }).first();
    const resetBtn = clickable.filter({ hasText: /重置|清空|reset/i }).first();
    const hasQuery = (await queryBtn.count()) > 0;
    const hasReset = (await resetBtn.count()) > 0;
    if (!hasQuery || !hasReset) {
      addIssue({
        level: "Blocker",
        type: "interaction",
        side,
        page: pageName,
        breakpoint: "1440",
        buildRule: "BUILD-RULE-007",
        boRule: "BO-RULE-008",
        uxBlock: "UX-BLOCK-004",
        description: "列表筛选闭环缺失（查询/重置不完整）。",
        location: "filter-region",
        impact: "列表过滤无法闭环，无法快速定位业务对象。",
        suggestion: "补齐筛选字段并同时提供查询与重置按钮。",
        evidence: relRunPath(interactionShot),
      });
    }

    const prevBtn = clickable.filter({ hasText: /上一页|上页|prev/i }).first();
    const nextBtn = clickable.filter({ hasText: /下一页|下页|next/i }).first();
    const pageNum = clickable.filter({ hasText: /^[0-9]{1,3}$/ }).first();
    const totalHint = await page.locator("text=/共\\s*\\d+\\s*条|total/i").count();
    const currentHint = await page.locator("text=/第\\s*\\d+\\s*页|current/i").count();
    const hasPrev = (await prevBtn.count()) > 0;
    const hasNext = (await nextBtn.count()) > 0;
    const hasNum = (await pageNum.count()) > 0;
    if (!hasPrev || !hasNext || !hasNum) {
      addIssue({
        level: "Blocker",
        type: "interaction",
        side,
        page: pageName,
        breakpoint: "1440",
        buildRule: "BUILD-RULE-001",
        boRule: "BO-RULE-008",
        uxBlock: "UX-BLOCK-001",
        description: "列表分页交互缺失（上一页/下一页/页码不完整）。",
        location: "pagination-region",
        impact: "多页数据无法稳定访问，验收闭环失败。",
        suggestion: "补齐分页组件的核心元素与交互反馈。",
        evidence: relRunPath(interactionShot),
      });
    }
    if (totalHint === 0 || currentHint === 0) {
      addIssue({
        level: "Blocker",
        type: "interaction",
        side,
        page: pageName,
        breakpoint: "1440",
        buildRule: "BUILD-RULE-014",
        boRule: "BO-RULE-021",
        uxBlock: "UX-BLOCK-011",
        description: "分页语义缺失（总数/当前页信息不完整）。",
        location: "pagination-semantic",
        impact: "分页状态不可读，用户无法确认当前位置与数据规模。",
        suggestion: "补齐总数与当前页语义提示。",
        evidence: relRunPath(interactionShot),
      });
    }

    if (hasQuery && hasNum) {
      const activeBefore = (await page.locator(".el-pagination .is-active,.ant-pagination-item-active,.pagination .active,[data-pagination] .active").first().textContent().catch(() => ""))?.trim() || "";
      await queryBtn.click({ timeout: 1500 }).catch(() => {});
      await page.waitForTimeout(120);
      const activeAfter = (await page.locator(".el-pagination .is-active,.ant-pagination-item-active,.pagination .active,[data-pagination] .active").first().textContent().catch(() => ""))?.trim() || "";
      if (activeAfter && !/^1$/.test(activeAfter)) {
        addIssue({
          level: "Blocker",
          type: "interaction",
          side,
          page: pageName,
          breakpoint: "1440",
          buildRule: "BUILD-RULE-014",
          boRule: "BO-RULE-022",
          uxBlock: "UX-BLOCK-012",
          description: "筛选后分页未重置到第 1 页。",
          location: `page-before=${activeBefore || "-"}, page-after=${activeAfter}`,
          impact: "筛选结果上下文错位，易导致误判数据范围。",
          suggestion: "筛选/排序后默认重置分页到第 1 页。",
          evidence: relRunPath(interactionShot),
        });
        metricItem.pageResetCheck = "FAIL";
      } else {
        metricItem.pageResetCheck = "PASS";
      }
    }
  }

  const primaryButtons = page.locator(
    "button.primary,.btn-primary,.el-button--primary,.ant-btn-primary,[data-variant='primary'],[data-role='primary-action']"
  );
  const primaryCount = await primaryButtons.count();
  if (primaryCount > 1) {
    addIssue({
      level: "Blocker",
      type: "interaction",
      side,
      page: pageName,
      breakpoint: "1440",
      buildRule: "BUILD-RULE-015",
      boRule: "BO-RULE-015",
      uxBlock: "UX-BLOCK-010",
      description: "同层出现多个主按钮，存在双主流程冲突。",
      location: "primary-actions",
      impact: "主流程焦点冲突，用户无法确认当前主任务。",
      suggestion: "每页仅保留一个主操作按钮，其余降级并合并到同一任务链。",
      evidence: relRunPath(interactionShot),
    });
  }

  const primaryBulk = await page.evaluate(() => {
    const nodes = Array.from(
      document.querySelectorAll(
        "button.primary,.btn-primary,.el-button--primary,.ant-btn-primary,[data-variant='primary'],[data-role='primary-action']"
      )
    );
    return nodes.some((node) => /选中|批量/.test((node.textContent || "").trim()));
  });
  if (primaryBulk) {
    const hasSelection = (await page.locator("input[type='checkbox'],[role='checkbox']").count()) > 0;
    const hasSelectedHint = (await page.locator("text=/已选|selected/i").count()) > 0;
    if (!hasSelection || !hasSelectedHint) {
      addIssue({
        level: "Blocker",
        type: "interaction",
        side,
        page: pageName,
        breakpoint: "1440",
        buildRule: "BUILD-RULE-008",
        boRule: "BO-RULE-009",
        uxBlock: "UX-BLOCK-005",
        description: "主操作语义与选择机制不一致。",
        location: "primary-action-semantics",
        impact: "批量操作不可预期，误操作风险高。",
        suggestion: "补齐选择控件与已选反馈，再保留“选中/批量”文案。",
        evidence: relRunPath(interactionShot),
      });
    }
  }

  const createOrEdit = clickable.filter({ hasText: /新建|新增|创建|编辑/ }).first();
  if ((await createOrEdit.count()) > 0) {
    await createOrEdit.click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(180);
    const dialog = page.locator(".el-dialog,.ant-modal,.modal,[role='dialog'],.dialog").first();
    const dialogVisible = (await dialog.count()) > 0 && (await dialog.isVisible().catch(() => false));
    if (!dialogVisible) {
      addIssue({
        level: "Blocker",
        type: "interaction",
        side,
        page: pageName,
        breakpoint: "1440",
        buildRule: "BUILD-RULE-002",
        boRule: "BO-RULE-002",
        uxBlock: "UX-BLOCK-002",
        description: "新建/编辑未使用弹窗交互承载。",
        location: "create-edit-entry",
        impact: "维护流程偏离设计基线，验收门禁不通过。",
        suggestion: "将新建/编辑改为弹窗交互，并保持列表上下文。",
        evidence: relRunPath(interactionShot),
      });
    } else {
      const prefilled = await page.evaluate(clickEvalForPrefill);
      if (prefilled === false) {
        addIssue({
          level: "Blocker",
          type: "interaction",
          side,
          page: pageName,
          breakpoint: "1440",
          buildRule: "BUILD-RULE-003",
          boRule: "BO-RULE-007",
          uxBlock: "UX-BLOCK-003",
          description: "编辑弹窗未检测到预填内容。",
          location: "edit-dialog-form",
          impact: "编辑语义不成立，用户无法确认被修改对象。",
          suggestion: "打开编辑弹窗时回填当前行数据。",
          evidence: relRunPath(interactionShot),
        });
      }
      await page.keyboard.press("Escape").catch(() => {});
    }
  }

  const pageText = await page.evaluate(() => (document.body?.innerText || "").toLowerCase());
  for (const token of ["from_status", "to_status", "biz_id", "user_id"]) {
    if (pageText.includes(token)) {
      addIssue({
        level: "Blocker",
        type: "content",
        side,
        page: pageName,
        breakpoint: "1440",
        buildRule: "BUILD-RULE-005",
        boRule: "BO-RULE-005",
        description: `检测到技术字段直出：${token}`,
        location: "page-text",
        impact: "业务用户不可理解，文案门禁不通过。",
        suggestion: "将技术字段映射为中文业务标签后再展示。",
        evidence: relRunPath(interactionShot),
      });
      break;
    }
  }

  const unknownBlocks = await page.evaluate(() => {
    const whitelistAttr = document.body?.getAttribute("data-block-whitelist") || "";
    const whitelist = whitelistAttr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const blockIds = Array.from(document.querySelectorAll("[data-block-id]"))
      .map((el) => el.getAttribute("data-block-id") || "")
      .filter(Boolean);
    if (!whitelist.length || !blockIds.length) return [];
    return blockIds.filter((id) => !whitelist.includes(id)).slice(0, 5);
  });

  if (unknownBlocks.length > 0) {
    addIssue({
      level: "Blocker",
      type: "interaction",
      side,
      page: pageName,
      breakpoint: "1440",
      buildRule: "BUILD-RULE-009",
      boRule: "BO-RULE-010",
      uxBlock: "UX-BLOCK-006",
      description: `页面区块越界：${unknownBlocks.join(", ")}`,
      location: "data-block-id",
      impact: "页面出现未声明区块，信息架构漂移。",
      suggestion: "移除越界区块或回写白名单并补充上游设计依据。",
      evidence: relRunPath(interactionShot),
    });
  }

  await page.screenshot({ path: interactionShot, fullPage: true });
  pageMetrics.push(metricItem);
  await interactionContext.close();
};

const audit = {
  meta: {
    phase,
    profile,
    mode,
    runId,
    generatedAt: new Date().toISOString(),
    repoRoot,
    prototypeRoot,
    breakpoints: breakpoints.map((bp) => bp.name),
  },
  pages: [],
  summary: {
    verdict: "PASS",
    totalIssues: 0,
    blockerCount: 0,
    majorCount: 0,
    minorCount: 0,
  },
  layoutMetrics: pageMetrics,
  issues,
};

const browser = await chromium.launch({ headless: true });
try {
  let pageCount = 0;
  for (const side of sides) {
    const sideDir = path.join(prototypeRoot, side);
    const htmlFiles = await listHtmlFiles(sideDir);
    if (htmlFiles.length === 0) {
      addIssue({
        level: "Blocker",
        type: "coverage",
        side,
        page: "-",
        breakpoint: "-",
        buildRule: "BUILD-RULE-005",
        boRule: "BO-RULE-001",
        description: `${side} 原型目录缺失或无 HTML 页面。`,
        location: sideDir,
        impact: "视觉门禁无法覆盖主流程页面。",
        suggestion: "先完成对应 profile 的 prototype-build 再执行门禁。",
        evidence: sideDir,
      });
      continue;
    }
    for (const htmlFile of htmlFiles) {
      pageCount += 1;
      audit.pages.push({ side, page: path.basename(htmlFile), file: htmlFile });
      await analyzePage(browser, side, htmlFile);
    }
  }

  if (pageCount === 0) {
    addIssue({
      level: "Blocker",
      type: "coverage",
      side: profile,
      page: "-",
      breakpoint: "-",
      buildRule: "-",
      boRule: "-",
      description: "未找到可检查页面。",
      location: prototypeRoot,
      impact: "无法形成视觉门禁结论。",
      suggestion: "确认 prototype 输出目录后重试。",
      evidence: prototypeRoot,
    });
  }
} finally {
  await browser.close();
}

const blockerCount = issues.filter((issue) => issue.level === "Blocker").length;
const majorCount = issues.filter((issue) => issue.level === "Major").length;
const minorCount = issues.filter((issue) => issue.level === "Minor").length;
const shouldFail = blockerCount > 0 || (mode === "strict" && majorCount > 0);

audit.summary = {
  verdict: shouldFail ? "FAIL" : "PASS",
  totalIssues: issues.length,
  blockerCount,
  majorCount,
  minorCount,
  layoutType: pageMetrics.map((m) => `${m.side}:${m.page}:${m.layoutType}`).join("; "),
  scrollCost: pageMetrics.map((m) => `${m.side}:${m.page}:${m.scrollCost}`).join("; "),
  firstScreenCoverage: pageMetrics
    .map(
      (m) =>
        `${m.side}:${m.page}:${m.firstScreenCoverage.hasFilter ? 1 : 0}/${m.firstScreenCoverage.hasTableHeader ? 1 : 0}/${m.firstScreenCoverage.hasFirstRow ? 1 : 0}`
    )
    .join("; "),
  formDensityBeforeList: pageMetrics
    .map((m) => `${m.side}:${m.page}:${m.formDensityBeforeList.fieldCount},${m.formDensityBeforeList.heightRatio}`)
    .join("; "),
  toolbarOrderCheck: pageMetrics.map((m) => `${m.side}:${m.page}:${m.toolbarOrderCheck}`).join("; "),
  pageResetCheck: pageMetrics.map((m) => `${m.side}:${m.page}:${m.pageResetCheck}`).join("; "),
};

await fs.writeFile(path.join(runDir, "audit-result.json"), JSON.stringify(audit, null, 2), "utf8");

if (shouldFail) {
  process.exit(2);
}
process.exit(0);
