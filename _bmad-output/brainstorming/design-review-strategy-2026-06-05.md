# Ternus Landing — Design Review Strategy

_Nguồn: multi-agent review (6 design critics + 1 director synthesis) trên `demo.html` v18, ngày 2026-06-05._

## 🎯 Chẩn đoán: vì sao đang "chưa ổn" (5 gốc rễ)

1. **Không có "system" — toàn giá trị ad-hoc.** Mọi `<section>` đều `min-height:100vh + justify-content:center` → content nhỏ trôi trong không gian chết (rõ ở `#backers`, `featstrip`). Border rải rác 6 độ mờ cyan; radius 4/8/9/16/100px lẫn lộn; `.h2` dùng cho 2 cỡ khác hẳn; `.title` định nghĩa nhưng không dùng. Thiếu **token scale** cho spacing/weight/color/radius/tracking → nhìn như bản nháp lắp ghép.
2. **Zero ownable identity — "Neon transplant đeo logo Ethereum".** Silhouette gần 1:1 Neon (hero split + 5-up feature strip hairline-top + light "Backed by" + logo wall). Vật thể to nhất trang (octahedron) nói "Ethereum", không nói "Ternus". Hook mạnh nhất mà cái tên tự trao — **Ternus = "threefold / ba"** — không xuất hiện ở đâu.
3. **Credibility tự bắn vào chân (fatal cho L2).** Ship cả dòng `* Logos & figures are placeholders`; số "live" TPS/Gas/Blocks là `Math.random`; nav link `#` chết; `.tag` "Demo v18" bleed mọi section; audit không tên firm; backer tên bịa. Với khán giả crypto = dấu hiệu rug/vaporware.
4. **Motion bồn chồn — vi phạm ràng buộc "calm".** 4+ animation loop vĩnh viễn, không cái nào resolve; không có `prefers-reduced-motion`; 2 canvas vẫn redraw khi đã khuất. Là "tech demo", không phải "premium product".
5. **Message không có wedge.** Headline "fast / near-zero fees / Ethereum-grade security" = y hệt 20 chain khác. Trang chiều cùng lúc dev + speculator + airdrop farmer → không ai được dẫn tới quyết định. Scroll kết ở donut, không có closing CTA.

## 🧭 Hướng đề xuất: CỨU ĐƯỢC — mài sắc + bơm identity (không pivot)

Giữ nguyên locked stack (pixel mesh + ETH crystal + cyan-dominant + 1 orange micro + near-black). Vấn đề là **thiếu kỷ luật hệ thống + thiếu spine nhận diện**. Spine có sẵn miễn phí: **"threefold"**.
Định vị: _Ternus — three layers, one network._ (Apps → Ternus → Ethereum vốn đã là 3 lớp.)

**Adjudication (chốt mâu thuẫn theo brief):**

- **ETH crystal: GIỮ** (heritage motif, pay off "Secured by Ethereum"). Đẩy ownability "threefold" sang mark/copy/animation. Optional bigger move: tiến hóa geometry về 3-fold (antiprism) thay octahedron.
- **Orange: GIỮ MICRO**, nhưng cho nó **một việc** = "act/now" (đúng 1 chỗ/viewport: CTA glow HOẶC số live-TPS HOẶC status dot).
- **Airdrop: DEMOTE** (bỏ khỏi feature strip + nav primary, section khiêm tốn, KHÔNG countdown/urgency).
- **Rollup animation:** animate **once on scroll** rồi giữ frame cuối; ở yên section của nó.

**3 bold moves để ownable (không generic, không Neon):**

1. **"Threefold" làm xương sống** — vẽ lại `.mark` thành glyph 3-element; đặt tên kiến trúc 3 lớp; mọi nhóm số là nhóm-3; tagline earn cái tên ("threefold throughput").
2. **Giết 5-up feature strip (tell rõ nhất của Neon)** → thay bằng **pipeline 3-lane**: tx chảy qua _transaction → rollup → Ethereum settle_, animate once-on-scroll, dừng frame settled. Thay luôn cả rollup loop nhàm.
3. **Duotone nhiệt-độ cyan↔orange như một story:** cyan = mạng (lạnh), orange micro = giao dịch đang settle (nóng). Một khoảnh khắc orange có nghĩa.

## ✅ Quick wins (nhanh, tác động cao)

