# Production Bar — design-quality gate for shippable templates

> Sibling to [`packages/design-tokens/INVARIANT.md`](../packages/design-tokens/INVARIANT.md).
> **INVARIANT = token/consistency floor** (a Piece is _coherent_). **Production
> Bar = design-quality ceiling** (a Piece is _finished_). A template can pass
> every INVARIANT rule and still look vibe-coded — token-correct but unpolished.
> This doc closes that gap.

A template is **`production`** only when it passes every bar below. Until then it
is **`draft`** (skeleton — fine for harvesting Pieces, NOT for shipping as a
"template" to a viewer). No template moves to `production` without a written pass
of §3 in its story.

## 1. Why this exists

Memecoin (`/preview/memecoin`) and GameFi (`/preview/gamefi`) were built as
_skeletons_ (sprint stories literally named `…-skeleton`) to harvest Pieces from.
They pass INVARIANT but read as AI-generated:

- Memecoin stats show `0 HOLDERS / $0.0M / $0.0M / 0B` — placeholder/zero data.
- GameFi fighter cards (Vanguard, Bulwark…) are **blank gradient boxes** where
  character art belongs.
- Both: huge dead vertical gaps, flat monochrome void, no focal artifact,
  everything centred one-column.

The catalog shows these as "templates" → mismatch. The bar below is what turns a
skeleton into something shippable.

## 2. The bar

| #    | Rule                          | Vibe-coded (WRONG)                                | Production (RIGHT)                                                |
| ---- | ----------------------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| P-1  | **Real content, no zeros**    | `0 HOLDERS`, `$0.0M`, `Lorem ipsum`, `Title here` | Believable figures (`12.4K holders`, `$4.2M vol`), specific copy  |
| P-2  | **One focal artifact**        | Hero is text on an empty void                     | A clear visual anchor: 3D/canvas Piece, art, chart, product shot  |
| P-3  | **No blank placeholders**     | Empty gradient rectangle where an image belongs   | Real imagery, a generated artifact, or an intentional pattern     |
| P-4  | **Vertical rhythm, no voids** | 600px of empty black between sections             | Sections connected; padding from `--section-pad-y-*`; frame fills |
| P-5  | **Surface depth**             | One flat near-black plane top to bottom           | Use `--surface-0…3`, cards, dividers, glows to differentiate      |
| P-6  | **Layout interest**           | Everything centred, single column, equal weight   | Asymmetry/grids where they serve hierarchy; a dominant element    |
| P-7  | **Focal hierarchy**           | All elements same visual weight; two equal CTAs   | One primary CTA + one dominant headline; rest recedes             |
| P-8  | **Accent cohesion**           | 2 random accent-coloured words, nothing else      | Accent as a system: 2–3 meaningful spots + consistent states      |
| P-9  | **Signs of life**             | Static screenshot, nothing moves or responds      | ≥1 tasteful motion/interaction (honours `useReducedMotion()`)     |
| P-10 | **Composed at view widths**   | Only looks right at one desktop width             | Holds together at the catalog preview width + mobile              |

## 3. Acceptance template (paste into each template's story)

```markdown
### Production Bar (ref: docs/PRODUCTION-BAR.md)

- [ ] P-1 Real content — no zero/blank/lorem data anywhere
- [ ] P-2 One clear focal artifact (not text-on-void)
- [ ] P-3 No blank placeholder rectangles — every image slot is filled
- [ ] P-4 Vertical rhythm via `--section-pad-y-*` — no dead-space voids
- [ ] P-5 Surface depth via `--surface-*` ramp — not a flat plane
- [ ] P-6 Layout has intentional interest — not default centred column
- [ ] P-7 Clear focal hierarchy — one primary CTA + dominant headline
- [ ] P-8 Accent used as a cohesive system (2–3 meaningful spots)
- [ ] P-9 At least one sign of life (motion/interaction, reduced-motion safe)
- [ ] P-10 Composed at catalog preview width + mobile
- [ ] Reviewed against a full-page screenshot, not just code
```

## 4. Relationship to INVARIANT

- A Piece must pass **INVARIANT** (token discipline) AND **Production Bar**
  (design quality) to ship as a `production` template.
- INVARIANT is mechanical (mostly greppable: tokens, no literals). Production Bar
  is judgemental — verified by looking at a rendered screenshot, not grep.
- Reusable UI/section Pieces only need INVARIANT. The Production Bar applies to
  **assembled templates** (the thing a viewer sees as "a landing page").
