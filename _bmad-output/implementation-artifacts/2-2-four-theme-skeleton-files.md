# Story 2.2: Four Theme Skeleton Files

Status: review

## Story

As a **visitor comparing aesthetic moods**,
I want **switch giữa 4 theme variants (infra, neon, game, nft)**,
so that **thấy palette và motion personality khác nhau nhưng cùng spacing floor**.

## Acceptance Criteria

1. **Given** `base.css` (Story 2.1) đã có `@theme inline` map `--color-* → var(--p-*)`, **When** tạo `packages/design-tokens/src/themes/{infra,neon,game,nft}.css`, **Then** mỗi file override **chỉ `--p-*`** (palette) + motion-personality var dưới selector `[data-theme="<mood>"]` — **KHÔNG** đụng spacing/type vars (floor giữ nguyên).
2. **Given** cần type-safety cho theme value, **When** thêm `packages/design-tokens/src/theme.ts`, **Then** export `type ThemeMood = "infra" | "neon" | "game" | "nft"`, `THEME_MOODS` readonly array, và `resolveTheme(value: string | null | undefined): ThemeMood` trả `infra` khi value invalid (fallback).
3. **Given** đổi `data-theme` trên wrapper, **When** flip giữa 4 mood, **Then** utility `bg-primary`/`text-ink`… đổi màu theo + motion personality đổi (vd `--duration-base`), **nhưng spacing scale giữ nguyên** (verify: 1 utility spacing không đổi giá trị).
4. **Given** PRD "3 theme live + 1 skeleton", **When** viết `nft.css`, **Then** nó là **placeholder non-live**: copy infra palette + 2–3 accent var khác + comment `/* PLACEHOLDER — non-live MVP */`.
5. **Given** cần demo switch, **When** thêm route `apps/docs/app/dev/theme-switch/page.tsx`, **Then** client component cho phép đổi `document.documentElement.dataset.theme` qua `THEME_MOODS`; route này **tạm** (comment `// REMOVE before Epic 4 ship`).
6. **Given** mọi theme file `@import` vào base hoặc globals, **When** build, **Then** `pnpm build` root exit 0 + `pnpm lint` exit 0; đổi `data-theme` ở DevTools đổi màu thật.

## Tasks / Subtasks

- [x] **Task 1 — Theme CSS files** (AC: 1, 3, 4)
  - [x] `themes/infra.css`: `[data-theme="infra"]` set `--p-*` = giá trị infra (mirror default base.css, explicit cho completeness) + `--duration-base: 240ms` (calm).
  - [x] `themes/neon.css`: `[data-theme="neon"]` palette neon (magenta/violet/electric, vd `--p-primary:#d946ef`, `--p-bg:#0a0410`) + `--duration-base: 160ms` (snappy).
  - [x] `themes/game.css`: `[data-theme="game"]` palette HUD (lime/amber, vd `--p-primary:#a3e635`, `--p-accent:#f59e0b`) + `--duration-base: 200ms`.
  - [x] `themes/nft.css`: PLACEHOLDER — copy infra `--p-*` + đổi 2–3 accent var; comment `/* PLACEHOLDER — non-live MVP */`.
  - [x] **CRITICAL:** không override spacing/type vars trong bất kỳ theme file nào (floor invariant).
- [x] **Task 2 — Aggregate import** (AC: 1, 6)
  - [x] `base.css` thêm `--duration-base` vào `:root` (motion hook để theme override) nếu chưa có; `@import "./themes/infra.css"` … hoặc gom qua globals. Chọn: `base.css` `@import` cả 4 theme file ở cuối → consumer chỉ cần `@import "@landing/design-tokens"` (1 entry, không đổi wiring Story 2.1).
- [x] **Task 3 — Theme type module** (AC: 2)
  - [x] `packages/design-tokens/src/theme.ts`: `THEME_MOODS`, `ThemeMood`, `resolveTheme()`.
  - [x] `package.json` thêm export `"./theme": "./src/theme.ts"` (export `"./themes/*"` đã có từ Story 2.1).
  - [x] Vì giờ có TS: thêm `tsconfig.json` (extends `@landing/typescript-config/react-library.json`) + script `check-types: "tsc --noEmit"` + devDep `@landing/typescript-config`, `typescript`. Đảm bảo turbo `check-types` gate phủ file mới.
- [x] **Task 4 — Demo route** (AC: 5)
  - [x] `apps/docs/app/dev/theme-switch/page.tsx` — `"use client"`, render swatch + nút đổi `data-theme` qua `THEME_MOODS`, import `resolveTheme`/`THEME_MOODS` từ `@landing/design-tokens/theme`. Comment REMOVE-before-Epic-4.
