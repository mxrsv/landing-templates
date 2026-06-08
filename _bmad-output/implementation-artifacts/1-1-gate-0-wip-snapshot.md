# Story 1.1: Gate-0 WIP Snapshot

Status: ready-for-dev

## Story

As a builder, I want verify hoặc snapshot WIP v20 trước khi migrate, so that không mất các thay đổi PixelBlast, ternus-hero, hero-crystal, ternus-netstrip khi di chuyển file vào monorepo (apps/docs + packages/\*).

Đây là story ĐẦU TIÊN trong Epic 1 (lane A serial: 1.1 → 1.2 → 1.3 → 1.3b → 1.4 → 1.5). Không có story tiền nhiệm. Đây là story thuần git/process — KHÔNG viết code.

> CONTEXT QUAN TRỌNG: Gate-0 là cơ chế **verify-or-skip** và đã **THỎA MÃN** bởi commit `b578a31` (message chứa "v20 WIP" → grep khớp → SKIP commit). Pre-epics checklist trong `epics.md` đã đánh dấu Gate-0 là `[x]` satisfied qua `b578a31`. Đường nhánh "chưa thỏa mãn" (staging explicit file-list) được document đầy đủ bên dưới như fallback, KHÔNG được thực thi trong điều kiện repo hiện tại.

## Acceptance Criteria

1. **Given** cần Gate-0 trước migration, **When** kiểm tra `git log --oneline -20` tìm commit message chứa `gate-0` hoặc `v20 WIP` (vd `b578a31`), **Then** nếu đã có → SKIP commit, ghi log "Gate-0 satisfied", proceed Story 1.2.
2. **And** nếu CHƯA có → stage CHỈ các file WIP bắt buộc:
   - `src/components/pixel-blast/PixelBlast.tsx`
   - `src/templates/ternus/components/hero-crystal.tsx`
   - `src/templates/ternus/components/ternus-hero.tsx`
   - `src/templates/ternus/components/ternus-netstrip.tsx`
   - `src/templates/ternus/ternus.css`
   - (KHÔNG stage `.playwright-mcp/`, `_bmad-output/`, hay artifact khác — NEVER `git add -A`).
3. **And** chạy `git commit -m "chore: gate-0 snapshot ternus v20 WIP before monorepo migration"`.
4. **And** nếu `git commit` fail (hook reject) → DỪNG migration, `git reset HEAD` các file đã staged, fix hook/blocker trước khi retry — KHÔNG chạy Story 1.2.
5. **And** sau khi pass: `git status` không còn unstaged WIP files trong danh sách ở AC #2.

## Tasks / Subtasks

