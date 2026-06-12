---
baseline_commit: e9af938
---

# Story 3.3: Export Ternus pieceMeta for Catalog

Status: review

## Story

As a **gallery visitor**,
I want **Ternus xuất hiện trong catalog với metadata đầy đủ**,
so that **gallery có thể list và filter Ternus template**.

## Acceptance Criteria

1. **Given** Ternus pass invariant bar (Story 3.2), **When** export `pieceMeta` trong `packages/templates-ternus/src/config.ts`, **Then** file là **pure data — cấm import component** (không import từ `template.tsx`, components, hay bất kỳ module kéo Three.js/React runtime).
2. Metadata gồm đủ fields: `slug: "ternus"`, `layer: "template"`, `mood: ["infra"]`, `useCase: ["infra"]`, `stackTags`, `animationTags`, `deps`, `copyMode: "multi"`, `sourcePaths: string[]` cho copy viewer.
3. `sourcePaths` liệt kê đầy đủ source files của template (template.tsx, ternus.css, components/, lib/) — đường dẫn từ repo root, dùng cho RSC `fs.readFile` ở Story 4.4.
4. Registration task **#1 (Ternus)** vào catalog aggregator + append `transpilePackages`: thuộc scope Epic D owner (Story 4.5) — story này CHỈ export metadata, KHÔNG sửa `apps/docs`.
5. Build gates: `pnpm --filter @landing/templates-ternus lint` + root `pnpm check-types`/`build` exit 0.

## Tasks / Subtasks

- [x] **Task 1 — Viết lại `config.ts` thành pure-data `pieceMeta`** (AC: 1, 2, 3)
  - [x] Xoá `ternusTemplateMeta: LandingTemplate` (không consumer nào import — đã grep verify; type `LandingTemplate` trong `@landing/ui` GIỮ NGUYÊN, retire ở Story 4.5 theo AC 4.2).
  - [x] Định nghĩa local interface `TernusPieceMeta` (shape khớp `PieceMeta` của Story 4.2: slug/name/layer/mood/useCase/stackTags/animationTags/deps/copyMode/sourcePaths) — KHÔNG import type từ `apps/docs` (chưa tồn tại, và package không được phụ thuộc app).
  - [x] Export `pieceMeta` với: slug "ternus", name "Ternus — Layer 2", layer "template", mood ["infra"], useCase ["infra"], stackTags, animationTags, deps, copyMode "multi", sourcePaths đủ 18 files src. Bonus: thêm export `"./config"` vào package.json để aggregator 4.5 import được `@landing/templates-ternus/config`.
- [x] **Task 2 — Verify gates** (AC: 1, 5)
  - [x] `grep` config.ts: 0 import component / 0 import từ `./template`, `./components` — file zero import.
  - [x] Mọi path trong `sourcePaths` tồn tại trên disk (loop `test -f` → 0 missing).
  - [x] `pnpm --filter @landing/templates-ternus lint` exit 0 + root `pnpm check-types` 4/4 + `pnpm build` 12/12 exit 0.

## Dev Notes

- **Pure data là hard constraint:** catalog aggregator (4.5) là server module của apps/docs — nếu config.ts import component thì Three.js bị kéo vào server bundle. Chỉ được import type-only nếu cần, nhưng tốt nhất zero import.
- **Type đặt local trong config.ts** thay vì import từ `@landing/ui/lib/types` hay apps/docs: tránh coupling ngược; Story 4.2 sẽ tạo `PieceMeta` canonical trong `apps/docs/lib/catalog/types.ts`, aggregator 4.5 sẽ structural-match. Nếu lệch shape, 4.5 chỉnh — shape ở đây bám đúng AC 4.2: `slug, name, layer, mood, useCase, stackTags, animationTags, deps, copyMode, sourcePaths?`.
- **`deps`** = packages cần có khi copy: `@landing/ui` (PixelBlast, ErrorBoundary, useReducedMotion), `next` (next/font), `react`.
- **`sourcePaths`** từ repo root (chuẩn cho `fs.readFile` build-time của 4.4): `packages/templates-ternus/src/template.tsx`, `ternus.css`, 14 files `components/`, 2 files `lib/`.
- **KHÔNG đụng:** `apps/docs/**` (registration là 4.5), `packages/ui/**` (LandingTemplate retire ở 4.5), `next.config` transpilePackages (4.5).

### Project Structure Notes

- UPDATE: `packages/templates-ternus/src/config.ts` (file duy nhất).

### References

- [Source: `epics.md#Story 3.3`, `#Story 4.2`, `#Story 4.5`]
- [Source: `packages/templates-ternus/src/config.ts` — legacy `ternusTemplateMeta` (unconsumed)]

## Dev Agent Record

### Agent Model Used

claude-fable-5

### Debug Log References

- sourcePaths existence loop: 0 missing; grep import trong config.ts: 0 match (pure data).
- `pnpm --filter @landing/templates-ternus lint` exit 0; root `pnpm check-types` 4/4; `pnpm build` 12/12 exit 0.

### Completion Notes List

- `config.ts` giờ là pure-data module: local interface `TernusPieceMeta` + export `pieceMeta` — zero import, không kéo Three.js/React vào server bundle khi aggregator (4.5) import.
- Legacy `ternusTemplateMeta` xoá luôn tại đây (unconsumed — grep toàn repo chỉ có chính config.ts); type `LandingTemplate` trong `@landing/ui` giữ nguyên, retire ở Story 4.5.
- `sourcePaths` = 18 files từ repo root (template.tsx, ternus.css, 14 components, 2 lib hooks) — sẵn cho `fs.readFile` build-time của CopyButton (4.4).
- Thêm subpath export `"./config"` vào package.json — registration #1 (4.5) sẽ import `@landing/templates-ternus/config` mà không đụng entry chính (template.tsx).
- KHÔNG sửa `apps/docs/**` / `transpilePackages` — đúng scope AC 4 (Epic D owner, Story 4.5).

### File List

- `packages/templates-ternus/src/config.ts` — REWRITTEN (pure-data `pieceMeta`)
- `packages/templates-ternus/package.json` — MODIFIED (thêm export `./config`)
- `_bmad-output/implementation-artifacts/3-3-export-ternus-piecemeta.md` — story artifact
