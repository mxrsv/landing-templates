import { Badge } from "@landing/ui/components/badge";
import { Tooltip } from "@landing/ui/components/tooltip";
import Link from "next/link";

import { DetailPreview } from "../../components/catalog/detail-preview";
import { GalleryGrid } from "../../components/catalog/gallery-grid";
import { PieceSourcePanel } from "../../components/catalog/piece-source-panel";
import { FilterBar } from "../../components/shell/filter-bar";
import { allPieces, type PieceLayer } from "../../lib/catalog";
import {
  type CatalogFilter,
  collectFilterOptions,
  FILTER_AXES,
  filterPieces,
  parseCatalogFilter,
} from "../../lib/catalog/filter-params";

const LAYERS: readonly PieceLayer[] = ["ui", "section", "template"];

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function parseLayer(raw: string): PieceLayer | undefined {
  return LAYERS.includes(raw as PieceLayer) ? (raw as PieceLayer) : undefined;
}

/** Query giữ lại khi điều hướng (layer + 4 trục filter + q), chưa gồm `piece`. */
function buildCarryParams(
  layer: PieceLayer | undefined,
  filter: CatalogFilter,
): URLSearchParams {
  const params = new URLSearchParams();
  if (layer) params.set("layer", layer);
  for (const axis of FILTER_AXES) {
    if (filter[axis].length > 0) params.set(axis, filter[axis].join(","));
  }
  if (filter.q.length > 0) params.set("q", filter.q);
  return params;
}

/**
 * Unified Catalog Explorer — master–detail ở `/`. Right pane 2 trạng thái
 * (spec §3.2): chưa chọn = gallery poster + filter bar; đã chọn `?piece=` =
 * detail (preview rẽ nhánh Layer + source). URL = source of truth, resolve
 * server-side. Sidebar nav ở `(shell)/layout.tsx`.
 */
export default async function Explorer(props: PageProps<"/">) {
  const sp = await props.searchParams;
  const options = collectFilterOptions(allPieces);
  const filter = parseCatalogFilter(sp, options);
  const layer = parseLayer(firstParam(sp.layer));
  const carry = buildCarryParams(layer, filter);

  const pieceSlug = firstParam(sp.piece);
  const selected = pieceSlug
    ? allPieces.find((piece) => piece.slug === pieceSlug)
    : undefined;

  // Trạng thái detail — đã chọn Piece hợp lệ.
  if (selected !== undefined) {
    const backHref = carry.toString() ? `/?${carry.toString()}` : "/";
    return (
      <main className="flex w-full flex-col gap-[var(--space-6)] py-[var(--space-8)]">
        <Link
          href={backHref}
          className="self-start text-[length:var(--text-eyebrow)] text-[var(--p-ink-3)] hover:text-[var(--p-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
        >
          ← Tất cả Pieces
        </Link>

        <header>
          <h1 className="text-[length:var(--text-h2)] font-semibold tracking-tight text-[var(--p-ink)]">
            {selected.name}
          </h1>
          <div className="mt-[var(--space-3)] flex flex-wrap items-center gap-[var(--space-1)]">
            {selected.mood.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
            {[
              ...selected.useCase,
              ...selected.stackTags,
              ...selected.animationTags,
            ].map((tag) => (
              <Badge key={tag} variant="neutral">
                {tag}
              </Badge>
            ))}
            {selected.deps.length > 0 && (
              <Tooltip
                content={
                  <span className="font-mono">
                    pnpm add {selected.deps.join(" ")}
                  </span>
                }
              >
                <Badge
                  variant="outline"
                  tabIndex={0}
                  className="cursor-help focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
                >
                  {selected.deps.length} deps
                </Badge>
              </Tooltip>
            )}
          </div>
        </header>

        <DetailPreview key={selected.slug} piece={selected} />
        <PieceSourcePanel piece={selected} />
      </main>
    );
  }

  // Trạng thái gallery — chưa chọn Piece.
  const base = layer
    ? allPieces.filter((piece) => piece.layer === layer)
    : allPieces;
  const filtered = filterPieces(base, filter);
  const hrefForPiece = (slug: string): string => {
    const params = new URLSearchParams(carry);
    params.set("piece", slug);
    return `/?${params.toString()}`;
  };

  return (
    <main className="flex w-full flex-col gap-[var(--space-6)] py-[var(--space-8)]">
      <FilterBar options={options} resultCount={filtered.length} />
      <GalleryGrid
        pieces={filtered}
        groupByLayer={layer === undefined}
        hrefForPiece={hrefForPiece}
      />
    </main>
  );
}
