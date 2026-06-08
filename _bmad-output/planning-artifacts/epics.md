---
stepsCompleted: [1, 2, 3, 4]
reviewPatchesApplied: true
reviewPatchesDate: "2026-06-08"
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-landing-page-list-2026-06-08/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/parallel-dev-strategy.md
---

# landing-page-list - Epic Breakdown

## Overview

Tài liệu này phân rã toàn bộ requirements từ PRD và Architecture thành 9 epic và user stories có thể thực thi bởi dev agents. Cấu trúc epic theo [parallel-dev-strategy.md](parallel-dev-strategy.md) — tối ưu cho parallel execution với ownership lanes rõ ràng.

**Epic số ↔ lane letter:** Epic 1=A · 2=T · 3=B · 4=D · 5=C · 6=E · 7=F · 8=G · 9=I

### Pre-epics checklist

- [x] **Gate-0** — WIP v20 đã snapshot trong `b578a31` (`feat(ternus): v20 WIP…`); Story 1.1 = verify-or-skip, không bắt buộc commit lại
- [ ] `.gitignore` cho `.playwright-mcp/` (khuyến nghị trước migration nếu còn untracked artifacts)
- [x] UX micro-spec price-ticker — [`ux-price-ticker-micro-spec.md`](ux-price-ticker-micro-spec.md)

---

## Requirements Inventory

### Functional Requirements

FR-0: Chuyển package manager từ npm sang pnpm — xoá `package-lock.json`, thêm `pnpm-workspace.yaml`, `pnpm install` và `turbo` devDependency thành công.
FR-1: Monorepo scaffold — root workspaces + `turbo.json` pipeline; `apps/docs` chạy Next.js; import từ `packages/*` qua workspace protocol; CI build pass.
FR-2: Source migration — code hiện tại migrate vào packages tương ứng; Ternus preview tại `/templates/ternus` render tương đương demo cũ.
FR-2a: Migration map — Gate-0 commit WIP trước migrate; bảng `src/` → monorepo; import aliases; route preservation; scaffold order FR-0 → apps/docs + packages → move → fix imports → build pass.
FR-3: Token package — `packages/design-tokens` export CSS vars + `@theme` block Tailwind 4; đổi `data-theme`/class variant đổi palette + motion personality giữ spacing scale.
FR-4: Invariant enforcement — mọi Piece pass visual bar: spacing 4/8px grid, named easing, cấm `transition: all`; checklist manual QA + story acceptance.
FR-5: Ternus-first token foundation — Ternus refresh lên Fuel/Monad bar trước; Memecoin/GameFi/NFT inherit tokens; Ternus dùng `theme-infra` làm reference implementation.
FR-6: Ternus template (Infra) — route `/templates/ternus` live preview đầy đủ; copy action xuất source paste được vào Next.js app.
FR-7: Memecoin template & sections (Neon) — Memecoin shell dark refined; price-ticker modes `marquee|slot|flash` (MVP marquee+slot); community marquee với social icons/follower count.
FR-8: GameFi template (Game) — ≥2 GameFi sections live (HUD hero, character showcase skeleton); visual distinct từ Infra/Neon; pass invariant bar.
FR-9: NFT template skeleton — gallery grid + mint countdown section; marked skeleton OK; không block ship templates khác.
FR-10: UI catalog expansion — ≥8 UI/sections catalogued; mỗi UI có page preview tại `/ui/<slug>`; stack tag hiển thị.
FR-11: Gallery routes — visitor truy cập `/ui`, `/sections`, `/templates` với live preview; index + detail page với metadata.
FR-12: Copy source action — copy button clipboard-ready (component + deps hint); desktop primary; mobile fallback code block.
FR-13: Multi-axis filters — filter theo use case, animation tag, stack tag, mood; AND logic; URL query params shareable.
FR-14: CLI registry (v2 — OUT OF MVP SCOPE, không tạo story).

### NonFunctional Requirements

NFR-1: Quality — mọi Piece pass Invariant Professional Bar trước khi vào catalog (SM-4).
NFR-2: Maintainability — package boundaries rõ; template không import ngược từ `apps/docs`.
NFR-3: Accessibility — `prefers-reduced-motion` respected trên mọi animated Piece (`useReducedMotion` hook).
NFR-4: Compatibility — Next.js 16.2.7+, React 19.2.4+, Tailwind 4 CSS-first.
NFR-5: Multi-library animation — mỗi Piece disclose deps qua stack tag (FM, GSAP, Three.js, CSS).
NFR-6: Performance — gallery FCP < 3s desktop broadband (informal target).
NFR-7: Resilience — WebGL/Three.js Pieces degrade gracefully khi GPU limited (ErrorBoundary + static fallback).
NFR-8: Distribution — static hosting Vercel free tier; desktop-primary copy UX.
NFR-9: Scope guard — không chase 50+ pieces; curated depth UI+sections ≥8 (templates đếm riêng = 4) → tổng 12–16 pieces v1.

### Additional Requirements

- Starter template: in-repo `pnpm dlx create-turbo@latest . -m pnpm -e with-tailwind` — KHÔNG greenfield-merge.
- Gate-0: verify WIP v20 đã committed (`gate-0` hoặc `v20 WIP` trong log, vd `b578a31`); nếu chưa → commit explicit file list (KHÔNG `git add -A` — exclude `.playwright-mcp/`, `_bmad-output/`).
- Rename checklist: `@repo/*` → `@landing/*`; npm name `@landing/templates-<slug>`; import alias `@landing/templates/ternus` khác npm package name.
- Catalog metadata schema: `{ slug, name, layer, mood, useCase, stackTags, animationTags, deps, copyMode }`.
- Copy mechanism: UI/section `copyMode: single`; template `copyMode: multi` (file tree + tab viewer).
- Registration pattern: epic export `pieceMeta` trong package; Epic D owner merge vào `lib/catalog/index.ts` serial.
- Parallel execution: 1 package path = 1 owner agent; shared files chỉ Epic A/D owner sửa. `packages/sections` dùng wildcard subpath exports (`@landing/sections/*` → `src/*/index.tsx`) → mỗi section là thư mục riêng, KHÔNG có barrel `src/index.ts` chung để Epic 5/6/7 tranh chấp.
- Legacy redirect: `/ternus` → `/templates/ternus` trong `next.config.ts`.
- Theme files: `packages/design-tokens/src/themes/{infra,neon,game,nft}.css`; `nft` = placeholder.
- `transpilePackages` trong `apps/docs/next.config.ts`: **exact package names only** (Next không hỗ trợ glob); mỗi package mới thêm qua registration task serial (Epic D owner).
- Pin versions: next@16.2.7, react@19.2.4, tailwindcss@^4.
- Xoá `_legacy-src/` sau smoke pass.
- Xoá `app/(demos)/example/` và `templates/example/` — không trong catalog v1.

