# Story 1.5: Wire Routes, Redirect & Smoke Test

Status: ready-for-dev

## Story

As a **builder**,
I want **Ternus preview hoạt động tại `/templates/ternus` với redirect legacy `/ternus`, khai báo Tailwind 4 `@source` cho `packages/*`, rồi smoke test toàn bộ trước khi xoá `_legacy-src/`**,
So that **migration (Story 1.4) không break demo Ternus hiện tại, và Epic 1 đóng đúng exit gate (Wave 0) để mở các wave song song tiếp theo**.

## Acceptance Criteria

1. **Given** migration files hoàn tất (Story 1.4: code đã ở `apps/docs/app/`, `packages/ui/src/*`, `packages/templates-ternus/src/`; imports dùng `@landing/*`; `pnpm --filter docs build` đã exit 0)
   **When** wire `apps/docs/app/templates/ternus/page.tsx` (route render Ternus preview), thêm redirect `/ternus` → `/templates/ternus` trong `apps/docs/next.config.ts` (**preserve query string**; hash do browser tự giữ), và khai báo Tailwind 4 `@source` trong `apps/docs/app/globals.css`:

   ```css
   @source "../../../packages/**/src/**/*.{ts,tsx,css}";
   ```

   **Then** `pnpm dev` tại root serve gallery app (docs app) không crash khi khởi động.

2. **And** mở `/templates/ternus` **render KHÔNG crash** (HTTP 200, không blank page, không runtime error ở console); visual = **pre-migration WIP baseline** (commit `b578a31`). Fuel/Monad north-star bar là **Epic 3 gate** — KHÔNG scope-creep polish visual ở Story này.

3. **And** verify **1 utility class chỉ dùng trong `packages/*`** (không xuất hiện trong `apps/docs/app/**`) render đúng — tức class đó CÓ trong CSS bundle sau build (không bị Tailwind purge nhờ `@source`).

4. **And** `/ternus` và `/ternus?utm=x` redirect **308** (permanent; spec dung sai 308/301) tới `/templates/ternus`, **query được preserve** (`/ternus?utm=x` → `Location: /templates/ternus?utm=x`).

5. **And** `pnpm build` (root turbo) exit 0.

6. **And** `pnpm lint` exit 0.

