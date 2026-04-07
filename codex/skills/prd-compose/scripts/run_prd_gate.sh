#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_SCRIPT="${PRD_GATE_SCRIPT:-$SCRIPT_DIR/../../prd-review/scripts/run_prd_gate.sh}"

if [[ ! -f "$TARGET_SCRIPT" ]]; then
  echo "Missing target script: $TARGET_SCRIPT" >&2
  echo "Hint: set PRD_GATE_SCRIPT env var to override the path" >&2
  exit 2
fi

exec "$TARGET_SCRIPT" "$@"
