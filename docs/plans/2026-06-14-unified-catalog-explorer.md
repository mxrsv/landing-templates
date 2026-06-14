# Unified Catalog Explorer — Implementation Plan

**Spec**: [2026-06-14-unified-catalog-explorer-design](../superpowers/specs/2026-06-14-unified-catalog-explorer-design.md)
**ADR**: [0001-template-preview-performance](../adr/0001-template-preview-performance.md) · **Glossary**: [CONTEXT.md](../../CONTEXT.md)
**Goal**: Gộp 3 trang catalog (`/ui`, `/sections`, `/templates`) thành một master–detail Explorer ở `/`, với chiến lược preview poster-first + render rẽ nhánh theo Layer để không hồi quy performance.
**Architecture**: URL searchParams là source-of-truth (resolve server-side). Thumbnail/Detail dùng Poster tĩnh `apps/docs/public/posters/<slug>.webp` (sinh bằng Playlight+sharp), live render chỉ mount khi hover (thumbnail) hoặc sau khi chọn (detail). Template render qua `<iframe src="/preview/<slug>">` để có viewport thật + browser tự teardown WebGL/rAF; ui/section render inline trong container `transform`+`contain`.

## 1. Kết quả mong đợi

- `/` chạy master–detail: sidebar text nhóm Layer + filter bar 4 trục + right pane (gallery poster / detail) — verify bằng `pnpm --filter docs build` xanh và mở `/?layer=template`, `/?piece=ternus` render đúng 2 trạng thái.
- Thumbnail là `<img>` poster; hover mới mount live, tối đa 1 live/lần — verify bằng Playwright: hover 1 card thấy đúng 1 node live preview xuất hiện, rời chuột thì unmount.
- Detail template dùng iframe — KHÔNG còn fixed-nav thoát khung / 100vh tràn — verify bằng Playwright snapshot `/?piece=ternus`: nav nằm trong khung iframe, không có element `position:fixed` của template phủ shell.
- Chuyển nhanh giữa template không rò WebGL context — verify bằng Playwright: vào `/?piece=ternus` → `/?piece=memecoin` → `/?piece=ternus`, mỗi lúc DOM chỉ có đúng 1 `<iframe>` trong right pane (iframe cũ bị gỡ → context teardown).
- `pnpm posters` regen được; CI fail khi poster lệch — verify bằng `pnpm posters` chạy xong sinh đủ file `.webp` cho mọi slug đã register, và `pnpm posters:check` exit code ≠ 0 khi có drift.
- Route cũ redirect đúng; build/lint/check-types xanh — verify bằng `pnpm lint && pnpm check-types && pnpm build` xanh và `curl -I /ui` → 307/308 về `/?layer=ui`.

## 2. Nguồn dữ liệu chuẩn

**Canonical data**: danh sách slug có preview = các entry trong [piece-registrations.ts](../../apps/docs/lib/catalog/piece-registrations.ts) (mỗi entry có `loadPreview` → `hasPreview(slug)` true). Hiện có 11: `chip-connect` (ui); `memecoin-hero-ticker`, `community-marquee`, `gamefi-hud-hero`, `character-showcase`, `token-stats-strip` (section); `ternus`, `memecoin`, `gamefi`, `aikit`, `waitlist` (template).

**Lấy từ**:

- Slug list cho gallery/sidebar/poster: `allPieces` (server) qua [lib/catalog/index.ts](../../apps/docs/lib/catalog/index.ts); script poster đọc trực tiếp text `piece-registrations.ts` (regex `slug:\s*"([^"]+)"`) vì `.mjs` không resolve được workspace TS import.
- Filter state: `searchParams` resolve server-side qua [filter-params.ts](../../apps/docs/lib/catalog/filter-params.ts) — GIỮ NGUYÊN param keys hiện có (`mood`, `useCase`, `stack`, `animation`, `q`), KHÔNG rename theo shorthand `use`/`anim` của spec.
- Poster image: `apps/docs/public/posters/<slug>.webp` (served tại `/posters/<slug>.webp`).

**KHÔNG lấy từ**:

- `manifest.ts` cho poster/gallery — manifest chứa slug planned-nhưng-chưa-register (vd `pixel-blast`, `logo-loop`), không khớp tập có preview.
- Root `public/` (repo root) — Next app root là `apps/docs`, chỉ `apps/docs/public` được serve.
- Client state chung giữa sidebar/filter/right-pane — mọi giao tiếp qua URL (spec §6).

