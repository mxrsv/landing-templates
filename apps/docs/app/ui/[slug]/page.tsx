import { notFound } from "next/navigation";

import { PieceDetail } from "../../../components/catalog/piece-detail";
import { allPieces } from "../../../lib/catalog";

export function generateStaticParams() {
  return allPieces
    .filter((p) => p.layer === "ui")
    .map((p) => ({ slug: p.slug }));
}

export default async function UiDetailPage(props: PageProps<"/ui/[slug]">) {
  const { slug } = await props.params;
  const piece = allPieces.find((p) => p.layer === "ui" && p.slug === slug);
  if (piece === undefined) notFound();

  return <PieceDetail piece={piece} />;
}
