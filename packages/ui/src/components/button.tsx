import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "solid" | "ghost" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `solid` = primary action only (accent budget: max 1 per viewport). */
  variant?: ButtonVariant;
}

const BASE =
  "inline-flex items-center justify-center gap-[var(--space-2)] " +
  "rounded-[var(--btn-radius)] text-[length:var(--text-caption)] " +
  "transition-[background-color,border-color,color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)] " +
  "disabled:opacity-[var(--state-disabled-opacity)] disabled:pointer-events-none cursor-pointer";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  solid:
    "bg-[var(--btn-solid-bg)] text-[var(--btn-solid-fg)] font-medium " +
    "px-[var(--space-4)] py-[var(--space-2)] hover:opacity-90",
  ghost:
    "bg-[var(--btn-bg)] text-[var(--btn-fg)] border border-[var(--btn-border)] " +
    "px-[var(--space-4)] py-[var(--space-2)] hover:bg-[var(--state-hover-bg)] active:bg-[var(--state-active-bg)]",
  icon:
    "bg-transparent text-[var(--p-ink-2)] border border-[var(--btn-border)] " +
    "p-[var(--space-2)] hover:bg-[var(--state-hover-bg)] active:bg-[var(--state-active-bg)]",
};

/**
 * Shared button consuming component tokens only — it never knows which
 * `data-theme` it sits in. CSS transitions only (INVARIANT: no FM/GSAP here).
 */
export function Button({
  variant = "ghost",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = [BASE, VARIANT_CLASS[variant], className]
    .filter(Boolean)
    .join(" ");
  return <button type={type} className={classes} {...rest} />;
}
