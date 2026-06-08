---
title: landing-page-list
status: draft
created: 2026-06-08
updated: 2026-06-08
source_inputs:
  - _bmad-output/brainstorming/brainstorming-session-2026-06-08-1726.md
---

# PRD: landing-page-list

_Working title — confirm before finalize._

## 0. Document Purpose

PRD này dành cho Kyantran (builder/PM) và các AI agents thực thi roadmap 1–2 tuần. Mô tả sản phẩm **thư viện landing Web3 đa aesthetic** — gallery browse + copy source — được xây từ repo `landing-page-list` hiện tại (Next.js, template Ternus, shared components).

Cấu trúc: Glossary làm vocabulary chuẩn; Features nhóm theo capability với FR đánh số toàn cục; assumptions gắn inline `[ASSUMPTION]` và lập chỉ mục ở §9. Input chính: brainstorming session 2026-06-08. Chi tiết kỹ thuật triển khai (stack per component, migration steps) thuộc addendum / architecture — PRD giữ ở mức capability.

---

## 1. Vision

**landing-page-list** trở thành thư viện landing page và UI components dành cho Web3 — positioning **"shadcn for Web3 landing"**: dev copy source vào project Next.js của họ, chỉnh sửa trực tiếp, không bị lock-in bởi black-box theme.

Khác biệt cốt lõi: **đa aesthetic** (Infra dark refined, Neon meme energy, Game HUD/cyber) nhưng **một quality floor thống nhất** qua `design-tokens` — spacing rhythm và motion easing professional, không vibe coding (purple-gradient-slate-card). North star visual: fuel.network, layerzero.network, celestia.org, monad.xyz — bar L1-grade, không ThemeForest.

Phân phối v1: **gallery-first** — docs app với live preview, nút copy code, filter theo use case / animation / stack. CLI `npx @kyantran/landing add <piece>` là phase 2, sau khi catalog và gallery ổn định.

---

## 2. Target User

### 2.1 Jobs To Be Done

- **JTBD-1 (Functional):** Tìm và lấy landing block/template Web3 chất lượng cao, plug vào Next.js mà không redesign từ zero.
- **JTBD-2 (Emotional):** Tự tin landing của mình trông professional như infra L1, kể cả khi build memecoin hay GameFi — không "cheap hype".
- **JTBD-3 (Social):** Showcase portfolio / public gallery để cộng đồng Web3 dev thấy craft level — builder được credit qua catalog công khai. **[DECISION CONFIRMED 2026-06-08]** Căng có chủ đích với brainstorm Cat#7 "internal-first": _internal-first_ = chưa mở contribution workflow / governance; _public gallery_ = showcase read-only, không mời PR ngoài. Xem `.decision-log.md`.
- **JTBD-4 (Contextual):** Ship landing trong 1–2 ngày với AI-assisted velocity; cần catalog curated, không 500 generic blocks.

### 2.2 Non-Users (v1)

- Non-Web3 landing (SaaS generic, e-commerce) — out of niche.
- Dev cần no-code drag-drop builder.
- Team cần enterprise design system với governance / contribution workflow — v1 internal-first, chưa open contribution.
- Dev chỉ cần CLI mà không quan tâm visual preview — v1 chưa có CLI.

### 2.3 Key User Journeys

- **UJ-1. Alex browse gallery, copy Memecoin hero vào project.**
  Alex, indie dev đang làm memecoin landing trên Next.js 15, cần hero + price ticker trong vài giờ. Vào gallery `/sections`, filter `use-case: memecoin`, xem live preview Memecoin hero+ticker, bấm Copy code, paste vào `app/page.tsx`, chỉnh token name và màu qua CSS vars từ `theme-neon`. Landing trông polished như monad.xyz shell với meme content bên trong. **Edge case:** component dùng GSAP — Alex đọc stack tag, cài dependency trước khi paste.

