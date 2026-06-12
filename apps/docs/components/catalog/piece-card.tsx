import { Badge } from "@landing/ui/components/badge";
import { Card, CardBody, CardPreview } from "@landing/ui/components/card";
import Link from "next/link";

import type { PieceMeta } from "../../lib/catalog";
import { PieceCardPreview } from "./piece-card-preview";

const DETAIL_PREFIX: Record<PieceMeta["layer"], string> = {
  ui: "/ui",
  section: "/sections",
  template: "/templates",
};

/** Đường dẫn detail page của một Piece theo layer. */
export function pieceDetailHref(piece: PieceMeta): string {
  return `${DETAIL_PREFIX[piece.layer]}/${piece.slug}`;
}

/**
 * Card index thống nhất cho mọi layer: lazy inline preview (IntersectionObserver
 * + dynamic import) + tên + tags. Click bất kỳ đâu → detail.
 * Accent budget: chỉ mood tag dùng Badge accent, còn lại neutral.
 */
export function PieceCard({ piece }: { piece: PieceMeta }) {
  const href = pieceDetailHref(piece);
  const mood = piece.mood[0] ?? "infra";

  return (
    <Link
      href={href}
      className="group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)] rounded-[var(--card-radius)]"
    >
      <Card>
        <CardPreview className="border-b border-[var(--card-border)]">
          <PieceCardPreview slug={piece.slug} mood={mood} />
        </CardPreview>
        <CardBody>
          <h3 className="text-[length:var(--text-caption)] font-medium text-[var(--p-ink)]">
            {piece.name}
          </h3>
          <div className="mt-[var(--space-2)] flex flex-wrap gap-[var(--space-1)]">
            {piece.mood.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
            {piece.stackTags.map((tag) => (
              <Badge key={tag} variant="neutral">
                {tag}
              </Badge>
            ))}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
