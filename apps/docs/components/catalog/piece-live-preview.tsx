"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import { ErrorBoundary } from "../error-boundary";
import { previewLoaders } from "../../lib/catalog/preview-loaders";

function previewLoadingFallback() {
    return function PreviewLoadingFallback() {
        return (
            <div className="flex min-h-[40vh] items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Loading preview…</span>
            </div>
        );
    };
}

const livePreviewComponents: Readonly<Record<string, ComponentType<object>>> = Object.fromEntries(
    Object.entries(previewLoaders).map(([slug, loader]) => [
        slug,
        dynamic(loader, { ssr: false, loading: previewLoadingFallback() }),
    ]),
);

interface PieceLivePreviewProps {
    slug: string;
}

function previewFallback(error: Error, retry: () => void) {
    return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 bg-zinc-100 dark:bg-zinc-900">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Preview failed to load.</span>
            <button
                type="button"
                onClick={retry}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
                Retry
            </button>
        </div>
    );
}

/** Full-size live preview — dynamic import, không iframe. */
export function PieceLivePreview({ slug }: PieceLivePreviewProps) {
    const Preview = livePreviewComponents[slug];
    if (Preview === undefined) {
        console.warn(`[catalog] no live preview registered for slug "${slug}"`);
        return null;
    }
    return (
        <ErrorBoundary fallback={previewFallback}>
            <Preview />
        </ErrorBoundary>
    );
}
