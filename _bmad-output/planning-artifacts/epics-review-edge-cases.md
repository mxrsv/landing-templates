# Edge-Case Hunter — Acceptance Criteria Gaps

_Phạm vi: `_bmad-output/planning-artifacts/epics.md` · Chỉ liệt kê edge case **chưa** được AC bao phủ · 2026-06-08_

---

## Epic 1: Monorepo Foundation & Migration

### Story 1.1: Gate-0 WIP Snapshot

| Severity   | Edge case                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **High**   | Pre-commit hook fail hoặc `git commit` reject — không có AC rollback/recovery khi Gate-0 không hoàn tất                              |
| **Medium** | File WIP nằm ngoài danh sách AC (`PixelBlast`, `hero-crystal`, …) vẫn dirty sau commit — không có verify danh sách file bắt buộc     |
| **Medium** | Agent chạy migration khi `git status` chưa sạch do commit message sai format — AC chỉ check message, không gate block bước tiếp theo |
| **Low**    | Untracked file ngoài scope WIP bị `git add -A` nuốt vào snapshot — không phân biệt intentional vs artifact rác (`.playwright-mcp/`)  |

### Story 1.2: pnpm Switch & In-Repo Turbo Scaffold

| Severity     | Edge case                                                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Critical** | `create-turbo` fail giữa chừng → repo half-scaffold (có `apps/` mới nhưng `_legacy-src/` chưa move xong) — không có AC detect/abort/rollback |
| **Critical** | `pnpm install` fail (network, peer dep conflict) — không có AC verify partial `node_modules` state trước khi tiếp Story 1.3                  |
| **High**     | Branch `chore/monorepo-migration` đã tồn tại — AC không xử lý checkout vs tạo mới                                                            |
| **High**     | `git mv src/* _legacy-src/` khi `src/` rỗng hoặc có dotfiles — không cover hidden file / empty src                                           |
| **Medium**   | `create-turbo` ghi đè file root hiện có (README, `.gitignore`) — không có AC diff review trước commit                                        |
| **Medium**   | `corepack` không có sẵn trên môi trường agent — không có fallback install pnpm                                                               |
| **Low**      | Pin version conflict khi scaffold ship đúng version — AC nói "nếu khác" nhưng không define cách resolve khi cả hai đều pinned                |

### Story 1.3: Rename @repo → @landing

| Severity   | Edge case                                                                                                                                    |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **High**   | Partial rename — một số `package.json` đổi, import còn `@repo/` → build fail runtime nhưng grep pass nếu chỉ check source                    |
| **Medium** | `@repo/` còn trong CI workflow, script shell, README — AC grep exclude `node_modules`/`_legacy-src` nhưng không exclude các path config khác |
| **Medium** | `transpilePackages: ["@landing/*"]` glob không được Next 16 hỗ trợ — parallel-dev R4 có mitigation nhưng AC không có fallback explicit list  |
| **Low**    | Alias `@landing/templates/ternus` trỏ sai path sau rename — không có smoke import test ngoài tsconfig tồn tại                                |

### Story 1.4: Migrate Legacy Source to Packages

| Severity     | Edge case                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Critical** | Partial monorepo state: một package build pass (`@landing/ui`) nhưng package khác fail — AC yêu cầu 2 filter build exit 0 nhưng không gate `apps/docs` build |
| **High**     | File không nằm trong migration map vẫn ở `_legacy-src/` — không có AC orphan-file detection                                                                  |
| **High**     | Dynamic import / barrel re-export broken sau move — AC chỉ nói "fix imports" không verify runtime                                                            |
| **Medium**   | Circular dependency giữa packages sau migrate — không có AC dep graph check                                                                                  |
| **Medium**   | `templates/example/` xoá nhưng route/link còn reference — không verify broken link                                                                           |
| **Low**      | `lib/types.ts` move sang `packages/ui` nhưng consumer ngoài ui package — không list full consumer set                                                        |

### Story 1.5: Wire Routes, Redirect & Smoke Test

| Severity     | Edge case                                                                                                             |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Critical** | Smoke pass nhưng `_legacy-src/` đã xoá — không có AC giữ backup nếu smoke false-positive (console warning ≠ crash)    |
| **High**     | Redirect `/ternus` mất query string / hash (`/ternus?utm=x`) — AC chỉ verify 308/301 destination                      |
| **High**     | `pnpm dev` pass nhưng `pnpm build` fail trên route cụ thể — AC list cả hai nhưng không define route-level build check |
| **Medium**   | Console "không crash" không định nghĩa ngưỡng — hydration warning, 404 asset có thể pass                              |
| **Medium**   | Partial `_legacy-src/` delete khi smoke fail giữa chừng — AC nói xoá sau pass nhưng không forbid xoá khi fail         |
| **Low**      | Legacy bookmark `/ternus/` trailing slash — không specify redirect behavior                                           |

