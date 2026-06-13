/**
 * Single entry point — thêm Piece mới CHỈ sửa file này.
 *
 * Mỗi entry gồm:
 * - `slug` — phải khớp `meta.slug` (aggregator validate fail-fast)
 * - `meta` — pure-data export từ package `config.ts`
 * - `loadPreview` — dynamic import component (dùng cho detail + index card)
 * - `packageName` — workspace package → tự động vào transpilePackages
 *
 * Slug phải có trong `manifest.ts` (planned budget). Aggregator validate fail-fast.
 */
import type { ComponentType } from "react";

import { pieceMeta as communityMarqueePieceMeta } from "@landing/sections/community-marquee/config";
import { pieceMeta as memecoinHeroTickerPieceMeta } from "@landing/sections/memecoin-hero-ticker/config";
import { pieceMeta as tokenStatsStripPieceMeta } from "@landing/sections/token-stats-strip/config";
import { pieceMeta as ternusPieceMeta } from "@landing/templates-ternus/config";

export interface PieceRegistration {
  /** Khoá định danh — phải khớp `meta.slug`, dùng để map preview loader. */
  slug: string;
  /** Label cho error message khi validate meta. */
  source: string;
  meta: unknown;
  /** Workspace package — append vào Next `transpilePackages` tự động. */
  packageName: string;
  loadPreview: () => Promise<{ default: ComponentType }>;
}

export const pieceRegistrations: readonly PieceRegistration[] = [
  {
    slug: "memecoin-hero-ticker",
    source: "@landing/sections/memecoin-hero-ticker/config",
    meta: memecoinHeroTickerPieceMeta,
    packageName: "@landing/sections",
    loadPreview: () =>
      import("@landing/sections/memecoin-hero-ticker").then((m) => ({
        default: m.MemecoinHeroTicker,
      })),
  },
  {
    slug: "community-marquee",
    source: "@landing/sections/community-marquee/config",
    meta: communityMarqueePieceMeta,
    packageName: "@landing/sections",
    loadPreview: () =>
      import("@landing/sections/community-marquee").then((m) => ({
        default: m.CommunityMarquee,
      })),
  },
  {
    slug: "token-stats-strip",
    source: "@landing/sections/token-stats-strip/config",
    meta: tokenStatsStripPieceMeta,
    packageName: "@landing/sections",
    loadPreview: () =>
      import("@landing/sections/token-stats-strip").then((m) => ({
        default: m.TokenStatsStrip,
      })),
  },
  {
    slug: "ternus",
    source: "@landing/templates-ternus/config",
    meta: ternusPieceMeta,
    packageName: "@landing/templates-ternus",
    loadPreview: () =>
      import("@landing/templates-ternus").then((m) => ({
        default: m.TernusTemplate,
      })),
  },
];
