# Story 2.1: Base Token Package & @theme Block

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **dev consuming a Piece**,
I want **import `@landing/design-tokens` với CSS vars (spacing/type/easing floor) và một Tailwind 4 `@theme` block hỗ trợ runtime theme swap**,
so that **spacing scale và motion easing floor áp dụng nhất quán mọi Piece, và Story 2.2 chỉ cần override `--p-*` để đổi palette mà không đụng `@theme`**.

## Acceptance Criteria

1. **Given** monorepo sau Epic 1, **When** tạo package `packages/design-tokens` (`@landing/design-tokens`, `private: true`, `type: "module"`) với `src/base.css` chứa: spacing vars trên **4/8px grid**, type scale vars, và **named easing curves** (cấm để dev hardcode magic number sau này), **Then** package có `exports` trỏ `.` → `./src/base.css` và `pnpm --filter @landing/design-tokens build` exit 0.
2. **Given** base.css, **When** khai báo block `@theme` theo pattern runtime theme swap, **Then** dùng **`@theme inline`** map `--color-*` → `var(--p-*)` (KHÔNG `@theme` thường — xem Dev Notes §"@theme inline là bắt buộc"); ví dụ:

   ```css
   @theme inline {
     --color-primary: var(--p-primary);
     /* …map --color-* → var(--p-*) cho mọi token palette */
   }
   ```

3. **Given** `@theme inline` map sang `--p-*`, **When** đặt giá trị palette mặc định, **Then** default `--p-*` (floor = infra) đặt dưới `:root` trong base.css; theme files (Story 2.2) chỉ override `--p-*` dưới selector `[data-theme="…"]` — **không hardcode màu literal trong `@theme`**.
4. **Given** package hoàn tất, **When** wire vào gallery, **Then** `apps/docs` khai báo dep `@landing/design-tokens: workspace:*` và `@import "@landing/design-tokens"` trong `apps/docs/app/globals.css` **sau** `@import "tailwindcss"`.
5. **Given** boilerplate create-turbo còn sót, **When** kiểm tra `packages/tailwind-config/shared-styles.css`, **Then** xoá `@theme` rác (`--color-blue-1000/purple-1000/red-1000`) **chỉ nếu** grep xác nhận 0 chỗ dùng `blue-1000|purple-1000|red-1000` trong `apps/` + `packages/` — để `design-tokens` là **nguồn `@theme` duy nhất** (nếu có chỗ dùng: GIỮ + ghi chú, không xoá).
6. **Given** mọi thay đổi xong, **When** chạy gate, **Then** `pnpm --filter @landing/design-tokens build` exit 0 **AND** `pnpm build` (root turbo) exit 0 **AND** `pnpm lint` exit 0.

## Tasks / Subtasks

- [x] **Task 1 — Scaffold package `packages/design-tokens`** (AC: 1)
  - [x] Tạo `packages/design-tokens/package.json`: `name: "@landing/design-tokens"`, `version: "0.0.0"`, `private: true`, `type: "module"`, `exports: { ".": "./src/base.css" }`, script `build` no-op echo (CSS-only, không compile — mirror `packages/sections/package.json`), devDep `tailwindcss: "^4.1.5"` (để IDE/tooling hiểu `@theme`).
  - [x] **KHÔNG** thêm `check-types` script (package không có TS) — turbo bỏ qua task này khi package không định nghĩa nó; tránh tạo `tsconfig.json` thừa.
  - [x] Xác nhận `@landing/design-tokens` đã nằm sẵn trong `apps/docs/next.config.ts` `transpilePackages` (Epic 1 pre-register — KHÔNG sửa list).
