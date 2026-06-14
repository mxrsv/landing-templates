/**
 * Catalog metadata cho Waitlist (brand demo Aenor) — pure data, KHÔNG import
 * component (catalog aggregator là server module; import component sẽ kéo
 * Three.js vào server bundle).
 *
 * Shape bám `PieceMeta` canonical (apps/docs/lib/catalog/types.ts); aggregator
 * structural-match khi registration. Ion là *skin* riêng (token `--wl-*`),
 * mood vẫn `infra` để ăn `--p-*` chung.
 *
 * `sourcePaths` là growing-list: chỉ liệt kê file đã tồn tại để copy viewer
 * (RSC fs.readFile build-time) không ném; mở rộng dần khi thêm component.
 */
interface WaitlistPieceMeta {
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

export const pieceMeta: WaitlistPieceMeta = {
  slug: "waitlist",
  name: "Aenor — Waitlist",
  layer: "template",
  mood: ["infra"],
  useCase: ["waitlist", "crypto", "fintech"],
  stackTags: ["next", "react", "three"],
  animationTags: ["webgl", "scroll-reveal", "count-up"],
  deps: ["@landing/ui", "next", "react", "three"],
  copyMode: "multi",
  sourcePaths: [
    "packages/templates-waitlist/src/template.tsx",
    "packages/templates-waitlist/src/waitlist.css",
    "packages/templates-waitlist/src/components/waitlist-nav.tsx",
    "packages/templates-waitlist/src/components/hero.tsx",
    "packages/templates-waitlist/src/components/email-form.tsx",
    "packages/templates-waitlist/src/components/waitlist-footer.tsx",
    "packages/templates-waitlist/src/components/flow-knot.tsx",
    "packages/templates-waitlist/src/components/backers.tsx",
    "packages/templates-waitlist/src/components/perks.tsx",
    "packages/templates-waitlist/src/components/latency-gauge.tsx",
    "packages/templates-waitlist/src/components/reach-globe.tsx",
    "packages/templates-waitlist/src/components/stats.tsx",
    "packages/templates-waitlist/src/components/transform.tsx",
    "packages/templates-waitlist/src/components/trust.tsx",
    "packages/templates-waitlist/src/components/closing-cta.tsx",
    "packages/templates-waitlist/src/components/faq.tsx",
    "packages/templates-waitlist/src/components/reveal.tsx",
    "packages/templates-waitlist/src/components/stat-number.tsx",
    "packages/templates-waitlist/src/lib/use-in-view.ts",
    "packages/templates-waitlist/src/lib/use-scroll-progress.ts",
    "packages/templates-waitlist/src/lib/waitlist-email.ts",
  ],
};
