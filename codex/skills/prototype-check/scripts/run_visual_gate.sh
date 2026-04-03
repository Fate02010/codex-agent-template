#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PHASE="check"
PROFILE="both"
MODE="build"
RUN_ID="${RUN_ID:-$(date +%Y%m%d-%H%M%S)}"
REPO_ROOT="${REPO_ROOT:-}"
PROTOTYPE_ROOT="${PROTOTYPE_ROOT:-}"
OUTPUT_ROOT="${OUTPUT_ROOT:-}"

usage() {
  cat <<'USAGE'
Usage:
  run_visual_gate.sh [--phase build|check] [--profile display|acceptance|both] [--mode build|strict]
                     [--run-id <id>] [--repo-root <path>] [--prototype-root <path>] [--output-root <path>]

Examples:
  run_visual_gate.sh --phase build --profile acceptance --mode build
  run_visual_gate.sh --phase check --profile both --mode strict
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --phase)
      PHASE="${2:-}"; shift 2 ;;
    --profile)
      PROFILE="${2:-}"; shift 2 ;;
    --mode)
      MODE="${2:-}"; shift 2 ;;
    --run-id)
      RUN_ID="${2:-}"; shift 2 ;;
    --repo-root)
      REPO_ROOT="${2:-}"; shift 2 ;;
    --prototype-root)
      PROTOTYPE_ROOT="${2:-}"; shift 2 ;;
    --output-root)
      OUTPUT_ROOT="${2:-}"; shift 2 ;;
    -h|--help)
      usage; exit 0 ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 2 ;;
  esac
done

case "$PHASE" in
  build|check) ;;
  *)
    echo "Invalid --phase: $PHASE" >&2
    exit 2 ;;
esac

case "$PROFILE" in
  display|acceptance|both) ;;
  *)
    echo "Invalid --profile: $PROFILE" >&2
    exit 2 ;;
esac

case "$MODE" in
  build|strict) ;;
  *)
    echo "Invalid --mode: $MODE" >&2
    exit 2 ;;
esac

if [[ -z "$REPO_ROOT" ]]; then
  if git -C "$SCRIPT_DIR" rev-parse --show-toplevel >/dev/null 2>&1; then
    REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
  else
    REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
  fi
fi

if [[ -z "$PROTOTYPE_ROOT" ]]; then
  PROTOTYPE_ROOT="$REPO_ROOT/frontend/design-prototype"
fi

if [[ -z "$OUTPUT_ROOT" ]]; then
  OUTPUT_ROOT="$REPO_ROOT/docs/02-design/.visual-check"
fi

RUN_DIR="$OUTPUT_ROOT/$RUN_ID"
mkdir -p "$RUN_DIR"

write_blocked_result() {
  local reason="$1"
  local details="${2:-}"
  node - "$RUN_DIR/audit-result.json" "$PHASE" "$PROFILE" "$MODE" "$RUN_ID" "$reason" "$details" <<'NODE'
const fs = require('fs');
const [outFile, phase, profile, mode, runId, reason, details] = process.argv.slice(2);
const now = new Date().toISOString();
const payload = {
  meta: { phase, profile, mode, runId, generatedAt: now },
  summary: { verdict: 'BLOCKED', totalIssues: 1, blockerCount: 1, majorCount: 0, minorCount: 0 },
  issues: [
    {
      issueId: 'VG-BLOCKED-001',
      level: 'Blocker',
      type: 'execution',
      side: profile,
      page: '-',
      breakpoint: '-',
      buildRule: '-',
      boRule: '-',
      uxBlock: '-',
      description: reason,
      location: 'visual gate runtime',
      impact: '自动化视觉门禁无法执行，无法给出可判定门禁结论。',
      suggestion: details || '检查运行环境后重试。',
      evidence: `command: run_visual_gate.sh --phase ${phase} --profile ${profile} --mode ${mode}`,
      blockDevImplement: '是'
    }
  ]
};
fs.writeFileSync(outFile, JSON.stringify(payload, null, 2), 'utf8');
NODE
}

run_emit_report() {
  if [[ -f "$RUN_DIR/audit-result.json" ]]; then
    VG_RUN_DIR="$RUN_DIR" node "$SCRIPT_DIR/emit_visual_report.mjs" >/dev/null 2>&1 || true
  fi
}

for cmd in node npm; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    write_blocked_result "缺少运行依赖：$cmd" "安装 Node.js 后重试。"
    run_emit_report
    mkdir -p "$OUTPUT_ROOT"
    ln -sfn "$RUN_DIR" "$OUTPUT_ROOT/latest"
    exit 20
  fi
done

if ! command -v playwright >/dev/null 2>&1; then
  if ! npm install -g --no-audit --no-fund playwright >/tmp/codex-visual-gate-install.log 2>&1; then
    write_blocked_result "playwright 全局安装失败" "查看 /tmp/codex-visual-gate-install.log 并重试。"
    run_emit_report
    ln -sfn "$RUN_DIR" "$OUTPUT_ROOT/latest"
    exit 20
  fi
fi

PLAYWRIGHT_BIN="$(command -v playwright || true)"
if [[ -z "$PLAYWRIGHT_BIN" ]]; then
  write_blocked_result "playwright CLI 不可用" "确认 npm 全局安装目录在 PATH 后重试。"
  run_emit_report
  ln -sfn "$RUN_DIR" "$OUTPUT_ROOT/latest"
  exit 20
fi

# Chromium 安装检查：优先用 --list 判断；缺失时再安装
CHROMIUM_INSTALLED=0
if "$PLAYWRIGHT_BIN" install --list >/tmp/codex-visual-gate-browsers.log 2>&1; then
  if grep -qi "chromium" /tmp/codex-visual-gate-browsers.log; then
    CHROMIUM_INSTALLED=1
  fi
fi

if [[ "$CHROMIUM_INSTALLED" -ne 1 ]]; then
  if ! "$PLAYWRIGHT_BIN" install chromium >/tmp/codex-visual-gate-chromium.log 2>&1; then
    write_blocked_result "chromium 安装失败" "查看 /tmp/codex-visual-gate-chromium.log 并重试。"
    run_emit_report
    ln -sfn "$RUN_DIR" "$OUTPUT_ROOT/latest"
    exit 20
  fi
fi

GLOBAL_NODE_ROOT="$(npm root -g 2>/dev/null || true)"
PLAYWRIGHT_NODE_ENTRY="${GLOBAL_NODE_ROOT}/playwright/index.mjs"
if [[ ! -f "$PLAYWRIGHT_NODE_ENTRY" ]]; then
  write_blocked_result "playwright 全局模块入口缺失" "检查 npm 全局目录中的 playwright 包是否完整。"
  run_emit_report
  ln -sfn "$RUN_DIR" "$OUTPUT_ROOT/latest"
  exit 20
fi

set +e
PLAYWRIGHT_NODE_ENTRY="$PLAYWRIGHT_NODE_ENTRY" \
VG_PHASE="$PHASE" \
VG_PROFILE="$PROFILE" \
VG_MODE="$MODE" \
VG_RUN_ID="$RUN_ID" \
VG_REPO_ROOT="$REPO_ROOT" \
VG_PROTOTYPE_ROOT="$PROTOTYPE_ROOT" \
VG_RUN_DIR="$RUN_DIR" \
node "$SCRIPT_DIR/visual_gate.spec.mjs"
RC=$?
set -e

run_emit_report
mkdir -p "$OUTPUT_ROOT"
ln -sfn "$RUN_DIR" "$OUTPUT_ROOT/latest"

echo "visual gate run dir: $RUN_DIR"
echo "visual gate exit code: $RC"
exit "$RC"