- **UJ-2. Kyantran (builder) thêm piece mới vào catalog.**
  Authenticated locally trên monorepo. Scaffold section trong `packages/sections`, wire preview route trong `apps/docs`, verify invariant bar (spacing 4/8px grid, easing có tên, không `transition: all`), merge. Piece xuất hiện trên gallery với tags đúng. **Edge case:** piece vi phạm invariant — QA visual bar reject trước khi catalog.

- **UJ-3. Visitor so sánh aesthetic moods trước khi chọn template.**
  Visitor (chưa đăng nhập) vào `/templates`, xem Ternus (Infra), Memecoin (Neon), GameFi (Game) side-by-side hoặc qua filter `mood: infra|neon|game`. Chọn template phù hợp chain/project tone, copy full template source hoặc từng section. **Climax:** thấy rõ 3 mood khác nhau nhưng cùng craft floor.

---

## 3. Glossary

- **Piece** — Một đơn vị catalog: UI component, Section, hoặc Template. Có live preview, metadata tags, copy action.
- **UI** — Layer thấp nhất: animation/interaction components (PixelBlast, LogoLoop, price-ticker modes). Thuộc `packages/ui`.
- **Section** — Landing block ghép từ UI + layout (hero+ticker, stats strip, community marquee). Thuộc `packages/sections`.
- **Template** — Full landing page theo một aesthetic mood (Ternus, Memecoin, GameFi, NFT). Thuộc `packages/templates-<slug>` (vd `packages/templates-ternus`).
- **design-tokens** — Package chứa CSS variables + Tailwind 4 `@theme` block (supersedes brainstorm P3 "Tailwind preset" — xem `.decision-log.md`); định nghĩa quality floor (spacing, type scale, easing curves, color roles). Mọi Piece inherit.
- **Theme variant** — Bộ token override cho aesthetic mood: `theme-infra`, `theme-neon`, `theme-game`. Tokens = floor; theme = ceiling (palette, mesh, motion personality).
- **Aesthetic Trinity** — Ba mood v1: Infra (I), Neon (N), Game (G). NFT là aesthetic thứ 4 — skeleton v1, chưa chốt.
- **Invariant Professional Bar** — Tiêu chí bắt buộc mọi Piece: spacing rhythm (grid 4/8px), motion easing có curve riêng (cấm `transition: all`). Typography và responsive flexible hơn ở v1.
- **Gallery** — Docs app (`apps/docs`) với routes `/ui`, `/sections`, `/templates`, live preview + copy.
- **Catalog** — Tập Piece đã publish trên Gallery. Curated depth v1: **UI + sections ≥ 8** (templates đếm riêng = 4) → tổng **12–16 piece** (depth over volume).

---

## 4. Features

### 4.1 Monorepo Foundation

**Description:** Restructure repo thành monorepo `pnpm + Turborepo` với `apps/docs` (gallery) và `packages/{design-tokens, ui, sections, templates}`. Migration từ `src/` hiện tại không break Ternus demo. Track A blocker — mọi track khác phụ thuộc. Realizes UJ-2.

**Functional Requirements:**

#### FR-1: Monorepo scaffold

Builder có thể chạy `pnpm dev` tại root và serve gallery app cùng package workspaces. Realizes UJ-2.

**Consequences (testable):**

- Root `package.json` khai báo workspaces; `turbo.json` định nghĩa pipeline `dev`, `build`, `lint`.
- `apps/docs` chạy Next.js; import từ `packages/*` qua workspace protocol.
- Build CI pass trên monorepo structure mới.

#### FR-2: Source migration

Code hiện tại (`src/templates/ternus`, `src/components/*`) được migrate vào packages tương ứng mà không mất route demo Ternus. Realizes UJ-2.

**Consequences (testable):**

- Ternus preview tại gallery `/templates/ternus` render tương đương demo hiện tại.
- Shared components nằm trong `packages/ui`; Ternus-specific trong `packages/templates-ternus`.

#### FR-0: Package manager switch (Day 1 Step 0)

Repo hiện dùng npm (`package-lock.json`). Trước scaffold monorepo, chuyển sang pnpm. Realizes UJ-2.

**Consequences (testable):**

