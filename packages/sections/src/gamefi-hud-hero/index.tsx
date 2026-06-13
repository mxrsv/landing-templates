"use client";

import type { CSSProperties } from "react";

import { Button } from "@landing/ui/components/button";
import { ErrorBoundary } from "@landing/ui/lib/error-boundary";
import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";

import "./gamefi-hud-hero.css";

interface HudStat {
  label: string;
  value: string;
  /** Fill ratio 0–100 — drives the bar width + grow animation. */
  fill: number;
}

/** Mock HUD telemetry — no live feed (out of scope v1). */
const STATS: HudStat[] = [
  { label: "Power", value: "92%", fill: 92 },
  { label: "Shield", value: "67%", fill: 67 },
  { label: "Season XP", value: "Lv 24", fill: 78 },
];

/**
 * GameFi HUD hero — game mood. Cyber/HUD aesthetic distinct from Infra (calm)
 * and Neon (degen): corner-bracket frame, grid mesh, sweeping scanline, and a
 * telemetry readout panel with energy bars. Motion (scanline, status blink, bar
 * grow) is gated by `useReducedMotion()` via the `.ghh-anim` class and wrapped
 * in the shared `ErrorBoundary`. Self-scopes `data-theme="game"` for standalone
 * copy.
 */
export function GamefiHudHero() {
  const reduced = useReducedMotion();
  const rootClass = ["ghh-root", reduced ? "" : "ghh-anim"]
    .filter(Boolean)
    .join(" ");

  return (
    <section data-theme="game" className={rootClass}>
      <ErrorBoundary label="GameFi hero unavailable">
        <div className="ghh-frame" aria-hidden>
          <span className="ghh-corner ghh-corner-tl" />
          <span className="ghh-corner ghh-corner-tr" />
          <span className="ghh-corner ghh-corner-bl" />
          <span className="ghh-corner ghh-corner-br" />
        </div>

        {!reduced && <div className="ghh-scanline" aria-hidden />}

        <div className="ghh-body">
          <div className="ghh-status">
            <span className="ghh-status-online">
              <span className="ghh-pulse" aria-hidden />
              System Online
            </span>
            <span>Latency 24ms // Region NA-West</span>
          </div>

          <div className="ghh-head">
            <span className="ghh-eyebrow">{"// Open Beta — Season 01"}</span>
            <h1 className="ghh-title">
              Enter the <em>Arena</em>
            </h1>
            <p className="ghh-sub">
              Squad up, climb the ladder, and earn on every match. A fully
              on-chain battle arena where your loadout is yours to keep, trade,
              and flex.
            </p>
          </div>

          <div className="ghh-readout">
            {STATS.map((stat) => (
              <div key={stat.label} className="ghh-stat">
                <span className="ghh-stat-label">
                  {stat.label}
                  <span className="ghh-stat-val">{stat.value}</span>
                </span>
                <span className="ghh-track">
                  <span
                    className="ghh-fill"
                    style={{ "--ghh-fill": `${stat.fill}%` } as CSSProperties}
                  />
                </span>
              </div>
            ))}
          </div>

          <div className="ghh-cta">
            <Button variant="solid">Play now</Button>
            <Button variant="ghost">Watch trailer</Button>
          </div>
        </div>
      </ErrorBoundary>
    </section>
  );
}

export default GamefiHudHero;
