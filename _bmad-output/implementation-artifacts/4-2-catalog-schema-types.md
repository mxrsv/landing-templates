---
baseline_commit: 994ea64
---

# Story 4.2: Catalog Schema & Type Definitions

Status: review

## Story

As a **builder registering Pieces**,
I want **TypeScript schema cho catalog metadata**,
so that **mọi pieceMeta export nhất quán và type-safe**.

## Acceptance Criteria

1. **Given** gallery shell, **When** tạo `apps/docs/lib/catalog/types.ts` với interface `PieceMeta`, **Then** fields: `slug, name, layer, mood, useCase, stackTags, animationTags, deps, copyMode, sourcePaths?`.
2. `copyMode: "single" | "multi"` typed; `layer: "ui" | "section" | "template"` typed.
3. Export type cho filter params (mood/useCase/stack/animation — phục vụ Epic 9 FilterBar).
4. Convention documented: mỗi piece export `pieceMeta` từ `config.ts`/`meta.ts` thuần data — không import component.
5. Retire `LandingTemplate` cũ: GHI CHÚ deprecation tại đây, xoá thật sau khi aggregator live (Story 4.5).
6. Gates: root `pnpm check-types` + `pnpm lint` + `pnpm build` exit 0.

## Tasks / Subtasks

- [x] **Task 1 — Tạo `apps/docs/lib/catalog/types.ts`** (AC: 1, 2, 3, 4)
  - [x] Interface `PieceMeta` đủ 10 fields, `sourcePaths?: string[]` optional (single-file UI có thể dùng `?raw` import — Story 4.4).
  - [x] Union types `PieceLayer = "ui" | "section" | "template"`, `CopyMode = "single" | "multi"`, `PieceMood` (4 mood: infra/neon/game/nft theo 4 themes Epic 2).
  - [x] `PieceFilterParams` type cho filter (layer, mood, useCase, stack, animation — mảng optional, OR trong trục / AND giữa trục).
  - [x] JSDoc convention pure-data registration ngay đầu file.
- [x] **Task 2 — Đánh dấu deprecate `LandingTemplate`** (AC: 5)
  - [x] Thêm `@deprecated` JSDoc vào `packages/ui/src/lib/types.ts` trỏ về `PieceMeta` — KHÔNG xoá (4.5 xoá).
- [x] **Task 3 — Verify gates** (AC: 6)
  - [x] Root `pnpm check-types` 4/4 + `pnpm lint` 3/3 + `pnpm build` 12/12 exit 0.

## Dev Notes

- Shape phải khớp `TernusPieceMeta` đã export ở Story 3.3 (`packages/templates-ternus/src/config.ts`) — aggregator 4.5 structural-match: `mood`/`useCase` bên Ternus là `string[]`; canonical dùng `PieceMood[]`/`string[]`. Để structural-compat, `PieceMeta.mood: PieceMood[]` vẫn nhận được object Ternus nếu Ternus literal `["infra"]` — NHƯNG Ternus khai `mood: string[]` (widened). Aggregator 4.5 sẽ validate runtime/`satisfies`. Tại 4.2 chỉ định nghĩa canonical; KHÔNG sửa package Ternus.
- `apps/docs` chưa có thư mục `lib/` — tạo mới `apps/docs/lib/catalog/`.
- Next 16: type helpers `PageProps`/`LayoutProps` global — không liên quan file types thuần này.

### Project Structure Notes

- NEW: `apps/docs/lib/catalog/types.ts`.
- UPDATE: `packages/ui/src/lib/types.ts` (chỉ thêm `@deprecated` JSDoc).

### References

- [Source: `epics.md#Story 4.2`]
- [Source: `packages/templates-ternus/src/config.ts` — shape thực tế Story 3.3]

## Dev Agent Record

### Agent Model Used

claude-fable-5

### Debug Log References

- Root `pnpm check-types` 4/4, `pnpm lint` 3/3, `pnpm build` 12/12 — exit 0.

### Completion Notes List

- `PieceMeta` canonical đặt tại `apps/docs/lib/catalog/types.ts` cùng `PieceLayer`/`PieceMood`/`CopyMode` unions và `PieceFilterParams` (Epic 9 FilterBar dùng lại).
- `mood: PieceMood[]` strict hơn `string[]` của Ternus config (Story 3.3) — aggregator 4.5 sẽ validate khi registration (structural assignment chiều package→canonical cần narrow; xử lý ở 4.5).
- Convention pure-data + quy trình registration serial ghi trong JSDoc đầu file.
- `LandingTemplate` chỉ gắn `@deprecated` — xoá thật ở Story 4.5 (đúng AC).

### File List

- `apps/docs/lib/catalog/types.ts` — NEW
- `packages/ui/src/lib/types.ts` — MODIFIED (`@deprecated` JSDoc)
- `_bmad-output/implementation-artifacts/4-2-catalog-schema-types.md` — story artifact
