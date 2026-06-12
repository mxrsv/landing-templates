import type { ReactNode } from "react";

export interface FilterGroupProps {
  /** Axis label, e.g. "Mood", "Stack". */
  title: string;
  children: ReactNode;
}

/**
 * One filter axis in the discovery sidebar. AND logic across groups is the
 * caller's concern — this is layout + label only.
 */
export function FilterGroup({ title, children }: FilterGroupProps) {
  return (
    <fieldset className="flex flex-col gap-[var(--space-2)]">
      <legend className="text-[length:var(--text-eyebrow)] uppercase tracking-[0.1em] text-[var(--p-ink-3)] mb-[var(--space-2)]">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
