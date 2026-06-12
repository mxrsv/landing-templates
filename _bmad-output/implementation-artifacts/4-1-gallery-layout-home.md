---
baseline_commit: 31dc461
---

# Story 4.1: Gallery Layout & Home Page

Status: review

## Story

As a **visitor**,
I want **gallery home với navigation tới UI/Sections/Templates**,
so that **tôi biết bắt đầu browse từ đâu**.

## Acceptance Criteria

1. **Given** monorepo + tokens sẵn sàng, **When** tạo `apps/docs/app/page.tsx` gallery home, **Then** hiển thị featured templates + browse entry tới `/ui`, `/sections`, `/templates`.
2. Catalog rỗng → empty state thay vì broken featured slugs.
3. `/templates` index group theo `mood` tag (pre-filter UX).
4. Layout responsive desktop-primary.
5. Tone minimal — tên Piece + tags, không sales copy dài.
6. Gates: root `pnpm check-types`/`lint`/`build` exit 0; SSR smoke `/` + `/templates` HTTP 200.

## Tasks / Subtasks

- [x] **Task 1 — Gallery home `app/page.tsx`** (AC: 1, 2, 4, 5)
  - [x] Rewrite home: hero ngắn gọn + section "Featured templates" đọc từ `allPieces` (layer === "template") + 3 browse cards (`/ui`, `/sections`, `/templates`).
  - [x] Featured rỗng → empty state ("Chưa có template — đang chờ registration"); card chỉ tên + tags (mood/stack), link tới `/templates/<slug>`.
- [x] **Task 2 — `/templates` index `app/templates/page.tsx`** (AC: 2, 3, 5)
  - [x] Group templates theo mood (mood[0]) qua pure function `groupByMood` (immutable), heading mỗi mood group; 0 pieces → empty state.
- [x] **Task 3 — Verify gates** (AC: 6)
  - [x] Root `pnpm check-types` 4/4 + `pnpm lint` 3/3 + `pnpm build` 12/12 exit 0.
  - [x] SSR smoke: `/` + `/templates` HTTP 200; cả hai chứa "Ternus — Layer 2"; home có đủ links `/ui`, `/sections`, `/templates`, `/templates/ternus`; `/templates` có heading group "infra".

## Dev Notes

- `allPieces` đã live (4.5) với Ternus — featured KHÔNG rỗng nhưng vẫn phải code empty-state path (catalog có thể rỗng ở fork khác).
- Link `/ui`, `/sections` sẽ 404 tới khi Story 4.3 tạo index routes — chấp nhận trong story này (4.3 ngay sau).
- Detail route `/templates/[slug]` là scope 4.3 — card link `/templates/ternus` hiện trúng route static có sẵn (Epic 1), 4.3 thay bằng dynamic.
- Next 16: page RSC async không cần — data import tĩnh module-level; KHÔNG dùng `searchParams` (tránh dynamic rendering không cần thiết).
- Style: Tailwind theo idiom home hiện tại (zinc, dark-mode variants); KHÔNG đụng `globals.css`.

### Project Structure Notes

- UPDATE: `apps/docs/app/page.tsx` (rewrite).
- NEW: `apps/docs/app/templates/page.tsx`.

### References

- [Source: `epics.md#Story 4.1`]
- [Source: `apps/docs/lib/catalog/index.ts` — allPieces]

## Dev Agent Record

### Agent Model Used

claude-fable-5

### Debug Log References

- Gates: check-types 4/4, lint 3/3, build 12/12 — exit 0.
- SSR smoke (next dev + curl): `/` 200, `/templates` 200, Ternus card + browse links + mood group đều có trong HTML. Đây cũng là lần đầu aggregator 4.5 chạy runtime — validator pass.

### Completion Notes List

- Home: hero + Featured templates (từ `allPieces`) + 3 browse cards; cả featured lẫn `/templates` đều có empty-state path khi catalog rỗng.
- `/templates` index group theo `mood[0]` qua pure function `groupByMood` (immutable, Map → entries).
- Tone minimal đúng AC: card = tên + tags, không sales copy; responsive grid (sm/lg breakpoints, desktop-primary).
- `/ui`, `/sections` links sẽ 404 tới khi Story 4.3 tạo index routes (đã ghi trong Dev Notes — 4.3 dev ngay sau).

### File List

- `apps/docs/app/page.tsx` — REWRITTEN (gallery home)
- `apps/docs/app/templates/page.tsx` — NEW (index group theo mood)
- `_bmad-output/implementation-artifacts/4-1-gallery-layout-home.md` — story artifact
