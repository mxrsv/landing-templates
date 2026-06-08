---
reviewer: architect (Winston)
date: "2026-06-08"
scope: Architectural review of epics.md vs architecture.md + parallel-dev-strategy.md + current repo
inputDocuments:
  - _bmad-output/planning-artifacts/epics.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/parallel-dev-strategy.md
status: findings-first
---

# Architectural Review — Epics & Stories (landing-page-list)

[ARCHITECTURE REVIEW — epics.md execution readiness]

Findings-first. Mỗi finding có severity, vị trí, và fix đề xuất. Tóm tắt tiếng Việt ở cuối.

Severity scale: **HIGH** = chặn build/ship hoặc phá chiến lược parallel · **MEDIUM** = gây rework/conflict nhưng có workaround · **LOW** = clarity / hygiene / underestimate.

---

## HIGH findings

### [H1] `transpilePackages: ["@landing/*"]` — wildcard KHÔNG được Next hỗ trợ

- **Where:** Story 1.3 AC ("`next.config.ts` có `transpilePackages: ["@landing/*"]`"); architecture R4 mitigation; parallel-dev-strategy §8 R4.
- **Evidence:** `node_modules/next/.../transpilePackages.md` chỉ document `transpilePackages: ['package-name']` (exact names). Type là `string[]`, Next match literal — `"@landing/*"` sẽ KHÔNG khớp `@landing/ui`. Glob không được parse.
- **Impact:** Mỗi package mới (`templates-memecoin`, `templates-gamefi`, `templates-nft`, sections...) phải được liệt kê đích danh trong `next.config.ts`. Đây chính là **shared-file collision** mà R4 tưởng đã né. Stories 5.5 / 6.3 / 7.3 / 8.4 KHÔNG có bước "registration: thêm package vào `transpilePackages`".
- **Fix:** (a) Verify nhanh trên scaffold thật; nếu đúng không hỗ trợ glob → thêm vào registration task serial (owner Epic A/D) bước cập nhật `transpilePackages` mỗi khi thêm package, ghi rõ trong AC các story compose template. (b) Hoặc cân nhắc `experimental.optimizePackageImports` / không transpile mà ship pre-built ESM. **Risk: HIGH, reversibility: dễ nhưng phải sửa nhiều story.**

### [H2] Tailwind 4 `@source` — không có story nào implement → class trong packages bị purge

- **Where:** architecture "Styling Solution" nhắc `@source directive scan classes từ workspace packages`, nhưng Epic 2 (Story 2.1/2.2) và Epic 1 đều KHÔNG có AC khai báo `@source`.
- **Impact:** Tailwind 4 chỉ scan content của app. Utility classes chỉ xuất hiện trong `packages/ui|sections|templates-*` sẽ bị tree-shake khỏi CSS output → preview vỡ style âm thầm (không lỗi build). Đây là lỗi kinh điển của Tailwind monorepo.
- **Fix:** Thêm AC vào Story 1.5 hoặc 2.1: `apps/docs/app/globals.css` khai báo `@source "../../../packages/**/src/**/*.{ts,tsx,css}"` (hoặc per-package), verify 1 utility class chỉ dùng trong package render đúng. **Risk: HIGH (silent), reversibility: dễ.**

### [H3] Inter-package dependency chưa được khai báo trong `package.json`

- **Where:** Story 1.4 ("fix imports dùng `@landing/*`") — nhưng không nói thêm dependency vào package.json của template.
- **Evidence:** `src/templates/ternus/components/ternus-hero.tsx:3` → `import { PixelBlast } from "@/components/pixel-blast"`. Sau migrate, `@landing/templates-ternus` **phụ thuộc** `@landing/ui`. Tương tự mọi template dùng UI piece.
- **Impact:** Thiếu `"@landing/ui": "workspace:*"` trong `packages/templates-ternus/package.json` → pnpm không resolve, build fail; Turborepo dependency graph sai (ordering build sai).
- **Fix:** Thêm AC tường minh cho mọi story compose template/section: "khai báo `workspace:*` deps trong package.json cho mọi `@landing/*` import". Vẽ matrix dependency thực (ternus→ui, memecoin→ui[price-ticker], sections→ui...). **Risk: HIGH, reversibility: dễ.**

### [H4] Cơ chế đọc source cho Copy / file-tree viewer chưa định nghĩa

- **Where:** Story 4.4 (CopyButton) + architecture "Copy mechanism: build-time read". AC mô tả output clipboard nhưng KHÔNG nói **lấy raw text của file `.tsx` bằng cách nào**.
- **Impact:** Đây là core value-prop ("copy source paste vào Next.js app"). Có ≥3 cơ chế khác hẳn nhau: (1) `raw-loader`/`?raw` import, (2) `fs.readFile` trong RSC tại build, (3) generate snapshot JSON lúc build. Mỗi cái ảnh hưởng package `exports`, bundling, và cả `copyMode: multi` file-tree. Để agent tự chọn → mỗi piece làm một kiểu, không copy-all được.
- **Fix:** Chốt 1 cơ chế trong Story 4.2/4.4 (đề xuất: RSC `fs.readFile` theo path manifest trong `pieceMeta`, hoặc bundler `?raw`). Thêm field path/sources vào `PieceMeta` nếu cần. **Risk: HIGH, reversibility: trung bình.**

### [H5] Binding `@theme` (compile-time) ↔ `data-theme` (runtime palette swap) chưa quyết

- **Where:** Story 2.1 (@theme block) + 2.2 (`data-theme` đổi palette). Không story nào mô tả cách 2 layer này nối nhau.
- **Impact:** Tailwind 4 `@theme` sinh utility tĩnh lúc build (vd `bg-primary`). `data-theme="neon"` đổi palette lúc runtime. Nếu `@theme` hardcode màu thay vì `--color-primary: var(--palette-primary)`, đổi `data-theme` sẽ KHÔNG đổi màu của utility classes → demo "switch theme" (Story 2.2 AC) không hoạt động như kỳ vọng.
- **Fix:** Chốt pattern: `@theme { --color-*: var(--p-*) }` và theme files chỉ override `--p-*` dưới `[data-theme]`. Ghi vào Story 2.1 AC + INVARIANT.md. **Risk: HIGH, reversibility: trung bình.**

---

## MEDIUM findings

### [M1] Wave 4: Epic E ∥ Epic F cùng ghi `packages/sections` → shared package.json + barrel

- **Where:** parallel-dev-strategy §4.1 lanes `gamefi` & `nft` đều trỏ `packages/sections/src/*`; Wave 4 chạy đồng thời. Epic C (wave 3) cũng ghi sections.
- **Impact:** Dù subdir khác nhau (`gamefi-*` vs `nft-*`), cả hai vẫn đụng `packages/sections/package.json` (thêm deps) và `packages/sections/src/index.ts` barrel nếu có. Đây là forbidden-overlap chưa được chỉ owner.
- **Fix:** (a) Không dùng central barrel cho `sections` — export per-subpath qua `exports` map; (b) deps của sections khai báo trước (Epic A/T) hoặc qua registration serial; (c) ghi owner cho `packages/sections/package.json`. **Risk: MEDIUM.**

### [M2] `pieceMeta` export location không nhất quán + nguy cơ kéo component nặng vào catalog

- **Where:** Templates → `config.ts` (Story 3.3). UI structure (architecture) chỉ có `index.tsx`/`<name>.tsx`, không có `config.ts` → Story 5.1/8.1/8.2/8.3 "export pieceMeta" nhưng chưa chốt file nào.
- **Impact:** (1) Inconsistency khiến aggregator import khó chuẩn hoá. (2) Nếu pieceMeta nằm cùng file component, `lib/catalog/index.ts` import meta sẽ kéo theo cả `three.js`/`"use client"` component vào module catalog (server) → bloat + có thể vỡ RSC boundary.
- **Fix:** Chuẩn hoá: mọi piece có `config.ts` (hoặc `meta.ts`) **thuần data, cấm import component**. Thêm rule vào Story 4.2 + dispatch packet. **Risk: MEDIUM.**

### [M3] Story 4.5 gộp aggregator infra + Ternus registration → cross-lane dependency trong Wave 2

- **Where:** Story 4.5 "Given Ternus pieceMeta exported (Story 3.3)" + "Ternus xuất hiện trên `/templates` sau registration task #1". Wave 2 = B ∥ D song song.
- **Impact:** Story 4.5 (Epic D) phụ thuộc output của Epic B (story 3.3) trong **cùng wave** → D không thể "done" độc lập, vi phạm tinh thần disjoint-wave. Strategy §4.3 nói registration là task serial SAU wave, nhưng epics.md nhét vào story D.
- **Fix:** Tách Story 4.5 thành: (4.5a) aggregator + schema + barrel rỗng (D, wave 2, không phụ thuộc B); (4.5b) "registration task #1: import Ternus pieceMeta" = serial task sau Wave 2 gate. **Risk: MEDIUM.**

### [M4] ErrorBoundary dùng chung (NFR-7) chưa có story tạo

- **Where:** Story 3.2 / 8.1 yêu cầu "wrap ErrorBoundary" cho WebGL/GSAP, nhưng không story nào tạo component ErrorBoundary, cũng chưa định nơi đặt.
- **Impact:** Nhiều agent tự viết ErrorBoundary riêng → drift; hoặc story bị block vì thiếu dependency.
- **Fix:** Thêm story trong Epic 1 hoặc Epic 2 tạo `@landing/ui` shared `ErrorBoundary` + `useReducedMotion` (xem M5). **Risk: MEDIUM.**

### [M5] `useReducedMotion` hook: per-package vs shared — đang để drift

- **Where:** Hiện ở `src/templates/ternus/lib/use-reduced-motion.ts`; architecture nói "hooks in lib/ per package".
- **Impact:** Mỗi package reimplement hook a11y nền tảng → bản sao lệch nhau, vi phạm DRY và rủi ro NFR-3 không đồng nhất.
- **Fix:** Đưa `useReducedMotion` vào `@landing/ui` (hoặc `design-tokens`), mọi package import. Quyết định ngược lại với câu "hooks per package" — cần ghi rõ exception cho shared a11y/error primitives. **Risk: MEDIUM.**

### [M6] Story 3.2 underestimate: refactor `ternus.css` sang token vars

- **Where:** Story 3.2 AC chủ yếu là `grep "transition: all"` + "spacing dùng token vars".
- **Impact:** Phần lớn effort thực = convert toàn bộ hardcoded color/spacing trong `ternus.css` (scoped `.tn`, `--tn-*`) sang `var(--token)` của design-tokens, đồng thời giữ visual bar Fuel/Monad. AC hiện không phản ánh khối lượng này → story bị đánh giá thấp, dễ trượt gate.
- **Fix:** Bổ sung AC đo lường được: "0 hardcoded hex/rgb trong ternus.css ngoài token refs" + checklist mapping `--tn-*` → token. **Risk: MEDIUM (schedule).**

### [M7] Theme scoping khi index page hiển thị nhiều piece khác mood

- **Where:** `/ui`, `/sections`, `/templates` index render nhiều piece (mood infra/neon/game/nft) cùng lúc; `data-theme` mặc định áp ở đâu chưa nói.
- **Impact:** Nếu `data-theme` đặt global (html/body) → mọi preview cùng 1 palette, sai mood; nếu các piece dùng CSS vars chung trên `:root` → theme bleed giữa preview.
- **Fix:** Chốt: mỗi PieceCard/preview wrapper tự set `data-theme={piece.mood[0]}` và token override scope theo `[data-theme]` selector (không `:root`). Ghi vào Story 4.1/4.3 + 2.2. **Risk: MEDIUM.**

### [M8] Schema cũ vs mới chưa reconcile; story retiring legacy registry còn thiếu

- **Where:** Tồn tại `LandingTemplate` (slug/name/description/tags/previewPath) + `src/templates/index.ts` + `template-card.tsx` + `template-preview-frame.tsx` + `components/index.ts`. Story 4.2 định nghĩa `PieceMeta` MỚI hoàn toàn khác. Migration map (architecture) chỉ map `lib/types.ts` → `packages/ui/src/lib/types.ts` (đó là TYPE CŨ).
- **Impact:** Sau migrate sẽ tồn tại song song 2 schema + 2 aggregator + 2 card component. Không story nào nói xoá/migrate `landingTemplates`, `getTemplateBySlug`, `TemplateCard`, `template-preview-frame`. Mâu thuẫn trực tiếp với PieceMeta.
- **Fix:** Thêm AC trong Story 1.4/4.2: map rõ các file legacy registry → DELETE hoặc convert sang PieceMeta; xoá `LandingTemplate` sau khi PieceMeta thay thế. **Risk: MEDIUM.**

---

## LOW findings

### [L1] Gate-0 (Story 1.1) premise đã stale + `git add -A` quét rác

- **Evidence:** `git status` hiện tại: các file WIP đề cập (ternus-netstrip, hero-crystal, ternus-hero, ternus.css, PixelBlast) **đã tracked/clean**. Untracked chỉ còn `.playwright-mcp/*.log`, `*.yml`, `_bmad-output/.../epics.md`.
- **Impact:** Story 1.1 Given ("repo có dirty files") không còn đúng; `git add -A && commit` sẽ snapshot **rác playwright + artifact** vào commit gate-0. Pre-epics checklist "dọn artifact rác" + ".gitignore" còn unchecked.
- **Fix:** Thêm `.gitignore` cho `.playwright-mcp/` trước Gate-0; đổi Story 1.1 thành verify-or-noop ("nếu sạch thì skip"). **Risk: LOW.**

### [L2] Epic numbering (1–9) vs lettering (A/T/B/D/C/E/F/G/I) không có bảng map trong epics.md

- **Impact:** Story 3.3/4.5/8.4 tham chiếu "Epic D owner" trong khi epics.md đánh số → dev/agent dễ nhầm. Mapping chỉ nằm ở parallel-dev-strategy.
- **Fix:** Thêm bảng map ở đầu epics.md (Epic 4 = Epic D = lane gallery...). **Risk: LOW.**

### [L3] Story 5.2 vị trí section ambiguous ("templates-memecoin/ hoặc sections/")

- **Impact:** Vi phạm "1 path = 1 owner"; agent có thể đặt sai package.
- **Fix:** Chốt hẳn 1 location. **Risk: LOW.**

### [L4] NFR-6 (FCP < 3s) — thiếu quyết định code-split/dynamic import cho WebGL/GSAP

- **Impact:** Three.js (PixelBlast) + GSAP nặng; load eager trên index → FCP fail. Không story nào yêu cầu `next/dynamic`/lazy + fallback.
- **Fix:** Thêm AC: heavy pieces `dynamic(() => ..., { ssr:false })` + skeleton; index dùng thumbnail/poster thay vì mount live WebGL. **Risk: LOW→MEDIUM nếu nhiều WebGL.**

### [L5] Story 1.2 coi nhẹ reconcile version từ scaffold

- **Impact:** `create-turbo -e with-tailwind` nhiều khả năng ship Tailwind v3 + Next cũ hơn 16.2.7. "Pin nếu khác" là non-trivial (Tailwind 3→4 đổi config CSS-first hoàn toàn, PostCSS plugin khác). AC hiện 1 dòng phụ.
- **Fix:** Tách thành sub-task verify + upgrade Tailwind→4 (`@tailwindcss/postcss`, bỏ `tailwind.config.js` v3) như một AC riêng. **Risk: LOW→MEDIUM.**

---

## Strengths (giữ nguyên)

- **[S1] Ownership lane theo package path** + registration pattern §4.3 — giải pháp đúng để tránh catalog collision; pattern "export pieceMeta trong package, serial merge" là chuẩn monorepo tốt.
- **[S2] Serial A→T trước parallel** — hợp lý vì design-tokens là global floor; token drift được khoá bằng read-only + grep invariant.
- **[S3] Dependency diagram** (mermaid) mạch lạc, thể hiện đúng layering `tokens ← ui ← sections ← templates ← apps/docs`.
- **[S4] `copyMode: single|multi`** phân biệt sớm — tránh bug "single-file không khả thi cho template 12 file".
- **[S5] `theme-nft` placeholder + type union 4 mood từ Wave 1** — đúng để Epic F chỉ điền CSS, không sửa shared type.
- **[S6] Invariant bar enforceable bằng grep** (`transition: all`) — verifiable, agent-friendly.

---

## Đánh giá theo trục yêu cầu

| Trục                            | Kết luận                                                                                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Package boundaries              | Layering đúng, nhưng **thiếu khai báo workspace deps (H3)** và **sections shared (M1)**.                                                     |
| Dependency ordering giữa epic   | Diagram đúng; **Story 4.5 tạo cross-lane dep trong wave (M3)**.                                                                              |
| Parallel execution risk         | Lane map tốt; **`transpilePackages` glob hỏng (H1)** phá mitigation R4; sections wave-4 (M1).                                                |
| Shared-file conflicts           | catalog registry xử lý tốt; **next.config.ts (H1)**, **sections package.json/barrel (M1)** còn hở.                                           |
| Migration risk                  | Gate-0 stale + quét rác (L1); **legacy schema/registry chưa retire (M8)**; version reconcile nhẹ (L5).                                       |
| Token/theme alignment           | **@theme↔data-theme binding chưa quyết (H5)**, **@source thiếu (H2)**, **theme scoping index (M7)**, ternus.css refactor underestimate (M6). |
| Catalog registration pattern    | Pattern tốt; **meta file location/purity chưa chuẩn hoá (M2)**.                                                                              |
| Missing architectural decisions | **Copy source mechanism (H4)**, **ErrorBoundary/useReducedMotion shared (M4/M5)**, **code-split (L4)**.                                      |

---

## Tóm tắt (tiếng Việt)

Bộ epic/story **bám sát architecture và parallel-dev-strategy rất tốt** ở phần chiến lược parallel — ownership lane theo package path, registration pattern tránh đụng catalog, và thứ tự serial A→T trước khi mở song song đều hợp lý. Tuy nhiên còn **5 vấn đề HIGH cần xử lý trước khi dispatch agent**:

1. **`transpilePackages: ["@landing/*"]` không chạy** — Next không hỗ trợ wildcard, nên mỗi template mới vẫn phải sửa `next.config.ts` (đúng cái collision R4 tưởng đã né). Phải đưa vào registration serial.
2. **Thiếu `@source` của Tailwind 4** — class dùng trong `packages/*` sẽ bị purge âm thầm, preview vỡ style mà không báo lỗi.
3. **Chưa khai báo workspace deps trong package.json** — `templates-ternus` import `PixelBlast` từ `@landing/ui` nhưng không story nào thêm `"@landing/ui": "workspace:*"` → build fail.
4. **Cơ chế đọc source cho nút Copy chưa định nghĩa** — đây là value-prop cốt lõi nhưng story chỉ tả output, không tả cách lấy raw `.tsx`.
5. **Binding `@theme` ↔ `data-theme` chưa chốt** — nếu làm sai, tính năng switch theme (Story 2.2) sẽ không đổi màu thật.

Nhóm **MEDIUM** chủ yếu là gap cần bổ sung AC: `packages/sections` bị E∥F chia sẻ ở Wave 4 (M1), Story 4.5 tạo phụ thuộc chéo trong wave (M3), thiếu story tạo `ErrorBoundary`/hook a11y dùng chung (M4/M5), schema cũ `LandingTemplate` chưa được retire so với `PieceMeta` mới (M8), và refactor `ternus.css` sang token bị đánh giá thấp (M6).

**Khuyến nghị:** xử lý H1–H5 + M1/M3/M8 bằng cách thêm/sửa AC và tách 2 story (4.5, 1.2) **trước khi** chạy `/bmad-dev-story`. Các HIGH đều reversibility dễ–trung bình, không cần đổi kiến trúc tổng thể. Sau patch, kế hoạch **sẵn sàng thực thi**.