- [x] **Task 5 — Verify** (AC: 3, 6)
  - [x] `pnpm build` root exit 0; `pnpm lint` exit 0.
  - [x] Build CSS chứa `[data-theme="neon"]` với `--p-primary` khác infra; spacing var (`--space-4`) chỉ xuất hiện 1 lần (không bị theme ghi đè).

## Dev Notes

- **Phụ thuộc Story 2.1:** `@theme inline` đã verified emit `var(--p-*)`. Theme file chỉ cần đổi `--p-*` → utility đổi runtime. KHÔNG đụng `@theme` block.
- **data-theme wrapper (AC future):** Epic 4 preview wrapper set `data-theme={piece.mood[0]}` (scoped, không leak global trên index). Story này chỉ lo theme files + demo route + type. [Source: `epics.md#Story 2.2`; `architecture.md#L317`]
- **Type ở `design-tokens` không phải `ui`:** theme identity thuộc token package (đáy dependency chain). apps/docs check-types (`tsc --noEmit` qua transpilePackages) sẽ phủ `theme.ts`. [Source: `architecture.md#L381` dependency flow; `turbo.json` check-types gate]
- **`/dev/theme-switch` là throwaway:** đánh dấu REMOVE để Epic 4 (gallery ship) gỡ — không để route dev leak production. [Source: `epics.md#Story 2.2` AC]
- **Motion personality:** dùng `--duration-base` làm proxy đơn giản (infra calm > game > neon snappy). Spacing/type tuyệt đối không đổi → chứng minh "floor chung, mood khác". [Source: `epics.md#Story 2.2`]
- **Locked constraints:** infra giữ cyan/near-black; orange micro-accent; calm motion; `prefers-reduced-motion` (hook = Story 2.4). Neon/game được phép rực hơn nhưng vẫn premium.

### Project Structure Notes

- NEW: `packages/design-tokens/src/themes/{infra,neon,game,nft}.css`, `packages/design-tokens/src/theme.ts`, `packages/design-tokens/tsconfig.json`, `apps/docs/app/dev/theme-switch/page.tsx`.
- UPDATE: `packages/design-tokens/base.css` (+`@import` themes, +`--duration-base` hook), `packages/design-tokens/package.json` (+`./theme` export, +check-types, +tsconfig deps).

### References

- [Source: `epics.md#Story 2.2`]
- [Source: `architecture.md#L317` data-theme; `#L356` cây thư mục themes/; `#L381` dependency flow]
- [Source: `2-1-base-token-package.md` — @theme inline verified, `./themes/*` export đã sẵn]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (1M context)

### Debug Log References

- `pnpm --filter @landing/design-tokens check-types` → exit 0 (tsc phủ `theme.ts`)
- `pnpm build` root → 12/12 successful; route `/dev/theme-switch` prerendered
- `pnpm lint` → exit 0
- CSS verify: `[data-theme=neon]`→`--p-primary:#d946ef`, `[data-theme=game]`→`#a3e635` (khác infra `#22d3ee`); 4 `[data-theme]` block; `--space-4` xuất hiện **đúng 1 lần** → spacing floor không bị theme ghi đè (invariant giữ).

### Completion Notes List

- 4 theme file override **chỉ `--p-*`** + `--duration-base` (motion personality) dưới `[data-theme]`. infra explicit mirror base default; nft = PLACEHOLDER (infra + accent tím, comment non-live).
- `theme.ts`: `THEME_MOODS`, `ThemeMood`, `DEFAULT_THEME`, `resolveTheme()` (fallback infra). Đặt trong design-tokens (đáy chain), export `./theme`.
- **Sửa lỗi cascade quan trọng:** `@import` themes đặt ở ĐẦU `base.css` (đúng CSS spec — @import phải trước rule), dùng `[data-theme]` thuần. Demo set `data-theme` trên **wrapper div** (không phải `documentElement`) → không va chạm specificity với `:root` default, và khớp luôn pattern div-wrapper Epic 4. (Variance so với Task wording "@import ở cuối" / "documentElement".)
- tsconfig extends `base.json` (theme.ts là TS thuần, không JSX → không cần react-library preset).
- `/dev/theme-switch` đánh dấu `// REMOVE before Epic 4 ship`.

### File List

- `packages/design-tokens/src/themes/infra.css` (NEW)
- `packages/design-tokens/src/themes/neon.css` (NEW)
- `packages/design-tokens/src/themes/game.css` (NEW)
- `packages/design-tokens/src/themes/nft.css` (NEW)
- `packages/design-tokens/src/theme.ts` (NEW)
- `packages/design-tokens/tsconfig.json` (NEW)
- `apps/docs/app/dev/theme-switch/page.tsx` (NEW — throwaway)
- `packages/design-tokens/src/base.css` (UPDATE — @import themes ở đầu)
- `packages/design-tokens/package.json` (UPDATE — +./theme export, +check-types, +deps)