---

## Epic 2: Design Tokens & Theme Skeletons

### Story 2.1: Base Token Package & @theme Block

| Severity   | Edge case                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| **Medium** | CSS import order conflict — token load sau component CSS override vars — không có AC specificity/order test |
| **Low**    | `@theme` block invalid syntax — chỉ check build exit 0, không visual regression                             |

### Story 2.2: Four Theme Skeleton Files

| Severity   | Edge case                                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| **High**   | `data-theme` giá trị invalid / typo (`data-theme="infr"`) — AC chỉ list union hợp lệ, không define fallback    |
| **High**   | Theme switch runtime gây FOUC / hydration mismatch (SSR default vs client switch) — không có AC                |
| **High**   | `prefers-color-scheme: dark` xung đột với `data-theme` — không define precedence                               |
| **Medium** | Theme switch trên test page không persist (reload reset) — không specify expected behavior cho gallery sau này |
| **Medium** | `nft.css` placeholder thiếu var mà section NFT expect — consumer crash silent với `var(--undefined)`           |
| **Low**    | Switch theme khi animation đang chạy — không có AC interrupt/cleanup                                           |
| **Low**    | Nested `data-theme` (template override gallery shell) — không define inheritance                               |

### Story 2.3: Invariant Checklist Documentation

| Severity   | Edge case                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------- |
| **Medium** | `useReducedMotion()` documented nhưng không có AC test scenario (OS setting on/off) — doc-only, không enforceable |
| **Low**    | Checklist không cover WebGL static fallback criteria — chỉ mention hook, không link NFR-7                         |

---

## Epic 3: Ternus Refresh — Infra Reference Template

### Story 3.1: Complete Ternus v20 Port

| Severity   | Edge case                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| **Medium** | Port partial — một section render, section khác 404/blank — AC chỉ check "đầy đủ sections" không list minimum |
| **Low**    | Plan doc `2026-06-07-ternus-v20-port.md` outdated vs code — không có AC sync verify                           |

### Story 3.2: Apply theme-infra & Pass Invariant Bar

| Severity   | Edge case                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------- |
| **High**   | `useReducedMotion()` tắt animation — không define hành vi WebGL (static frame vs unmount canvas vs poster image)     |
| **High**   | ErrorBoundary catch WebGL fail — không specify nội dung static fallback (screenshot? gradient? text?)                |
| **Medium** | GSAP timeline không pause/dispose khi reduced-motion bật mid-session — chỉ nhánh mount                               |
| **Medium** | ErrorBoundary catch nhưng copy source vẫn export WebGL code không fallback note — dev paste vào project không có GPU |
| **Low**    | `grep transition: all` pass nhưng inline style `transition:all` không space — grep miss                              |

### Story 3.3: Export Ternus pieceMeta for Catalog

| Severity   | Edge case                                                                                                                              |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **High**   | Registration deferred "Epic D owner merge sau" — không có AC xử lý khi parallel agent merge `catalog/index.ts` trước registration task |
| **Medium** | `stackTags` / `animationTags` empty array — không validate minimum disclosure                                                          |
| **Low**    | Duplicate slug `ternus` nếu manual registration + export — không có uniqueness AC                                                      |

---

## Epic 4: Gallery App Shell & Catalog Registry

### Story 4.1: Gallery Layout & Home Page

| Severity   | Edge case                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| **High**   | Catalog rỗng lúc deploy sớm (chưa registration) — không có empty state UX cho home "featured templates" |
| **Medium** | Featured template slug broken sau rename — không có AC graceful degrade                                 |
| **Low**    | Responsive breakpoint mobile — AC nói desktop-primary nhưng không define minimum mobile layout          |

### Story 4.2: Catalog Schema & Type Definitions

| Severity   | Edge case                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| **Medium** | Filter param types không validate runtime — `PieceMeta.mood` array vs URL single value mismatch chưa define |
| **Low**    | `deps` field optional vs required — không specify empty deps behavior                                       |

### Story 4.3: Dynamic Slug Routes for All Layers

