"use client";

import { useState, type ReactNode } from "react";

import { ErrorBoundary } from "@landing/ui/lib/error-boundary";
import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";

import "./aikit-hero.css";

interface HeroLogo {
  readonly name: string;
  readonly mark: ReactNode;
}

/* Trust-strip wordmarks. Marks are small inline glyphs matching the source
   (6-point burst, 4-point sparkle, X); 2TWICE is a plain wordmark. */
const HERO_LOGOS: readonly HeroLogo[] = [
  {
    name: "Quantum",
    mark: (
      <svg viewBox="0 0 24 24" aria-hidden focusable="false">
        <path d="M12 1l2.2 6.2L20.5 4l-3.2 6.3L24 12l-6.7 1.7 3.2 6.3-6.3-3.2L12 23l-1.7-6.2L4 20l3.2-6.3L1 12l6.2-1.7L4 4l6.3 3.2z" />
      </svg>
    ),
  },
  {
    name: "Celestial",
    mark: (
      <svg viewBox="0 0 24 24" aria-hidden focusable="false">
        <path d="M12 0c0 6 0 6 0 12 0-6 0-6 0-12zm0 12c0 6 0 6 0 12 0-6 0-6 0-12zm0 0c6 0 6 0 12 0-6 0-6 0-12 0zm0 0c-6 0-6 0-12 0 6 0 6 0 12 0zm0 0l8.5 8.5L12 12l8.5-8.5zm0 0L3.5 3.5 12 12l-8.5 8.5z" />
      </svg>
    ),
  },
  {
    name: "Echo Valley",
    mark: (
      <svg viewBox="0 0 24 24" aria-hidden focusable="false">
        <path d="M16.6 5h2.5l-5.4 6 6.3 8h-5l-3.9-4.9L6.8 19H4.3l5.8-6.4L4 5h5.1l3.5 4.5z" />
      </svg>
    ),
  },
  { name: "2TWICE", mark: null },
];

/**
 * AI-kit hero — faithful clone of the Framer "AI Startup Website Kit" (example-2)
 * hero. Left column: a "New" chip badge, an oversized two-line Inter headline
 * ("Elevate your" / "SEO efforts.") with a grey→white left-to-right wash, a muted
 * sub, and a rounded-8px waitlist box (email input + white "Join waitlist"
 * button). Right side: the real `/aikit/hero-cubes.png` cluster floating over a
 * purple radial glow and a faint perspective grid. The slow cube float + glow
 * drift are gated behind `useReducedMotion()`. Self-scopes `data-theme="aikit"`.
 */
export function AikitHero() {
  const reduced = useReducedMotion();
  const [email, setEmail] = useState("");
  const rootClass = ["ak-hero", reduced ? "" : "ak-hero--anim"]
    .filter(Boolean)
    .join(" ");

  return (
    <section data-theme="aikit" className={rootClass}>
      <ErrorBoundary label="Hero unavailable">
        <div className="ak-hero-bg" aria-hidden>
          <div className="ak-hero-grid" />
          <div className="ak-hero-glow" />
        </div>

        <div className="ak-hero-art" aria-hidden>
          <img
            className="ak-hero-cubes"
            src="/aikit/hero-cubes.png"
            alt=""
            width={2550}
            height={2550}
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="ak-hero-inner">
          <div className="ak-hero-copy">
            <span className="ak-badge">
              <span className="ak-badge-chip">New</span>
              <span className="ak-badge-text">
                Latest integration just arrived
              </span>
            </span>

            <h1 className="ak-hero-title">
              <span className="ak-hero-title-line">Elevate your</span>
              <span className="ak-hero-title-line">SEO efforts.</span>
            </h1>

            <p className="ak-hero-sub">
              Unlock the full potential of your website with our AI tool,
              designed to streamline and simplify SEO.
            </p>

            <form
              className="ak-waitlist"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                className="ak-waitlist-input"
                placeholder="Your email"
                aria-label="Your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit" className="ak-waitlist-btn">
                Join waitlist
              </button>
            </form>
          </div>

          <div className="ak-hero-trust">
            <span className="ak-hero-trust-label">
              Trusted by top innovative teams
            </span>
            <ul className="ak-hero-logos">
              {HERO_LOGOS.map((logo) => (
                <li key={logo.name} className="ak-hero-logo">
                  <span className="ak-hero-logo-mark" aria-hidden>
                    {logo.mark}
                  </span>
                  {logo.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ErrorBoundary>
    </section>
  );
}

export default AikitHero;
