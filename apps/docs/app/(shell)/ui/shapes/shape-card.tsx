"use client";

import type { GlassShapeInfo } from "@landing/ui/glass-shape/shapes";
import dynamic from "next/dynamic";
import { useState } from "react";

import { GlassControls } from "./glass-controls";
import { DEFAULT_GLASS_PARAMS, type GlassParams } from "./glass-params";

/**
 * `GlassShape` dùng WebGL + three (browser-only) → dynamic ssr:false. Định
 * nghĩa ở module scope (client) để không re-import mỗi render.
 */
const GlassShape = dynamic(
  () =>
    import("@landing/ui/glass-shape").then((m) => ({ default: m.GlassShape })),
  {
    ssr: false,
    loading: function ShapeLoading() {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[var(--surface-0)]">
          <span className="text-[length:var(--text-caption)] text-[var(--p-ink-3)]">
            Loading…
          </span>
        </div>
      );
    },
  },
);

interface ShapeCardProps {
  shape: GlassShapeInfo;
}

/** Một card: canvas khối + caption + panel slider điều chỉnh material độc lập. */
export function ShapeCard({ shape }: ShapeCardProps) {
  const [params, setParams] = useState<GlassParams>(DEFAULT_GLASS_PARAMS);

  return (
    <figure className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-0)]">
      <div className="aspect-square w-full">
        <GlassShape
          shape={shape.variant}
          color={params.color}
          dispersion={params.dispersion}
          iridescence={params.iridescence}
          metalness={params.metalness}
          roughness={params.roughness}
          transmission={params.transmission}
          autoRotate
        />
      </div>
      <figcaption className="border-t border-[var(--border-default)] px-[var(--space-4)] py-[var(--space-3)]">
        <p className="text-[length:var(--text-caption)] font-medium text-[var(--p-ink)]">
          {shape.label}
        </p>
        <p className="mt-[var(--space-1)] text-[length:var(--text-caption)] text-[var(--p-ink-3)]">
          {shape.blurb}
        </p>
      </figcaption>
      <GlassControls
        params={params}
        onChange={setParams}
        onReset={() => setParams(DEFAULT_GLASS_PARAMS)}
      />
    </figure>
  );
}
