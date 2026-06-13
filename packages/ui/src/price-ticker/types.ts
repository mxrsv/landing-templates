/**
 * Price-ticker public types — bám UX micro-spec
 * (`_bmad-output/planning-artifacts/ux-price-ticker-micro-spec.md`).
 */

export type PriceTickerMode = "marquee" | "slot" | "flash";

export interface PriceTickerToken {
  /** Ticker symbol, uppercase compact — e.g. "MON", "ETH". */
  symbol: string;
  /** Spot price in USD — e.g. 12.34. */
  price: number;
  /** 24h change in percent — e.g. -2.5 or 8.1. */
  change24h: number;
}

export interface PriceTickerProps {
  mode: PriceTickerMode;
  /** Min 1. `marquee` uses all; `slot`/`flash` show `tokens[0]`. */
  tokens: PriceTickerToken[];
  /** ms between simulated price updates in `slot` mode (default 3000). */
  interval?: number;
  className?: string;
}
