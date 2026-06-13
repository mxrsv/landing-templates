"use client";

import { useEffect } from "react";

import { ErrorBoundary } from "../lib/ErrorBoundary";
import { useReducedMotion } from "../lib/use-reduced-motion";
import { changeDirection, formatChange, formatPrice } from "./format";
import { RollingNumber } from "./rolling-number";
import type { PriceTickerProps, PriceTickerToken } from "./types";
import { useMarquee } from "./use-marquee";
import { useSlotPrice } from "./use-slot-price";
import "./price-ticker.css";

const DEFAULT_INTERVAL = 3000;

function Change({ change24h }: { change24h: number }) {
  return (
    <span className="pt-change" data-dir={changeDirection(change24h)}>
      {formatChange(change24h)}
    </span>
  );
}

function StaticRow({ token }: { token: PriceTickerToken }) {
  return (
    <span className="pt-item">
      <span className="pt-symbol">{token.symbol}</span>
      <span className="pt-price">${formatPrice(token.price)}</span>
      <Change change24h={token.change24h} />
    </span>
  );
}

function Marquee({
  tokens,
  animate,
}: {
  tokens: PriceTickerToken[];
  animate: boolean;
}) {
  const trackRef = useMarquee(animate);
  return (
    <div className="pt-marquee">
      <div className="pt-marquee-track" ref={trackRef}>
        {tokens.map((token, i) => (
          <StaticRow key={`a-${i}`} token={token} />
        ))}
        {/* Second copy enables the seamless RAF wrap; dropped when static. */}
        {animate
          ? tokens.map((token, i) => <StaticRow key={`b-${i}`} token={token} />)
          : null}
      </div>
    </div>
  );
}

function Slot({
  token,
  interval,
  animate,
}: {
  token: PriceTickerToken;
  interval: number;
  animate: boolean;
}) {
  const price = useSlotPrice(token.price, interval, animate);
  return (
    <span className="pt-item pt-slot">
      <span className="pt-symbol">{token.symbol}</span>
      <span className="pt-price">
        <RollingNumber value={price} animate={animate} />
      </span>
      <Change change24h={token.change24h} />
    </span>
  );
}

function Flash({ token }: { token: PriceTickerToken }) {
  // `flash` animation is week-2 (micro-spec): render static + dev-only warning.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        '[price-ticker] mode "flash" is not implemented (v1) — rendering static price.',
      );
    }
  }, []);
  return <StaticRow token={token} />;
}

/**
 * Price-ticker — `marquee` (scrolling row of all tokens) and `slot` (single
 * token with rolling digits) ship in v1; `flash` degrades to static. Honors
 * `prefers-reduced-motion` (no scroll/roll, static last price) and is wrapped
 * in the shared `ErrorBoundary` per INVARIANT. Colors resolve from the ambient
 * `data-theme` palette; up/down use semantic finance colors (see CSS).
 */
export function PriceTicker({
  mode,
  tokens,
  interval = DEFAULT_INTERVAL,
  className,
}: PriceTickerProps) {
  const reduced = useReducedMotion();
  const animate = !reduced;
  const first = tokens[0];

  if (first === undefined) return null;

  const classes = ["pt-root", `pt-mode-${mode}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <ErrorBoundary label="Price ticker unavailable">
      <div className={classes}>
        {mode === "marquee" && <Marquee tokens={tokens} animate={animate} />}
        {mode === "slot" && (
          <Slot token={first} interval={interval} animate={animate} />
        )}
        {mode === "flash" && <Flash token={first} />}
      </div>
    </ErrorBoundary>
  );
}
