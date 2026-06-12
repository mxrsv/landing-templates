"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import { previewLoaders } from "../../lib/catalog/preview-loaders";

function previewLoadingFallback() {
  return function PreviewLoadingFallback() {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-zinc-100 dark:bg-zinc-900">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading preview…
        </span>
      </div>
    );
  };
}

const livePreviewComponents: Readonly<Record<string, ComponentType<object>>> =
  Object.fromEntries(
    Object.entries(previewLoaders).map(([slug, loader]) => [
      slug,
      dynamic(loader, { ssr: false, loading: previewLoadingFallback() }),
    ]),
  );

interface PieceLivePreviewProps {
  slug: string;
}

/** Full-size live preview — dynamic import, không iframe. */
export function PieceLivePreview({ slug }: PieceLivePreviewProps) {
  const Preview = livePreviewComponents[slug];
  if (Preview === undefined) return null;
  return <Preview />;
}