- Xoá `package-lock.json`; thêm `pnpm-workspace.yaml` với `packages: ['apps/*', 'packages/*']`.
- Chạy `pnpm install` tại root; `turbo` là devDependency.
- `pnpm dev` tại root chạy được (sau FR-1).

#### FR-2a: Migration map (`src/` → monorepo)

**Gate-0:** Commit hoặc stash mọi WIP trên `src/` (PixelBlast, ternus-hero, hero-crystal, ternus-netstrip) trước khi di chuyển file.

| Hiện tại                                                 | Sau migration                                          |
| -------------------------------------------------------- | ------------------------------------------------------ |
| `src/app/`                                               | `apps/docs/app/`                                       |
| `src/components/pixel-blast`, `logo-loop`, `soft-aurora` | `packages/ui/src/<name>/`                              |
| `src/templates/ternus/`                                  | `packages/templates-ternus/src/`                       |
| `src/lib/types.ts`                                       | `packages/ui/src/lib/types.ts` hoặc `packages/shared/` |
| `package.json` (root)                                    | Root workspace + `apps/docs/package.json`              |

**Import aliases:**

- `apps/docs/tsconfig.json`: `"@/*": ["./app/*"]`, `"@landing/ui": ["../../packages/ui/src"]`, `"@landing/templates/ternus": ["../../packages/templates-ternus/src"]` (alias key giữ `/`, path là dir hyphen).
- Packages dùng `exports` field trong `package.json` riêng.

**Route preservation:**

- `src/app/(demos)/ternus/page.tsx` → `apps/docs/app/templates/ternus/page.tsx` (hoặc giữ `(demos)/ternus` trong docs app).
- Smoke test: `/templates/ternus` render tương đương demo hiện tại sau migration.

**Scaffold order:** FR-0 → tạo `apps/docs` + empty `packages/*` → move files theo bảng → fix imports → `pnpm build` pass.

---

### 4.2 Design Tokens & Quality Floor

**Description:** Package `design-tokens` export CSS vars + Tailwind 4 `@theme` block. Ba theme skeletons (`theme-infra`, `theme-neon`, `theme-game`). Invariant bar enforced trên mọi Piece mới. Realizes UJ-1, UJ-2, UJ-3.

**Functional Requirements:**

#### FR-3: Token package

Dev consuming Piece có thể import token package và áp theme variant cho project. Realizes UJ-1.

**Decision change (brainstorm P3 → PRD):** Brainstorm khóa "CSS vars + Tailwind preset" (v3 API). PRD/architecture supersede bằng **CSS vars + `@theme` block** (Tailwind 4). Cùng intent (quality floor + theme variants), mechanism mới — không cần revert.

**Consequences (testable):**

- `packages/design-tokens` export CSS vars file + `@theme` block (Tailwind 4 — không dùng preset API v3). Docs app `@import` token file trong `globals.css`.
- Đổi `data-theme` hoặc class variant đổi palette + motion personality mà giữ spacing scale.

#### FR-4: Invariant enforcement

Mọi Piece trong catalog phải pass visual bar checklist trước khi publish. Realizes UJ-2.

**Consequences (testable):**

- Spacing dùng scale 4/8px; không arbitrary magic numbers không document.
- Animation dùng named easing; không `transition: all` trong source Piece.
- Checklist có thể là manual QA + agent story acceptance criteria.

#### FR-5: Ternus-first token foundation

Ternus refresh lên bar Fuel/Monad trước; Memecoin/GameFi/NFT inherit tokens, không redesign từ zero. Realizes UJ-3.

**Consequences (testable):**

- Ternus dùng `theme-infra` làm reference implementation.
- Section Memecoin dùng `theme-neon` nhưng spacing/easing scale giống Ternus.

---

### 4.3 Template & Section Catalog

**Description:** Bốn template targets (Ternus refresh, Memecoin, GameFi, NFT skeleton) và 8–10 UI/sections catalogued. Memecoin bundle: hero+ticker, token-stats-strip, community-marquee. GameFi: HUD sections, character showcase skeleton. NFT: gallery grid + mint countdown skeleton. Realizes UJ-1, UJ-3.

