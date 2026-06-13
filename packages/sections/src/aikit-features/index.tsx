"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { ErrorBoundary } from "@landing/ui/lib/error-boundary";
import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";

import "./aikit-features.css";

interface Feature {
  icon: ReactNode;
  title: string;
  body: string;
  tag?: string;
}

/* Real Phosphor (bold) icons from icons.svg.txt — inline style/width/color
   attrs stripped; sized + colored via CSS (.ak-feat-icon svg). 256 viewBox. */
const I = {
  gauge: (
    <svg viewBox="0 0 256 256" aria-hidden="true">
      <path d="M209.88,69.83A115.19,115.19,0,0,0,128,36h-.41C63.85,36.22,12,88.76,12,153.13V176a20,20,0,0,0,20,20H224a20,20,0,0,0,20-20V152A115.25,115.25,0,0,0,209.88,69.83ZM220,172H127.32l46.44-65A12,12,0,1,0,154.24,93L97.82,172H36V153.13c0-1.72,0-3.43.14-5.13H56a12,12,0,0,0,0-24H40.62c10.91-33.39,40-58.52,75.38-63.21V80a12,12,0,0,0,24,0V60.8A92,92,0,0,1,215.66,124H200a12,12,0,0,0,0,24h19.9c.06,1.33.1,2.66.1,4Z" />
    </svg>
  ),
  reports: (
    <svg viewBox="0 0 256 256" aria-hidden="true">
      <path d="M236,208a12,12,0,0,1-12,12H32a12,12,0,0,1-12-12V48a12,12,0,0,1,24,0v85.55L88.1,95a12,12,0,0,1,15.1-.57l56.22,42.16L216.1,87A12,12,0,1,1,231.9,105l-64,56a12,12,0,0,1-15.1.57L96.58,119.44,44,165.45V196H224A12,12,0,0,1,236,208Z" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 256 256" aria-hidden="true">
      <path d="M199,125.31l-49.88-18.39L130.69,57a19.92,19.92,0,0,0-37.38,0L74.92,106.92,25,125.31a19.92,19.92,0,0,0,0,37.38l49.88,18.39L93.31,231a19.92,19.92,0,0,0,37.38,0l18.39-49.88L199,162.69a19.92,19.92,0,0,0,0-37.38Zm-63.38,35.16a12,12,0,0,0-7.11,7.11L112,212.28l-16.47-44.7a12,12,0,0,0-7.11-7.11L43.72,144l44.7-16.47a12,12,0,0,0,7.11-7.11L112,75.72l16.47,44.7a12,12,0,0,0,7.11,7.11L180.28,144ZM140,40a12,12,0,0,1,12-12h12V16a12,12,0,0,1,24,0V28h12a12,12,0,0,1,0,24H188V64a12,12,0,0,1-24,0V52H152A12,12,0,0,1,140,40ZM252,88a12,12,0,0,1-12,12h-4v4a12,12,0,0,1-24,0v-4h-4a12,12,0,0,1,0-24h4V72a12,12,0,0,1,24,0v4h4A12,12,0,0,1,252,88Z" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 256 256" aria-hidden="true">
      <path d="M228,128a12,12,0,0,1-12,12H128a12,12,0,0,1,0-24h88A12,12,0,0,1,228,128ZM128,76h88a12,12,0,0,0,0-24H128a12,12,0,0,0,0,24Zm88,104H128a12,12,0,0,0,0,24h88a12,12,0,0,0,0-24ZM79.51,39.51,56,63l-7.51-7.52a12,12,0,0,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Zm0,64L56,127l-7.51-7.52a12,12,0,1,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Zm0,64L56,191l-7.51-7.52a12,12,0,1,0-17,17l16,16a12,12,0,0,0,17,0l32-32a12,12,0,0,0-17-17Z" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 256 256" aria-hidden="true">
      <path d="M229.26,90.4a108,108,0,0,1-177.63,114A108,108,0,0,1,195.41,43.63l20.1-20.11a12,12,0,0,1,17,17l-96,96a12,12,0,1,1-17-17l24-24a36,36,0,1,0,19.76,39.65,12,12,0,0,1,23.53,4.74,60,60,0,1,1-25.73-62L178.3,60.74a84,84,0,1,0,28.46,38,12,12,0,1,1,22.5-8.35Z" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 256 256" aria-hidden="true">
      <path d="M225.81,74.65A11.86,11.86,0,0,1,220.3,76a12,12,0,0,1-10.67-6.47,90.1,90.1,0,0,0-32-35.38,12,12,0,1,1,12.8-20.29,115.25,115.25,0,0,1,40.54,44.62A12,12,0,0,1,225.81,74.65ZM46.37,69.53a90.1,90.1,0,0,1,32-35.38A12,12,0,1,0,65.6,13.86,115.25,115.25,0,0,0,25.06,58.48a12,12,0,0,0,5.13,16.17A11.86,11.86,0,0,0,35.7,76,12,12,0,0,0,46.37,69.53Zm173.51,98.35A20,20,0,0,1,204,200H171.81a44,44,0,0,1-87.62,0H52a20,20,0,0,1-15.91-32.12c7.17-9.33,15.73-26.62,15.88-55.94A76,76,0,0,1,204,112C204.15,141.26,212.71,158.55,219.88,167.88ZM147.6,200H108.4a20,20,0,0,0,39.2,0Zm48.74-24c-8.16-13-16.19-33.57-16.34-63.94A52,52,0,1,0,76,112c-.15,30.42-8.18,51-16.34,64Z" />
    </svg>
  ),
};

