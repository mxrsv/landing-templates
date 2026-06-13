/**
 * Catalog metadata cho GameFi HUD Hero — pure data, KHÔNG import component
 * (giữ config tách khỏi runtime cho server aggregator).
 *
 * Slug = "gamefi-hud-hero" theo manifest canonical (Story 4.6); epics.md 6.1
 * ghi "gamefi-hero" nhưng manifest là source-of-truth cho aggregator.
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
  slug: "gamefi-hud-hero",
  name: "GameFi HUD Hero",
  layer: "section",
  mood: ["game"],
  useCase: ["gamefi"],
  stackTags: ["next", "react", "css"],
  animationTags: ["scanline", "bar-grow"],
  deps: ["@landing/ui", "next", "react"],
  copyMode: "single",
  sourcePaths: [
    "packages/sections/src/gamefi-hud-hero/index.tsx",
    "packages/sections/src/gamefi-hud-hero/gamefi-hud-hero.css",
  ],
};
