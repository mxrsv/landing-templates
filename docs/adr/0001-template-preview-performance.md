# Template preview performance: posters + layer-split rendering

## Status

Accepted

## Context

Pieces are browsed in `apps/docs` and shown three ways (see `CONTEXT.md`:
Thumbnail / Detail preview / Fullscreen preview). A `template` Layer Piece is a
full landing page — it composes many sections, runs rAF loops, and (e.g.
`ternus`) opens a WebGL context via `PixelBlast`. The original mechanism rendered
the same full component live on every surface, so a Thumbnail mounted an entire
landing page scaled to 0.25 and a grid could run several full templates — and
WebGL contexts — at once. Rendering a full template inline into a constrained
detail pane also breaks fidelity: its `position: fixed` nav escapes the pane and
`100vh` sections overflow.

## Decision

- **Thumbnails (all Layers): poster-first.** Default state is a static Poster;
  the live render mounts only on hover, one at a time.
- **Poster pipeline.** A Playwright script captures each `/preview/[slug]` at a
  fixed viewport under `prefers-reduced-motion`, cropped to a hero-fold 16:9
  still, into `public/posters/[slug].webp`. CI regenerates and fails on drift so
  Posters can't go stale.
- **Sidebar is text-only** — no thumbnails in the navigation pane.
- **Detail preview splits by Layer.** `ui`/`section` render inline (wrapped in a
  `transform` + `contain` container); `template` renders in an `<iframe>` of its
  Fullscreen preview. Both show the Poster first and mount the live render behind
  it, one live at a time.

## Why

The Thumbnail is `inert` + `pointer-events-none`, so a live render buys no
interactivity there — only decorative motion — making a Poster a near-free swap.
For templates the iframe gives a real viewport (fixing `position: fixed` and
`100vh`) and lets the browser tear down the previous template's JS / rAF / WebGL
on navigation, avoiding manual-teardown leaks and the ~16 WebGL-context cap. The
Poster covers the iframe's per-switch document load, so the fidelity + safety win
costs no perceived latency. `ui`/`section` are small fragments that embed fine
inline, so they don't pay for a second document.

## Consequences

- New infra to maintain: `public/posters/*`, a capture script, a CI freshness gate.
- `/preview/[slug]` is now load-bearing twice — screenshot target and detail
  iframe src — so it must stay.
- A Poster is a representative still, not live state; motion/interactivity appears
  only on hover (Thumbnail) or after the live render mounts (Detail preview).
