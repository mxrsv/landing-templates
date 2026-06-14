# Unified Catalog Explorer — Design Spec

> Spec · 2026-06-14 · repo `landing-page-list` · status: **approved — sẵn sàng viết plan**
> Glossary: [`CONTEXT.md`](../../../CONTEXT.md) (Piece / Layer / Mood / Thumbnail / Detail preview / Fullscreen preview / Poster)
> Quyết định preview-performance: [`docs/adr/0001-template-preview-performance.md`](../../adr/0001-template-preview-performance.md)
> Nguồn: phiên idea-refine (layout) + grill-with-docs (preview performance)

## 1. Mục tiêu & JTBD

Gộp 3 trang catalog rời (`/ui`, `/sections`, `/templates`) thành **một explorer duy nhất ở `/`**:
_"vào một chỗ, duyệt mọi Piece theo nhóm, xem preview ngay, copy source"_ — không nhảy trang.

- **Là gì:** layout master–detail. Sidebar trái điều hướng theo Layer (text thuần); vùng phải hiển thị
  preview của Piece đang chọn + source/copy. Filter là thanh ngang trên cùng. Deep-link qua `?piece=slug`.
- **Vì sao:** giảm ma sát điều hướng (1 trang thay vì 3 + N detail pages); tập trung trải nghiệm "ngắm → copy";
  dọn route surface.
- **Ràng buộc xuyên suốt:** không hồi quy performance — đặc biệt template (full-page + WebGL). Toàn bộ chiến lược
  preview tuân theo ADR-0001.
- **Thước đo thành công:** xem mục 8.

## 2. Quyết định đã chốt

### 2.1 Layout (idea-refine)

| Hạng mục                                     | Chốt                                                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Kiểu preview                                 | **Master–detail** — sidebar list trái, preview vùng phải                                                      |
| Chia nhóm sidebar                            | **Theo Layer** — UI / Sections / Templates                                                                    |
| Sidebar                                      | **Text thuần** (kiểu Storybook), không thumbnail                                                              |
| Filter 4 trục (mood/useCase/stack/animation) | **Thanh ngang trên cùng**, không nằm trong sidebar                                                            |
| Deep-link                                    | **Giữ qua URL** — `?piece=slug` (+ `?layer=`, các trục filter); URL = source of truth, resolve server-side    |
| Detail page                                  | **Hấp thụ vào right pane** — tabs Preview / Source / Copy (nội dung `piece-detail.tsx`); bỏ detail page riêng |
| Route cũ                                     | **Redirect** — `/ui` `/sections` `/templates` → `/?layer=`; các `[slug]` → `/?piece=` (xem mục 5)             |

### 2.2 Preview performance (grill → ADR-0001)

| Hạng mục              | Chốt                                                                                                                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thumbnail (mọi Layer) | **Poster-first** — ảnh tĩnh mặc định, hover mới mount sống, 1 cái/lần                                                                                                        |
| Phạm vi poster        | **Đồng nhất mọi Layer** (Q5: A) — khác biệt theo Layer chỉ nằm ở Detail preview                                                                                              |
| Poster pipeline       | Playwright chụp `/preview/[slug]` ở viewport cố định, `prefers-reduced-motion`, crop **hero-fold 16:9** → `public/posters/[slug].webp`                                       |
| Chống stale           | **CI gate** — regen trong CI, fail nếu `git diff` thấy poster lệch                                                                                                           |
| Detail preview        | **Hybrid theo Layer**: `ui`/`section` render **inline** (`transform`+`contain`); `template` render qua **`<iframe>` của `/preview/[slug]`**. Cả hai poster-first, 1 live/lần |
| `/preview/[slug]`     | **Giữ** — load-bearing 2 vai: target chụp poster + src của iframe detail                                                                                                     |

### 2.3 Default triển khai đã thống nhất

- Hover dùng **debounce theo intent** (lướt qua không mount) + **prefetch chunk** khi hover.
- iframe detail **tự nạp** sau khi chọn (poster che lúc nạp), **cuộn nội bộ** trong iframe.
- Width switcher `full / 1024 / 375` (đã có ở `PreviewViewport`) map vào **bề rộng iframe**.

