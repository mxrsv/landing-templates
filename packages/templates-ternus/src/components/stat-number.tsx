"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "../lib/use-in-view";
import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";

interface StatNumberProps {
  /** Final value to count up to. */
  to: number;
  /** Decimal places (0 → integer with thousands separators). */
  dec?: number;
  durationMs?: number;
}

/** Animated count-up that runs once when scrolled into view. */
export function StatNumber({
  to,
  dec = 0,
  durationMs = 1300,
}: StatNumberProps) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLSpanElement>(0.5);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      // Reduced motion jumps straight to the final value on the first frame.
      const p = reduced ? 1 : Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to, durationMs]);

  // Reduced motion: show the final value immediately, without waiting for the
  // count-up (which is gated on scrolling into view) — no animation to play.
  const display = reduced ? to : value;
  const text = dec
    ? display.toFixed(dec)
    : Math.round(display).toLocaleString("en-US");

  return <span ref={ref}>{text}</span>;
}
