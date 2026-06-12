import type { HTMLAttributes } from "react";

type BadgeVariant = "neutral" | "accent" | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** `accent` is reserved for mood tags (accent budget discipline). */
  variant?: BadgeVariant;
}

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  neutral: "bg-[var(--badge-bg)] text-[var(--badge-fg)]",
  accent: "bg-[var(--badge-accent-bg)] text-[var(--badge-accent-fg)]",
  outline:
    "bg-transparent text-[var(--badge-fg)] border border-[var(--border-default)]",
};

/** Tag pill for mood / stack / animation / layer metadata. */
export function Badge({ variant = "neutral", className, ...rest }: BadgeProps) {
  const classes = [
    "inline-flex items-center gap-[var(--space-1)] rounded-[var(--radius-pill)]",
    "px-[var(--space-2)] py-0.5 text-[length:var(--text-eyebrow)] leading-tight whitespace-nowrap",
    VARIANT_CLASS[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <span className={classes} {...rest} />;
}
