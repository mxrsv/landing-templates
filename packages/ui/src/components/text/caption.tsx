import type { HTMLAttributes } from "react";

type CaptionTag = "p" | "span";

export interface CaptionProps extends HTMLAttributes<HTMLParagraphElement> {
  as?: CaptionTag;
}

/** Quiet meta/footnote/timestamp text — smallest readable rung. */
export function Caption({ as, className, ...rest }: CaptionProps) {
  const Tag = as ?? "p";
  const classes = [
    "text-[length:var(--text-caption)] leading-[var(--leading-snug)]",
    "tracking-[var(--tracking-normal)] text-[var(--p-ink-3)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <Tag className={classes} {...rest} />;
}
