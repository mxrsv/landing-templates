"use client";

import { Reveal } from "./reveal";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqContent {
  eyebrow: string;
  heading: string;
  items: FaqItem[];
}

const DEFAULT_CONTENT: FaqContent = {
  eyebrow: "Questions",
  heading: "Everything you might ask",
  items: [
    {
      q: "Does joining the waitlist cost anything?",
      a: "No. The waitlist is free and non-binding — it simply reserves your place for early access.",
    },
    {
      q: "When does early access open?",
      a: "We onboard in waves ahead of the Q3 2026 mainnet launch. Waitlist members are invited first, in sign-up order.",
    },
    {
      q: "Is Aenor custodial?",
      a: "Never. Aenor is fully non-custodial — you keep control of your keys and funds at all times.",
    },
    {
      q: "Which chains will be supported at launch?",
      a: "Ethereum and the major L2s at mainnet, with more networks added through the public roadmap.",
    },
    {
      q: "How do you handle my email?",
      a: "It's used only to notify you about early access. No spam, and you can unsubscribe in one click.",
    },
  ],
};

interface FaqProps {
  /**
   * `prefers-reduced-motion`, from the template's single hook call. Only gates
   * the section reveal — the accordion itself is native `<details>`, so it opens
   * and closes (and never animates height) regardless of this flag.
   */
  reduced?: boolean;
  content?: FaqContent;
}

/**
 * FAQ accordion built on native `<details>`/`<summary>` — keyboard-operable and
 * functional with no JS. The open/close content fade is CSS-only and disabled
 * under reduced-motion; height is never animated (spec §6, row 10).
 */
export function Faq({ reduced = false, content = DEFAULT_CONTENT }: FaqProps) {
  return (
    <section className="faq" aria-label="FAQ">
      <div className="wrap">
        <Reveal reduced={reduced}>
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="faq-h">{content.heading}</h2>
        </Reveal>

        <div className="faq-list">
          {content.items.map((item) => (
            <details key={item.q} className="faq-item">
              <summary className="faq-q">
                <span>{item.q}</span>
                <span className="faq-mark" aria-hidden="true" />
              </summary>
              <p className="faq-a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
