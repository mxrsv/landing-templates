---
baseline_commit:
---

# Story 1.6: Type-Coverage Gate (Wave 0 tech-debt close)

Status: ready-for-dev

> **Nguồn gốc:** sinh từ "Senior Developer Review (AI)" cấp Epic 1 (story 1-5, ngày 2026-06-09). Đây là nợ kỹ thuật của Wave 0 migration — đóng lại quality gate mà migration lẽ ra phải có. **Phải hoàn tất TRƯỚC khi mở các wave song song dựng tiếp trên `@landing/ui` / `@landing/templates-ternus`** (kẻo lỗi type ẩn nhân lên qua các epic sau). Xếp lịch chạy đầu tiên trong khung Epic 2.

## Story

As a **builder**,
I want **mọi package chứa source `.ts/.tsx` đều được type-check + lint trong turbo gate, và gỡ bỏ `ignoreBuildErrors` ở `apps/docs`**,
So that **`pnpm check-types` + `pnpm lint` + `pnpm build` cùng xanh end-to-end, không còn tầng nào âm thầm nuốt lỗi type — bảo vệ `@landing/ui` và `@landing/templates-ternus` trước khi các wave sau build chồng lên**.

## Bối cảnh vấn đề (từ review)

Sau migration Wave 0, **không tầng nào type-check/lint được source package thật**:

