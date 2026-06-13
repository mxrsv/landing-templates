"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";

import "./token-stats-strip.css";

interface Stat {
  label: string;
  to: number;
  dec?: number;
  prefix?: string;
  suffix?: string;
}

/** Mock on-chain stats — no live feed (out of scope v1). */
const STATS: Stat[] = [
  { label: "Holders", to: 48217 },
  { label: "24h Volume", to: 12.4, dec: 1, prefix: "$", suffix: "M" },
  { label: "Market Cap", to: 84.1, dec: 1, prefix: "$", suffix: "M" },
  { label: "Total Supply", to: 1, suffix: "B" },
];

interface CountUpProps extends Stat {
  durationMs?: number;
}

/**
 * Count-up that runs once on scroll into view. Reduced motion → final value
 * immediately. IntersectionObserver inlined to keep the section self-contained
 * for single-file copy.
 */
function CountUp({
  to,
  dec = 0,
  prefix = "",
  suffix = "",
  durationMs = 1300,
}: CountUpProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (el === null) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = reduced ? 1 : Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to, durationMs]);

  const display = reduced ? to : value;
  const text = dec
    ? display.toFixed(dec)
    : Math.round(display).toLocaleString("en-US");

  return (
    <span ref={ref} className="tss-value">
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

/**
 * Token stats strip — neon mood. Stats-as-hero: oversized display numbers
 * (holders / volume / market cap / supply) as social proof, count-up on view.
 * Self-scopes `data-theme="neon"` for standalone copy.
 */
export function TokenStatsStrip() {
  return (
    <section data-theme="neon" className="tss-root">
      <div className="tss-inner">
        <p className="tss-eyebrow">By the numbers</p>
        <div className="tss-grid">
          {STATS.map((stat) => (
            <div key={stat.label} className="tss-cell">
              <CountUp {...stat} />
              <span className="tss-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TokenStatsStrip;
