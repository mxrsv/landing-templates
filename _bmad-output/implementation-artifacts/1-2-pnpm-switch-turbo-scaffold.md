---
baseline_commit: f0538c504a56c905ee93b1ff0ebee1da10457978
---

# Story 1.2: pnpm Switch & In-Repo Turbo Scaffold

Status: review

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

- [x] **Task 1 — Verify precondition Gate-0 + working tree sạch (AC: Given)**
  - [x] `git log --oneline -20 | grep -iE "gate-0|v20 WIP"` → khớp `b578a31`, exit 0.
  - [x] `git status` sạch (chỉ untracked artifact `.playwright-mcp/`, `.planning/` — không block).

- [x] **Task 2 — Tạo / checkout branch migration (AC: When #1)** — ✓ qua `EnterWorktree`
  - [x] Branch migration tạo qua git worktree (harness `EnterWorktree`) tại `.claude/worktrees/chore+monorepo-migration`, off `origin/main` = `f0538c5`.
  - [x] Pair branch ↔ worktree theo quy ước user `<branching>` (user xác nhận "Worktree riêng").
  - [x] Branch thực tế: `worktree-chore+monorepo-migration` (harness đặt tên; cosmetic, khác `chore/monorepo-migration` trong spec — ghi nhận cho PR sau).

- [x] **Task 3 — Di chuyển legacy source vào `_legacy-src/` GIỮ git history (AC: When #2)**
  - [x] `mkdir -p _legacy-src`.
  - [x] `git mv src/app src/components src/lib src/templates _legacy-src/` — 46 path tracked, đều `R` (renamed, giữ history).
  - [x] **Dotfiles guard:** `git ls-files 'src/.*'` → rỗng (không có dotfile tracked). Không cần git mv thêm.
  - [x] `src/` rỗng → `rmdir src` OK; `git ls-files src/` → 0 dòng.
  - [x] `git status` xác nhận dạng `renamed: src/... -> _legacy-src/...`.
  - [x] Migration map (`(demos)/example/`, `templates/example/`) giữ nguyên — xử lý ở Story 1.4.

- [x] **Task 4 — Backup root config sẽ bị scaffold ghi đè (AC: When #3)**
  - [x] ⚠️ Chỉ 5 config tồn tại trên disk: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`. `next-env.d.ts` KHÔNG tồn tại (Next gitignore nó → fresh checkout không có) → BỎ khỏi `git mv` (nếu giữ trong lệnh sẽ abort cả `git mv`).
  - [x] `mkdir -p _legacy-src/_root-config-backup && git mv <5 file> _legacy-src/_root-config-backup/` — giữ history.
  - [x] Verify root trống config cũ.

- [x] **Task 5 — Kích hoạt pnpm (AC: When #4)** — ✓ pnpm 9.x đã active sẵn
  - [x] BỎ `corepack prepare pnpm@latest` (sẽ kéo pnpm 10.x, phá pin 9.x). pnpm `9.15.4` đã active → đủ.
  - [x] `pnpm --version` → `9.15.4` (khớp pin 9.x).

- [x] **Task 6 — Xoá lockfile npm + scaffold create-turbo (AC: When #5, #6)**
  - [x] `rm -f package-lock.json`.
  - [x] ⚠️ `create-turbo .` (in-place) bị Claude Code classifier chặn (`pnpm dlx` external) → user tự chạy. Để tránh `create-turbo` từ chối dir không rỗng (worktree còn ~20 ảnh, `docs/`, `_bmad/`...), scaffold vào temp dir rỗng rồi `rsync` khung vào worktree (history `src/` đã an toàn trong `_legacy-src/`; file scaffold là file mới, không history dù tạo ở đâu → giữ đúng ý đồ story). Cmd: `pnpm dlx create-turbo@latest /tmp/landing-turbo -m pnpm -e with-tailwind --skip-install`.
  - [x] Bỏ `apps/web` (template ship cả docs+web; target chỉ cần `apps/docs`). Bỏ copy `.git` temp + `README.md` (giữ README cũ); merge `.gitignore` (monorepo non-anchored + giữ `.playwright-mcp/`, `next-env.d.ts`...).
  - [x] Verify scaffold: `apps/docs` + `packages/{ui,eslint-config,typescript-config,tailwind-config}` + `pnpm-workspace.yaml` + `turbo.json` + root `package.json`.

- [x] **Task 7 — Cài deps + pin versions ĐÚNG package.json (AC: When #7, Then pins)**
  - [x] `pnpm install` exit 0; lockfile `9.0`.
  - [x] Root `package.json`: `turbo` = `^2.9.16`; `packageManager` = `pnpm@9.15.4` (đổi từ scaffold `pnpm@10.19.0`); `engines.node` = `>=20.9.0`; `name` = `landing-page-list`.
  - [x] App `apps/docs/package.json`: pin `next` = `16.2.7` (từ 16.2.0), `react` = `19.2.4`, `react-dom` = `19.2.4` (exact); `tailwindcss` = `^4.1.5` (đã đạt `^4`).
  - [x] `pnpm install` lại → lockfile khớp.
  - [x] KHÔNG dồn next/react/tailwind vào root — đúng app package.

- [x] **Task 8 — Verify acceptance (AC: Then / And)**
  - [x] `pnpm-workspace.yaml` → `['apps/*', 'packages/*']`.
  - [x] `turbo.json` (Turbo 2.x `tasks`) → có `build`, `lint`, `dev` (+ `check-types`).
  - [x] Pins verify: root `turbo ^2.9.16 | pm pnpm@9.15.4`; docs `next 16.2.7 | react 19.2.4 | rdom 19.2.4 | tw ^4.1.5`.
  - [x] `pnpm install --frozen-lockfile` → "Already up to date" (lockfile khớp). `pnpm build` → 3/3 tasks xanh (next 16.2.7 compiled OK).

- [x] **Task 9 — Commit scaffold (1 commit riêng, rollback-safe)**
  - [x] Prep (move src + backup config + drop lock) commit riêng `a8bfe08`. Scaffold stage tường minh: `git add .gitignore .npmrc apps packages package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json` (kiểm tra index sạch, không lẫn `.playwright-mcp/`/`.planning/`/ảnh/`node_modules`).
  - [x] `git commit` scaffold → `d822aa1` (38 file).
  - [x] `git status` sạch các thay đổi scaffold; branch sẵn sàng cho Story 1.3.

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

claude-opus-4-8 (1M context)

### Debug Log References

```
# Task 5 — pnpm version
$ pnpm --version
9.15.4

# Task 6 — create-turbo (user chạy qua `!`, scaffold vào temp dir)
$ pnpm dlx create-turbo@latest /tmp/landing-turbo -m pnpm -e with-tailwind --skip-install
Success! Created your Turborepo at /tmp/landing-turbo

# Task 8 — frozen lockfile + pins + build
$ pnpm install --frozen-lockfile   → Already up to date
root : turbo ^2.9.16 | pm pnpm@9.15.4
docs : next 16.2.7 | react 19.2.4 | rdom 19.2.4 | tw ^4.1.5
$ pnpm build   → Tasks: 3 successful, 3 total  (docs:build ✓ next 16.2.7 Turbopack)
```

### Completion Notes List

- **Sai khác so với spec (đã cân nhắc, không phá AC):**
  1. Branch tạo qua harness `EnterWorktree` → tên `worktree-chore+monorepo-migration` (không phải `chore/monorepo-migration`). Cosmetic. Toàn bộ Epic 1 (tracking + migration) sống trong worktree, merge `main` cuối Epic.
  2. `create-turbo` chạy vào **temp dir** (`/tmp/landing-turbo`) rồi `rsync` khung vào worktree — vì `pnpm dlx` bị classifier chặn (user tự chạy) + dir worktree không rỗng dễ làm `create-turbo .` từ chối. History `src/` đã an toàn trong `_legacy-src/`; file scaffold không có history dù tạo ở đâu → giữ đúng ý đồ "in-repo, giữ history".
  3. Bỏ `next-env.d.ts` khỏi backup `git mv` (file không tồn tại trên fresh checkout — Next gitignore).
  4. Bỏ `corepack prepare pnpm@latest` (sẽ kéo pnpm 10.x phá pin 9.x) — pnpm 9.15.4 active sẵn.
  5. Bỏ `apps/web` (template `with-tailwind` ship cả `docs`+`web`; target chỉ cần `apps/docs`).
- **Reconcile pins:** scaffold ship next@16.2.0 / react@^19.2.0 / react-dom@^19.1.0 / pnpm@10.19.0 → pin lại next@16.2.7, react@19.2.4, react-dom@19.2.4, packageManager pnpm@9.15.4. tailwind@^4.1.5 đã đạt `^4`.
- **Build xanh** (3/3 tasks).
- **⚠️ Known issue → Story 1.3:** `pnpm build` cảnh báo Next nhầm workspace root do có `package-lock.json` lạc trong `$HOME` (`/Users/kyantran/package-lock.json`, ngoài repo). Build vẫn xanh. Fix đúng: set `turbopack.root` trong `apps/docs/next.config` — để Story 1.3 (story đó vốn sửa `next.config` cho `transpilePackages`). Đọc `node_modules/next/dist/docs/` trước khi sửa (AGENTS.md).
- **Commits:** `a8bfe08` (prep: move src→_legacy-src + backup config + drop lock), `d822aa1` (scaffold create-turbo). BMAD tracking: `0393f7b`.

### File List

**Tạo mới (scaffold, commit `d822aa1`):**

- `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.npmrc`, `pnpm-lock.yaml`
- `apps/docs/**` (Next app gallery)
- `packages/ui/**`, `packages/eslint-config/**`, `packages/typescript-config/**`, `packages/tailwind-config/**`
- `.gitignore` (merge: monorepo non-anchored + giữ `.playwright-mcp/`, `next-env.d.ts`, `.vercel`, `*.tsbuildinfo`)

**Di chuyển (commit `a8bfe08`, giữ history):**

- `src/{app,components,lib,templates}/**` → `_legacy-src/{app,components,lib,templates}/**`
- `{package.json,next.config.ts,tsconfig.json,eslint.config.mjs,postcss.config.mjs}` (cũ) → `_legacy-src/_root-config-backup/`
- Xoá `package-lock.json` (chuyển sang pnpm)
