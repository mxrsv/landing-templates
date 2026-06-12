import { type RefObject, useEffect, useState } from "react";
import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";

const clamp = (v: number, a: number, b: number): number =>
  Math.max(a, Math.min(b, v));

/**
 * Track scroll progress (0..1) through a tall section whose sticky stage pins
 * inside it. Progress is `-rect.top / (rect.height - innerHeight)`, i.e. 0 when
 * the section top hits the viewport top and 1 when its bottom is reached.
 *
 * Updates are throttled to one per animation frame via a `scroll` listener.
 * Under `prefers-reduced-motion` it returns `1` (fully advanced) so a static
 * diagram renders complete rather than collapsing to an empty start state.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
): number {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let ticking = false;

    const measure = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      setProgress(total > 0 ? clamp(-rect.top / total, 0, 1) : 0);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, reduced]);

  return progress;
}
