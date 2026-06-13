/**
 * Catalog metadata cho AI-kit template — pure data, KHÔNG import component.
 * Đăng ký trong aggregator (piece-registrations.ts) + manifest (slot "aikit").
 * copyMode "multi": copy template + 5 sections (hero/features/gallery/testimonial/pricing).
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
  slug: "aikit",
  name: "AI-kit — AI Startup Kit",
  layer: "template",
  mood: ["neon"],
  useCase: ["saas", "ai"],
  stackTags: ["next", "react", "css"],
  animationTags: ["float", "glow-drift"],
  deps: ["@landing/ui", "@landing/sections", "next", "react"],
  copyMode: "multi",
  sourcePaths: [
    "packages/templates-aikit/src/template.tsx",
    "packages/templates-aikit/src/aikit.css",
    "packages/sections/src/aikit-hero/index.tsx",
    "packages/sections/src/aikit-hero/aikit-hero.css",
    "packages/sections/src/aikit-features/index.tsx",
    "packages/sections/src/aikit-features/aikit-features.css",
    "packages/sections/src/aikit-gallery/index.tsx",
    "packages/sections/src/aikit-gallery/aikit-gallery.css",
    "packages/sections/src/aikit-testimonial/index.tsx",
    "packages/sections/src/aikit-testimonial/aikit-testimonial.css",
    "packages/sections/src/aikit-pricing/index.tsx",
    "packages/sections/src/aikit-pricing/aikit-pricing.css",
  ],
};
