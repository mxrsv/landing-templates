# Handoff — Waitlist template (Aenor)

> Checkpoint cho agent kế tiếp. Ngày: 2026-06-14. Branch: `feat/waitlist-template`.
> Tài liệu nguồn (KHÔNG lặp lại ở đây, tham chiếu trực tiếp):
>
> - Spec: `docs/superpowers/specs/2026-06-14-waitlist-template-design.md`
> - Plan: `docs/plans/2026-06-14-waitlist-template-implementation.md`
> - Harvest log: `docs/ideas/harvest-log.md`
> - PR: https://github.com/mxrsv/landing-templates/pull/2

## Trạng thái hiện tại

- Template Waitlist (Aenor) **xong 10/10 task**, gate xanh, **PR #2 đang mở** (`feat/waitlist-template` → `main`).
- Template thứ **5/17** trong catalog (`apps/docs/lib/catalog/manifest.ts`: `EXACT_TEMPLATES=5`, `MAX_TOTAL=17`).
- Routes: `/templates/waitlist` + `/preview/waitlist`. Preview served từ `apps/docs`
  (`cd apps/docs && PORT=3000 pnpm dev`).
- Package: `@landing/templates-waitlist`, skin "Ion" (token `--wl-*`) trên `data-theme="infra"`.

## Việc còn lại / chưa xong

### 1. Design debt thị giác (đã nêu, CHƯA fix) — ưu tiên

Triệu chứng từ screenshot user:

- `flow-knot.tsx` là backdrop `position:fixed` full-bleed sau MỌI section → đè/cắt nội dung
  (Backers marquee, Transform stepper khó đọc).
- Palette gần như monochrome cyan; token accent `--wl-vi` / `--wl-pop` / `--wl-grad` chưa dùng.
- Thiếu focal point / highlight nổi bật.

Hướng fix đề xuất: giảm opacity/scale knot theo section, thêm scrim/mask sau `.wrap`, hoặc
giới hạn knot ở hero; dùng accent token có chủ đích. (Prompt review thị giác đã soạn trong
hội thoại trước — nếu cần, chạy review trước khi fix.)

### 2. Open review findings (defensible, chờ go-ahead)

- **M1** — `reach-globe.tsx:117`: `const dpr` đọc 1 lần ở effect mount → stale khi đổi DPI/zoom.
  Parity với `flow-knot.tsx:154` (cùng pattern, cùng vấn đề).
- **M2** — gauge micro-jump (count-up khởi động).
- **L1** — `.transform-body` dùng `animation: wl-fade-in` không bị kill trong
  `@media (prefers-reduced-motion)`; unreachable vì reduced render `transform-static`, nhưng nên dọn.

### 3. Hậu PR

- Sau merge: `git fetch` + reset local `main` về `origin/main`.
  (Local `main` đang ahead; chưa rewind để giữ file dở `token-stats-strip.css`.)

## File đang dở / cố ý không đụng

- `packages/sections/src/token-stats-strip/token-stats-strip.css` (M) — WIP của người khác, KHÔNG đụng.
- `.planning/`, `demo/` — untracked, doc tạm.

## Memory candidates (đề xuất, chờ user duyệt — CHƯA ghi)

Chi tiết đầy đủ ở hội thoại. Tóm tắt 7 mục:

1. `waitlist-template-status` (project) — trạng thái template + PR.
2. `waitlist-design-debt` (project/feedback) — lỗi thị giác chưa fix (xem mục 1 ở trên).
3. `ion-skin-token-signal` (project) — spec §4: Ion đẻ quá nhiều `--wl-*` = tín hiệu mở rộng token floor.
4. `waitlist-english-copy` (UPDATE) — mọi section đã English; áp cho template tương lai.
5. `template-production-model` (UPDATE) — harvest-log.md đã tạo + seed.
6. `no-pnpm-exec` (feedback) — tránh `pnpm exec`; dùng `pnpm <script>` / `pnpm --filter`.
7. `dev-server-pattern` (reference) — preview từ apps/docs; Playwright MCP không toggle được
   `prefers-reduced-motion`/WebGL-off → verify path đó bằng code.

## Ràng buộc còn hiệu lực

- Trả lời tiếng Việt + emoji; focus mode ON (user chỉ thấy final message).
- KHÔNG tự tạo branch trừ khi PR/được yêu cầu. KHÔNG dùng `pnpm exec`.
- Landing copy = English. INVARIANT I-1..I-9 bắt buộc (hex carve-out CHỈ cho WebGL/Canvas2D).

## Suggested skills cho agent kế tiếp

- `frontend-ui-engineering` — fix design debt thị giác (overlap, accent, focal point).
- `browser-testing-with-devtools` — verify trực quan trước/sau fix (screenshot, console sạch).
- `code-review` (dispatch `code-reviewer`) — review sau khi fix design debt.
- `git-workflow-and-versioning` — atomic commits + hậu-merge reset local main.
