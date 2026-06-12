---
baseline_commit: 922a0f516fad85c7907cb4fbd4cc57b70313c169
---

# Story 3.1: Complete Ternus v20 Port on Monorepo

Status: review

## Story

As a **builder**,
I want **hoàn thiện v20 port (hero-crystal, ternus-hero, ternus-netstrip, PixelBlast integration) trên cấu trúc packages mới**,
so that **Ternus visual đạt north star Fuel/Monad trên monorepo**.

## Acceptance Criteria

1. **Given** Epic 1 migration + Epic 2 tokens + Story 2.4 shared hooks, **When** hoàn thiện components trong `packages/templates-ternus/src/` theo `docs/plans/2026-06-07-ternus-v20-port.md` (paths đổi: `src/templates/ternus/` → `packages/templates-ternus/src/`, `src/components/pixel-blast/` → `packages/ui/src/pixel-blast/`), **Then** mọi verify command trong plan pass trên paths mới.
2. `/templates/ternus` render đầy đủ sections theo thứ tự v20: Nav → Hero (PixelBlast + netstrip) → How it works (scrollytelling) → Build (terminal) → Ecosystem → Token → Closing CTA → Footer.
3. Chỉ file trong `packages/templates-ternus/**` thay đổi (nếu cần sửa).
4. `pnpm --filter @landing/templates-ternus build` exit 0; root `pnpm build`/`lint`/`check-types` xanh.
5. Reduced-motion: emulate `prefers-reduced-motion: reduce` không vỡ layout, scrollytelling hiện tĩnh đầy đủ (`useScrollProgress` trả 1).

## Tasks / Subtasks

- [x] **Task 1 — Audit hiện trạng vs plan v20** (AC: 1, 2)
  - [x] Chạy từng verify command của plan Task 1–8 trên paths monorepo (JetBrains_Mono, no HeroPipeline, ecosystem no Mark, BuildTerminal registered, scrollytelling CSS, dead CSS cleanup).
  - [x] Liệt kê gap còn lại (nếu có) và fix trong `packages/templates-ternus/**` — **0 gap**, port đã hoàn chỉnh từ Epic 1–2.
- [x] **Task 2 — Verify route + section order** (AC: 2)
  - [x] `template.tsx` compose đúng thứ tự: TernusNav → TernusHero → HowItWorks → BuildTerminal → Ecosystem → Token → ClosingCta → TernusFooter.
  - [x] Netstrip render trong hero-left (TernusNetstrip nằm trong TernusHero).
- [x] **Task 3 — Build gate** (AC: 3, 4)
  - [x] `pnpm --filter @landing/templates-ternus build` exit 0.
  - [x] Root `pnpm build` 12/12, `pnpm lint` 3/3, `pnpm check-types` 4/4 exit 0.
  - [x] `git status` confirm 0 file code thay đổi (chỉ story artifacts).

## Dev Notes

- **Phần lớn port ĐÃ XONG từ Epic 1–2** — `packages/templates-ternus/src/` đã có đủ 14 component + 2 hook v20: `build-terminal`, `how-it-works` scrollytelling (`useScrollProgress`), `ecosystem` (0 `Mark`, eco-grid 6 card), hero không còn `HeroPipeline`, `JetBrains_Mono` + Inter 200/300 đã khai báo, dead CSS (`.pipeline`/`.logowall`/`.panel`) đã dọn. Story này chủ yếu là **verification pass + vá gap**, KHÔNG viết lại từ đầu.
- **Known state đáng chú ý:**
  - `ternus-hero.tsx`: `SHOW_CRYSTAL = false` — crystal cố ý ẩn (comment trong code), hero-grid dùng class `no-visual`. GIỮ NGUYÊN — không bật lại nếu không có yêu cầu.
  - PixelBlast mount conditional `!reduced` — hợp lệ cho 3.1 (plan chỉ yêu cầu "có nhánh tắt"); nâng cấp poster/freeze là scope **Story 3.2**, đừng làm ở đây.
  - `useReducedMotion` đã import từ `@landing/ui/lib/use-reduced-motion` (Story 2.4) — KHÔNG tạo lại hook local.
  - `transition: all` trong `ternus.css` = 0 ✓ (đã sạch).
