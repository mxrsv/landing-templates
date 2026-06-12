# Story 2.4: Shared ErrorBoundary & useReducedMotion

Status: review

## Story

As a **builder shipping animated Pieces**,
I want **shared a11y/resilience primitives trong `@landing/ui`**,
so that **mọi package dùng cùng hook và ErrorBoundary trước khi ship WebGL/GSAP pieces**.

## Acceptance Criteria

1. **Given** monorepo sau Epic 1, **When** tạo `packages/ui/src/lib/use-reduced-motion.ts` và `packages/ui/src/lib/ErrorBoundary.tsx`, **Then** cả hai export public từ `@landing/ui`.
2. **Given** Ternus legacy có `use-reduced-motion` riêng, **When** migrate vào shared, **Then** hook chuyển sang `@landing/ui`, mọi import Ternus trỏ `@landing/ui/lib/use-reduced-motion`, bản local **bị xoá** (không reimplement per-package).
3. **Given** child throw lúc render, **When** bọc trong `ErrorBoundary`, **Then** render static fallback slot (gradient + label) thay vì crash/blank.
4. **Given** mọi animated Piece, **When** cần a11y/resilience, **Then** import từ `@landing/ui` (không reimplement).
5. **Given** thay đổi xong, **When** build, **Then** `pnpm --filter @landing/ui build` exit 0 + root `pnpm build`/`lint`/`check-types` xanh (gồm Ternus sau khi re-point).

## Tasks / Subtasks

- [x] **Task 1 — `useReducedMotion` shared** (AC: 1, 2)
  - [x] Tạo `packages/ui/src/lib/use-reduced-motion.ts` (`useSyncExternalStore` + `prefers-reduced-motion`, SSR snapshot=false).
  - [x] Export `"./lib/use-reduced-motion"` trong `packages/ui/package.json`.
  - [x] Re-point 6 import Ternus (`stat-number`, `ternus-netstrip`, `token-donut`, `ternus-hero`, `how-it-works`, `use-scroll-progress`) → `@landing/ui/lib/use-reduced-motion`.
  - [x] Xoá `packages/templates-ternus/src/lib/use-reduced-motion.ts`.
- [x] **Task 2 — `ErrorBoundary` shared** (AC: 1, 3)
  - [x] `packages/ui/src/lib/ErrorBoundary.tsx` — class component (`"use client"`), `getDerivedStateFromError`, static fallback gradient + `label` (dùng token `--p-*`/`--radius-sm` với literal fallback), props `fallback?`/`onError?`.
  - [x] Export `"./lib/error-boundary"` trong `package.json`.
- [x] **Task 3 — Verify** (AC: 5)
  - [x] `pnpm --filter @landing/ui build` exit 0; `pnpm --filter @landing/ui check-types` exit 0.
  - [x] Root `pnpm build` 12/12; `pnpm --filter @landing/templates-ternus check-types` exit 0; `pnpm lint` exit 0.

## Dev Notes

- **Migrate, không nhân bản:** hook Ternus cũ đã được di sang `@landing/ui`; 6 consumer re-point; file local xoá → 1 nguồn duy nhất (AC2 "không reimplement per-package"). Ternus đã sẵn dep `@landing/ui` nên chỉ đổi import path, **không đổi behavior**. [Source: `epics.md#Story 2.4`]
- **ErrorBoundary phải là class:** React error boundary chỉ hoạt động ở class component (`getDerivedStateFromError`/`componentDidCatch`) — không có bản hook. Đánh `"use client"`. [Source: React docs — Error Boundaries]
- **Fallback dùng token + literal fallback:** `var(--p-surface, #0c0d14)` v.v. → đẹp khi có token, vẫn render khi Piece nằm ngoài scope token. Không `console.log` (rule) — báo lỗi qua prop `onError`.
- **Export path:** nhóm primitive dưới `./lib/*` cho khớp `./lib/types` đã có. Component WebGL vẫn ở subpath top-level (`./pixel-blast`).
- **Liên kết INVARIANT (Story 2.3):** doc đã yêu cầu animated Piece dùng `useReducedMotion()` + bọc `ErrorBoundary` — story này hiện thực hoá 2 primitive đó. [Source: `packages/design-tokens/INVARIANT.md` §2]

### Project Structure Notes

- NEW: `packages/ui/src/lib/use-reduced-motion.ts`, `packages/ui/src/lib/ErrorBoundary.tsx`.
- UPDATE: `packages/ui/package.json` (+2 export), 5 Ternus component + `use-scroll-progress.ts` (import path).
- DELETE: `packages/templates-ternus/src/lib/use-reduced-motion.ts`.

### References

- [Source: `epics.md#Story 2.4`]
- [Source: `architecture.md#L381` dependency flow (`ui` ← `templates`)]
- [Source: `packages/design-tokens/INVARIANT.md` §2 motion & a11y]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (1M context)

### Debug Log References

- `pnpm --filter @landing/ui build` → exit 0; `check-types` → exit 0
- `pnpm build` root → 12/12 successful
- `pnpm --filter @landing/templates-ternus check-types` → exit 0 (import re-point resolve OK)
- `pnpm lint` → exit 0 (ui + templates-ternus + docs)

### Completion Notes List

- `useReducedMotion` di sang `@landing/ui/lib/use-reduced-motion`; 6 import Ternus re-point; hook local xoá. Behavior bất biến.
- `ErrorBoundary` class component `"use client"` — static fallback gradient+label (token với literal fallback), props `fallback?`/`onError?`, không console.log.
- 2 export mới: `./lib/use-reduced-motion`, `./lib/error-boundary`.
- Hiện thực hoá yêu cầu INVARIANT §2 (Story 2.3).

### File List

- `packages/ui/src/lib/use-reduced-motion.ts` (NEW)
- `packages/ui/src/lib/ErrorBoundary.tsx` (NEW)
- `packages/ui/package.json` (UPDATE — +2 export)
- `packages/templates-ternus/src/components/{stat-number,ternus-netstrip,token-donut,ternus-hero,how-it-works}.tsx` (UPDATE — import)
- `packages/templates-ternus/src/lib/use-scroll-progress.ts` (UPDATE — import)
- `packages/templates-ternus/src/lib/use-reduced-motion.ts` (DELETE)
