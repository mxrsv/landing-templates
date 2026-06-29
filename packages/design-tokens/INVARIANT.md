# Invariant Bar — quality floor for every Piece

> Single source of truth for what a Piece (UI / section / template) must satisfy
> **before** it enters the catalog. Tokens live in [`src/base.css`](./src/base.css);
> theme moods in [`src/theme.ts`](./src/theme.ts). Animated Pieces must use the
> shared `useReducedMotion()` from `@landing/ui`.

These rules keep a multi-library, multi-author catalog visually coherent. A Piece
that breaks the bar does **not** ship — no exceptions without a written waiver in
its story.

> **INVARIANT is the token/consistency floor (coherent), not the design-quality
> ceiling (finished).** A Piece can pass every rule here and still look
> vibe-coded. Assembled templates must ALSO pass the
> [Production Bar](../../docs/PRODUCTION-BAR.md) to ship as `production`.

## 1. Invariant rules

| #    | Rule                                         | Why                                                | Wrong                                                          | Right                                                                                       |
| ---- | -------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --- | --------------------- |
| I-1  | **Spacing on the 4/8px grid**                | Vertical rhythm stays consistent across Pieces     | `margin: 13px`, `gap: 1.1rem`                                  | `gap: var(--space-2)` (8px), `--space-6` …                                                  |
| I-2  | **Named easing only**                        | Motion personality is theme-controlled             | `transition: …200ms cubic-bezier(0.1,0.7,1,0.1)`               | `transition: … var(--duration-base) var(--ease-standard)`                                   |
| I-3  | **Never `transition: all`**                  | `all` animates layout props → jank + a11y cost     | `transition: all 0.3s`                                         | `transition: color var(--duration-fast) var(--ease-standard)`                               |
| I-4  | **Palette via tokens**                       | Runtime theme swap depends on `var(--p-*)`         | `color: #22d3ee`                                               | `text-primary` / `color: var(--p-primary)`                                                  |
| I-5  | **Type/weight/leading/tracking from tokens** | One type ladder, not per-Piece sizes               | `font-size: 27px`, `letter-spacing: 0.2em`, `font-weight: 600` | `var(--text-h2)`, `var(--tracking-label)`, `var(--weight-semibold)`, `var(--leading-snug)`  |
| I-6  | **Radius/hairline from floor**               | Consistent edges                                   | `border-radius: 5px`                                           | `var(--radius-sm                                                                            | md  | lg)`, `--radius-pill` |
| I-7  | **States via `--state-*`** (v2)              | Interactive feedback is theme-controlled           | `:hover { background: #1a1a22 }`                               | `:hover { background: var(--state-hover-bg) }`                                              |
| I-8  | **Surfaces via `--surface-*`** (v2)          | One elevation ramp, no hand-rolled nesting         | `background: #0e0e16` on a card                                | `background: var(--surface-1)` / `bg-surface-1`                                             |
| I-9  | **Layout via rhythm tokens** (v2)            | Sections share one container/padding rhythm        | `max-width: 1140px`, `padding: 72px 0`                         | `max-width: var(--container-lg)`, `padding-block: var(--section-pad-y-md)`                  |
| I-10 | **Text via primitives** (v2)                 | One eyebrow/heading/body/caption look, agent-proof | hand-rolled `text-[…] tracking-[…] uppercase` label string     | `<Eyebrow>` / `<Heading level>` / `<Body>` / `<Caption>` from `@landing/ui/components/text` |

> **Font floor:** the catalog uses **one** text typeface — Inter (`--font-sans`).
> Text primitives inherit it; never declare a per-Piece `font-family`.
>
> ⏳ **PENDING (owner sign-off):** a second **mono** face is proposed. `--font-mono`
> now exists in the floor (system fallback stack only; the JetBrains Mono webfont is
> injected by the app/template layout via `--font-jetbrains-mono`, never by
> `@landing/design-tokens`). Rationale: waitlist + ternus already ship mono privately
> (`--wl-mono`, `--tn-mono`) — this formalizes 1 sans + 1 mono instead of rogue fonts.
> **Until ratified, Pieces must NOT adopt `--font-mono`; Inter stays the single face.**

Allowed token vocabulary (see `base.css` for full list):