## 3. Kiến trúc

### 3.1 Route & shell

```
/                       ← Explorer (mới): shell sidebar + top filter bar + right pane
  ?layer=ui|section|template     (lọc/cuộn sidebar)
  ?mood= ?use= ?stack= ?anim=    (4 trục filter, reuse filter-params)
  ?piece=<slug>                  (Piece đang chọn → right pane = detail)
/preview/[slug]         ← GIỮ NGUYÊN (isolated, no shell) — poster target + iframe src
```

- Shell mới thay top-nav `SiteNav` bằng **sidebar shell**. `(shell)/layout.tsx` đổi: sidebar trái (text, nhóm theo Layer) + slot phải.
- Filter resolve **server-side** từ `searchParams` (giữ đúng mô hình hiện tại trong `PieceIndexPage`/`filter-params.ts`).

### 3.2 Hai trạng thái của right pane

Right pane có 2 trạng thái — đây cũng là nơi dung hoà "sidebar text thuần" với "thumbnail poster" (**poster sống ở trạng thái gallery**):

- **Chưa chọn Piece (`?piece` rỗng):** right pane = **gallery lưới poster** nhóm theo Layer → đây là nơi
  Thumbnail (poster + hover-live) xuất hiện. Thay thế vai trò "Featured / browse-by-mood" của home cũ.
- **Đã chọn Piece:** right pane = **Detail preview** (poster-first → mount sống theo nhánh Layer) + **tabs Source/Copy**
  (hấp thụ nội dung `piece-detail.tsx`).

### 3.3 Mapping component (tái dùng tối đa)

| Hiện có                                                                                | Số phận                                                                    |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `components/shell/site-nav.tsx`                                                        | → thay bằng `catalog-sidebar.tsx` (text, nhóm Layer, active theo `?piece`) |
| `components/shell/filter-sidebar.tsx`                                                  | → chuyển thành `filter-bar.tsx` (ngang, trên cùng); logic toggle giữ       |
| `lib/catalog/filter-params.ts`, `use-catalog-filter-url.ts`, `active-filter-chips.tsx` | **giữ** — reuse nguyên                                                     |
| `components/catalog/piece-index-page.tsx`                                              | → tách: phần grid → gallery state; bị explorer thay                        |
| `components/catalog/piece-card*.tsx`                                                   | → card dùng **poster** thay live-scale; thêm hover-to-live                 |
| `components/catalog/piece-detail.tsx`                                                  | → nội dung (tabs Preview/Code, copy) **nhúng vào right pane**              |
| `components/catalog/preview-viewport.tsx`, `piece-live-preview.tsx`                    | giữ; detail template chuyển sang iframe wrapper mới                        |
| `app/(shell)/{ui,sections,templates}/page.tsx` + `[slug]`                              | → **redirect** sang `/?layer=…` / `/?piece=…` (mục 5)                      |

### 3.4 Đơn vị mới cần dựng

- `catalog-sidebar.tsx` — nav text, nhóm theo Layer, đánh dấu active theo `?piece`.
- `filter-bar.tsx` — 4 trục filter dạng thanh ngang + result count + chips.
- `poster-thumb.tsx` — render poster `public/posters/[slug].webp`; hover-intent → mount live preview (1-at-a-time, prefetch).
- `template-iframe.tsx` — `<iframe src="/preview/[slug]">`, poster-first overlay, width switcher, internal scroll.
- `scripts/capture-posters.mjs` — Playwright capture (mục 4) + lệnh `pnpm posters`.

## 4. Poster pipeline (chi tiết)

1. `scripts/capture-posters.mjs` đọc danh sách slug có preview (qua `generateStaticParams`/`hasPreview`).
2. Boot app, mỗi slug: mở `/preview/[slug]` ở viewport **`1280×720`** (đã đúng 16:9 → screenshot viewport = hero-fold,
   không cần crop riêng), set `prefers-reduced-motion: reduce`, chờ settle → `public/posters/[slug].webp` (**WebP**, quality ~80).