| Severity   | Edge case                                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **High**   | Slug tồn tại nhưng sai layer (`/ui/ternus` thay vì `/templates/ternus`) — AC chỉ 404 "không tồn tại", không cross-layer redirect |
| **High**   | Index page 0 pieces (pre-registration) — không có empty state, chỉ list khi có data                                              |
| **Medium** | Thumbnail / inline preview fail load — không có fallback placeholder                                                             |
| **Medium** | `generateStaticParams` stale sau thêm piece mới — không có AC ISR/rebuild strategy                                               |
| **Low**    | Slug case sensitivity (`Pixel-Blast` vs `pixel-blast`) — không define                                                            |

### Story 4.4: CopyButton — Single & Multi File Modes

| Severity   | Edge case                                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **High**   | Clipboard API denied (non-HTTPS, permission denied, Safari iframe) — AC chỉ nói desktop Clipboard API, không fallback khi API fail trên desktop |
| **High**   | Mobile fallback "code block read-only" — không define select-all UX, không cover tablet có keyboard                                             |
| **High**   | Payload clipboard vượt giới hạn (~1MB) cho multi-file template — không có truncate warning                                                      |
| **Medium** | `copyMode: "multi"` tab viewer — không có keyboard nav / a11y giữa tabs                                                                         |
| **Medium** | Copy khi component chưa hydrate — race empty clipboard                                                                                          |
| **Medium** | CSS nối cuối single-file vượt clipboard limit — không handle                                                                                    |
| **Low**    | `// deps:` header thiếu version pin — dev install sai version                                                                                   |

### Story 4.5: Catalog Aggregator & Registration Pattern

| Severity     | Edge case                                                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Critical** | Hai registration task merge cùng lúc vào `lib/catalog/index.ts` — AC document pattern nhưng không có AC conflict resolution / duplicate slug guard |
| **High**     | Epic agent vi phạm lane sửa trực tiếp `catalog/index.ts` — không có AC `git diff` lane enforcement                                                 |
| **High**     | `allPieces` rỗng khi aggregator tạo xong nhưng chưa registration #1 — gallery index trống không có messaging                                       |
| **Medium**   | Import `pieceMeta` fail (package chưa build) — aggregator crash toàn gallery                                                                       |
| **Medium**   | Thứ tự piece trong array ảnh hưởng featured/home — không define sort                                                                               |
| **Low**      | Registration task #1 chạy khi Ternus chưa pass invariant — không gate                                                                              |

---

## Epic 5: Memecoin Template & Price-Ticker

### Story 5.1: Price-Ticker UI Component

| Severity   | Edge case                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| **High**   | `mode: 'flash'` trong prop union nhưng MVP chỉ marquee+slot — không có AC behavior cho flash (error? noop? hidden?) |
| **High**   | `useReducedMotion()` tắt animation — marquee dừng ở đâu (giữ giá cuối? static strip?) không define                  |
| **Medium** | Slot mode rapid price tick — animation queue overflow / skip frames                                                 |
| **Medium** | Giá `undefined` / `NaN` / negative — không có input validation AC                                                   |
| **Low**    | Marquee 0 tokens — empty content layout                                                                             |

### Story 5.2: Memecoin Hero + Ticker Section

| Severity   | Edge case                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------ |
| **Medium** | `theme-neon` conflict khi embed trong page `data-theme="infra"` shell — không define scope |
| **Low**    | Preview route chưa register catalog — orphan route                                         |

### Story 5.3: Token Stats Strip Section

| Severity   | Edge case                                                                      |
| ---------- | ------------------------------------------------------------------------------ |
| **Medium** | Stats giá trị 0 hoặc placeholder `—` — layout break với display typography lớn |
| **Low**    | Số rất lớn (market cap) overflow container — không có truncation AC            |

### Story 5.4: Community Marquee Section

| Severity   | Edge case                                                        |
| ---------- | ---------------------------------------------------------------- |
| **Medium** | 0 social icons / 0 followers — marquee rỗng không có empty state |
| **Medium** | Reduced motion — marquee static: hiện 1 hàng hay ẩn section?     |
| **Low**    | Avatar image load fail — broken image icon                       |

### Story 5.5: Memecoin Template Composition

| Severity   | Edge case                                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| **High**   | Registration task #2 parallel với #3 (GameFi/NFT đều ghi #3 ở story khác) — numbering ambiguity, merge order undefined |
| **Medium** | Một section fail render — whole template crash vs partial — không có ErrorBoundary per section                         |
| **Low**    | `pnpm build` pass nhưng runtime OOM trên mobile preview                                                                |