## 3. Business rules & invariants

- **Poster-first mọi surface**: Thumbnail mặc định là poster tĩnh; Detail hiện poster trước khi live mount — verify bằng đọc DOM: `<img>` poster tồn tại trước khi `Preview` node xuất hiện.
- **Tối đa 1 live render/lần** (thumbnail): mount live qua hover-intent, claim singleton `live-registry`, hover card khác evict card trước — verify bằng Playwright đếm node live = 1.
- **Layer-split chỉ ở Detail**: `ui`/`section` → inline `transform`+`contain`; `template` → iframe. Thumbnail + sidebar đồng nhất mọi Layer — verify đọc `detail-preview.tsx` rẽ đúng nhánh theo `piece.layer`.
- **URL = source of truth**: filter/piece/layer resolve trên server từ `searchParams`; toggle ghi `router.replace` (giữ [use-catalog-filter-url.ts](../../apps/docs/components/shell/use-catalog-filter-url.ts)) — verify reload `/?piece=ternus&mood=infra` cho cùng kết quả.
- **`/preview/[slug]` load-bearing 2 vai**: target chụp poster + src iframe — KHÔNG xoá/đổi route này.
- **Poster freshness**: regen trong CI, fail nếu `git diff` thấy lệch — verify `pnpm posters:check`.

## 4. Phạm vi / Ngoài phạm vi

**Làm**:

- Poster pipeline (Playwright capture → sharp webp q80 @1280×720 reduced-motion) + `pnpm posters` / `pnpm posters:check` + workflow CI gate.
- `poster-thumb.tsx`, `template-iframe.tsx`, `detail-preview.tsx`, `catalog-sidebar.tsx`, `filter-bar.tsx`, helper `posters.ts` + `live-registry.ts` + `use-hover-intent.ts`.
- Trang `/` 2 trạng thái right pane (gallery poster / detail + tabs Source/Copy) + đổi `(shell)/layout.tsx` sang sidebar shell.
- Redirect `/ui` `/sections` `/templates` + 3 `[slug]` route; gỡ `site-nav.tsx` + phần thừa.

**KHÔNG làm**:

- Đổi `/preview/[slug]` (giữ nguyên).
- Đổi schema Piece (`types.ts`) hay registration convention.
- Rename filter param keys (`useCase`/`animation` giữ nguyên).
- Thêm test runner mới cho `apps/docs` (verify bằng build/lint/check-types + Playwright; filter-params đã pure, không thêm unit test mới).
- Đổi các trang reference `/ui/shapes`, `/ui/surfaces` (vẫn sống dưới shell mới, ngoài phạm vi).

## 5. Rủi ro & Quyết định còn mở

**Đã chốt có rủi ro**:

- **Poster diff gate dễ flaky**: screenshot không tất định 100% (font AA, sub-pixel) → `git diff --exit-code` có thể fail giả. Giảm bằng `reducedMotion:'reduce'` + `waitForLoadState('networkidle')` + `document.fonts.ready` + viewport cố định. Chấp nhận theo spec; nếu flaky thật sẽ nới sang so sánh pixel-threshold ở vòng sau.
- **Playwright không xuất WebP trực tiếp**: chỉ png/jpeg → phải screenshot PNG buffer rồi `sharp().webp({quality:80})`. Thêm devDep `sharp` (ngoài `playwright`) — đã bake vào A1.
- **`next/image` vs `<img>`**: chọn `<img>` thuần (poster đã pre-optimized webp 16:9 cố định size) → tránh image optimizer + `remotePatterns`; set `width`/`height` chống CLS, `loading="lazy"` `decoding="async"`.
- **Script poster cần app chạy**: script tự spawn `next start` (cần `pnpm build` trước) trên `PORT=3210`, đợi ready, capture, kill. CI: build → `pnpm posters:check`.
- **`?layer=` filter gallery**: khi có `?layer=`, gallery chỉ hiện group đó + sidebar highlight; vắng → hiện cả 3 group. `?layer` lạ bị drop về "all".

**Chưa chốt cần resolve**: (không có — 4 quyết định mở đã chốt ở spec §9, param keys giữ nguyên đã quyết ở §2.)

## 6. Các task

> Mỗi PHASE = 1 commit (theo yêu cầu). Task trong phase là các bước; commit ở cuối phase sau khi verify phase xanh.

