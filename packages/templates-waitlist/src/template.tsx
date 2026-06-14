"use client";

import { Inter, JetBrains_Mono } from "next/font/google";
import { useRef } from "react";
import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";
import "./waitlist.css";
import { Backers } from "./components/backers";
import { ClosingCta } from "./components/closing-cta";
import { Faq } from "./components/faq";
import { FlowKnot } from "./components/flow-knot";
import { Hero } from "./components/hero";
import { LatencyGauge } from "./components/latency-gauge";
import { Perks } from "./components/perks";
import { ReachGlobe } from "./components/reach-globe";
import { Stats } from "./components/stats";
import { Transform } from "./components/transform";
import { Trust } from "./components/trust";
import { WaitlistFooter } from "./components/waitlist-footer";
import { WaitlistNav } from "./components/waitlist-nav";
import { useScrollProgress } from "./lib/use-scroll-progress";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--wl-font",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--wl-font-mono",
  display: "swap",
});

/**
 * Waitlist — a "launch a waitlist" landing template (brand demo Aenor, the
 * trust layer for on-chain finance). Infra mood with the Ion skin; client-only
 * email simple-confirm; the flow-knot 3D artifact lands behind the page in
 * Task 5.
 *
 * `useReducedMotion()` is called once here (the single source) and passed down
 * to motion-bearing sections, per the unit-isolation design (spec §10).
 * Scroll progress is also measured once on the root and drives the flow-knot
 * (locked decision: the knot tracks whole-page scroll).
 */
export function WaitlistTemplate() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(rootRef);

  return (
    <div
      ref={rootRef}
      className={`wl ${inter.variable} ${jetbrainsMono.variable}`}
      data-theme="infra"
      id="top"
    >
      <FlowKnot reduced={reduced} progress={progress} />
      <WaitlistNav />
      <main>
        <Hero reduced={reduced} />
        <Backers reduced={reduced} />
        <Transform reduced={reduced} />
        <Perks reduced={reduced} />
        <LatencyGauge reduced={reduced} />
        <ReachGlobe reduced={reduced} />
        <Stats reduced={reduced} />
        <Trust reduced={reduced} />
        <ClosingCta reduced={reduced} />
        <Faq reduced={reduced} />
      </main>
      <WaitlistFooter />
    </div>
  );
}
