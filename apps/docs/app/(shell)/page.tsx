import { Badge } from "@landing/ui/components/badge";
import { Tooltip } from "@landing/ui/components/tooltip";
import Link from "next/link";

import { DetailPreview } from "../../components/catalog/detail-preview";
import { GalleryGrid } from "../../components/catalog/gallery-grid";
import { allPieces } from "../../lib/catalog";

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/**
 * Catalog Explorer — master–detail ở `/`. Right pane 2 trạng thái: chưa chọn =
 * lưới Templates; đã chọn `?piece=slug` = detail (chỉ preview, không source).
 * Repo chỉ trưng Templates nên gallery/sidebar bỏ qua layer UI/Sections. URL =
 * source of truth, resolve server-side. Sidebar nav ở `(shell)/layout.tsx`.
 */
export default async function Explorer(props: PageProps<"/">) {
  const sp = await props.searchParams;

  const pieceSlug = firstParam(sp.piece);
  const selected = pieceSlug
    ? allPieces.find((piece) => piece.slug === pieceSlug)
    : undefined;

  // Trạng thái detail — đã chọn Piece hợp lệ.
  if (selected !== undefined) {
    return (
      <main className="flex w-full flex-col gap-[var(--space-6)] py-[var(--space-8)]">
        <Link
          href="/"
          className="self-start text-[length:var(--text-eyebrow)] text-[var(--p-ink-3)] hover:text-[var(--p-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
        >
          ← Tất cả Templates
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
      </main>
    );
  }

  // Trạng thái gallery — chưa chọn Piece. Chỉ trưng Templates, lưới phẳng.
  const templates = allPieces.filter((piece) => piece.layer === "template");
  const hrefForPiece = (slug: string): string =>
    `/?piece=${encodeURIComponent(slug)}`;

  return (
    <main className="flex w-full flex-col gap-[var(--space-6)] py-[var(--space-8)]">
      <GalleryGrid
        pieces={templates}
        groupByLayer={false}
        hrefForPiece={hrefForPiece}
      />
    </main>
  );
}
