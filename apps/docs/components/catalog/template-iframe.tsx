"use client";

import { Button } from "@landing/ui/components/button";
import Link from "next/link";
import { useState } from "react";

import { posterSrc } from "../../lib/catalog/posters";

type ViewportWidth = "full" | "1024" | "375";

const VIEWPORTS: ReadonlyArray<{ value: ViewportWidth; label: string }> = [
  { value: "full", label: "Full" },
  { value: "1024", label: "1024" },
  { value: "375", label: "375" },
];

const WIDTH_CLASS: Record<ViewportWidth, string> = {
  full: "w-full",
  "1024": "w-full max-w-[1024px]",
  "375": "w-full max-w-[375px]",
};

/**
 * Detail preview cho Layer `template` (ADR-0001): render qua `<iframe>` của
 * Fullscreen preview → viewport thật (fix `position:fixed` thoát khung + `100vh`
 * tràn) và browser tự teardown JS/rAF/WebGL của template cũ khi đổi `slug`
 * (tránh rò context, cap ~16 WebGL). Poster che lúc iframe nạp document →
 * không thấy latency. Width switcher map vào bề rộng iframe; iframe cuộn nội bộ.
 */
export function TemplateIframe({ slug }: { slug: string }) {
  const [width, setWidth] = useState<ViewportWidth>("full");
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col gap-[var(--space-3)]">
      <div className="flex items-center justify-between gap-[var(--space-3)]">
        <div
          role="group"
          aria-label="Bề rộng preview"
          className="flex items-center gap-[var(--space-1)]"
        >
          {VIEWPORTS.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              aria-pressed={width === option.value}
              onClick={() => setWidth(option.value)}
              className={
                width === option.value
                  ? "bg-[var(--state-active-bg)] text-[var(--p-ink)]"
                  : "border-transparent text-[var(--p-ink-3)]"
              }
            >
              {option.label}
            </Button>
          ))}
        </div>
        <Link
          href={`/preview/${slug}`}
          target="_blank"
          className="text-[length:var(--text-eyebrow)] text-[var(--p-ink-2)] underline-offset-2 hover:text-[var(--p-ink)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
        >
          Fullscreen ↗
        </Link>
      </div>
      <div className="flex justify-center overflow-hidden rounded-[var(--card-radius)] border border-[var(--border-default)] bg-[var(--surface-1)]">
        <div className={`relative ${WIDTH_CLASS[width]}`}>
          <iframe
            // `key={slug}`: đổi piece → React thay iframe → document cũ (WebGL)
            // bị browser teardown, không tích luỹ context.
            key={slug}
            src={`/preview/${slug}`}
            title={`${slug} preview`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className="h-[70vh] w-full border-0"
          />
          {/* Poster WebP pre-optimized — overlay tĩnh, không cần next/image (ADR-0001). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterSrc(slug)}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-[var(--duration-base)] ease-[var(--ease-standard)]"
            style={{ opacity: loaded ? 0 : 1 }}
          />
        </div>
      </div>
    </div>
  );
}
