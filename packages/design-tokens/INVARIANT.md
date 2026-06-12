# Invariant Bar — quality floor for every Piece

> Single source of truth for what a Piece (UI / section / template) must satisfy
> **before** it enters the catalog. Tokens live in [`src/base.css`](./src/base.css);
> theme moods in [`src/theme.ts`](./src/theme.ts). Animated Pieces must use the
> shared `useReducedMotion()` from `@landing/ui`.

These rules keep a multi-library, multi-author catalog visually coherent. A Piece
that breaks the bar does **not** ship — no exceptions without a written waiver in
its story.

## 1. Invariant rules

| #   | Rule                           | Why                                            | Wrong                                            | Right                                                         |
| --- | ------------------------------ | ---------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------- |
| I-1 | **Spacing on the 4/8px grid**  | Vertical rhythm stays consistent across Pieces | `margin: 13px`, `gap: 1.1rem`                    | `gap: var(--space-2)` (8px), `--space-6` …                    |
| I-2 | **Named easing only**          | Motion personality is theme-controlled         | `transition: …200ms cubic-bezier(0.1,0.7,1,0.1)` | `transition: … var(--duration-base) var(--ease-standard)`     |
| I-3 | **Never `transition: all`**    | `all` animates layout props → jank + a11y cost | `transition: all 0.3s`                           | `transition: color var(--duration-fast) var(--ease-standard)` |
| I-4 | **Palette via tokens**         | Runtime theme swap depends on `var(--p-*)`     | `color: #22d3ee`                                 | `text-primary` / `color: var(--p-primary)`                    |
| I-5 | **Type from the scale**        | One type ladder, not per-Piece sizes           | `font-size: 27px`                                | `var(--text-h2)`, `--text-body` …                             |
| I-6 | **Radius/hairline from floor** | Consistent edges                               | `border-radius: 6px`                             | `var(--radius-sm)` (4px), `--radius-pill`                     |

Allowed token vocabulary (see `base.css` for full list):

- spacing `--space-0 … --space-32` (4/8px grid)
- type `--text-eyebrow|caption|body|h3|h2|display`
- motion `--ease-standard|entrance|exit`, `--duration-fast|base|slow`
- palette `--p-*` (consume via Tailwind utilities: `bg-primary`, `text-ink`, `border-line`, …)
- radius `--radius-sm|pill`, hairline `--line-w`

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
- [ ] I-5 Type via `--text-*` scale
- [ ] I-6 Radius/hairline via `--radius-*` / `--line-w`
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
