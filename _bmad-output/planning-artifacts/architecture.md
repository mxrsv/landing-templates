---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: architecture
lastStep: 8
status: complete
completedAt: "2026-06-08"
inputDocuments:
    - _bmad-output/planning-artifacts/prds/prd-landing-page-list-2026-06-08/prd.md
    - _bmad-output/brainstorming/brainstorming-session-2026-06-08-1726.md
    - _bmad-output/planning-artifacts/prds/prd-landing-page-list-2026-06-08/.decision-log.md
    - _bmad-output/planning-artifacts/parallel-dev-strategy.md
project_name: landing-page-list
user_name: Kyantran
date: "2026-06-08"
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

14 FR chia 5 nhóm capability. Kiến trúc xoay quanh **monorepo scaffold (FR-0→FR-2a)** làm nền — chuyển npm→pnpm, tạo `apps/docs` + `packages/{design-tokens, ui, sections, templates}`, migrate code hiện tại theo migration map có Gate-0 (commit WIP trước khi di chuyển file). Mọi FR sau đều phụ thuộc boundary packages này.

**Design Tokens (FR-3→FR-5):** Package `design-tokens` export CSS vars + Tailwind 4 `@theme` block. Ba theme skeleton (`theme-infra`, `theme-neon`, `theme-game`) override palette/motion personality nhưng giữ spacing scale chung. Ternus = reference implementation cho `theme-infra`. Invariant bar (spacing 4/8px grid, named easing, cấm `transition: all`) là acceptance gate trước khi Piece vào catalog.

**Catalog (FR-6→FR-10):** 4 template targets (Ternus refresh, Memecoin, GameFi, NFT skeleton) + 8–10 UI/sections. Memecoin bundle gồm hero+ticker (price-ticker `mode: marquee|slot|flash`), stats strip, community marquee. GameFi ≥2 HUD sections. NFT skeleton không block ship. Mỗi Piece là đơn vị độc lập trong package layer tương ứng.

**Gallery (FR-11→FR-13):** `apps/docs` serve routes `/ui`, `/sections`, `/templates` với live preview, copy source action, filter đa trục (use case × animation × stack × mood) với URL query params. Gallery = marketing surface — không tách site riêng.

**Deferred (FR-14):** CLI registry v2 — không ảnh hưởng kiến trúc MVP.

**Non-Functional Requirements:**

- **Performance:** Gallery FCP < 3s desktop broadband (informal); không strip animation quality chase Lighthouse
- **Compatibility:** Next.js 16+, React 19+, Tailwind 4 — align repo hiện tại
- **Accessibility:** `prefers-reduced-motion` trên mọi animated Piece (pattern có sẵn trong Ternus)
- **Resilience:** WebGL/Three.js Pieces degrade gracefully khi GPU limited
- **Maintainability:** Package boundaries rõ — template không import ngược từ `apps/docs`
- **Distribution:** Static hosting Vercel free tier; desktop-primary copy UX
- **Quality:** Zero Piece vi phạm invariant bar tại ship (manual QA + agent story acceptance)

**Scale & Complexity:**

- Primary domain: **Full-stack web** (Next.js gallery app + component library packages)
- Complexity level: **Medium-high** — monorepo migration + 4 aesthetic moods + multi-lib animation + gallery discovery layer, trong 1–2 tuần với 1 builder
- Estimated architectural components: ~8 top-level (`apps/docs`, `packages/design-tokens`, `packages/ui`, `packages/sections`, `packages/templates` ×4 moods, turbo pipeline, catalog metadata layer)

### Technical Constraints & Dependencies

- **Existing codebase:** `src/templates/ternus`, `src/components/{pixel-blast, logo-loop, soft-aurora}` phải migrate không mất route `/templates/ternus`
- **Gate-0:** Commit/stash WIP (`PixelBlast`, `ternus-hero`, `hero-crystal`, `ternus-netstrip`) trước Track A
- **Package manager:** npm → pnpm bắt buộc Day 1 Step 0
- **Animation libs:** Multi-library per Piece — FM, GSAP, Three.js, CSS; consumer phải biết deps qua stack tag
- **Tailwind 4:** `@theme` CSS import, không dùng preset API v3
- **Resource:** 1 builder + AI agents; visual-first priority; không automated visual regression v1
- **Scope guard:** CLI, open contribution, deploy buttons, i18n, paid tier — tất cả out of MVP