- spacing `--space-0 … --space-32` (4/8px grid)
- type `--text-eyebrow|caption|body|h3|h2|display`
- tracking `--tracking-tight|normal|label|wide`
- weight `--weight-regular|medium|semibold`
- leading `--leading-none|tight|snug|normal`
- font `--font-sans` (Inter — single text face); `--font-mono` (⏳ pending sign-off — see Font floor)
- motion `--ease-standard|entrance|exit`, `--duration-fast|base|slow`
- palette `--p-*` (consume via Tailwind utilities: `bg-primary`, `text-ink`, `border-line`, …)
- radius `--radius-sm|md|lg|xl|pill`, hairline `--line-w`
- surfaces `--surface-0 … --surface-3` (v2 — utilities `bg-surface-*`)
- states `--state-hover-bg|active-bg|focus-ring|disabled-opacity`, `--overlay` (v2)
- borders `--border-default|emphasis` (v2 — utilities `border-edge`, `border-edge-strong`)
- layout `--container-sm|md|lg|max`, `--section-pad-y-sm|md|lg` (v2)
- component tokens `--btn-*`, `--card-*`, `--tab-*`, `--input-*`, `--badge-*`, `--tooltip-*`
  (v2 — mapping layer only; shared components in `@landing/ui` consume these)
- effects (v3) `--shadow-1|2|3` (neutral black elevation — exempt from I-4), `--blur-sm|md|lg`,
  `--glow-primary|soft` + `--gradient-primary|surface` (palette-derived — re-resolve per theme)
- z-index `--z-base|raised|overlay|modal|toast` (v3 — one ladder, no ad-hoc `z-index`)

> **Theme `chrome`** (`data-theme="chrome"`) is the gallery shell's neutral
> "Warm graphite" frame — it is NOT a catalog mood. Pieces never declare it in
> `pieceMeta.mood`; only `apps/docs` chrome wears it. Accent budget inside
> chrome: max 1 solid-accent element per viewport.

> **Shader/canvas carve-out (I-4/I-8):** literal hex passed to a WebGL prop or a
> Canvas2D `fillStyle` (e.g. PixelBlast `color`, donut segment ramp) is exempt —
> the GPU/canvas cannot read CSS vars, and these values are pinned to the Piece's
> declared mood (Ternus = `infra`, so `#22d3ee`/`#fb923c` match the theme floor).
> The carve-out covers shader _data_ only; every CSS surface _around_ the canvas
> (poster, vignette, scrim, spacing) still resolves through the token bridge.

## 2. Motion & accessibility

- **`useReducedMotion()` is mandatory** for any Piece with animation (WebGL, GSAP,
  CSS keyframes, scroll-driven). Import from `@landing/ui`; when it returns `true`,
  render the static/low-motion variant — no autoplay, no parallax, no infinite loops.
- Keep motion **calm by default** (this catalog skews premium/trustworthy): prefer
  `--duration-base`/`--ease-standard`; reserve fast/snappy for the `neon`/`game` moods.
- Wrap animated Pieces in the shared `ErrorBoundary` (`@landing/ui`) so a runtime
  failure degrades to a static fallback instead of a blank Piece.

## 3. Acceptance template (copy into each Piece story)

```markdown
### Invariant bar (ref: packages/design-tokens/INVARIANT.md)

- [ ] I-1 Spacing only via `--space-*` (4/8px grid) — no magic numbers
- [ ] I-2 Named easing only (`--ease-*`) — no inline cubic-bezier literals
- [ ] I-3 No `transition: all` anywhere
- [ ] I-4 Colors via `--p-*` / theme utilities — no hardcoded hex
- [ ] I-5 Type/weight/leading/tracking via tokens (`--text-*`, `--weight-*`, `--leading-*`, `--tracking-*`) — no `font-size`/`font-weight`/`letter-spacing` literals
- [ ] I-6 Radius/hairline via `--radius-*` / `--line-w`
- [ ] I-7 Interactive states via `--state-*` — no hand-rolled hover/focus colors
- [ ] I-8 Backgrounds via `--surface-*` ramp — no ad-hoc nested bg hexes
- [ ] I-9 Section layout via `--container-*` / `--section-pad-y-*`
- [ ] I-10 Eyebrow/heading/body/caption via `@landing/ui` text primitives — no hand-rolled label class strings
- [ ] Animated? `useReducedMotion()` honored + static fallback
- [ ] Animated? wrapped in `@landing/ui` `ErrorBoundary`
- [ ] Renders under all applicable `data-theme` moods without layout shift
```

## 4. How this is enforced

- **Story-level:** every Piece story pastes the §3 template into its acceptance
  criteria; review checks each box.
- **Build-level:** `pnpm build` + `pnpm lint` + `check-types` gate (turbo) catch
  type/lint regressions. Token/spacing discipline is review-enforced (no automated
  linter for magic numbers yet — candidate for a future stylelint rule).
- **Catalog budget:** the "depth over volume" gate lives in
  [`apps/docs/lib/catalog/manifest.ts`](../../apps/docs/lib/catalog/manifest.ts) —
  soft-warn above the curated target (16), hard-throw only on runaway (>32); see the
  file header for migrated PRD provenance (FR-10 / Glossary / SM-C1). A valid new Piece
  must never fail the build; changing a threshold needs a rationale in the PR.
