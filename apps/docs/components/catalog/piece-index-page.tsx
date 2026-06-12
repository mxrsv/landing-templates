import { EmptyState } from "@landing/ui/components/empty-state";

import {
  allPieces,
  type PieceLayer,
  type PieceMeta,
  type PieceMood,
} from "../../lib/catalog";
import {
  collectFilterOptions,
  filterPieces,
  hasActiveFilter,
  parseCatalogFilter,
  type SearchParamsRecord,
} from "../../lib/catalog/filter-params";
import { ActiveFilterChips } from "../shell/active-filter-chips";
import { FilterSidebar } from "../shell/filter-sidebar";
import { PieceCard } from "./piece-card";

interface PieceIndexPageProps {
  layer: PieceLayer;
  eyebrow: string;
  title: string;
  /** `await props.searchParams` từ page — URL là source of truth cho filter. */
  searchParams: SearchParamsRecord;
  /** Group cards theo mood[0] khi KHÔNG có filter active (dùng cho /templates). */
  groupByMood?: boolean;
}

function groupPiecesByMood(
  pieces: readonly PieceMeta[],
): ReadonlyArray<[PieceMood, PieceMeta[]]> {
  const groups = new Map<PieceMood, PieceMeta[]>();
  for (const piece of pieces) {
    const mood = piece.mood[0];
    if (mood === undefined) continue;
    groups.set(mood, [...(groups.get(mood) ?? []), piece]);
  }
  return [...groups.entries()];
}

function CardGrid({ pieces }: { pieces: readonly PieceMeta[] }) {
  return (
    <div className="grid gap-[var(--space-4)] sm:grid-cols-2 xl:grid-cols-3">
      {pieces.map((piece) => (
        <PieceCard key={piece.slug} piece={piece} />
      ))}
    </div>
  );
}

/**
 * Index layout discovery-first dùng chung cho /ui, /sections, /templates:
 * sidebar filter 4 trục + chips active + grid. Filter resolve hoàn toàn
 * trên server từ searchParams (story 9.1/9.2 absorbed vào Epic 10).
 */
export function PieceIndexPage({
  layer,
  eyebrow,
  title,
  searchParams,
  groupByMood = false,
}: PieceIndexPageProps) {
  const layerPieces = allPieces.filter((piece) => piece.layer === layer);
  const options = collectFilterOptions(layerPieces);
  const filter = parseCatalogFilter(searchParams, options);
  const filtered = filterPieces(layerPieces, filter);
  const filtering = hasActiveFilter(filter);

  return (
    <main className="mx-auto w-full max-w-[var(--container-max)] px-[var(--space-6)] py-[var(--space-10)]">
      <header>
        <p className="text-[length:var(--text-eyebrow)] font-medium tracking-[0.3em] text-[var(--p-ink-3)] uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-[var(--space-2)] text-[length:var(--text-h2)] font-semibold tracking-tight text-[var(--p-ink)]">
          {title}
        </h1>
      </header>

      {layerPieces.length === 0 ? (
        <div className="mt-[var(--space-8)]">
          <EmptyState
            message="Chưa có Piece nào ở layer này"
            hint="Đang chờ registration trong lib/catalog/piece-registrations.ts."
          />
        </div>
      ) : (
        <div className="mt-[var(--space-8)] flex flex-col gap-[var(--space-8)] lg:flex-row">
          <FilterSidebar options={options} />
          <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-4)]">
            <ActiveFilterChips
              options={options}
              resultCount={filtered.length}
            />
            {filtered.length === 0 ? (
              <EmptyState
                message="Không có Piece phù hợp"
                hint="Thử bỏ bớt filter hoặc xoá từ khoá tìm kiếm."
              />
            ) : groupByMood && !filtering ? (
              groupPiecesByMood(filtered).map(([mood, moodPieces]) => (
                <section
                  key={mood}
                  className="flex flex-col gap-[var(--space-3)]"
                >
                  <h2 className="text-[length:var(--text-eyebrow)] font-medium tracking-[0.2em] text-[var(--p-ink-3)] uppercase">
                    {mood}
                  </h2>
                  <CardGrid pieces={moodPieces} />
                </section>
              ))
            ) : (
              <CardGrid pieces={filtered} />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
