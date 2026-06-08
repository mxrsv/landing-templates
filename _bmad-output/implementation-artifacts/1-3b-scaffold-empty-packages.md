# Story 1.3b: Scaffold Empty Template & Section Packages

Status: ready-for-dev

## Story

As a **builder (Epic A owner)**,
I want **tạo sẵn skeleton packages cho `@landing/sections` và 3 template packages tương lai (memecoin/gamefi/nft) với `package.json` + `tsconfig.json` hợp lệ và đã đăng ký vào root config**,
So that **Epic 5–7 agent chỉ cần tạo file source trong lane RIÊNG của mình mà không phải sửa `pnpm-workspace.yaml`, `next.config.ts`, hay bất kỳ file chung nào → giữ invariant "1 package path = 1 owner" và bảo đảm parallel-safety**.

## Acceptance Criteria

1. **Given** rename `@landing` hoàn tất (Story 1.3) — `grep -rn "@repo/" .` đã 0 kết quả và `transpilePackages` đang là explicit list `["@landing/ui", "@landing/design-tokens", "@landing/templates-ternus"]`
   **When** scaffold 4 empty packages, mỗi cái có `package.json` + `tsconfig.json`:
   - `packages/sections` → name `@landing/sections`
   - `packages/templates-memecoin` → name `@landing/templates-memecoin`
   - `packages/templates-gamefi` → name `@landing/templates-gamefi`
   - `packages/templates-nft` → name `@landing/templates-nft`
     **Then** mỗi `package.json` có `"private": true` và một `"build"` script chạy được, exit 0 ngay cả khi package chưa có source thật (xem Dev Notes — KHÔNG dùng `tsc --noEmit` trần vì empty package → TS18003).

2. **And** deps `workspace:*` chỉ khai báo cho package đã là workspace member ở thời điểm Story 1.3b chạy. `@landing/ui` đã tồn tại (scaffold/migration) → có thể khai báo `"@landing/ui": "workspace:*"` nếu cần. `@landing/design-tokens` CHƯA được build cho tới Epic 2 (Story 2.1) → **KHÔNG** khai báo dep tới nó trong story này (sẽ làm `pnpm install` fail → build không bao giờ exit 0). Epic 5–7 tự thêm dep còn thiếu trong lane của mình về sau (vẫn parallel-safe theo §4.1).

3. **And** `@landing/sections` dùng **PER-SECTION SUBPATH EXPORTS — KHÔNG single barrel `src/index.ts`**: khai báo 1 lần wildcard trong `package.json`:

   ```json
   "exports": { "./*": "./src/*/index.tsx" }
   ```

   Consumer import `@landing/sections/<name>` (vd `@landing/sections/gamefi-hero`). Mỗi Epic 5/6/7 chỉ tạo `src/<name>/index.tsx` trong thư mục RIÊNG → không story nào đụng file chung, parallel-safe.

4. **And** thêm cả 4 package mới vào `transpilePackages` **explicit list** trong `apps/docs/next.config.ts`. Mảng cuối cùng phải có đúng 7 entry:

   ```ts
   transpilePackages: [
     "@landing/ui",
     "@landing/design-tokens",
     "@landing/templates-ternus",
     "@landing/sections",
     "@landing/templates-memecoin",
     "@landing/templates-gamefi",
     "@landing/templates-nft",
   ];
   ```

5. **And** `pnpm --filter @landing/sections build` exit 0.

6. **And** `pnpm --filter @landing/templates-memecoin build` exit 0 (tương tự `@landing/templates-gamefi`, `@landing/templates-nft`).

## Tasks / Subtasks

