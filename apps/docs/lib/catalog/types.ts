/**
 * Catalog schema — canonical types cho mọi Piece trong gallery.
 *
 * Registration convention (Epic D):
 * - Thêm Piece tại `apps/docs/lib/catalog/piece-registrations.ts` (single entry point).
 * - Slug phải có trong `manifest.ts` trước.
 * - Package export `pieceMeta` pure-data từ `config.ts` — cấm import component ở config.
 */

/** Tầng của Piece trong catalog — quyết định route prefix (/ui, /sections, /templates). */
export type PieceLayer = "ui" | "section" | "template";

/** 4 mood theme khớp `[data-theme=…]` của @landing/design-tokens. */
export type PieceMood = "infra" | "neon" | "game" | "nft";

/**
 * Cơ chế copy của Piece (Story 4.4):
 * - "single": clipboard = 1 file .tsx + header `// deps:` + CSS nối cuối.
 * - "multi": file tree + tab viewer, copy từng file theo `sourcePaths`.
 */
export type CopyMode = "single" | "multi";

/** Metadata canonical cho một Piece — mọi `pieceMeta` export phải khớp shape này. */
export interface PieceMeta {
  /** Định danh duy nhất toàn catalog (duplicate slug bị aggregator reject). */
  slug: string;
  name: string;
  layer: PieceLayer;
  /** mood[0] là theme mặc định cho detail page wrapper `data-theme`. */
  mood: PieceMood[];
  useCase: string[];
  stackTags: string[];
  animationTags: string[];
  /** Packages cần cài khi copy (hiện trong header `// deps:`). */
  deps: string[];
  copyMode: CopyMode;
  /**
   * Đường dẫn source từ repo root cho copy viewer (RSC `fs.readFile` build-time).
   * Optional: single-file UI piece có thể dùng `?raw` import thay vì sourcePaths.
   */
  sourcePaths?: string[];
}

/** Params filter đa trục cho FilterBar (Epic 9) — mỗi trục là OR, giữa các trục là AND. */
export interface PieceFilterParams {
  layer?: PieceLayer[];
  mood?: PieceMood[];
  useCase?: string[];
  stack?: string[];
  animation?: string[];
}
