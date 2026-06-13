"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { AikitFeatures } from "@landing/sections/aikit-features";
import { AikitGallery } from "@landing/sections/aikit-gallery";
import { AikitHero } from "@landing/sections/aikit-hero";
import { AikitPricing } from "@landing/sections/aikit-pricing";
import { AikitTestimonial } from "@landing/sections/aikit-testimonial";
import { ErrorBoundary } from "@landing/ui/lib/error-boundary";
import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";

import "./aikit.css";

const NAV_LINKS = ["Features", "Developers", "Pricing", "Changelog"] as const;
const FOOTER_LINKS = [
  "Features",
  "Developers",
  "Company",
  "Blog",
  "Changelog",
] as const;

interface SocialLink {
  readonly label: string;
  readonly icon: ReactNode;
}

const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    label: "X",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.62c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.64 3.64 0 0 0-.88-1.35 3.64 3.64 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07Zm0 2.76a5.46 5.46 0 1 1 0 10.92 5.46 5.46 0 0 1 0-10.92Zm0 9a3.54 3.54 0 1 0 0-7.08 3.54 3.54 0 0 0 0 7.08Zm6.95-9.22a1.28 1.28 0 1 1-2.55 0 1.28 1.28 0 0 1 2.55 0Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M23.5 6.51a3 3 0 0 0-2.11-2.12C19.5 3.88 12 3.88 12 3.88s-7.5 0-9.39.51A3 3 0 0 0 .5 6.51 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.49 3 3 0 0 0 2.11 2.12c1.89.51 9.39.51 9.39.51s7.5 0 9.39-.51a3 3 0 0 0 2.11-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.49ZM9.6 15.6V8.4l6.24 3.6Z" />
      </svg>
    ),
  },
];

function BrandMark() {
  return <span className="ak-brand-mark" aria-hidden="true" />;
}

/**
 * AI-kit — a faithful clone of the Framer "AI Startup Website Kit" landing
 * (SaaS/AI mood): black canvas, violet (#8C45FF) accent, oversized Inter
 * headings. Composes the AI-kit sections (hero, features, testimonial, pricing)
 * with a floating pill nav, a glowing closing CTA, and a multi-column footer.
 * The chrome (nav / CTA / footer) is owned here; sections self-scope
 * `data-theme="aikit"` and the wrapper scopes it too so chrome shares tokens.
 * CTA scroll-reveal (fade + translateY) is gated behind `useReducedMotion()`
 * — reduced motion renders the band fully visible and static.
 */
export function AikitTemplate() {
  const reduced = useReducedMotion();
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    if (reduced) {
      setCtaVisible(true);
      return;
    }
    const node = ctaRef.current;
    if (node === null) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setCtaVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  const ctaClass = [
    "ak-cta-band",
    reduced ? "" : "ak-cta-band--anim",
    ctaVisible ? "is-visible" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div data-theme="aikit" className="ak-root" id="top">
      <header className="ak-nav-wrap">
        <nav className="ak-nav" aria-label="Primary">
          <a
            className="ak-brand"
            href="#top"
            aria-label="AI Startup Website Kit"
          >
            <BrandMark />
          </a>
          <div className="ak-nav-links">
            {NAV_LINKS.map((label) => (
              <a key={label} href="#top">
                {label}
              </a>
            ))}
          </div>
          <button type="button" className="ak-btn ak-btn--solid ak-btn--sm">
            Join waitlist
          </button>
        </nav>
      </header>

      <main>
        <AikitHero />
        <AikitFeatures />
        <AikitGallery />
        <AikitTestimonial />
        <AikitPricing />

        <section
          data-theme="aikit"
          className="ak-cta"
          aria-labelledby="ak-cta-title"
        >
          <ErrorBoundary label="Call to action unavailable">
            <div ref={ctaRef} className={ctaClass}>
              <div className="ak-cta-stars" aria-hidden="true" />
              <span className="ak-cta-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M 12 12 C 12 12 13.5 7.983 13.5 5.143 C 13.5 2.302 12.828 0 12 0 C 11.172 0 10.5 2.303 10.5 5.143 C 10.5 7.983 12 12 12 12 Z M 12 12 C 12 12 13.78 15.901 15.788 17.909 C 17.796 19.918 19.899 21.071 20.485 20.485 C 21.071 19.899 19.918 17.796 17.909 15.788 C 15.901 13.78 12 12 12 12 Z M 12 12 C 12 12 16.017 10.5 18.857 10.5 C 21.697 10.5 24 11.172 24 12 C 24 12.828 21.697 13.5 18.857 13.5 C 16.017 13.5 12 12 12 12 Z M 12 12 C 12 12 8.099 13.78 6.091 15.788 C 4.082 17.796 2.929 19.899 3.515 20.485 C 4.101 21.071 6.204 19.918 8.212 17.909 C 10.22 15.901 12 12 12 12 Z M 12 12 C 12.003 12.009 13.5 16.02 13.5 18.857 C 13.5 21.697 12.828 24 12 24 C 11.172 24 10.5 21.697 10.5 18.857 C 10.5 16.017 12 12 12 12 Z M 12 12 C 12 12 7.983 10.5 5.143 10.5 C 2.302 10.5 0 11.172 0 12 C 0 12.828 2.303 13.5 5.143 13.5 C 7.983 13.5 12 12 12 12 Z M 12 12 C 12 12 15.901 10.22 17.909 8.212 C 19.918 6.204 21.071 4.101 20.485 3.515 C 19.899 2.929 17.796 4.082 15.788 6.091 C 13.78 8.099 12 12 12 12 Z M 8.212 6.091 C 10.22 8.099 12 12 12 12 C 12 12 8.099 10.22 6.091 8.212 C 4.082 6.204 2.929 4.1 3.515 3.515 C 4.101 2.929 6.204 4.082 8.212 6.091 Z" />
                </svg>
              </span>
              <h2 id="ak-cta-title" className="ak-cta-title">
                The magic of AI at your fingertips.
              </h2>
              <p className="ak-cta-sub">
                Achieve clear, impactful results without the complexity.
              </p>
              <button type="button" className="ak-btn ak-btn--solid">
                Try for free
              </button>
            </div>
          </ErrorBoundary>
        </section>
      </main>

      <footer className="ak-footer">
        <div className="ak-footer-inner">
          <a className="ak-footer-brand" href="#top">
            <BrandMark />
            AI Startup Website Kit
          </a>
          <nav className="ak-footer-links" aria-label="Footer">
            {FOOTER_LINKS.map((label) => (
              <a key={label} href="#top">
                {label}
              </a>
            ))}
          </nav>
          <div className="ak-footer-social">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href="#top"
                className="ak-social"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AikitTemplate;
