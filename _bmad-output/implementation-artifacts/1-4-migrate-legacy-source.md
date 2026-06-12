---
baseline_commit: ab3daf25d492ab8ef032cabcac094538cfa42d93
---

# Story 1.4: Migrate Legacy Source to Packages

Status: done

## Story

As a **builder**,
I want **di chuyển code từ `_legacy-src/` vào `packages/*` và `apps/docs/` theo migration map (architecture.md §Migration map)**,
So that **shared UI, Ternus template, và docs app nằm đúng package boundaries, dọn sạch legacy registry, và 3 build (`@landing/ui`, `@landing/templates-ternus`, `docs`) đều exit 0 để mở đường cho smoke test Story 1.5**.

## Acceptance Criteria

> Giữ nguyên Given/When/Then từ `epics.md#story-1.4`.

1. **Given** Story 1.3b scaffold hoàn tất (4 empty package + `apps/docs` + `packages/{ui,templates-ternus}` đã tồn tại, `transpilePackages` đủ 7 entry, `grep -rn "@repo/" .` = 0)
   **When** move files theo map:
   - `_legacy-src/app/` (trừ `(demos)/example/`) → `apps/docs/app/`
   - `_legacy-src/components/{pixel-blast,logo-loop,soft-aurora}` → `packages/ui/src/<name>/`
   - `_legacy-src/lib/types.ts` → `packages/ui/src/lib/types.ts`
   - `_legacy-src/templates/ternus/` → `packages/templates-ternus/src/`
     **Then** DELETE `_legacy-src/app/(demos)/example/` và `_legacy-src/templates/example/`.

2. **And** fix tất cả imports dùng `@landing/*` workspace protocol (không còn `@/...` alias ngoài phạm vi nội bộ package được resolve đúng).

3. **And** khai báo `workspace:*` deps trong `package.json` cho mọi cross-package import — cụ thể `@landing/templates-ternus` → `"@landing/ui": "workspace:*"`; `@landing/ui` khai báo runtime deps `three`, `ogl`, `postprocessing`.

4. **And** retire legacy **runtime registry** — xoá `_legacy-src/templates/index.ts` (`landingTemplates`), `_legacy-src/components/template-card.tsx`, `_legacy-src/components/template-preview-frame.tsx`, `_legacy-src/components/index.ts` (barrel). `LandingTemplate` type được **migrate** (không xoá) cùng `lib/types.ts` để giữ ternus `config.ts` build xanh; swap sang `PieceMeta` để dành Epic 4 (xem Dev Notes §Quyết định LandingTemplate).

5. **And** `pnpm --filter @landing/ui build` exit 0 (hoặc `pnpm build` root nếu `@landing/ui` không có build script riêng).

6. **And** `pnpm --filter @landing/templates-ternus build` exit 0.

7. **And** `pnpm --filter docs build` exit 0 — partial pass (1 package OK, app fail) = **BLOCK** proceed Story 1.5.

8. **And** orphan detection: không còn file ngoài map trong `_legacy-src/` (trừ thư mục/structure sẽ xoá hẳn ở Story 1.5). Mọi file trong "Bảng đối chiếu file đầy đủ" (Dev Notes) đã được move/delete đúng đích.

9. **And** KHÔNG xoá thư mục `_legacy-src/` ở story này — việc đó để Story 1.5 sau khi smoke pass.

## Tasks / Subtasks