### Cross-Cutting Concerns Identified

1. **Token inheritance** — mọi Piece inherit `design-tokens`; theme variant chỉ override ceiling (palette, motion personality)
2. **Invariant enforcement** — spacing rhythm + motion easing bar áp dụng xuyên catalog, không chỉ 1 template
3. **Package boundary discipline** — `apps/docs` consume packages; packages không depend ngược gallery app
4. **Copy source mechanism** — clipboard-ready single-file copy v1; deps hint/import path; ảnh hưởng cách export packages
5. **Catalog metadata schema** — tags (use case, animation, stack, mood) drive gallery filter + index pages
6. **Animation diversity vs consistency** — multi-lib freedom gọi hẹp bởi shared tokens + invariant bar
7. **Migration safety** — import alias strategy (`@landing/ui`, `@landing/templates/ternus`) + route preservation trong quá trình restructure
8. **Reduced-motion accessibility** — pattern từ Ternus `useReducedMotion` phải replicate across new Pieces

## Starter Template Evaluation

### Primary Technology Domain

**Full-stack web** — Next.js gallery app + shared component library packages trong monorepo. **`create-turbo` scaffold in-repo** (KHÔNG greenfield-merge), migrate từ `_legacy-src/`.

### Starter Options Considered

| Option                                          | Đánh giá                                                             |
| ----------------------------------------------- | -------------------------------------------------------------------- |
| `pnpm dlx create-turbo@latest -e with-tailwind` | ✅ **Selected** — scaffold chuẩn monorepo + Tailwind shared packages |
| **In-place Turborepo restructure**              | ❌ Rejected — user chọn greenfield turbo rồi move code vào           |
| `create-next-app@latest` (standalone)           | ❌ Không có workspace packages / turbo pipeline                      |

### Selected Starter: In-repo `create-turbo` + Migrate from `_legacy-src/`

**Rationale for Selection:**

Scaffold monorepo bằng `create-turbo@latest -e with-tailwind` **vào root repo hiện tại** — giữ git history, tránh ambiguity greenfield-merge. Code migrate từ `_legacy-src/` (read-only cho đến smoke pass).

**Gate-0: WIP reconciliation** (trước scaffold):

- Files dirty: `PixelBlast.tsx`, `hero-crystal.tsx`, `ternus-hero.tsx`, `ternus.css`, `ternus-netstrip.tsx` (untracked).
- WIP v20 thuộc **Epic B** (hoàn thiện sau migrate), không block Epic A.
- Gate-0 = snapshot: `git add -A && git commit -m "chore: gate-0 snapshot ternus v20 WIP before monorepo migration"`

**Initialization Command (canonical — KHÔNG dùng path khác):**

```bash
git checkout -b chore/monorepo-migration
# Gate-0 commit (trên)
mkdir _legacy-src && git mv src/* _legacy-src/
corepack enable && corepack prepare pnpm@latest --activate
rm -f package-lock.json
pnpm dlx create-turbo@latest . -m pnpm -e with-tailwind --skip-install
pnpm install
# Pin versions: next@16.2.7 react@19.2.4 tailwindcss@^4 — reconcile nếu scaffold ship v3/15
# Rename @repo/* → @landing/* (xem Naming Patterns)
# Move files theo migration map → wire /templates/ternus → pnpm build
```

**Migration map (sau scaffold):**

| Legacy (`_legacy-src/`)                              | Monorepo target                     |
| ---------------------------------------------------- | ----------------------------------- |
| `app/` (trừ example)                                 | `apps/docs/app/`                    |
| `app/(demos)/example/`                               | **DELETE** (không trong catalog v1) |
| `templates/example/`                                 | **DELETE**                          |
| `components/pixel-blast`, `logo-loop`, `soft-aurora` | `packages/ui/src/<name>/`           |
| `templates/ternus/`                                  | `packages/templates-ternus/src/`    |
| `lib/types.ts`                                       | `packages/ui/src/lib/types.ts`      |

