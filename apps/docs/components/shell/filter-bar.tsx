"use client";

import {
  FILTER_AXES,
  type FilterAxis,
  type FilterOptions,
} from "../../lib/catalog/filter-params";
import { ActiveFilterChips } from "./active-filter-chips";
import { useCatalogFilterUrl } from "./use-catalog-filter-url";

const AXIS_LABELS: Record<FilterAxis, string> = {
  mood: "Mood",
  useCase: "Use case",
  stack: "Stack",
  animation: "Animation",
};

/**
 * Filter bar ngang trên cùng right pane (thay FilterSidebar dọc): 4 trục pill
 * toggle, AND giữa trục / OR trong trục. Toggle đẩy thẳng vào URL searchParams
 * (reuse `useCatalogFilterUrl`), chips + result count phía dưới.
 */
export function FilterBar({
  options,
  resultCount,
}: {
  options: FilterOptions;
  resultCount: number;
}) {
  const { filter, toggle } = useCatalogFilterUrl(options);

  return (
    <div className="flex flex-col gap-[var(--space-3)]">
      <div className="flex flex-wrap items-center gap-x-[var(--space-5)] gap-y-[var(--space-3)]">
        {FILTER_AXES.map((axis) => {
          const axisOptions = options[axis];
          if (axisOptions.length === 0) return null;
          return (
            <div key={axis} className="flex items-center gap-[var(--space-2)]">
              <span className="text-[length:var(--text-eyebrow)] font-medium tracking-[0.15em] text-[var(--p-ink-3)] uppercase">
                {AXIS_LABELS[axis]}
              </span>
              <div className="flex flex-wrap gap-[var(--space-1)]">
                {axisOptions.map((option) => {
                  const checked = filter[axis].includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={checked}
                      onClick={() => toggle(axis, option.value)}
                      className={`inline-flex items-center gap-[var(--space-1)] rounded-[var(--radius-pill)] border px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-eyebrow)] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)] ${
                        checked
                          ? "border-transparent bg-[var(--state-active-bg)] text-[var(--p-ink)]"
                          : "border-[var(--border-default)] text-[var(--p-ink-2)] hover:border-[var(--card-border-hover)] hover:text-[var(--p-ink)]"
                      }`}
                    >
                      {option.value}
                      <span className="text-[var(--p-ink-3)]">
                        {option.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <ActiveFilterChips options={options} resultCount={resultCount} />
    </div>
  );
}
