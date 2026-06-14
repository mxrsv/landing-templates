"use client";

import { useEffect, useRef, useState } from "react";

import { posterSrc } from "../../lib/catalog/posters";
import type { PieceMood } from "../../lib/catalog";
import { previewLoaders } from "../../lib/catalog/preview-loaders";
import { cardPreviewComponents } from "./card-preview-components";
import { claimLive, releaseLive } from "./live-registry";
import { useHoverIntent } from "./use-hover-intent";

const MOOD_GRADIENT: Record<PieceMood, string> = {
  infra: "from-violet-900/80 to-zinc-950",
  neon: "from-fuchsia-900/80 to-zinc-950",
  game: "from-emerald-900/80 to-zinc-950",
  nft: "from-amber-900/80 to-zinc-950",
};

/** Fallback khi poster chưa sinh (404) — gradient theo mood, không live. */
function PosterFallback({ mood }: { mood: PieceMood }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${MOOD_GRADIENT[mood]}`}
      aria-hidden
    >
      <span className="text-[length:var(--text-eyebrow)] tracking-[0.25em] text-[var(--p-ink-3)] uppercase">
        Preview
      </span>
    </div>
  );
}

interface PosterThumbProps {
  slug: string;
  mood: PieceMood;
}

/**
 * Thumbnail poster-first (ADR-0001): mặc định ảnh tĩnh `<img>`; hover-intent
 * mới mount live (qua live-registry → tối đa 1 live/lần) + prefetch chunk.
 * Bỏ qua live khi `prefers-reduced-motion`. Live render `inert` +
 * `pointer-events-none` (chỉ để ngắm, gỡ khỏi tab order / a11y tree).
 */
export function PosterThumb({ slug, mood }: PosterThumbProps) {
  const { active, bind } = useHoverIntent();
  const [live, setLive] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const allowMotion = useRef(true);

  useEffect(() => {
    allowMotion.current = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
  }, []);

  useEffect(() => {
    if (!active) {
      releaseLive(slug);
      setLive(false);
      return;
    }
    // Hover-intent kích hoạt: warm chunk trước (prefetch) để mount mượt.
    void previewLoaders[slug]?.();
    if (!allowMotion.current) return;
    claimLive(slug, () => setLive(false));
    setLive(true);
    return () => releaseLive(slug);
  }, [active, slug]);

  const Preview = cardPreviewComponents[slug];

  return (
    <div
      {...bind}
      className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--surface-1)]"
    >
      {posterFailed ? (
        <PosterFallback mood={mood} />
      ) : (
        // Poster là WebP đã pre-optimized @16:9 cố định — không qua next/image optimizer (ADR-0001).
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterSrc(slug)}
          alt=""
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
          onError={() => setPosterFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
      {live && Preview !== undefined && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            inert
            data-theme={mood}
            className="pointer-events-none h-[400%] w-[400%] origin-top-left scale-[0.25]"
          >
            <Preview />
          </div>
        </div>
      )}
    </div>
  );
}
