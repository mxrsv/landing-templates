# Story 1.3: Rename @repo → @landing

Status: ready-for-dev

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

- [ ] **Task 1: Rename `name` trong mọi `packages/*/package.json`** (AC: #1, #2)
  - [ ] Liệt kê package thực tế scaffold sinh ra: `ls packages/` (with-tailwind template thường ship `@repo/ui` + có thể `@repo/eslint-config`, `@repo/typescript-config`). Chỉ rename những gì TỒN TẠI — KHÔNG tạo package mới (việc đó là Story 1.3b).
  - [ ] Với từng package, đổi field `"name": "@repo/<x>"` → `"@landing/<x>"`.
  - [ ] Lưu ý npm name KHÔNG cho `/` lồng: dùng `@landing/templates-ternus` (hyphen) nếu có template package; KHÔNG phải `@landing/templates/ternus`.

- [ ] **Task 2: Đổi workspace deps trong `apps/docs/package.json` (và mọi package.json khác)** (AC: #1, #2)
  - [ ] Trong `apps/docs/package.json` (và bất kỳ `packages/*/package.json` nào có internal dep): đổi mọi `"@repo/<x>": "workspace:*"` → `"@landing/<x>": "workspace:*"`.
  - [ ] Giữ nguyên protocol `workspace:*` — chỉ đổi phần namespace `@repo` → `@landing`.

- [ ] **Task 3: Cập nhật `apps/docs/tsconfig.json` paths** (AC: #3)
  - [ ] Mở `apps/docs/tsconfig.json`, vào `compilerOptions.paths`.
  - [ ] Đổi mọi alias `@repo/*` → `@landing/*`.
  - [ ] Thêm/cập nhật alias import của Ternus (path relative từ `apps/docs/`):
    ```json
    "@landing/templates/ternus": ["../../packages/templates-ternus/src"]
    ```
  - [ ] Ghi rõ trong commit/PR: alias key `@landing/templates/ternus` (slash) ≠ npm name `@landing/templates-ternus` (hyphen).

- [ ] **Task 4: Cập nhật `transpilePackages` trong `apps/docs/next.config.ts`** (AC: #4)
  - [ ] Đặt explicit list: `["@landing/ui", "@landing/design-tokens", "@landing/templates-ternus"]`.
  - [ ] KHÔNG dùng glob `["@landing/*"]` (Next 16 không hỗ trợ glob — append serial cho mỗi package mới).
  - [ ] Nếu một số package trong list chưa tồn tại trên disk ở thời điểm này (sẽ tạo ở Story 1.3b/1.4), vẫn khai báo trước theo đúng list authoritative — registration là phần của contract Epic 1.

- [ ] **Task 5: Verify grep + build** (AC: #2, #5)
  - [ ] Chạy: `grep -rn "@repo/" . --exclude-dir=node_modules --exclude-dir=_legacy-src` → kỳ vọng **0 dòng**. Nếu còn (CI config, `.github/`) → fix.
  - [ ] Chạy `pnpm install` để re-link workspace symlinks theo tên mới.
  - [ ] Chạy `pnpm build` (hoặc `pnpm --filter docs build`) → exit 0, không lỗi module not found do tên cũ.

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

### Debug Log References

### Completion Notes List

### File List
