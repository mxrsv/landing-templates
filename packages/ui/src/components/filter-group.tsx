import type { ReactNode } from "react";

import { Eyebrow } from "./text";

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
      <Eyebrow as="legend" marker={false} className="mb-[var(--space-2)]">
        {title}
      </Eyebrow>
      {children}
    </fieldset>
  );
}
