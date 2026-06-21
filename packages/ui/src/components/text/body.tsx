import type { HTMLAttributes } from "react";

type BodySize = "default" | "lead";
type BodyTag = "p" | "span" | "div";

export interface BodyProps extends HTMLAttributes<HTMLParagraphElement> {
  /** `lead` is the larger intro paragraph; `default` is regular copy. */
  size?: BodySize;
  as?: BodyTag;
}

const SIZE_CLASS: Record<BodySize, string> = {
  default:
    "text-[length:var(--text-body)] leading-[var(--leading-normal)] text-[var(--p-ink-2)]",
  lead: "text-[length:var(--text-h3)] leading-[var(--leading-snug)] text-[var(--p-ink)]",
};

/** Body copy on the shared ladder — token-driven, tracking-normal. */
export function Body({ size = "default", as, className, ...rest }: BodyProps) {
  const Tag = as ?? "p";
  const classes = [
    SIZE_CLASS[size],
    "tracking-[var(--tracking-normal)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <Tag className={classes} {...rest} />;
}
