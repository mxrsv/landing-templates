import type { HTMLAttributes } from "react";

type EyebrowTag = "span" | "p" | "h2" | "h3" | "div" | "legend";

export interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  /** Show the leading `/` accent marker (default true). */
  marker?: boolean;
  /** Override the semantic tag (default `span`). */
  as?: EyebrowTag;
}

/**
 * Slash micro-tag eyebrow — the ONE label treatment. Inter, sentence case (no
 * uppercase), calm `--tracking-label`, leading `/` in `--p-primary`. Replaces
 * every hand-rolled `text-[…] tracking-[…] uppercase` label (INVARIANT I-10).
 */
export function Eyebrow({
  marker = true,
  as,
  className,
  children,
  ...rest
}: EyebrowProps) {
  const Tag = as ?? "span";
  const classes = [
    "inline-flex items-center gap-[var(--space-2)]",
    "text-[length:var(--text-eyebrow)] font-medium",
    "tracking-[var(--tracking-label)] leading-[var(--leading-none)]",
    "text-[var(--p-ink-2)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={classes} {...rest}>
      {marker ? (
        <span aria-hidden className="font-semibold text-[var(--p-primary)]">
          /
        </span>
      ) : null}
      {children}
    </Tag>
  );
}
