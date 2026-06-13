/**
 * Catalog metadata cho Character Showcase (skeleton) — pure data, KHÔNG import
 * component.
 *
 * Slug = "character-showcase" theo manifest canonical (Story 4.6); epics.md 6.2
 * ghi "gamefi-character-showcase" nhưng manifest là source-of-truth.
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
  slug: "character-showcase",
  name: "Character Showcase (Skeleton)",
  layer: "section",
  mood: ["game"],
  useCase: ["gamefi"],
  stackTags: ["next", "react", "css"],
  animationTags: [],
  deps: ["next", "react"],
  copyMode: "single",
  sourcePaths: [
    "packages/sections/src/character-showcase/index.tsx",
    "packages/sections/src/character-showcase/character-showcase.css",
  ],
};
