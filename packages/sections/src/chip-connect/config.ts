/**
 * Catalog metadata cho Chip Connect — pure data, KHÔNG import component.
 * UI piece (layer "ui"), mood "infra" (AI/SaaS dark UI). Clone từ Revo hero.
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
  slug: "chip-connect",
  name: "Chip Connect",
  layer: "ui",
  mood: ["infra"],
  useCase: ["saas", "ai"],
  stackTags: ["next", "react", "css", "svg"],
  animationTags: [],
  deps: ["@landing/ui", "react"],
  copyMode: "single",
  sourcePaths: [
    "packages/sections/src/chip-connect/index.tsx",
    "packages/sections/src/chip-connect/chip-connect.css",
  ],
};