**Functional Requirements:**

#### FR-6: Ternus template (Infra)

User xem và copy full Ternus landing (L2/infra aesthetic) từ gallery. Realizes UJ-3.

**Consequences (testable):**

- Route `/templates/ternus` live preview đầy đủ sections hiện có + refresh visual bar.
- Copy action xuất source có thể paste vào Next.js app.

#### FR-7: Memecoin template & sections (Neon)

User copy Memecoin landing hoặc từng section (hero+ticker, stats, community marquee). Realizes UJ-1.

**Consequences (testable):**

- Memecoin shell dark refined (Fuel/Monad layout) với meme/ticker content layer bên trong.
- Price-ticker UI hỗ trợ ≥2 modes qua prop `mode: 'marquee' | 'slot' | 'flash'` (props API: `_bmad-output/planning-artifacts/ux-price-ticker-micro-spec.md`):
  - **marquee:** giá scroll ngang liên tục.
  - **slot:** digit roll animation khi giá đổi.
  - **flash:** nền flash đỏ/xanh theo delta. MVP ship marquee + slot; flash week 2 polish.
- Community marquee: social icons + follower count và/hoặc holder avatars variant.

#### FR-8: GameFi template (Game)

User xem/copy GameFi template với `theme-game` — HUD aesthetic. Realizes UJ-3.

**Consequences (testable):**

- ≥2 GameFi sections live (HUD-style hero, character showcase skeleton).
- Visual distinct từ Infra/Neon nhưng pass invariant bar.

#### FR-9: NFT template skeleton

User xem/copy NFT landing skeleton — gallery grid + mint countdown section. Realizes UJ-3.

**Consequences (testable):**

- Template render được; aesthetic thứ 4 chưa final — marked skeleton OK per roadmap.
- Không block ship các template khác.

#### FR-10: UI catalog expansion

Gallery liệt kê ≥8 UI/sections tổng cộng (templates đếm RIÊNG — 4 templates ở FR-6→9, KHÔNG tính vào số ≥8 này), gồm polish PixelBlast, LogoLoop, SoftAurora + 2–3 UI mới. Realizes UJ-1.

**Consequences (testable):**

- Mỗi UI có page preview riêng tại `/ui/<slug>`.
- Stack tag hiển thị (Framer Motion, GSAP, Three.js, CSS, v.v.).

---

### 4.4 Gallery & Discovery

**Description:** Docs-as-gallery — marketing ẩn trong docs. Browse, preview, copy. Filter đa trục: use case, animation tag, stack tag, mood. Realizes UJ-1, UJ-3.

**Functional Requirements:**

#### FR-11: Gallery routes

Visitor truy cập `/ui`, `/sections`, `/templates` với live preview mỗi Piece. Realizes UJ-1, UJ-3.

**Consequences (testable):**

- Index page mỗi layer liệt kê Piece với thumbnail hoặc inline preview.
- Piece detail page có full preview + metadata.

#### FR-12: Copy source action

User copy source code của Piece từ gallery. Realizes UJ-1.

**Consequences (testable):**

- Copy button copy clipboard-ready source (component + deps hint hoặc import path).
- Copy hoạt động trên desktop; mobile fallback hiển thị code block [ASSUMPTION: mobile copy nice-to-have, desktop primary].

#### FR-13: Multi-axis filters

User filter catalog theo use case (memecoin, infra, gamefi, nft), animation tag, stack tag, mood. Realizes UJ-1, UJ-3.

**Consequences (testable):**

- Filter kết hợp được (AND logic).
- Filter state reflect trong URL query params [ASSUMPTION: shareable filter URLs].

**Feature-specific NFRs:**

- Gallery first contentful paint < 3s trên broadband desktop [ASSUMPTION: no formal perf budget v1].
- Preview iframe hoặc inline render không crash khi Piece dùng WebGL (Three.js) — graceful degrade nếu GPU limited.

---

### 4.5 Distribution (Deferred — v2)

