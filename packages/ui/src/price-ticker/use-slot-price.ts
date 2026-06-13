"use client";

import { useEffect, useState } from "react";

/**
 * Simulate a live price for `slot` mode: every `interval` ms the price takes a
 * small random-walk step (±0.5%) so the rolling digits demo a real update. Mock
 * feed only — no WebSocket (out of scope v1, see micro-spec). When `enabled` is
 * false (reduced motion) the price is frozen at `basePrice`.
 */
export function useSlotPrice(
  basePrice: number,
  interval: number,
  enabled: boolean,
): number {
  const [price, setPrice] = useState(basePrice);

  // Re-seed when the source token price changes.
  useEffect(() => {
    setPrice(basePrice);
  }, [basePrice]);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => {
      setPrice((prev) => {
        const drift = (Math.random() - 0.5) * 0.01;
        return Math.round(prev * (1 + drift) * 100) / 100;
      });
    }, interval);
    return () => window.clearInterval(id);
  }, [enabled, interval]);

  return enabled ? price : basePrice;
}
