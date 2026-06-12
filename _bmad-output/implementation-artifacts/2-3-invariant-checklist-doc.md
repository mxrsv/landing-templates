# Story 2.3: Invariant Checklist Documentation

Status: review

## Story

As a **builder adding new Pieces**,
I want **checklist invariant bar được document hoá và enforceable**,
so that **mọi agent biết tiêu chí pass trước khi publish vào catalog**.

## Acceptance Criteria

1. **Given** token package (Story 2.1–2.2) hoàn tất, **When** tạo `packages/design-tokens/INVARIANT.md`, **Then** doc liệt kê các invariant: spacing **4/8px grid** (cấm arbitrary magic number — dùng `--space-*`), **named easing only** (cấm easing inline literal), **cấm `transition: all`**.
2. **Given** Piece có animation, **When** doc mô tả yêu cầu a11y, **Then** ghi rõ **`useReducedMotion()` bắt buộc** cho mọi animated Piece (hook shared sẽ có ở Story 2.4 `@landing/ui`).
3. **Given** agent viết story Piece mới, **When** cần acceptance, **Then** doc cung cấp **acceptance template** (block copy-paste) để story Piece reference invariant này.
4. **Given** doc hoàn tất, **When** build, **Then** không phá gì (`pnpm build` + `pnpm lint` vẫn xanh — doc-only, không đụng code).

## Tasks / Subtasks

- [x] **Task 1 — Viết `packages/design-tokens/INVARIANT.md`** (AC: 1, 2, 3)
  - [x] Section "Invariant bar" — bảng rule + lý do + cách đúng/sai (spacing, easing, no `transition: all`, palette qua `--p-*`/utility không hardcode hex).
  - [x] Section "Motion & a11y" — `useReducedMotion()` bắt buộc; reference token `--duration-*`/`--ease-*`.
  - [x] Section "Acceptance template" — block markdown copy-paste cho story Piece (checkbox list map từng invariant).
  - [x] Link tới `base.css` (token nguồn) + `theme.ts` (mood) + `@landing/ui` reduced-motion hook (Story 2.4).
- [x] **Task 2 — Verify** (AC: 4)
  - [x] `pnpm build` + `pnpm lint` xanh (doc-only, không kỳ vọng đổi output).

## Dev Notes

- **Doc-only story.** Không đụng code/CSS. Mục tiêu: 1 nguồn sự thật cho "Piece pass bar nào". Invariant đã rải rác trong architecture/epics → gom về 1 file enforceable.
- **Token nguồn để reference:** spacing `--space-0..--space-32`, type `--text-*`, easing `--ease-standard/entrance/exit`, duration `--duration-fast/base/slow`, palette `--p-*` (qua utility `bg-primary`…). [Source: `packages/design-tokens/src/base.css`]
- **Forward ref Story 2.4:** `useReducedMotion()` sẽ export từ `@landing/ui` — doc viết như đã có (2.4 cung cấp ngay sau). [Source: `epics.md#Story 2.4`]
- **Dùng lại ở Epic 3+:** story Piece (Ternus refresh, memecoin…) sẽ copy "Acceptance template" vào AC của mình. [Source: `epics.md#Story 2.3` — "acceptance template cho agent stories reference doc này"]

### Project Structure Notes

- NEW: `packages/design-tokens/INVARIANT.md`. Không file nào khác đổi.

### References

- [Source: `epics.md#Story 2.3`]
- [Source: `architecture.md#L29` invariant bar; `#L65`, `#L70` token inheritance + diversity-vs-consistency]
- [Source: `packages/design-tokens/src/base.css`, `src/theme.ts` — token vocabulary]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (1M context)

### Debug Log References

- `pnpm build` root → exit 0 (doc-only, no output change); `pnpm lint` → exit 0

### Completion Notes List

- `INVARIANT.md`: 6 invariant (I-1..I-6) dạng bảng rule+lý do+wrong/right; allowed token vocabulary; section Motion & a11y (`useReducedMotion()` bắt buộc + ErrorBoundary fallback); acceptance template copy-paste (checkbox map từng invariant) cho story Piece; section enforcement (story-level + build-level, note chưa có stylelint cho magic number).
- Forward-ref `useReducedMotion()`/`ErrorBoundary` từ `@landing/ui` (Story 2.4 cung cấp ngay sau).

### File List

- `packages/design-tokens/INVARIANT.md` (NEW)
