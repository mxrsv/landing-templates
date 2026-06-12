"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import { previewLoaders } from "../../lib/catalog/preview-loaders";

function cardPreviewPlaceholder() {
  return function CardPreviewPlaceholder() {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-200 dark:bg-zinc-900">
        <span className="text-xs tracking-widest text-zinc-500 uppercase dark:text-zinc-600">
          Loading…
        </span>
      </div>
    );
  };
}

/** Pre-built dynamic() map — một loader per slug. */
export const cardPreviewComponents: Readonly<
  Record<string, ComponentType<object>>
> = Object.fromEntries(
  Object.entries(previewLoaders).map(([slug, loader]) => [
    slug,
    dynamic(loader, {
      ssr: false,
      loading: cardPreviewPlaceholder(),
    }),
  ]),
);
