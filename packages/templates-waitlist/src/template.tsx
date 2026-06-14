"use client";

import { Inter, JetBrains_Mono } from "next/font/google";
import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";
import "./waitlist.css";
import { Hero } from "./components/hero";
import { WaitlistFooter } from "./components/waitlist-footer";
import { WaitlistNav } from "./components/waitlist-nav";

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
 */
export function WaitlistTemplate() {
  const reduced = useReducedMotion();

  return (
    <div
      className={`wl ${inter.variable} ${jetbrainsMono.variable}`}
      data-theme="infra"
      id="top"
    >
      <WaitlistNav />
      <main>
        <Hero reduced={reduced} />
      </main>
      <WaitlistFooter />
    </div>
  );
}
