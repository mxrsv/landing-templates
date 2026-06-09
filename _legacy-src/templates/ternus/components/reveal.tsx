"use client";

import { type ReactNode } from "react";
import { useInView } from "../lib/use-in-view";

interface RevealProps {
  children: ReactNode;
  /** Extra classes applied to the same element (e.g. `layer l2`, `pillar`). */
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
}

/**
 * Reveal-on-scroll wrapper. Renders a single `div` so it can stand in for
 * grid/stack items directly (the reveal classes ride on the item element
 * itself rather than an extra wrapper).
 */
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);

  return (
    <div
      ref={ref}
      className={`reveal ${className} ${inView ? "in" : ""}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
