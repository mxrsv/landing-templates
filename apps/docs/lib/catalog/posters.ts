/**
 * Poster asset helper — đường dẫn tĩnh tới hero-fold (16:9) WebP của một Piece.
 *
 * Poster sống ở `apps/docs/public/posters/<slug>.webp`, sinh bởi
 * `scripts/capture-posters.mjs` (Playwright + sharp). Served tại
 * `/posters/<slug>.webp`. Dùng chung cho Thumbnail (poster-thumb),
 * Detail template (template-iframe overlay) và Detail inline overlay.
 *
 * Pure function — không phụ thuộc React/Web API, dùng được cả server lẫn client.
 */
export function posterSrc(slug: string): string {
  return `/posters/${slug}.webp`;
}
