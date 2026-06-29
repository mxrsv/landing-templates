# AI-kit clone — source brief (high-fidelity rebuild)

Goal: clone the Framer "AI Startup Website Kit / example-2" page as faithfully as
possible into the existing `templates-aikit` spike. This brief is the
source-of-truth extracted from the LIVE page. Reference everything here; do NOT
guess values.

## Source artifacts (read these)

- `.planning/aikit-source/styles.css` — ALL 568 real CSS rules from the page (grep for exact gradients/values). Class names are obfuscated `framer-*` but VALUES are exact.
- `.planning/aikit-source/dossier.json` — exact computed typography/box per section node.
- `.planning/aikit-source/assets.json` — image + background inventory.
- `.planning/aikit-source/icons.svg.txt` — 7 real inline SVG icons (256×256 viewBox, Phosphor-style). Use these for feature icons / nav / social.
- `.planning/aikit-source/ref/full.png` — full-page reference (1265×4616).
- `.planning/aikit-source/ref/{nav,hero,features,testimonial,pricing,cta,footer}.png` — per-section crops. **Read your section crop and match it.**

## Real assets (already downloaded → served at `/aikit/*` from `apps/docs/public/aikit/`)

- `/aikit/hero-cubes.png` (2550²) — the hero floating 3D cube cluster. Use as an `<img>`, NOT CSS cubes.
- `/aikit/features-frame.png` (2200×1848) — the product/video frame image.
- `/aikit/testimonial-avatar.png` (2550²) — Talia Taylor avatar.
- `/aikit/cta-icon.png` (1112×1148) — the glowing app icon in the CTA.
- `/aikit/tex-1.png`, `/aikit/tex-2.png` — subtle textures (optional grain/noise).

## Global tokens (real values — already in `aikit.css`, scoped `[data-theme="aikit"]`)

- bg `#000`; ink `#fff`; ink-muted `rgba(255,255,255,.7)`; line `rgba(255,255,255,.15)`
- accent `#8c45ff`; accent-bright `#d438ff` (rgb 212,56,255); deep `#4a208a`; `#371866`; `#190d2e`
- font: **Inter** (heading weight 500, body 400). Some labels use Switzer (role text).

## Key real gradients (from styles.css)

- Hero/section glow: `radial-gradient(108% 100% at 100% 100.6%, #8c45ff 12.8%, rgb(14,0,36) 69.1%, #000 98.2%)`
- Center purple wash: `radial-gradient(45% 38% at 50% 36.2%, #4a208a 0%, #000 100%)`
- CTA band: `radial-gradient(43% 85% at 50% 50%, #4a208a 0%, #000 100%)`, border-radius 10px, padding 60px 100px
- Top glow: `radial-gradient(52% 100% at 50% 0%, #371866 0%, #000 100%)`
- Card/edge fade: `linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.67) 64.5%, #000 100%)`

## Per-section exact specs (computed)

**Hero** — h1 `82px / 500 / lh 82px / ls -4.92px` white, LEFT, box ~450px wide (wraps to 2 lines: "Elevate your" / "SEO efforts."). sub `20px/400/lh28/ls-0.2` rgba(.7). Badge = pill: small "New" chip (accent bg, white) + grey text "Latest integration just arrived". Waitlist = **rounded 8px box** (NOT pill) with `box-shadow 0 10px 20px rgba(0,0,0,.2)`, `backdrop-filter blur(5px)`, containing email input (`14px`, placeholder rgba(.6), padding 16px) + solid purple "Join waitlist" button. Right side = `/aikit/hero-cubes.png` over the radial glow + faint perspective grid.

**Features** — eyebrow "Everything you need" = **purple text `#8c45ff` 14px/500** (no pill bg). title h3 `32px/500/lh35.2/ls-1.28` centered, max ~22ch. Then big product frame using `/aikit/features-frame.png` (16:9-ish, rounded, with a centered circular play button overlay + inner purple glow). Then 3-col × 2-row grid of 6 features. Card: icon (use icons from icons.svg.txt, ~20px, purple/white) + title `16px/500` + body `13px` rgba(.7). "Smart Keyword Generator" has a **NEW tag**: `8px/700/ls0.24`, BLACK text on a light/accent pill.

**Testimonial** — card on dark surface, gap 20px. avatar = `/aikit/testimonial-avatar.png` (rounded square ~96px). quote `23px/500/lh32.2/ls-0.23` white. name `16px/400` white. role `16px/700` (Switzer ok→fallback) rgba(.7). Subtle purple gradient wash on card bg.

**Pricing** — title "Pricing" `56px/500/lh61.6/ls-2.24` centered + sub `~15-20px` rgba(.7) centered. Comparison table: header row (plan name `24px/500` + "Get started" btn), price row, then feature rows. Plans Basic $29 / Pro $79 / Business $149. **Pro column highlighted** (subtle purple bg + border, rounded, extends slightly above). Rows: Keyword optimization (Unlimited×3), Automated meta tags (1000/Unlimited/Unlimited), then check-mark rows: SEO monitoring [✓✓✓], Monthly reports [✓✓✓], Content suggestions [✗✓✓], Link optimization [✗✓✓], Multi-user access [✗✗✓], API integration [✗✗✓]. Checks are purple.

**Nav** — floating centered pill, blur bg `rgba(10,10,15,.7)`, border, logo mark (purple gradient square) + links Features/Developers/Pricing/Changelog (`13px` rgba(.7)) + solid purple "Join waitlist" button on right. sticky top ~16px.

**CTA** — centered band, `radial-gradient(43% 85% at 50% 50%, #4a208a, #000)`, border-radius 10px, padding 60px 100px. icon = `/aikit/cta-icon.png` (~64px, glowing). title `56px/500/ls-2.24` centered (wraps 2 lines). sub `20px/400` rgba(.7) centered. "Try for free" solid purple button.

**Footer** — top border, brand (logo mark + "AI Startup Website Kit" `14px`) on left, link row (Features/Developers/Company/Blog/Changelog `13px` rgba(.7)), social icons (use grey SVG #6 from icons file) on right.

## Animations (page uses Framer Motion JS, NO css @keyframes existed)

Reproduce as scroll-reveal (fade + translateY ~16px, ~0.6s ease-out) via IntersectionObserver, plus hover transitions on buttons/cards/nav links. GATE all motion behind `useReducedMotion()` from `@landing/ui/lib/use-reduced-motion` (when reduced → no transform, content visible). Hero cubes may have a slow float; gate it too.

## Conventions (MUST follow — repo rules)

- Each section file: `"use client";` at top (uses hooks / ErrorBoundary).
- Wrap section body in `<ErrorBoundary label="...">` from `@landing/ui/lib/error-boundary`.
- Section root: `<section data-theme="aikit" className="...">`. Tokens inherit from wrapper.
- TypeScript strict + `noUncheckedIndexedAccess`: never index `arr[i]` without guard/`?? fallback`. Type all props/exports.
- ESLint runs with `--max-warnings 0`. No `any`, no unused, no `console.log`.
- Immutable data; small focused files.
- Files you own live under `packages/sections/src/aikit-<section>/` (index.tsx + aikit-<section>.css). Do NOT edit other sections' files or `aikit.css`/`template.tsx` unless you are the CHROME owner.

## Verify your own work

After writing, run: `pnpm --filter @landing/sections check-types` and `pnpm --filter @landing/sections lint` (chrome owner: also `@landing/templates-aikit`). Fix all errors before returning.