---

### PHASE A — Poster infra (commit 1: `feat(catalog): poster pipeline + CI freshness gate`)

#### Task A1: devDeps + helper poster src + capture script khung

**File(s)**:

- [package.json](../../package.json) (root — thêm devDep + scripts)
- [scripts/capture-posters.mjs](../../scripts/capture-posters.mjs) (mới)
- [apps/docs/lib/catalog/posters.ts](../../apps/docs/lib/catalog/posters.ts) (mới)

**Build**:

- Cài: `pnpm add -D -w playwright sharp` rồi `pnpm playwright install chromium` (KHÔNG dùng `pnpm exec`).
- Root `package.json` scripts: thêm `"posters": "node scripts/capture-posters.mjs"` và `"posters:check": "node scripts/capture-posters.mjs && git diff --exit-code apps/docs/public/posters"`.
- `posters.ts`: export pure `posterSrc(slug: string): string` trả `/posters/${slug}.webp` (dùng chung thumb/iframe/detail).
- `capture-posters.mjs`:
  - Đọc slug: `readFileSync` `apps/docs/lib/catalog/piece-registrations.ts`, regex `slug:\s*"([^"]+)"`, dedupe → mảng slug (bỏ match trong block comment header bằng cách chỉ lấy trong mảng `pieceRegistrations`).
  - Boot: `spawn('pnpm', ['--filter','docs','start'], {env:{...process.env, PORT:'3210'}})`; poll `http://localhost:3210/` tới khi 200 (timeout 60s). Cho phép override bằng `BASE_URL` env (skip spawn).
  - Mỗi slug: `browser.newContext({ viewport:{width:1280,height:720}, reducedMotion:'reduce' })`, `page.goto('/preview/'+slug, {waitUntil:'networkidle'})`, `await page.evaluate(()=>document.fonts.ready)`, `page.waitForTimeout(400)` settle, `buf = await page.screenshot({type:'png', clip:{x:0,y:0,width:1280,height:720}})`, `await sharp(buf).webp({quality:80}).toFile('apps/docs/public/posters/'+slug+'.webp')`.
  - `mkdirSync('apps/docs/public/posters', {recursive:true})` trước vòng lặp; teardown: kill child server ở `finally`.

**Verify**:

- `node scripts/capture-posters.mjs --help` không crash parse (hoặc chạy thật ở A2).
- `pnpm --filter docs check-types` xanh (posters.ts hợp lệ).

#### Task A2: Sinh poster cho mọi slug + CI gate workflow

**File(s)**:

- `apps/docs/public/posters/*.webp` (sinh ra — 11 file)
- [.github/workflows/posters.yml](../../.github/workflows/posters.yml) (mới)

**Phụ thuộc**: Task A1

**Decision**: CI gate là GitHub Actions job riêng chạy `pnpm build` → `pnpm posters:check`.

**Build**:

- `pnpm build` (cần build trước để `next start` chạy) rồi `pnpm posters` → sinh `apps/docs/public/posters/{chip-connect,memecoin-hero-ticker,community-marquee,gamefi-hud-hero,character-showcase,token-stats-strip,ternus,memecoin,gamefi,aikit,waitlist}.webp`.
- `posters.yml`: trigger `pull_request` + `push` nhánh chính; steps: checkout → setup-node 20 + pnpm → `pnpm install` → `pnpm playwright install --with-deps chromium` → `pnpm build` → `pnpm posters:check`.

**Verify**:

- `ls apps/docs/public/posters/*.webp | wc -l` → `11`.
- Mỗi file > 1KB và là webp: `file apps/docs/public/posters/ternus.webp` → chứa `Web/P`.
- `pnpm posters:check` ngay sau regen → exit 0 (không drift); sửa tay 1 byte 1 file rồi chạy lại → exit ≠ 0 (chứng minh gate bắt drift), sau đó `git checkout` lại file.

---

### PHASE B — Render strategy theo Layer (commit 2: `feat(catalog): poster-first thumb + template iframe + layer-split detail`)

#### Task B1: hover-intent hook + live singleton registry

**File(s)**:

- [apps/docs/components/catalog/use-hover-intent.ts](../../apps/docs/components/catalog/use-hover-intent.ts) (mới)
- [apps/docs/components/catalog/live-registry.ts](../../apps/docs/components/catalog/live-registry.ts) (mới)

**Build**:

