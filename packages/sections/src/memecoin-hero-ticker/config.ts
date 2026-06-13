/**
 * Catalog metadata cho Memecoin Hero + Ticker — pure data, KHÔNG import
 * component (giữ config tách khỏi runtime cho server aggregator).
 *
 * Slug = "memecoin-hero-ticker" theo manifest canonical (Story 4.6); epics.md
 * 5.2 ghi "memecoin-hero" nhưng manifest là source-of-truth cho aggregator.
 */
interface SectionPieceMeta {
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

export const pieceMeta: SectionPieceMeta = {
  slug: "memecoin-hero-ticker",
  name: "Memecoin Hero + Ticker",
  layer: "section",
  mood: ["neon"],
  useCase: ["memecoin"],
  stackTags: ["next", "react", "css"],
  animationTags: ["marquee", "digit-roll"],
  deps: ["@landing/ui", "next", "react"],
  copyMode: "single",
  sourcePaths: [
    "packages/sections/src/memecoin-hero-ticker/index.tsx",
    "packages/sections/src/memecoin-hero-ticker/memecoin-hero-ticker.css",
  ],
};
