---
baseline_commit: d7feb82
---

# Story 4.5: Catalog Aggregator & Registration Pattern

Status: review

## Story

As a **Epic D owner**,
I want **catalog aggregator import pieceMeta từ packages**,
so that **epic song song chỉ export metadata, không sửa catalog trực tiếp**.

## Acceptance Criteria

1. **Given** catalog schema (Story 4.2), **When** tạo `apps/docs/lib/catalog/index.ts` barrel với `allPieces: PieceMeta[]`, **Then** aggregator gom mảng từ package exports qua registration tasks serial (Epic D owner duy nhất).
2. Document pattern: epic khác KHÔNG sửa file này — export `pieceMeta` trong package, mở registration task.
3. Duplicate slug guard: registration reject (throw, fail fast) nếu slug đã tồn tại.
4. Registration **#1 (Ternus)**: import `@landing/templates-ternus/config`, Ternus có trong `allPieces`; append `@landing/templates-ternus` vào `transpilePackages` nếu chưa có (đã có sẵn từ Epic 1 — verify, không sửa).
5. Retire `LandingTemplate` (theo AC Story 4.2 — "xoá sau khi PieceMeta aggregator live"): xoá `packages/ui/src/lib/types.ts` + export `./lib/types` khỏi `packages/ui/package.json` (0 consumer còn lại — grep verify).
6. Gates: root `pnpm check-types`/`lint`/`build` exit 0.

## Tasks / Subtasks

- [x] **Task 1 — Aggregator `lib/catalog/index.ts`** (AC: 1, 2, 3, 4)
  - [x] Validator runtime `assertPieceMeta` (boundary validation, fail fast với message rõ): slug/name nonempty, layer/mood/copyMode thuộc unions, mood không rỗng.
  - [x] Duplicate slug guard: `Set` theo slug trong `buildCatalog`, throw nếu trùng.
  - [x] Registration #1: import `pieceMeta` từ `@landing/templates-ternus/config` (pure data — không kéo component), narrow `string[]` → `PieceMood[]` qua validator.
  - [x] Export `allPieces: readonly PieceMeta[]` + re-export types từ `./types`.
  - [x] JSDoc pattern registration serial ngay đầu file.
- [x] **Task 2 — Verify `transpilePackages`** (AC: 4)
  - [x] `@landing/templates-ternus` đã có trong `next.config.ts` (Epic 1 pre-register) → không sửa.
- [x] **Task 3 — Retire `LandingTemplate`** (AC: 5)
  - [x] Xoá `packages/ui/src/lib/types.ts`; gỡ `"./lib/types"` khỏi exports map `packages/ui/package.json`; grep toàn repo 0 consumer trước khi xoá.
- [x] **Task 4 — Verify gates** (AC: 6)
  - [x] Root `pnpm check-types` 4/4 + `pnpm lint` 3/3 + `pnpm build` 12/12 exit 0.

## Dev Notes

- **Lý do dev trước 4-1/4-3:** home (4.1) và slug routes (4.3) đều consume `allPieces` — aggregator phải live trước để các story sau không phải stub.
- "Ternus xuất hiện `/templates`" của AC gốc cần index route — route đó là scope Story 4.3; gate đầy đủ verify ở 4.3 (aggregator chỉ cần bảo đảm data sẵn).
- Validator ở module top-level: lỗi registration nổ ngay lúc build/dev (fail fast) thay vì runtime render.
- `apps/docs` đã có dependency `@landing/templates-ternus` trong package.json (route demo Epic 1) — không cần thêm.
- KHÔNG đụng: `packages/templates-ternus/**` (config đã chuẩn từ 3.3), routes `app/**` (4.1/4.3).

### Project Structure Notes

- NEW: `apps/docs/lib/catalog/index.ts`.
- DELETE: `packages/ui/src/lib/types.ts` (+ exports entry trong `packages/ui/package.json`).
- VERIFY-ONLY: `apps/docs/next.config.ts` (transpilePackages).

### References

- [Source: `epics.md#Story 4.5`, `#Story 4.2` (retire LandingTemplate)]
- [Source: `apps/docs/lib/catalog/types.ts` — PieceMeta canonical]
- [Source: `packages/templates-ternus/src/config.ts` — pieceMeta Story 3.3]

## Dev Agent Record

### Agent Model Used

claude-fable-5

### Debug Log References

- grep `LandingTemplate` / `lib/types` toàn repo trước khi xoá → chỉ còn definition + exports entry (0 consumer).
- Root `pnpm check-types` 4/4, `pnpm lint` 3/3, `pnpm build` 12/12 — exit 0.

### Completion Notes List

- Aggregator validate fail-fast lúc module init: `assertPieceMeta` (unions layer/mood/copyMode, mảng string, slug/name nonempty) + duplicate slug guard trong `buildCatalog`.
- `allPieces` hiện có 1 entry (Ternus — registration #1). Validator sẽ thực thi runtime lần đầu khi 4-1/4-3 import `allPieces` vào page (smoke SSR verify ở đó).
- `transpilePackages` đã chứa `@landing/templates-ternus` từ Epic 1 — AC "append nếu chưa có" thoả không cần sửa.
- `LandingTemplate` retired hoàn toàn (file + exports entry) — đóng nốt AC treo của Story 4.2.

### File List

- `apps/docs/lib/catalog/index.ts` — NEW (aggregator + validator + registration #1)
- `packages/ui/src/lib/types.ts` — DELETED
- `packages/ui/package.json` — MODIFIED (gỡ export `./lib/types`)
- `_bmad-output/implementation-artifacts/4-5-catalog-aggregator-registration.md` — story artifact
