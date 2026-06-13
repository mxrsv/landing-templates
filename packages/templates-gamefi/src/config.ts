/**
 * Catalog metadata cho GameFi template — pure data, KHÔNG import component.
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
  slug: "gamefi",
  name: "GameFi — Battle Arena",
  layer: "template",
  mood: ["game"],
  useCase: ["gamefi"],
  stackTags: ["next", "react", "css"],
  animationTags: ["scanline", "bar-grow"],
  deps: ["@landing/ui", "@landing/sections", "next", "react"],
  copyMode: "multi",
  sourcePaths: [
    "packages/templates-gamefi/src/template.tsx",
    "packages/templates-gamefi/src/gamefi.css",
    "packages/sections/src/gamefi-hud-hero/index.tsx",
    "packages/sections/src/gamefi-hud-hero/gamefi-hud-hero.css",
    "packages/sections/src/character-showcase/index.tsx",
    "packages/sections/src/character-showcase/character-showcase.css",
  ],
};
