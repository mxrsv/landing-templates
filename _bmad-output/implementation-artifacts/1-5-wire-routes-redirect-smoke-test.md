---
baseline_commit: 102b1056c56907a7ec690dd0f7a24b396241db57
---

# Story 1.5: Wire Routes, Redirect & Smoke Test

Status: review

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

- [x] Task 1 — Đọc Next 16 docs trước khi sửa `next.config.ts` (AC: #4) [AGENTS.md rule]
  - [x] Đọc `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md` — xác nhận API `async redirects()` trả mảng `{ source, destination, permanent }`; `permanent: true` → **308**, KHÔNG phải 301 (Next dùng 307/308 để preserve request method); query tự pass-through (docs §"When a redirect is applied…").
  - [x] Xác nhận `apps/docs/next.config.ts` đã tồn tại (Story 1.3b/1.4 đã viết `transpilePackages` ở đó) — redirect sẽ được **thêm vào (Edit)**, KHÔNG overwrite. Docs ví dụ là `next.config.js`/`module.exports` → dịch sang cấu trúc TS export hiện có.

- [x] Task 2 — Wire route `apps/docs/app/templates/ternus/page.tsx` (AC: #1, #2)
  - [x] Xác nhận file đã được di chuyển từ Story 1.4 (`templates/ternus/` → `packages/templates-ternus/src/`); `page.tsx` import entry Ternus qua `@landing/templates-ternus` (npm name) / alias `@landing/templates/ternus` (tsconfig path) — dùng đúng convention đã chốt ở 1.4, KHÔNG đổi.
  - [x] Đảm bảo `page.tsx` render component Ternus preview đầy đủ (hero, netstrip, ecosystem… theo baseline), `"use client"` nếu cần cho animated pieces.
  - [x] KHÔNG thêm/sửa visual polish (Fuel/Monad bar) — thuộc Epic 3.

- [x] Task 3 — Thêm legacy redirect vào `apps/docs/next.config.ts` (AC: #4)
  - [x] Thêm `async redirects()` (hoặc bổ sung entry nếu đã có) với đúng 1 rule static→static:
    ```ts
    async redirects() {
      return [
        { source: "/ternus", destination: "/templates/ternus", permanent: true },
      ];
    }
    ```
  - [x] KHÔNG dùng `:path*` / `has` / `missing` — source và destination là static, query tự pass-through. Hash là client-side, config không xử lý (browser giữ tự động).
  - [x] Giữ nguyên `transpilePackages` (7 entry từ 1.3b) — không đụng key khác.

- [x] Task 4 — Khai báo Tailwind 4 `@source` trong `apps/docs/app/globals.css` (AC: #3)
  - [x] Thêm đúng dòng:
    ```css
    @source "../../../packages/**/src/**/*.{ts,tsx,css}";
    ```
    Path depth: từ `apps/docs/app/globals.css` → `../` = `apps/docs/`, `../../` = `apps/`, `../../../` = repo root → `packages/**`. Đã verify đúng.
  - [x] Đặt sau `@import "tailwindcss";` (Tailwind 4 CSS-first). KHÔNG xoá `@import` / `@theme` hiện có.

- [x] Task 5 — Smoke test (AC: #2, #3, #4) — chạy TRƯỚC khi xoá `_legacy-src/`
  - [x] `pnpm dev` tại root → ghi lại port thực tế mà dev server in ra (turbo monorepo có thể KHÔNG phải 3000).
  - [x] **Route render**: `curl -sI "http://localhost:<port>/templates/ternus"` → `HTTP/.. 200`; mở browser → không blank, console không error; so sánh visual với baseline `b578a31`.
  - [x] **Redirect + query** (AC #4):
    ```bash
    curl -sI "http://localhost:<port>/ternus"        # → HTTP 308, Location: /templates/ternus
    curl -sI "http://localhost:<port>/ternus?utm=x"  # → HTTP 308, Location: /templates/ternus?utm=x
    ```
    Assert status = 308 và `Location` chứa `/templates/ternus` (+ `?utm=x` ở case 2).
  - [x] **Hash** (client-side, curl KHÔNG thấy được vì `#` không gửi lên server): mở `/ternus#some-section` trong browser → DevTools Network/URL bar xác nhận land tại `/templates/ternus#some-section`. Ghi chú: redirect chỉ preserve query ở server; hash do browser tự giữ.
  - [x] **Tailwind purge check** (AC #3) — dùng _method_, không hardcode class:
    1. `grep -roh 'class[Name]*="[^"]*"' packages/templates-ternus/src/` → chọn 1 utility class CÓ trong `packages/*` nhưng `grep -r "<class>" apps/docs/app/` = 0 (chỉ dùng trong package).
    2. `pnpm build`.
    3. `grep -r "<class>" apps/docs/.next/static/css/` → **có** = `@source` hoạt động (class không bị purge). Nếu trống → `@source` sai, FAIL.

- [x] Task 6 — Build + lint gate (AC: #5, #6)
  - [x] `pnpm build` (root turbo) → exit 0.
  - [x] `pnpm lint` → exit 0.

- [x] Task 7 — Xoá `_legacy-src/` (AC: #7) — **LAST task, CONDITIONAL**
  - [x] CHỈ chạy nếu Task 5 (smoke) + Task 6 (build/lint) đều PASS.
  - [x] `git rm -r _legacy-src/` (hoặc `rm -rf` rồi commit).
  - [x] Nếu BẤT KỲ smoke nào fail → **DỪNG, giữ `_legacy-src/`**, ghi vào Debug Log để rollback. KHÔNG xoá.
  - [x] Sau xoá: chạy lại `pnpm build` exit 0 xác nhận không có dangling reference tới `_legacy-src/`.

- [x] Task 8 — Verify Wave 0 exit gate (Epic 1 close)
  - [x] `pnpm build` xanh ✅
  - [x] `/templates/ternus` render ✅
  - [x] `_legacy-src/` đã xoá ✅
  - [x] `grep -rn "@repo/" .` (trừ `node_modules`) = 0 ✅

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

claude-opus-4-8 (1M context)

### Debug Log References

- **AGENTS.md docs**: `node_modules/next/dist/docs/` KHÔNG tồn tại trong Next 16.2.7 (đã verify ở Story 1.4) → dùng **Context7** (`/vercel/next.js`) thay thế. Xác nhận `permanent: true` → **308**, query pass-through tự động, cú pháp TS `async redirects()` đúng như story.
- **Build**: `pnpm build` (root turbo) → 7/7 task exit 0; `/`, `/_not-found`, `/templates/ternus` prerendered static. (Warning cosmetic: turbo `no output files for @landing/templates-ternus#build` — no-op source build, không block.)
- **Smoke (production `next start` @ port 3137)**:
  - `curl -sI /templates/ternus` → `HTTP/1.1 200 OK` ✅
  - `curl -sI /ternus` → `308 Permanent Redirect`, `location: /templates/ternus` ✅
  - `curl -sI /ternus?utm=x` → `308`, `location: /templates/ternus?utm=x` (query preserved) ✅
- **Tailwind purge (AC #3)**: packages dùng HOÀN TOÀN custom CSS (`ternus.css`, `LogoLoop.css`) — KHÔNG có Tailwind utility class nào. Dùng method sentinel: chèn `tracking-[0.137em]` (arbitrary value, unique) vào `template.tsx`, rebuild → `0.137em` xuất hiện trong `.next/static/chunks/*.css` ✅ → `@source` scan `packages/*` hoạt động. Sentinel đã **revert** (git checkout), template.tsx = HEAD.
- **Lint**: lần đầu FAIL — `LogoLoop.tsx` 2 warning "unused eslint-disable directive" (line 101/135, `--max-warnings 0`). Xoá 2 directive thừa (deps array đã đủ, directive là no-op) → `pnpm lint` exit 0 ✅.
- **CSS bundle path**: Next 16 Turbopack output CSS ở `.next/static/chunks/*.css` (KHÔNG phải `.next/static/css/` như story giả định).
- **Browser render verify (AC #2 — curl không đủ)**: `next dev` @ port 3100 + Playwright load `/templates/ternus`. WebGL pieces (PixelBlast→three/postprocessing, SoftAurora→ogl) chạy trong `useEffect`, prerender bỏ qua → phải load thật mới chắc không blank/throw lúc hydrate. Kết quả: **0 console errors**, DOM = `.tn` root (nav+main+footer), 6 `<section>`, **2 `<canvas>` mount thành công** (WebGL chạy OK), bg dark `rgb(7,7,12)`, 2538 ký tự nội dung (không blank) ✅. Hash redirect kiểm browser: `/ternus#token` → land `/templates/ternus#token` (browser tự giữ `#` qua 308) ✅.

### Completion Notes List

Story hoàn tất 7/7 AC. Là **final story Epic 1 / Wave 0 exit gate**. Deviation & quyết định:

1. **AC #3 purge check — không có Tailwind utility trong packages.** Ternus + ui style bằng custom CSS thuần (`ternus.css`/`LogoLoop.css`), không class Tailwind nào. Không thể "chọn 1 utility class có sẵn trong packages" như story. Thay bằng **sentinel method** (chèn arbitrary class unique → build → grep bundle → revert) — vẫn validate đúng bản chất `@source` (Tailwind có scan packages hay không). Class thật từ Epic 4+ (sections) sẽ tận dụng `@source` này.
2. **CSS bundle ở `.next/static/chunks/` không phải `.next/static/css/`** (Turbopack). Đã grep đúng path.
3. **Lint fix ngoài-spec nhỏ**: xoá 2 `eslint-disable-next-line react-hooks/exhaustive-deps` thừa trong `LogoLoop.tsx` (legacy migrate từ 1.4) để AC #6 (`pnpm lint` exit 0) pass. Directive là no-op (deps đã đủ) → xoá an toàn, không đổi behavior.
4. **Route move**: `apps/docs/app/(demos)/ternus/page.tsx` → `apps/docs/app/templates/ternus/page.tsx` (Story 1.4 để ở `(demos)/ternus`). `/ternus` giờ KHÔNG còn page → redirect 308 xử lý. Dọn dir rỗng `(demos)`.
5. **`_legacy-src/` xoá sạch** (sau smoke pass): `git rm -r` xoá 5 file `_root-config-backup/` + `rm -rf` 2 empty dir sót (`_legacy-src/`, `_legacy-src/lib/` — git không track empty dir). Final `pnpm build` exit 0 xác nhận không dangling ref.
6. **Wave 0 gate `grep @repo/` = 0**: trong **source** (`apps/`+`packages/`) = 0 ✅. 42 match còn lại đều ở `_bmad-output/` planning/story docs (ghi lịch sử rename `@repo→@landing` — documentation, không phải code). Gate thoả về codebase.

Ghi chú: hash (`#`) preservation là client-side, curl không kiểm được — redirect chỉ preserve query ở server, browser tự giữ hash (đã ghi rõ trong story Task 5). **Đã verify trong browser thật** (Playwright): `/ternus#token` → `/templates/ternus#token` ✅, cùng pass AC #2 render (WebGL không crash, không blank, 0 console error).

### File List

**Sửa (source):**

- `apps/docs/next.config.ts` (+`async redirects()` /ternus→/templates/ternus 308)
- `apps/docs/app/globals.css` (+`@source` directive scan packages/\*)
- `packages/ui/src/logo-loop/LogoLoop.tsx` (xoá 2 unused eslint-disable directive)

**Move (git mv):**

- `apps/docs/app/(demos)/ternus/page.tsx` → `apps/docs/app/templates/ternus/page.tsx`

**Xoá:**

- `_legacy-src/` toàn bộ (5 file `_root-config-backup/{eslint.config.mjs,next.config.ts,package.json,postcss.config.mjs,tsconfig.json}` + empty dirs)

## Change Log

| Date       | Version | Description                                                                                 | Author |
| ---------- | ------- | ------------------------------------------------------------------------------------------- | ------ |
| 2026-06-09 | 1.0     | Wire /templates/ternus + redirect 308 + @source; smoke pass; xoá \_legacy-src; Epic 1 close | Amelia |
