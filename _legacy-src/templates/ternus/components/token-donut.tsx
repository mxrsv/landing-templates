"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "../lib/use-in-view";
import { useReducedMotion } from "../lib/use-reduced-motion";

interface Segment {
  n: string;
  v: number;
  c: string;
}

// Cyan dark→light ramp with a single orange (Treasury) — the one warm accent.
const SEGMENTS: Segment[] = [
  { n: "Community & Airdrop", v: 40, c: "#7fe9ff" },
  { n: "Ecosystem", v: 25, c: "#38c6e6" },
  { n: "Team", v: 15, c: "#2a93b5" },
  { n: "Investors", v: 15, c: "#1f6f8c" },
  { n: "Treasury", v: 5, c: "#fb923c" },
];

export function TokenDonut() {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [legendIn, setLegendIn] = useState(false);
  const drawn = useRef(false);

  useEffect(() => {
    if (!inView || drawn.current) return;
    drawn.current = true;
    setLegendIn(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const drawDonut = (progress: number) => {
      ctx.clearRect(0, 0, w, h);
      const ox = w / 2;
      const oy = h / 2;
      const radius = Math.min(w, h) * 0.37;
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      const revealed = 2 * Math.PI * progress;
      const gap = 0.05;
      let ang = -Math.PI / 2;
      let cur = 0;
      for (const s of SEGMENTS) {
        const segA = (s.v / 100) * 2 * Math.PI;
        const drawA = Math.max(0, Math.min(segA, revealed - cur));
        if (drawA > 0.004) {
          ctx.beginPath();
          ctx.arc(ox, oy, radius, ang + gap / 2, ang + drawA - gap / 2);
          ctx.strokeStyle = s.c;
          ctx.stroke();
        }
        ang += segA;
        cur += segA;
      }
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.font = "400 30px Inter, system-ui, sans-serif";
      ctx.fillText("1B", ox, oy + 2);
      ctx.fillStyle = "rgba(255,255,255,0.42)";
      ctx.font = "400 11px Inter, system-ui, sans-serif";
      ctx.fillText("TERN supply", ox, oy + 22);
    };

    if (reduced) {
      drawDonut(1);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      drawDonut(eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced]);

  return (
    <div className="token-visual" ref={ref}>
      <canvas ref={canvasRef} className="donut" aria-hidden />
      <div className="legend">
        {SEGMENTS.map((s, i) => (
          <div
            key={s.n}
            className={`lrow ${legendIn ? "in" : ""}`.trim()}
            style={{ transitionDelay: `${280 + i * 120}ms` }}
          >
            <span className="lswatch" style={{ background: s.c }} />
            <span className="lname">{s.n}</span>
            <span className="lpct">{s.v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
