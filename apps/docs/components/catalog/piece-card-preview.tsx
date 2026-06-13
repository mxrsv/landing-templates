"use client";

import { useEffect, useRef, useState } from "react";

import type { PieceMood } from "../../lib/catalog";
import { cardPreviewComponents } from "./card-preview-components";

const MOOD_GRADIENT: Record<PieceMood, string> = {
  infra: "from-violet-900/80 to-zinc-950",
  neon: "from-fuchsia-900/80 to-zinc-950",
  game: "from-emerald-900/80 to-zinc-950",
  nft: "from-amber-900/80 to-zinc-950",
};

function CardPreviewPlaceholder({ mood }: { mood: PieceMood }) {
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

interface PieceCardPreviewProps {
  slug: string;
  mood: PieceMood;
}

/**
 * Index card preview — lazy-mount component khi card vào viewport.
 * Không dùng iframe (tránh load full detail page + WebGL × N).
 */
export function PieceCardPreview({ slug, mood }: PieceCardPreviewProps) {
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (node === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry?.isIntersecting ?? false);
      },
      { rootMargin: "120px", threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Preview = cardPreviewComponents[slug];

  return (
    <div
      ref={rootRef}
      className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--surface-1)]"
    >
      {visible && Preview !== undefined ? (
        // `inert`: preview chỉ để ngắm — gỡ <a>/control bên trong khỏi tab order
        // và a11y tree, đồng thời chúng không còn là <a> lồng trong card link.
        <div
          inert
          data-theme={mood}
          className="pointer-events-none h-[400%] w-[400%] origin-top-left scale-[0.25] overflow-hidden"
        >
          <Preview />
        </div>
      ) : (
        <CardPreviewPlaceholder mood={mood} />
      )}
    </div>
  );
}