- `use-hover-intent.ts`: hook `useHoverIntent(delay=150)` trả `{ active, bind }` với `bind = { onPointerEnter, onPointerLeave }`; `onPointerEnter` set timer → `active=true`; `onPointerLeave` clear timer + `active=false`; cleanup clear timer on unmount.
- `live-registry.ts`: module-level singleton, export `claimLive(slug, evict: () => void): void` (gọi `evict` của slug đang giữ trước, rồi set slug+evict mới) và `releaseLive(slug): void` (chỉ clear nếu slug khớp). Đảm bảo tối đa 1 live.

**Verify**:

- `pnpm --filter docs check-types` xanh.
- Đọc lại: `claimLive` luôn gọi `evict` của owner cũ trước khi ghi owner mới (logic 1-at-a-time đúng).

#### Task B2: `poster-thumb.tsx` (poster + hover-live, prefetch, 1-at-a-time)

**File(s)**:

- [apps/docs/components/catalog/poster-thumb.tsx](../../apps/docs/components/catalog/poster-thumb.tsx) (mới)

**Phụ thuộc**: Task A1 (posterSrc), Task B1

**Build**:

- Client component `PosterThumb({ slug, mood })`. Khung `aspect-[16/9]` (giữ class hiện có ở `piece-card-preview.tsx`).
- Mặc định: `<img src={posterSrc(slug)} width={1280} height={720} loading="lazy" decoding="async" onError={()=>setPosterFailed(true)} className="h-full w-full object-cover" />`; nếu `posterFailed` → render placeholder gradient theo `mood` (port `CardPreviewPlaceholder` từ `piece-card-preview.tsx`).
- Hover-intent (`useHoverIntent`): `onPointerEnter` → prefetch chunk `void previewLoaders[slug]?.()` + (nếu KHÔNG `prefers-reduced-motion`) `claimLive(slug, ()=>setLive(false))` rồi `setLive(true)`; `onPointerLeave` → `releaseLive(slug)` + `setLive(false)`.
- Khi `live` true: mount live qua `cardPreviewComponents[slug]` (reuse [card-preview-components.tsx](../../apps/docs/components/catalog/card-preview-components.tsx)) trong wrapper `inert data-theme={mood} pointer-events-none scale-[0.25] origin-top-left h-[400%] w-[400%]` (giữ kỹ thuật scale của `piece-card-preview.tsx`), phủ đè lên poster.
- Bỏ qua mount live nếu `window.matchMedia('(prefers-reduced-motion: reduce)').matches` (đọc 1 lần trong `useEffect`).

**Verify**:

- `pnpm --filter docs check-types` + `pnpm --filter docs lint` xanh.
- (Sau khi C3 ráp vào trang) Playwright: hover 1 card → xuất hiện node `[data-theme]` live; rời chuột → biến mất; hover card khác → vẫn chỉ 1 node live.

#### Task B3: `template-iframe.tsx` (iframe + poster overlay + width switcher)

**File(s)**:

- [apps/docs/components/catalog/template-iframe.tsx](../../apps/docs/components/catalog/template-iframe.tsx) (mới)

**Phụ thuộc**: Task A1 (posterSrc)

**Build**:

- Client component `TemplateIframe({ slug })`. State `width: "full"|"1024"|"375"` (default `"full"`) + `loaded: boolean`.
- Width switcher: tái dùng cùng cấu trúc nút như [preview-viewport.tsx](../../apps/docs/components/catalog/preview-viewport.tsx) (3 nút Full/1024/375, `aria-pressed`), map sang `max-w` của wrapper iframe (`full`→`w-full`, `1024`→`max-w-[1024px]`, `375`→`max-w-[375px]`).
- `<iframe src={`/preview/${slug}`} title={slug+" preview"} onLoad={()=>setLoaded(true)} className="h-[70vh] w-full" loading="lazy" />` — iframe cuộn nội bộ (height cố định).
- Poster overlay: `<img src={posterSrc(slug)} ... className="absolute inset-0 ... transition-opacity" style={{opacity: loaded?0:1}} aria-hidden />` phủ lên iframe tới khi `loaded`.
- Link `Fullscreen ↗` → `/preview/${slug}` `target="_blank"` (giữ parity với `preview-viewport.tsx`).

**Verify**:

- `pnpm --filter docs check-types` + lint xanh.
- (Sau C3) Playwright `/?piece=ternus`: đúng 1 `<iframe>` src `/preview/ternus`; nav của template nằm trong iframe (không có element template `position:fixed` trong document shell).

