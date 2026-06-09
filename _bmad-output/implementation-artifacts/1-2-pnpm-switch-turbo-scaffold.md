---
baseline_commit: f0538c504a56c905ee93b1ff0ebee1da10457978
---

# Story 1.2: pnpm Switch & In-Repo Turbo Scaffold

Status: in-progress

## Story

As a **builder**, I want **chuyển package manager từ npm sang pnpm và scaffold `create-turbo` ngay trong repo hiện tại (in-repo)**, so that **monorepo có cấu trúc chuẩn — pnpm workspaces + Turborepo pipeline — sẵn sàng cho các bước rename (1.3) và migrate legacy source (1.4) mà vẫn giữ nguyên git history**.

> Đây là story sở hữu bước **destructive scaffold** (`create-turbo` ghi đè root config) + bước **`git mv src/* _legacy-src/`**. Mọi thao tác phải đúng thứ tự và có rollback rõ ràng. Predecessor: **Story 1.1 (Gate-0 WIP Snapshot)** — đã thoả mãn ở commit `b578a31`.

## Acceptance Criteria

**Given** Gate-0 đã thoả mãn (Story 1.1 — commit `b578a31` chứa `v20 WIP`, working tree không còn WIP files chưa stage trong danh sách Gate-0)

**When** thực hiện theo đúng thứ tự sau:

