# Code Review Triage — Ternus v20 hero / PixelBlast cursorErase

**Ngày:** 2026-06-08  
**Phạm vi:** uncommitted changes (6 files)  
**Review mode:** no-spec (Acceptance Auditor skipped)  
**Layers:** blind, edge (auditor skipped)

## Findings sau triage

| ID  | Source     | Severity | Bucket  | Title                                                                   | Location                                |
| --- | ---------- | -------- | ------- | ----------------------------------------------------------------------- | --------------------------------------- |
| F1  | blind+edge | HIGH     | patch   | Badges hero bị ẩn (`display: none`) — regression UI                     | `ternus.css:328-329`                    |
| F2  | blind+edge | HIGH     | patch   | Netstrip ẩn + đặt sai vị trí layout                                     | `ternus.css:416-417`, `template.tsx:36` |
| F3  | edge       | MEDIUM   | patch   | `TernusNetstrip` chạy interval khi component ẩn                         | `ternus-netstrip.tsx:12-18`             |
| F4  | edge       | MEDIUM   | patch   | `liquid` + `cursorErase` đồng thời — touch texture mode không nhất quán | `PixelBlast.tsx:636-640`                |
| F5  | blind      | MEDIUM   | defer   | Erase chỉ hoạt động vùng không bị `.wrap` che (z-index)                 | `ternus-hero.tsx`, `ternus.css`         |
| F6  | blind      | LOW      | dismiss | Re-indent PixelBlast làm diff khó đọc — không phải bug runtime          | `PixelBlast.tsx`                        |

**Dismissed:** 1 (F6)  
**Defer:** 1 (F5 — có thể intentional design)

## Chi tiết patch

### F1 — Badges ẩn

- **Detail:** Trước commit `.tn .badges { display: flex }`. Diff đổi thành `display: none`. Demo v20 và HEAD đều hiển thị badges.
- **Fix:** Khôi phục `display: flex` hoặc xoá JSX badges nếu cố ý bỏ.

### F2 — Netstrip ẩn + layout

- **Detail:** Netstrip tách sang `TernusNetstrip` nhưng CSS `display: none`. Trước đây nằm trong hero với `display: flex`. Component mới đặt ngoài `<main>` không có offset cho nav fixed.
- **Fix:** Hoặc đưa netstrip về cuối hero-left (khớp demo v20), hoặc thêm CSS fixed/sticky + `display:flex`; xoá component nếu chưa dùng.

### F3 — Interval khi ẩn

- **Detail:** `setInterval` block height tick chạy dù netstrip không hiển thị.
- **Fix:** Không mount `TernusNetstrip` khi ẩn, hoặc guard interval bằng visibility/`useInView`.

### F4 — liquid + cursorErase

- **Detail:** `erase: cursorErase && !liquid` tắt erase mode texture nhưng `uEraseStrength` vẫn bật khi `cursorErase`.
- **Fix:** Document mutual exclusion, hoặc force reinit + consistent erase path khi cả hai bật.

## Positive

- `cursorErase` feature: aspect-corrected touch canvas, interpolation trail, shader guard `uEraseStrength > 0` — implementation thoughtful.
- `cursorErase` trong `needsReinitKeys` — toggle prop không leak stale WebGL state.
- Hero layout: `--nav-h`, `main padding-top`, `hero min-height` dùng `dvh` — hợp lý cho fixed nav.
- TypeScript compile pass.

## Verdict

**CHANGES REQUESTED** — 2 HIGH UI regressions (badges + netstrip hidden), 2 MEDIUM patch items.