#### Task B4: `detail-preview.tsx` (rẽ nhánh Layer, poster-first inline)

**File(s)**:

- [apps/docs/components/catalog/detail-preview.tsx](../../apps/docs/components/catalog/detail-preview.tsx) (mới)

**Phụ thuộc**: Task B3, Task A1

**Build**:

- `DetailPreview({ piece })`. Nếu `!hasPreview(piece.slug)` → text fallback (giữ message như `piece-detail.tsx`).
- `piece.layer === "template"` → `<TemplateIframe slug={piece.slug} />`.
- `ui`/`section` → reuse [preview-viewport.tsx](../../apps/docs/components/catalog/preview-viewport.tsx) width switcher, bọc `PieceLivePreview` trong container constrain: `<div style={{ transform:"translateZ(0)", contain:"layout paint" }} data-theme={piece.mood[0]}>` (chống `position:fixed`/`100vh` thoát khung) — poster-first: hiện `<img posterSrc>` overlay tới khi live mount xong (dùng `onLoad`/effect cờ `mounted`).
- Là client component (cần state poster overlay); nhận `piece: PieceMeta` (serializable) từ server.

**Verify**:

- `pnpm --filter docs check-types` + lint xanh.
- Đọc lại: nhánh `template` KHÔNG render `PieceLivePreview` inline (chỉ iframe); nhánh `ui/section` KHÔNG render iframe.
- Commit Phase B sau khi B1–B4 verify xanh.

---

### PHASE C — Explorer shell (commit 3: `feat(catalog): unified explorer shell — sidebar + filter bar + 2-state right pane`)

#### Task C1: `catalog-sidebar.tsx` (text nav nhóm Layer, active theo `?piece`)

**File(s)**:

- [apps/docs/components/shell/catalog-sidebar.tsx](../../apps/docs/components/shell/catalog-sidebar.tsx) (mới)

**Build**:

- Client component `CatalogSidebar({ pieces })` nhận `pieces: PieceMeta[]` (từ layout server).
- Nhóm theo Layer thứ tự `ui` → `section` → `template`, heading text mỗi nhóm (`UI` / `Sections` / `Templates`), mỗi Piece là `<Link>` text thuần.
- Href giữ filter hiện tại: đọc `useSearchParams`, set `piece=slug` (giữ `mood`/`useCase`/`stack`/`animation`/`q`/`layer`), build `/?<qs>`.
- Active: `searchParams.get("piece") === slug` → `aria-current="page"` + style active (theo pattern `site-nav.tsx`).

**Verify**:

- `pnpm --filter docs check-types` + lint xanh.
- Đọc lại: href preserve các filter param (không nuốt).

#### Task C2: `filter-bar.tsx` (4 trục ngang + count + chips)

**File(s)**:

- [apps/docs/components/shell/filter-bar.tsx](../../apps/docs/components/shell/filter-bar.tsx) (mới)

**Phụ thuộc**: reuse [filter-params.ts](../../apps/docs/lib/catalog/filter-params.ts), [use-catalog-filter-url.ts](../../apps/docs/components/shell/use-catalog-filter-url.ts), [active-filter-chips.tsx](../../apps/docs/components/shell/active-filter-chips.tsx)

**Build**:

- Client component `FilterBar({ options, resultCount })`. Layout ngang (`flex flex-wrap`), mỗi trục 1 cụm: nhãn (Mood/Use case/Stack/Animation) + các option toggle (reuse `useCatalogFilterUrl().toggle`). Ẩn trục rỗng (giữ logic `FilterSidebar`).
- Dưới/cuối hàng: `<ActiveFilterChips options resultCount />` (reuse nguyên).

**Verify**:

- `pnpm --filter docs check-types` + lint xanh.
- Đọc lại: dùng đúng `FILTER_AXES` + `toggle` đẩy URL (không tạo client filter state mới).

#### Task C3: trang `/` — 2 trạng thái right pane

**File(s)**:

- [apps/docs/app/(shell)/page.tsx](<../../apps/docs/app/(shell)/page.tsx>) (thay nội dung)
- [apps/docs/components/catalog/gallery-grid.tsx](../../apps/docs/components/catalog/gallery-grid.tsx) (mới)
- [apps/docs/components/catalog/piece-source-panel.tsx](../../apps/docs/components/catalog/piece-source-panel.tsx) (mới)