const FEATURES: readonly Feature[] = [
  {
    icon: I.gauge,
    title: "User-friendly dashboard",
    body: "Perform complex SEO audits and optimizations with a single click.",
  },
  {
    icon: I.reports,
    title: "Visual reports",
    body: "Visual insights into your site's performance.",
  },
  {
    icon: I.spark,
    title: "Smart Keyword Generator",
    body: "Automatic suggestions and the best keywords to target.",
    tag: "NEW",
  },
  {
    icon: I.list,
    title: "Content evaluation",
    body: "Simple corrections for immediate improvemens.",
  },
  {
    icon: I.target,
    title: "SEO goal setting",
    body: "Helps you set and achieve SEO goals with guided assistance.",
  },
  {
    icon: I.bell,
    title: "Automated alerts",
    body: "Automatic notifications about your SEO health, including quick fixes.",
  },
];

/**
 * Scroll-reveal: fade + translateY via IntersectionObserver. Returns a ref to
 * attach and whether the element is in view. Honors reduced-motion (always
 * "shown"). Disconnects after first reveal.
 */
function useReveal(disabled: boolean): {
  ref: (node: HTMLElement | null) => void;
  shown: boolean;
} {
  const [shown, setShown] = useState(disabled);
  const observed = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (disabled) {
      setShown(true);
      return;
    }
    const node = observed.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [disabled]);

  const ref = (node: HTMLElement | null) => {
    observed.current = node;
  };

  return { ref, shown };
}

/**
 * AI-kit features — purple text eyebrow + oversized centered heading, a real
 * product frame (`/aikit/features-frame.png`) with a centered circular play
 * button and inner purple glow, then a 3-col × 2-row grid of six icon-led
 * feature cards (one flagged NEW). Scroll-reveal gated behind reduced-motion.
 */
export function AikitFeatures() {
  const reduced = useReducedMotion();
  const head = useReveal(reduced);
  const frame = useReveal(reduced);
  const grid = useReveal(reduced);

  return (
    <section data-theme="aikit" className="ak-feat">
      <ErrorBoundary label="Features unavailable">
        <div className="ak-feat-inner">
          <header
            ref={head.ref}
            className="ak-feat-head"
            data-shown={head.shown}
          >
            <span className="ak-feat-eyebrow">Everything you need</span>
            <h2 className="ak-feat-title">
              Harness the power of AI, making search engine optimization
              intuitive and effective for all skill levels.
            </h2>
          </header>

          <div ref={frame.ref} className="ak-frame" data-shown={frame.shown}>
            <img
              className="ak-frame-img"
              src="/aikit/features-frame.png"
              alt="Product dashboard showing site overview, visibility and keyword analytics"
              loading="lazy"
              decoding="async"
            />
            <span className="ak-frame-glow" aria-hidden="true" />
            <button
              type="button"
              className="ak-play"
              aria-label="Play product overview"
            >
              <span className="ak-play-ring" aria-hidden="true" />
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>

          <ul ref={grid.ref} className="ak-feat-grid" data-shown={grid.shown}>
            {FEATURES.map((f, i) => (
              <li
                key={f.title}
                className="ak-feat-card"
                style={{ "--ak-i": i } as CSSProperties}
              >
                <div className="ak-feat-cardhead">
                  <span className="ak-feat-icon">{f.icon}</span>
                  <h3 className="ak-feat-name">{f.title}</h3>
                  {f.tag ? <span className="ak-feat-tag">{f.tag}</span> : null}
                </div>
                <p className="ak-feat-body">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </ErrorBoundary>
    </section>
  );
}

export default AikitFeatures;
