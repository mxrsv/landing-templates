"use client";

import { useEffect, useRef, useState } from "react";

import { ErrorBoundary } from "@landing/ui/lib/error-boundary";
import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";

import "./aikit-testimonial.css";

/**
 * AI-kit testimonial — faithful clone of the Framer "AI Startup Website Kit"
 * testimonial band: a wide panel washed with a purple radial glow + a faint
 * starfield, holding a rounded-square avatar (`/aikit/testimonial-avatar.png`)
 * on the left and a 23px quote with name/role attribution on the right.
 *
 * Scroll-reveal (fade + translateY) is gated behind `useReducedMotion()` — when
 * reduced, the content renders static and fully visible. Self-scopes
 * `data-theme="aikit"`.
 */
export function AikitTestimonial() {
  const reduced = useReducedMotion();
  const figureRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reduced) {
      setRevealed(true);
      return;
    }
    const node = figureRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  const figureClass = ["ak-testi-card", revealed ? "is-revealed" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section data-theme="aikit" className="ak-testi">
      <ErrorBoundary label="Testimonial unavailable">
        <div className="ak-testi-band">
          <div className="ak-testi-wash" aria-hidden />
          <div className="ak-testi-stars" aria-hidden />
          <figure ref={figureRef} className={figureClass}>
            <img
              className="ak-testi-avatar"
              src="/aikit/testimonial-avatar.png"
              alt="Talia Taylor"
              width={96}
              height={96}
              loading="lazy"
              decoding="async"
            />
            <div className="ak-testi-body">
              <blockquote className="ak-testi-quote">
                {"“"}This product has completely transformed how I manage my
                projects and deadlines{"”"}
              </blockquote>
              <figcaption className="ak-testi-cite">
                <span className="ak-testi-name">Talia Taylor</span>
                <span className="ak-testi-role">
                  Digital Marketing Director @ Quantum
                </span>
              </figcaption>
            </div>
          </figure>
        </div>
      </ErrorBoundary>
    </section>
  );
}

export default AikitTestimonial;
