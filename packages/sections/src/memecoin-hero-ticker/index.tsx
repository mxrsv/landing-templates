import { Button } from "@landing/ui/components/button";
import { CoinMint } from "@landing/ui/coin-mint";
import { PriceTicker } from "@landing/ui/price-ticker";
import type { PriceTickerToken } from "@landing/ui/price-ticker";

import "./memecoin-hero-ticker.css";

/** Mock market data — no live feed (out of scope v1). */
const TICKER_TOKENS: PriceTickerToken[] = [
  { symbol: "MEME", price: 0.04231, change24h: 42.7 },
  { symbol: "MON", price: 12.34, change24h: 8.1 },
  { symbol: "ETH", price: 3245.67, change24h: -1.2 },
  { symbol: "SOL", price: 188.42, change24h: 3.4 },
  { symbol: "DEGEN", price: 0.0119, change24h: -6.8 },
];

/**
 * Memecoin hero + ticker section — neon mood. A refined dark L1-style shell
 * (Fuel/Monad layout language) carrying meme content: full-bleed price-ticker
 * strip on top, display headline, live slot price, and CTAs. Spacing/easing
 * scale mirrors Ternus via the shared token floor. Self-scopes
 * `data-theme="neon"` so it themes correctly when copied standalone.
 */
export function MemecoinHeroTicker() {
  return (
    <section data-theme="neon" className="mht-root">
      <div className="mht-ticker">
        <PriceTicker mode="marquee" tokens={TICKER_TOKENS} />
      </div>

      <div className="mht-body">
        <div className="mht-copy">
          <span className="mht-eyebrow">
            <span className="mht-dot" aria-hidden />
            Live on Monad
          </span>

          <h1 className="mht-title">
            The coin that <em>actually</em>{" "}
            <span className="mht-nowrap">sends it</span>
          </h1>

          <p className="mht-sub">
            Fair launch, no presale, 100% community-owned. $MEME is the
            degen-grade memecoin with infra-grade polish.
          </p>

          <div className="mht-slot">
            <PriceTicker mode="slot" tokens={TICKER_TOKENS} />
          </div>

          <div className="mht-cta">
            <Button variant="solid">Buy $MEME</Button>
            <Button variant="ghost">Read the litepaper</Button>
          </div>
        </div>

        {/* Focal artifact — đồng $MEME minted, bleed off mép phải, neo cả hero */}
        <div className="mht-stage">
          <CoinMint className="mht-coin" />
        </div>
      </div>
    </section>
  );
}

export default MemecoinHeroTicker;
