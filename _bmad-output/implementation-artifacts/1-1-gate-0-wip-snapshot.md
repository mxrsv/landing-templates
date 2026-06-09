---
baseline_commit: f0538c504a56c905ee93b1ff0ebee1da10457978
---

# Story 1.1: Gate-0 WIP Snapshot

Status: review

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

- [x] Task 1: Verify Gate-0 đã thỏa mãn (AC: #1)
  - [x] Chạy `git log --oneline -20 | grep -iE "gate-0|v20 WIP"` từ repo root.
  - [x] Kỳ vọng exit code 0 và output chứa `b578a31 feat(ternus): v20 WIP, planning artifacts, and architecture docs`.
  - [x] Nếu KHỚP → ghi log "Gate-0 satisfied (b578a31)", SKIP toàn bộ Task 2-3, proceed Story 1.2. Đây là đường đi mong đợi trong repo hiện tại.
- [x] Task 2: [FALLBACK — chỉ khi Task 1 KHÔNG khớp] Stage explicit WIP file-list (AC: #2) — N/A (fallback KHÔNG kích hoạt: Task 1 đã khớp)
  - [x] ~~Xác nhận từng file tồn tại trước khi stage~~ — N/A
  - [x] ~~`git add` từng file một~~ — N/A
  - [x] ~~`git status --porcelain` xác nhận staged set~~ — N/A
- [x] Task 3: [FALLBACK — chỉ khi Task 2 chạy] Commit snapshot & xử lý hook reject (AC: #3, #4, #5) — N/A (fallback KHÔNG kích hoạt)
  - [x] ~~`git commit -m "chore: gate-0 snapshot..."`~~ — N/A
  - [x] ~~Xử lý hook reject~~ — N/A
  - [x] ~~Verify 5 file WIP không còn unstaged~~ — N/A
- [x] Task 4: Gate confirmation
  - [x] Ghi kết quả Gate-0 (satisfied-via-skip) vào Completion Notes. Gate xanh → được phép bắt đầu Story 1.2.

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

claude-opus-4-8 (1M context)

### Debug Log References

```
$ git log --oneline -20 | grep -iE "gate-0|v20 WIP"
b578a31 feat(ternus): v20 WIP, planning artifacts, and architecture docs
EXIT=0
```

### Completion Notes List

- **Gate-0 SATISFIED via skip** (đường đi mong đợi). Commit `b578a31` chứa "v20 WIP" → grep khớp, exit 0 → SKIP commit theo AC #1.
- Task 2 & 3 (fallback staging + commit) KHÔNG kích hoạt vì Task 1 đã khớp — không tạo commit mới, không stage file nào.
- Story thuần process: không thay đổi source, chỉ cập nhật chính story file này (frontmatter + checkbox + Dev Agent Record).
- Thực thi trong git worktree tại `.claude/worktrees/chore+monorepo-migration` (branch `worktree-chore+monorepo-migration`) off `f0538c5` = `origin/main`. Gate xanh → được phép tiếp Story 1.2.

### File List

(Không có file source thay đổi — story process-only.)
