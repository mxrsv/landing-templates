---
stepsCompleted: [1, 2]
inputDocuments: ["src/components/pixel-blast/PixelBlast.tsx"]
session_topic: "Landing page crypto theo style pixel-art (PixelBlast), chuyên nghiệp, animation đẹp và đồng bộ"
session_goals: "Trông uy tín/chuyên nghiệp (trust); animation đẹp & mượt; đồng bộ giữa background pixel, màu sắc, typography và animation"
selected_approach: "ai-recommended"
techniques_used: ["Metaphor Mapping", "SCAMPER Method", "Cross-Pollination"]
ideas_generated: []
context_file: ""
---

# Brainstorming Session Results

**Facilitator:** Kyantran
**Date:** 2026-06-05

## Session Overview

**Topic:** Landing page crypto sử dụng thẩm mỹ pixel-art / retro-digital từ component `PixelBlast` (Three.js + WebGL shader, render pixel theo FBM noise, có ripple + liquid distortion, màu mặc định tím pastel `#B497CF`).
**Goals:**

- Trông chuyên nghiệp & uy tín (crypto cần trust).
- Animation đẹp, mượt.
- Đồng bộ — background pixel, màu, typography, animation ăn khớp nhau.

### Session Setup

- Approach: **AI-Recommended Techniques**
- Bộ kỹ thuật: Metaphor Mapping → SCAMPER Method → Cross-Pollination
- Logic: anchor concept đồng bộ → triển khai có hệ thống → đánh bóng chuyên nghiệp.

## Technique Selection

**Approach:** AI-Recommended Techniques
**Analysis Context:** Landing page crypto visual-heavy, ràng buộc cốt lõi là "đồng bộ" + "trust".

**Recommended Techniques:**

- **Metaphor Mapping (Phase 1):** Chốt một ẩn dụ thị giác trung tâm làm sợi chỉ xuyên suốt → đảm bảo đồng bộ.
- **SCAMPER Method (Phase 2):** Generate có hệ thống từng section + animation qua 7 lăng kính.
- **Cross-Pollination (Phase 3):** Mượn polish từ các domain đỉnh → nâng lên mức chuyên nghiệp.

## Ideas Generated

### Phase 1 — Metaphor Mapping (hoàn thành)

