/**
 * Pure formatting helpers — no React, unit-testable.
 * Prices use tabular/mono digits; output kept ASCII so the rolling-number
 * splitter can treat every digit cell uniformly.
 */

/** Format a USD price with thousands separators + 2 decimals — e.g. `3,245.67`. */
export function formatPrice(price: number): string {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Signed percent for the 24h delta — e.g. `+8.10%`, `-1.20%`. */
export function formatChange(change24h: number): string {
  const sign = change24h > 0 ? "+" : change24h < 0 ? "−" : "";
  return `${sign}${Math.abs(change24h).toFixed(2)}%`;
}

/** Direction bucket driving the up/down semantic color. */
export type ChangeDirection = "up" | "down" | "flat";

export function changeDirection(change24h: number): ChangeDirection {
  if (change24h > 0) return "up";
  if (change24h < 0) return "down";
  return "flat";
}
