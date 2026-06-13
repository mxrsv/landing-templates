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
 * + dynamic import) + tên + tags.
 *
 * Stretched-link: chỉ tên là <Link>, overlay `after:absolute inset-0` phủ cả
 * card → click đâu cũng vào detail. KHÔNG bọc cả card trong <Link> vì preview
 * lazy-mount component thật (có <a> riêng) → tránh `<a>` lồng `<a>`.
 * Accent budget: chỉ mood tag dùng Badge accent, còn lại neutral.
 */
export function PieceCard({ piece }: { piece: PieceMeta }) {
  const href = pieceDetailHref(piece);
  const mood = piece.mood[0] ?? "infra";

  return (
    <Card className="relative">
      <CardPreview className="border-b border-[var(--card-border)]">
        <PieceCardPreview slug={piece.slug} mood={mood} />
      </CardPreview>
      <CardBody>
        <h3 className="text-[length:var(--text-caption)] font-medium text-[var(--p-ink)]">
          <Link
            href={href}
            className="rounded-[var(--radius-sm)] after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
          >
            {piece.name}
          </Link>
        </h3>
        <div className="relative mt-[var(--space-2)] flex flex-wrap gap-[var(--space-1)]">
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
  );
}