**[Foundation #1]: "Living Mesh" — Lưới giao dịch sống**

- _Concept:_ Mỗi pixel = 1 giao dịch on-chain. Màn hình pixel thở/gợn = mạng L2 đang batch & xác nhận real-time. Ripple khi chạm = hành động lan tỏa khắp network.
- _Novelty:_ Background là bằng chứng sống của throughput, không phải trang trí. Map kỹ thuật rollup của L2.
- _Map vào 4 sản phẩm:_ L2 (pixel chảy nhanh = throughput) · Token (pixel tụ thành logo/coin) · Airdrop (pixel rơi/bung như mưa quà) · Launchpad (pixel hội tụ rồi phóng lên).

**[Foundation #2]: Gradient "Cold-to-Warm" = vòng đời giao dịch**

- _Concept:_ Pixel nghỉ = cyan lạnh (đã settle, secured). Hoạt động/được xác nhận = ấm sang cam. Màu phản ứng theo data, không tô đều.
- _Novelty:_ Màu = chỉ báo trạng thái mạng. Cyan giữ vibe institutional/trust, cam thêm hơi ấm con người.

**Quyết định nền tảng (locked):**

- Tone: **calm / premium / uy tín** (KHÔNG degen).
- Palette: nền gần đen (#07070C) · **cyan #22D3EE → cam #FB923C** gradient.
- PixelBlast settings hướng tới: `speed` thấp (~0.3), `patternDensity` thưa, `edgeFade` cao, ripple nhẹ.
- Sản phẩm: **L2 chain + token/coin + airdrop + launchpad**.

### Phase 2 — SCAMPER (đang chạy)

**Ràng buộc bổ sung (locked): Calm motion / accessibility**

- Mọi chuyển động phải CHẬM & ÊM (user thấy chóng mặt với tốc độ nhanh). Settings demo: `SPEED 0.00006`, `DRIFT 8`, ripple `+0.006/frame`, live-tx mỗi 1.8s. → đây là chuẩn cho toàn site.

**Brand:** tên chain = **Ternus**.

**[Section: HERO] — chốt**

- _Layout:_ Nav tối giản (logo Ternus + links Công nghệ/Token/Airdrop/Launchpad/Docs + "Kết nối ví") · wordmark **TERNUS chữ TĨNH sắc nét** (gradient cyan→cam) ngồi trên Living Mesh · eyebrow pill "Layer 2 · Built for speed" · sub + 2 CTA.
- _Quyết định:_ Chọn **chữ tĩnh sắc nét** thay vì mesh-đánh-vần (ưu tiên dễ đọc, an toàn). Mesh chạy nền calm phía sau.
- _Live network HUD (giữ):_ TPS / Gas / Blocks chạy real-time góc phải → đòn trust. Production cần data thật.
- _Polish:_ vignette + glow tạo chiều sâu, CTA gradient, nút "Kết nối ví" viền cyan.
- SCAMPER lens dùng: **Combine** (mesh + live data) + **Modify** (đã thử mesh-reveal, loại) → chốt static.

**Ràng buộc bổ sung (locked): Ngôn ngữ demo = English**

- Mọi text hiển thị trong landing/demo dùng tiếng Anh (nav, hero, section, CTA...).

**[Section #2: PROOF OF SPEED] — chốt concept**

- _Mục tiêu:_ chứng minh L2 nhanh & rẻ → trust.
- _Nội dung:_ eyebrow "Proof of Speed" · headline "Thousands of transactions, batched into one." · lead về rollup settle trên Ethereum.
- _Animation chủ đạo (ẩn dụ rollup):_ `#rollup` mini-canvas — nhiều pixel rời rạc **gom/nén lại thành 1 dải batch** rồi ấm sang cam, loop ~5.2s. = visualize cơ chế rollup.
- _3 stat cards (count-up khi scroll vào view, stagger):_ **9,400 TPS** · **$0.001 avg fee** · **1.2s finality**. Card có top-border gradient cyan→cam, fade-up.
- _Polish toàn trang:_ nav đổi nền blur khi scroll; HUD mờ đi khi rời hero; scroll cue ở hero.
- SCAMPER lens: **Adapt** (đưa cơ chế kỹ thuật rollup thành animation) + **Combine** (số liệu + animation).

**Ràng buộc bổ sung (locked): Mesh CHỈ ở HERO**

- Living Mesh (canvas pixel) chỉ xuất hiện trong hero section, các section dưới để nền tối sạch (#07070C). Lý do: premium hơn, nhẹ máy, mesh thành "chữ ký" của hero. HUD live cũng nằm trong hero.
- Kỹ thuật: canvas absolute trong `.hero` (overflow hidden), size theo hero rect; IntersectionObserver dừng vẽ khi cuộn qua hero; vignette đáy hero fade xuống nền đen để chuyển mượt sang section sau.

**Ràng buộc bổ sung (locked): Pixel pattern = component PixelBlast THẬT**

- Production: hero background dùng thẳng `src/components/pixel-blast/PixelBlast.tsx` (WebGL/Three.js), KHÔNG chế lại pattern. Demo HTML 2D chỉ là **layout proxy**.
- **Map design đã chốt → props PixelBlast (điểm xuất phát, tinh chỉnh trong component thật):**
  - `variant="square"` (pixel-art rõ)
  - `color="#22D3EE"` (cyan)
  - `speed={0.3}` (calm — chậm hơn default 0.5, đúng ràng buộc chống chóng mặt)
  - `patternDensity` thấp (~0.6) + `patternScale={2}` → thưa, premium
  - `pixelSize={4}` (nhỏ → pixel mịn/mảnh; xem [Visual system] bên dưới)
  - `edgeFade={0.6}` (cao) → mesh tan vào nền đen của trang
  - `enableRipples` + `rippleSpeed={0.3}`, `rippleThickness={0.1}` (nhẹ)
  - `transparent` trên nền `#07070C`
  - `autoPauseOffscreen` (khớp mesh-only-in-hero, dừng khi cuộn qua)
  - `liquid={false}`, `noiseAmount={0}` (giữ tĩnh tại/sạch)
- **Design fork — gradient cyan→cam (PixelBlast chỉ hỗ trợ 1 màu):**
  - _(khuyến nghị)_ Mesh = **single cyan**; sắc cam sống ở **text/CTA/glow accents** → KHÔNG sửa component, đúng nghĩa "dùng luôn làm chuẩn".
  - hoặc overlay CSS gradient/orange-glow lên canvas trong suốt → vẫn không sửa shader.
  - hoặc extend shader thêm màu thứ 2 (nhiều việc nhất, sửa "chuẩn").
  - _Lưu ý:_ "cold-to-warm mesh" (Foundation #2) là ý mình tự thêm, không phải yêu cầu gốc → bỏ nó đi là hết mâu thuẫn.
  - **QUYẾT ĐỊNH:** chọn **Mesh cyan thuần, cam ở accents** (không sửa PixelBlast). Foundation #2 (gradient trong mesh) → loại.

**[Section #3: TECHNOLOGY] — chốt concept**

- _Mục tiêu:_ củng cố trust — kiến trúc rollup + bảo mật kế thừa Ethereum.
- _Headline:_ "Built as a rollup. Secured by Ethereum." + lead.
- _Stack diagram (3 lớp, reveal so le khi scroll):_ Apps & Users → **Ternus L2** (execute & roll up, 9,400 TPS, EVM-equivalent — lớp giữa viền cyan nổi bật) → **Ethereum L1** (settle & secure, viền cam). Có **bead sáng chạy dọc** giữa các lớp = giao dịch settle xuống L1.
- _4 pillars (reveal so le, hover sáng viền):_ Fully EVM-equivalent · Trustless bridging · Open-source & audited · Decentralized sequencer (roadmap).
- SCAMPER lens: **Adapt** (kiến trúc kỹ thuật → diagram) + **Combine** (diagram + feature list).

**Thứ tự trang (đang theo):** Hero → Proof of Speed → Technology → **Backed by (light)** → Token → (kế tiếp: Airdrop → Launchpad → Footer/CTA).

**[Cảm hứng Neon.com — học nguyên lý, biến đổi để không clone]**

- _Quan sát:_ Neon (dark · cyan-lục · hairline · editorial · technical) RẤT gần hướng Ternus → validate hướng đi, nhưng phải khác biệt có chủ đích.
- _Khác biệt giữ ADN Ternus:_ motif = pixel mesh + **ETH 3D crystal** (Neon = dải bar EQ); màu = **cyan-lam + 1 chấm cam** (Neon = cyan-lục #00e599, không cam); nút **vuông hairline** (Neon = pill); component **"2 đường kẻ cắt nhau"** + hairline sắc; nội dung crypto (rollup/token/airdrop) vs database.
- _4 thứ ĐÃ học & fold vào (v18), đều biến đổi:_
  1. **Headline hero lớn** — TERNUS thành wordmark nhỏ + status badges; headline "The Layer 2 built for speed." thành tâm điểm (clamp 40–80px).
  2. **Status badges** — "Testnet Live" (chấm xanh) + "Audited" (pill nhỏ).
  3. **Feature strip** dưới hero — 5 mục: Speed · Security · $TERN · Airdrop · Launchpad (icon + 1 dòng, hairline top).
  4. **Light section "Backed by"** — nền cyan-lam nhạt (KHÔNG mint như Neon), logo wall placeholder + 3 stat ($40M · 60+ · 3 audits) → phá mạch tối + trust. (Đặt giữa Technology và Token.)
- _Đã verify bằng Playwright_ (chụp hero / featstrip / backers — render đúng).

**[Section #4: TOKEN] — chốt concept**

- _Layout:_ zig-zag text-trái / visual-phải. Token: **$TERN** (placeholder).
- _Trái:_ label "Token" · headline "One token securing the whole network." · lead · **utility list** 4 dòng (Gas & fees · Staking & security · Governance · Ecosystem incentives) — hairline divider giữa các dòng, reveal so le.
- _Phải:_ **donut phân bổ hairline** (`#donut`) vẽ dần khi scroll (1.5s, ease-out), arc rounded-cap có glow nhẹ, tâm hiện "1B · TERN supply". **Legend** bên cạnh hiện so le.
- _Phân bổ (placeholder):_ Community & Airdrop 40 · Ecosystem 25 · Team 15 · Investors 15 · Treasury 5. Màu chạy gradient cyan→cam theo segment (#22d3ee → #6fd9c9 → #b9d99e → #f0c07a → #fb923c).
- ⚠️ _Cần data thật:_ tên token, tổng cung, % phân bổ khi làm production.

**[Layout system] — chốt: Editorial zig-zag**

- _Vấn đề:_ ban đầu mọi section căn giữa → đơn điệu, giống template.
- _Quyết định:_ **Hero giữ center** (khoảnh khắc đối xứng iconic). Các section sau dùng **container `.wrap` (max 1140px) + lưới `.split` 2 cột**, headline/eyebrow **căn trái** theo gutter nhất quán, nội dung **đảo trái/phải xen kẽ** (zig-zag).
- _Áp dụng:_ Proof of Speed = **text trái / rollup visual phải**, stats thành hàng căn trái bên dưới. Technology = **stack diagram trái / text + 4 pillars (2×2) phải** (đảo chiều).
- _Responsive:_ `.split` → 1 cột ở ≤820px; pillars → 1 cột ở ≤540px.
- _Nguyên tắc cho các section sau:_ tiếp tục đảo chiều để giữ nhịp (Token, Airdrop, Launchpad...).

**[Color discipline] — chốt: Cyan-dominant, cam cực ít, bỏ gradient**

- _Vấn đề:_ đang lạm dụng cam + gradient → rối.
- _Quyết định:_
  - **Cyan là accent chủ đạo** mọi nơi (label, headline, số, donut, logo edges...). Màu phẳng/solid.
  - **Cam chỉ còn 2 element:** (1) **bead trên logo Ethereum** (giao dịch sáng), (2) **segment Treasury** trong donut. Hết.
  - **Bỏ phần lớn gradient text** (title, h2 .grad, số .num/.nv, layer-main → solid). Donut = các sắc **cyan đậm-nhạt** + 1 cam.
  - Mesh ripple đổi từ ngả cam → sáng cyan-trắng. Logo faces cyan (bỏ mặt cam). Rollup "batch" sáng cyan thay vì cam.
- _Lưu ý cho các section sau:_ giữ kỷ luật này — mặc định cyan, cân nhắc kỹ trước khi thêm bất kỳ điểm cam nào.

**[Section backgrounds] — chốt: pattern hairline riêng từng section**

- _Vấn đề:_ hero có mesh riêng, các section dưới trơn giống hệt nhau → thiếu cá tính.
- _Quyết định:_ mỗi non-hero section một **background pattern hairline riêng, rất mờ (alpha ~0.05), TĨNH** (calm, không animation, không đua content), cùng "gia đình" cyan + có mask radial fade mép. (KHÔNG dùng lại pixel mesh — mesh vẫn chỉ ở hero.)
  - Proof of Speed = **lưới chấm** (data points)
  - Technology = **lưới blueprint** (schematic grid)
  - Token = **vòng đồng tâm** (phân bổ / quỹ đạo)
- Kỹ thuật: `section::before` absolute z-0 + `.wrap` z-1; pattern bằng CSS gradient thuần.

**[Visual system] — chốt: Hairline / thin-line aesthetic**

- _Lý do:_ đã dùng pixel thì mọi thứ nên **nét mảnh / line**, KHÔNG khối đặc hay shape lớn — kể cả font.
- _Font:_ dùng **Inter** — heading mảnh (200–300), **body = regular 400** (dễ đọc), label 500. Title nới letter-spacing (~0.06em). (Bỏ bold 700/800.)
- _Components:_ bỏ nền fill gradient → **viền hairline 1px** (góc bo nhỏ 3–4px = "kỹ thuật"), buttons cũng **outline** thay vì khối đặc (kể cả CTA primary).
- _Số liệu:_ font-weight 200, mảnh.
- _Pixel mesh:_ pixel **mịn/nhỏ hơn**. → props PixelBlast cập nhật: `pixelSize` nhỏ (~4), giữ thưa.
- _**4-part component pattern** (từ feedback user):_ với khối chia 4 (vd pillars), KHÔNG dùng 4 ô viền riêng — chỉ **2 đường kẻ hairline cắt nhau tại tâm** chia thành 4 góc, content nằm trong từng góc. Airy, tối giản. (Demo: `.pillars::before` đường dọc + `::after` đường ngang.)
- _Logo mark:_ outline square + chấm gradient nhỏ bên trong (không khối đặc).

**[HERO redesign] — chốt: bỏ center, sang asymmetric**

- _Lý do:_ hero center kiểu cũ trông "vibe-coding đại trà". Đổi sang **text căn trái + logo animation bên phải** → hero cũng theo zig-zag, không còn generic.
- _Trái:_ eyebrow pill · TERNUS (thin, clamp ~94px) · sub · 2 CTA outline · **live network strip** (TPS/Gas/Blocks) dạng hairline ngay dưới CTA (thay cho HUD góc phải cũ).
- _Phải:_ **logo animation** canvas `#logo`. → **CHỐT: logo Ethereum** đúng thương hiệu "L2 secured by Ethereum".
  - **CHỐT: Ethereum 3D octahedron** (8 mặt, 12 cạnh) **lật quanh trục DỌC (Y)** (~18s/vòng, calm) + nghiêng X cố định 0.32 cho cảm giác 3D; painter's algorithm (vẽ mặt xa trước). (v12 thử trục X → v13 đổi sang trục Y.)
  - _Màu rực hơn:_ mặt trên cyan `90,220,255`, mặt dưới cam `255,150,80`; cạnh `rgba(140,235,255,…)` sáng hơn ở mặt trước + **glow** (shadowBlur theo độ trước-sau).
  - _Bead sáng rực:_ chạy quanh belt = 1 giao dịch; **lõi trắng + glow cam mạnh** (shadowBlur ~26), nổi bật.
  - Node pixel ở đỉnh nhấp nháy theo độ trước-sau; bob nhẹ.
  - **CHỐT v17: fill mặt = mảng màu cyan ĐẶC** (không transparent nữa) — flat-shading theo **normal 3D** từng mặt × hướng sáng (trên-trái-trước), lerp cyan đậm `[16,58,80]` → cyan sáng `[165,238,255]`. Khi xoay, các facet sáng/tối chuyển động như viên đá quý. Cạnh = gờ sáng cyan mảnh. Bead cam giữ nguyên (điểm nhấn).
- _Responsive:_ ≤820px logo lên trên (order -1), text dưới.
- _Mesh:_ vẫn nền hero phía sau cả 2 cột.

---

## CHECKPOINT — Review đa agent → Rebuild v19 → Lùi về Wireframe (2026-06-05)

**[Multi-agent design review]** — chi tiết đầy đủ ở file riêng `design-review-strategy-2026-06-05.md`.

- Chạy workflow 6 design-critic song song (hierarchy/crypto-credibility/originality/motion/type-color/message) + 1 director synthesis trên `demo.html` v18.
- **5 gốc rễ "chưa ổn":** (1) không có design system — toàn giá trị ad-hoc; (2) zero ownable identity — "Neon transplant đeo logo Ethereum", chưa dùng hook "Ternus = threefold/ba"; (3) credibility tự bắn vào chân — ship `* placeholders`, số `Math.random`, link `#` chết, `.tag` debug; (4) motion bồn chồn — vi phạm ràng buộc calm, không `prefers-reduced-motion`; (5) message không có wedge — generic, phục vụ 4 audience nên close 0.
- **Hướng:** cứu được — giữ stack, nhưng (a) dọn credibility, (b) áp design tokens, (c) bơm spine **"threefold"**.

**[Rebuild v19 — đã thực thi cả 3 tầng]** (chi tiết ở file strategy)

- Tầng 1 dọn fake + quick wins; Tầng 2 design tokens (`:root`: 3 line-tiers, 2 radius, type scale, weight ladder); Tầng 3 identity threefold (mark 3-nét, headline "Three layers, one network", pipeline 3-lane thay feature-strip Neon, closing CTA + footer).
- Verified bằng Playwright.

**[Bước ngoặt — user feedback]**

- User: _"vẫn đang bị idea, chưa biết sửa như nào, UI vẫn chưa đẹp mắt."_
- **Chẩn đoán thật:** suốt session toàn iterate theo gu AI tự đoán, **chưa bao giờ chốt một mục tiêu thẩm mỹ ("đẹp") mà user thực sự thích** → vòng lặp "generate → chưa đẹp" không hội tụ. Có thể đã over-correct sang quá tối giản/khô.
- **QUYẾT ĐỊNH ĐỔI CÁCH LÀM:** dừng tô màu/animation, **lùi lại vẽ WIREFRAME low-fidelity trước** (`wireframe.html` — grayscale, hộp gạch, không màu/font/motion) để **chốt KHUNG (section nào, thứ tự, mỗi phần chứa gì, layout) trước** — phần lý trí; "đẹp" (màu/font/motion) tính sau — phần cảm tính. Tách 2 việc để "chưa đẹp" không làm nhiễu việc chốt cấu trúc.

**[TRẠNG THÁI HIỆN TẠI]**

- Artifacts: `demo.html` (v19, styled proxy) · `wireframe.html` (low-fi khung) · `design-review-strategy-2026-06-05.md` (review + plan) · `brainstorming-session-...md` (file này).
- **Đang chờ user:** phản hồi trên WIREFRAME (thêm/bớt/đổi thứ tự section). Khung hiện có: Nav → ① Hero → ② Proof → ③ Technology → ④ Ecosystem → ⑤ Token → ⑥ Closing CTA → Footer.
- **2 chặn lớn cần product input (chưa có):** (1) **wedge/USP thật** của Ternus để viết headline sắc (thay "three layers" generic); (2) **số liệu thật** (TPS/fee/finality, tokenomics, audit firm, backers) thay placeholder.
- **Quy trình lên product** (sau khi chốt khung + làm đẹp): wireframe → spec/PRD (`/bmad-prd`) → implement Next.js + gắn `PixelBlast.tsx` thật.

---

## CHECKPOINT — User chốt 3 quyết định → chuyển sang IMPLEMENT (2026-06-06)

User trả lời gate wireframe bằng 3 lựa chọn — **gỡ luôn 2 chặn lớn ở trên**:

1. **Bản chất = TEMPLATE tái dùng** (không phải sản phẩm thật). → Hệ quả lớn: toàn bộ lo ngại "credibility / wedge thật / số liệu thật" trong file `design-review-strategy` **không còn áp dụng**. Đây là 1 mẫu trong thư viện `landing-page-list`. Mình **tự viết copy + số liệu plausible**, tập trung **chất lượng template + thẩm mỹ**. Không cần data thật, không cần hỏi wedge.
2. **Khung = GỘP Proof + Technology** thành 1 section "**How it works**" (review đã chỉ ra 2 phần kể chuyện rollup trùng nhau). Khung mới: `Nav → ① Hero → ② How it works → ③ Ecosystem → ④ Token → ⑤ Closing CTA → Footer`.
3. **Hướng đẹp = Technical / hairline tinh tế** — giữ đúng hướng đang locked (cyan-dominant, line mảnh, calm, Inter mảnh). User chấp nhận "hơi khô". → **Aesthetic đã được CHỐT** (đây là thứ session trước thiếu khiến vòng lặp không hội tụ). Reference thị giác = `demo.html` v19.

**[Quyết định triển khai]** Vì khung + aesthetic + bản chất đã chốt, và đã có v19 làm reference đầy đủ (tokens + copy + 3 canvas) → **bỏ qua bước PRD nặng** (thừa cho 1 template), implement thẳng thành template Next.js thật.

- **Đích:** template mới `src/templates/ternus/` trong thư viện (đúng quy ước: `template.tsx` + `config.ts`, demo route `src/app/(demos)/ternus/page.tsx`, đăng ký ở `src/templates/index.ts`).
- **Kỹ thuật:** hero mesh = **`PixelBlast.tsx` thật (WebGL)** (props theo [Section #2 fork] đã chốt); crystal octahedron + pipeline 3-lane + donut = port canvas 2D từ v19 sang **client components**; CSS = 1 file scoped dưới class gốc `.tn` (giữ nguyên token system v19, tránh đụng catalog/example); font Inter qua `next/font`; tôn trọng `prefers-reduced-motion`.
- **Merge "How it works":** narrative + stack 3 lớp (cơ chế) ở trái, 4 pillars (2×2 cross-hairline) ở phải, 3 stat proof (9,400 / $0.001 / 1.2s) ở dưới làm payoff — gộp Proof + Technology, bỏ kể trùng rollup.
- Next.js 16 app router: global CSS import được từ component (đã verify qua doc + PixelBlast.css). Đã đọc `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`.
