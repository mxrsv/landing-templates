"use client";

import { ErrorBoundary } from "@landing/ui/lib/error-boundary";
import { useEffect, useRef } from "react";
import { Reveal } from "./reveal";

export interface ReachStat {
  value: string;
  label: string;
}

export interface ReachGlobeContent {
  eyebrow: string;
  heading: string;
  body: string;
  stats: ReachStat[];
}

const DEFAULT_CONTENT: ReachGlobeContent = {
  eyebrow: "Global by default",
  heading: "One network, every timezone",
  body: "Validators and builders span the globe, so settlement stays fast and available no matter where you are — with no single point of failure.",
  stats: [
    { value: "42", label: "Countries with active nodes" },
    { value: "180+", label: "Cities reached" },
    { value: "24/7", label: "Always-on coverage" },
  ],
};

// Reach markers in [latitude°, longitude°] — a spread of hubs across the globe.
const MARKERS: ReadonlyArray<readonly [number, number]> = [
  [40.7, -74], // New York
  [51.5, -0.1], // London
  [1.35, 103.8], // Singapore
  [35.7, 139.7], // Tokyo
  [-33.9, 151.2], // Sydney
  [-23.5, -46.6], // São Paulo
  [52.5, 13.4], // Berlin
  [19.1, 72.9], // Mumbai
  [37.6, 55.0], // Tehran-ish (filler hub)
  [-26.2, 28.0], // Johannesburg
];

const DEG = Math.PI / 180;
const TILT = -0.36; // gentle axial tilt so the globe never looks flat-on

// Ion palette as literal hex — INVARIANT I-4 carve-out for the Canvas2D path
// (the GPU/canvas can't read CSS vars; pinned to the infra/Ion mood). Every
// colour *around* the canvas still resolves through `--wl-*` tokens in CSS.
const COLOR_GRID = "rgba(95, 214, 255, 0.3)";
const COLOR_SILHOUETTE = "rgba(95, 214, 255, 0.5)";
const COLOR_GLOW = "rgba(95, 214, 255, 0.22)";
const COLOR_MARKER = "#9ce8ff";

interface ReachGlobeProps {
  /** `prefers-reduced-motion`, from the template's single hook call. */
  reduced?: boolean;
  content?: ReachGlobeContent;
}

/** Static Ion blob — the fallback if Canvas2D is unavailable or the draw throws. */
function GlobeFallback() {
  return <div className="globe-canvas globe-fallback" aria-hidden="true" />;
}

/**
 * Reach globe — a Canvas2D wireframe sphere (parallels + meridians) that rotates
 * slowly with reach markers riding the front hemisphere. Under reduced-motion it
 * paints exactly one static frame (no rAF loop). The loop and the ResizeObserver
 * are both torn down on unmount, so nothing keeps drawing after the canvas goes.
 */
export function ReachGlobe({
  reduced = false,
  content = DEFAULT_CONTENT,
}: ReachGlobeProps) {
  return (
    <section className="globe" aria-label="Global reach">
      <div className="wrap">
        <div className="globe-grid">
          <Reveal reduced={reduced} className="globe-col">
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="globe-h">{content.heading}</h2>
            <p className="globe-body">{content.body}</p>
            <div className="globe-stats">
              {content.stats.map((stat) => (
                <div key={stat.label} className="globe-stat">
                  <span className="globe-stat-v">{stat.value}</span>
                  <span className="globe-stat-l">{stat.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="globe-stage">
            <ErrorBoundary fallback={<GlobeFallback />}>
              <GlobeCanvas reduced={reduced} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
}

function GlobeCanvas({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let theta = reduced ? 0.6 : 0; // a pleasant fixed angle when static
    let disposed = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const size = canvas.clientWidth || 360;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
    };

    // Orthographic projection of a (lat, lon) point on the unit sphere, rotated
    // by `theta` around the vertical axis then tilted around the view axis.
    const project = (latDeg: number, lonDeg: number) => {
      const lat = latDeg * DEG;
      const lon = lonDeg * DEG + theta;
      const x = Math.cos(lat) * Math.sin(lon);
      const y0 = Math.sin(lat);
      const z0 = Math.cos(lat) * Math.cos(lon);
      // tilt around X so poles lean toward the viewer
      const y = y0 * Math.cos(TILT) - z0 * Math.sin(TILT);
      const z = y0 * Math.sin(TILT) + z0 * Math.cos(TILT);
      return { x, y, z };
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.42;
      ctx.clearRect(0, 0, w, h);

      // soft inner glow + silhouette
      const glow = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
      glow.addColorStop(0, COLOR_GLOW);
      glow.addColorStop(1, "rgba(95, 214, 255, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = COLOR_SILHOUETTE;
      ctx.lineWidth = 1.4 * dpr;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // wireframe: parallels + meridians, only the front-facing (z >= 0) arcs
      ctx.strokeStyle = COLOR_GRID;
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();

      const drawPath = (
        pts: ReadonlyArray<{ sx: number; sy: number; z: number }>,
      ) => {
        let pen = false;
        for (const p of pts) {
          if (p.z >= 0) {
            if (pen) ctx.lineTo(p.sx, p.sy);
            else {
              ctx.moveTo(p.sx, p.sy);
              pen = true;
            }
          } else {
            pen = false;
          }
        }
      };

      for (let latDeg = -60; latDeg <= 60; latDeg += 30) {
        const pts = [];
        for (let lonDeg = 0; lonDeg <= 360; lonDeg += 6) {
          const p = project(latDeg, lonDeg);
          pts.push({ sx: cx + r * p.x, sy: cy - r * p.y, z: p.z });
        }
        drawPath(pts);
      }
      for (let lonDeg = 0; lonDeg < 360; lonDeg += 30) {
        const pts = [];
        for (let latDeg = -90; latDeg <= 90; latDeg += 6) {
          const p = project(latDeg, lonDeg);
          pts.push({ sx: cx + r * p.x, sy: cy - r * p.y, z: p.z });
        }
        drawPath(pts);
      }
      ctx.stroke();

      // reach markers — only on the visible hemisphere, sized by depth and lit
      // with a soft glow so the hubs read against the wireframe
      ctx.fillStyle = COLOR_MARKER;
      ctx.shadowColor = COLOR_MARKER;
      for (const [latDeg, lonDeg] of MARKERS) {
        const p = project(latDeg, lonDeg);
        if (p.z < 0.02) continue;
        const sx = cx + r * p.x;
        const sy = cy - r * p.y;
        const rad = (2 + p.z * 2.4) * dpr;
        ctx.globalAlpha = 0.45 + p.z * 0.55;
        ctx.shadowBlur = 8 * dpr;
        ctx.beginPath();
        ctx.arc(sx, sy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(); // static path must repaint after a size change
    });
    ro.observe(canvas);

    if (reduced) {
      draw();
    } else {
      const loop = () => {
        if (disposed) return;
        theta += 0.0025;
        draw();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="globe-canvas" aria-hidden="true" />;
}
