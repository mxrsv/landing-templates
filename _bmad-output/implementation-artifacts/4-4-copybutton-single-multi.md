---
baseline_commit: 1804f41
---

# Story 4.4: CopyButton — Single & Multi File Modes

Status: review

## Story

As a **Alex (indie dev)**,
I want **copy source code của Piece từ gallery**,
so that **tôi paste vào Next.js project và chỉnh sửa trực tiếp**.

## Acceptance Criteria

1. **Given** detail page render Piece, **When** implement copy mechanism chốt: RSC `fs.readFile` tại build theo `pieceMeta.sourcePaths` — MỘT pattern duy nhất cho toàn catalog.
2. `copyMode: "single"` — clipboard = 1 file `.tsx` + header `// deps: <pkgs>`; CSS kèm nối cuối với `/* ---- name.css ---- */`.
3. `copyMode: "multi"` — file tree + tab viewer read-only, copy từng file riêng (đọc từ `sourcePaths`).
4. Copy hoạt động trên desktop (Clipboard API); API denied → fallback select-all code block.
5. Mobile fallback hiển thị code block read-only với select-all affordance.
6. Gates: check-types/lint/build exit 0; SSR smoke `/templates/ternus` chứa source viewer (file tree 18 files).

## Tasks / Subtasks

- [x] **Task 1 — Server source reader** (AC: 1)
  - [x] NEW `lib/catalog/read-source.ts` (server-only): `readPieceSources(piece)` — `fs.readFile` từng `sourcePaths` resolve từ repo root; guard path traversal (resolved path phải nằm trong `<repo>/packages/`); trả `[{ path, name, content }]`; file thiếu → throw fail-fast (build-time).
- [x] **Task 2 — Assemble single payload** (AC: 2)
  - [x] `assembleSingleFile(piece, files)`: header `// deps: <pkgs>` + nội dung file `.tsx` chính + CSS nối cuối với banner `---- name.css ----` dạng block comment.
- [x] **Task 3 — Client CopyButton + SourceViewer** (AC: 3, 4, 5)
  - [x] NEW `components/catalog/copy-button.tsx` ("use client"): `navigator.clipboard.writeText`; API thiếu/denied → fallback `<textarea readOnly>` auto select-all khi focus; label trạng thái (Copy/Đã copy ✓).
  - [x] NEW `components/catalog/source-viewer.tsx` ("use client"): multi → file tree sidebar + viewer `<pre>` read-only theo file đang chọn + CopyButton từng file; single → 1 code block + 1 CopyButton (payload assembled).
  - [x] Mobile/fallback: nút "Select all" dùng Selection API trên `<pre>` — không phụ thuộc clipboard.
- [x] **Task 4 — Wire vào detail page** (AC: 1)
  - [x] `PieceDetail` thành async server component: `sourcePaths` có → `readPieceSources` + render `SourceViewer` (mode theo `copyMode`) dưới preview.
- [x] **Task 5 — Verify gates** (AC: 6)
  - [x] check-types 4/4 / lint 3/3 / build 12/12 exit 0; smoke `/templates/ternus`: 135KB HTML, section "Source", 18 unique source paths, nội dung `template.tsx` embedded.

## Dev Notes

- RSC đọc fs: import `node:fs/promises`, `node:path` trong server module — Next 16 cho phép trong Server Components; KHÔNG import vào file "use client".
- Repo root = `path.resolve(process.cwd(), "..", "..")` (next chạy trong `apps/docs`). Guard: `resolved.startsWith(repoRoot + "/packages/")` — chống traversal nếu sourcePaths bẩn.
- `?raw` import là biến thể cho single-file UI piece — hiện chưa có piece nào `copyMode: "single"`; pattern fs.readFile phủ cả hai mode, `?raw` để ngỏ tới khi Epic 8 cần (ghi chú, không implement dead code).
- Clipboard API chỉ có trên secure context — fallback path bắt cả `navigator.clipboard === undefined` lẫn promise reject.
- Syntax highlight KHÔNG thuộc AC — `<pre>` thuần, tránh kéo dependency mới (HALT rule: new deps cần approval).

### Project Structure Notes

- NEW: `apps/docs/lib/catalog/read-source.ts`, `apps/docs/components/catalog/{copy-button,source-viewer}.tsx`.
- UPDATE: `apps/docs/components/catalog/piece-detail.tsx`.

### References

- [Source: `epics.md#Story 4.4`]
- [Source: `apps/docs/lib/catalog/types.ts` — CopyMode, sourcePaths]

## Dev Agent Record

### Agent Model Used

claude-fable-5

### Debug Log References

- Gates: check-types 4/4, lint 3/3, build 12/12 — exit 0.
- SSR smoke: `/templates/ternus` 135KB, "Source" section + 18 source paths + content `template.tsx` có trong HTML (fs.readFile chạy server-side đúng pattern).

### Completion Notes List

- Pattern copy chốt: server đọc fs (`readPieceSources`, guard traversal trong `packages/`), client chỉ nhận string — `fs` không bao giờ chạm "use client" modules.
- Single mode: `assembleSingleFile` đã sẵn (deps header + tsx + css banner) dù chưa có piece `copyMode: "single"` — Epic 8 UI pieces dùng ngay; `?raw` import để ngỏ như ghi chú, không implement dead code.
- Fallback 2 tầng: (1) clipboard deny → textarea readOnly auto-select; (2) "Select all" qua Selection API trên `<pre>` luôn khả dụng (mobile affordance).
- Syntax highlight ngoài AC — `<pre>` thuần, không thêm dependency mới.

### File List

- `apps/docs/lib/catalog/read-source.ts` — NEW (readPieceSources + assembleSingleFile)
- `apps/docs/components/catalog/copy-button.tsx` — NEW
- `apps/docs/components/catalog/source-viewer.tsx` — NEW
- `apps/docs/components/catalog/piece-detail.tsx` — MODIFIED (async + Source section)
- `_bmad-output/implementation-artifacts/4-4-copybutton-single-multi.md` — story artifact