### UX Design Requirements

_Không có UX Design document riêng. Requirements UX được cover qua PRD Adapt-In (Information Architecture, Aesthetic/Tone) và Architecture Frontend patterns._

---

### FR Coverage Map

FR-0: Epic 1 — pnpm switch Day 1 Step 0
FR-1: Epic 1 — monorepo scaffold
FR-2: Epic 1 — source migration
FR-2a: Epic 1 — migration map + Gate-0
FR-3: Epic 2 — token package
FR-4: Epic 2, Epic 9 — invariant enforcement + final QA
FR-5: Epic 2, Epic 3 — token foundation + Ternus reference impl
FR-6: Epic 3 — Ternus template gallery
FR-7: Epic 5 — Memecoin template & sections
FR-8: Epic 6 — GameFi template
FR-9: Epic 7 — NFT skeleton
FR-10: Epic 4 (Story 4.6 manifest), Epic 8, Epic 9 — UI+sections ≥8 (templates đếm riêng); tổng allPieces 12–16
FR-11: Epic 4 — gallery routes + section registration (Epic 5–7)
FR-12: Epic 4 — copy source action
FR-13: Epic 9 — multi-axis filters
FR-14: _(deferred v2 — không map)_
NFR-8: Epic 9 (Story 9.5) — CI pipeline + Vercel deploy

---

## Epic List

### Epic 1: Monorepo Foundation & Migration

Builder có thể phát triển và build toàn bộ gallery + packages trong monorepo pnpm/Turborepo, với Ternus demo hoạt động trên cấu trúc mới.
**FRs covered:** FR-0, FR-1, FR-2, FR-2a

### Epic 2: Design Tokens & Theme Skeletons

Dev consuming Piece có thể import token preset và áp 4 theme mood (infra/neon/game/nft) với quality floor thống nhất.
**FRs covered:** FR-3, FR-4, FR-5 (phần token foundation)

### Epic 3: Ternus Refresh — Infra Reference Template

Visitor xem và copy full Ternus landing (L2/infra aesthetic) đạt bar Fuel/Monad làm reference implementation cho toàn catalog.
**FRs covered:** FR-5 (reference impl), FR-6

### Epic 4: Gallery App Shell & Catalog Registry

Visitor browse gallery tại `/ui`, `/sections`, `/templates` với live preview, copy source, và piece budget manifest.
**FRs covered:** FR-10 (manifest), FR-11, FR-12

### Epic 5: Memecoin Template & Price-Ticker

Alex (indie dev) copy Memecoin landing hoặc từng section (hero+ticker, stats, community marquee) với Neon aesthetic.
**FRs covered:** FR-7

### Epic 6: GameFi Template — Game HUD Aesthetic

Visitor xem/copy GameFi template với `theme-game` — HUD aesthetic, ≥2 sections distinct từ Infra/Neon.
**FRs covered:** FR-8

### Epic 7: NFT Template Skeleton

Visitor xem/copy NFT landing skeleton (gallery grid + mint countdown) với `theme-nft` placeholder.
**FRs covered:** FR-9

### Epic 8: UI Catalog Polish & New Pieces

Gallery polish UI layer; FR-10 đếm gộp UI+sections qua manifest (Story 4.6).
**FRs covered:** FR-10 (UI layer contribution)

### Epic 9: Gallery Filters & Final QA

Visitor filter catalog đa trục (use case × animation × stack × mood) với URL shareable; toàn catalog pass invariant bar tại ship; gallery live trên Vercel.
**FRs covered:** FR-13, FR-4 (final audit), NFR-1, NFR-6, NFR-8 (Story 9.5)

---

## Epic 1: Monorepo Foundation & Migration

Builder có thể phát triển và build toàn bộ gallery + packages trong monorepo pnpm/Turborepo, với Ternus demo hoạt động trên cấu trúc mới.

### Story 1.1: Gate-0 WIP Snapshot

As a **builder**,
I want **verify hoặc snapshot WIP v20 trước khi migrate**,
So that **không mất thay đổi PixelBlast, ternus-hero, hero-crystal, ternus-netstrip khi di chuyển file**.

**Acceptance Criteria:**

**Given** cần Gate-0 trước migration
**When** kiểm tra `git log --oneline -20` tìm commit message chứa `gate-0` hoặc `v20 WIP` (vd `b578a31`)
**Then** nếu đã có → **skip commit**, ghi log "Gate-0 satisfied", proceed Story 1.2
**And** nếu chưa có → stage **chỉ** các file WIP bắt buộc:

- `src/components/pixel-blast/PixelBlast.tsx`
- `src/templates/ternus/components/{hero-crystal,ternus-hero,ternus-netstrip}.tsx`
- `src/templates/ternus/ternus.css`
- (KHÔNG stage `.playwright-mcp/`, `_bmad-output/`, hoặc artifact khác)
  **And** `git commit -m "chore: gate-0 snapshot ternus v20 WIP before monorepo migration"`
  **And** nếu `git commit` fail (hook reject) → **dừng migration**, `git reset HEAD` staged files, fix hook/blocker trước khi retry — không chạy Story 1.2
  **And** sau pass: `git status` không còn unstaged WIP files trong danh sách trên

