/**
 * Catalog metadata cho AI-kit Gallery — pure data, KHÔNG import component.
 * Spike (chưa đăng ký aggregator); meta giữ sẵn để graduate sau.
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
  slug: "aikit-gallery",
  name: "AI-kit Gallery",
  layer: "section",
  mood: ["aikit"],
  useCase: ["saas", "ai"],
  stackTags: ["next", "react", "css"],
  animationTags: ["scroll-reveal", "hover-zoom"],
  deps: ["@landing/ui", "next", "react"],
  copyMode: "single",
  sourcePaths: [
    "packages/sections/src/aikit-gallery/index.tsx",
    "packages/sections/src/aikit-gallery/aikit-gallery.css",
  ],
};
