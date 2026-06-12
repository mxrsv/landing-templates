import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Keyboard hint rendered at the right edge (e.g. "⌘K"). */
  shortcutHint?: string;
}

/** Search/text input on the token layer; client-side filtering only (v1). */
export function Input({ shortcutHint, className, ...rest }: InputProps) {
  const wrapperClasses = [
    "flex items-center gap-[var(--space-2)] rounded-[var(--btn-radius)]",
    "bg-[var(--input-bg)] border border-[var(--input-border)] px-[var(--space-3)] py-[var(--space-2)]",
    "transition-[border-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
    "focus-within:border-[var(--border-emphasis)] focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-[var(--state-focus-ring)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={wrapperClasses}>
      <input
        className="flex-1 min-w-0 bg-transparent text-[length:var(--text-caption)] text-[var(--input-fg)] placeholder:text-[var(--input-placeholder)] outline-none"
        {...rest}
      />
      {shortcutHint && (
        <kbd className="text-[length:var(--text-eyebrow)] text-[var(--p-ink-3)] border border-[var(--border-default)] rounded-[var(--radius-sm)] px-[var(--space-1)] leading-relaxed">
          {shortcutHint}
        </kbd>
      )}
    </div>
  );
}
