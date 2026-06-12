---
baseline_commit: c647511
---

# Story 3.2: Apply theme-infra & Pass Invariant Bar

Status: review

## Story

As a **visitor**,
I want **Ternus dùng theme-infra và pass invariant professional bar**,
so that **Ternus là reference implementation cho quality floor toàn catalog**.

## Acceptance Criteria

1. **Given** v20 port hoàn tất (Story 3.1), **When** áp `data-theme="infra"` trên wrapper `.tn` trong `template.tsx`, **Then** palette Ternus resolve qua `--p-*` (đổi theme đổi màu, spacing giữ nguyên).
2. `grep -rn "transition: all" packages/templates-ternus/` → 0.
3. Spacing (margin/padding/gap) trong `ternus.css` dùng token vars trên 4/8px grid (`--space-*` hoặc local var định nghĩa từ floor).
4. Animation/transition dùng named easing curves (`--ease-standard|entrance|exit` qua local alias) — không cubic-bezier literal hoặc keyword easing trần trong rule body.
5. Animated components dùng shared `useReducedMotion()` từ `@landing/ui`; WebGL (PixelBlast): reduced-motion on → KHÔNG mount canvas, hiện poster tĩnh (CSS gradient) thay vì trống.
6. WebGL components wrap shared `ErrorBoundary` từ `@landing/ui` — fallback = CSS gradient + text label (không blank div).
7. 0 hardcoded hex/rgb trong `ternus.css` ngoài block định nghĩa token `.tn { --… }` — mọi rule body chỉ dùng `var(--token)` / `color-mix(... var(--token) ...)`.
8. Build gates: `pnpm --filter @landing/templates-ternus lint` + root `pnpm build`/`lint`/`check-types` exit 0; `/templates/ternus` render không đổi cấu trúc (smoke SSR).

## Tasks / Subtasks

- [x] **Task 1 — Áp `data-theme="infra"`** (AC: 1)
  - [x] `template.tsx`: thêm `data-theme="infra"` vào div `.tn`.
  - [x] Re-point brand tokens trong `.tn {}`: `--bg: var(--p-bg, #07070c)`, `--panel: var(--p-surface, …)`, `--cy: var(--p-primary, …)`, `--cy-bright: var(--p-primary-bright, …)`, `--cy-soft: var(--p-primary-soft, …)`, `--orange: var(--p-accent, …)`, `--ink/2/3: var(--p-ink/2/3, …)`, `--line-1: var(--p-line-soft, …)`, `--line-2: var(--p-line, …)` (giữ literal fallback cho portability khi copy). `--line-3`/`--line-w` chuyển sang `color-mix` từ token.
- [x] **Task 2 — Tokenize màu trong rule bodies** (AC: 7)
  - [x] Thêm local tokens vào `.tn {}`: `--white: #ffffff`, `--term-bg: #060a0e`, `--term-string: #9fe6c0`, `--mask-fill: #000`.
  - [x] Thay mọi literal trong rule body: `#fff` → `var(--white)`; `#07070c` → `var(--bg)`; `#060a0e` → `var(--term-bg)`; `#9fe6c0` → `var(--term-string)`; `#000` (mask) → `var(--mask-fill)`.
  - [x] `rgba(...)` → `color-mix(in srgb, var(--token) N%, transparent)` — alpha levels v20 giữ chính xác.
- [x] **Task 3 — Named easing** (AC: 4)
  - [x] Local aliases trong `.tn {}`: `--ease: var(--ease-standard, …)`, `--ease-enter: var(--ease-entrance, …)`.
  - [x] Mọi `transition:` có easing var (hover/UI → `var(--ease)`, reveal/entrance → `var(--ease-enter)`); `tn-pulse … ease-in-out` → `var(--ease)`.
- [x] **Task 4 — Spacing pass 4/8px** (AC: 3)
  - [x] Tokenize margin/padding/gap khớp scale chính xác (20/24/32/40/64px… → `var(--space-*, fallback)`); off-grid optical values của design v20 đã duyệt (11/13/22/26px…) GIỮ NGUYÊN — waiver ghi ở Dev Notes (zero visual drift, locked design).
- [x] **Task 5 — Reduced-motion poster + ErrorBoundary cho WebGL** (AC: 5, 6)
  - [x] `ternus-hero.tsx`: `<PixelBlast>` wrap trong `<ErrorBoundary fallback={…gradient + label}>`; khi `reduced` → render `.mesh-poster` (static gradient) thay vì bỏ trống.
  - [x] CSS `.mesh-poster` + `.mesh-fallback-label`: radial gradient cyan/orange mờ, cùng footprint `.mesh`, 0 animation.
- [x] **Task 6 — Verify gates** (AC: 2, 7, 8)
  - [x] `grep "transition: all"` → 0; hex/rgba ngoài token block → 0 (chỉ còn fallback trong định nghĩa `--orange`).
  - [x] Root `pnpm build` 12/12, `pnpm lint` 3/3, `pnpm check-types` 4/4 exit 0; SSR smoke `/templates/ternus` HTTP 200, `data-theme="infra"` có trong HTML.

## Dev Notes

