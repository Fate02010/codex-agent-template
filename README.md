# Codex Agent Template

[中文文档](./README_CN.md)

An executable software-delivery template for Codex. It turns research, requirements, design, implementation, testing, defect handling, and version iteration into one document-driven workflow instead of leaving them as disconnected checklists.

## What This Template Is For

Use this template when your inputs include:

- business materials, interviews, competitor research, Word/PDF PRDs
- high-fidelity designs, Sketch export images, screenshots
- change requests, new feature requests, and defect reports for an existing system

Expected outputs:

- frozen requirement, design, testing, and iteration baselines
- traceable code and test assets
- reusable `AGENTS.md + Skills + docs/` conventions

## Structure

```
├── AGENTS.md
├── docs/
│   ├── AGENTS.md
│   ├── 00-research/
│   ├── 01-requirements/
│   ├── 02-architecture/
│   ├── 03-testing/
│   └── 04-iteration/
├── backend/
│   └── AGENTS.md
├── frontend/
│   └── AGENTS.md
└── tests/
    └── AGENTS.md
```

Files under `docs/` are templates by default. The first real execution of the corresponding skill must overwrite them with actual project artifacts.

## Two Main Execution Routes

### First Delivery

```
project-init → biz-research → prd-compose → prd-review → prd-rectify
    → solution-design → qa-design → dev-implement → qa-execute → [defect-fix ⟲] → [doc-check ✓]
    → iteration-plan
```

### Incremental Iteration

```
change-intake → iteration-plan → prd-rectify → solution-design
    → qa-design → dev-implement → qa-execute → [defect-fix ⟲] → [doc-check ✓]
    → iteration-plan
```

## Quick Start

### 1. Decide the entry point

- If `backend/` and `frontend/` do not contain runnable projects, start with `project-init`
- If this is an existing delivered system, start with `change-intake`
- If frozen baselines already exist, continue from the first downstream phase that still lacks output

### 2. Put raw materials inside the repo

Keep source materials in a traceable location inside the repository, then register them in `RESEARCH_SUMMARY.md` or `CHANGE_REQUEST.md`. Do not rely on undocumented verbal context.

If the input is a raw `.sketch` source file, export it to readable images, page inventories, or structured notes before running `biz-research`. The default workflow consumes readable images and text, not binary `.sketch` files directly.

### 3. Drive Codex with concrete stage requests

Example prompts:

```text
Use the biz-research Skill.
Read AGENTS.md and docs/AGENTS.md first.
Use the raw business materials and design files in this repo to produce
docs/00-research/RESEARCH_SUMMARY.md and docs/00-research/REQUIREMENTS_CLARIFIED.md.
Register every source, identify conflicts, and record clarification conclusions.
```

```text
Use the prd-rectify Skill.
Based on docs/01-requirements/PRD_RAW.md and docs/01-requirements/PRD_REVIEW_ISSUES.md,
produce a freeze-ready docs/01-requirements/PRD_RECTIFIED.md.
Close all blocking issues and complete acceptance criteria, exception flows, and boundaries.
```

```text
Use the dev-implement Skill.
Treat docs/01-requirements/PRD_RECTIFIED.md, docs/02-architecture/ARCHITECTURE.md,
docs/02-architecture/API_CONTRACT.md, and docs/02-architecture/DATA_MODEL.md as the only source of truth.
Implement the changes in backend/ and frontend/, and add tests mapped to TC IDs.
```

## Minimum Required Outputs Per Phase

| Phase | Must produce |
|---|---|
| `biz-research` | source inventory, roles, scenarios, conflicts, clarification items |
| `prd-compose` | functional requirements with IDs, fields, rules, acceptance criteria |
| `prd-review` | graded issue list and review conclusion |
| `prd-rectify` | freeze-ready requirement baseline |
| `solution-design` | architecture, API contracts, data model |
| `qa-design` | test strategy, TC IDs, coverage matrix, test-code mapping |
| `dev-implement` | code and tests aligned with baselines and preassigned TC IDs |
| `qa-execute` | real execution results, failures, risks, release recommendation |
| `defect-fix` | defect lifecycle record and regression result |
| `doc-check` | traceability validation report |
| `change-intake` | CR log and impact analysis |
| `iteration-plan` | iteration plan, release baseline, changelog |

## Hard Rules

- update documents before code
- do not skip upstream phases
- update `API_CONTRACT.md` before changing APIs
- update `DATA_MODEL.md` before changing schema
- update `PRD_RECTIFIED.md` before changing business rules
- bind tests to TC IDs so docs and test code remain traceable

## Recommended Reading Order

1. [AGENTS.md](./AGENTS.md)
2. [docs/AGENTS.md](./docs/AGENTS.md)
3. [docs/01-requirements/PRD_RECTIFIED.md](./docs/01-requirements/PRD_RECTIFIED.md)
4. [docs/02-architecture/ARCHITECTURE.md](./docs/02-architecture/ARCHITECTURE.md)
5. [docs/02-architecture/API_CONTRACT.md](./docs/02-architecture/API_CONTRACT.md)
6. [docs/02-architecture/DATA_MODEL.md](./docs/02-architecture/DATA_MODEL.md)
7. local `AGENTS.md` files under target directories

## License

MIT