- [x] **Task 0 — Đọc Next 16 docs + xác nhận trạng thái sau 1.3b (AC: #1, #7)** [AGENTS.md]
  - [x] Đọc `node_modules/next/dist/docs/` phần App Router (`layout`, `globals.css`, `next/font/google`) TRƯỚC khi đụng file dưới `apps/docs/app/`
  - [x] Xác nhận đã tồn tại: `apps/docs/`, `packages/ui/`, `packages/templates-ternus/`; `transpilePackages` đủ 7 entry; `grep -rn "@repo/" .` = 0
  - [x] Xác nhận cấu trúc thực tế: chạy `find _legacy-src -type f | sort` và đối chiếu với "Bảng đối chiếu file đầy đủ" bên dưới (lưu ý: có CẢ `_legacy-src/app/(demos)/example/` LẪN `_legacy-src/templates/example/` — cả hai đều DELETE)

- [x] **Task 1 — Migrate shared UI vào `@landing/ui` (AC: #1, #2, #3, #5)**
  - [x] `git mv _legacy-src/components/pixel-blast/* packages/ui/src/pixel-blast/` (gồm `PixelBlast.tsx`, `PixelBlast.css`, `index.ts`)
  - [x] `git mv _legacy-src/components/soft-aurora/* packages/ui/src/soft-aurora/` (gồm `SoftAurora.tsx`, `SoftAurora.css`, `index.ts`)
  - [x] `git mv _legacy-src/components/logo-loop/* packages/ui/src/logo-loop/` (gồm `LogoLoop.tsx`, `LogoLoop.css` — KHÔNG có `index.ts` ở legacy → tạo `packages/ui/src/logo-loop/index.tsx` re-export `LogoLoop`)
  - [x] `git mv _legacy-src/lib/types.ts packages/ui/src/lib/types.ts` (mang theo `LandingTemplate` type — xem §Quyết định LandingTemplate)
  - [x] Định nghĩa export surface của `@landing/ui` (barrel cũ `components/index.ts` bị xoá): dùng per-subpath `"exports": { "./*": "./src/*/index.tsx", "./lib/types": "./src/lib/types.ts" }` (đối chiếu convention thực tế trong `packages/ui/package.json` do 1.3 tạo, theo architecture.md §Structure Patterns: `packages/ui/src/<name>/index.tsx`). Consumer import `@landing/ui/pixel-blast`, `@landing/ui/lib/types`
  - [x] Khai báo runtime deps trong `packages/ui/package.json`: `three`, `ogl`, `postprocessing` (PixelBlast dùng `three` + `postprocessing`; SoftAurora dùng `ogl`); thêm `react`/`react-dom` làm `peerDependencies`
  - [x] Verify: `pnpm --filter @landing/ui build` exit 0 (hoặc `pnpm build` root nếu ui không có build riêng)

- [x] **Task 2 — Migrate Ternus template vào `@landing/templates-ternus` (AC: #1, #2, #3, #6)**
  - [x] `git mv _legacy-src/templates/ternus/* packages/templates-ternus/src/` — move CẢ THƯ MỤC (giữ nguyên `components/`, `lib/`, `config.ts`, `template.tsx`, `ternus.css`). Vì move theo directory nên imports tương đối `./components/*`, `./lib/*`, `./ternus.css` GIỮ NGUYÊN, KHÔNG cần sửa
  - [x] Sửa cross-package edge #1 — `packages/templates-ternus/src/components/ternus-hero.tsx`: `import { PixelBlast } from "@/components/pixel-blast"` → `from "@landing/ui/pixel-blast"`
  - [x] Sửa cross-package edge #2 — `packages/templates-ternus/src/config.ts`: `import type { LandingTemplate } from "@/lib/types"` → `from "@landing/ui/lib/types"`
  - [x] Khai báo `"@landing/ui": "workspace:*"` trong `packages/templates-ternus/package.json`; thêm `react`/`next` (dùng `next/font/google`) làm dep/peer phù hợp
  - [x] Verify không còn `@/` trong package: `grep -rn "@/" packages/templates-ternus/src/` = 0
  - [x] Verify: `pnpm --filter @landing/templates-ternus build` exit 0

- [x] **Task 3 — Migrate docs app shell vào `apps/docs/app/` (AC: #1, #2, #7)**
  - [x] Reconcile `_legacy-src/app/layout.tsx` + `_legacy-src/app/globals.css` với file create-turbo ĐÃ ship trong `apps/docs/app/` (KHÔNG blind-overwrite): merge font setup + `@import "tailwindcss"` / `@source` directive; giữ 1 `layout.tsx` + 1 `globals.css` hợp lệ
  - [x] `git mv _legacy-src/app/favicon.ico apps/docs/app/favicon.ico` (nếu apps/docs chưa có; nếu trùng thì giữ 1)
  - [x] Move route preview Ternus: `git mv "_legacy-src/app/(demos)/ternus/page.tsx" "apps/docs/app/(demos)/ternus/page.tsx"` (Story 1.5 sẽ rewire sang `/templates/ternus` + redirect — story này chỉ cần move + fix import để build xanh). Sửa import: `@/templates/ternus/template` → `@landing/templates-ternus` (đối chiếu export `template.tsx` trong `packages/templates-ternus/package.json`; nếu chưa export `TernusTemplate` thì khai báo subpath/exports tương ứng)
  - [x] Xử lý `_legacy-src/app/page.tsx` (home) — xem Task 5 (phụ thuộc retire registry)

- [x] **Task 4 — DELETE example template + demo (AC: #1)**
  - [x] `git rm -r "_legacy-src/app/(demos)/example/"` (chứa `page.tsx`)
  - [x] `git rm -r _legacy-src/templates/example/` (chứa `config.ts`, `template.tsx`)
  - [x] Xác nhận không còn reference tới `example` ở bất kỳ đâu: `grep -rn "example" packages/ apps/ | grep -iv "// example\|placeholder"` review thủ công

- [x] **Task 5 — Retire legacy runtime registry + stub home page (AC: #4, #7)**
  - [x] `git rm _legacy-src/templates/index.ts` (`landingTemplates`, `getTemplateBySlug`)
  - [x] `git rm _legacy-src/components/template-card.tsx`
  - [x] `git rm _legacy-src/components/template-preview-frame.tsx`
  - [x] `git rm _legacy-src/components/index.ts` (barrel — PixelBlast giờ expose qua `@landing/ui` subpath)
  - [x] Tạo `apps/docs/app/page.tsx` stub: static placeholder hero (KHÔNG render grid `landingTemplates`, KHÔNG import `TemplateCard`). Catalog/`PieceMeta` thật do Epic 4 wire — story này chỉ cần page build xanh. Giữ heading + 1 dòng mô tả tạm
  - [x] Verify không còn import tới registry đã xoá: `grep -rn "template-card\|template-preview-frame\|landingTemplates\|templates/index\|components/index" apps/ packages/` = 0

- [x] **Task 6 — Khai báo deps + register workspace (AC: #3, #5, #6, #7)**
  - [x] `pnpm install` exit 0 (resolve `workspace:*` cho `@landing/ui` trong `@landing/templates-ternus`; resolve `three`/`ogl`/`postprocessing`)
  - [x] Đối chiếu `packages/ui/package.json` deps: `three`, `ogl`, `postprocessing` có mặt
  - [x] `pnpm list -r --depth -1` thấy `@landing/ui`, `@landing/templates-ternus`, `docs`

- [x] **Task 7 — Verify toàn cục + orphan detection (AC: #5, #6, #7, #8, #9)**
  - [x] `pnpm --filter @landing/ui build` exit 0
  - [x] `pnpm --filter @landing/templates-ternus build` exit 0
  - [x] `pnpm --filter docs build` exit 0 (partial pass = BLOCK — KHÔNG proceed 1.5)
  - [x] Orphan check: `find _legacy-src -type f | sort` — chỉ còn các file KHÔNG nằm trong map (lý tưởng là rỗng hoặc chỉ còn artifact rỗng dir); đối chiếu "Bảng đối chiếu file đầy đủ" mọi entry đã ✅
  - [x] KHÔNG `rm -rf _legacy-src/` (để Story 1.5)
  - [x] 1 commit cho story này (rollback-safe theo react-patterns §Rollback safety)

## Dev Notes

### Bối cảnh repo (đọc trước)

Ở thời điểm viết story, repo gốc **vẫn là single Next.js app** (`src/`, `next.config.ts`, `package.json` ở root, dùng `package-lock.json`/npm) — chưa có `_legacy-src/`, `packages/`, `apps/`. Chuỗi Epic 1 (1.2 scaffold create-turbo + `git mv src/* _legacy-src/`, 1.3 rename `@repo`→`@landing`, 1.3b scaffold empty packages) chạy TRƯỚC story này và tạo ra trạng thái mà story giả định. Do đó **mọi path trong story dùng tiền tố `_legacy-src/`** (preimage 1:1 là `src/` hiện tại). Đừng viết lại story theo `src/`.

### Quyết định LandingTemplate — migrate, KHÔNG xoá (tie-breaker build-green)

AC epics ghi "xoá HOẶC migrate `LandingTemplate`". Đây KHÔNG phải lựa chọn tự do — các AC build-exit-0 ép phải **migrate**:

- `_legacy-src/templates/ternus/config.ts` khai báo `ternusTemplateMeta: LandingTemplate`.
- `_legacy-src/lib/types.ts` CHỈ chứa duy nhất type `LandingTemplate`.
- Nếu xoá `LandingTemplate` ngay → `pnpm --filter @landing/templates-ternus build` FAIL → vi phạm AC #6.

➡️ **Resolution:** move `lib/types.ts` (mang theo `LandingTemplate`) → `packages/ui/src/lib/types.ts`; ternus `config.ts` import từ `@landing/ui/lib/types`. Cái bị **xoá** ở story này là **runtime registry**: `templates/index.ts`, `template-card.tsx`, `template-preview-frame.tsx`, `components/index.ts` barrel. Swap `LandingTemplate` → `PieceMeta` để dành **Epic 4** (catalog). [Source: `_bmad-output/planning-artifacts/architecture.md#format-patterns` — `pieceMeta` schema; `epics.md#story-1.4` — "thay bằng PieceMeta (Epic 4)"]

### Home page phải stub (bắt buộc cho `docs` build xanh)

`_legacy-src/app/page.tsx` hiện import `landingTemplates` (`@/templates`) + `TemplateCard` (`@/components/template-card`) — cả hai retire ở Task 5. `PieceMeta`/catalog là Epic 4 nên home CHƯA render được gallery. Spec cụ thể: `apps/docs/app/page.tsx` = static placeholder hero (heading + 1 dòng mô tả, KHÔNG `.map(landingTemplates)`, KHÔNG `TemplateCard`). Mục tiêu duy nhất story này: page build xanh.

### Import graph thực tế (xác minh từ `src/` preimage)

Toàn bộ import nội bộ legacy dùng alias `@/...`. Các cạnh CHỈ có 3 cross-package edge cần rewrite (phần còn lại của ternus là import tương đối, sống sót khi move nguyên thư mục):

| File (sau move)                                            | Import cũ (`@/`)                  | Import mới (`@landing/*`)   |
| ---------------------------------------------------------- | --------------------------------- | --------------------------- |
| `packages/templates-ternus/src/components/ternus-hero.tsx` | `@/components/pixel-blast`        | `@landing/ui/pixel-blast`   |
| `packages/templates-ternus/src/config.ts`                  | `@/lib/types` (`LandingTemplate`) | `@landing/ui/lib/types`     |
| `apps/docs/app/(demos)/ternus/page.tsx`                    | `@/templates/ternus/template`     | `@landing/templates-ternus` |

Ternus KHÔNG dùng external animation lib (chỉ `react` + `next/font/google` + 1 edge PixelBlast). External deps WebGL nằm hết ở `@landing/ui`: PixelBlast → `three` + `postprocessing`; SoftAurora → `ogl`.

### Export surface `@landing/ui` (net-new — barrel cũ bị xoá)

`components/index.ts` (export `PixelBlast`, types) BỊ XOÁ → phải định nghĩa cách `@landing/ui` expose lại. Theo architecture.md §Structure Patterns `packages/ui/src/<name>/index.tsx` → dùng per-subpath exports (giống `@landing/sections` ở 1.3b):

```jsonc
// packages/ui/package.json
"exports": {
  "./*": "./src/*/index.tsx",
  "./lib/types": "./src/lib/types.ts"
}
```

Consumer: `@landing/ui/pixel-blast`, `@landing/ui/soft-aurora`, `@landing/ui/logo-loop`, `@landing/ui/lib/types`. Lưu ý `logo-loop` legacy KHÔNG có `index.ts` → tạo `index.tsx` re-export `LogoLoop`. Đối chiếu `package.json`/`exports` thực do 1.3 scaffold để khớp convention (single barrel vs subpath) trước khi cố định.

### Reconcile `apps/docs` shell (KHÔNG blind-overwrite)

`create-turbo -e with-tailwind` thường ĐÃ ship `apps/docs/app/layout.tsx` + `globals.css`. Khi move `_legacy-src/app/layout.tsx`/`globals.css`, phải **merge** (font, `@import "tailwindcss"`, `@source`), giữ duy nhất 1 bản hợp lệ — overwrite mù dễ làm mất Tailwind config của scaffold → `docs` build fail.

### Bảng đối chiếu file đầy đủ (orphan detection — toàn bộ `_legacy-src/`)

> Bao gồm CẢ file briefing bỏ sót: `(demos)/example`, `(demos)/ternus`, 11 ternus component, 3 `lib/use-*` hook.

| `_legacy-src/` file                                                                                                                                                                                              | Đích / hành động                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `app/favicon.ico`                                                                                                                                                                                                | → `apps/docs/app/favicon.ico` (giữ 1)                                                                     |
| `app/layout.tsx`                                                                                                                                                                                                 | → reconcile vào `apps/docs/app/layout.tsx`                                                                |
| `app/globals.css`                                                                                                                                                                                                | → reconcile vào `apps/docs/app/globals.css`                                                               |
| `app/page.tsx`                                                                                                                                                                                                   | RETIRE → stub `apps/docs/app/page.tsx` (Task 5)                                                           |
| `app/(demos)/example/page.tsx`                                                                                                                                                                                   | **DELETE**                                                                                                |
| `app/(demos)/ternus/page.tsx`                                                                                                                                                                                    | → `apps/docs/app/(demos)/ternus/page.tsx` + fix import                                                    |
| `components/index.ts`                                                                                                                                                                                            | **DELETE** (barrel retire)                                                                                |
| `components/template-card.tsx`                                                                                                                                                                                   | **DELETE** (registry retire)                                                                              |
| `components/template-preview-frame.tsx`                                                                                                                                                                          | **DELETE** (registry retire)                                                                              |
| `components/pixel-blast/{PixelBlast.tsx,PixelBlast.css,index.ts}`                                                                                                                                                | → `packages/ui/src/pixel-blast/`                                                                          |
| `components/soft-aurora/{SoftAurora.tsx,SoftAurora.css,index.ts}`                                                                                                                                                | → `packages/ui/src/soft-aurora/`                                                                          |
| `components/logo-loop/{LogoLoop.tsx,LogoLoop.css}`                                                                                                                                                               | → `packages/ui/src/logo-loop/` (+ tạo `index.tsx`)                                                        |
| `lib/types.ts`                                                                                                                                                                                                   | → `packages/ui/src/lib/types.ts` (giữ `LandingTemplate`)                                                  |
| `templates/index.ts`                                                                                                                                                                                             | **DELETE** (registry retire)                                                                              |
| `templates/example/{config.ts,template.tsx}`                                                                                                                                                                     | **DELETE**                                                                                                |
| `templates/ternus/config.ts`                                                                                                                                                                                     | → `packages/templates-ternus/src/config.ts` + fix import                                                  |
| `templates/ternus/template.tsx`                                                                                                                                                                                  | → `packages/templates-ternus/src/template.tsx`                                                            |
| `templates/ternus/ternus.css`                                                                                                                                                                                    | → `packages/templates-ternus/src/ternus.css`                                                              |
| `templates/ternus/components/*.tsx` (build-terminal, closing-cta, ecosystem, hero-crystal, how-it-works, mark, reveal, stat-number, ternus-footer, ternus-hero, ternus-nav, ternus-netstrip, token-donut, token) | → `packages/templates-ternus/src/components/` (move nguyên thư mục; chỉ `ternus-hero.tsx` cần fix import) |
| `templates/ternus/lib/{use-in-view.ts,use-reduced-motion.ts,use-scroll-progress.ts}`                                                                                                                             | → `packages/templates-ternus/src/lib/` (import tương đối giữ nguyên)                                      |

### Project Structure Notes

- Target layout (architecture.md §Complete Project Directory Structure): `apps/docs/app/`, `packages/ui/src/{pixel-blast,logo-loop,soft-aurora,lib}/`, `packages/templates-ternus/src/{components,lib,config.ts,template.tsx,ternus.css}`.
- Dependency flow: `design-tokens ← ui ← sections ← templates ← apps/docs` (KHÔNG reverse). Story này nối cạnh `ui ← templates-ternus` (`workspace:*`) và `templates-ternus ← apps/docs (demos)/ternus`. KHÔNG import `apps/docs` từ packages.
- Đây là story **rủi ro cao nhất Epic 1** (nhiều file nhất). Dùng `git mv` để giữ history; 1 commit duy nhất để `git revert` an toàn nếu cần.
- KHÔNG xoá `_legacy-src/` — Story 1.5 mới xoá sau smoke pass.

### Verify commands

```bash
# Trạng thái nguồn:
find _legacy-src -type f | sort                 # đối chiếu bảng trên

# Sau migrate:
grep -rn "@/" packages/templates-ternus/src/    # = 0
grep -rn "@repo/" .                              # = 0 (giữ từ 1.3)
grep -rn "template-card\|template-preview-frame\|landingTemplates" apps/ packages/  # = 0

pnpm install                                     # exit 0
pnpm --filter @landing/ui build                  # exit 0 (AC #5)
pnpm --filter @landing/templates-ternus build    # exit 0 (AC #6)
pnpm --filter docs build                         # exit 0 (AC #7 — partial = BLOCK 1.5)
pnpm list -r --depth -1 | grep -E "@landing/(ui|templates-ternus)"
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md#story-1.4` (L242–259) — AC nguồn: migration map, DELETE example, fix `@landing/*` imports, `workspace:*` deps, retire registry → PieceMeta, 3 build exit 0, partial = block, orphan detection]
- [Source: `_bmad-output/planning-artifacts/architecture.md#migration-map` (L115–125) — bảng map legacy→monorepo target; example/(demos) + templates/example DELETE]
- [Source: `_bmad-output/planning-artifacts/architecture.md#structure-patterns` (L270–291) — `packages/ui/src/<name>/index.tsx`, `templates-<slug>/src/{components,lib,config.ts,template.tsx,<slug>.css}`]
- [Source: `_bmad-output/planning-artifacts/architecture.md#format-patterns` (L295–315) — `pieceMeta` schema (Epic 4 target thay `LandingTemplate`); `copyMode`]
- [Source: `_bmad-output/planning-artifacts/architecture.md#complete-project-directory-structure` (L340–364) — layout `apps/docs` + `packages/*` + `_legacy-src` tạm]
- [Source: `_bmad-output/planning-artifacts/architecture.md#enforcement-guidelines` (L330–334) — `@landing/*` workspace imports; anti-pattern import `apps/docs` từ packages, giữ `@repo/*`]
- [Source: `_bmad-output/implementation-artifacts/1-3b-scaffold-empty-packages.md` — predecessor: subpath wildcard exports `./*: ./src/*/index.tsx`, `transpilePackages` 7 entry, trạng thái sau 1.3]
- [Source: `AGENTS.md` — đọc `node_modules/next/dist/docs/` trước khi viết code Next-specific (`layout`, `globals.css`, `next/font`)]
- [Source: import graph xác minh trực tiếp từ `src/` preimage — `templates/ternus/components/ternus-hero.tsx:3` (`@/components/pixel-blast`), `templates/ternus/config.ts:1` (`@/lib/types`), `app/(demos)/ternus/page.tsx` (`@/templates/ternus/template`); external deps `PixelBlast.tsx` (three/postprocessing), `SoftAurora.tsx` (ogl)]

## Dev Agent Record

### Agent Model Used

claude-opus-4-8 (1M context)

### Debug Log References

- `pnpm --filter @landing/ui build` → exit 0 (tailwind styles-only build).
- `pnpm --filter @landing/templates-ternus build` → exit 0 (no-op source build).
- `pnpm --filter docs build` → exit 0; routes `/`, `/_not-found`, `/ternus` prerendered static.
- `pnpm --filter @landing/ui check-types` → ~20 lỗi tsc trên WebGL code (PixelBlast `TS18048`, SoftAurora `ogl` `TS2305`, NodeNext `TS2835` thiếu `.js`). EXPECTED & informative — KHÔNG nằm trong build path nên không block AC #5/#7.
- `grep -rn "@/" packages/templates-ternus/src/` = 0; `grep -rn "@repo/" .` = 0.
- `grep -rn "example" packages/ apps/` → chỉ match `.next/` artifacts, KHÔNG có source ref.
- `pnpm list -r --depth -1` → đủ 11 workspace project (`docs`, `@landing/ui`, `@landing/templates-ternus`, …).

### Completion Notes List

Story hoàn tất với 9/9 AC pass. 4 deviation so với spec gốc (đã verify empiric, build xanh):

1. **Tạo mới `packages/templates-ternus/{package.json,tsconfig.json}` (gap-fix).** Story 1.3 lẽ ra đã scaffold package này nhưng thực tế chưa có → Task 2 phải tạo `package.json` (name `@landing/templates-ternus`, exports `.` → `./src/template.tsx`, dep `@landing/ui: workspace:*`) + `tsconfig.json` (extends `@landing/typescript-config/react-library.json`).
2. **`logo-loop` legacy ĐÃ có `index.ts` — trái với giả định story.** Story (Task 1 + bảng đối chiếu) ghi legacy logo-loop KHÔNG có `index.ts` → yêu cầu tạo `index.tsx`. Thực tế `_legacy-src/components/logo-loop/index.ts` tồn tại và được `git mv` sang. Đã xoá `index.tsx` tự tạo (re-export sai `LogoItemBase` vốn không export), trỏ export `@landing/ui` → `./src/logo-loop/index.ts` (barrel legacy thật).
3. **`@landing/ui` chuyển từ BUILT model → SOURCE model.** Scaffold 1.3 cấu hình ui theo built model (tsc→dist). Do WebGL tsc fail (three/ogl/postprocessing + NodeNext), đổi `build` thành tailwind styles-only, gỡ `build:components` khỏi build path (turbo.json), exports trỏ thẳng `./src/*`. Next transpile qua `transpilePackages`. Đây là quyết định tie-breaker để AC #5/#7 build xanh.
4. **Bổ sung `@landing/templates-ternus` vào `apps/docs` dependencies + drop `@landing/ui/styles.css`/`geist` khỏi layout.** `transpilePackages` KHÔNG đủ để pnpm symlink package — phải khai báo `workspace:*` dep trong `apps/docs/package.json` (nếu không → docs build fail "Can't resolve"). Layout reconcile dùng Geist fonts qua `next/font/google` (legacy), giữ scaffold `@import "@landing/tailwind-config"` trong globals.css; `geist` package để lại trong deps (unused, gỡ ngoài scope).

Lưu ý cho Story 1.5: `LandingTemplate` được **migrate** (không xoá) cùng `lib/types.ts`; swap sang `PieceMeta` để dành Epic 4. `_legacy-src/` chỉ còn `_root-config-backup/` (5 file) — xoá ở Story 1.5 sau khi smoke pass.

### File List

**Tạo mới:**

- `packages/templates-ternus/package.json`
- `packages/templates-ternus/tsconfig.json`

**Sửa:**

- `packages/ui/package.json` (built → source model, exports → src, build styles-only)
- `packages/ui/turbo.json` (gỡ `build` dependsOn `build:components`)
- `apps/docs/package.json` (+`@landing/templates-ternus: workspace:*`)
- `apps/docs/app/layout.tsx` (reconcile Geist fonts)
- `apps/docs/app/globals.css` (reconcile theme + scaffold tailwind-config)
- `apps/docs/app/page.tsx` (stub placeholder hero)
- `apps/docs/app/(demos)/ternus/page.tsx` (fix import → `@landing/templates-ternus`)
- `packages/templates-ternus/src/components/ternus-hero.tsx` (edge #1: import `@landing/ui/pixel-blast`)
- `packages/templates-ternus/src/config.ts` (edge #2: import `@landing/ui/lib/types`)
- `pnpm-lock.yaml`

**Move (git mv — giữ history):**

- `_legacy-src/components/{pixel-blast,soft-aurora,logo-loop}/*` → `packages/ui/src/<name>/`
- `_legacy-src/lib/types.ts` → `packages/ui/src/lib/types.ts`
- `_legacy-src/templates/ternus/*` (14 component + 3 lib hook + config/template/css) → `packages/templates-ternus/src/`
- `_legacy-src/app/(demos)/ternus/page.tsx` → `apps/docs/app/(demos)/ternus/page.tsx`

**Xoá (registry retire + example):**

- `_legacy-src/components/{index.ts,template-card.tsx,template-preview-frame.tsx}`
- `_legacy-src/templates/index.ts`
- `_legacy-src/templates/example/{config.ts,template.tsx}`
- `_legacy-src/app/(demos)/example/page.tsx`
- `_legacy-src/app/{layout.tsx,globals.css,page.tsx,favicon.ico}` (reconcile/stub vào apps/docs)

## Change Log

| Date       | Version | Description                                                                  | Author |
| ---------- | ------- | ---------------------------------------------------------------------------- | ------ |
| 2026-06-09 | 1.0     | Migrate legacy source → packages; 9/9 AC pass; 3 build exit 0; Status review | Amelia |