**Architectural Decisions Provided by Starter:**

**Language & Runtime:** TypeScript 5.x strict; Node.js 20.9+ (Next 16 requirement); React 19.2.4

**Styling Solution:** Tailwind CSS 4 CSS-first (`@import "tailwindcss"`); `packages/design-tokens` export `@theme` block + CSS vars; `@source` directive scan classes từ workspace packages

**Build Tooling:** Turbopack default (Next 16); Turborepo 2.x pipeline (`dev`, `build`, `lint`); `transpilePackages` cho `@landing/*` workspace packages

**Testing Framework:** Không có trong starter hiện tại — manual QA + agent story acceptance v1 (per PRD)

**Code Organization:** `apps/docs` (gallery) + `packages/{design-tokens, ui, sections, templates}`; component-per-section; hooks trong `lib/` per package

**Development Experience:** `pnpm dev` tại root via turbo; `--filter` cho dev từng package; ESLint 9 flat config (`eslint` direct, không `next lint`)

**Note:** Epic A (serial, 1 agent) = scaffold in-repo → rename `@landing/*` → migrate → smoke `/templates/ternus` → xoá `_legacy-src/`. Chi tiết parallel: [parallel-dev-strategy.md](parallel-dev-strategy.md).

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

- Greenfield `create-turbo -e with-tailwind` scaffold, rồi migrate Ternus + shared UI vào (user-confirmed)
- Monorepo layout `apps/docs` + `packages/{design-tokens, ui, sections, templates}`
- Catalog metadata schema (static TypeScript registry)
- Package `exports` + `transpilePackages` strategy
- Copy source mechanism (`copyMode: single` UI/section · `multi` template file-tree viewer)
- Tailwind 4 token sharing qua `@source` + `@theme`

**Important Decisions (Shape Architecture):**

- Filter state via URL `searchParams` (shareable URLs per FR-13)
- Server/Client component boundary per Piece
- Theme variant switching (`data-theme` hoặc class variant)
- Animation lib per-Piece với stack tag disclosure

**Deferred Decisions (Post-MVP):**

- CLI registry (FR-14), auth, database, analytics, i18n, automated visual regression

### Data Architecture

| Decision        | Choice                                                                    | Rationale                                           |
| --------------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| Database        | **None v1**                                                               | Gallery static; không có user data                  |
| Catalog storage | Static TS registry tại `apps/docs/lib/catalog/`                           | Import metadata từ packages; type-safe filter/index |
| Metadata schema | TypeScript interface + const per package                                  | Agents generate consistent tags                     |
| Validation      | Compile-time TS strict; Zod optional later                                | MVP đủ với types                                    |
| Caching         | Next.js 16 static generation cho index; client hydration cho live preview | FCP <3s informal target                             |

### Authentication & Security

| Decision        | Choice                           | Rationale                |
| --------------- | -------------------------------- | ------------------------ |
| Auth            | None — public gallery            | PRD scope                |
| API security    | N/A — no backend                 | Static site              |
| Client security | Clipboard API desktop-primary    | FR-12                    |
| WebGL safety    | Error boundary + static fallback | PRD NFR graceful degrade |

### API & Communication Patterns

| Decision           | Choice                                        | Rationale                                                                |
| ------------------ | --------------------------------------------- | ------------------------------------------------------------------------ |
| API style          | None v1                                       | Inline render, no fetch                                                  |
| Copy mechanism     | Build-time read; `copyMode` trong `pieceMeta` | UI/section: single-file; template: multi-file tab viewer (copy all = v2) |
| Error handling     | React Error Boundaries per heavy Piece        | Isolate WebGL/GSAP crashes                                               |
| Inter-package comm | `workspace:*` imports only                    | Turborepo dependency graph                                               |

