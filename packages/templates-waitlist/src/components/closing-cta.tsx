"use client";

import { EmailForm } from "./email-form";
import { Reveal } from "./reveal";

export interface ClosingCtaContent {
  eyebrow: string;
  heading: string;
  /** Gradient-accented tail of the heading. */
  headingAccent: string;
  sub: string;
  emailPlaceholder: string;
  submitLabel: string;
  confirm: string;
}

const DEFAULT_CONTENT: ClosingCtaContent = {
  eyebrow: "One spot left for you",
  heading: "Get on the list before",
  headingAccent: "mainnet opens",
  sub: "Early access is capped. Drop your email and we'll reach out the moment your seat is ready.",
  emailPlaceholder: "you@email.com",
  submitLabel: "Join waitlist",
  confirm: "✓ You're on the list — see you when early access opens.",
};

interface ClosingCtaProps {
  /** `prefers-reduced-motion`, from the template's single hook call. */
  reduced?: boolean;
  content?: ClosingCtaContent;
}

/**
 * Closing call-to-action. Reuses the same EmailForm as the hero so the capture
 * logic and confirm behaviour stay identical across both entry points (spec §7).
 */
export function ClosingCta({
  reduced = false,
  content = DEFAULT_CONTENT,
}: ClosingCtaProps) {
  return (
    <section className="closing-cta" id="start" aria-label="Join the waitlist">
      <div className="wrap">
        <Reveal reduced={reduced} className="closing-col">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="closing-h">
            {content.heading}{" "}
            <span className="grad">{content.headingAccent}</span>
          </h2>
          <p className="closing-sub">{content.sub}</p>
          <EmailForm
            placeholder={content.emailPlaceholder}
            submitLabel={content.submitLabel}
            confirm={content.confirm}
          />
        </Reveal>
      </div>
    </section>
  );
}
