"use client";

import { type ReactNode } from "react";
import { useInView } from "../lib/use-in-view";

interface RevealProps {
  children: ReactNode;
  /** Extra classes applied to the same element (e.g. `perk`, `stat`). */
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
  /**
   * `prefers-reduced-motion` — passed down from the template (single source).
   * When true the child renders shown from first paint, so no transition runs.
   */
  reduced?: boolean;
}

/**
 * Reveal-on-scroll wrapper. Renders a single `div` so it can stand in for
 * grid/stack items directly (the reveal classes ride on the item element
 * itself). Under reduced motion it mounts already in the `in` state — the
 * element never transitions because there is no state change to animate.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  reduced = false,
}: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const shown = reduced || inView;

  return (
    <div
      ref={ref}
      className={`reveal ${className} ${shown ? "in" : ""}`.trim()}
      style={reduced ? undefined : { transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