**Phụ thuộc**: Task B2, B4, C2

**Build**:

- `gallery-grid.tsx` (server): nhận `pieces`, render lưới card poster — mỗi card = `<PosterThumb>` + tên (`<Link>` `/?piece=slug&…`) + badges mood/stack (port từ [piece-card.tsx](../../apps/docs/components/catalog/piece-card.tsx) nhưng preview = PosterThumb). Group theo Layer khi không filter.
- `piece-source-panel.tsx` (server, async): hấp thụ phần Source/Copy của [piece-detail.tsx](../../apps/docs/components/catalog/piece-detail.tsx) — `readPieceSources` + `assembleSingleFile`/multi + `<Tabs>` Source/Copy + `<CopyButton>`. KHÔNG gồm tab Preview (preview do `DetailPreview` lo).
- `page.tsx` (server):
  - `sp = await props.searchParams`; parse `layer` (validate `ui|section|template`, lạ→undefined), build `options`/`filter` từ `allPieces` (hoặc theo layer nếu có), `filtered = filterPieces(...)`.
  - `pieceSlug = firstParam(sp.piece)`; `selected = allPieces.find(p=>p.slug===pieceSlug)`.
  - Render: `<FilterBar options resultCount={filtered.length} />` trên cùng; dưới là right pane:
    - `selected` undefined → `<GalleryGrid pieces={filtered} groupByLayer={!layer} />`.
    - `selected` có → header (tên + badges + deps tooltip, port từ `piece-detail.tsx`) + `<DetailPreview piece={selected} />` + `<PieceSourcePanel piece={selected} />`.
- Filter options: tính trên toàn `allPieces` (không bó theo 1 layer) để filter bar đủ trục; gallery lọc thêm theo `layer` nếu có.

**Verify**:

- `pnpm --filter docs build` xanh.
- Mở `/` → gallery 3 nhóm Layer; `/?layer=template` → chỉ template; `/?piece=ternus` → detail iframe + tabs Source; `/?piece=chip-connect` → detail inline.
- Reload `/?piece=ternus&mood=infra` → giữ nguyên selection + filter.

#### Task C4: đổi `(shell)/layout.tsx` sang sidebar shell

**File(s)**:

- [apps/docs/app/(shell)/layout.tsx](<../../apps/docs/app/(shell)/layout.tsx>) (thay)

**Phụ thuộc**: Task C1

**Build**:

- Server layout: import `allPieces`, bỏ `<SiteNav />`, render flex 2 cột: `<aside>` chứa `<CatalogSidebar pieces={allPieces} />` (cố định bề rộng ~`w-56`, sticky, cuộn dọc) + `<div className="min-w-0 flex-1">{children}</div>`.
- Đảm bảo `/preview/[slug]` KHÔNG bị ảnh hưởng (nằm ngoài group `(shell)`).

**Verify**:

- `pnpm --filter docs build` xanh.
- Mở `/ui/shapes` (trang reference cũ) → vẫn render trong shell mới, không vỡ.
- Commit Phase C sau khi C1–C4 + verify xanh.

---

### PHASE D — Migration & dọn (commit 4: `refactor(catalog): redirect route cũ + gỡ site-nav/index-page thừa`)

#### Task D1: redirect route cũ

**File(s)**:

- [apps/docs/app/(shell)/ui/page.tsx](<../../apps/docs/app/(shell)/ui/page.tsx>), [sections/page.tsx](<../../apps/docs/app/(shell)/sections/page.tsx>), [templates/page.tsx](<../../apps/docs/app/(shell)/templates/page.tsx>)
- [apps/docs/app/(shell)/ui/[slug]/page.tsx](<../../apps/docs/app/(shell)/ui/[slug]/page.tsx>), [sections/[slug]/page.tsx](<../../apps/docs/app/(shell)/sections/[slug]/page.tsx>), [templates/[slug]/page.tsx](<../../apps/docs/app/(shell)/templates/[slug]/page.tsx>)

**Decision**: dùng `redirect()` từ `next/navigation` trong page server component (Next 16.2.7, 307).

**Build**:

