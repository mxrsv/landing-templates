/**
 * Multi-axis catalog filter ⇄ URL searchParams (Epic 10 — nuốt story 9.1/9.2).
 *
 * Pure functions, no React/Web API — unit-testable và dùng được cả server
 * (page nhận `searchParams`) lẫn client (sidebar đẩy URL mới).
 *
 * Convention: mỗi trục 1 param, nhiều giá trị nối bằng dấu phẩy
 * (`?mood=infra,neon&stack=gsap`). Trong 1 trục = OR, giữa các trục = AND.
 * Giá trị không tồn tại trong catalog bị DROP im lặng (URL rác không crash).
 */

import type { PieceMeta, PieceMood } from "./types";

export const FILTER_AXES = ["mood", "useCase", "stack", "animation"] as const;

export type FilterAxis = (typeof FILTER_AXES)[number];

export interface CatalogFilter {
  mood: string[];
  useCase: string[];
  stack: string[];
  animation: string[];
  /** Free-text match trên slug + name (case-insensitive). */
  q: string;
}

/** Shape của `await props.searchParams` trong Next App Router. */
export type SearchParamsRecord = Record<string, string | string[] | undefined>;

/** Option khả dụng cho 1 trục, kèm count tĩnh trong tập pieces đang xét. */
export interface FilterOption {
  value: string;
  count: number;
}

export type FilterOptions = Record<FilterAxis, FilterOption[]>;

const AXIS_PICKERS: Record<
  FilterAxis,
  (piece: PieceMeta) => readonly string[]
> = {
  mood: (piece) => piece.mood,
  useCase: (piece) => piece.useCase,
  stack: (piece) => piece.stackTags,
  animation: (piece) => piece.animationTags,
};

export const EMPTY_FILTER: CatalogFilter = {
  mood: [],
  useCase: [],
  stack: [],
  animation: [],
  q: "",
};

/** Gom option + count cho từng trục từ tập pieces (đã filter theo layer). */
export function collectFilterOptions(
  pieces: readonly PieceMeta[],
): FilterOptions {
  const result = {} as FilterOptions;
  for (const axis of FILTER_AXES) {
    const counts = new Map<string, number>();
    for (const piece of pieces) {
      for (const value of AXIS_PICKERS[axis](piece)) {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }
    result[axis] = [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }
  return result;
}

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/**
 * Parse searchParams → CatalogFilter. Giá trị không nằm trong `options`
 * (URL rác, mood không tồn tại) bị bỏ qua — error handling theo spec §7.
 */
export function parseCatalogFilter(
  searchParams: SearchParamsRecord,
  options: FilterOptions,
): CatalogFilter {
  const filter = { ...EMPTY_FILTER };
  for (const axis of FILTER_AXES) {
    const allowed = new Set(options[axis].map((option) => option.value));
    const raw = firstParam(searchParams[axis]);
    filter[axis] = raw
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0 && allowed.has(value));
  }
  filter.q = firstParam(searchParams.q).trim();
  return filter;
}

/** Serialize ngược về query string ("" nếu không có filter nào). */
export function serializeCatalogFilter(filter: CatalogFilter): string {
  const params = new URLSearchParams();
  for (const axis of FILTER_AXES) {
    if (filter[axis].length > 0) params.set(axis, filter[axis].join(","));
  }
  if (filter.q.length > 0) params.set("q", filter.q);
  const query = params.toString();
  return query.length > 0 ? `?${query}` : "";
}

/** Toggle 1 giá trị trong 1 trục — immutable. */
export function toggleFilterValue(
  filter: CatalogFilter,
  axis: FilterAxis,
  value: string,
): CatalogFilter {
  const current = filter[axis];
  const next = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
  return { ...filter, [axis]: next };
}

export function hasActiveFilter(filter: CatalogFilter): boolean {
  return (
    filter.q.length > 0 || FILTER_AXES.some((axis) => filter[axis].length > 0)
  );
}

/** AND giữa các trục, OR trong 1 trục, q match slug/name. */
export function filterPieces(
  pieces: readonly PieceMeta[],
  filter: CatalogFilter,
): PieceMeta[] {
  const query = filter.q.toLowerCase();
  return pieces.filter((piece) => {
    for (const axis of FILTER_AXES) {
      const wanted = filter[axis];
      if (wanted.length === 0) continue;
      const actual = AXIS_PICKERS[axis](piece);
      if (!wanted.some((value) => actual.includes(value))) return false;
    }
    if (query.length > 0) {
      const haystack = `${piece.slug} ${piece.name}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

/** Type guard cho mood — dùng khi cần narrow string → PieceMood. */
export function isPieceMood(value: string): value is PieceMood {
  return (
    value === "infra" || value === "neon" || value === "game" || value === "nft"
  );
}