- [x] **Task 2 — Viết `src/base.css`** (AC: 1, 2, 3)
  - [x] `:root` — spacing vars 4/8px grid (vd `--space-1: 0.25rem … --space-24: 6rem`), type scale vars (eyebrow→display), named easing (`--ease-standard`, `--ease-entrance`, `--ease-exit`) + duration vars. KHÔNG dùng `transition: all` ở bất kỳ đâu.
  - [x] `:root` — default palette `--p-*` (floor = infra mood; tham khảo giá trị cyan/near-black đã LOCK: `--p-bg:#07070c`, `--p-primary:#22d3ee`, `--p-accent:#fb923c` dùng cực ít). Đây là default; Story 2.2 override.
  - [x] `@theme inline { --color-* : var(--p-*) }` — map đủ token palette sang Tailwind utility namespace (`bg-primary`, `text-ink`, `border-line`…).
  - [x] **KHÔNG** `@import "tailwindcss"` trong base.css (apps/docs đã import; double-import gây trùng).
- [x] **Task 3 — Wire vào `apps/docs`** (AC: 4)
  - [x] `apps/docs/package.json`: thêm `"@landing/design-tokens": "workspace:*"` vào `dependencies`.
  - [x] `apps/docs/app/globals.css`: thêm `@import "@landing/design-tokens";` ngay sau `@import "tailwindcss";` và `@import "@landing/tailwind-config";`, trước các `@source`/`@theme inline` cục bộ. Cân nhắc gỡ block `@theme inline` placeholder (`--color-background/foreground`) nếu trùng vai trò — chỉ khi không phá demo home hiện tại.
  - [x] `pnpm install` để link workspace dep mới.
- [x] **Task 4 — Dọn `@theme` boilerplate `tailwind-config`** (AC: 5)
  - [x] `grep -rn "blue-1000\|purple-1000\|red-1000" apps/ packages/ --include=*.tsx --include=*.ts --include=*.css | grep -v node_modules` → nếu 0 kết quả, xoá `@theme { … }` trong `packages/tailwind-config/shared-styles.css` (giữ dòng `@import "tailwindcss"`).
  - [x] Nếu có kết quả: GIỮ NGUYÊN, ghi 1 dòng note trong Dev Agent Record (đừng phá class đang dùng).
- [x] **Task 5 — Verify gate** (AC: 6)
  - [x] `pnpm --filter @landing/design-tokens build` → exit 0.
  - [x] `pnpm build` (root) → exit 0; mở `/templates/ternus` xác nhận **không regress** (Ternus dùng `.tn` scoped vars riêng — không phụ thuộc token mới, phải vẫn render đúng).
  - [x] `pnpm lint` → exit 0.
  - [x] (Smoke nhẹ) Tạm thêm 1 element dùng `bg-primary` trong 1 trang docs để xác nhận `@theme inline` emit `var(--p-primary)` và đổi `data-theme` (manual) đổi màu — **xoá element thử sau khi xác nhận** (route demo theme-switch chính thức là Story 2.2, không làm ở đây).

## Dev Notes

### `@theme inline` là BẮT BUỘC (đọc kỹ — đây là cạm bẫy chính của story)

- Epics AC 2.1 viết `@theme { --color-primary: var(--p-primary) }` nhưng Tailwind 4 **resolve `@theme` thường tại build-time** → utility sẽ "đóng băng" giá trị `--p-primary` lúc compile, **runtime swap `data-theme` KHÔNG đổi màu**. Phải dùng **`@theme inline`** để Tailwind emit thẳng `var(--p-*)` vào utility → đổi `--p-*` lúc runtime đổi màu ngay. [Source: Tailwind CSS v4 — `@theme inline` option; bằng chứng in-repo: `apps/docs/app/globals.css` **đã** dùng `@theme inline` cho `--color-background/foreground` với `var()` reference.]
- Đây là **variance có chủ đích** so với wording epics — ghi rõ ở §Project Structure Notes.

### Quan hệ `design-tokens` ↔ `tailwind-config` (2 package khác vai trò)

