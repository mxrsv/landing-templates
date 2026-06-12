---
baseline_commit: 3c73578
---

# Story 4.6: Catalog Manifest & Piece Budget

Status: review

## Story

As a **builder shipping v1**,
I want **canonical slug list với UI+sections ≥8 (templates đếm riêng) → tổng 12–16 entries**,
so that **FR-10/NFR-9 đếm deterministic, có floor riêng cho UI/sections**.

## Acceptance Criteria

1. **Given** PRD FR-10 (≥8 UI/sections, templates đếm RIÊNG) và NFR-9 (tổng 12–16), **When** tạo `apps/docs/lib/catalog/manifest.ts` liệt kê canonical slugs across layers, **Then** manifest thoả CẢ HAI floor: `(UI + sections).length ≥ 8` (KHÔNG tính templates) VÀ `templates.length === 4`; tổng ≤ 16.
2. Floor được enforce fail-fast (assert lúc module init — vi phạm nổ ngay build/dev, không phải convention ngầm).
3. Manifest là source of truth cho smoke test Story 9.4 — export đủ helper (flat slugs, lookup theo layer).
4. Registered pieces (`allPieces`) phải ⊆ manifest — slug ngoài manifest bị reject (deterministic counting).
5. Gates: check-types/lint/build exit 0 + smoke routes vẫn 200.

## Tasks / Subtasks

- [x] **Task 1 — `lib/catalog/manifest.ts`** (AC: 1, 2, 3)
  - [x] Canonical slugs theo planning (epics 5–8): ui = [pixel-blast, logo-loop, soft-aurora, price-ticker] (4); sections = [memecoin-hero-ticker, token-stats-strip, community-marquee, gamefi-hud-hero, character-showcase, nft-gallery-grid, mint-countdown] (7); templates = [ternus, memecoin, gamefi, nft] (4). UI+sections = 11 ≥ 8; templates === 4; tổng 15 ≤ 16.
  - [x] `assertManifestBudget()` chạy lúc module init: ≥8, ===4, ≤16 — throw message rõ kèm số đếm.
  - [x] Export `manifest` (`as const satisfies`), `manifestSlugs` (ReadonlySet), `manifestSlugsForLayer(layer)`.
- [x] **Task 2 — Guard registered ⊆ manifest trong aggregator** (AC: 4)
  - [x] `lib/catalog/index.ts`: sau duplicate guard, check `manifestSlugs.has(piece.slug)` — slug ngoài manifest → throw kèm hướng dẫn.
- [x] **Task 3 — Verify gates** (AC: 5)
  - [x] check-types 4/4 / lint 3/3 / build 12/12 exit 0; smoke `/` + `/templates/ternus` 200 (manifest assert + guard chạy runtime, pass).

## Dev Notes

- Manifest = danh sách PLANNED (catalog hiện mới có Ternus — các piece còn lại registration dần qua Epic 5–8). Floor đo trên manifest (deterministic), không đo trên `allPieces` hiện tại.
- Slug canonical suy từ tên story epics 5–8 (5-1 price-ticker-ui → ui; 5-2..5-4, 6-1, 6-2, 7-1, 7-2 → sections; templates 4 mood). Đổi tên khi dev epic sau = sửa manifest (1 chỗ duy nhất — đúng vai source of truth).
- Layer "section" (số ít) trong PieceLayer — key manifest dùng dạng rõ nghĩa `ui/sections/templates` (NFR đếm theo nhóm), map về PieceLayer qua helper.
- Aggregator import manifest (manifest KHÔNG import ngược — tránh circular).

### Project Structure Notes

- NEW: `apps/docs/lib/catalog/manifest.ts`.
- UPDATE: `apps/docs/lib/catalog/index.ts` (guard ⊆ manifest).

### References

- [Source: `epics.md#Story 4.6` — floors FR-10/NFR-9]
- [Source: `_bmad-output/implementation-artifacts/sprint-status.yaml` — tên stories epic 5–8]

## Dev Agent Record

### Agent Model Used

claude-fable-5

### Debug Log References

- Gates: check-types 4/4, lint 3/3, build 12/12 — exit 0; smoke `/` + `/templates/ternus` 200 sau khi thêm manifest assert + registration guard.

### Completion Notes List

- Manifest đếm deterministic: 4 ui + 7 sections = 11 ≥ 8 (không tính templates), 4 templates, tổng 15 ≤ 16 — assert fail-fast lúc module init với message kèm số đếm.
- Aggregator giờ reject slug ngoài manifest → registration phải qua manifest trước (1 chỗ sửa duy nhất khi planning đổi tên piece).
- Slug canonical suy từ tên stories epic 5–8; nếu epic sau đổi tên piece thì sửa manifest — đúng vai source of truth cho smoke test 9.4.

### File List

- `apps/docs/lib/catalog/manifest.ts` — NEW
- `apps/docs/lib/catalog/index.ts` — MODIFIED (guard registered ⊆ manifest)
- `_bmad-output/implementation-artifacts/4-6-catalog-manifest-budget.md` — story artifact
