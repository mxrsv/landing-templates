"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

import { ErrorBoundary } from "@landing/ui/lib/error-boundary";
import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";

import "./aikit-gallery.css";

interface Shot {
  readonly title: string;
  readonly caption: string;
  /** object-position used to crop a distinct region of the shared frame. */
  readonly pos: string;
}

/* Six tiles cropped from the single product frame (different object-position
   regions) so the grid reads as multiple product screenshots without needing
   six separate assets. Captions label the surfaced region. */
const SHOTS: readonly Shot[] = [
  {
    title: "Site Overview",
    caption: "Visibility & traffic at a glance",
    pos: "0% 0%",
  },
  {
    title: "Keyword Analytics",
    caption: "Track organic keyword movement",
    pos: "100% 0%",
  },
  {
    title: "Visibility Trends",
    caption: "Daily performance over time",
    pos: "50% 38%",
  },
  {
    title: "Backlink Audit",
    caption: "Monitor your link profile",
    pos: "0% 100%",
  },
  {
    title: "Traffic Insights",
    caption: "Sessions broken down by source",
    pos: "100% 100%",
  },
  {
    title: "Goal Tracking",
    caption: "Set and hit your SEO targets",
    pos: "50% 100%",
  },
];

/**
 * Scroll-reveal (fade + translateY) via IntersectionObserver. Honors reduced
 * motion (always shown). Disconnects after the first reveal.
 */
function useReveal<T extends HTMLElement>(
  disabled: boolean,
): {
  ref: RefObject<T | null>;
  shown: boolean;
} {
  const [shown, setShown] = useState(disabled);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (disabled) {
      setShown(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [disabled]);

  return { ref, shown };
}

/**
 * AI-kit gallery — a 3-col × 2-row grid of product screenshots (purple eyebrow +
 * centered heading on top). Each tile crops a different region of the shared
 * product frame, zooms on hover, and lights a purple glow. Scroll-reveal stagger
 * is gated behind `useReducedMotion()`. Self-scopes `data-theme="aikit"`.
 */
export function AikitGallery() {
  const reduced = useReducedMotion();
  const head = useReveal<HTMLElement>(reduced);
  const grid = useReveal<HTMLUListElement>(reduced);

  return (
    <section data-theme="aikit" className="ak-gal">
      <ErrorBoundary label="Gallery unavailable">
        <div className="ak-gal-inner">
          <header
            ref={head.ref}
            className="ak-gal-head"
            data-shown={head.shown}
          >
            <span className="ak-gal-eyebrow">See it in action</span>
            <h2 className="ak-gal-title">
              Every metric that matters, in one clean workspace.
            </h2>
          </header>

          <ul ref={grid.ref} className="ak-gal-grid" data-shown={grid.shown}>
            {SHOTS.map((shot, i) => (
              <li
                key={shot.title}
                className="ak-gal-card"
                style={{ "--ak-i": i } as CSSProperties}
              >
                <figure className="ak-gal-figure">
                  <img
                    className="ak-gal-img"
                    src="/aikit/features-frame.png"
                    alt={`${shot.title} — ${shot.caption}`}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: shot.pos }}
                  />
                  <figcaption className="ak-gal-cap">
                    <span className="ak-gal-name">{shot.title}</span>
                    <span className="ak-gal-sub">{shot.caption}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </ErrorBoundary>
    </section>
  );
}

export default AikitGallery;