### Frontend Architecture

| Decision        | Choice                                                            | Version        |
| --------------- | ----------------------------------------------------------------- | -------------- |
| Framework       | Next.js App Router                                                | 16.2.7         |
| State           | URL `searchParams` filters + local UI state                       | —              |
| Components      | Component-per-section; hooks in `lib/`                            | —              |
| Styling         | Tailwind 4 + `packages/design-tokens`                             | ^4             |
| Workspace       | `transpilePackages` + `exports` per package                       | —              |
| Animation       | Multi-lib per Piece (FM, GSAP, Three.js, CSS)                     | per stack tag  |
| A11y            | `prefers-reduced-motion` hook                                     | —              |
| Routes          | `/ui/[slug]`, `/sections/[slug]`, `/templates/[slug]`             | PRD IA         |
| Legacy redirect | `/ternus` → `/templates/ternus` (`redirects` trong `next.config`) | User-confirmed |

**Template URL convention:** Gallery index `/templates`; mở template `/templates/{slug}` (vd. `/templates/ternus`); filter `/templates?mood=infra`.

### Infrastructure & Deployment

| Decision            | Choice                   | Version |
| ------------------- | ------------------------ | ------- |
| Hosting             | Vercel                   | —       |
| Package manager     | pnpm workspaces          | 9.x+    |
| Build orchestration | Turborepo                | 2.9.x   |
| CI                  | `turbo run build lint`   | —       |
| Env                 | Minimal — no secrets MVP | —       |

### Decision Impact Analysis

**Implementation Sequence (epic order — xem parallel-dev-strategy.md):**

1. **Epic A (serial):** Gate-0 → scaffold in-repo → rename `@repo/*` → `@landing/*` → migrate → `/templates/ternus` + redirect
2. **Epic T (serial):** `design-tokens` + 4 themes (`infra`, `neon`, `game`, `nft` placeholder)
3. **Wave 2 (parallel):** Epic B (Ternus refresh) ∥ Epic D (gallery shell + catalog)
4. **Epic C (serial):** Memecoin + `price-ticker` (sau B+T)
5. **Wave 4 (parallel, max 3):** Epic E (GameFi) ∥ Epic F (NFT) — sau C xong
6. **Epic G (parallel):** UI polish — **sau Epic C** (user-confirmed; tránh conflict `packages/ui`)
7. **Epic I (serial):** Filters + invariant QA

**Rename checklist (bước bắt buộc trong Epic A):**

- `packages/ui/package.json`: `@repo/ui` → `@landing/ui`
- Template packages: `@landing/templates-ternus` (npm name — **không** dùng `/` trong package name)
- Import alias tsconfig: `@landing/templates/ternus` → path `packages/templates-ternus/src`
- `grep -rn "@repo/" .` → 0 (trừ `node_modules`, `_legacy-src`)

**Cross-Component Dependencies:**

- `design-tokens` → mọi package (floor)
- `ui` → `sections` → `templates` → `apps/docs` (layered)
- Catalog registry → gallery routes + filters
- Copy mechanism → package `exports` structure

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points:** package naming, file naming, CSS scoping, catalog metadata shape, client/server boundary, animation deps, copy format, filter URL params, theme application, reduced-motion, exports field, legacy redirects.

### Naming Patterns

**Packages (npm name):** `@landing/design-tokens`, `@landing/ui`, `@landing/sections`, `@landing/templates-<slug>` (vd `@landing/templates-ternus`). Rename từ `@repo/*` ngay sau scaffold — checklist trong Implementation Sequence.

**Import alias (tsconfig):** `@landing/templates/ternus` → path tới `packages/templates-ternus/src` — khác npm package name.

**Files:** kebab-case (`ternus-hero.tsx`, `use-reduced-motion.ts`). Export PascalCase (`TernusHero`).

**Routes:** `/templates/{slug}`, `/ui/{slug}`, `/sections/{slug}`. Legacy `/ternus` → redirect `/templates/ternus`.

