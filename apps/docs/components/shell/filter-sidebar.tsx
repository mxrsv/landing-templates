"use client";

import { Checkbox } from "@landing/ui/components/checkbox";
import { FilterGroup } from "@landing/ui/components/filter-group";

import {
  FILTER_AXES,
  type FilterAxis,
  type FilterOptions,
} from "../../lib/catalog/filter-params";
import { useCatalogFilterUrl } from "./use-catalog-filter-url";

const AXIS_LABELS: Record<FilterAxis, string> = {
  mood: "Mood",
  useCase: "Use case",
  stack: "Stack",
  animation: "Animation",
};

/**
 * Discovery sidebar — 4 trục filter, AND giữa trục / OR trong trục.
 * Chỉ render trục có option; toggle đẩy thẳng vào URL searchParams.
 */
export function FilterSidebar({ options }: { options: FilterOptions }) {
  const { filter, toggle } = useCatalogFilterUrl(options);

  return (
    <aside className="flex w-44 shrink-0 flex-col gap-[var(--space-6)]">
      {FILTER_AXES.map((axis) => {
        const axisOptions = options[axis];
        if (axisOptions.length === 0) return null;
        return (
          <FilterGroup key={axis} title={AXIS_LABELS[axis]}>
            {axisOptions.map((option) => (
              <Checkbox
                key={option.value}
                label={option.value}
                count={option.count}
                checked={filter[axis].includes(option.value)}
                onCheckedChange={() => toggle(axis, option.value)}
              />
            ))}
          </FilterGroup>
        );
      })}
    </aside>
  );
}