- Root `pnpm build` (`turbo run build`) KHÔNG kéo theo `check-types`.
- `@landing/ui` `build` = chỉ `tailwindcss` (deviation Story 1.4 #3 gỡ `build:components` khỏi build path) → `tsc` không chạy trong pipeline. Package CÓ script `check-types: tsc --noEmit` nhưng đang **fail** nên không ai gọi.
- `@landing/templates-ternus` **không có** script `check-types` lẫn `lint` → `turbo run check-types`/`lint` **bỏ qua âm thầm** đúng package chứa code Ternus live.
- `apps/docs/next.config.ts` đặt `typescript.ignoreBuildErrors: true` → `next build` nuốt mọi type error app-level + package được transpile.

**Baseline lỗi `tsc --noEmit` (đo ngày 2026-06-09, commit `6cbff95`):**

| Phạm vi                                               | Tổng   | Phân loại                                                                                                                                    |
| ----------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `@landing/ui` (tsconfig `react-library` → `NodeNext`) | **21** | 6× `TS2835` (thiếu `.js` ext do NodeNext) · 11 `PixelBlast.tsx` (`TS18048`×8 / `TS2532`×2 / `TS2345`×1) · 4× `TS2305` ogl ở `SoftAurora.tsx` |
| `apps/docs` (tsconfig `nextjs` → `Bundler`)           | **55** | 44 `templates-ternus/src/components/hero-crystal.tsx` (`TS18048`×24 / `TS2532`×18 / `TS2345`×2) · 11 `PixelBlast.tsx`                        |

> Profile lỗi khác nhau theo `moduleResolution`: docs dùng `Bundler` nên KHÔNG có `TS2835`; `SoftAurora.tsx` không bị check ở docs vì `SoftAurora` chưa được import vào graph route nào (0 reference) — chỉ lộ `TS2305` ở `@landing/ui` (NodeNext, include toàn `src`).

## Acceptance Criteria

1. **`pnpm check-types` (root `turbo run check-types`) exit 0** trên TẤT CẢ package chứa source `.ts/.tsx` — `@landing/ui` (21→0) và `apps/docs` (55→0), không còn package nào bị turbo skip do thiếu script.

2. **`@landing/templates-ternus` được đưa vào coverage**: thêm script `check-types` (`tsc --noEmit`) + `lint` (`eslint src --max-warnings 0`) + file `tsconfig.json` (extends `@landing/typescript-config/react-library.json`) + `eslint.config.mjs` (theo mẫu `packages/ui/eslint.config.mjs`). Sau đó `pnpm --filter @landing/templates-ternus check-types` và `lint` đều exit 0.

3. **`TS2835` (6 lỗi, `.js` extension) xử lý ở tầng config**: override `moduleResolution: "Bundler"` + `module: "ESNext"` trong `packages/typescript-config/react-library.json` (vì các package được Turbopack bundle, KHÔNG publish dưới dạng node16 ESM → Bundler là resolution đúng ngữ nghĩa). KHÔNG đi thêm `.js` vào từng import. Verify cả 6 `TS2835` biến mất, không phát sinh lỗi resolution mới.

4. **Strict-null thật (`TS18048`/`TS2532`/`TS2345`) trong `PixelBlast.tsx` + `hero-crystal.tsx` được fix**: ưu tiên guard/early-return/non-null assertion ở nơi CHỨNG MINH ĐƯỢC an toàn. Chỉ dùng `// @ts-expect-error <lý do>` (KHÔNG `@ts-ignore`) cho trường hợp runtime-proven-safe không thể narrow gọn, kèm comment giải thích. Behavior runtime KHÔNG đổi (WebGL vẫn render).

5. **`TS2305` ogl (4 lỗi) xử lý bằng type augmentation**: `ogl` runtime CÓ export `Mesh/Program/Renderer/Triangle` (verify: `node -e "require('ogl')"` → đều là function) — lỗi chỉ do `.d.ts` ogl thiếu. Thêm `declare module "ogl"` shim (ví dụ `packages/ui/src/types/ogl.d.ts`) bổ sung các export thiếu, hoặc cập nhật cách import. KHÔNG tắt `skipLibCheck` toàn cục để né.

6. **Gỡ `typescript.ignoreBuildErrors: true`** khỏi `apps/docs/next.config.ts`; `pnpm build` (root, 7/7) + `next build` vẫn xanh KHÔNG cần flag đó.

7. **`check-types` được wire vào exit gate**: hoặc `build` task trong `turbo.json` `dependsOn: ["check-types"]` (cùng `^build`), hoặc tài liệu hoá rõ rằng CI chạy `pnpm check-types` như gate riêng bắt buộc. Mục tiêu: regression type ở bất kỳ package nào đều fail gate, không ẩn được nữa.

8. **Dọn vụn liên quan**:
   - Giải quyết script mồ côi `build:components: tsc` trong `packages/ui/package.json` (đã không nằm trong build path): hoặc xoá (chốt source-model), hoặc wire lại — chốt 1 hướng + ghi lý do.
   - Prune dependency `geist` thừa trong `apps/docs/package.json` (layout đã chuyển sang `next/font/google`) — verify không còn import `from "geist..."`.
   - `@landing/design-tokens` trong `transpilePackages` (`apps/docs/next.config.ts`) trỏ package CHƯA tồn tại: GIỮ NGUYÊN + comment liên kết tới Epic 2 story `2-1-base-token-package` (package sẽ được tạo ở đó). KHÔNG xoá entry ở story này.

9. **Không regression**: `pnpm build` 7/7 xanh, `/templates/ternus` vẫn render (nav+main 6 section+footer, WebGL canvas mount, 0 console error) — verify lại bằng `next dev` + browser như Story 1.5 AC #2.

## Tasks / Subtasks

- [ ] **Task 1 — Config fix: TS2835 + đưa templates-ternus vào coverage (AC: #2, #3)**
  - [ ] Override `module: "ESNext"` + `moduleResolution: "Bundler"` trong `packages/typescript-config/react-library.json`; chạy `pnpm --filter @landing/ui check-types` xác nhận 6× `TS2835` biến mất.
  - [ ] Tạo `packages/templates-ternus/tsconfig.json` (extends `@landing/typescript-config/react-library.json`, `include: ["src"]`).
  - [ ] Tạo `packages/templates-ternus/eslint.config.mjs` (copy mẫu `packages/ui/eslint.config.mjs`).
  - [ ] Thêm scripts `check-types` + `lint` vào `packages/templates-ternus/package.json`; khai báo devDependency eslint-config nếu cần (đối chiếu `packages/ui/package.json`).

- [ ] **Task 2 — Fix strict-null PixelBlast.tsx (AC: #4)**
  - [ ] Đọc 11 lỗi (`TS18048`×8 `'point' is possibly undefined`, `TS2532`×2, `TS2345`×1); thêm guard/narrow ở các điểm truy cập touch-point array. Ưu tiên sửa logic an toàn, không đổi behavior.
  - [ ] `pnpm --filter @landing/ui check-types` cho PixelBlast = 0 lỗi.

- [ ] **Task 3 — Fix strict-null hero-crystal.tsx (AC: #4)**
  - [ ] Đọc 44 lỗi (`TS18048`×24 / `TS2532`×18 / `TS2345`×2) trong `packages/templates-ternus/src/components/hero-crystal.tsx`; fix tương tự Task 2.
  - [ ] `pnpm --filter @landing/templates-ternus check-types` = 0.

- [ ] **Task 4 — ogl type augmentation (AC: #5)**
  - [ ] Verify runtime: `node -e "const o=require('ogl'); console.log(['Mesh','Program','Renderer','Triangle'].map(k=>typeof o[k]))"` (kỳ vọng 4× `function`).
  - [ ] Tạo `packages/ui/src/types/ogl.d.ts` `declare module "ogl"` bổ sung `Mesh/Program/Renderer/Triangle` (+ member khác SoftAurora dùng nếu cần); đảm bảo nằm trong `include` của tsconfig ui.
  - [ ] `pnpm --filter @landing/ui check-types` cho SoftAurora = 0; tổng ui = 0.

- [ ] **Task 5 — Gỡ ignoreBuildErrors + wire gate (AC: #1, #6, #7)**
  - [ ] Sau Task 1–4: `pnpm check-types` (root) exit 0 toàn workspace.
  - [ ] Xoá block `typescript: { ignoreBuildErrors: true }` trong `apps/docs/next.config.ts`; chạy `pnpm build` xác nhận 7/7 xanh không cần flag.
  - [ ] Wire `check-types` vào gate: cập nhật `turbo.json` `build.dependsOn` thêm `"check-types"` (hoặc tài liệu hoá CI gate) — chốt hướng + ghi Dev Notes.

- [ ] **Task 6 — Dọn vụn (AC: #8)**
  - [ ] Chốt số phận `build:components: tsc` trong `packages/ui/package.json` (xoá hoặc wire) + ghi lý do.
  - [ ] Prune `geist` khỏi `apps/docs/package.json` deps; `grep -rn "geist" apps/docs` xác nhận 0 import runtime.
  - [ ] Thêm comment liên kết Epic 2 `2-1` cho entry `@landing/design-tokens` trong `transpilePackages`.

- [ ] **Task 7 — Verify không regression (AC: #9)**
  - [ ] `pnpm build` 7/7 + `pnpm check-types` + `pnpm lint` đều exit 0.
  - [ ] `next dev` + browser load `/templates/ternus`: render đầy đủ, canvas WebGL mount, 0 console error (lặp AC #2 Story 1.5).
  - [ ] Đánh dấu các mục `[ ] [AI-Review]` tương ứng trong story 1-5 "Review Follow-ups (AI)" thành `[x]` khi xong.

## Dev Notes

### Root cause moduleResolution (TS2835)

`packages/typescript-config/base.json` dùng `module: NodeNext` + `moduleResolution: NodeNext` → bắt buộc `.js` extension trong relative import (ESM node16/nodenext). `react-library.json` extends base, KHÔNG override → `@landing/ui` thừa hưởng NodeNext → 6 file `index.ts` báo `TS2835`. Ngược lại `nextjs.json` đã override `moduleResolution: "Bundler"` → `apps/docs` không dính. Vì các package được **Turbopack transpile** (qua `transpilePackages`), không publish như package ESM độc lập, nên `Bundler` resolution mới đúng ngữ nghĩa cho `react-library`. Sửa 1 chỗ (react-library) gọn hơn rải `.js` khắp nơi.

### Strict-null (noUncheckedIndexedAccess)

`base.json` bật `noUncheckedIndexedAccess: true` + `strict: true`. Phần lớn lỗi `TS18048`/`TS2532` đến từ truy cập phần tử mảng (touch points, geometry buffers) trong code WebGL gốc (PixelBlast từ thư viện pixel-mesh, hero-crystal). Đây là **lỗi pre-existing trong source gốc** (file `git mv` thuần ở Wave 0 — migration không tạo mới), bị `ignoreBuildErrors` che. Code đã **runtime-verified** (Story 1.5 AC #2: render OK, 0 console error) → fix là làm type khớp với runtime đã đúng, KHÔNG sửa hành vi. Cho phép `// @ts-expect-error` có comment ở chỗ không narrow gọn được.

### ogl TS2305 — false alarm types-only

`SoftAurora.tsx` import `Mesh/Program/Renderer/Triangle` từ `ogl`. `.d.ts` của ogl thiếu các named export này nhưng **runtime có** (đã verify `require('ogl')` → function). `SoftAurora` hiện CHƯA render ở route nào (0 reference) nên không nổ runtime, nhưng vẫn phải làm type sạch để bật được gate. Dùng `declare module "ogl"` augmentation, KHÔNG tắt `skipLibCheck`.

### Hiện trạng script/gate (commit `6cbff95`)

- Root scripts: `build`/`dev`/`lint`/`check-types` đều `turbo run <task>`; `check-types` ĐÃ tồn tại nhưng đang fail nên chưa nằm trong build path.
- `turbo.json`: có task `check-types` (`dependsOn: ["^check-types"]`) nhưng `build` KHÔNG `dependsOn` nó.
- `@landing/ui`: có `check-types` + `lint` (đang fail check-types). Có `build:components: tsc` mồ côi.
- `@landing/templates-ternus`: chỉ có `build` no-op — THIẾU `check-types` + `lint` + tsconfig + eslint config.
- 4 skeleton package (`sections`, `templates-{memecoin,gamefi,nft}`) rỗng — chấp nhận thiếu script tới khi có source (epic tương ứng).

### Thứ tự đề xuất

Task 1 (config) trước để loại 6 lỗi TS2835 + mở coverage cho templates-ternus → rồi Task 2–4 fix lỗi thật → Task 5 mới gỡ được `ignoreBuildErrors` an toàn (gỡ sớm khi còn lỗi sẽ vỡ `next build`). Task 6 dọn vụn độc lập. Task 7 verify cuối.

### Ràng buộc (kế thừa Epic 1)

- KHÔNG `pnpm exec` — chạy binary trực tiếp (`./node_modules/.bin/tsc`, hoặc `pnpm --filter <pkg> run <script>`). Lưu ý `tsc` KHÔNG ở root `.bin/` (pnpm hoisting) — nằm ở `packages/<pkg>/node_modules/.bin/tsc`.
- KHÔNG `git add -A` — stage file tường minh. KHÔNG `--no-verify`.
- `transpilePackages` luôn là list tường minh (Next 16 không glob); package trong list phải đồng thời là `dependency` của `apps/docs` nếu được import.
- 1 source commit cho story + 1 bmad bookkeeping commit riêng.

### References

- `_bmad-output/implementation-artifacts/1-5-wire-routes-redirect-smoke-test.md#senior-developer-review-ai` — review sinh ra story này.
- `_bmad-output/implementation-artifacts/1-4-migrate-legacy-source.md` — deviation #3 (`@landing/ui` source model, bỏ `build:components`).
- `packages/typescript-config/{base,react-library,nextjs}.json` — config gốc.

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date       | Version | Description                                                    | Author |
| ---------- | ------- | -------------------------------------------------------------- | ------ |
| 2026-06-09 | 0.1     | Tạo story tech-debt type-coverage gate từ Senior Dev Review E1 | Amelia |
