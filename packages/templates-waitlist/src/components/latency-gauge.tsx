"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "../lib/use-in-view";
import { Reveal } from "./reveal";

export interface GaugeStat {
  value: string;
  label: string;
}

export interface LatencyGaugeContent {
  eyebrow: string;
  heading: string;
  /** Headline figure the semicircle arc fills to (0..100). */
  score: number;
  scoreUnit: string;
  scoreLabel: string;
  stats: GaugeStat[];
}

const DEFAULT_CONTENT: LatencyGaugeContent = {
  eyebrow: "Performance",
  heading: "Engineered for sub-second settlement",
  score: 99,
  scoreUnit: "%",
  scoreLabel: "of transactions finalize in a single block",
  stats: [
    { value: "0.8s", label: "Median time to finality" },
    { value: "4,200", label: "Transactions per second" },
    { value: "12ms", label: "P50 API response time" },
  ],
};

// Semicircle arc: from (16,100) over the top to (184,100). Its length is the
// dasharray base; the fill is revealed by shrinking the dashoffset toward 0.
const ARC_PATH = "M 16 100 A 84 84 0 0 1 184 100";
const ARC_LEN = Math.PI * 84;

interface LatencyGaugeProps {
  /** `prefers-reduced-motion`, from the template's single hook call. */
  reduced?: boolean;
  content?: LatencyGaugeContent;
}

/**
 * Latency gauge — a performance section anchored by an SVG semicircle dial that
 * sweeps up to its headline figure the first time it scrolls into view, with a
 * matching count-up in the centre. Under reduced-motion the arc and number show
 * at their final values from first paint (no sweep, no count-up).
 *
 * The dial is plain SVG (not the WebGL/Canvas2D carve-out), so every colour
 * resolves through the `--wl-*` tokens via CSS — no literal hex here.
 */
export function LatencyGauge({
  reduced = false,
  content = DEFAULT_CONTENT,
}: LatencyGaugeProps) {
  const [ref, inView] = useInView<HTMLElement>(0.4);
  const [progress, setProgress] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    let raf = 0;
    const start = performance.now();
    const durationMs = 1400;
    const step = (now: number) => {
      // Reduced motion settles on the first frame; the value below ignores it.
      const t = reduced ? 1 : Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced]);

  // Reduced motion bypasses the animated value entirely — no 0→target flash.
  const shown = reduced ? 1 : progress;
  const fraction = (content.score / 100) * shown;
  const dashoffset = ARC_LEN * (1 - fraction);
  const displayScore = Math.round(content.score * shown);

  return (
    <section ref={ref} className="gauge" aria-label="Performance">
      <div className="wrap">
        <Reveal reduced={reduced}>
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="gauge-h">{content.heading}</h2>
        </Reveal>

        <div className="gauge-grid">
          <figure className="gauge-dial">
            <svg className="gauge-svg" viewBox="0 0 200 116" aria-hidden="true">
              <path className="gauge-track" d={ARC_PATH} fill="none" />
              <path
                className="gauge-fill"
                d={ARC_PATH}
                fill="none"
                style={{
                  strokeDasharray: ARC_LEN,
                  strokeDashoffset: dashoffset,
                }}
              />
            </svg>
            <figcaption className="gauge-readout">
              <span className="gauge-num">
                {displayScore}
                <span className="gauge-unit">{content.scoreUnit}</span>
              </span>
              <span className="gauge-cap">{content.scoreLabel}</span>
            </figcaption>
          </figure>

          <div className="gauge-stats">
            {content.stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                reduced={reduced}
                className="gauge-stat"
                delay={i * 90}
              >
                <span className="gauge-stat-v">{stat.value}</span>
                <span className="gauge-stat-l">{stat.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