### Story 1.2: pnpm Switch & In-Repo Turbo Scaffold

As a **builder**,
I want **chuyển npm→pnpm và scaffold create-turbo in-repo**,
So that **monorepo structure chuẩn với workspaces và turbo pipeline sẵn sàng migrate**.

**Acceptance Criteria:**

**Given** Gate-0 satisfied (Story 1.1)
**When** thực hiện theo thứ tự:

1. `git checkout chore/monorepo-migration` nếu branch đã tồn tại, else `git checkout -b chore/monorepo-migration`
2. `mkdir -p _legacy-src && git mv src/* _legacy-src/` (bao gồm dotfiles nếu có trong `src/`)
3. **Trước create-turbo:** backup hoặc xoá root config sẽ bị ghi đè: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next-env.d.ts` (expected — scaffold thay thế)
4. `corepack enable && corepack prepare pnpm@latest --activate` (fallback: `npm i -g pnpm` nếu corepack unavailable)
5. Xoá `package-lock.json`
6. `pnpm dlx create-turbo@latest . -m pnpm -e with-tailwind --skip-install`
7. `pnpm install`
   **Then** `pnpm-workspace.yaml` có `packages: ['apps/*', 'packages/*']`
   **And** `turbo.json` định nghĩa pipeline `dev`, `build`, `lint`
   **And** pin `turbo@^2.9`, `next@16.2.7`, `react@19.2.4`, `tailwindcss@^4` trong root `package.json` (reconcile sau scaffold)
   **And** nếu `create-turbo` fail giữa chừng → `git checkout -- .` + xoá partial `apps/`/`packages/` scaffold, **abort** — không proceed Story 1.3
   **And** nếu `pnpm install` fail → fix peer deps trước khi proceed; không rename/migrate khi `node_modules` incomplete

### Story 1.3: Rename @repo → @landing

As a **builder**,
I want **đổi toàn bộ package naming từ @repo sang @landing**,
So that **import paths và workspace protocol nhất quán với architecture**.

**Acceptance Criteria:**

**Given** create-turbo scaffold hoàn tất
**When** rename tất cả `package.json` names và deps: `@landing/ui`, `@landing/design-tokens`, `@landing/sections`, `@landing/templates-ternus`
**Then** `grep -rn "@repo/" .` → 0 kết quả (trừ `node_modules`, `_legacy-src`, CI config nếu còn — fix luôn)
**And** `apps/docs/tsconfig.json` paths (relative từ `apps/docs/`):

```json
"@landing/templates/ternus": ["../../packages/templates-ternus/src"]
```

**And** `apps/docs/next.config.ts` có `transpilePackages` **explicit list** (không glob): `["@landing/ui", "@landing/design-tokens", "@landing/templates-ternus"]` — append mỗi package mới qua registration task

### Story 1.3b: Scaffold Empty Template & Section Packages

As a **builder**,
I want **tạo skeleton packages cho sections và templates tương lai**,
So that **Epic 5–7 agent không phải tự sửa `pnpm-workspace.yaml` hay root config**.

**Acceptance Criteria:**

**Given** rename @landing hoàn tất (Story 1.3)
**When** scaffold empty packages với `package.json` + `tsconfig.json`:

- `packages/sections` → `@landing/sections`
- `packages/templates-memecoin` → `@landing/templates-memecoin`
- `packages/templates-gamefi` → `@landing/templates-gamefi`
- `packages/templates-nft` → `@landing/templates-nft`
  **Then** mỗi package có `"private": true`, build script (hoặc `tsc --noEmit` stub), và deps `workspace:*` tới `@landing/design-tokens`, `@landing/ui` nếu cần
  **And** **`@landing/sections` dùng PER-SECTION SUBPATH EXPORTS — KHÔNG single barrel `src/index.ts`**: khai báo 1 lần wildcard `"exports": { "./*": "./src/*/index.tsx" }` trong `package.json`; consumer import `@landing/sections/<name>` (vd `@landing/sections/gamefi-hero`). Mỗi Epic 5/6/7 chỉ tạo `src/<name>/index.tsx` trong thư mục RIÊNG → không story nào đụng file chung, parallel-safe (giữ `1 package path = 1 owner` mà không cần serial barrel-registration)
  **And** thêm tất cả vào `transpilePackages` explicit list trong `apps/docs/next.config.ts`
  **And** `pnpm --filter @landing/sections build` exit 0
  **And** `pnpm --filter @landing/templates-memecoin build` exit 0 (tương tự gamefi, nft)

### Story 1.4: Migrate Legacy Source to Packages

As a **builder**,
I want **di chuyển code từ \_legacy-src vào packages và apps/docs theo migration map**,
So that **shared UI, Ternus template, và docs app nằm đúng package boundaries**.

**Acceptance Criteria:**

**Given** Story 1.3b scaffold hoàn tất
**When** move files theo map: `_legacy-src/app/` → `apps/docs/app/`; `components/{pixel-blast,logo-loop,soft-aurora}` → `packages/ui/src/<name>/`; `templates/ternus/` → `packages/templates-ternus/src/`; `lib/types.ts` → `packages/ui/src/lib/types.ts`
**Then** DELETE `_legacy-src/app/(demos)/example/` và `templates/example/`
**And** fix tất cả imports dùng `@landing/*` workspace protocol
**And** khai báo `workspace:*` deps trong `package.json` cho mọi cross-package import (vd `@landing/templates-ternus` → `"@landing/ui": "workspace:*"`)
**And** retire legacy registry: xoá hoặc migrate `LandingTemplate`, `src/templates/index.ts`, `template-card.tsx`, `template-preview-frame.tsx` — thay bằng `PieceMeta` (Epic 4)
**And** `pnpm --filter @landing/ui build` exit 0 (hoặc `pnpm build` root nếu ui không có build script riêng)
**And** `pnpm --filter @landing/templates-ternus build` exit 0
**And** `pnpm --filter docs build` exit 0 — partial pass (1 package OK, app fail) = **block** proceed Story 1.5
**And** orphan detection: không còn file ngoài map trong `_legacy-src/` (trừ thư mục sẽ xoá Story 1.5)

### Story 1.5: Wire Routes, Redirect & Smoke Test

As a **builder**,
I want **Ternus preview hoạt động tại /templates/ternus với redirect legacy**,
So that **migration không break demo hiện tại và sẵn sàng cho epic tiếp theo**.

**Acceptance Criteria:**

**Given** migration files hoàn tất
**When** wire `apps/docs/app/templates/ternus/page.tsx`, thêm redirect `/ternus` → `/templates/ternus` (preserve query string + hash), và khai báo Tailwind 4 `@source` trong `apps/docs/app/globals.css`:

```css
@source "../../../packages/**/src/**/*.{ts,tsx,css}";
```

**Then** `pnpm dev` tại root serve gallery app
**And** mở `/templates/ternus` **render không crash**; visual = pre-migration WIP baseline (Fuel/Monad bar = Epic 3 gate, không scope creep Epic 1)
**And** verify 1 utility class chỉ dùng trong `packages/*` render đúng (không bị Tailwind purge)
**And** `/ternus` và `/ternus?utm=x` redirect 308/301 tới `/templates/ternus` (+ query preserved)
**And** `pnpm build` (root turbo) exit 0
**And** `pnpm lint` exit 0
**And** xoá `_legacy-src/` **chỉ sau** smoke pass — nếu smoke fail, giữ `_legacy-src/` để rollback

---

## Epic 2: Design Tokens & Theme Skeletons

Dev consuming Piece có thể import token preset và áp 4 theme mood với quality floor thống nhất.

### Story 2.1: Base Token Package & @theme Block

As a **dev consuming a Piece**,
I want **import design-tokens package với CSS vars và Tailwind 4 @theme**,
So that **spacing scale và motion easing floor áp dụng nhất quán mọi Piece**.

**Acceptance Criteria:**

**Given** monorepo sau Epic 1
**When** tạo `packages/design-tokens/src/base.css` với spacing 4/8px grid vars, type scale, named easing curves
**Then** export `@theme` block Tailwind 4 với pattern runtime theme swap:

```css
@theme {
  --color-primary: var(--p-primary);
  /* ...map --color-* → var(--p-*) */
}
```

**And** theme files (Story 2.2) chỉ override `--p-*` dưới `[data-theme="…"]` selector — không hardcode màu trong `@theme`
**And** `apps/docs` `@import` token file trong `globals.css`
**And** `pnpm --filter @landing/design-tokens build` exit 0
**And** `pnpm build` root exit 0

### Story 2.2: Four Theme Skeleton Files

As a **visitor comparing aesthetic moods**,
I want **switch giữa 4 theme variants (infra, neon, game, nft)**,
So that **thấy palette và motion personality khác nhau nhưng cùng spacing floor**.

**Acceptance Criteria:**

**Given** base.css hoàn tất
**When** tạo `packages/design-tokens/src/themes/{infra,neon,game,nft}.css`
**Then** `data-theme="infra|neon|game|nft"` hợp lệ trong type union; giá trị invalid → fallback `infra`
**And** đổi `data-theme` trên wrapper đổi palette + motion personality (utility `bg-primary` etc. đổi theo), giữ spacing scale
**And** `nft.css` là placeholder non-live MVP (copy infra + 2-3 accent var + comment `/* PLACEHOLDER */`) — PRD "3 theme live + 1 skeleton"
**And** docs app demo switch theme tại `/dev/theme-switch` (xoá route trước Epic 4 ship)
**And** mỗi Piece preview wrapper (Epic 4) set `data-theme={piece.mood[0]}` — không leak theme global trên index

### Story 2.3: Invariant Checklist Documentation

As a **builder adding new Pieces**,
I want **checklist invariant bar documented và enforceable**,
So that **mọi agent biết tiêu chí pass trước khi publish catalog**.

**Acceptance Criteria:**

**Given** token package hoàn tất
**When** tạo invariant checklist doc tại `packages/design-tokens/INVARIANT.md`
**Then** checklist gồm: spacing 4/8px grid (cấm arbitrary magic numbers), named easing only, cấm `transition: all`
**And** hướng dẫn `useReducedMotion()` bắt buộc cho animated Pieces
**And** acceptance template cho agent stories reference doc này

### Story 2.4: Shared ErrorBoundary & useReducedMotion

As a **builder shipping animated Pieces**,
I want **shared a11y/resilience primitives trong @landing/ui**,
So that **mọi package dùng cùng hook và ErrorBoundary trước khi ship WebGL/GSAP pieces**.

**Acceptance Criteria:**

**Given** monorepo sau Epic 1
**When** tạo `packages/ui/src/lib/use-reduced-motion.ts` và `packages/ui/src/lib/ErrorBoundary.tsx`
**Then** migrate `use-reduced-motion` từ Ternus legacy vào shared export
**And** `ErrorBoundary` render static fallback slot (gradient + label) khi child throw
**And** export public API từ `@landing/ui` — mọi animated Piece import từ đây, không reimplement per-package
**And** `pnpm --filter @landing/ui build` exit 0

---

## Epic 3: Ternus Refresh — Infra Reference Template

Visitor xem và copy full Ternus landing đạt bar Fuel/Monad làm reference implementation.

### Story 3.1: Complete Ternus v20 Port on Monorepo

As a **builder**,
I want **hoàn thiện v20 port (hero-crystal, ternus-hero, ternus-netstrip, PixelBlast integration) trên cấu trúc packages mới**,
So that **Ternus visual đạt north star Fuel/Monad trên monorepo**.

**Acceptance Criteria:**

**Given** Epic 1 migration + Epic 2 tokens + Story 2.4 shared hooks
**When** hoàn thiện components trong `packages/templates-ternus/src/` theo [2026-06-07-ternus-v20-port.md](../../docs/plans/2026-06-07-ternus-v20-port.md)

- **Lưu ý:** plan dùng paths pre-migration — thay `src/templates/ternus/` → `packages/templates-ternus/src/` và `src/components/pixel-blast/` → `packages/ui/src/pixel-blast/` trong mọi verify command
  **Then** `/templates/ternus` render đầy đủ sections (hero, netstrip, ecosystem, v.v.)
  **And** chỉ file trong `packages/templates-ternus/**` thay đổi
  **And** `pnpm --filter @landing/templates-ternus build` exit 0

### Story 3.2: Apply theme-infra & Pass Invariant Bar

As a **visitor**,
I want **Ternus dùng theme-infra và pass invariant professional bar**,
So that **Ternus là reference implementation cho quality floor toàn catalog**.

**Acceptance Criteria:**

**Given** v20 port hoàn tất
**When** áp `data-theme="infra"` và audit invariant
**Then** `grep -rn "transition: all" packages/templates-ternus/` → 0
**And** spacing dùng token vars (4/8px grid)
**And** animation dùng named easing curves
**And** animated components dùng shared `useReducedMotion()` từ `@landing/ui` — WebGL: freeze canvas / hiện poster image khi reduced-motion on
**And** WebGL/GSAP components wrap shared `ErrorBoundary` — fallback = CSS gradient + text label (không blank div)
**And** 0 hardcoded hex/rgb trong `ternus.css` ngoài `var(--token)` refs

### Story 3.3: Export Ternus pieceMeta for Catalog

As a **gallery visitor**,
I want **Ternus xuất hiện trong catalog với metadata đầy đủ**,
So that **gallery có thể list và filter Ternus template**.

**Acceptance Criteria:**

**Given** Ternus pass invariant bar
**When** export `pieceMeta` trong `packages/templates-ternus/src/config.ts` (pure data — **cấm** import component)
**Then** metadata gồm: `slug: "ternus"`, `layer: "template"`, `mood: ["infra"]`, `useCase: ["infra"]`, `stackTags`, `animationTags`, `deps`, `copyMode: "multi"`, `sourcePaths: string[]` cho copy viewer
**And** registration task **#1 (Ternus)** — Epic D owner serial merge vào catalog + append `@landing/templates-ternus` vào `transpilePackages` nếu chưa có

---

## Epic 4: Gallery App Shell & Catalog Registry

Visitor browse gallery với live preview và copy source cho từng Piece.

### Story 4.1: Gallery Layout & Home Page

As a **visitor**,
I want **gallery home với navigation tới UI/Sections/Templates**,
So that **tôi biết bắt đầu browse từ đâu**.

**Acceptance Criteria:**

**Given** monorepo + tokens sẵn sàng
**When** tạo `apps/docs/app/page.tsx` gallery home
**Then** hiển thị featured templates + browse entry tới `/ui`, `/sections`, `/templates`
**And** catalog rỗng → empty state thay vì broken featured slugs
**And** `/templates` index group theo `mood` tag (pre-filter UX)
**And** layout responsive desktop-primary
**And** tone minimal — tên Piece + tags, không sales copy dài

### Story 4.2: Catalog Schema & Type Definitions

As a **builder registering Pieces**,
I want **TypeScript schema cho catalog metadata**,
So that **mọi pieceMeta export nhất quán và type-safe**.

**Acceptance Criteria:**

**Given** gallery shell
**When** tạo `apps/docs/lib/catalog/types.ts` với interface `PieceMeta`
**Then** fields: `slug, name, layer, mood, useCase, stackTags, animationTags, deps, copyMode, sourcePaths?`
**And** `copyMode: "single" | "multi"` typed
**And** `layer: "ui" | "section" | "template"` typed
**And** export type cho filter params
**And** convention: mỗi piece export `pieceMeta` từ `config.ts` hoặc `meta.ts` thuần data — không import component (tránh kéo Three.js vào catalog server module)
**And** retire `LandingTemplate` type cũ — xoá sau khi `PieceMeta` aggregator live (Story 4.5)

### Story 4.3: Dynamic Slug Routes for All Layers

As a **visitor**,
I want **truy cập /ui/[slug], /sections/[slug], /templates/[slug] với live preview**,
So that **tôi xem full preview và metadata mỗi Piece**.

**Acceptance Criteria:**

**Given** catalog schema
**When** tạo dynamic routes: `app/ui/[slug]/page.tsx`, `app/sections/[slug]/page.tsx`, `app/templates/[slug]/page.tsx`
**Then** mỗi index page liệt kê Pieces với **inline preview** (consistent pattern)
**And** index 0 pieces → empty state message ("Chưa có Piece — đang chờ registration")
**And** detail page render full preview trong wrapper `data-theme={piece.mood[0]}` + metadata (tags, stack, mood)
**And** Piece không tồn tại hoặc sai layer (`/ui/ternus`) → 404 graceful

### Story 4.4: CopyButton — Single & Multi File Modes

As a **Alex (indie dev)**,
I want **copy source code của Piece từ gallery**,
So that **tôi paste vào Next.js project và chỉnh sửa trực tiếp**.

**Acceptance Criteria:**

**Given** detail page render Piece
**When** implement `CopyButton` component với **copy mechanism chốt:** RSC `fs.readFile` tại build theo `pieceMeta.sourcePaths` (hoặc `?raw` import cho single-file UI) — một pattern duy nhất cho toàn catalog
**Then** `copyMode: "single"` — clipboard = 1 file `.tsx` + header `// deps: <pkgs>`; CSS kèm nối cuối với `/* ---- name.css ---- */`
**And** `copyMode: "multi"` — file tree + tab viewer read-only, copy từng file riêng (đọc từ `sourcePaths`)
**And** copy hoạt động trên desktop (Clipboard API); nếu API denied → fallback select-all code block
**And** mobile fallback hiển thị code block read-only với select-all affordance

### Story 4.5: Catalog Aggregator & Registration Pattern

As a **Epic D owner**,
I want **catalog aggregator import pieceMeta từ packages**,
So that **epic song song chỉ export metadata, không sửa catalog trực tiếp**.

**Acceptance Criteria:**

**Given** catalog schema (Story 4.2)
**When** tạo `apps/docs/lib/catalog/index.ts` barrel với `allPieces: PieceMeta[]` (có thể rỗng ban đầu)
**Then** aggregator gom mảng từ package exports qua registration tasks **serial** (Epic D owner duy nhất)
**And** document pattern: epic khác KHÔNG sửa file này — export `pieceMeta` trong package, mở registration task
**And** duplicate slug guard: registration reject nếu slug đã tồn tại
**And** registration **#1 (Ternus)** là hard gate trước Wave 2 demo — Ternus xuất hiện `/templates` sau task #1

### Story 4.6: Catalog Manifest & Piece Budget

As a **builder shipping v1**,
I want **canonical slug list với UI+sections ≥8 (templates đếm riêng) → tổng 12–16 entries**,
So that **FR-10/NFR-9 đếm deterministic, có floor riêng cho UI/sections**.

**Acceptance Criteria:**

**Given** PRD FR-10 (≥8 **UI/sections**, templates đếm RIÊNG) và NFR-9 (tổng 12–16)
**When** tạo `apps/docs/lib/catalog/manifest.ts` liệt kê canonical slugs across layers (vd 4 UI polished + 4–6 sections = 8–10 UI/sections, + 4 templates = 12–14)
**Then** manifest thoả CẢ HAI floor: **`(UI + sections).length` ≥ 8** (KHÔNG tính templates) VÀ `templates.length === 4`; tổng `allPieces.length` ≤ 16 (exception >16 cần rationale)
**And** manifest là source of truth cho smoke test Story 9.4

---

## Epic 5: Memecoin Template & Price-Ticker

Alex copy Memecoin landing hoặc từng section với Neon aesthetic.

### Story 5.1: Price-Ticker UI Component

As a **Alex building memecoin landing**,
I want **price-ticker component với modes marquee và slot**,
So that **tôi hiển thị giá token với animation chuyên nghiệp**.

**Acceptance Criteria:**

**Given** design-tokens + theme-neon + [ux-price-ticker-micro-spec.md](ux-price-ticker-micro-spec.md) approved
**When** tạo `packages/ui/src/price-ticker/` implement `PriceTickerProps` (`mode`, `tokens`, `interval?`) per micro-spec
**Then** **marquee mode:** mock `[{ symbol: "MON", price: 12.34, change24h: 8.1 }, …]` scroll ngang liên tục
**And** **slot mode:** `tokens[0]` digit roll khi `price` đổi theo `interval` (default 3000ms)
**And** `mode: 'flash'` → static price + `console.warn` dev-only (MVP chỉ marquee+slot)
**And** `useReducedMotion()` tắt animation — marquee dừng, hiện giá static cuối
**And** export `pieceMeta` từ `config.ts` với `stackTags` disclose deps (GSAP hoặc FM — chọn một, document)
**And** `grep -rn "transition: all" packages/ui/src/price-ticker/` → 0

### Story 5.2: Memecoin Hero + Ticker Section

As a **Alex**,
I want **Memecoin hero section ghép hero layout + price-ticker**,
So that **landing memecoin có hero polished như monad.xyz shell với meme content**.

**Acceptance Criteria:**

**Given** price-ticker UI hoàn tất
**When** tạo hero+ticker section trong `packages/sections/src/memecoin-hero/`
**Then** shell dark refined (Fuel/Monad layout) với meme/ticker content layer
**And** dùng `theme-neon` scoped trên section wrapper; spacing/easing scale giống Ternus
**And** pass invariant bar
**And** export `pieceMeta` với `layer: "section"`, `slug: "memecoin-hero"`, `copyMode: "single"`
**And** `/sections/memecoin-hero` render preview không lỗi

### Story 5.3: Token Stats Strip Section

As a **Alex**,
I want **token stats strip section (holders, volume, market cap)**,
So that **landing có social proof stats như L1 sites**.

**Acceptance Criteria:**

**Given** Memecoin hero section
**When** tạo `token-stats-strip` section
**Then** stats-as-hero layout với display typography lớn
**And** spacing dùng token vars
**And** export `pieceMeta` với `layer: "section"`, `slug: "token-stats-strip"`, tags `useCase: ["memecoin"]`, `mood: ["neon"]`
**And** `/sections/token-stats-strip` render preview

### Story 5.4: Community Marquee Section

As a **Alex**,
I want **community marquee với social icons và follower count**,
So that **landing show community traction**.

**Acceptance Criteria:**

**Given** Memecoin sections
**When** tạo `community-marquee` section
**Then** social icons + follower count và/hoặc holder avatars variant
**And** animation marquee smooth với named easing
**And** `useReducedMotion()` nhánh tắt — static strip hiện 1 hàng icons
**And** export `pieceMeta` với `layer: "section"`, `slug: "community-marquee"`
**And** `/sections/community-marquee` render preview

### Story 5.5: Memecoin Template Composition

As a **visitor**,
I want **full Memecoin template tại /templates/memecoin**,
So that **tôi copy toàn bộ landing hoặc từng section**.

**Acceptance Criteria:**

**Given** 3 Memecoin sections + price-ticker
**When** compose `packages/templates-memecoin/src/template.tsx`
**Then** `/templates/memecoin` live preview đầy đủ sections
**And** `copyMode: "multi"` với file tree viewer
**And** khai báo `workspace:*` deps (`@landing/ui`, `@landing/sections`) trong `packages/templates-memecoin/package.json`
**And** export `pieceMeta` cho registration task **#2 (Memecoin template + sections batch)**
**And** registration #2 append `@landing/templates-memecoin` vào `transpilePackages`
**And** `pnpm build` root exit 0

---

## Epic 6: GameFi Template — Game HUD Aesthetic

Visitor xem/copy GameFi template với HUD aesthetic.

### Story 6.1: GameFi HUD Hero Section

As a **visitor**,
I want **GameFi HUD-style hero section**,
So that **tôi thấy Game aesthetic distinct từ Infra/Neon**.

**Acceptance Criteria:**

**Given** design-tokens + theme-game
**When** tạo HUD-style hero trong `packages/sections/src/gamefi-hero/`
**Then** visual HUD/cyber aesthetic với `theme-game`
**And** pass invariant bar (spacing tokens, named easing, no `transition: all`)
**And** shared `useReducedMotion()` + `ErrorBoundary` bắt buộc cho mọi animated path
**And** export `pieceMeta` với `layer: "section"`, `slug: "gamefi-hero"`
**And** `/sections/gamefi-hero` render preview

### Story 6.2: Character Showcase Skeleton Section

As a **visitor**,
I want **character showcase skeleton section**,
So that **GameFi template có ≥2 sections live per FR-8**.

**Acceptance Criteria:**

**Given** GameFi hero section
**When** tạo `gamefi-character-showcase` skeleton section
**Then** placeholder layout cho character display
**And** export `pieceMeta` với `layer: "section"`, `slug: "gamefi-character-showcase"`, `mood: ["game"]`, `useCase: ["gamefi"]`
**And** `/sections/gamefi-character-showcase` render preview

### Story 6.3: GameFi Template Composition

As a **visitor**,
I want **full GameFi template tại /templates/gamefi**,
So that **tôi copy GameFi landing với HUD aesthetic**.

**Acceptance Criteria:**

**Given** ≥2 GameFi sections
**When** compose `packages/templates-gamefi/src/template.tsx`
**Then** `/templates/gamefi` live preview
**And** visual distinct từ Infra/Neon
**And** export `pieceMeta` `copyMode: "multi"` cho registration task **#3 (GameFi)**
**And** registration #3 append `@landing/templates-gamefi` vào `transpilePackages`

---

## Epic 7: NFT Template Skeleton

Visitor xem/copy NFT landing skeleton với theme-nft placeholder.

### Story 7.1: NFT Gallery Grid Section

As a **visitor**,
I want **NFT gallery grid section skeleton**,
So that **tôi có starting point cho NFT landing**.

**Acceptance Criteria:**

**Given** design-tokens + theme-nft placeholder
**When** tạo `packages/sections/src/nft-gallery-grid/`
**Then** gallery grid layout skeleton render được
**And** marked skeleton OK trong metadata
**And** export `pieceMeta` với `layer: "section"`, `slug: "nft-gallery-grid"`
**And** `/sections/nft-gallery-grid` render preview
**And** không block ship templates khác

### Story 7.2: Mint Countdown Section Skeleton

As a **visitor**,
I want **mint countdown section skeleton**,
So that **NFT template có countdown CTA placeholder**.

**Acceptance Criteria:**

**Given** NFT gallery grid
**When** tạo `packages/sections/src/nft-mint-countdown/`
**Then** countdown timer placeholder layout; target date invalid/past → hiện "Mint soon" static
**And** pass invariant bar cơ bản
**And** export `pieceMeta` với `layer: "section"`, `slug: "nft-mint-countdown"`
**And** `/sections/nft-mint-countdown` render preview

### Story 7.3: NFT Template Composition

As a **visitor**,
I want **NFT template tại /templates/nft**,
So that **tôi xem/copy NFT landing skeleton**.

**Acceptance Criteria:**

**Given** 2 NFT sections
**When** compose `packages/templates-nft/src/template.tsx`
**Then** `/templates/nft` render với `theme-nft` placeholder
**And** export `pieceMeta` với note aesthetic chưa final
**And** registration task **#4 (NFT)** serial merge (sau #3 GameFi)
**And** registration #4 append `@landing/templates-nft` vào `transpilePackages`

---

## Epic 8: UI Catalog Polish & New Pieces

Gallery polish UI layer; piece budget đếm gộp qua Story 4.6 manifest.

### Story 8.1: Polish PixelBlast Component

As a **visitor browsing /ui**,
I want **PixelBlast polished với invariant bar và preview page**,
So that **tôi copy WebGL mesh animation chất lượng cao**.

**Acceptance Criteria:**

**Given** monorepo structure + tokens
**When** polish `packages/ui/src/pixel-blast/`
**Then** `/ui/pixel-blast` preview render
**And** stack tag: `three.js`, `webgl`
**And** shared `ErrorBoundary` + graceful degrade: no WebGL context → static CSS gradient fallback; context lost → re-mount hoặc poster
**And** shared `useReducedMotion()` tắt mesh animation — dispose canvas, hiện poster/gradient
**And** export `pieceMeta` từ `config.ts` `copyMode: "single"`

### Story 8.2: Polish LogoLoop & SoftAurora

As a **visitor**,
I want **LogoLoop và SoftAurora polished với preview pages**,
So that **tôi có UI animation components sẵn dùng**.

**Acceptance Criteria:**

**Given** PixelBlast polished
**When** polish `packages/ui/src/logo-loop/` và `packages/ui/src/soft-aurora/`
**Then** `/ui/logo-loop` và `/ui/soft-aurora` preview render
**And** pass invariant bar; SoftAurora nếu canvas/WebGL → shared `ErrorBoundary`
**And** export `pieceMeta` từ `config.ts` cho mỗi UI

### Story 8.3: Add 2–3 New UI Pieces

As a **visitor**,
I want **2 UI components mới (slot thứ 3 optional)**,
So that **catalog UI layer bổ sung curated pieces (FR-10 đếm gộp UI+sections qua Story 4.6 manifest)**.

**Acceptance Criteria:**

**Given** 3 UI polished + sections từ Epic 5–7
**When** scaffold **bắt buộc 2** UI trong `packages/ui/src/`:

- `aurora-text/` — text glow animation, mood neon, stack CSS/FM
- `count-up-stats/` — number roll, mood infra/game, stack FM/CSS
- _(optional slot 3: `typewriter-heading/` — mood infra)_
  **Then** mỗi UI có page preview tại `/ui/<slug>`
  **And** stack tag disclose animation lib deps; nếu `stackTags` includes `webgl` → bắt buộc `ErrorBoundary`
  **And** mỗi UI < 400 dòng, 1 file component
  **And** export `pieceMeta` từ `config.ts` cho mỗi UI

### Story 8.4: Register All UI Catalog Entries

As a **Epic D owner**,
I want **registration task #5 gom tất cả UI pieceMeta**,
So that **gallery index /ui liệt kê đủ UI layer trong manifest (Story 4.6)**.

**Acceptance Criteria:**

**Given** tất cả UI export pieceMeta
**When** registration task **#5 (UI batch)** serial import vào `lib/catalog/index.ts`
**Then** `/ui` index liệt kê tất cả UI slugs trong manifest
**And** UI layer đầy đủ trong manifest; floor `(UI + sections) ≥ 8` (templates đếm riêng) + tổng ≤16 — verify ở Story 9.4 gate
**And** mỗi entry có inline preview
**And** `pnpm build` root exit 0

---

## Epic 9: Gallery Filters & Final QA

Visitor filter catalog đa trục; toàn catalog pass invariant bar tại ship.

### Story 9.1: FilterBar Multi-Axis Component

As a **visitor**,
I want **filter catalog theo use case, animation tag, stack tag, mood**,
So that **tôi tìm Piece phù hợp project tone nhanh**.

**Acceptance Criteria:**

**Given** catalog có pieces registered per manifest (Story 4.6)
**When** implement `FilterBar` tại `apps/docs/components/FilterBar.tsx`
**Then** filter options: use case (memecoin, infra, gamefi, nft), animation tag, stack tag, mood (infra|neon|game|nft)
**And** AND logic — chọn nhiều filter thu hẹp kết quả
**And** 0 kết quả → empty state "Không có Piece phù hợp"
**And** FilterBar persistent trên index pages (sidebar hoặc top bar)

### Story 9.2: URL SearchParams Persistence

As a **visitor sharing với teammate**,
I want **filter state reflect trong URL query params**,
So that **tôi share link filter được**.

**Acceptance Criteria:**

**Given** FilterBar hoạt động
**When** user chọn filters
**Then** URL update: `?mood=infra&use-case=memecoin&stack=gsap` (kebab-case params)
**And** reload page giữ filter state
**And** invalid param value (`?mood=foo`) → ignore param, không crash
**And** empty param (`?mood=`) → treat as unset
**And** unknown extra params preserved hoặc stripped (chọn một, document trong code)
**And** clear filters reset URL

### Story 9.3: Full Catalog Invariant QA Audit

As a **builder shipping v1**,
I want **audit toàn catalog pass invariant bar**,
So that **zero Piece vi phạm quality floor tại ship (SM-4)**.

**Acceptance Criteria:**

**Given** tất cả epics merged
**When** chạy invariant audit toàn catalog
**Then** `grep -rn "transition: all" packages/` → 0 (trừ docs/examples)
**And** mọi animated Piece có `useReducedMotion()`
**And** mọi WebGL Piece có ErrorBoundary
**And** checklist INVARIANT.md pass cho từng Piece

### Story 9.4: End-to-End Route Smoke Test

As a **builder**,
I want **smoke test mọi gallery route**,
So that **gallery ship-ready với 4 templates và ≥8 UI/sections catalogued (SM-1)**.

**Acceptance Criteria:**

**Given** filters + QA audit pass
**When** smoke test tất cả routes theo `manifest.ts` (Story 4.6)
**Then** `/`, `/ui`, `/sections`, `/templates` render không crash
**And** mỗi registered slug route render preview
**And** `/templates/ternus`, `/templates/memecoin`, `/templates/gamefi`, `/templates/nft` live
**And** floor đạt: **`(UI + sections).length` ≥ 8** (KHÔNG tính templates) VÀ `templates.length === 4` VÀ `allPieces.length` ≤ 16 (per FR-10/NFR-9)
**And** copy action hoạt động trên desktop cho UI + section + template
**And** smoke với `prefers-reduced-motion: reduce` — không crash animated pieces
**And** gallery FCP < 3s informal trên desktop broadband
**And** `pnpm build` root exit 0
**And** production URL từ Story 9.5 render `/` không crash (SM-1 gallery live)

### Story 9.5: CI Pipeline & Vercel Deploy

As a **builder shipping v1**,
I want **CI chạy build/lint và gallery deploy lên Vercel**,
So that **SM-1 "gallery live" có URL công khai, không chỉ local dev (NFR-8)**.

**Acceptance Criteria:**

**Given** monorepo scaffold hoàn tất (Epic 1) và `pnpm build` local pass
**When** thêm `.github/workflows/ci.yml` chạy `pnpm install` + `turbo run build lint` trên push/PR tới `main`
**Then** workflow exit 0 trên branch sạch
**And** cấu hình Vercel: root directory `apps/docs`, framework Next.js, build `cd ../.. && pnpm turbo run build --filter=docs` (hoặc tương đương monorepo)
**And** deploy production (manual first deploy hoặc Vercel Git integration) → URL public (vd `*.vercel.app`)
**And** smoke production URL: `/`, `/ui`, `/templates/ternus` HTTP 200, không blank page
**And** không secrets bắt buộc cho MVP (static gallery)
**And** document deploy steps trong `apps/docs/README.md` hoặc root README §Deploy
