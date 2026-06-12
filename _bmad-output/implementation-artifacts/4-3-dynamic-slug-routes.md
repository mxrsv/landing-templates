---
baseline_commit: 1e571b4
---

# Story 4.3: Dynamic Slug Routes for All Layers

Status: review

## Story

As a **visitor**,
I want **truy cập /ui/[slug], /sections/[slug], /templates/[slug] với live preview**,
so that **tôi xem full preview và metadata mỗi Piece**.

## Acceptance Criteria

1. **Given** catalog schema, **When** tạo dynamic routes `app/ui/[slug]/page.tsx`, `app/sections/[slug]/page.tsx`, `app/templates/[slug]/page.tsx`, **Then** mỗi route render đúng Piece theo layer + slug.
2. Mỗi index page (`/ui`, `/sections`, `/templates`) liệt kê Pieces với **inline preview** (consistent pattern).
3. Index 0 pieces → empty state ("Chưa có Piece — đang chờ registration").
4. Detail page render full preview trong wrapper `data-theme={piece.mood[0]}` + metadata (tags, stack, mood).
5. Piece không tồn tại hoặc sai layer (`/ui/ternus`) → 404 graceful.
6. Gates: root check-types/lint/build exit 0; SSR smoke các routes.

## Tasks / Subtasks

- [x] **Task 1 — Preview registry** (AC: 1, 4)
  - [x] NEW `lib/catalog/preview-registry.tsx`: map `slug → ComponentType` (tách khỏi pieceMeta pure-data); entry ternus → `TernusTemplate`.
- [x] **Task 2 — Shared catalog components** (AC: 2, 3, 4)
  - [x] NEW `components/catalog/piece-card.tsx`: card tên + tags + inline preview qua `<iframe loading="lazy">` trỏ detail route — MỘT pattern preview thống nhất cho cả 3 index (+ helper `pieceDetailHref`).
  - [x] NEW `components/catalog/piece-index-page.tsx`: index layout dùng chung (nhận layer, group theo mood cho templates / list phẳng cho ui+sections, empty state).
  - [x] NEW `components/catalog/piece-detail.tsx`: metadata header (mood/useCase/stack/animation tags) + full preview trong `<div data-theme={piece.mood[0]}>`; preview chưa đăng ký → message thay vì crash.
- [x] **Task 3 — Routes** (AC: 1, 2, 3, 5)
  - [x] NEW `app/ui/page.tsx`, `app/sections/page.tsx`; UPDATE `app/templates/page.tsx` dùng shared index (giữ group theo mood — AC 4.1).
  - [x] NEW `app/{ui,sections,templates}/[slug]/page.tsx`: lookup `allPieces` theo layer+slug, `notFound()` khi miss (sai layer cũng 404); dùng `PageProps<…>` helper + `await props.params` (Next 16).
  - [x] DELETE `app/templates/ternus/page.tsx` (static route Epic 1) — `[slug]` thay thế, redirect `/ternus` giữ nguyên.
- [x] **Task 4 — Verify gates** (AC: 6)
  - [x] check-types 4/4 / lint 3/3 / build 12/12 exit 0; smoke: `/templates/ternus` 200 (49KB HTML, `data-theme="infra"` ×2 — wrapper + template, metadata tags có mặt), `/ui` + `/sections` 200 empty state, `/ui/ternus` 404, `/templates/khong-ton-tai` 404.

## Dev Notes

- Next 16: `params` là `Promise` — dùng `PageProps<'/templates/[slug]'>` global helper, `const { slug } = await props.params`.
- Registry tách riêng vì pieceMeta cấm import component — chỉ detail/index page (server) import registry.
- Inline preview = iframe trỏ detail route: 1 cơ chế thống nhất mọi layer (template nặng WebGL không thể render inline nhiều lần), `loading="lazy"` + `pointer-events-none` để card click về detail.
- Static route cụ thể hơn dynamic — phải xoá `templates/ternus/page.tsx` để `[slug]` nhận request (giữ sẽ che mất detail wrapper).
- 404: `notFound()` từ `next/navigation` — Next render default not-found UI (graceful).

### Project Structure Notes

- NEW: `apps/docs/lib/catalog/preview-registry.tsx`, `apps/docs/components/catalog/{piece-card,piece-index-page,piece-detail}.tsx`, `apps/docs/app/{ui,sections}/page.tsx`, `apps/docs/app/{ui,sections,templates}/[slug]/page.tsx`.
- UPDATE: `apps/docs/app/templates/page.tsx`. DELETE: `apps/docs/app/templates/ternus/page.tsx`.

### References

- [Source: `epics.md#Story 4.3`]
- [Source: `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` — dynamic segments, PageProps]

## Dev Agent Record

### Agent Model Used

claude-fable-5

### Debug Log References

- Gates: check-types 4/4, lint 3/3, build 12/12 — exit 0.
- SSR smoke: `/templates/ternus` 200 + `data-theme="infra"` (wrapper detail + template); `/ui`, `/sections` 200 empty state; `/ui/ternus` 404; `/templates/khong-ton-tai` 404. Lưu ý: curl ngay sau dev-server boot có thể nhận HTML stream chưa đủ — fetch lại sau khi compile xong mới đo.

### Completion Notes List

- Một pattern preview thống nhất: index card dùng iframe lazy trỏ detail route (scale-25, pointer-events-none); detail page render component thật từ `preview-registry` trong wrapper `data-theme={piece.mood[0]}`.
- Registry tách khỏi pieceMeta để giữ pure-data invariant — registration piece mới = 1 entry aggregator + 1 entry registry.
- 3 trang index dùng chung `PieceIndexPage` (templates bật `groupByMood` — giữ AC 4.1); `app/templates/page.tsx` của 4-1 được refactor sang shared component, behavior giữ nguyên.
- Sai layer (`/ui/ternus`) 404 vì lookup filter theo cả layer lẫn slug.
- Static route `templates/ternus` (Epic 1) xoá — static thắng dynamic nên giữ sẽ che mất detail wrapper; redirect `/ternus` trong next.config giữ nguyên.

### File List

- `apps/docs/lib/catalog/preview-registry.tsx` — NEW
- `apps/docs/components/catalog/piece-card.tsx` — NEW
- `apps/docs/components/catalog/piece-index-page.tsx` — NEW
- `apps/docs/components/catalog/piece-detail.tsx` — NEW
- `apps/docs/app/ui/page.tsx`, `apps/docs/app/sections/page.tsx` — NEW
- `apps/docs/app/ui/[slug]/page.tsx`, `apps/docs/app/sections/[slug]/page.tsx`, `apps/docs/app/templates/[slug]/page.tsx` — NEW
- `apps/docs/app/templates/page.tsx` — MODIFIED (dùng shared PieceIndexPage)
- `apps/docs/app/templates/ternus/page.tsx` — DELETED
- `_bmad-output/implementation-artifacts/4-3-dynamic-slug-routes.md` — story artifact
