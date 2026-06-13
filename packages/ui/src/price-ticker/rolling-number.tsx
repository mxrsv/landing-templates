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
  return (
    <span className="pt-rolling" aria-label={`$${formatted}`}>
      <span className="pt-rolling-prefix" aria-hidden="true">
        $
      </span>
      {formatted.split("").map((char, index) =>
        /\d/.test(char) ? (
          <RollingDigit
            key={`d-${index}`}
            value={Number(char)}
            animate={animate}
          />
        ) : (
          <span key={`s-${index}`} className="pt-sep" aria-hidden="true">
            {char}
          </span>
        ),
      )}
    </span>
  );
}
