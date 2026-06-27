# Helix HERO — NOTES (frontend-design-bar Phase 2→4)

> PROTOTYPE — throwaway. Spec: `docs/specs/2026-06-26-template-restaking-helix.md`.
> Làn ĐỘC LẬP (token/font/CSS riêng). Route: `/dev/helix-hero`.
> Xoá folder khi fold vào `packages/templates-helix`.

## Trạng thái phase (đã qua eye-review user)

- **Phase 1 — Token** ✅ chốt: iridescent blue/violet/pink · chamfer · 1 font Clash
  Display · blueprint grid · bracket tag. Foundation: `helix-tokens.css`.
- **Phase 2 — Skeleton hero** ✅: nav + hero lệch + focal + proof ledger, content thật.
- **Focal track** ✅ (chọn live qua `/dev/helix-focal-options`): **Shards** = cụm
  octahedron iridescent glass bay (`shards-focal.tsx`, three.js). WebGL — verify live,
  fallback CSS gem khi no-WebGL/reduced-motion.
- **Phase 3 — Treatment** ✅: corner tick (vạt tam giác góc, signature Polygon) trên
  button/panel · primary violet solid (không gradient) · headline two-tone + weight
  contrast (clause-1 700, clause-2 500 muted) · hover glow violet trên primary.
- **Phase 4 — Motion** ✅ chốt **biến thể B "Snap precise"** (`hero-motion.tsx`):
  GSAP timeline expo.out + SplitType headline line-reveal + mouse-parallax shards.
  Reduced-motion safe. (A/C đã bỏ.)

## Lib (apps/docs deps)

three@0.184 · @types/three · gsap · split-type.

## Còn lại (pipeline)

- Dựng các section dưới hero (how-it-works, AVS, operators, CTA, footer): skeleton →
  treatment → motion (scroll reveal, cân nhắc Lenis smooth scroll khi có full page).
- Phase 5 — Harden: a11y, perf, cross-device verify; rồi productionize vào
  `packages/templates-helix` (theo `template-production-model`).

## Soft / cần soi tiếp

- Giá trị iridescent stops + violet exact, vật liệu shards (iridescenceIOR/roughness),
  tốc độ xoay/parallax — tinh chỉnh tiếp nếu user muốn.
- Ribbon sáng spiral (signature gốc) đã thay bằng shards — không còn cần.