**Description:** CLI `npx @kyantran/landing add <piece>` copy route group + deps vào consumer Next.js project. **Không trong MVP.** Documented để downstream không scope creep.

#### FR-14: CLI registry (v2 — out of MVP scope)

`[NON-GOAL for MVP]` — FR reserved for epics phase 2.

---

## 5. Non-Goals (Explicit)

- CLI install / registry automation (v2).
- Open contribution workflow, PR template cho external contributors.
- Deploy buttons (Vercel one-click).
- Marketing site tách riêng khỏi gallery.
- No-code editor / visual builder.
- Non-Web3 templates (generic SaaS, agency).
- Đạt 50+ pieces — v1 curated depth, không volume race.
- i18n / localization.
- Paid tier / licensing enforcement v1.

---

## 6. MVP Scope

### 6.1 In Scope (2 tuần aggressive)

| Track | Output                                                            |
| ----- | ----------------------------------------------------------------- |
| A     | Monorepo + `design-tokens` + 3 theme skeletons                    |
| B     | Ternus refresh (Fuel/Monad bar)                                   |
| C     | Memecoin sections + price-ticker UI                               |
| D     | Gallery app: `/ui`, `/sections`, `/templates` + copy + basic tags |
| E     | GameFi template (`theme-game`)                                    |
| F     | NFT template skeleton                                             |
| G     | UI polish + 2–3 UI mới                                            |
| I     | Gallery filters (use case + animation + stack)                    |

**Definition of Done:**

- 4 templates: Ternus, Memecoin, GameFi, NFT (skeleton OK)
- 3 theme variants live
- 8–10 UI/sections catalogued
- Gallery browse + copy hoạt động

**Parallel order:** Day 1–2 Track A → Day 2–4 B∥D → Day 4–6 C → Day 7–9 E∥F∥G → Day 10 I + QA visual bar.

### 6.2 Out of Scope for MVP

| Item                              | Reason                                                   |
| --------------------------------- | -------------------------------------------------------- |
| CLI                               | Deferred per brainstorm; gallery validates catalog first |
| Open contribution                 | Internal-first, quality bar                              |
| Deploy buttons                    | Distraction from catalog                                 |
| Marketing                         | Gallery = marketing                                      |
| NFT aesthetic final               | Skeleton only week 2                                     |
| Full responsive audit             | Flexible invariant v1                                    |
| Automated visual regression tests | Manual QA + agent stories                                |

---

## 7. Success Metrics

**Primary**

- **SM-1:** Gallery live với ≥4 template routes và ≥8 catalogued pieces — target: ship end week 2. Validates FR-6–FR-11.
- **SM-2:** ≥3 aesthetic moods visually distinct trên gallery — user blind test nhận ra Infra vs Neon vs Game. Validates FR-3, FR-5, FR-7, FR-8. [ASSUMPTION: informal self-review acceptable v1]

**Secondary**

- **SM-3:** Copy-to-working-paste: dev paste Memecoin hero vào fresh Next.js app, render OK trong <30 phút including deps. Validates FR-12, FR-7.
- **SM-4:** Zero Piece in catalog vi phạm invariant bar tại ship. Validates FR-4.

**Counter-metrics (do not optimize)**

- **SM-C1:** Số lượng pieces — không chase 50+; tổng 12–16 curated đủ (UI+sections ≥8 + 4 templates). Counterbalances pressure to inflate catalog.
- **SM-C2:** Page bundle size — không strip animation quality để đạt arbitrary Lighthouse 100. Counterbalances SM-1 nếu misread as "more effects = better".

---

## 8. Open Questions

1. **Stakes / launch:** Public gallery under domain nào? GitHub Pages, Vercel subdomain, custom domain? [Chưa confirm]
2. **Package scope name:** `@kyantran/landing` hay namespace khác cho publish? [ASSUMPTION: @kyantran/landing]
3. **NFT aesthetic thứ 4:** Mood name và reference board chưa chốt — skeleton ship với placeholder?
4. **Copy format:** Copy raw component file vs multi-file bundle vs CLI-style manifest? V1 = single-file copy đủ chưa?
5. **License:** MIT cho open catalog? [ASSUMPTION: MIT]
6. **Mobile gallery UX:** Priority mobile browse hay desktop-only v1?

