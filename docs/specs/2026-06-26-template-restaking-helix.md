# Spec: Template "Helix" — landing liquid restaking (signature: The Threaded Knot)

**Date**: 2026-06-26

## 1. Bối cảnh

**Origin**:

- "chuẩn bị tạo thêm template mới trong landing-templates này" → chốt: **concept hoàn toàn mới**, ngành **fintech/crypto**, **brainstorm signature trước**.
- Signature đã chọn (poll 3 hướng): **C — The Threaded Knot**. Brand đã chốt: **Helix**.

**Problem**:

- Catalog cần thêm một template landing **đẹp, có gu, không generic**; điểm nhấn là **craft/aesthetic**, không phải vertical.
- Các template crypto đã có (Memecoin degen, GameFi, NFT, Fluxion DeFi-routing) → template mới phải né các niche đó và có signature riêng, swap-test mạnh.

**Decisions**:

- Subject = giao thức **liquid restaking / shared security** (né hẳn DeFi-routing của Fluxion). Lý do: hình nút thắt = "một sợi luồn qua nhiều vòng" = restaking → focal CHÍNH LÀ subject.
- Brand = **Helix** (xoắn/spiral, khớp knot + ribbon sáng). Reject: Strand/Filament/Coil — Helix đọc ra "xoắn ốc bảo chứng" rõ nhất.
- Gu **bất biến** (không bàn lại): nền đen cinematic · accent **chỉ xanh neon** · focal volumetric light + 3D iridescent · bold geometric sans headline + mono label. Reject: serif, nền sáng/trắng, console/data-viz, card UI glass.
- Giai đoạn này = **prototype hero trước** theo eye-review gate, CHƯA productionize vào `packages/templates-*`.

## 2. Nguồn dữ liệu chuẩn

**Canonical**:

- Gu thiết kế: memory `frontend-taste-profile.md` (lời user, đã chốt qua poll 2026-06-26) — nguồn chân lý cho mọi quyết định màu/focal/chữ.
- Gate chất lượng: `packages/design-tokens/INVARIANT.md` (token floor) **+** `docs/PRODUCTION-BAR.md` (P-1…P-10, design ceiling). Lên `production` phải pass **cả hai**.
- Quy trình build: memory `assembly-layering.md` (Foundation → Pieces → Final) + `frontend-design-bar` skill `references/pipeline.md` (Rule 0 — eye-review gate ở mọi phase).

**KHÔNG phải nguồn chuẩn**:

- Prototype Fluxion/Aura cũ (`apps/docs/app/dev/fluxion-*`, `aura-hero`, `proto/fluxion-*.html`): palette cyan→violet + concept institutional/serif là **pre-lock hoặc đã bị loại** — chỉ dùng làm nguyên liệu harvest, KHÔNG làm chuẩn gu.
- Bất kỳ giá trị lever taste-level nào (accent OKLCH chính xác, easing, texture) do AI tự bake → phải qua eye-review của user mới đứng.

## 3. Kiến trúc giải pháp

**Components**:

- **Focal — The Threaded Knot**: torus-knot (kiểu (2,3)) chất glass-chrome iridescent, fresnel ám xanh neon; xoay chậm; một **ribbon sáng volumetric xanh** spiral luồn xuyên lõi tube. Là vật thể-ánh-sáng, KHÔNG phải chart. Production = three.js WebGL thật; reduced-motion → ảnh iridescent tĩnh; môi trường headless không WebGL → proxy CSS để review bằng mắt, focal thật user verify live trong Chrome.
- **Hero**: eyebrow mono + headline bold-sans + 1 primary CTA ("Restake" / "Start restaking") + proof strip; focal nằm bên (asymmetry, P-6) chứ không text-on-void.
- **Stats**: TVL restaked / AVS secured / operators / chains — số tin được (P-1), mono + tnum/slashed-zero.
- **How-it-works**: 3 bước threading (deposit → restake → secure AVS), reveal-on-scroll, kể đúng story "1 strand bảo chứng nhiều mạng".
- **AVS / ecosystem**: showcase các mạng/dịch vụ mà một dòng vốn bảo chứng (de-stock grid, không ô gradient rỗng).
- **Operators**: lớp vận hành (proof-forward).
- **CTA band + Footer**.

**Restraint / composition map**:

- Hero = **LOUD** (focal + motion + headline đè). Stats + How-it-works = vừa. AVS/Operators/Footer = im.
- Accent xanh neon dùng như **hệ thống** (2–3 điểm nghĩa lý + state nhất quán): ribbon focal · primary CTA · active/hover state · 1 metric nhấn · section tick.

**Data Flow**:

- Không có (landing tĩnh, content hardcode trên-voice). Focal là client-side WebGL, lazy-load, không phụ thuộc data ngoài.

## 4. Failure modes

- Khi xuất hiện màu accent khác xanh neon (cyan/violet/magenta…), build phải coi là **vi phạm gu** và chặn.
- Khi focal trượt thành chart/data-viz/logs hoặc card glass UI, phải coi là **vi phạm gu** và chặn (giữ nó thuần vật-thể-ánh-sáng).
- Khi có số liệu `0`/`$0.0M`/lorem/`Title here` ở bất kỳ đâu, vi phạm **P-1**, chặn.
- Khi xuất hiện nền sáng/trắng hoặc headline serif, vi phạm gu, chặn.
- Khi WebGL không khả dụng hoặc user bật reduced-motion, focal phải **fallback** sang ảnh/khối iridescent tĩnh (không vỡ layout, P-9 vẫn an toàn).
- Khi một treatment/lever value bị AI tự bake làm final mà chưa qua mắt user, vi phạm **Rule 0**, phải đưa ra dạng treatment spec để user lái trước.

## 5. Hoàn thành & Loại trừ

**Done** (cho mốc prototype hero — mốc đầu):

- Hero "muốn dùng": pass eye-review của user, đúng gu, có focal Threaded Knot (proxy CSS ok ở mốc này), ≥2 breakpoint, reduced-motion an toàn.
- Treatment các element được surface dạng spec (lever values rõ) cho user lái trước khi apply.

**Done** (cho mốc productionize — mốc sau, tách việc):

- Full landing pass **cả** INVARIANT + Production Bar (P-1…P-10), eye-review từng tier (Foundation → Pieces → Final), reduced-motion + perf budget verify.

**Not done**:

- CHƯA productionize vào `packages/templates-helix` ở mốc prototype; CHƯA harvest Pieces vào `@landing/sections`; CHƯA storefront/pricing/license.
- KHÔNG dùng prototype Fluxion/Aura cũ làm chuẩn gu (chỉ harvest nếu hợp).
- KHÔNG build focal WebGL "final" và tự tuyên bố đẹp — user verify live mới chốt.

## 6. Câu hỏi mở

- **ASSUMPTION**: Focal production = three.js WebGL thật; user verify live trong Chrome vì LLM không screenshot được WebGL (headless không có WebGL).
- **ASSUMPTION**: Mốc prototype hero làm ở `apps/docs/app/dev/helix-hero/` (theo pattern `fluxion-hero`/`aura-hero`), throwaway, xoá sau khi fold vào template thật.
- **QUESTION**: Copy/voice cụ thể (headline, eyebrow, 3 bước) sẽ chốt ở Phase 2 (Skeleton) khi có content thật — cần user duyệt giọng.
- **QUESTION**: Giá trị accent xanh neon chính xác (OKLCH), easing, độ bóng/iridescence của knot là lever taste-level — surface dạng treatment spec ở Phase 1/3 cho user lái, KHÔNG bake sẵn.
