/**
 * Next.js transpilePackages — derived từ `piece-registrations.ts`.
 * Import file này trong `next.config.ts` (không import Preview/components).
 */
import { pieceRegistrations } from "./piece-registrations";

/** Packages luôn cần transpile dù chưa có piece registered. */
const BASE_TRANSPILE_PACKAGES = [
  "@landing/ui",
  "@landing/design-tokens",
  "@landing/sections",
] as const;

export const catalogTranspilePackages: string[] = [
  ...BASE_TRANSPILE_PACKAGES,
  ...new Set(pieceRegistrations.map((r) => r.packageName)),
];
