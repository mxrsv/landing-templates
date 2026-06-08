---
title: UX Micro-spec — Price-Ticker
status: approved
created: 2026-06-08
blocks: epics.md Story 5.1
parent: prd.md FR-7
---

# Price-Ticker — UX Micro-spec

Component path: `packages/ui/src/price-ticker/`

## Props API

```ts
export type PriceTickerMode = "marquee" | "slot" | "flash";

export type PriceTickerToken = {
    symbol: string; // e.g. "MON", "ETH"
    price: number; // USD, e.g. 12.34
    change24h: number; // percent, e.g. -2.5 or 8.1
};

export type PriceTickerProps = {
    mode: PriceTickerMode;
    tokens: PriceTickerToken[]; // min 1; marquee uses all; slot shows tokens[0]
    interval?: number; // ms between price updates (default 3000)
    className?: string;
};
```

## Modes (MVP)

| Mode      | Behavior                                                                                    | MVP                                                     |
| --------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `marquee` | Horizontal scroll loop of all `tokens`; each row shows symbol, price, 24h % with sign/color | ✅ ship                                                 |
| `slot`    | Single token (`tokens[0]`); digit roll animation when `price` changes on `interval` tick    | ✅ ship                                                 |
| `flash`   | Background flash red/green on delta                                                         | ❌ week 2 — render static price + `console.warn` in dev |

## Visual

- Typography: mono/tabular nums for price; symbol uppercase compact
- Colors: positive `change24h` → neon green accent; negative → red (via `theme-neon` CSS vars `--p-*`)
- Spacing: 4/8px grid; no `transition: all`
- Reduced motion: `useReducedMotion()` → static last price, no scroll/roll/flash

## Mock data (Story 5.1 AC)

```ts
const mockTokens: PriceTickerToken[] = [
    { symbol: "MON", price: 12.34, change24h: 8.1 },
    { symbol: "ETH", price: 3245.67, change24h: -1.2 },
];
```

## Dependencies

- Disclose via `pieceMeta.stackTags`: `["gsap"]` or `["framer-motion"]` — pick one in implementation, document in `config.ts`
- Import `@landing/design-tokens` / scope `data-theme="neon"` on wrapper when used in Memecoin context

## Out of scope (v1)

- Live WebSocket price feed
- `flash` mode animation
- Multi-currency fiat switch