1. `git checkout chore/monorepo-migration` nếu branch đã tồn tại, else `git checkout -b chore/monorepo-migration`.
2. `mkdir -p _legacy-src && git mv src/* _legacy-src/` (bao gồm dotfiles nếu có trong `src/`).
3. **Trước `create-turbo`:** backup hoặc xoá các root config sẽ bị scaffold ghi đè: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next-env.d.ts` (đây là hành vi **expected** — scaffold thay thế chúng).
4. `corepack enable && corepack prepare pnpm@latest --activate` (fallback: `npm i -g pnpm` nếu corepack không khả dụng).
5. Xoá `package-lock.json`.
6. `pnpm dlx create-turbo@latest . -m pnpm -e with-tailwind --skip-install`.
7. `pnpm install`.

**Then** `pnpm-workspace.yaml` có `packages: ['apps/*', 'packages/*']`.

**And** `turbo.json` định nghĩa pipeline `dev`, `build`, `lint`.

**And** pin `turbo@^2.9` (+ `packageManager: pnpm@9.x`) ở **root** `package.json`; pin `next@16.2.7`, `react@19.2.4` (+ `react-dom@19.2.4`), `tailwindcss@^4` ở **app** `package.json` (`apps/docs` hoặc tên app mà scaffold tạo ra) — reconcile nếu scaffold ship v3/15. Pin **đúng package.json theo cách pnpm/turborepo resolve deps**, không dồn `next`/`react` vào root.

**And** nếu `create-turbo` fail giữa chừng → `git checkout -- .` + xoá phần `apps/`/`packages/` scaffold dở dang, **abort** — KHÔNG proceed Story 1.3.

**And** nếu `pnpm install` fail → fix peer deps **trước** khi proceed; KHÔNG rename/migrate khi `node_modules` còn incomplete.

## Tasks / Subtasks

- [ ] **Task 1 — Verify precondition Gate-0 + working tree sạch (AC: Given)**
  - [ ] Chạy `git log --oneline -20`, xác nhận có commit chứa `v20 WIP` / `gate-0` (đã có `b578a31`). Nếu chưa có → DỪNG, quay lại Story 1.1.
  - [ ] Chạy `git status` — xác nhận không còn các WIP file Gate-0 (`PixelBlast.tsx`, `hero-crystal.tsx`, `ternus-hero.tsx`, `ternus.css`, `ternus-netstrip.tsx`) ở trạng thái chưa stage. Artifact rác (`.playwright-mcp/`, `_bmad-output/` dirty) không block — nhưng nên ghi nhận lại để tránh nhầm.

- [ ] **Task 2 — Tạo / checkout branch migration (AC: When #1)**
  - [ ] `git branch --list chore/monorepo-migration` để kiểm tra tồn tại. Hiện tại branch CHƯA tồn tại (đang ở `main`) → dùng `git checkout -b chore/monorepo-migration`.
  - [ ] Theo quy ước user (`<branching>`): branch được yêu cầu tường minh ở story này → pair với **git worktree** nếu workflow của builder dùng worktree (isolated checkout). Nếu không dùng worktree thì làm trực tiếp trên branch vừa tạo.
  - [ ] Verify: `git rev-parse --abbrev-ref HEAD` → `chore/monorepo-migration`.

- [ ] **Task 3 — Di chuyển legacy source vào `_legacy-src/` GIỮ git history (AC: When #2)**
  - [ ] `mkdir -p _legacy-src`.
  - [ ] `git mv src/* _legacy-src/` — di chuyển tất cả thư mục/file tracked trong `src/` (`app/`, `components/`, `lib/`, `templates/`).
  - [ ] **Dotfiles guard:** `src/` hiện KHÔNG có dotfile tracked (đã verify: `git ls-files src/` chỉ ra `app/`, `components/`, `lib/`, `templates/`; không có `.planning/` tracked). Nếu lần chạy thực tế phát hiện dotfile tracked trong `src/` (`git ls-files 'src/.*'`), thêm `git mv src/.<name> _legacy-src/` cho từng cái. Nếu là file/dir UNTRACKED (vd scratch `.planning/` không track) → dùng `mv` thường (không phải `git mv`) hoặc xoá nếu là rác.
  - [ ] Verify `src/` rỗng: `git ls-files src/` → 0 dòng; `ls -A src/ 2>/dev/null` → rỗng (có thể `rmdir src` nếu còn dir rỗng).
  - [ ] Verify history giữ nguyên (sanity, không bắt buộc commit ở đây): `git status` cho thấy các path ở dạng `renamed: src/... -> _legacy-src/...`.
  - [ ] **Lưu ý migration map (Story 1.4, KHÔNG xử lý ở đây):** `_legacy-src/app/(demos)/example/` và `_legacy-src/templates/example/` sẽ bị DELETE ở 1.4 (không nằm trong catalog v1). Story 1.2 chỉ move nguyên trạng, không xoá/đổi tên nội dung.

- [ ] **Task 4 — Backup/xoá root config sẽ bị scaffold ghi đè (AC: When #3)**
  - [ ] Các file sẽ bị `create-turbo` ghi đè (đã verify tồn tại): `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next-env.d.ts`.
  - [ ] Backup (an toàn, dễ so sánh sau): `mkdir -p _legacy-src/_root-config-backup && git mv package.json next.config.ts tsconfig.json eslint.config.mjs postcss.config.mjs next-env.d.ts _legacy-src/_root-config-backup/` — GIỮ history, và scaffold sẽ tạo bản mới ở root. (Nếu builder chọn xoá thẳng cũng được; backup an toàn hơn để reconcile config cũ ↔ mới.)
  - [ ] Verify root đã trống config cũ: `ls package.json next.config.ts 2>&1` → "No such file".

- [ ] **Task 5 — Kích hoạt pnpm qua corepack (AC: When #4)**
  - [ ] `corepack enable && corepack prepare pnpm@latest --activate`.
  - [ ] Fallback nếu corepack không có: `npm i -g pnpm`.
  - [ ] Verify: `pnpm --version` → in ra `9.x` (Pins yêu cầu pnpm 9.x; nếu `latest` là 10.x, set `packageManager` field về `pnpm@9.x` ở Task 7 và dùng `corepack prepare pnpm@9 --activate` để khớp).

- [ ] **Task 6 — Xoá lockfile npm + scaffold create-turbo in-repo (AC: When #5, #6)**
  - [ ] `rm -f package-lock.json`.
  - [ ] `pnpm dlx create-turbo@latest . -m pnpm -e with-tailwind --skip-install` — scaffold vào `.` (root repo hiện tại). KHÔNG dùng greenfield-merge / path khác (lý do: giữ git history của `src/`).
  - [ ] **Abort gate:** nếu lệnh fail giữa chừng → `git checkout -- .` để restore tracked files, xoá thủ công phần `apps/`/`packages/` scaffold dở dang (chúng là untracked), rồi DỪNG — KHÔNG proceed Story 1.3. Ghi lý do fail vào Debug Log.
  - [ ] Verify scaffold tạo ra: `apps/` + `packages/` + `pnpm-workspace.yaml` + `turbo.json` + root `package.json` mới.

- [ ] **Task 7 — Cài deps + pin versions ĐÚNG package.json (AC: When #7, Then pins)**
  - [ ] `pnpm install`. **Abort gate:** nếu fail → đọc lỗi peer-deps, fix (thường do version mismatch khi pin), chạy lại tới khi exit 0. KHÔNG rename/migrate (Story 1.3+) khi `node_modules` incomplete.
  - [ ] **Root `package.json`:** đảm bảo `devDependencies.turbo` = `^2.9` và field `packageManager` = `pnpm@9.x` (khớp version Task 5).
  - [ ] **App `package.json`** (xác định tên app scaffold tạo — thường `apps/docs` theo architecture; scaffold `with-tailwind` có thể đặt tên khác như `apps/web`, kiểm tra trước): pin `dependencies.next` = `16.2.7`, `react` = `19.2.4`, `react-dom` = `19.2.4`; `dependencies`/`devDependencies.tailwindcss` = `^4`. Reconcile nếu scaffold ship next@15 / tailwind@3.
  - [ ] Sau khi sửa pins → chạy lại `pnpm install` để cập nhật lockfile, exit 0.
  - [ ] **KHÔNG** dồn `next`/`react`/`tailwindcss` vào root `package.json` — chúng thuộc app package; pnpm/turborepo resolve theo workspace, dồn vào root là lỗi chức năng dù "trông giống tuân thủ AC".

- [ ] **Task 8 — Verify acceptance (AC: Then / And)**
  - [ ] `cat pnpm-workspace.yaml` → có `packages:` gồm `'apps/*'` và `'packages/*'`. Nếu scaffold sinh khác (vd chỉ `apps/*`, `packages/*` dạng khác) → sửa cho khớp `['apps/*', 'packages/*']`.
  - [ ] `cat turbo.json` → có pipeline/tasks `dev`, `build`, `lint` (Turbo 2.x dùng key `tasks`, không phải `pipeline` của 1.x — giữ theo bản scaffold sinh ra, chỉ đảm bảo đủ 3 task này).
  - [ ] Verify pins:
    - `node -e "const p=require('./package.json'); console.log('turbo', (p.devDependencies||{}).turbo, '| pm', p.packageManager)"`
    - `node -e "const p=require('./apps/docs/package.json'); console.log('next', p.dependencies.next, 'react', p.dependencies.react, 'tw', (p.dependencies||p.devDependencies).tailwindcss)"` (đổi `apps/docs` theo tên app thực tế).
  - [ ] `pnpm install` exit code 0 (chạy lại lần cuối xác nhận lockfile khớp): `pnpm install --frozen-lockfile` nên cũng pass.

- [ ] **Task 9 — Commit scaffold (1 commit riêng, rollback-safe)**
  - [ ] Stage có chủ đích (KHÔNG `git add -A` mù): `git add _legacy-src apps packages package.json pnpm-workspace.yaml turbo.json pnpm-lock.yaml tsconfig.json eslint.config.mjs postcss.config.mjs .gitignore` (+ bất kỳ file scaffold mới — kiểm tra `git status` rồi add tường minh; tránh add lại artifact `.playwright-mcp/`).
  - [ ] `git commit -m "chore(monorepo): pnpm switch + in-repo create-turbo scaffold (Story 1.2)"`.
  - [ ] Verify `git status` sạch các thay đổi scaffold; branch sẵn sàng cho Story 1.3 (rename `@repo` → `@landing`).

## Dev Notes

### Constraints quan trọng (verified trên repo hiện tại)

- **Repo state hiện tại (verified):** single Next.js app dùng **npm** (`package-lock.json` tồn tại); CHƯA có `pnpm-workspace.yaml` / `turbo.json`; branch `chore/monorepo-migration` **CHƯA tồn tại** (đang ở `main`); `src/` có `app/ components/ lib/ templates/`, **không có dotfile tracked**.
- **Root config sẽ bị ghi đè (verified tồn tại):** `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next-env.d.ts`. Đây là lý do phải backup/xoá ở Task 4 TRƯỚC khi scaffold.
- **Gate-0 đã thoả** ở `b578a31` (`v20 WIP, planning artifacts, and architecture docs`). Story 1.2 chỉ verify, không re-commit Gate-0.
- **Authority note:** Khi epics.md xung đột với architecture.md/PRD/parallel-dev-strategy.md → **epics.md authoritative** (reviewPatchesApplied:true). Cụ thể: architecture.md §Gate-0 viết `git add -A` cho Story **1.1**, nhưng epics.md (authoritative) yêu cầu staging file list tường minh, NEVER `git add -A`. Story 1.2 áp dụng cùng nguyên tắc: ở Task 9 stage tường minh, không `git add -A`. (Việc này thuộc 1.1 đã xong — chỉ nêu 1 dòng, không relitigate.)
- **transpilePackages = EXPLICIT list, KHÔNG glob:** Next 16 KHÔNG hỗ trợ glob trong `transpilePackages`. Đây là việc của **Story 1.3** (`apps/docs/next.config.ts`), KHÔNG phải 1.2. 1.2 chỉ scaffold, không author nội dung `next.config.ts`.
- **AGENTS.md project rule (forward-looking):** "This is NOT the Next.js you know" — TRƯỚC khi viết bất kỳ Next config nào, đọc guide trong `node_modules/next/dist/docs/` (index tại `node_modules/next/dist/docs/index.md`) và tuân theo deprecation notice. Với Story 1.2 ràng buộc này hầu như không kích hoạt (1.2 dùng config do scaffold sinh ra, chưa tự viết) — nhưng nếu phải reconcile `next.config.ts` mới do scaffold tạo (vd next@15 → 16), đọc docs trước.
- **pnpm 9.x là pin chính thức:** nếu `corepack prepare pnpm@latest` kéo về 10.x, đặt `packageManager: "pnpm@9.<minor>.<patch>"` và activate đúng major 9.

### Rollback / Abort flow (CRITICAL)

- **`create-turbo` fail:** `git checkout -- .` (restore tracked) + xoá untracked scaffold dở (`apps/`, `packages/`, file scaffold mới) → abort, KHÔNG sang 1.3.
- **`pnpm install` fail:** fix peer deps trước; KHÔNG migrate/rename khi `node_modules` incomplete.
- Vì các bước đều trên branch `chore/monorepo-migration` và `_legacy-src/` giữ history, có thể `git reset --hard b578a31` (hoặc checkout lại `main`) để về trạng thái trước migration nếu cần làm lại sạch.

### Verify commands tổng hợp

```bash
git rev-parse --abbrev-ref HEAD            # chore/monorepo-migration
git ls-files src/                          # rỗng sau Task 3
cat pnpm-workspace.yaml                     # packages: ['apps/*', 'packages/*']
cat turbo.json                              # tasks: dev, build, lint
node -e "const p=require('./package.json'); console.log(p.packageManager, (p.devDependencies||{}).turbo)"
node -e "const p=require('./apps/docs/package.json'); console.log(p.dependencies.next, p.dependencies.react)"  # đổi path theo tên app thực tế
pnpm install                                # exit 0
pnpm install --frozen-lockfile              # exit 0 (lockfile khớp)
```

### Project Structure Notes

Cấu trúc đích sau scaffold + (các story sau) — Story 1.2 chỉ dựng khung `apps/` + `packages/` + root config; nội dung packages do Story 1.3b/1.4 lấp đầy:

```
landing-page-list/
├── package.json            # root: turbo@^2.9 + packageManager pnpm@9.x
├── pnpm-workspace.yaml     # packages: ['apps/*', 'packages/*']
├── turbo.json              # tasks: dev, build, lint
├── apps/
│   └── docs/               # gallery (@landing/docs) — pin next/react/tailwind ở ĐÂY
├── packages/               # design-tokens, ui, sections, templates-* (lấp đầy ở 1.3b/1.4)
└── _legacy-src/            # nguồn cũ giữ history; xoá sau smoke pass (Story 1.5)
    └── _root-config-backup/ # (tuỳ chọn) config root cũ để reconcile
```

- Tên app do scaffold `-e with-tailwind` sinh ra có thể là `apps/docs` hoặc `apps/web` — kiểm tra `ls apps/` ngay sau scaffold; architecture target là `apps/docs`. Việc đổi tên app (nếu scaffold dùng `web`) có thể xử lý ở 1.3 (rename) hoặc 1.4 (migrate `_legacy-src/app/` → `apps/docs/app/`) — KHÔNG bắt buộc trong 1.2 trừ khi pin verify cần path đúng.
- `_legacy-src/` là read-only cho đến smoke pass; mọi migrate nội dung là Story 1.4.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2: pnpm Switch & In-Repo Turbo Scaffold] — AC gốc (7 bước When + Then/And), abort gates, pin list.
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1: Gate-0 WIP Snapshot] — precondition Gate-0, nguyên tắc staging tường minh (NEVER `git add -A`).
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3: Rename @repo → @landing] — successor; `transpilePackages` explicit list nằm ở 1.3, không phải 1.2.
- [Source: _bmad-output/planning-artifacts/architecture.md#Selected Starter: In-repo create-turbo + Migrate from _legacy-src/] — canonical init command, rationale giữ history, migration map.
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries] — cấu trúc đích `apps/docs` + `packages/*` + `_legacy-src/`.
- [Source: _bmad-output/planning-artifacts/architecture.md#Architectural Decisions Provided by Starter] — Node 20.9+, React 19.2.4, Tailwind 4 CSS-first, Turborepo 2.x pipeline (`dev`/`build`/`lint`), ESLint 9 flat config.
- [Source: _bmad-output/planning-artifacts/parallel-dev-strategy.md#Patch 1 — Initialization Command] — thứ tự chính tắc: branch → Gate-0 → `git mv src/*` → corepack → rm lockfile → create-turbo `--skip-install` → `pnpm install`; "KHÔNG dùng greenfield-merge".
- [Source: AGENTS.md] — "This is NOT the Next.js you know"; đọc `node_modules/next/dist/docs/` trước khi viết Next config.

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
