"use client";

import { Reveal } from "./reveal";

export interface Perk {
  /** Decorative glyph (aria-hidden) shown above the title. */
  icon: string;
  title: string;
  body: string;
}

export interface PerksContent {
  eyebrow: string;
  heading: string;
  perks: Perk[];
}

const DEFAULT_CONTENT: PerksContent = {
  eyebrow: "Why join early",
  heading: "Perks reserved for early movers",
  perks: [
    {
      icon: "◇",
      title: "Early access",
      body: "Onboard ahead of the public and lock in preferential fees for the lifetime of your waitlist account.",
    },
    {
      icon: "◷",
      title: "Priority support",
      body: "A private channel with the core team, faster responses, and a say in shaping the product roadmap.",
    },
    {
      icon: "✦",
      title: "Genesis rewards",
      body: "An allowlist spot in the genesis distribution, reserved exclusively for early sign-ups.",
    },
  ],
};

interface PerksProps {
  /** `prefers-reduced-motion`, from the template's single hook call. */
  reduced?: boolean;
  content?: PerksContent;
}

/** Three reasons to join, revealed with a small stagger as they scroll in. */
export function Perks({
  reduced = false,
  content = DEFAULT_CONTENT,
}: PerksProps) {
  return (
    <section className="perks" aria-label="Perks">
      <div className="wrap">
        <Reveal reduced={reduced}>
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="perks-h">{content.heading}</h2>
        </Reveal>

        <div className="perks-grid">
          {content.perks.map((perk, i) => (
            <Reveal
              key={perk.title}
              reduced={reduced}
              className="perk"
              delay={i * 90}
            >
              <span className="perk-icon" aria-hidden="true">
                {perk.icon}
              </span>
              <h3 className="perk-title">{perk.title}</h3>
              <p className="perk-body">{perk.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