- 3 index page → body chỉ `redirect("/?layer=ui")` / `?layer=section` / `?layer=template` (xoá `PieceIndexPage`/`headerAction`). Giữ `/ui/shapes`, `/ui/surfaces` nguyên (không đụng).
- 3 `[slug]` page → `const {slug}=await props.params; redirect("/?piece="+slug)` (bỏ `generateStaticParams`/`notFound`/`PieceDetail`).
- Lưu ý: vì `/ui/page.tsx` redirect nhưng `/ui/[slug]` cũng redirect — không xung đột (segment khác nhau).

**Verify**:

- `pnpm --filter docs build` xanh (typegen lại route).
- `curl -sI http://localhost:3000/templates` → `location: /?layer=template`; `curl -sI http://localhost:3000/templates/ternus` → `location: /?piece=ternus`.

#### Task D2: gỡ `site-nav.tsx` + phần thừa của `piece-index-page.tsx`

**File(s)**:

- xoá [apps/docs/components/shell/site-nav.tsx](../../apps/docs/components/shell/site-nav.tsx)
- xoá [apps/docs/components/catalog/piece-index-page.tsx](../../apps/docs/components/catalog/piece-index-page.tsx)
- xoá [apps/docs/components/shell/filter-sidebar.tsx](../../apps/docs/components/shell/filter-sidebar.tsx) (thay bởi `filter-bar.tsx`)
- kiểm [apps/docs/components/catalog/piece-card.tsx](../../apps/docs/components/catalog/piece-card.tsx) + [piece-card-preview.tsx](../../apps/docs/components/catalog/piece-card-preview.tsx) + [piece-detail.tsx](../../apps/docs/components/catalog/piece-detail.tsx) + [home-search.tsx](../../apps/docs/components/shell/home-search.tsx)

**Phụ thuộc**: Task C3, C4, D1 (mọi consumer đã chuyển)

**Build**:

- `grep -rn` từng symbol trước khi xoá: `SiteNav`, `PieceIndexPage`, `FilterSidebar`, `PieceCard`, `PieceDetail`, `HomeSearch`. Chỉ xoá file khi 0 consumer còn lại.
- `site-nav.tsx`, `piece-index-page.tsx`, `filter-sidebar.tsx`: chắc chắn xoá (đã thay).
- `piece-card.tsx` + `piece-card-preview.tsx`: nếu gallery-grid (C3) đã thay hoàn toàn → xoá; giữ `card-preview-components.tsx` (PosterThumb dùng).
- `piece-detail.tsx`: nội dung Source đã chuyển sang `piece-source-panel.tsx`, preview sang `DetailPreview` → xoá nếu 0 consumer.
- `home-search.tsx`: nếu không nhúng vào explorer → xoá (consumer cũ là home page đã thay).

**Verify**:

- `grep -rn "site-nav\|piece-index-page\|filter-sidebar" apps/docs` → rỗng.
- `pnpm --filter docs lint` xanh (no unused / no broken import).

#### Task D3: gate xanh toàn repo + CWV không hồi quy

**File(s)**: (không sửa code — chạy kiểm)

**Phụ thuộc**: D1, D2

**Build**:

- Chạy `pnpm lint && pnpm check-types && pnpm build` toàn repo.
- CWV: trước migration không có baseline lưu sẵn → so sánh cấu trúc + đo bằng Playwright trên build production: `/?piece=ternus` chỉ 1 iframe (không N live template), gallery dùng `<img>` poster (không mount N component) → xác nhận giảm tải. Đo LCP/CLS thủ công 1 lần trên `/` và `/?piece=ternus`, ghi vào harvest-log.
- WebGL: Playwright vào `/?piece=ternus` → `/?piece=memecoin` → `/?piece=ternus`, mỗi bước assert `document.querySelectorAll('main iframe').length === 1` (iframe cũ bị gỡ → context teardown, không tích luỹ).

**Verify**:

- `pnpm lint` xanh · `pnpm check-types` xanh · `pnpm build` xanh.
- Playwright WebGL assertion pass (luôn 1 iframe).
- `pnpm posters:check` exit 0.
- Commit Phase D.

---

## 7. Thứ tự & rollback

- Commit theo phase A→B→C→D (mỗi phase 1 commit) → `git revert` từng phase độc lập.
- Phase A độc lập (chỉ thêm infra + assets) — an toàn merge sớm.
- Phase B thêm component mới, chưa nối trang — không phá `/` cũ.
- Phase C nối explorer + thay `/` và layout — đây là điểm "bật" trải nghiệm mới.
- Phase D xoá route/symbol cũ — chỉ chạy khi C xanh.
