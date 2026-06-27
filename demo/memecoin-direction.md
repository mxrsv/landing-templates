# Memecoin — Design Direction: "MINTED"

> Mục tiêu: nâng skeleton (chữ-trên-void, một-cột-căn-giữa, phẳng đen, không focal)
> lên beautiful baseline. Đạt P-2 (focal artifact) + P-6 (phá one-column).
> Mood LOCKED = neon (electric magenta trên violet-black), theme chỉ override `--p-*`.

## 1. Mood

Degen-grade energy + infra-grade restraint. Cinematic, premium, hơi "nguy hiểm".
Không cartoon-mascot (lane rẻ tiền của memecoin template chợ). Không centered-floating-orb
(đã thành cliché của Monad/Blast/Berachain — xem references). Bold nhưng kỷ luật:
tiêu xài "boldness" vào ĐÚNG MỘT chỗ là focal coin, mọi thứ quanh nó giữ yên tĩnh.

## 2. Focal artifact — THE COIN, treated editorially

Một đồng $MEME 3D **được "đúc/dập" (minted)**, KHÔNG phải orb tròn trôi nổi giữa màn hình.

- Chất liệu: chrome body + glass dispersion ở cạnh (tán sắc cầu vồng), rim light
  magenta `#d946ef` + cyan `#22d3ee` (second light). Bloom nhẹ + chromatic aberration ở mép.
  → tái dùng đúng công thức đã chứng minh ở `demo/three-glass-cube.html` + `three-holo-flower.html`.
- Bố cục: **cực lớn, crop cứng tràn ra mép phải**, đè l/lồng vào headline (z-layer interplay) —
  đây là cú phá cliché "coin tròn căn giữa".
- Hình: đồng coin dày, mặt dập chữ/ký hiệu (emboss), nghiêng ~15°, xoay chậm vĩnh viễn.

## 3. Layout system — phá one-column

Editorial asymmetric split (KHÔNG còn một-cột-căn-giữa):

```
┌───────────────────────────────────────────────┐
│ nav: $MEME ........................ Stats Buy   │
├──────────────────────────────┬────────────────┤
│ • Live on Monad              │                 │
│ THE COIN THAT               ╱│   ◉ 3D COIN     │  ← coin tràn mép phải,
│ ACTUALLY SENDS IT          ╱ │     (huge,       │    đè lên cụm chữ
│ [slot price] [ticker]     ╱  │      cropped)    │
│ [Buy $MEME] [Litepaper]      │                 │
├──────────────────────────────┴────────────────┤
│  surface-1 band → token-stats-strip (count-up) │
├────────────────────────────────────────────────┤
│  surface-0 → community-marquee                  │
├────────────────────────────────────────────────┤
│  surface-2 closing CTA (asymmetric, không giữa) │
└────────────────────────────────────────────────┘
```

- Left ≈55%: eyebrow → oversized condensed headline → slot price + ticker → CTA pair.
- Right ≈45%: coin artifact bleed off-canvas.
- Depth bands bằng surface ramp `--surface-0..3` thay cho phẳng đen 1 tông.
- Section rhythm bằng `--section-pad-y-*`.
- Mobile: stack — coin lên trên (nhỏ hơn, vẫn crop), text dưới.

## 4. Type / color

- Headline: oversized, tracking âm, weight nặng, condensed feel — biến type thành nhân vật,
  không chỉ là cái khung chứa chữ. (Body giữ Inter theo design system hiện tại.)
- Utility/data (ticker, stats): mono/tabular feel → cảm giác "thị trường".
- Color: từ neon tokens. Magenta = primary, cyan = second light/accent.
  Surface ramp tạo chiều sâu, không thêm màu mới.

## 5. Motion signature — chỉ MỘT

Coin xoay chậm vĩnh viễn + **dispersion/aberration "charge up"** (mạnh lên) khi hover/press CTA
= cú hích degen. Ticker marquee + count-up stats đã có sẵn, giữ nguyên — không thêm motion vụn.
`prefers-reduced-motion`: freeze coin thành 1 still đẹp, tắt charge.

## 6. Risk (1 cú, có lý do)

Coin 3D cực lớn crop-editorial + lồng z-layer với headline (thay vì coin tròn căn giữa an toàn).
Justify: vừa né cliché category, vừa tạo hierarchy thị giác trội — đúng thứ skeleton đang thiếu.

## References rút đòn

- Lane "crypto L1 hero" (Monad/Blast/Berachain): 3D coin + neon glow + bold display + dark +
  perf stats — ta lấy bộ khung này NHƯNG né "centered floating orb" bằng editorial crop.
- pump.fun/Jupiter: community + virality + ticker/data-dense → giữ ticker + stats làm "market feel".
