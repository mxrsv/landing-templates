[CODE REVIEW — Ternus v20 hero + PixelBlast cursorErase]

🔴 CRITICAL (0):

🟠 HIGH (2):
[H1] Badges hero bị ẩn hoàn toàn — ternus.css:328-329
Proof: `.tn .badges { display: none; }` thay `display: flex` (HEAD + demo-v20.html). JSX badges vẫn render trong ternus-hero.tsx nhưng không visible → mất Testnet Live / Audited / EVM-equivalent.
Fix: Khôi phục `display: flex` hoặc xoá markup nếu cố ý.

[H2] Netstrip stats biến mất + vị trí layout sai — ternus.css:416-417, template.tsx:36
Proof: `.tn .netstrip { display: none; }` + `TernusNetstrip` mount giữa Nav và main không có CSS offset. HEAD có netstrip trong hero `display:flex`; demo-v20.html cũng vậy.
Fix: Đưa netstrip về hero (demo) hoặc bật `display:flex` kèm layout CSS phù hợp nav fixed.

🟡 MEDIUM (2):
[M1] Interval chạy khi netstrip ẩn — ternus-netstrip.tsx:12-18
[M2] liquid+cursorErase đồng thời — mode touch không nhất quán — PixelBlast.tsx:636-640

⚪ LOW (0):

✅ POSITIVE (3):
[P1] cursorErase: aspect brush + trail interpolation — PixelBlast.tsx:120-206
[P2] Reinit khi toggle cursorErase — PixelBlast.tsx:503-508
[P3] Nav/hero height với --nav-h + dvh — ternus.css:46,254-256

## Summary

| Severity    | Count |
| ----------- | ----- |
| 🔴 CRITICAL | 0     |
| 🟠 HIGH     | 2     |
| 🟡 MEDIUM   | 2     |
| ⚪ LOW      | 0     |

Verdict: CHANGES REQUESTED

- 2 HIGH UI regressions cần fix trước merge
- PixelBlast cursorErase feature nhìn chung solid
