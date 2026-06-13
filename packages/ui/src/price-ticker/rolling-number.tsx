"use client";

import { formatPrice } from "./format";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

interface RollingDigitProps {
  value: number;
  animate: boolean;
}

/**
 * One slot column 0–9. Transform is animated by a CSS transition on `transform`
 * with a named easing token (I-2) — only when `animate` is true. Reduced motion
 * → no transition, the digit snaps into place.
 */
function RollingDigit({ value, animate }: RollingDigitProps) {
  return (
    <span className="pt-digit" aria-hidden="true">
      <span
        className="pt-digit-col"
        data-animate={animate ? "" : undefined}
        style={{ transform: `translateY(${-value * 10}%)` }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="pt-digit-cell">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

interface RollingNumberProps {
  value: number;
  animate: boolean;
}

/**
 * Render a formatted USD price where each numeric glyph is a rolling slot digit
 * and separators (`,` `.`) stay static. The whole value is exposed to assistive
 * tech via `aria-label`; the rolling cells are decorative (`aria-hidden`).
 */
export function RollingNumber({ value, animate }: RollingNumberProps) {
  const formatted = formatPrice(value);
  const chars = formatted.split("");
  // Key by place-value from the RIGHT, not string index. Decimals are fixed at 2,
  // so the rightmost cells keep a stable identity when the integer part grows/shrinks
  // (crossing the 1000 boundary). Keying from the left would re-bind a cell to a
  // different glyph on length change → a one-frame wrong-direction roll.
  const lastIndex = chars.length - 1;
  return (
    <span className="pt-rolling" aria-label={`$${formatted}`}>
      <span className="pt-rolling-prefix" aria-hidden="true">
        $
      </span>
      {chars.map((char, index) => {
        const place = lastIndex - index;
        return /\d/.test(char) ? (
          <RollingDigit
            key={`d-${place}`}
            value={Number(char)}
            animate={animate}
          />
        ) : (
          <span key={`s-${place}`} className="pt-sep" aria-hidden="true">
            {char}
          </span>
        );
      })}
    </span>
  );
}
