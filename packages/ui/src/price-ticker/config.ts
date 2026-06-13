/**
 * Catalog metadata cho Price-Ticker — pure data, KHÔNG import component
 * (catalog aggregator là server module; giữ config tách khỏi runtime).
 *
 * Shape bám `PieceMeta` canonical (apps/docs/lib/catalog/types.ts);
 * aggregator structural-match khi registration (Epic 8 task #4).
 *
 * Animation: thuần CSS + RAF (không GSAP/FM) — digit-roll qua CSS transition
 * với named easing token (I-2), marquee qua RAF transform. `stackTags` discloses
 * "css" thay cho một lib animation.
 */
interface PriceTickerPieceMeta {
  slug: string;
  name: string;
  layer: "ui" | "section" | "template";
  mood: string[];
  useCase: string[];
  stackTags: string[];
  animationTags: string[];
  deps: string[];
  copyMode: "single" | "multi";
  sourcePaths: string[];
}

export const pieceMeta: PriceTickerPieceMeta = {
  slug: "price-ticker",
  name: "Price Ticker",
  layer: "ui",
  mood: ["neon"],
  useCase: ["memecoin"],
  stackTags: ["react", "css"],
  animationTags: ["marquee", "digit-roll"],
  deps: ["@landing/ui", "react"],
  copyMode: "multi",
  sourcePaths: [
    "packages/ui/src/price-ticker/price-ticker.tsx",
    "packages/ui/src/price-ticker/rolling-number.tsx",
    "packages/ui/src/price-ticker/use-marquee.ts",
    "packages/ui/src/price-ticker/use-slot-price.ts",
    "packages/ui/src/price-ticker/format.ts",
    "packages/ui/src/price-ticker/types.ts",
    "packages/ui/src/price-ticker/price-ticker.css",
    "packages/ui/src/price-ticker/index.ts",
  ],
};