- `packages/tailwind-config` (`@landing/tailwind-config`) = create-turbo scaffold: shared Tailwind entry + `postcss.config.js` (`./postcss` export). Được import bởi `apps/docs/app/globals.css` và `packages/ui/src/styles.css`. **Giữ — chỉ dọn `@theme` rác.**
- `packages/design-tokens` (`@landing/design-tokens`) = **token floor** theo architecture (`design-tokens ← ui ← sections ← templates ← apps/docs`, không import ngược). Đây là nơi DUY NHẤT chứa `@theme` palette thật sau story này. [Source: `architecture.md#L29`, `#L130`, `#L356`, `#L381`]
- Pre-register đã sẵn: `@landing/design-tokens` nằm trong `transpilePackages` của `apps/docs/next.config.ts` (Epic 1 contract, comment trỏ thẳng story `2-1`). Build chỉ vỡ khi có code import package chưa tồn tại — story này tạo nó nên hết vỡ. [Source: `apps/docs/next.config.ts` L6-13; `1-5-…md` §Review Follow-ups mục `[AI-Review][Med] @landing/design-tokens`.]

### Token swap pattern (chuẩn để Story 2.2 nối tiếp)

```
:root            → default --p-* (infra floor)
[data-theme=neon]→ override --p-* (Story 2.2)
@theme inline    → --color-* : var(--p-*)   (Tailwind utility ↔ swappable var)
```

- Story 2.2 sẽ tạo `packages/design-tokens/src/themes/{infra,neon,game,nft}.css` chỉ override `--p-*`; KHÔNG đụng `@theme`. base.css của story này phải để pattern đó hoạt động sẵn.

### Source tree được phép đụng

- **NEW:** `packages/design-tokens/package.json`, `packages/design-tokens/src/base.css`.
- **UPDATE:** `apps/docs/package.json` (+1 dep), `apps/docs/app/globals.css` (+1 import), `packages/tailwind-config/shared-styles.css` (xoá @theme rác — có điều kiện).
- **KHÔNG đụng:** `packages/templates-ternus/*` (Ternus dùng `.tn` scoped vars độc lập — Epic 3 mới refactor sang token chung; story này không migrate), `next.config.ts` `transpilePackages` list.

### Hằng số đã LOCK (đừng phá khi chọn giá trị `--p-*` default)

- Tone calm/premium; cyan-dominant `#22d3ee` trên near-black `#07070c`; orange `#fb923c` **chỉ 1-2 chỗ có nghĩa**; hairline aesthetic; motion chậm + tôn trọng `prefers-reduced-motion` (hook shared là Story 2.4, không scope ở đây). [Source: brainstorm locked constraints; `architecture.md#L29`]

### Testing standards

- Không có unit-test runner cho CSS package — "test" = build pass + visual no-regress. Gate chính thức: `pnpm build` root (turbo, gồm `check-types` cho package có TS) + `pnpm lint` (story 1-6 đã wire CI gate). [Source: `turbo.json`; `1-6-type-coverage-gate.md`]
- Invariant bar (spacing 4/8 grid, named easing only, cấm `transition: all`) sẽ được document hoá ở Story 2.3 — base.css phải tuân ngay từ đầu để 2.3 không phải sửa ngược.

### Versions (pin theo repo)

- `tailwindcss ^4.1.5`, `next 16.2.7`, `react 19.2.4`, `turbo ^2.9`, pnpm workspace. [Source: `apps/docs/package.json`, root `package.json`]

### Project Structure Notes

- **Alignment:** Tạo `packages/design-tokens` khớp chính xác cây thư mục architecture (`packages/design-tokens/src/{base.css,themes/…}`) và FR-3→FR-5 mapping. [Source: `architecture.md#L356`, `#L371`]
- **Variance 1 (đã chủ đích):** dùng `@theme inline` thay vì `@theme` như wording epics — lý do kỹ thuật ở §"@theme inline là bắt buộc". Cùng intent (token floor + runtime swap), khác cú pháp đúng-Tailwind-4.
- **Variance 2:** `packages/tailwind-config` không có trong cây architecture (do create-turbo sinh) nhưng được giữ làm shared postcss/entry; `design-tokens` không thay thế nó, chỉ tách vai trò token. Đã ghi quan hệ ở trên.
- **Dependency flow:** giữ `design-tokens` ở đáy chuỗi — KHÔNG để base.css import ngược `ui`/`sections`/`templates`. [Source: `architecture.md#L381`]

