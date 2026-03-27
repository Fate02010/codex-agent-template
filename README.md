# Codex Agent Template

[中文文档](./README_CN.md)

A document-driven development template powered by AI Agents. This template defines the full workflow from business research to delivery and continuous iteration, with layered project rules and reusable skills. Supports both greenfield development (from 0 to 1) and incremental evolution of delivered systems (change intake, version iteration, baseline management).

## Project Structure

```
├── AGENTS.md                          # Root project rules & workflow
├── .codex/skills/                     # Reusable skill definitions
│   ├── project-init/SKILL.md          # Project scaffolding
│   ├── biz-research/SKILL.md          # Business research, synthesis & clarification
│   ├── prd-compose/SKILL.md           # PRD composition
│   ├── prd-review/SKILL.md            # PRD review
│   ├── prd-rectify/SKILL.md           # PRD rectification
│   ├── solution-design/SKILL.md       # Architecture / API / Data design
│   ├── dev-implement/SKILL.md         # Development implementation
│   ├── qa-design/SKILL.md             # Test plan & case generation
│   ├── qa-execute/SKILL.md            # Test execution & reporting
│   ├── defect-fix/SKILL.md            # Defect resolution loop
│   ├── doc-check/SKILL.md             # Document traceability validation
│   ├── change-intake/SKILL.md         # Incremental change intake & impact analysis
│   └── iteration-plan/SKILL.md        # Version iteration & baseline management
├── docs/                              # Documentation (document-driven, templates)
│   ├── AGENTS.md                      # Documentation standards
│   ├── DOC_CHECK_REPORT.md            # Traceability check report
│   ├── 00-research/                   # Research & clarification
│   │   ├── RESEARCH_SUMMARY.md        # Research summary
│   │   └── REQUIREMENTS_CLARIFIED.md  # Clarified requirements
│   ├── 01-requirements/               # Requirements
│   │   ├── PRD_RAW.md                 # Raw PRD (composed from research)
│   │   ├── PRD_REVIEW_ISSUES.md       # PRD review issue list
│   │   └── PRD_RECTIFIED.md           # Rectified PRD (frozen baseline)
│   ├── 02-architecture/               # Design (frozen after generation)
│   │   ├── ARCHITECTURE.md            # Architecture design
│   │   ├── API_CONTRACT.md            # API contract
│   │   └── DATA_MODEL.md              # Data model
│   ├── 03-testing/                    # Testing
│   │   ├── TEST_PLAN.md               # Test plan
│   │   ├── TEST_CASES.md              # Test cases
│   │   ├── TEST_REPORT.md             # Test execution report
│   │   └── DEFECT_LOG.md              # Defect log
│   └── 04-iteration/                  # Iteration & version management
│       ├── CHANGE_REQUEST.md          # Change request log
│       ├── CHANGE_IMPACT.md           # Change impact analysis
│       ├── ITERATION_PLAN.md          # Iteration plan
│       ├── RELEASE_BASELINE.md        # Version baseline
│       └── CHANGELOG.md               # Changelog
├── backend/                           # Backend code
│   └── AGENTS.md                      # Backend coding standards
├── frontend/                          # Frontend code
│   └── AGENTS.md                      # Frontend coding standards
└── tests/                             # Test artifacts
    └── AGENTS.md                      # Testing standards
```

> **Note**: Files under `docs/` are **pre-set templates**, not completed skill outputs. Templates are overwritten with real artifacts when the corresponding skill is first executed.

## Workflow

### First Delivery (0 → 1)

```
project-init → biz-research → prd-compose → prd-review → prd-rectify
    → solution-design → dev-implement → qa-design → qa-execute → [defect-fix ⟲] → [doc-check ✓]
    → iteration-plan (freeze v1.0.0 baseline)
```

### Incremental Iteration

```
change-intake → iteration-plan → prd-rectify → solution-design (partial update)
    → dev-implement → qa-design → qa-execute → [defect-fix ⟲] → [doc-check ✓]
    → iteration-plan (freeze new version baseline)
```

