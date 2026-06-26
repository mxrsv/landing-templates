# Helix — token specimen NOTES (frontend-design-bar Phase 1) ✅ CHỐT

> PROTOTYPE — throwaway. Spec: `docs/specs/2026-06-26-template-restaking-helix.md`.
> Token đã CHỐT (user eye-review 2026-06-26). Folder này có thể xoá sau khi token
> được fold vào `helix-hero/`.

## Làn ĐỘC LẬP (user-stated)

Helix KHÔNG đi theo CSS/token sẵn có nào — token/font/CSS riêng, KHÔNG import
`@landing/design-tokens`, KHÔNG chịu floor INVARIANT (Inter-only). Gate còn áp dụng
= **chất lượng** (gu mood + Production Bar + eye-review), không phải coupling token.

## Token CHỐT (Phase 1, v3 — refs Polygon, user-steered)

- **Font:** 1 font = **Clash Display** (Fontshare CDN). Bỏ mono (user override gu).
  Uppercase CHỈ cho bracket tag nhỏ + button label; phần còn lại case thường.
- **Palette:** **iridescent blue→violet→pink** (override gu "chỉ green", RIÊNG làn
  này). primary = violet `#7C5CFF`; stops blue `#5B8DEF` → violet → pink `#C77DFF`;
  teal `#34E0C4` dự phòng. Lime-green bỏ.
- **Surface:** cool indigo near-black `#08070F → #1D1A34`. Ink ramp 95/66/40.
- **Edge:** **chamfer / cắt góc** (clip-path, cut top-left + bottom-right). cut
  12px (panel) / 7px (nhỏ). Hairline-bordered chamfer = kỹ thuật 2 lớp.
- **Tag:** `[ BRACKET ]` chamfer + uppercase Clash.
- **Bg:** blueprint grid mờ (72px, mask fade) + glow iridescent góc trên.
- **Motion token:** ease `cubic-bezier(0.16,1,0.3,1)`, 160/280/560ms.

Giá trị MỀM còn lại (lock bằng mắt ở Phase 3): exact violet/iridescent stops, độ
sâu chamfer, cường độ grid/glow.

## ⚠️ Mang sang phase sau

- Clash Display là display face → soi kỹ body/caption + slashed-zero/tnum ở P3.
- Glow nền = CSS proxy cho volumetric light; focal thật (torus-knot iridescent
  WebGL) = **Focal track** song song, user verify live (headless không có WebGL).

## Verdict

- Token đúng gu chưa: **✅ CHỐT** (user "ok chốt phase 1", 2026-06-26).
- Component classes (hx-tag/hx-btn/hx-panel/hx-ledger/chamfer utils) = reusable,
  fold sang `helix-hero/` làm foundation Phase 2.
