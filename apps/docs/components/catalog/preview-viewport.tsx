"use client";

import { Button } from "@landing/ui/components/button";
import Link from "next/link";
import { type ReactNode, useState } from "react";

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
 * Khung preview trên detail: switcher bề rộng viewport (client state thuần,
 * không vào URL) + link fullscreen `/preview/[slug]`. Children là live
 * preview đã wrap data-theme từ server.
 */
export function PreviewViewport({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const [viewport, setViewport] = useState<ViewportWidth>("full");

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
              aria-pressed={viewport === option.value}
              onClick={() => setViewport(option.value)}
              className={
                viewport === option.value
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
        <div className={`${WIDTH_CLASS[viewport]} overflow-hidden`}>
          {children}
        </div>
      </div>
    </div>
  );
}
