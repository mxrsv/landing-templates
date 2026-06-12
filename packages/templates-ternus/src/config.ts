/**
 * Catalog metadata cho Ternus — pure data, KHÔNG import component
 * (catalog aggregator là server module; import component sẽ kéo
 * Three.js vào server bundle).
 *
 * Shape bám `PieceMeta` canonical (apps/docs/lib/catalog/types.ts, Story 4.2);
 * aggregator (Story 4.5) structural-match khi registration.
 */
interface TernusPieceMeta {
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

export const pieceMeta: TernusPieceMeta = {
  slug: "ternus",
  name: "Ternus — Layer 2",
  layer: "template",
  mood: ["infra"],
  useCase: ["infra"],
  stackTags: ["next", "react", "three"],
  animationTags: ["webgl", "scroll-reveal", "count-up"],
  deps: ["@landing/ui", "next", "react"],
  copyMode: "multi",
  sourcePaths: [
    "packages/templates-ternus/src/template.tsx",
    "packages/templates-ternus/src/ternus.css",
    "packages/templates-ternus/src/components/build-terminal.tsx",
    "packages/templates-ternus/src/components/closing-cta.tsx",
    "packages/templates-ternus/src/components/ecosystem.tsx",
    "packages/templates-ternus/src/components/hero-crystal.tsx",
    "packages/templates-ternus/src/components/how-it-works.tsx",
    "packages/templates-ternus/src/components/mark.tsx",
    "packages/templates-ternus/src/components/reveal.tsx",
    "packages/templates-ternus/src/components/stat-number.tsx",
    "packages/templates-ternus/src/components/ternus-footer.tsx",
    "packages/templates-ternus/src/components/ternus-hero.tsx",
    "packages/templates-ternus/src/components/ternus-nav.tsx",
    "packages/templates-ternus/src/components/ternus-netstrip.tsx",
    "packages/templates-ternus/src/components/token-donut.tsx",
    "packages/templates-ternus/src/components/token.tsx",
    "packages/templates-ternus/src/lib/use-in-view.ts",
    "packages/templates-ternus/src/lib/use-scroll-progress.ts",
  ],
};
