"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  type CatalogFilter,
  type FilterAxis,
  type FilterOptions,
  parseCatalogFilter,
  serializeCatalogFilter,
  toggleFilterValue,
} from "../../lib/catalog/filter-params";

function searchParamsToRecord(params: URLSearchParams): Record<string, string> {
  return Object.fromEntries(params.entries());
}

/**
 * URL = source of truth cho filter state (story 9.2 hành vi): toggle ghi
 * searchParams mới qua `router.replace` (không scroll), server re-render
 * danh sách. Không có client filter state riêng.
 */
export function useCatalogFilterUrl(options: FilterOptions): {
  filter: CatalogFilter;
  toggle: (axis: FilterAxis, value: string) => void;
  clearAll: () => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filter = useMemo(
    () => parseCatalogFilter(searchParamsToRecord(searchParams), options),
    [searchParams, options],
  );

  const toggle = useCallback(
    (axis: FilterAxis, value: string) => {
      const next = toggleFilterValue(filter, axis, value);
      router.replace(`${pathname}${serializeCatalogFilter(next)}`, {
        scroll: false,
      });
    },
    [filter, pathname, router],
  );

  const clearAll = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { filter, toggle, clearAll };
}
