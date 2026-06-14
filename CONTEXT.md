# Landing Piece Catalog

Catalog of copy-paste landing-page building blocks. The `apps/docs` app browses
them; the `packages/*` provide them. This glossary fixes the shared language.

## Catalog

**Piece**:
A single catalog entry that can be browsed, previewed, and copied. Every Piece
belongs to exactly one Layer.
_Avoid_: component, block, snippet, item

**Layer**:
The kind of a Piece: `ui`, `section`, or `template`. A `template` is a full
landing page; a `section` is one band of a page; a `ui` is a primitive.
_Avoid_: type, category, kind

**Mood**:
The visual theme of a Piece: `infra`, `neon`, `game`, or `nft`.
_Avoid_: theme (overloaded), style, vibe

## Preview surfaces

A Piece can be shown three distinct ways. They are not interchangeable.

**Thumbnail**:
The small, non-interactive still of a Piece in a card or gallery grid. Backed by
a Poster, not a live render.
_Avoid_: card preview, mini preview

**Detail preview**:
The live, interactive render of one Piece in the detail / right pane. At most one
is live at a time.
_Avoid_: live preview (every surface is "live-ish"), main preview

**Fullscreen preview**:
The isolated full-viewport render of a Piece with no catalog chrome, at
`/preview/[slug]`. The canonical render target.
_Avoid_: standalone preview, isolated preview

**Poster**:
A pre-captured hero-fold (16:9) still image of a Piece, generated from its
Fullscreen preview. Stands in for a live render wherever rendering would be too
costly — the Thumbnail by default, and the Detail preview before it mounts.
_Avoid_: screenshot, snapshot, thumbnail image
