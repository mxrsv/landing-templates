"use client";

import { Badge } from "@landing/ui/components/badge";

import {
  FILTER_AXES,
  type FilterOptions,
  hasActiveFilter,
} from "../../lib/catalog/filter-params";
import { useCatalogFilterUrl } from "./use-catalog-filter-url";

/**
 * Hàng chip filter đang active phía trên grid — click ✕ bỏ từng filter,
 * "Xoá hết" reset về URL sạch. Kèm số kết quả do server đếm.
 */
export function ActiveFilterChips({
  options,
  resultCount,
}: {
  options: FilterOptions;
  resultCount: number;
}) {
  const { filter, toggle, clearAll } = useCatalogFilterUrl(options);

  return (
    <div className="flex min-h-6 flex-wrap items-center gap-[var(--space-2)]">
      <span className="text-[length:var(--text-caption)] text-[var(--p-ink-2)]">
        {resultCount} pieces
      </span>
      {FILTER_AXES.flatMap((axis) =>
        filter[axis].map((value) => (
          <button
            key={`${axis}:${value}`}
            type="button"
            onClick={() => toggle(axis, value)}
            aria-label={`Bỏ filter ${value}`}
            className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)] rounded-[var(--radius-pill)]"
          >
            <Badge variant="accent">{value} ✕</Badge>
          </button>
        )),
      )}
      {hasActiveFilter(filter) && (
        <button
          type="button"
          onClick={clearAll}
          className="cursor-pointer text-[length:var(--text-eyebrow)] text-[var(--p-ink-3)] hover:text-[var(--p-ink)] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
        >
          Xoá hết
        </button>
      )}
    </div>
  );
}
