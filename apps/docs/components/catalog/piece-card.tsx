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
 */
export function PieceCard({ piece }: { piece: PieceMeta }) {
  const href = pieceDetailHref(piece);
  const mood = piece.mood[0] ?? "infra";

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-lg border border-zinc-200 transition-colors hover:border-violet-400 dark:border-zinc-800 dark:hover:border-violet-500"
    >
      <div className="overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <PieceCardPreview slug={piece.slug} mood={mood} />
      </div>
      <div className="p-5">
        <h3 className="font-medium text-zinc-900 group-hover:text-violet-600 dark:text-zinc-50 dark:group-hover:text-violet-300">
          {piece.name}
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {[...piece.mood, ...piece.stackTags].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