| Phase | Skill | Input | Output |
|---|---|---|---|
| Project Init | `project-init` | AGENTS.md spec files | Backend/frontend scaffold |
| Business Research | `biz-research` | Business docs (Word/PDF/images/research) | `RESEARCH_SUMMARY.md` + `REQUIREMENTS_CLARIFIED.md` |
| PRD Composition | `prd-compose` | Research summary + clarified requirements | `PRD_RAW.md` |
| PRD Review | `prd-review` | Raw PRD | `PRD_REVIEW_ISSUES.md` |
| PRD Rectification | `prd-rectify` | Review issues + Raw PRD | `PRD_RECTIFIED.md` |
| Solution Design | `solution-design` | Rectified PRD | `ARCHITECTURE.md` + `API_CONTRACT.md` + `DATA_MODEL.md` |
| Development | `dev-implement` | Rectified PRD + Design docs | Code in `backend/` or `frontend/` |
| Test Design | `qa-design` | Rectified PRD + Design docs | `TEST_PLAN.md` + `TEST_CASES.md` |
| Test Execution | `qa-execute` | Test plan + Test cases + Code | `TEST_REPORT.md` |
| Defect Fix | `defect-fix` | Test report + Code + Design docs | Fixed code + `DEFECT_LOG.md` |
| Doc Check | `doc-check` | All documents | `DOC_CHECK_REPORT.md` |
| Change Intake | `change-intake` | Incremental requirements + Existing baselines | `CHANGE_REQUEST.md` + `CHANGE_IMPACT.md` |
| Iteration Plan | `iteration-plan` | Approved CRs + Impact analysis + Baselines | `ITERATION_PLAN.md` + `RELEASE_BASELINE.md` + `CHANGELOG.md` |

## Tech Stack

### Backend

| Item | Technology |
|---|---|
| Language | Java 17+ |
| Framework | Spring Boot 3.x |
| ORM | MyBatis + MyBatis-Plus |
| Database | MySQL 8.x |
| Cache | Redis |
| Code Standard | Alibaba Java Coding Guidelines |

### Frontend

| Item | Technology |
|---|---|
| Web | Vue 3 + Composition API + TypeScript |
| Mini Program | WeChat Mini Program / UniApp |
| Cross-platform | UniApp (H5, WeChat Mini Program, App) |

## Key Architectural Rules

- **DDD Layered Architecture**: `interfaces → application → domain ← infrastructure`
- **Controller URLs must include version prefix**: `/api/v1/...`
- **Controller DTOs must not enter Domain Services** — use Assemblers to convert
- **MyBatis-Plus Service can only be used as a Repository extension**, not directly in application or domain layers
- **Document-first principle**: update documentation before modifying code

## AGENTS.md Philosophy

- `AGENTS.md` files define **long-term stable rules** scoped to their directory
- `SKILL.md` files define **task-triggered workflow capabilities**
- Rules are split by directory (not by role) to avoid duplication and conflicts

| File | Scope |
|---|---|
| Root `AGENTS.md` | Project-wide rules, workflow, tech stack |
| `docs/AGENTS.md` | Documentation naming, structure, markup, numbering standards |
| `backend/AGENTS.md` | Backend layering, coding, exception handling |
| `frontend/AGENTS.md` | Frontend components, state management, API integration |
| `tests/AGENTS.md` | Test case templates, coverage requirements, reporting |

## Getting Started

1. Clone this repository
2. If `backend/` and `frontend/` have no project files, run `project-init` first to scaffold the projects
3. Place your raw business materials in the project (Word, PDF, design images, research notes, interview transcripts)
4. Run the skills in order:
   - `biz-research` — Research, synthesize, and clarify requirements from raw materials
   - `prd-compose` — Compose a structured PRD from research results
   - `prd-review` — Review the PRD and generate an issue list
   - `prd-rectify` — Rectify the PRD based on review findings
   - `solution-design` — Generate architecture, API contract, and data model
   - `dev-implement` — Implement code following the design documents
   - `qa-design` — Generate test plan and test cases
   - `qa-execute` — Execute tests and generate test report
   - `defect-fix` — Fix defects if test failures exist (loops until resolved)
   - `doc-check` — Validate document traceability and consistency (run at any checkpoint)
5. For incremental iterations on delivered systems:
   - `change-intake` — Receive new requirements or change requests, analyze impact
   - `iteration-plan` — Plan iteration scope, freeze version baseline after completion
   - Then follow `prd-rectify → solution-design → dev-implement → qa-design → qa-execute` as needed

## License

MIT
