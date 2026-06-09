---
baseline_commit: a8c56c8
---

# Story 1.3: Rename @repo → @landing

Status: review

## Story

As a **builder**, I want **đổi toàn bộ package naming từ `@repo` sang `@landing`**, so that **import paths và workspace protocol nhất quán với architecture, sẵn sàng cho các story scaffold/migrate kế tiếp**.

## Acceptance Criteria

1. **Given** create-turbo scaffold (Story 1.2) đã hoàn tất và `pnpm install` xanh
   **When** rename tất cả `package.json` field `name` của mọi package trong `packages/*` từ `@repo/<x>` sang `@landing/<x>` (vd `@landing/ui`, `@landing/design-tokens` — chỉ những package thực sự tồn tại trong scaffold)
   **And** đổi mọi dependency `"@repo/*": "workspace:*"` trong `apps/docs/package.json` (và bất kỳ `package.json` nào khác) sang `"@landing/*": "workspace:*"`
   **Then** không còn reference `@repo/` nào trong workspace.

2. **Given** đã rename xong
   **When** chạy `grep -rn "@repo/" . --exclude-dir=node_modules --exclude-dir=_legacy-src`
   **Then** kết quả → **0 dòng** (nếu còn sót trong CI config — vd `.github/workflows/*` — thì fix luôn; chỉ `node_modules` và `_legacy-src` được loại trừ).

3. **Given** `apps/docs/tsconfig.json` có `compilerOptions.paths`
   **When** cập nhật import alias (path relative từ `apps/docs/`)
   **Then** có entry:

   ```json
   "@landing/templates/ternus": ["../../packages/templates-ternus/src"]
   ```

   Lưu ý: alias key dùng dấu `/` (`@landing/templates/ternus`) — KHÁC với npm package name `@landing/templates-ternus` (dùng dấu `-`).

4. **Given** `apps/docs/next.config.ts`
   **When** khai báo `transpilePackages`
   **Then** dùng **explicit list (KHÔNG glob)**:

   ```ts
   transpilePackages: [
     "@landing/ui",
     "@landing/design-tokens",
     "@landing/templates-ternus",
   ];
   ```

   **And** mỗi package mới sau này được append vào list này qua registration task riêng (không dùng `@landing/*` glob — Next 16 không hỗ trợ).

5. **Given** đã rename + sửa config
   **When** chạy `pnpm install` (re-link workspace) và `pnpm build`
   **Then** workspace resolve đúng các `@landing/*` package, không lỗi `unmet peer` / `module not found` do tên cũ.

## Tasks / Subtasks

