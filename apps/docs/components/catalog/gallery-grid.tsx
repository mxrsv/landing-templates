import { EmptyState } from "@landing/ui/components/empty-state";
import { Eyebrow } from "@landing/ui/components/text";

import type { PieceLayer, PieceMeta } from "../../lib/catalog";
import { GalleryCard } from "./gallery-card";

const LAYER_ORDER: ReadonlyArray<{ layer: PieceLayer; label: string }> = [
  { layer: "ui", label: "UI" },
  { layer: "section", label: "Sections" },
  { layer: "template", label: "Templates" },
];

function CardGrid({
  pieces,
  hrefForPiece,
}: {
  pieces: readonly PieceMeta[];
  hrefForPiece: (slug: string) => string;
}) {
  return (
    <div className="grid gap-[var(--space-4)] sm:grid-cols-2 xl:grid-cols-3">
      {pieces.map((piece) => (
        <GalleryCard
          key={piece.slug}
          piece={piece}
          href={hrefForPiece(piece.slug)}
        />
      ))}
    </div>
  );
}

/**
 * Gallery state của right pane (chưa chọn Piece): lưới poster thumbnail. Nhóm
 * theo Layer khi `groupByLayer` (không lọc theo 1 layer cụ thể); ngược lại
 * phẳng. `hrefForPiece` do page dựng (giữ filter/layer hiện tại + set piece).
 */
export function GalleryGrid({
  pieces,
  groupByLayer,
  hrefForPiece,
}: {
  pieces: readonly PieceMeta[];
  groupByLayer: boolean;
  hrefForPiece: (slug: string) => string;
}) {
  if (pieces.length === 0) {
    return (
      <EmptyState
        message="Không có Piece phù hợp"
        hint="Thử bỏ bớt filter hoặc xoá từ khoá tìm kiếm."
      />
    );
  }

  if (!groupByLayer) {
    return <CardGrid pieces={pieces} hrefForPiece={hrefForPiece} />;
  }

  return (
    <div className="flex flex-col gap-[var(--space-8)]">
      {LAYER_ORDER.map(({ layer, label }) => {
        const group = pieces.filter((piece) => piece.layer === layer);
        if (group.length === 0) return null;
        return (
          <section key={layer} className="flex flex-col gap-[var(--space-3)]">
            <Eyebrow as="h2">{label}</Eyebrow>
            <CardGrid pieces={group} hrefForPiece={hrefForPiece} />
          </section>
        );
      })}
    </div>
  );
}