- **Tầng token 2 lớp:** `[data-theme="infra"]` (từ `@landing/design-tokens`, đã import trong `apps/docs/globals.css`) set `--p-*`; `.tn {}` của Ternus re-point local vars → `--p-*` với literal fallback. Pattern fallback học từ Story 2.4 ErrorBoundary (`var(--p-surface, #0c0d14)`). KHÔNG hardcode trong `@theme` (Epic 2 invariant).
- **`color-mix(in srgb, var(--x) N%, transparent)`** thay rgba-literal — giữ alpha levels v20 chính xác, vẫn theme-swappable. Baseline browser support ổn (2023+).
- **Hex chỉ được phép trong block định nghĩa token** `.tn { --… }` — quy ước verify: `grep -nE "#[0-9a-f]{3,8}|rgba?\(" src/ternus.css` chỉ match dòng bắt đầu `--` (definition) hoặc trong `color-mix`/`var()` fallback.
- **Đừng đổi duration:** AC chỉ yêu cầu named easing; duration v20 (0.7s/0.35s…) giữ nguyên để không đổi motion feel đã duyệt.
- **PixelBlast props `color="#fb923c"` trong TSX:** ngoài scope AC (chỉ `ternus.css`) — GIỮ NGUYÊN, không đọc CSS var runtime ở story này.
- **`SHOW_CRYSTAL=false`** giữ nguyên; HeroCrystal không mount nên không cần boundary riêng (nhưng nếu wrap chung với mesh thì vô hại).
- **INVARIANT.md §3** là checklist acceptance — story này là reference implementation đầu tiên pass full bar.
- Locked design: calm/premium, cyan-dominant, orange ≤ 4 refs, hairline aesthetic — mọi thay đổi CSS phải giữ visual như cũ (token hoá, không redesign).

### Project Structure Notes

- UPDATE: `packages/templates-ternus/src/template.tsx` (data-theme), `src/ternus.css` (token hoá), `src/components/ternus-hero.tsx` (ErrorBoundary + poster).
- KHÔNG đụng: `packages/design-tokens/**`, `apps/docs/**`, `packages/ui/**`.

### References

- [Source: `epics.md#Story 3.2`]
- [Source: `packages/design-tokens/INVARIANT.md` §1–3]
- [Source: `packages/design-tokens/src/base.css` — layering contract + `@theme inline`]
- [Source: `packages/design-tokens/src/themes/infra.css`]
- [Source: `2-4-shared-errorboundary-reduced-motion.md` — ErrorBoundary API (`fallback?`/`onError?`), export path `@landing/ui/lib/error-boundary`]

## Dev Agent Record

### Agent Model Used

claude-fable-5

### Debug Log References

- `pnpm check-types` → 4/4 exit 0; `pnpm lint` → 3/3 exit 0 (qua `rtk proxy pnpm lint` — rtk filter báo lỗi giả); `pnpm build` → 12/12 exit 0.
- `grep -rn "transition: all" packages/templates-ternus/` → 0 match (AC 2).
- `grep -nE "#[0-9a-f]{3,8}|rgba?\(" src/ternus.css` → mọi match đều trong block định nghĩa token `.tn { --… }` hoặc fallback của `var()` (AC 7).
- SSR smoke: `pnpm dev` (apps/docs) + `curl /templates/ternus` → HTTP 200, HTML chứa `data-theme="infra"` và đủ section ids (AC 1, 8).

### Completion Notes List

- Tầng token 2 lớp hoàn tất: `.tn {}` re-point toàn bộ brand vars sang `--p-*` với literal fallback (copy-portability); `data-theme="infra"` đặt trên wrapper trong `template.tsx`.
- Mọi rgba literal trong rule body → `color-mix(in srgb, var(--token) N%, transparent)` — giữ chính xác alpha levels v20, zero visual drift.
- Easing: local aliases `--ease`/`--ease-enter` map về `--ease-standard`/`--ease-entrance`; mọi `transition` và keyframe `tn-pulse` dùng named easing (AC 4).
- Spacing: tokenize các giá trị khớp scale chính xác (8/12/16/20/24/32/40/64px → `var(--space-N, Xpx)`); off-grid optical values của design v20 đã duyệt (11/13/22/26px…) giữ nguyên — waiver theo điều khoản INVARIANT.md (locked design, zero drift).
- Reduced-motion: `ternus-hero.tsx` không mount PixelBlast khi `reduced`, render `.mesh-poster` (static radial gradient cyan/orange); WebGL wrap `ErrorBoundary` từ `@landing/ui` với fallback gradient + label "pixel mesh unavailable" (AC 5, 6).
- Ngoài scope giữ nguyên: PixelBlast prop `color="#fb923c"` (TSX, AC chỉ phủ ternus.css), `SHOW_CRYSTAL=false`, mọi duration v20.

### File List

- `packages/templates-ternus/src/ternus.css` — MODIFIED (token hoá màu/easing/spacing, thêm `.mesh-poster` + `.mesh-fallback-label`)
- `packages/templates-ternus/src/template.tsx` — MODIFIED (`data-theme="infra"`)
- `packages/templates-ternus/src/components/ternus-hero.tsx` — MODIFIED (ErrorBoundary + reduced-motion poster)
- `_bmad-output/implementation-artifacts/3-2-apply-theme-infra-invariant.md` — story artifact