**CSS:** scoped prefix per template — `.tn` (Ternus). Tokens qua CSS vars từ `design-tokens`.

**Catalog metadata:** camelCase — `{ slug, name, layer, mood, useCase, stackTags, animationTags, deps, copyMode }` where `copyMode: "single" | "multi"`.

**Filter URL params:** kebab-case — `?mood=infra&use-case=memecoin&stack=gsap`.

### Structure Patterns

```
packages/templates/<slug>/src/
  components/     # section components
  lib/            # hooks only
  config.ts       # templateMeta + catalog entry
  template.tsx    # composition root
  <slug>.css      # scoped styles

packages/ui/src/<name>/
  index.tsx
  <name>.tsx

apps/docs/
  app/templates/[slug]/page.tsx
  app/ui/[slug]/page.tsx
  app/sections/[slug]/page.tsx
  lib/catalog/index.ts
```

Hooks chỉ trong `lib/`. Mỗi section = 1 file, < 400 dòng.

### Format Patterns

**Catalog entry:**

```ts
export const pieceMeta = {
    slug: "pixel-blast",
    name: "Pixel Blast",
    layer: "ui" as const,
    mood: ["infra"],
    useCase: ["infra"],
    stackTags: ["three.js", "webgl"],
    animationTags: ["mesh"],
    deps: ["three", "ogl"],
    copyMode: "single" as const,
} as const;
```

**Copy output v1:**

- **UI** (`copyMode: single`): clipboard = 1 file `.tsx` + header `// deps: ...`; CSS kèm nối cuối với `/* ---- name.css ---- */`
- **Section** (`copyMode: single` nếu 1 file; multi-tab nếu >1 file): tabbed viewer, copy từng file
- **Template** (`copyMode: multi`): file tree + tab viewer read-only, copy từng file; copy-all template = v2 non-goal

**Theme:** `data-theme="infra|neon|game|nft"`; files `packages/design-tokens/src/themes/{infra,neon,game,nft}.css` (`nft` = placeholder skeleton).

### Communication Patterns

Filters = URL `searchParams` (source of truth). Local state chỉ cho UI ephemeral. Không global store v1. `"use client"` ở file cần animation.

### Process Patterns

- `useReducedMotion()` bắt buộc mọi animated Piece
- WebGL/GSAP wrap `ErrorBoundary`
- Invariant: spacing 4/8px grid; named easing; **cấm** `transition: all`
- 1 section = 1 commit

### Enforcement Guidelines

**Agents MUST:** respect package boundaries; add `pieceMeta` + stack tags; pass invariant checklist; dùng `@landing/*` workspace imports.

**Anti-patterns:** `transition: all`; global CSS ngoài scoped prefix; import `apps/docs` từ packages; hardcode colors; giữ `@repo/*` naming.

## Project Structure & Boundaries

### Complete Project Directory Structure

```
landing-page-list/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── apps/
│   └── docs/                         # Gallery (@landing/docs)
│       ├── next.config.ts            # redirect /ternus → /templates/ternus
│       ├── app/
│       │   ├── page.tsx              # gallery home
│       │   ├── ui/[slug]/page.tsx
│       │   ├── sections/[slug]/page.tsx
│       │   └── templates/[slug]/page.tsx
│       ├── components/               # CopyButton, FilterBar, PieceCard
│       └── lib/catalog/              # aggregate pieceMeta
├── packages/
│   ├── design-tokens/                # @landing/design-tokens
│   │   └── src/{base.css,themes/{infra,neon,game,nft}.css}
│   ├── ui/                           # @landing/ui
│   │   └── src/{pixel-blast,logo-loop,soft-aurora,price-ticker,lib/}
│   ├── sections/                     # @landing/sections
│   └── templates-ternus/             # @landing/templates-ternus (npm)
│       (+ templates-memecoin, templates-gamefi, templates-nft)
└── _legacy-src/                      # tạm; xoá sau smoke pass
```

### FR → Structure Mapping

