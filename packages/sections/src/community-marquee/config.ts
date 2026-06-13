/**
 * Catalog metadata cho Community Marquee — pure data, KHÔNG import component.
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
  slug: "community-marquee",
  name: "Community Marquee",
  layer: "section",
  mood: ["neon"],
  useCase: ["memecoin"],
  stackTags: ["next", "react", "css"],
  animationTags: ["marquee"],
  deps: ["@landing/ui", "next", "react"],
  copyMode: "multi",
  sourcePaths: [
    "packages/sections/src/community-marquee/index.tsx",
    "packages/sections/src/community-marquee/icons.tsx",
    "packages/sections/src/community-marquee/community-marquee.css",
  ],
};