3. `pnpm posters` chạy local để regen. CI chạy lại + `git diff --exit-code public/posters` → **fail nếu lệch**.
4. devDep mới: `playwright` (+ browser binary trong CI).

## 5. Migration route cũ

- `/ui` `/sections` `/templates` → `redirect('/?layer=…')`.
- `/ui/[slug]` `/sections/[slug]` `/templates/[slug]` → `redirect('/?piece=<slug>')`.
- `/preview/[slug]` **giữ nguyên**.
- Home discovery cũ (mood cards + Featured) → hấp thụ vào **gallery state** (3.2).

## 6. Tách bạch & ranh giới

- **Sidebar / Filter / Right-pane** độc lập, chỉ giao tiếp qua URL searchParams (không state chung client).
- **Thumbnail vs Detail vs Fullscreen** là 3 đơn vị render tách biệt (xem CONTEXT.md) — không dùng lẫn.
- Khác biệt theo Layer **chỉ** sống ở Detail preview (inline vs iframe); thumbnail + sidebar đồng nhất.

## 7. Task breakdown (theo phase, mỗi phase 1 commit)

**Phase A — Poster infra (làm trước, gỡ rủi ro perf):**

- A1. `scripts/capture-posters.mjs` + `pnpm posters` + devDep `playwright`.
- A2. Sinh `public/posters/*.webp` cho mọi slug; CI gate `git diff` poster.

**Phase B — Render strategy theo Layer:**

- B1. `poster-thumb.tsx` (poster + hover-intent live, 1-at-a-time, prefetch).
- B2. `template-iframe.tsx` (iframe `/preview/[slug]` + poster overlay + width switcher).
- B3. Detail preview rẽ nhánh: ui/section inline (`transform`+`contain`), template → `template-iframe`.

**Phase C — Explorer shell:**

- C1. `catalog-sidebar.tsx` (text, nhóm Layer, active theo `?piece`).
- C2. `filter-bar.tsx` (4 trục ngang) + reuse `filter-params`/chips.
- C3. `/` page: 2 trạng thái right pane (gallery poster / detail + tabs Source).
- C4. Đổi `(shell)/layout.tsx` sang sidebar shell.

**Phase D — Migration & dọn:**

- D1. Redirect route cũ (`/ui`, `/sections`, `/templates`, các `[slug]`).
- D2. Gỡ `site-nav.tsx`, gỡ phần thừa của `piece-index-page.tsx`.
- D3. Kiểm tra build/lint/check-types xanh; Lighthouse/CWV không hồi quy.

## 8. Definition of Done

- `/` master-detail chạy: sidebar text nhóm Layer · filter bar 4 trục · `?piece=` deep-link share được.
- Thumbnail là poster; hover mới mount sống, tối đa 1 live/lần.
- Detail: ui/section inline đúng; template iframe — **không** còn fixed-nav thoát khung / 100vh tràn.
- `pnpm posters` regen được; CI fail khi poster lệch.
- Chuyển nhanh giữa các template **không rò WebGL context** (ternus).
- Route cũ redirect đúng; build/lint/check-types xanh; CWV không hồi quy so với baseline.

## 9. Phụ lục — 4 quyết định tự chốt (2026-06-14)

Các câu hỏi mở ban đầu, đã quyết và bake vào thân spec:

1. **Gallery state ở right pane** → **áp dụng** (mục 3.2): chưa chọn = lưới poster, đã chọn = detail.
2. **Hấp thụ `piece-detail.tsx` vào right pane** → **gộp** thành tabs Preview/Source/Copy; bỏ detail page riêng (mục 2.1, 3.2).
3. **Route cũ** → **redirect** sang `/?layer=` / `/?piece=` (mục 5), không 410.
4. **Poster** → **WebP** quality ~80, viewport **`1280×720`** (đã đúng 16:9, không crop riêng) (mục 4).
