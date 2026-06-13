/**
 * Catalog metadata cho Memecoin template — pure data, KHÔNG import component.
 * copyMode "multi": file-tree viewer copy toàn bộ template + sections.
 */
interface TemplatePieceMeta {
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

export const pieceMeta: TemplatePieceMeta = {
  slug: "memecoin",
  name: "Memecoin — Degen L1",
  layer: "template",
  mood: ["neon"],
  useCase: ["memecoin"],
  stackTags: ["next", "react", "css"],
  animationTags: ["marquee", "digit-roll", "count-up"],
  deps: ["@landing/ui", "@landing/sections", "next", "react"],
  copyMode: "multi",
  sourcePaths: [
    "packages/templates-memecoin/src/template.tsx",
    "packages/templates-memecoin/src/memecoin.css",
    "packages/sections/src/memecoin-hero-ticker/index.tsx",
    "packages/sections/src/memecoin-hero-ticker/memecoin-hero-ticker.css",
    "packages/sections/src/token-stats-strip/index.tsx",
    "packages/sections/src/token-stats-strip/token-stats-strip.css",
    "packages/sections/src/community-marquee/index.tsx",
    "packages/sections/src/community-marquee/icons.tsx",
    "packages/sections/src/community-marquee/community-marquee.css",
    "packages/ui/src/price-ticker/price-ticker.tsx",
    "packages/ui/src/price-ticker/rolling-number.tsx",
    "packages/ui/src/price-ticker/use-marquee.ts",
    "packages/ui/src/price-ticker/use-slot-price.ts",
    "packages/ui/src/price-ticker/format.ts",
    "packages/ui/src/price-ticker/types.ts",
    "packages/ui/src/price-ticker/price-ticker.css",
  ],
};
