"use client";

import { useEffect, useRef } from "react";

/**
 * RAF-driven horizontal marquee. The track must contain the token row twice
 * (caller duplicates) so wrapping at half-width is seamless. We drive transform
 * frame-by-frame instead of a CSS `linear` keyframe so motion stays free of any
 * non-named easing (INVARIANT I-2) and speed is controllable.
 *
 * When `enabled` is false (reduced motion) the track sits at offset 0 — static.
 */
export function useMarquee(
  enabled: boolean,
  /** Scroll speed in px/s. */
  speed = 48,
): React.RefObject<HTMLDivElement | null> {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (track === null) return;

    if (!enabled) {
      track.style.transform = "translateX(0)";
      return;
    }

    let offset = 0;
    let last = 0;
    let frame = 0;

    const step = (now: number) => {
      if (last !== 0) {
        const dt = (now - last) / 1000;
        offset -= speed * dt;
        // Track holds two copies; wrap once the first copy is fully scrolled.
        const half = track.scrollWidth / 2;
        if (half > 0 && -offset >= half) offset += half;
        track.style.transform = `translateX(${offset}px)`;
      }
      last = now;
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [enabled, speed]);

  return trackRef;
}
