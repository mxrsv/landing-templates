# Ternus hero — spacing measurements (viewport clientWidth = 1425px, hero 1425×900)

Screenshot: `ternus-hero-fixed.png` (repo root, viewport 1425×900)
CSS source: `src/templates/ternus/ternus.css` (hero block ~lines 246–431)
Markup: `src/templates/ternus/components/ternus-hero.tsx`, crystal canvas: `src/templates/ternus/components/hero-crystal.tsx`

## Hero container

- hero: x 0→1425, y 0→900; padding-top 120, padding-bottom 64; full-bleed with 24px side padding (`.tn .hero { padding: 120px 24px 64px }`)
- `.tn .hero .wrap { width: 100% }` (hero overrides shared `.wrap` 92vw → full bleed)

## hero-grid

- grid-template-columns: 701.922px / 635.078px (source: `1.05fr 0.95fr`)
- column gap: 40px
- align-items: center

## Left column (text) — x 24 → 726 (width 702)

Actual text content widths (all start at x=24):

- badges: x 24→409 (w 385, h 29), margin-bottom 26
- headline: x 24→518 (w 494, h 167) ← widest text element
- sub: x 24→517 (w 493, h 82), margin-top 24
- cta: x 24→348 (w 324, h 49), margin-top 34
- netstrip: x 24→457 (w 433, h 68), margin-top 36, padding-top 20 + top border

→ Text fills only up to x≈518. Left column extends to 726 → ~208px empty space inside the left column, to the RIGHT of the text.

Vertical gaps (rendered, edge-to-edge):

- badges → headline: 26
- headline → sub: 24
- sub → cta: 34
- cta → netstrip: 36
- content block: y 221 → 735 (height 514)

## Right column (crystal) — x 766 → 1401 (width 635), y 160 → 795 (height 635)

- element: `<canvas class="crystal">`, CSS size 635×635, buffer 1270×1270 (2× DPR)
- The crystal SHAPE drawn inside the canvas is centered and noticeably smaller than the canvas, with large transparent margins (see screenshot) — so the visible logo is roughly centered around x≈1083 and is much narrower than 635px.

## Derived gaps (the user's concern: text ↔ logo)

- text right edge (~518) → right column left edge (766) = 248px of empty band
- plus the crystal's own internal transparent padding → the VISIBLE gap between text and the drawn crystal is even larger (~350–400px estimated from screenshot)
- crystal also sits vertically higher/taller than the text block (canvas y 160→795 vs text 221→735)