- **KHÔNG scope creep sang 3.2/3.3:** không áp `data-theme="infra"`, không đổi hex→token vars, không sửa `config.ts` pieceMeta ở story này.
- **Verify commands (paths mới):** `grep -c "JetBrains_Mono" packages/templates-ternus/src/template.tsx` → 1; `grep -rn "HeroPipeline" packages/templates-ternus/src` → 0; `grep -c "Mark" packages/templates-ternus/src/components/ecosystem.tsx` → 0; `grep -c "navigator.clipboard" packages/templates-ternus/src/components/build-terminal.tsx` → 1; `wc -l` mỗi component < 400.
- **Tailwind 4 gotcha (Epic 2 learning):** token swap cần `@theme inline` — đã đúng trong design-tokens, không đụng.
- Next.js repo này có breaking changes — nếu cần sửa app code, đọc `node_modules/next/dist/docs/` trước (AGENTS.md). Story này dự kiến không đụng `apps/docs`.

### Project Structure Notes

- UPDATE (nếu gap): `packages/templates-ternus/src/components/*.tsx`, `src/ternus.css`, `src/template.tsx`.
- Route `apps/docs/app/templates/ternus/page.tsx` đã wire từ Story 1.5 — KHÔNG sửa.

### References

- [Source: `epics.md#Story 3.1`]
- [Source: `docs/plans/2026-06-07-ternus-v20-port.md` — Task 1–9 + verify commands]
- [Source: `architecture.md#Structure Patterns` — component-per-section, hooks trong `lib/`, CSS scoped `.tn`]
- [Source: `2-4-shared-errorboundary-reduced-motion.md#Dev Notes` — shared hook import path]

## Dev Agent Record

### Agent Model Used

claude-fable-5

### Debug Log References

- Verify plan v20: `JetBrains_Mono`=2 refs ✓; `HeroPipeline`=0 ✓; `Mark` trong ecosystem=0 ✓; `navigator.clipboard`=1 ✓; `transition: all`=0 ✓; `var(--orange)`=4 (≤4) ✓; 0 global selector ngoài `.tn` ✓; mọi file < 400 dòng (max 245) ✓.
- Dead CSS: `.pipeline`/`.logowall`/`.plogo`/`#pipe` = 0 match trong `ternus.css` ✓.
- Nav links = How it works/#how, Build/#build, Ecosystem, Token, Docs ✓; footer links khớp khung v20 ✓.
- `useScrollProgress` trả 1 khi reduced-motion (diagram tĩnh đầy đủ) ✓.
- Build: `pnpm --filter @landing/templates-ternus build` exit 0; root `pnpm build` 12/12; `pnpm lint` 3/3; `pnpm check-types` 4/4.
- Smoke SSR: `curl /templates/ternus` → HTTP 200; HTML chứa `id="how"`, `id="build"`, `id="ecosystem"`, `id="token"`, `.netstrip`, `.footer`, headline hero "Run your apps across three layers".

### Completion Notes List

- Story này là verification pass: toàn bộ 9 task của plan `2026-06-07-ternus-v20-port.md` đã được hiện thực trong Epic 1 (migration) + Epic 2 (re-point shared hooks). Audit không tìm thấy gap → không cần sửa code.
- `SHOW_CRYSTAL = false` giữ nguyên (cố ý ẩn theo comment trong code).
- PixelBlast conditional `!reduced` đạt yêu cầu 3.1; nâng cấp poster/freeze + ErrorBoundary thuộc scope Story 3.2.

### File List

- (không có file code thay đổi — audit pass, port đã hoàn chỉnh)
- `_bmad-output/implementation-artifacts/3-1-complete-ternus-v20-port.md` (NEW — story artifact)
