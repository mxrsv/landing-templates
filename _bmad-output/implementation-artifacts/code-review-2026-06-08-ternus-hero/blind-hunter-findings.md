# Blind Hunter — Findings (diff only)

- `.tn .badges` đổi từ `display: flex` sang `display: none` — badges hero (Testnet Live, Audited, EVM-equivalent) biến mất hoàn toàn khỏi UI.
- `.tn .netstrip` đổi từ `display: flex` sang `display: none` — component `TernusNetstrip` mới render nhưng không hiển thị; stats throughput/fee/block height mất.
- Netstrip tách khỏi hero sang `template.tsx` (giữa Nav và `<main>`) nhưng không có CSS định vị cho vị trí mới — khi bật lại sẽ nằm dưới nav fixed hoặc layout sai so với demo (netstrip trong hero).
- `TernusNetstrip` vẫn chạy `setInterval` 2.4s dù `display: none` — timer và re-render không cần thiết.
- `PixelBlast.tsx` diff ~1100 dòng chủ yếu re-indent + feature `cursorErase` — khó tách accidental regression khỏi formatting trong review.
- `template.tsx` indent 4-space bên trong function trong khi phần còn lại dùng 2-space — inconsistency style.
- `hero-crystal.tsx` scale 0.34→0.46 không có comment/test — thay đổi visual không verify trong diff.
- `TernusNetstrip` không có `"use client"` guard cho SSR — đã có, OK; nhưng mount ngoài `<main>` không khớp thứ tự section trong plan (Nav → Hero → …).
- Hero `padding: 120px 24px 64px` → `padding: 0 24px 64px` kết hợp `main { padding-top: var(--nav-h) }` — có thể double-count spacing tùy breakpoint.
- `cursorErase` trên hero nhưng mesh canvas `z-index: 0` dưới `.wrap z-index: 2` — erase chỉ hoạt động vùng không bị text che, không full-hero interactive như có thể kỳ vọng.
