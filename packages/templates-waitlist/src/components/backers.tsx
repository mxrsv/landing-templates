"use client";

import { Reveal } from "./reveal";

export interface BackersContent {
  label: string;
  /** Text wordmarks of the backing funds — kept as plain strings (props-ised). */
  logos: string[];
}

const DEFAULT_CONTENT: BackersContent = {
  label: "Backed by leading funds",
  logos: [
    "Sequoia",
    "a16z crypto",
    "Paradigm",
    "Coinbase Ventures",
    "Variant",
    "Dragonfly",
    "Polychain",
  ],
};

interface BackersProps {
  /** `prefers-reduced-motion`, from the template's single hook call. */
  reduced?: boolean;
  content?: BackersContent;
}

/**
 * Social-proof logo strip. Motion path is a seamless CSS marquee (two identical
 * tracks translated -50%); reduced-motion swaps to a static wrapped row so the
 * wordmarks stand still and stay fully readable.
 */
export function Backers({
  reduced = false,
  content = DEFAULT_CONTENT,
}: BackersProps) {
  return (
    <section className="backers" aria-label="Backers">
      <div className="wrap">
        <Reveal reduced={reduced}>
          <p className="backers-label">{content.label}</p>
        </Reveal>

        {reduced ? (
          <ul className="backers-static" role="list">
            {content.logos.map((name) => (
              <li key={name} className="backer-logo">
                {name}
              </li>
            ))}
          </ul>
        ) : (
          <div className="backers-marquee">
            <div className="backers-flow">
              {/* The visible track + an aria-hidden duplicate that lets the
                  -50% translate loop seamlessly with no visible seam. */}
              <ul className="backers-track" role="list">
                {content.logos.map((name) => (
                  <li key={name} className="backer-logo">
                    {name}
                  </li>
                ))}
              </ul>
              <ul className="backers-track" aria-hidden="true">
                {content.logos.map((name) => (
                  <li key={`dup-${name}`} className="backer-logo">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
