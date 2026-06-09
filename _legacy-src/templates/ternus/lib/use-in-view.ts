import { type RefObject, useEffect, useRef, useState } from "react";

/**
 * Observe an element and flip to `true` the first time it enters the viewport.
 * Fires once, then disconnects — used for scroll-triggered reveals and
 * one-shot canvas animations.
 */
export function useInView<T extends HTMLElement>(
  threshold = 0.3,
): readonly [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}