1. Xóa `.tag` debug + dòng `* placeholders` + sửa `<title>`/meta thật + strip comment tiếng Việt trong source.
2. Bỏ blanket `min-height:100vh + justify-content:center` mọi section → `padding: clamp(96px,12vh,160px) 24px`, align top. Chỉ hero giữ 100vh.
3. Sửa Backers khỏi flip trắng → panel tối `#0c0d14` + border cyan-12% top; logo `rgba(234,253,255,.55)` hover `.9`; bỏ teal lạc.
4. Hero headline về weight 200–300 (đang 400). Weight ladder: headline 200 → h2 300 → body 400.
5. Bỏ brandrow lặp (TERNUS thứ 2 dưới nav). Giữ status badges làm eyebrow → H1 lên cao.
6. Gate 2 canvas khuất (`logoDraw`, `rDraw`) + clear `setInterval` HUD khi hero khuất.
7. Bỏ `setInterval` auto-ripple 1800ms → mesh thành calm field tĩnh.
8. Thêm `@media (prefers-reduced-motion: reduce)` + gate rAF bằng `matchMedia`. (Bắt buộc.)
9. Cho orange 1 việc (CTA glow HOẶC live-TPS). Gỡ bead orange trên crystal (đang out-shout CTA).
10. Thay dingbat/emoji icon (⚡◈✦▲) bằng 1 line-icon set thống nhất (Lucide/Phosphor-thin), 20px, stroke 1px, cyan.

## 🚀 Bigger moves

1. **Token system** rồi thay mọi hardcode: border 3 bậc (.10/.16/.32), radius 2 giá trị (4px + 999px), tracking scale, type scale named (xóa `.title` chết).
2. **Viết lại headline quanh wedge thật** (vertical / cơ chế độc nhất / con số ownable). "Fast/cheap/secure" lui xuống supporting. _Nếu chưa có differentiator → đó là vấn đề product cần nói thẳng._
3. **Pipeline 3-lane** thay 5-up feature strip (closing band của hero, trong cùng 100vh).
4. **Sửa credibility infra:** link thật (Bridge/Explorer/Docs/GitHub/Discord/Add-to-wallet); audit có tên firm + link; backer logo thật hoặc cắt; HUD wire RPC testnet thật + label "Testnet" hoặc bỏ.
5. **Gộp Proof of Speed + Technology** (đang kể trùng rollup 2 lần) thành 1 "How it works": problem → cơ chế → proof (metric thật) → how to start. Nói rõ rollup type (ZK/optimistic), DA layer, trạng thái sequencer.
6. **Chốt 1 audience + 1 path** (đề xuất developer-first): hero "Start building" → How it works → Proof → closing CTA "Deploy your first contract". Token/Airdrop demote.

## ⚖️ Ưu tiên #1

**Xóa toàn bộ fake/debug artifact trước tiên:** `.tag` "Demo v18", dòng `* placeholders`, nav link `#` chết, comment tiếng Việt, số `Math.random` "live".
Lý do: với L2, **credibility là điều kiện cần**. Người xem savvy thấy "placeholders" / `Math.random` là mất trust ngay → mọi cải tiến hierarchy/identity/motion phía sau thành vô nghĩa. Làm sạch nền (vài giờ, 0 rủi ro thiết kế) rồi mới xây identity "threefold" lên trên.

---

## ✅ ĐÃ THỰC THI — demo.html v19 (build lại sạch theo cả 3 tầng)

**Tầng 1 — Dọn fake + quick wins:**

- Xóa `.tag` debug, dòng `* placeholders`, comment tiếng Việt; `<title>`/meta thật.
- Bỏ blanket `100vh + center` → `padding: clamp(96px,12vh,168px)`; chỉ hero giữ 100vh.
- HUD: bỏ `Math.random` TPS/gas → số tĩnh hợp lý + label **testnet**; chỉ block-height nhích nhẹ.
- Nav/footer link thật (#tech/#token/#ecosystem/#start + GitHub/Discord) + **closing CTA** "Deploy your first contract".
- `@media (prefers-reduced-motion: reduce)` + gate rAF; canvas tự dừng khi khuất; bỏ auto-ripple → mesh thành calm field tĩnh.
- Weight ladder: headline 200 → h2 300 → body 400.
- Orange chỉ còn 2 chỗ có nghĩa: **live dot** (hero) + **pipeline settle** + Treasury donut — gỡ bead cam khỏi crystal.
- Thay emoji/dingbat → **line-icon SVG thống nhất** (20px, stroke cyan).
- Ecosystem: bỏ flip trắng → **dark panel** `--panel`.

**Tầng 2 — Design system:** `:root` tokens — surfaces, cyan tiers, **3 line tiers** (.10/.18/.34), **2 radius** (4px + pill), tracking scale, **type scale named** (display/h2/h3/body/cap/eye), weight ladder, spacing. Mọi hardcode thay bằng `var()`.

**Tầng 3 — Identity "threefold":**

- **Mark 3-nét** (3 thanh tăng dần) ở nav + footer + logo wall.
- Headline "**Three layers, one network**"; Technology = "**Three layers, one trust model**" với stack **01/02/03**.
- **Pipeline 3-lane** (Transactions → Rollup batch → Ethereum settle) thay 5-up feature strip của Neon; animate **once-on-scroll**, dừng frame settled; orange micro chỉ loé ở settle.
- Proof of Speed bỏ rollup loop (de-dup) → 3 stat phân tách bằng hairline dọc.

_Đã verify bằng Playwright (hero + full page render đúng)._ Còn để ngỏ (cần product input): viết lại headline quanh **wedge thật** (vertical / cơ chế độc nhất / số ownable) thay "three layers"; wire RPC testnet thật cho HUD.