- [x] **Task 1: Rename `name` trong mọi `packages/*/package.json`** (AC: #1, #2)
  - [x] Liệt kê package thực tế scaffold sinh ra: `ls packages/` (with-tailwind template thường ship `@repo/ui` + có thể `@repo/eslint-config`, `@repo/typescript-config`). Chỉ rename những gì TỒN TẠI — KHÔNG tạo package mới (việc đó là Story 1.3b).
  - [x] Với từng package, đổi field `"name": "@repo/<x>"` → `"@landing/<x>"`.
  - [x] Lưu ý npm name KHÔNG cho `/` lồng: dùng `@landing/templates-ternus` (hyphen) nếu có template package; KHÔNG phải `@landing/templates/ternus`.

- [x] **Task 2: Đổi workspace deps trong `apps/docs/package.json` (và mọi package.json khác)** (AC: #1, #2)
  - [x] Trong `apps/docs/package.json` (và bất kỳ `packages/*/package.json` nào có internal dep): đổi mọi `"@repo/<x>": "workspace:*"` → `"@landing/<x>": "workspace:*"`.
  - [x] Giữ nguyên protocol `workspace:*` — chỉ đổi phần namespace `@repo` → `@landing`.

- [x] **Task 3: Cập nhật `apps/docs/tsconfig.json` paths** (AC: #3)
  - [x] Mở `apps/docs/tsconfig.json`, vào `compilerOptions.paths`.
  - [x] Đổi mọi alias `@repo/*` → `@landing/*`.
  - [x] Thêm/cập nhật alias import của Ternus (path relative từ `apps/docs/`):
    ```json
    "@landing/templates/ternus": ["../../packages/templates-ternus/src"]
    ```
  - [x] Ghi rõ trong commit/PR: alias key `@landing/templates/ternus` (slash) ≠ npm name `@landing/templates-ternus` (hyphen).

- [x] **Task 4: Cập nhật `transpilePackages` trong `apps/docs/next.config.ts`** (AC: #4)
  - [x] Đặt explicit list: `["@landing/ui", "@landing/design-tokens", "@landing/templates-ternus"]`.
  - [x] KHÔNG dùng glob `["@landing/*"]` (Next 16 không hỗ trợ glob — append serial cho mỗi package mới).
  - [x] Nếu một số package trong list chưa tồn tại trên disk ở thời điểm này (sẽ tạo ở Story 1.3b/1.4), vẫn khai báo trước theo đúng list authoritative — registration là phần của contract Epic 1.

- [x] **Task 5: Verify grep + build** (AC: #2, #5)
  - [x] Chạy: `grep -rn "@repo/" . --exclude-dir=node_modules --exclude-dir=_legacy-src` → kỳ vọng **0 dòng**. Nếu còn (CI config, `.github/`) → fix.
  - [x] Chạy `pnpm install` để re-link workspace symlinks theo tên mới.
  - [x] Chạy `pnpm build` (hoặc `pnpm --filter docs build`) → exit 0, không lỗi module not found do tên cũ.

## Dev Notes

### Project Structure Notes

- **Bối cảnh chain Epic 1**: 1.1 Gate-0 → 1.2 pnpm Scaffold → **1.3 Rename @repo→@landing (story này)** → 1.3b Scaffold Empty Packages → 1.4 Migrate Legacy Source → 1.5 Wire/Smoke. Story này chạy NGAY SAU khi `create-turbo` (`pnpm dlx create-turbo@latest . -m pnpm -e with-tailwind --skip-install`) đã sinh ra các package `@repo/*`.
- **Phạm vi chính xác**: story này CHỈ rename các package mà scaffold đã sinh + sửa deps/config trong `apps/docs`. Template `with-tailwind` thường ship `@repo/ui` (và có thể `@repo/eslint-config`, `@repo/typescript-config`). Các package còn lại (`@landing/sections`, `@landing/templates-ternus`, `@landing/templates-memecoin`...) **CHƯA tồn tại** — chúng được tạo ở **Story 1.3b** (scaffold empty) và populate ở **1.4** (migrate). Đừng tạo package mới ở đây.
- **`transpilePackages` có thể tham chiếu package chưa tồn tại**: list explicit `["@landing/ui", "@landing/design-tokens", "@landing/templates-ternus"]` là contract — khai báo trước, package thật sẽ xuất hiện ở 1.3b/1.4. Đây là lý do AC#4 nói "append mỗi package mới qua registration task".

### ⚠️ Điểm dễ nhầm nhất — alias path vs npm package name

Đây là confusion risk chính của story, PHẢI phân biệt rõ:

| Khái niệm                   | Giá trị                     | Dùng ở đâu                                                                                        | Dấu phân tách                                        |
| --------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **npm package name**        | `@landing/templates-ternus` | field `name` trong `package.json`, deps `workspace:*`, `transpilePackages`                        | hyphen `-` (npm KHÔNG cho `/` lồng trong scope path) |
| **TypeScript import alias** | `@landing/templates/ternus` | key trong `tsconfig.json` `compilerOptions.paths` → map tới `../../packages/templates-ternus/src` | slash `/`                                            |

Tức là cùng một thư mục `packages/templates-ternus/src` được tham chiếu bằng HAI tên khác nhau tùy ngữ cảnh. Đừng "sửa cho đồng nhất" — sự khác biệt này là cố ý.

### transpilePackages — KHÔNG dùng glob

- **AUTHORITY RULE**: `epics.md` authoritative. Mặc dù một ghi chú architecture/strategy ban đầu (R4 mitigation) gợi ý glob `transpilePackages: ["@landing/*"]`, **Next 16 KHÔNG hỗ trợ glob** → dùng **explicit list** + serial registration cho mỗi package mới.
- Đọc guide Next 16 tại `node_modules/next/dist/docs/` trước khi sửa `next.config.ts` (project là bản Next có breaking changes so với training data — xem `AGENTS.md`).

### Verify commands

```bash
# AC#2 — phải ra 0 dòng (chỉ loại trừ node_modules + _legacy-src):
grep -rn "@repo/" . --exclude-dir=node_modules --exclude-dir=_legacy-src

# liệt kê package thực tế trước khi rename:
ls packages/

# re-link + build sau rename:
pnpm install
pnpm build   # hoặc: pnpm --filter docs build
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3: Rename @repo → @landing] — ACs gốc (lines ~202-219): rename names + deps, grep 0 kết quả, tsconfig alias `@landing/templates/ternus`, transpilePackages explicit list.
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] — npm name `@landing/{design-tokens,ui,sections,templates-<slug>}`; import alias `@landing/templates/ternus` → `packages/templates-ternus/src` "khác npm package name".
- [Source: _bmad-output/planning-artifacts/parallel-dev-strategy.md#Patch 2] — checklist rename sau `create-turbo`: `@repo/ui`→`@landing/ui`, deps `workspace:*`, tsconfig base paths, transpilePackages; cảnh báo alias `@landing/templates/ternus` ≠ npm name `@landing/templates-ternus`.
- [Source: _bmad-output/planning-artifacts/parallel-dev-strategy.md#R4] — `transpilePackages` shared config: glob được gợi ý nhưng "Nếu Next 16 không hỗ trợ glob, registration task serial owner Epic A" → story này chốt explicit list.
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3b] — package empty (`sections`, `templates-memecoin/gamefi/nft`) tạo Ở 1.3b, KHÔNG ở story này.

## Dev Agent Record

### Agent Model Used

claude-opus-4-8[1m] (BMAD Dev Story workflow)

### Debug Log References

- `pnpm build` lần 1 FAIL: `next.config.ts` chứa `import.meta.url` + `fileURLToPath` (để tính `turbopack.root`) compile ra file `next.config.compiled.js` dạng CJS (`exports`), nhưng `apps/docs/package.json` có `"type": "module"` → `.js` bị coi là ESM → `ReferenceError: exports is not defined in ES module scope`.
- Fix: gỡ `turbopack.root` + toàn bộ node import khỏi `next.config.ts`, trả về form tối thiểu đúng AC#4 (chỉ `transpilePackages` + `typescript.ignoreBuildErrors`). `turbopack.root` KHÔNG nằm trong AC của story này (chỉ là note tự thêm để dẹp warning) → loại bỏ để tránh scope creep.
- `pnpm build` lần 2 PASS: 3/3 tasks (`@landing/ui:build:styles`, `@landing/ui:build:components`, `docs:build`), `✓ Compiled successfully`.

### Completion Notes List

- Rename `@repo/` → `@landing/` blanket qua 14 file source/config (đã làm ở phần prep Story 1.2/1.3): `grep -rn "@repo/"` trong workspace source/config = **0 dòng** (loại trừ `node_modules`, `_legacy-src`, `pnpm-lock.yaml` regenerate, prose docs `_bmad-output`).
- Package thực tế scaffold sinh ra: `@landing/ui`, `@landing/eslint-config`, `@landing/tailwind-config`, `@landing/typescript-config` (with-tailwind template). KHÔNG tạo package mới — đúng scope (sections/templates-\* để Story 1.3b/1.4).
- `tsconfig.json`: thêm `compilerOptions.paths` alias `"@landing/templates/ternus": ["../../packages/templates-ternus/src"]` — alias key dùng slash `/`, KHÁC npm name `@landing/templates-ternus` (hyphen). Khác biệt này là cố ý (xem bảng Dev Notes).
- `transpilePackages`: explicit list `["@landing/ui", "@landing/design-tokens", "@landing/templates-ternus"]` — `@landing/design-tokens` + `@landing/templates-ternus` chưa tồn tại trên disk (contract Epic 1, package thật ở 1.3b/1.4); Next 16 tolerate list non-existent → build vẫn xanh.
- ⚠️ Known cosmetic warning: Next in `⚠ Next.js inferred your workspace root` do phát hiện `$HOME/package-lock.json` (artifact ngoài repo) + `package-lock.json` ở MAIN checkout (vẫn npm app trên branch `main`). KHÔNG ảnh hưởng build (exit 0). Không fix bằng `turbopack.root` vì gây lỗi ESM ở trên + ngoài scope; sẽ tự hết sau khi merge/dọn lockfile cũ.
- AC#5 `pnpm install` re-link workspace: xanh (exit 0), không `unmet peer` / `module not found` do tên cũ.

### File List

- `apps/docs/tsconfig.json` (thêm `compilerOptions.paths` alias Ternus)
- `apps/docs/next.config.ts` (transpilePackages explicit list; gỡ turbopack.root gây lỗi ESM)
- `apps/docs/package.json`, `apps/docs/eslint.config.js`, `apps/docs/postcss.config.js`, `apps/docs/app/{layout.tsx,globals.css,page.tsx}` (rename @repo→@landing)
- `packages/ui/{tsconfig.json,package.json,eslint.config.mjs,src/styles.css}` (rename @repo→@landing)
- `packages/{tailwind-config,typescript-config,eslint-config}/package.json` (rename @repo→@landing)
- `pnpm-lock.yaml` (regenerate sau install)

### Change Log

| Date       | Version | Description                                                                                                                    |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 2026-06-09 | 1.0     | Rename @repo→@landing toàn workspace, tsconfig alias Ternus, transpilePackages explicit list, build xanh 3/3. Status → review. |
