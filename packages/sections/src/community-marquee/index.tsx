"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";

import { SOCIAL_ICONS } from "./icons";
import "./community-marquee.css";

interface Community {
  platform: keyof typeof SOCIAL_ICONS;
  name: string;
  followers: string;
}

/** Mock community traction — no live feed (out of scope v1). */
const COMMUNITIES: Community[] = [
  { platform: "x", name: "X", followers: "128.4K" },
  { platform: "telegram", name: "Telegram", followers: "64.2K" },
  { platform: "discord", name: "Discord", followers: "41.9K" },
  { platform: "farcaster", name: "Farcaster", followers: "18.7K" },
  { platform: "reddit", name: "Reddit", followers: "33.1K" },
];

/**
 * RAF-driven marquee. The track holds the row twice (seamless wrap). Driving
 * transform frame-by-frame keeps motion free of any non-named CSS easing
 * (INVARIANT I-2). When `enabled` is false the track stays at offset 0.
 */
function useMarquee(enabled: boolean, speed = 40) {
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
        offset -= (speed * (now - last)) / 1000;
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

function CommunityPill({ item }: { item: Community }) {
  return (
    <span className="cm-pill">
      <span className="cm-icon">{SOCIAL_ICONS[item.platform]}</span>
      <span className="cm-name">{item.name}</span>
      <span className="cm-count">{item.followers}</span>
    </span>
  );
}

/**
 * Community marquee — neon mood. A scrolling strip of social platforms with
 * follower counts as community-traction proof. Reduced motion → a single static
 * centered row (no scroll). Self-scopes `data-theme="neon"`.
 */
export function CommunityMarquee() {
  const reduced = useReducedMotion();
  const animate = !reduced;
  const trackRef = useMarquee(animate);

  return (
    <section data-theme="neon" className="cm-root">
      <div className="cm-inner">
        <div className="cm-head">
          <p className="cm-eyebrow">Join the community</p>
          <p className="cm-headline">280K+ degens, five platforms</p>
        </div>

        {animate ? (
          <div className="cm-marquee">
            <div className="cm-track" ref={trackRef}>
              {COMMUNITIES.map((item) => (
                <CommunityPill key={`a-${item.platform}`} item={item} />
              ))}
              {COMMUNITIES.map((item) => (
                <CommunityPill key={`b-${item.platform}`} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="cm-static">
            {COMMUNITIES.map((item) => (
              <CommunityPill key={item.platform} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CommunityMarquee;