### References

- [Source: `_bmad-output/planning-artifacts/epics.md#Story 2.1` — AC gốc]
- [Source: `_bmad-output/planning-artifacts/architecture.md#L29` — Design Tokens FR-3→FR-5; `#L130` — `@theme` + `@source`; `#L132` — Tailwind preset → `@theme` supersede; `#L317` — `data-theme` themes; `#L356` — cây thư mục; `#L381` — dependency flow]
- [Source: `apps/docs/next.config.ts` — pre-register `transpilePackages`]
- [Source: `apps/docs/app/globals.css` — bằng chứng `@theme inline` + `@source` đang dùng]
- [Source: `packages/tailwind-config/shared-styles.css` — boilerplate cần dọn]
- [Source: `packages/sections/package.json` — mẫu skeleton package + build stub]
- [Source: `_bmad-output/implementation-artifacts/1-5-wire-routes-redirect-smoke-test.md` §Review Follow-ups — pre-register design-tokens]

### Câu hỏi cho user (không block dev — xử lý khi review)

1. **Đặt tên token palette:** dùng tiền tố `--p-*` (per epics AC) hay tên ngữ nghĩa hơn (`--theme-*`)? Đề xuất giữ `--p-*` để khớp Story 2.2 đã viết sẵn trong epics.
2. **Bộ token spacing/type cụ thể:** lấy thẳng từ thang `.tn` của Ternus (đã LOCK đẹp) làm floor chung, hay định nghĩa thang neutral riêng rồi Ternus map sang ở Epic 3? Đề xuất: floor neutral + Epic 3 reconcile (tránh ràng buộc 3 theme còn lại theo gu Ternus).

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (1M context)

### Debug Log References

- `pnpm --filter @landing/design-tokens build` → exit 0
- `pnpm build` (root turbo) → 11/11 successful; routes `/`, `/templates/ternus` render OK (no regress)
- `pnpm lint` → exit 0
- Smoke `@theme inline`: tạm thêm `bg-primary text-ink` vào `apps/docs/app/page.tsx`, rebuild → CSS emit `.bg-primary{background-color:var(--p-primary)}` + `.text-ink{color:var(--p-ink)}` (đúng `var()` động). Element thử đã xoá, `page.tsx` restore nguyên trạng.

### Completion Notes List

- Tạo package `@landing/design-tokens` (CSS-only, build no-op) với `src/base.css`: spacing 4/8px grid, type scale fluid, named easing (`--ease-standard/entrance/exit` + durations), radius/hairline floor, palette `--p-*` default = infra mood.
- `@theme inline` map `--color-* → var(--p-*)` — verified runtime-swap-ready (xem Debug Log). Variance chủ đích vs wording epics (`@theme` thường sẽ freeze giá trị).
- Bonus: thêm export `"./themes/*"` trong package.json sẵn cho Story 2.2.
- Wire `apps/docs`: dep `workspace:*` + `@import` sau tailwindcss. Giữ block `@theme inline` placeholder của docs home (khác vai trò, không trùng).
- Dọn `@theme` boilerplate create-turbo (`blue/purple/red-1000`) khỏi `tailwind-config/shared-styles.css` — grep xác nhận 0 chỗ dùng.
- 2 câu hỏi review chọn default: giữ `--p-*` + thang neutral floor (Ternus reconcile ở Epic 3).

### File List

- `packages/design-tokens/package.json` (NEW)
- `packages/design-tokens/src/base.css` (NEW)
- `apps/docs/package.json` (UPDATE — +dep)
- `apps/docs/app/globals.css` (UPDATE — +import)
- `packages/tailwind-config/shared-styles.css` (UPDATE — xoá @theme rác)
