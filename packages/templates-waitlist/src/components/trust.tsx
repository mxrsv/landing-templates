"use client";

import { Reveal } from "./reveal";

export interface TrustBadge {
  /** Decorative glyph (aria-hidden). */
  icon: string;
  title: string;
  caption: string;
}

export interface TrustContent {
  eyebrow: string;
  heading: string;
  badges: TrustBadge[];
}

const DEFAULT_CONTENT: TrustContent = {
  eyebrow: "Built to be trusted",
  heading: "Security is the product",
  badges: [
    {
      icon: "⬡",
      title: "SOC 2 Type II",
      caption: "Independently audited every year",
    },
    { icon: "◈", title: "Non-custodial", caption: "You hold the keys, always" },
    {
      icon: "❖",
      title: "Open source",
      caption: "Every contract verifiable on-chain",
    },
    {
      icon: "✕",
      title: "Zero exploits",
      caption: "No funds lost since genesis",
    },
  ],
};

interface TrustProps {
  /** `prefers-reduced-motion`, from the template's single hook call. */
  reduced?: boolean;
  content?: TrustContent;
}

/** Trust badges — security assurances, revealed with a small stagger. */
export function Trust({
  reduced = false,
  content = DEFAULT_CONTENT,
}: TrustProps) {
  return (
    <section className="trust" aria-label="Trust">
      <div className="wrap">
        <Reveal reduced={reduced}>
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="trust-h">{content.heading}</h2>
        </Reveal>

        <div className="trust-grid">
          {content.badges.map((badge, i) => (
            <Reveal
              key={badge.title}
              reduced={reduced}
              className="trust-badge"
              delay={i * 80}
            >
              <span className="trust-icon" aria-hidden="true">
                {badge.icon}
              </span>
              <h3 className="trust-title">{badge.title}</h3>
              <p className="trust-caption">{badge.caption}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
