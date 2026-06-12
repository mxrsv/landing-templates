/**
 * Preview loaders keyed by slug — build trực tiếp từ `piece-registrations.ts`,
 * KHÔNG import aggregator (`index.ts`) để client bundle không kéo theo
 * validation graph (manifest assert + assertPieceMeta).
 */
import type { ComponentType } from "react";

import { pieceRegistrations } from "./piece-registrations";

export const previewLoaders: Readonly<
  Record<string, () => Promise<{ default: ComponentType }>>
> = Object.fromEntries(
  pieceRegistrations.map((registration) => {
    return [registration.slug, registration.loadPreview];
  }),
);

/** Slugs có preview loader registered. */
export function hasPreview(slug: string): boolean {
  return slug in previewLoaders;
}
