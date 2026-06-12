import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

/**
 * Surface card for piece previews and shell panels. Hover lifts the border to
 * `--card-border-hover` (I-7/I-8 compliant — all colors from the token layer).
 */
export function Card({ className, ...rest }: CardProps) {
  const classes = [
    "bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-radius)] overflow-hidden",
    "transition-[border-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
    "hover:border-[var(--card-border-hover)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <div className={classes} {...rest} />;
}

/** Slot for the live preview area — full-bleed inside the card. */
export function CardPreview({ className, ...rest }: CardProps) {
  const classes = ["overflow-hidden", className].filter(Boolean).join(" ");
  return <div className={classes} {...rest} />;
}

/** Meta footer (name + tags) under the preview. */
export function CardBody({ className, ...rest }: CardProps) {
  const classes = ["px-[var(--space-3)] py-[var(--space-2)]", className]
    .filter(Boolean)
    .join(" ");
  return <div className={classes} {...rest} />;
}
