#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

MODE="compose"
REPO_ROOT="${REPO_ROOT:-}"
PRD_RAW_FILE="${PRD_RAW_FILE:-}"
PRD_REVIEW_FILE="${PRD_REVIEW_FILE:-}"
PRD_RECTIFIED_FILE="${PRD_RECTIFIED_FILE:-}"
OUTPUT_DIR="${OUTPUT_DIR:-}"

usage() {
  cat <<'USAGE'
Usage:
  run_prd_gate.sh --mode compose|review|rectify|solution-precheck
                  [--repo-root <path>]
                  [--prd-raw-file <path>]
                  [--prd-review-file <path>]
                  [--prd-rectified-file <path>]
                  [--output-dir <path>]

Examples:
  run_prd_gate.sh --mode compose --repo-root "$PWD"
  run_prd_gate.sh --mode review --repo-root "$PWD"
  run_prd_gate.sh --mode rectify --repo-root "$PWD"
  run_prd_gate.sh --mode solution-precheck --repo-root "$PWD"
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)
      MODE="${2:-}"; shift 2 ;;
    --repo-root)
      REPO_ROOT="${2:-}"; shift 2 ;;
    --prd-raw-file)
      PRD_RAW_FILE="${2:-}"; shift 2 ;;
    --prd-review-file)
      PRD_REVIEW_FILE="${2:-}"; shift 2 ;;
    --prd-rectified-file)
      PRD_RECTIFIED_FILE="${2:-}"; shift 2 ;;
    --output-dir)
      OUTPUT_DIR="${2:-}"; shift 2 ;;
    -h|--help)
      usage; exit 0 ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 2 ;;
  esac
done

case "$MODE" in
  compose|review|rectify|solution-precheck) ;;
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

if [[ -z "$OUTPUT_DIR" ]]; then
  OUTPUT_DIR="$REPO_ROOT/docs/01-requirements"
fi

PRD_GATE_MODE="$MODE" \
PRD_GATE_REPO_ROOT="$REPO_ROOT" \
PRD_RAW_FILE="$PRD_RAW_FILE" \
PRD_REVIEW_FILE="$PRD_REVIEW_FILE" \
PRD_RECTIFIED_FILE="$PRD_RECTIFIED_FILE" \
PRD_GATE_OUTPUT_DIR="$OUTPUT_DIR" \
node "$SCRIPT_DIR/prd_gate.spec.mjs"