- [ ] Task 1: Verify Gate-0 đã thỏa mãn (AC: #1)
  - [ ] Chạy `git log --oneline -20 | grep -iE "gate-0|v20 WIP"` từ repo root.
  - [ ] Kỳ vọng exit code 0 và output chứa `b578a31 feat(ternus): v20 WIP, planning artifacts, and architecture docs`.
  - [ ] Nếu KHỚP → ghi log "Gate-0 satisfied (b578a31)", SKIP toàn bộ Task 2-3, proceed Story 1.2. Đây là đường đi mong đợi trong repo hiện tại.
- [ ] Task 2: [FALLBACK — chỉ khi Task 1 KHÔNG khớp] Stage explicit WIP file-list (AC: #2)
  - [ ] Xác nhận từng file tồn tại trước khi stage (xem Project Structure Notes cho path chính xác).
  - [ ] `git add` từng file một theo đúng danh sách AC #2 — TUYỆT ĐỐI KHÔNG dùng `git add -A` / `git add .`.
  - [ ] Chạy `git status --porcelain` xác nhận staged set CHỈ gồm 5 file trên, không lẫn `.playwright-mcp/` hay `_bmad-output/`.
- [ ] Task 3: [FALLBACK — chỉ khi Task 2 chạy] Commit snapshot & xử lý hook reject (AC: #3, #4, #5)
  - [ ] `git commit -m "chore: gate-0 snapshot ternus v20 WIP before monorepo migration"`.
  - [ ] Nếu commit FAIL (pre-commit/commit-msg hook reject): `git reset HEAD <các file đã stage>`, ghi log lý do reject, DỪNG — KHÔNG proceed Story 1.2. Fix hook/blocker rồi retry từ Task 2.
  - [ ] Nếu commit PASS: chạy lại `git status` xác nhận 5 file WIP không còn ở vùng unstaged/untracked (AC #5).
- [ ] Task 4: Gate confirmation
  - [ ] Ghi kết quả Gate-0 (satisfied-via-skip HOẶC committed-now) vào Completion Notes. Chỉ khi gate xanh mới được phép bắt đầu Story 1.2.

## Dev Notes

- **Repo hiện tại (đã verify)**: single Next.js app, dùng npm. Root có `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `package-lock.json`. CHƯA có `pnpm-workspace.yaml` hay `turbo.json` (đó là việc của Story 1.2). Branch hiện tại: `main`.
- **Gate-0 state (đã verify)**: `git log --oneline -20 | grep -iE "gate-0|v20 WIP"` → khớp `b578a31`, exit 0. Cả 5 file WIP đều đã tracked & clean (`git status --porcelain` cho 5 path → rỗng). Kết luận: **Gate-0 SATISFIED → đường đi đúng là SKIP commit (Task 1), bỏ qua Task 2-3.**
- **Verify command (copy-paste)**:
  ```bash
  git log --oneline -20 | grep -iE "gate-0|v20 WIP"
  ```
  Exit 0 + dòng `b578a31 ...v20 WIP...` = pass.
- **Quy tắc staging (CRITICAL, theo epics.md — authoritative)**: ở nhánh fallback CHỈ stage explicit file-list, **NEVER `git add -A`**. `architecture.md` và `parallel-dev-strategy.md` có nói `git add -A` nhưng điều đó đã bị **SUPERSEDED** bởi `epics.md` (reviewPatchesApplied:true) — KHÔNG lặp lại. Loại trừ `.playwright-mcp/` và `_bmad-output/` khỏi mọi staging.
- **Untracked artifacts hiện diện trong repo** (`.playwright-mcp/*.log`, `.playwright-mcp/*.yml`, nhiều file dưới `_bmad-output/`): đây CHÍNH là lý do cấm `git add -A`. Một lệnh `git add -A` sẽ nuốt toàn bộ chúng vào commit Gate-0 — sai. Ở repo hiện tại không cần đụng tới vì gate đã satisfied; nếu rơi vào fallback thì tuyệt đối stage tay từng file.
- **Hook reject handling**: nếu repo có Husky/lefthook/commit-msg hook làm commit fail ở fallback, KHÔNG bypass bằng `--no-verify` (sẽ phá quy ước). Đúng quy trình: `git reset HEAD` để gỡ staged, fix root cause của hook, retry. Migration (Story 1.2+) bị BLOCK cho tới khi Gate-0 xanh.
- **Không tạo/sửa file khác**: story này KHÔNG được phép chỉnh `sprint-status.yaml` hay bất kỳ source nào. Output duy nhất là một commit (ở fallback) hoặc một log "satisfied" (đường đi hiện tại).

### Project Structure Notes

- Path WIP đã verify trên disk (lưu ý khác nhẹ so với briefing — các component hero nằm trong thư mục `components/`):
  - `src/components/pixel-blast/PixelBlast.tsx` ✓ tồn tại
  - `src/templates/ternus/components/hero-crystal.tsx` ✓ tồn tại
  - `src/templates/ternus/components/ternus-hero.tsx` ✓ tồn tại
  - `src/templates/ternus/components/ternus-netstrip.tsx` ✓ tồn tại
  - `src/templates/ternus/ternus.css` ✓ tồn tại
- Các file liên quan khác trong `src/templates/ternus/` (config.ts, template.tsx, và các component khác như build-terminal, ecosystem, how-it-works...) đã được commit cùng `b578a31`; không nằm trong danh sách Gate-0 bắt buộc nhưng đã an toàn (tracked & clean).
- Mục tiêu cấu trúc cuối cùng (do các story sau thực hiện, KHÔNG phải story này): pnpm + Turborepo monorepo gồm `apps/docs` + `packages/{design-tokens,ui,sections,templates-*}`. Pins: next@16.2.7, react@19.2.4, tailwindcss@^4, turbo@^2.9, pnpm 9.x.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1: Gate-0 WIP Snapshot] — AC gốc, authoritative.
- [Source: _bmad-output/planning-artifacts/epics.md#Pre-epics checklist] — Gate-0 đánh dấu `[x]` satisfied via `b578a31`.
- [Source: _bmad-output/planning-artifacts/parallel-dev-strategy.md#Lane A serial chain] — vị trí 1.1 trong chuỗi tiền điều kiện Epic 1.
- [Source: _bmad-output/planning-artifacts/architecture.md] — mô tả target monorepo (lưu ý: chỉ dẫn `git add -A` ở đây đã bị epics.md SUPERSEDED, không áp dụng).

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
