import type { HTMLAttributes } from "react";

type HeadingLevel = 1 | 2 | 3;
type HeadingTag = "h1" | "h2" | "h3" | "p";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Visual rung on the type ladder (1 = display, 2 = section, 3 = subhead). */
  level: HeadingLevel;
  /** Override the semantic tag (defaults to `h{level}`). */
  as?: HeadingTag;
}

const LEVEL_CLASS: Record<HeadingLevel, string> = {
  1: "text-[length:var(--text-display)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)]",
  2: "text-[length:var(--text-h2)] leading-[var(--leading-tight)] tracking-[var(--tracking-tight)]",
  3: "text-[length:var(--text-h3)] leading-[var(--leading-snug)] tracking-[var(--tracking-normal)]",
};

/** Heading on the shared type ladder — one font, token-driven size/leading/tracking. */
export function Heading({ level, as, className, ...rest }: HeadingProps) {
  const Tag = as ?? (`h${level}` as HeadingTag);
  const classes = [
    LEVEL_CLASS[level],
    "font-semibold text-[var(--p-ink)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <Tag className={classes} {...rest} />;
}