---

## 9. Assumptions Index

- **§1 Vision — public portfolio launch:** Sản phẩm hướng tới gallery công khai showcase craft, không chỉ internal repo. **[DECISION CONFIRMED 2026-06-08]** — deploy Vercel (NFR-8, Story 9.5); domain custom TBD (§8 Q1).
- **§2 JTBD-3 — social/showcase:** Builder muốn credit công khai qua catalog. **[DECISION CONFIRMED]** — không mâu thuẫn "internal-first" (contribution workflow); public read-only gallery OK.
- **§4.3 FR-7 — price-ticker 2 modes MVP:** Mode thứ 3 (flash red-green) có thể week 2 polish.
- **§4.4 FR-12 — desktop-primary copy:** Mobile copy nice-to-have.
- **§4.4 FR-13 — shareable filter URLs:** Query params cho filter state.
- **§4.4 NFR — 3s FCP:** Informal perf target, không formal budget.
- **§7 SM-2 — informal aesthetic review:** Self-review thay vì user testing panel.
- **§8 — @kyantran/landing namespace:** Tên package tương lai.
- **§8 — MIT license:** Open source default.

---

## Adapt-In: Aesthetic and Tone

**References (north star):** fuel.network, layerzero.network, celestia.org, polygon.technology, monad.xyz, neon.com, vercel.com.

**Patterns chung:** dark/refined palette, display typography lớn, scroll narrative, stats-as-hero, gradient subtle, whitespace nhiều, motion có chủ đích, social proof (logos/quotes).

**Anti-references:** ThemeForest generic, purple-gradient-slate-card vibe coding, pump.fun-level layout cho infra positioning.

**Tone (product-generated text):** Minimal marketing fluff trong gallery UI — tên Piece + tags + stack hint, không sales copy dài.

---

## Adapt-In: Information Architecture

```
apps/docs/
├── /                    # Gallery home — featured templates + browse entry
├── /ui                  # UI layer index
├── /ui/[slug]           # UI piece preview + copy
├── /sections            # Sections index
├── /sections/[slug]     # Section preview + copy
├── /templates           # Templates index (filter by mood)
└── /templates/[slug]    # Full template preview + copy
```

Filter UI: sidebar hoặc top bar trên index pages; persistent across layer.

---

## Adapt-In: Platform

- **v1:** Web — Next.js docs/gallery app, desktop-primary.
- **v2+:** CLI consumer targets Next.js App Router [ASSUMPTION].
- **Surfaces:** Single web app; không mobile app, không VS Code extension v1.

---

## Adapt-In: Cross-Cutting NFRs

- **Quality:** Mọi Piece pass Invariant Professional Bar trước catalog.
- **Maintainability:** Packages có clear boundaries; template không import ngược từ apps/docs.
- **Accessibility:** `prefers-reduced-motion` respected trên animated Pieces (đã có pattern trong Ternus `use-reduced-motion`).
- **Compatibility:** Next.js 16+, React 19+, Tailwind 4 — align với repo hiện tại.
- **Multi-library animation:** Mỗi Piece chọn lib phù hợp (FM, GSAP, Three.js, CSS); stack tag bắt buộc disclose dependency.
- **Distribution (NFR-8):** Gallery deploy Vercel static hosting; CI `turbo run build lint`. Triển khai: `epics.md` Story 9.5 — closes SM-1 "gallery live".

---

## Adapt-In: Constraints and Guardrails

- **Resource:** 1 builder + AI agents, 1–2 tuần timeline aggressive.
- **Visual-first priority:** Visual > code elegance > docs presentation.
- **Scope guard:** Mỗi Piece = 1 agent story với invariant acceptance; không parallel unlimited mà skip QA.
- **Cost:** Static hosting assumed (Vercel free tier) [ASSUMPTION].
