"use client";

import { useEffect, useState } from "react";

import type { PieceMeta } from "../../lib/catalog";
import { hasPreview } from "../../lib/catalog/preview-loaders";
import { posterSrc } from "../../lib/catalog/posters";
import { PieceLivePreview } from "./piece-live-preview";
import { PreviewViewport } from "./preview-viewport";
import { TemplateIframe } from "./template-iframe";

/** Poster-first overlay che inline live cho tới khi nó kịp mount (~300ms). */
const INLINE_READY_MS = 300;

/**
 * ui/section render inline: bọc trong container `transform`+`contain` để
 * `position:fixed`/`100vh` (nếu có) bị containing-block giữ trong khung, không
 * thoát ra shell. Poster phủ trước rồi nhường live.
 */
function InlinePreview({ piece }: { piece: PieceMeta }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), INLINE_READY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PreviewViewport slug={piece.slug}>
      <div className="relative">
        <div
          data-theme={piece.mood[0]}
          style={{ transform: "translateZ(0)", contain: "layout paint" }}
        >
          <PieceLivePreview slug={piece.slug} />
        </div>
        {/* Poster WebP pre-optimized — overlay tĩnh, không cần next/image (ADR-0001). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterSrc(piece.slug)}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-[var(--duration-base)] ease-[var(--ease-standard)]"
          style={{ opacity: ready ? 0 : 1 }}
        />
      </div>
    </PreviewViewport>
  );
}

/**
 * Detail preview rẽ nhánh theo Layer (ADR-0001): `template` → iframe Fullscreen
 * preview; `ui`/`section` → inline constrained. Cả hai poster-first, 1 live/lần
 * (detail chỉ 1 Piece được chọn nên invariant trivially giữ).
 *
 * `key={piece.slug}` ở call site đảm bảo state (loaded/ready) reset khi đổi Piece.
 */
export function DetailPreview({ piece }: { piece: PieceMeta }) {
  if (!hasPreview(piece.slug)) {
    return (
      <p className="text-[length:var(--text-caption)] text-[var(--p-ink-3)]">
        Preview chưa đăng ký cho Piece này — thêm entry vào
        `lib/catalog/piece-registrations.ts`.
      </p>
    );
  }

  if (piece.layer === "template") {
    return <TemplateIframe slug={piece.slug} />;
  }

  return <InlinePreview piece={piece} />;
}