| FR Category         | Location                                                   |
| ------------------- | ---------------------------------------------------------- |
| FR-0→FR-2a Monorepo | root + `apps/docs` + `packages/*`                          |
| FR-3→FR-5 Tokens    | `packages/design-tokens`                                   |
| FR-6 Ternus         | `packages/templates/ternus`                                |
| FR-7 Memecoin       | `packages/templates/memecoin` + `packages/ui/price-ticker` |
| FR-8 GameFi         | `packages/templates/gamefi`                                |
| FR-9 NFT            | `packages/templates/nft`                                   |
| FR-10 UI            | `packages/ui/*`                                            |
| FR-11→FR-13 Gallery | `apps/docs` routes + `lib/catalog`                         |

### Architectural Boundaries

**Dependency flow:** `design-tokens` ← `ui` ← `sections` ← `templates` ← `apps/docs` — không import ngược.

**Component boundaries:** Gallery components (`apps/docs/components`) chỉ orchestrate; Piece logic nằm trong packages.

**Data boundaries:** Không database; catalog = static TS registry aggregated tại `lib/catalog/index.ts`.

**Parallel execution boundaries:**

- 1 package path = 1 owner agent / wave
- Shared files (`catalog/index.ts`, `next.config.ts`, `pnpm-workspace.yaml`, `turbo.json`) — chỉ Epic A/D owner sửa
- Epic khác export `pieceMeta` trong package; registration task serial merge vào catalog (không sửa catalog song song)

### Integration Points

**Internal:** `pieceMeta` export từ packages → `catalog/index.ts` → gallery pages → filter URL → render → copy source.

**External:** Vercel deploy `apps/docs`; consumer paste vào Next.js project riêng (v2 CLI deferred).

### URL Routes

| Route               | Purpose                        |
| ------------------- | ------------------------------ |
| `/templates`        | Template index + filters       |
| `/templates/ternus` | Full template preview + copy   |
| `/ternus`           | Redirect → `/templates/ternus` |
| `/ui/[slug]`        | UI piece preview               |
| `/sections/[slug]`  | Section preview                |

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** Next.js 16.2.7 + React 19.2.4 + Tailwind 4 + pnpm + Turborepo 2.9.x tương thích. Greenfield `create-turbo -e with-tailwind` + migrate Ternus không mâu thuẫn FR-2.

**Pattern Consistency:** `@landing/*` naming, kebab-case files, URL routes, scoped CSS align structure tree.

**Structure Alignment:** FR categories map 1:1 packages; dependency flow một chiều.

### Requirements Coverage Validation ✅

Tất cả FR-0→FR-13 có architectural support. FR-14 deferred v2. NFRs (FCP, reduced-motion, WebGL degrade, Vercel, boundaries) covered.

### Implementation Readiness Validation ✅

Critical decisions + versions documented. Full tree + patterns + enforcement rules đủ cho agents implement consistent.

### Gap Analysis Results

| Priority | Gap                                  | Resolution                                 |
| -------- | ------------------------------------ | ------------------------------------------ |
| Resolved | Scaffold path ambiguity              | In-repo `_legacy-src/` canonical           |
| Resolved | Copy single vs multi                 | `copyMode` + template file-tree viewer     |
| Resolved | `@repo` rename                       | Checklist in Epic A                        |
| Resolved | `theme-nft`                          | Placeholder `nft.css` + `data-theme="nft"` |
| Resolved | Epic G vs C on `packages/ui`         | Epic G sau Epic C (user-confirmed)         |
| Deferred | PRD open questions (domain, license) | Assumptions tagged                         |

### Architecture Completeness Checklist

Requirements Analysis, Architectural Decisions, Implementation Patterns, Project Structure — **16/16** ✅

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION · **Confidence:** High

**Key Strengths:** PRD-aligned monorepo; package boundaries; Ternus migration path; invariant bar; URL + redirect documented.

### Implementation Handoff

**First priority:** Epic A serial (Gate-0 → in-repo scaffold → rename → migrate → smoke). Sau đó `/bmad-create-epics-and-stories` theo [parallel-dev-strategy.md](parallel-dev-strategy.md).
