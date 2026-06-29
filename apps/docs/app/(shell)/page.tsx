import { Badge } from "@landing/ui/components/badge";
import { Tooltip } from "@landing/ui/components/tooltip";
import Link from "next/link";

import { DetailPreview } from "../../components/catalog/detail-preview";
import { GalleryGrid } from "../../components/catalog/gallery-grid";
import { allPieces } from "../../lib/catalog";
import type { PieceLayer } from "../../lib/catalog";

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

const LAYERS: readonly PieceLayer[] = ["ui", "section", "template"];
const LAYER_LABEL: Record<PieceLayer, string> = {
  ui: "UI",
  section: "Sections",
  template: "Templates",
};

/**
 * Catalog Explorer — master–detail ở `/`. Right pane 2 trạng thái: chưa chọn =
 * lưới theo `?layer` (default Templates); đã chọn `?piece=slug` = detail (chỉ
 * preview, không source). Gallery/sidebar chỉ trưng piece `status="production"`
 * (skeleton draft/planned ẩn — Phase 2 B4). URL = source of truth, resolve
 * server-side. Sidebar nav ở `(shell)/layout.tsx`.
 */
export default async function Explorer(props: PageProps<"/">) {
  const sp = await props.searchParams;

  // `?layer` chọn lưới layer (spec §6 unified explorer); invalid → default template.
  const layerParam = firstParam(sp.layer);
  const activeLayer: PieceLayer = LAYERS.includes(layerParam as PieceLayer)
    ? (layerParam as PieceLayer)
    : "template";
  const layerHref = activeLayer === "template" ? "/" : `/?layer=${activeLayer}`;

  const pieceSlug = firstParam(sp.piece);
  const selected = pieceSlug
    ? allPieces.find((piece) => piece.slug === pieceSlug)
    : undefined;

  // Trạng thái detail — đã chọn Piece hợp lệ.
  if (selected !== undefined) {
    return (
      <main className="flex w-full flex-col gap-[var(--space-6)] py-[var(--space-8)]">
        <Link
          href={layerHref}
          className="self-start text-[length:var(--text-eyebrow)] text-[var(--p-ink-3)] hover:text-[var(--p-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
        >
          ← Tất cả {LAYER_LABEL[activeLayer]}
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

  // Trạng thái gallery — lọc theo layer hiện tại + chỉ production (B4), lưới phẳng.
  const visible = allPieces.filter(
    (piece) => piece.layer === activeLayer && piece.status === "production",
  );
  const hrefForPiece = (slug: string): string =>
    activeLayer === "template"
      ? `/?piece=${encodeURIComponent(slug)}`
      : `/?layer=${activeLayer}&piece=${encodeURIComponent(slug)}`;

  return (
    <main className="flex w-full flex-col gap-[var(--space-6)] py-[var(--space-8)]">
      <GalleryGrid
        pieces={visible}
        groupByLayer={false}
        hrefForPiece={hrefForPiece}
      />
    </main>
  );
}