- [ ] Task 1 — Đọc Next 16 docs trước khi sửa root config (AC: #4) [AGENTS.md]
  - [ ] Đọc `node_modules/next/dist/docs/` phần liên quan `transpilePackages` (Next 16 KHÔNG hỗ trợ glob — phải explicit list); xác nhận vị trí key trong `next.config.ts`
  - [ ] Xác nhận `apps/docs/next.config.ts` hiện có explicit list từ Story 1.3 (3 entry) trước khi append

- [ ] Task 2 — Scaffold `packages/sections` (@landing/sections) (AC: #1, #2, #3, #5)
  - [ ] Tạo `packages/sections/package.json`: `"name": "@landing/sections"`, `"private": true`, `"version": "0.0.0"`, `"type": "module"`, build script no-op (xem Dev Notes), và `"exports": { "./*": "./src/*/index.tsx" }`
  - [ ] KHÔNG tạo `src/index.ts` (no barrel). KHÔNG đặt placeholder file trong `src/` (vì `./*` wildcard sẽ biến nó thành subpath thật)
  - [ ] Tạo `packages/sections/tsconfig.json` (extends root/shared tsconfig — xem Dev Notes)
  - [ ] Verify: `pnpm --filter @landing/sections build` exit 0

- [ ] Task 3 — Scaffold 3 template packages (AC: #1, #2, #6)
  - [ ] `packages/templates-memecoin/package.json`: `"name": "@landing/templates-memecoin"`, `"private": true`, build script no-op
  - [ ] `packages/templates-gamefi/package.json`: `"name": "@landing/templates-gamefi"`, `"private": true`, build script no-op
  - [ ] `packages/templates-nft/package.json`: `"name": "@landing/templates-nft"`, `"private": true`, build script no-op
  - [ ] Tạo `tsconfig.json` cho mỗi package (extends shared)
  - [ ] KHÔNG khai báo dep `@landing/design-tokens` (chưa là workspace member tới Epic 2.1)
  - [ ] Verify: `pnpm --filter @landing/templates-memecoin build`, `... gamefi build`, `... nft build` đều exit 0

- [ ] Task 4 — Đăng ký vào root config (AC: #4) [chỉ Epic A — §4.2]
  - [ ] Append 4 package vào `transpilePackages` trong `apps/docs/next.config.ts` → đúng 7 entry như AC #4
  - [ ] Xác nhận `pnpm-workspace.yaml` đã cover `packages/*` (nếu là pattern glob thì 4 dir mới tự được nhận; nếu list tường minh thì thêm) — chạy `pnpm install` để register

- [ ] Task 5 — Verify toàn cục (AC: #5, #6)
  - [ ] `pnpm install` exit 0 (không peer/workspace resolution error)
  - [ ] `pnpm -r ls` / `pnpm list -r --depth -1` thấy đủ 4 package mới
  - [ ] Cả 4 lệnh `pnpm --filter <pkg> build` exit 0
  - [ ] `pnpm dev` (hoặc `pnpm --filter docs build`) không lỗi do `transpilePackages` sai

## Dev Notes

### Trap đã resolve (đọc trước khi code)

1. **`tsc --noEmit` trần FAIL trên empty package** → `error TS18003: No inputs were found in config file`. Empty `packages/sections` / `templates-*` chưa có source nên build script KHÔNG được là `tsc --noEmit` trần. **Resolution: dùng no-op build script** cho cả 4 package, ví dụ:

   ```json
   "scripts": { "build": "echo \"@landing/<pkg>: no build (skeleton)\" && exit 0" }
   ```

   Lựa chọn này thoả EMPHASIS ("tsc --noEmit OR empty placeholder") mà không cần đặt placeholder file. Lý do KHÔNG dùng placeholder cho `sections`: wildcard `"exports": { "./*": "./src/*/index.tsx" }` sẽ biến mọi `src/<name>/index.tsx` thành subpath công khai — placeholder vô tình tạo subpath rác. No-op build là an toàn nhất, vẫn cho `pnpm --filter ... build` exit 0.

2. **`@landing/design-tokens` chưa là workspace member ở Story 1.3b** — nó mới được build ở Epic 2 (Story 2.1). Khai báo `"@landing/design-tokens": "workspace:*"` bây giờ → `pnpm install` không resolve được → build không bao giờ exit 0. **Resolution: OMIT dep tới design-tokens** trong cả 4 skeleton. Asymmetry: bỏ một dep resolvable thì vô hại (Epic 5–7 tự thêm trong lane của mình về sau, vẫn parallel-safe theo §4.1); khai báo dep unresolvable thì fatal. `@landing/ui` đã tồn tại nên có thể khai báo nếu thực sự cần, nhưng skeleton rỗng KHÔNG import gì → tốt nhất để deps tối thiểu/rỗng, để Epic 5–7 thêm trong lane riêng.

### Project Structure Notes

- Bối cảnh repo: ở thời điểm viết story, repo gốc vẫn là single Next.js app (`src/`, `next.config.ts` ở root) — monorepo `apps/docs` + `packages/*` do chuỗi Epic 1 (Story 1.2 scaffold create-turbo, 1.3 rename) tạo ra TRƯỚC story này. Story 1.3b giả định trạng thái sau 1.3: đã có `packages/ui`, `packages/templates-ternus`, `apps/docs`.
- Các path tạo mới (4 package):
  - `packages/sections/package.json`, `packages/sections/tsconfig.json` (KHÔNG có `src/index.ts`)
  - `packages/templates-memecoin/{package.json,tsconfig.json}`
  - `packages/templates-gamefi/{package.json,tsconfig.json}`
  - `packages/templates-nft/{package.json,tsconfig.json}`
- Path sửa (shared, Epic A owns per §4.2): `apps/docs/next.config.ts` (append 4 vào `transpilePackages`). Có thể `pnpm-workspace.yaml` nếu nó dùng list tường minh thay vì glob `packages/*`.
- `tsconfig.json` mỗi package: `extends` config dùng chung của workspace (theo create-turbo convention, thường `@landing/typescript-config` hoặc `../tsconfig.json` tuỳ scaffold 1.2 tạo) — dev agent xác nhận tên thật trong `packages/ui/tsconfig.json` để copy pattern. Vì no-op build, tsconfig chỉ cần hợp lệ cú pháp, không cần có input file.
- Dependency flow (theo briefing): `design-tokens ← ui ← sections ← templates ← apps/docs`. Story này chỉ tạo node rỗng, KHÔNG nối cạnh design-tokens (xem Trap #2).
- Lane ownership (§4.1) mà skeleton này mở đường cho:
  - `gamefi` lane → `packages/sections/src/gamefi-*/**`
  - `nft` lane → `packages/sections/src/nft-*/**`
  - `memecoin` lane → `packages/templates-memecoin/**`
  - Nhờ wildcard exports, mỗi lane tạo `src/<name>/index.tsx` riêng → không đụng `package.json` chung lần nào sau Story 1.3b.

### Verify commands

```bash
# Sau scaffold + register:
pnpm install
pnpm --filter @landing/sections build          # exit 0
pnpm --filter @landing/templates-memecoin build # exit 0
pnpm --filter @landing/templates-gamefi build    # exit 0
pnpm --filter @landing/templates-nft build       # exit 0
pnpm list -r --depth -1 | grep -E "@landing/(sections|templates-(memecoin|gamefi|nft))"  # thấy đủ 4
# Xác nhận next.config có 7 entry transpilePackages (không glob):
grep -n "transpilePackages" -A 10 apps/docs/next.config.ts
```

### References

- [Source: `_bmad-output/planning-artifacts/epics.md#story-1.3b` (Story 1.3b block, ~L221–240) — danh sách 4 package, `"private": true`, build/tsc stub, wildcard per-section subpath exports, append `transpilePackages`, các điều kiện build exit 0]
- [Source: `_bmad-output/planning-artifacts/epics.md#story-1.3` (~L202–219) — Given: rename @landing hoàn tất; `transpilePackages` explicit list khởi đầu `["@landing/ui", "@landing/design-tokens", "@landing/templates-ternus"]`, append mỗi package mới qua registration task]
- [Source: `_bmad-output/planning-artifacts/epics.md#story-2.1` (~L290+) — `@landing/design-tokens` mới được build ở Epic 2, lý do OMIT dep ở 1.3b]
- [Source: `_bmad-output/planning-artifacts/parallel-dev-strategy.md#4.1` (L149–161) — ownership lanes: gamefi → `packages/sections/src/gamefi-*`, nft → `packages/sections/src/nft-*`, memecoin → `packages/templates-memecoin`]
- [Source: `_bmad-output/planning-artifacts/parallel-dev-strategy.md#4.2` (L163–171) — `apps/docs/next.config.ts` + `pnpm-workspace.yaml` chỉ Epic A sửa; per-section subpath thay cho serial barrel-registration giữ parallel-safety]
- [Source: `AGENTS.md` — đọc `node_modules/next/dist/docs/` trước khi sửa Next config; Next 16 KHÔNG hỗ trợ glob trong `transpilePackages`]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
