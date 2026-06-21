"use client";

import { ARTIFACT_SURFACES } from "@landing/ui/artifact-surface/surfaces";
import { Badge } from "@landing/ui/components/badge";
import dynamic from "next/dynamic";

/**
 * `ArtifactSurface` dùng WebGL + three (browser-only) → dynamic ssr:false, khớp
 * pattern `ShapesGallery`. Import data (`ARTIFACT_SURFACES`) từ path pure riêng
 * để không kéo three vào bundle eager.
 */
const ArtifactSurface = dynamic(
  () =>
    import("@landing/ui/artifact-surface").then((m) => ({
      default: m.ArtifactSurface,
    })),
  {
    ssr: false,
    loading: function SurfaceLoading() {
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

export function SurfacesGallery() {
  return (
    <div className="grid gap-[var(--space-4)] sm:grid-cols-2 xl:grid-cols-3">
      {ARTIFACT_SURFACES.map((surface) => (
        <figure
          key={surface.variant}
          className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-0)]"
        >
          <div className="aspect-square w-full">
            <ArtifactSurface surface={surface.variant} autoRotate />
          </div>
          <figcaption className="border-t border-[var(--border-default)] px-[var(--space-4)] py-[var(--space-3)]">
            <div className="flex items-center gap-[var(--space-2)]">
              <p className="text-[length:var(--text-caption)] font-medium text-[var(--p-ink)]">
                {surface.label}
              </p>
              {surface.chosen ? <Badge variant="outline">Đã chọn</Badge> : null}
            </div>
            <p className="mt-[var(--space-1)] text-[length:var(--text-caption)] text-[var(--p-ink-3)]">
              {surface.blurb}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
