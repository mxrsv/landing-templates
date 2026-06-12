import { notFound } from "next/navigation";

import { PieceLivePreview } from "../../../components/catalog/piece-live-preview";
import { allPieces } from "../../../lib/catalog";
import { hasPreview } from "../../../lib/catalog/preview-loaders";

export function generateStaticParams() {
  return allPieces
    .filter((piece) => hasPreview(piece.slug))
    .map((piece) => ({ slug: piece.slug }));
}

export async function generateMetadata(props: PageProps<"/preview/[slug]">) {
  const { slug } = await props.params;
  const piece = allPieces.find((p) => p.slug === slug);
  return { title: `${piece?.name ?? slug} — Preview` };
}

/** Fullscreen preview — không shell, data-theme theo mood[0] của Piece. */
export default async function PreviewPage(props: PageProps<"/preview/[slug]">) {
  const { slug } = await props.params;
  const piece = allPieces.find((p) => p.slug === slug);
  if (piece === undefined || !hasPreview(piece.slug)) notFound();

  return (
    <div data-theme={piece.mood[0]} className="min-h-screen">
      <PieceLivePreview slug={piece.slug} />
    </div>
  );
}