7. **And** xoá `_legacy-src/` **CHỈ SAU** khi smoke pass (AC #2, #3, #4 đều xanh). Nếu smoke FAIL → **giữ `_legacy-src/`** để rollback, không xoá.

## Tasks / Subtasks

- [ ] Task 1 — Đọc Next 16 docs trước khi sửa `next.config.ts` (AC: #4) [AGENTS.md rule]
  - [ ] Đọc `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md` — xác nhận API `async redirects()` trả mảng `{ source, destination, permanent }`; `permanent: true` → **308**, KHÔNG phải 301 (Next dùng 307/308 để preserve request method); query tự pass-through (docs §"When a redirect is applied…").
  - [ ] Xác nhận `apps/docs/next.config.ts` đã tồn tại (Story 1.3b/1.4 đã viết `transpilePackages` ở đó) — redirect sẽ được **thêm vào (Edit)**, KHÔNG overwrite. Docs ví dụ là `next.config.js`/`module.exports` → dịch sang cấu trúc TS export hiện có.

- [ ] Task 2 — Wire route `apps/docs/app/templates/ternus/page.tsx` (AC: #1, #2)
  - [ ] Xác nhận file đã được di chuyển từ Story 1.4 (`templates/ternus/` → `packages/templates-ternus/src/`); `page.tsx` import entry Ternus qua `@landing/templates-ternus` (npm name) / alias `@landing/templates/ternus` (tsconfig path) — dùng đúng convention đã chốt ở 1.4, KHÔNG đổi.
  - [ ] Đảm bảo `page.tsx` render component Ternus preview đầy đủ (hero, netstrip, ecosystem… theo baseline), `"use client"` nếu cần cho animated pieces.
  - [ ] KHÔNG thêm/sửa visual polish (Fuel/Monad bar) — thuộc Epic 3.

- [ ] Task 3 — Thêm legacy redirect vào `apps/docs/next.config.ts` (AC: #4)
  - [ ] Thêm `async redirects()` (hoặc bổ sung entry nếu đã có) với đúng 1 rule static→static:
    ```ts
    async redirects() {
      return [
        { source: "/ternus", destination: "/templates/ternus", permanent: true },
      ];
    }
    ```
  - [ ] KHÔNG dùng `:path*` / `has` / `missing` — source và destination là static, query tự pass-through. Hash là client-side, config không xử lý (browser giữ tự động).
  - [ ] Giữ nguyên `transpilePackages` (7 entry từ 1.3b) — không đụng key khác.

- [ ] Task 4 — Khai báo Tailwind 4 `@source` trong `apps/docs/app/globals.css` (AC: #3)
  - [ ] Thêm đúng dòng:
    ```css
    @source "../../../packages/**/src/**/*.{ts,tsx,css}";
    ```
    Path depth: từ `apps/docs/app/globals.css` → `../` = `apps/docs/`, `../../` = `apps/`, `../../../` = repo root → `packages/**`. Đã verify đúng.
  - [ ] Đặt sau `@import "tailwindcss";` (Tailwind 4 CSS-first). KHÔNG xoá `@import` / `@theme` hiện có.

- [ ] Task 5 — Smoke test (AC: #2, #3, #4) — chạy TRƯỚC khi xoá `_legacy-src/`
  - [ ] `pnpm dev` tại root → ghi lại port thực tế mà dev server in ra (turbo monorepo có thể KHÔNG phải 3000).
  - [ ] **Route render**: `curl -sI "http://localhost:<port>/templates/ternus"` → `HTTP/.. 200`; mở browser → không blank, console không error; so sánh visual với baseline `b578a31`.
  - [ ] **Redirect + query** (AC #4):
    ```bash
    curl -sI "http://localhost:<port>/ternus"        # → HTTP 308, Location: /templates/ternus
    curl -sI "http://localhost:<port>/ternus?utm=x"  # → HTTP 308, Location: /templates/ternus?utm=x
    ```
    Assert status = 308 và `Location` chứa `/templates/ternus` (+ `?utm=x` ở case 2).
  - [ ] **Hash** (client-side, curl KHÔNG thấy được vì `#` không gửi lên server): mở `/ternus#some-section` trong browser → DevTools Network/URL bar xác nhận land tại `/templates/ternus#some-section`. Ghi chú: redirect chỉ preserve query ở server; hash do browser tự giữ.
  - [ ] **Tailwind purge check** (AC #3) — dùng _method_, không hardcode class:
    1. `grep -roh 'class[Name]*="[^"]*"' packages/templates-ternus/src/` → chọn 1 utility class CÓ trong `packages/*` nhưng `grep -r "<class>" apps/docs/app/` = 0 (chỉ dùng trong package).
    2. `pnpm build`.
    3. `grep -r "<class>" apps/docs/.next/static/css/` → **có** = `@source` hoạt động (class không bị purge). Nếu trống → `@source` sai, FAIL.

- [ ] Task 6 — Build + lint gate (AC: #5, #6)
  - [ ] `pnpm build` (root turbo) → exit 0.
  - [ ] `pnpm lint` → exit 0.

- [ ] Task 7 — Xoá `_legacy-src/` (AC: #7) — **LAST task, CONDITIONAL**
  - [ ] CHỈ chạy nếu Task 5 (smoke) + Task 6 (build/lint) đều PASS.
  - [ ] `git rm -r _legacy-src/` (hoặc `rm -rf` rồi commit).
  - [ ] Nếu BẤT KỲ smoke nào fail → **DỪNG, giữ `_legacy-src/`**, ghi vào Debug Log để rollback. KHÔNG xoá.
  - [ ] Sau xoá: chạy lại `pnpm build` exit 0 xác nhận không có dangling reference tới `_legacy-src/`.

- [ ] Task 8 — Verify Wave 0 exit gate (Epic 1 close)
  - [ ] `pnpm build` xanh ✅
  - [ ] `/templates/ternus` render ✅
  - [ ] `_legacy-src/` đã xoá ✅
  - [ ] `grep -rn "@repo/" .` (trừ `node_modules`) = 0 ✅

## Dev Notes

### Predecessor chain (Epic 1)

1.1 Gate-0 snapshot → 1.2 pnpm/Turbo scaffold → 1.3 rename `@repo/*`→`@landing/*` → 1.3b scaffold empty packages (7 entry `transpilePackages`) → 1.4 migrate `_legacy-src/` → packages → **1.5 (this) wire + redirect + smoke + delete `_legacy-src/`**. Story này là **final story Epic 1** và là **Wave 0 exit gate**.

### Redirect: 308 không phải 301 (đọc kỹ)

- `permanent: true` trong `redirects()` → status **308**. Spec ghi "308/301" là dung sai; implementation thực tế dùng `permanent: true` → **mong đợi 308**. KHÔNG xuất hiện 301/302 trừ khi dùng `statusCode` tường minh (đừng dùng).
- Lý do Next dùng 307/308: preserve request method (301/302 nhiều browser đổi method về GET). [Source: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md` §"Why does Next.js use 307 and 308?"]
- Query pass-through tự động: `/ternus?utm=x` → `/templates/ternus?utm=x`. KHÔNG cần `:path*` hay named param vì source/destination static. [Source: same doc, §"When a redirect is applied…" L43–55]
- Hash (`#`) là client-side, KHÔNG gửi lên server → config không (và không thể) xử lý; browser tự giữ hash qua redirect.

### `next.config.ts` là file ĐÃ TỒN TẠI (Edit, không overwrite)

- Story 1.3b/1.4 đã viết `transpilePackages` (7 entry) trong `apps/docs/next.config.ts`. Task 3 **thêm** `async redirects()` vào object config hiện có, giữ nguyên các key khác. Docs Next dùng cú pháp `next.config.js`/`module.exports` — dịch sang `export default`/TS object đang dùng.

### Tailwind 4 `@source` — chống purge cho `packages/*`

- Tailwind 4 CSS-first: `@import "tailwindcss"` + `@source` scan thêm path ngoài app để class chỉ dùng trong `packages/*` không bị purge. [Source: `_bmad-output/planning-artifacts/architecture.md#L130` — "@source directive scan classes từ workspace packages"; `#L155` — "Tailwind 4 token sharing qua @source + @theme"]
- Path `../../../packages/**/src/**/*.{ts,tsx,css}` tính từ `apps/docs/app/globals.css` → root → `packages/`. Verify method ở Task 5 (build rồi grep `.next/static/css`).

### Project Structure Notes

- Route preservation là yêu cầu cứng: migration KHÔNG được mất route `/templates/ternus`. [Source: `architecture.md#L55`, `#L262`]
- Route convention: `/templates/{slug}` mở template; legacy `/ternus` → redirect `/templates/ternus`. [Source: `architecture.md#L208`, `#L210`, `#L262`]
- Files kebab-case (`ternus-hero.tsx`), export PascalCase (`TernusHero`); alias tsconfig `@landing/templates/ternus` → `packages/templates-ternus/src` (khác npm name `@landing/templates-ternus`). [Source: `architecture.md#L238`, `#L258`, `#L260`]
- Visual baseline = WIP commit `b578a31` (pre-migration). v20 port plan tham khảo: `docs/plans/2026-06-07-ternus-v20-port.md`. KHÔNG đụng Fuel/Monad bar (Epic 3).
- `_legacy-src/` xoá là task CUỐI và CÓ ĐIỀU KIỆN — nếu smoke fail thì giữ để rollback. [Source: `epics.md#L73`, `#L282`]

### Verify commands (tổng hợp)

```bash
# Đọc docs trước (AGENTS.md):
#   node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md

pnpm dev                                              # ghi PORT thực tế dev server in ra

curl -sI "http://localhost:<port>/templates/ternus"  # HTTP 200, không blank
curl -sI "http://localhost:<port>/ternus"            # HTTP 308, Location: /templates/ternus
curl -sI "http://localhost:<port>/ternus?utm=x"      # HTTP 308, Location: /templates/ternus?utm=x
# Hash: chỉ browser — mở /ternus#sec → land /templates/ternus#sec (curl không thấy #)

# Tailwind purge: chọn class chỉ có trong packages/*, build, rồi grep css bundle
pnpm build
grep -r "<class-chi-co-trong-packages>" apps/docs/.next/static/css/   # phải CÓ

pnpm build      # root turbo, exit 0
pnpm lint       # exit 0

# Chỉ sau khi tất cả pass:
git rm -r _legacy-src/
pnpm build                          # exit 0, không dangling ref
grep -rn "@repo/" . --exclude-dir=node_modules   # = 0 (Wave 0 gate)
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md#story-1.5` (L261–282) — AC nguyên văn: wire `page.tsx`, redirect `/ternus`→`/templates/ternus` preserve query+hash, `@source` directive, `pnpm dev`/`build`/`lint`, render không crash = baseline, purge check, xoá `_legacy-src/` chỉ sau smoke pass]
- [Source: `_bmad-output/planning-artifacts/epics.md#story-1.4` (L242–259) — predecessor: migration map, `pnpm --filter docs build` exit 0 là điều kiện vào 1.5; partial pass = block]
- [Source: `_bmad-output/planning-artifacts/parallel-dev-strategy.md#5` (L207–208) — Wave 0 exit gate: `pnpm build` xanh + `/templates/ternus` render + `_legacy-src/` xoá + `grep "@repo/"` = 0]
- [Source: `_bmad-output/planning-artifacts/architecture.md#L130,#L155,#L208,#L210,#L262` — Tailwind 4 `@source`/`@theme`, legacy redirect `/ternus`→`/templates/ternus` qua `next.config`, route convention `/templates/{slug}`]
- [Source: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md` — `async redirects()` API, `permanent: true`→308, query pass-through tự động]
- [Source: `AGENTS.md` — đọc `node_modules/next/dist/docs/` trước khi sửa Next config (redirects API có thể khác training data)]
- [Source: `docs/plans/2026-06-07-ternus-v20-port.md` — v20 port plan, visual baseline reference cho `/templates/ternus`]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