---

## Epic 6: GameFi Template — Game HUD Aesthetic

### Story 6.1: GameFi HUD Hero Section

| Severity   | Edge case                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------- |
| **High**   | ErrorBoundary "nếu animated" — không bắt buộc cho mọi animated path; WebGL optional wording mơ hồ |
| **Medium** | Reduced motion + HUD glitch animation — không define degrade                                      |
| **Low**    | `theme-game` vars missing — fallback to infra silently                                            |

### Story 6.2: Character Showcase Skeleton Section

| Severity   | Edge case                                                             |
| ---------- | --------------------------------------------------------------------- |
| **Medium** | Skeleton placeholder với 0 characters — empty grid không có messaging |
| **Low**    | Image placeholder aspect ratio break responsive                       |

### Story 6.3: GameFi Template Composition

| Severity   | Edge case                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| **High**   | Registration task #3 trùng số với Epic 7 Story 7.3 — parallel merge conflict risk không có ordering AC |
| **Medium** | "Visual distinct" — subjective, không có measurable AC khi theme switch comparison                     |

---

## Epic 7: NFT Template Skeleton

### Story 7.1: NFT Gallery Grid Section

| Severity   | Edge case                                                    |
| ---------- | ------------------------------------------------------------ |
| **Medium** | Grid 0 NFT items — skeleton OK nhưng empty grid UX undefined |
| **Medium** | `theme-nft` placeholder thiếu accent — grid border invisible |
| **Low**    | Lazy image load fail — no placeholder                        |

### Story 7.2: Mint Countdown Section Skeleton

| Severity   | Edge case                                                                     |
| ---------- | ----------------------------------------------------------------------------- |
| **High**   | Countdown target date past / invalid — timer negative hoặc NaN display        |
| **Medium** | Reduced motion — countdown vẫn tick số hay static "Mint soon" — không specify |
| **Low**    | Timezone không specify cho countdown placeholder                              |

### Story 7.3: NFT Template Composition

| Severity   | Edge case                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------- |
| **High**   | Registration task #3 conflict với GameFi 6.3 — cùng task number, không có serial ordering AC   |
| **Medium** | `pieceMeta` note "aesthetic chưa final" — gallery filter by mood=nft vẫn show piece incomplete |
| **Low**    | Template ship block other templates — AC nói không block nhưng không verify parallel wave      |

---

## Epic 8: UI Catalog Polish & New Pieces

### Story 8.1: Polish PixelBlast Component

| Severity     | Edge case                                                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Critical** | WebGL "graceful degrade khi GPU limited" — không define detection (no WebGL? context lost? low FPS?) vs chỉ ErrorBoundary on throw |
| **High**     | Static fallback content unspecified — poster? CSS gradient? blank div?                                                             |
| **High**     | `useReducedMotion()` + WebGL — canvas dispose vs freeze frame vs hide — không define                                               |
| **Medium**   | ErrorBoundary retry — user refresh section không có AC                                                                             |
| **Medium**   | WebGL context lost mid-animation (tab background) — không cover                                                                    |
| **Low**      | Copy single-file WebGL — recipient project thiếu Three.js setup — deps hint only                                                   |

### Story 8.2: Polish LogoLoop & SoftAurora

| Severity   | Edge case                                                                       |
| ---------- | ------------------------------------------------------------------------------- |
| **Medium** | SoftAurora có thể canvas/WebGL — AC không explicit ErrorBoundary như PixelBlast |
| **Medium** | LogoLoop 0 logos — empty loop layout                                            |
| **Low**    | Reduced motion — LogoLoop static first logo hay hide                            |

### Story 8.3: Add 2–3 New UI Pieces

| Severity   | Edge case                                                                         |
| ---------- | --------------------------------------------------------------------------------- |
| **Medium** | Constraint `< 400 dòng` — không có AC khi deps boilerplate đẩy vượt (split file?) |
| **Low**    | Slug collision với UI đã có — không uniqueness check                              |

### Story 8.4: Register All UI Catalog Entries

| Severity   | Edge case                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| **High**   | Registration #4 khi < 8 `pieceMeta` exported — AC assume đủ 8, không có partial register / empty index AC |
| **High**   | Parallel: UI piece merged nhưng registration chưa chạy — `/ui/<slug>` 404 trong catalog index gap window  |
| **Medium** | Thumbnail fail cho ≥8 entries — không batch fallback                                                      |
| **Low**    | Count ≥8 include sections lẫn UI — FR-10 wording ambiguous                                                |

