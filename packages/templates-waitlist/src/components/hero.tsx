"use client";

import { EmailForm } from "./email-form";
import { Reveal } from "./reveal";

export interface HeroContent {
  eyebrow: string;
  title: string;
  /** Gradient-accented tail of the headline. */
  titleAccent: string;
  sub: string;
  emailPlaceholder: string;
  submitLabel: string;
  confirm: string;
  proof: string;
  scrollCue: string;
}

const DEFAULT_CONTENT: HeroContent = {
  eyebrow: "◷ Mainnet launching Q3 2026",
  title: "The trust layer for",
  titleAccent: "on-chain finance",
  sub: "Audited, non-custodial, sub-second settlement. Join the waitlist to onboard ahead of the public.",
  emailPlaceholder: "you@email.com",
  submitLabel: "Join waitlist",
  confirm: "✓ You're on the list — see you when early access opens.",
  proof: "★★★★★  2,431 builders already joined",
  scrollCue: "SCROLL TO EXPLORE ↓",
};

interface HeroProps {
  /** `prefers-reduced-motion`, from the template's single hook call. */
  reduced?: boolean;
  content?: HeroContent;
}

/** Full-bleed hero: headline + core email capture, with the flow-knot behind. */
export function Hero({
  reduced = false,
  content = DEFAULT_CONTENT,
}: HeroProps) {
  return (
    <section className="hero" id="join">
      <div className="wrap">
        <Reveal reduced={reduced} className="wl-hero-col">
          <span className="eyebrow">{content.eyebrow}</span>
          <h1>
            {content.title} <span className="grad">{content.titleAccent}</span>
          </h1>
          <p className="sub">{content.sub}</p>
          <EmailForm
            placeholder={content.emailPlaceholder}
            submitLabel={content.submitLabel}
            confirm={content.confirm}
            proof={content.proof}
          />
        </Reveal>
      </div>
      <div className={`scrollcue ${reduced ? "" : "wl-bob"}`.trim()}>
        {content.scrollCue}
      </div>
    </section>
  );
}
