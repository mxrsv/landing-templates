/**
 * Catalog metadata cho Token Stats Strip — pure data, KHÔNG import component.
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
  slug: "token-stats-strip",
  name: "Token Stats Strip",
  layer: "section",
  mood: ["neon"],
  useCase: ["memecoin"],
  stackTags: ["next", "react", "css"],
  animationTags: ["count-up", "scroll-reveal"],
  deps: ["@landing/ui", "next", "react"],
  copyMode: "single",
  sourcePaths: [
    "packages/sections/src/token-stats-strip/index.tsx",
    "packages/sections/src/token-stats-strip/token-stats-strip.css",
  ],
};