---

## Epic 9: Gallery Filters & Final QA

### Story 9.1: FilterBar Multi-Axis Component

| Severity   | Edge case                                                                           |
| ---------- | ----------------------------------------------------------------------------------- |
| **High**   | AND logic trả 0 kết quả — không có empty state "không có Piece phù hợp"             |
| **Medium** | Filter options stale khi catalog thêm tag mới — hardcoded list trong AC             |
| **Medium** | Chọn filter xung đột (mood=infra + use-case=memecoin không có piece) — 0 results UX |
| **Low**    | FilterBar trên page chưa có pieces registered — all options lead to empty           |

### Story 9.2: URL SearchParams Persistence

| Severity     | Edge case                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| **Critical** | Invalid param value (`?mood=foo`, `?stack=invalid`) — không có AC sanitize / ignore / show warning            |
| **Critical** | Empty param (`?mood=&use-case=`) — không define treat as clear vs filter empty string                         |
| **High**     | Unknown/extra params (`?foo=bar`) — preserve hay strip không specify                                          |
| **High**     | Duplicate keys (`?mood=infra&mood=neon`) — AND hay last-wins không define                                     |
| **High**     | Multi-value single axis (`?mood=infra,neon`) — không trong AC example, behavior undefined                     |
| **Medium**   | URL quá dài (nhiều filter) — browser limit / share break                                                      |
| **Medium**   | Reload với filter trỏ piece đã remove khỏi catalog — stale URL empty results                                  |
| **Medium**   | Clear filters — partial clear (1 axis) vs full reset URL không define                                         |
| **Medium**   | Share link cross-layer (`/ui?mood=infra` vs `/templates?mood=infra`) — FilterBar có trên cả hai không specify |
| **Low**      | Encoding edge (`use-case` vs `use_case`) — chỉ kebab-case trong example                                       |
| **Low**      | Browser back/forward — filter sync không mention                                                              |

### Story 9.3: Full Catalog Invariant QA Audit

| Severity   | Edge case                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------- |
| **High**   | WebGL pieces có ErrorBoundary nhưng fallback không pass visual bar — audit grep-only không check fallback quality |
| **Medium** | `useReducedMotion()` tồn tại nhưng nhánh noop (animation vẫn chạy) — grep pass, behavior fail                     |
| **Medium** | Piece mới merge sau audit, trước ship — không có re-audit gate                                                    |
| **Low**    | `grep` exclude `docs/examples` — example vi phạm copy vào project                                                 |

### Story 9.4: End-to-End Route Smoke Test

| Severity   | Edge case                                                                        |
| ---------- | -------------------------------------------------------------------------------- |
| **High**   | Copy action desktop only trong smoke — mobile copy fallback không test           |
| **High**   | Reduced motion smoke — không có AC test với `prefers-reduced-motion: reduce`     |
| **High**   | WebGL degrade smoke — không test trên environment không có WebGL                 |
| **Medium** | FCP < 3s informal — không define fail action nếu vượt                            |
| **Medium** | Filter + smoke: shared URL load trong smoke test không cover                     |
| **Medium** | Registered slug route fail nhưng index list vẫn show — inconsistent state        |
| **Low**    | Parallel agent merge conflict residue trong smoke — không verify clean git state |

---

## Cross-Epic (không gắn story đơn)

| Severity     | Edge case                                                                                                                                                                       | Liên quan                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **Critical** | Nhiều wave parallel merge `catalog/index.ts` / shared files dù registration pattern — mitigation ở parallel-dev R1 nhưng **không** có story AC enforce serial registration gate | 3.3, 4.5, 5.5, 6.3, 7.3, 8.4 |
| **High**     | Theme switch trên gallery shell trong khi preview Piece embed `data-theme` riêng — double theme / leak                                                                          | 2.2, 4.3, 5.2                |
| **High**     | Catalog empty state xuyên suốt deploy pipeline (Wave 2–4 trước registration) — không story nào own                                                                              | 4.1, 4.3, 4.5, 8.4           |
| **Medium**   | Agent vượt lane sửa shared file — R9 mitigation không có acceptance criteria                                                                                                    | parallel-dev §6              |
| **Medium**   | `pnpm-workspace.yaml` thiếu package mới khi epic scaffold package — không auto-discover AC                                                                                      | 1.2, parallel wave 3–4       |
