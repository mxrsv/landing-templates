/**
 * Catalog metadata cho AI-kit Pricing — pure data, KHÔNG import component.
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
  slug: "aikit-pricing",
  name: "AI-kit Pricing",
  layer: "section",
  mood: ["aikit"],
  useCase: ["saas", "ai"],
  stackTags: ["next", "react", "css"],
  animationTags: [],
  deps: ["@landing/ui", "next", "react"],
  copyMode: "single",
  sourcePaths: [
    "packages/sections/src/aikit-pricing/index.tsx",
    "packages/sections/src/aikit-pricing/aikit-pricing.css",
  ],
};
