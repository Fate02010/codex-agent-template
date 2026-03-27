# Codex Agent Template

[中文文档](./README_CN.md)

A document-driven development template powered by AI Agents. This template defines the full workflow from PRD ingestion to test execution and defect resolution, with layered project rules and reusable skills.

## Project Structure

```
├── AGENTS.md                          # Root project rules & workflow
├── .codex/skills/                     # Reusable skill definitions
│   ├── project-init/SKILL.md          # Project scaffolding
│   ├── prd-ingest/SKILL.md           # Raw document ingestion (Word/PDF/Sketch)
│   ├── prd-review/SKILL.md            # PRD review
│   ├── prd-rectify/SKILL.md           # PRD rectification
│   ├── solution-design/SKILL.md       # Architecture / API / Data design
│   ├── dev-implement/SKILL.md         # Development implementation
│   ├── qa-design/SKILL.md             # Test plan & case generation
│   ├── qa-execute/SKILL.md            # Test execution & reporting
│   ├── defect-fix/SKILL.md            # Defect resolution loop
│   └── doc-check/SKILL.md             # Document traceability validation
├── docs/                              # Documentation (document-driven)
│   ├── AGENTS.md                      # Documentation standards
│   ├── DOC_CHECK_REPORT.md            # Traceability check report
│   ├── 01-requirements/               # Requirements
│   │   ├── PRD_RAW.md                 # Raw PRD (ingested from Word/PDF/images)
│   │   ├── PRD_REVIEW_ISSUES.md       # PRD review issue list
│   │   └── PRD_RECTIFIED.md           # Rectified PRD
│   ├── 02-architecture/               # Design
│   │   ├── ARCHITECTURE.md            # Architecture design
│   │   ├── API_CONTRACT.md            # API contract
│   │   └── DATA_MODEL.md              # Data model
│   └── 03-testing/                    # Testing
│       ├── TEST_PLAN.md               # Test plan
│       ├── TEST_CASES.md              # Test cases
│       ├── TEST_REPORT.md             # Test execution report
│       └── DEFECT_LOG.md              # Defect log
├── backend/                           # Backend code
│   └── AGENTS.md                      # Backend coding standards
├── frontend/                          # Frontend code
│   └── AGENTS.md                      # Frontend coding standards
└── tests/                             # Test artifacts
    └── AGENTS.md                      # Testing standards
```

## Workflow

The core workflow follows an extended chain with feedback loop:

```
[project-init] → prd-ingest → prd-review → prd-rectify → solution-design
    → dev-implement → qa-design → qa-execute → [defect-fix ⟲] → [doc-check ✓]
```

| Phase | Skill | Input | Output |
|---|---|---|---|
| Project Init | `project-init` | AGENTS.md spec files | Backend/frontend scaffold |
| PRD Ingestion | `prd-ingest` | Word/PDF/design images | `PRD_RAW.md` |
| PRD Review | `prd-review` | Raw PRD | `PRD_REVIEW_ISSUES.md` |
| PRD Rectification | `prd-rectify` | Review issues + Raw PRD | `PRD_RECTIFIED.md` |
| Solution Design | `solution-design` | Rectified PRD | `ARCHITECTURE.md` + `API_CONTRACT.md` + `DATA_MODEL.md` |
| Development | `dev-implement` | Rectified PRD + Design docs | Code in `backend/` or `frontend/` |
| Test Design | `qa-design` | Rectified PRD + Design docs | `TEST_PLAN.md` + `TEST_CASES.md` |
| Test Execution | `qa-execute` | Test plan + Test cases + Code | `TEST_REPORT.md` |
| Defect Fix | `defect-fix` | Test report + Code + Design docs | Fixed code + `DEFECT_LOG.md` |
| Doc Check | `doc-check` | All documents | `DOC_CHECK_REPORT.md` |

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
| `docs/AGENTS.md` | Documentation naming, structure, markup standards |
| `backend/AGENTS.md` | Backend layering, coding, exception handling |
| `frontend/AGENTS.md` | Frontend components, state management, API integration |
| `tests/AGENTS.md` | Test case templates, coverage requirements, reporting |

## Getting Started

1. Clone this repository
2. Run `project-init` to scaffold the backend and frontend projects (optional, for new projects)
3. Place your raw PRD document in the project (Word, PDF, or design images)
4. Run the skills in order:
   - `prd-ingest` — Convert Word/PDF/design images to structured PRD (skip if PRD is already Markdown)
   - `prd-review` — Review the PRD and generate an issue list
   - `prd-rectify` — Rectify the PRD based on review findings
   - `solution-design` — Generate architecture, API contract, and data model
   - `dev-implement` — Implement code following the design documents
   - `qa-design` — Generate test plan and test cases
   - `qa-execute` — Execute tests and generate test report
   - `defect-fix` — Fix defects if test failures exist (loops until resolved)
   - `doc-check` — Validate document traceability and consistency (run at any checkpoint)

## License

MIT
