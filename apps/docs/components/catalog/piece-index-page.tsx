import {
  allPieces,
  type PieceLayer,
  type PieceMeta,
  type PieceMood,
} from "../../lib/catalog";
import { PieceCard } from "./piece-card";

interface PieceIndexPageProps {
  layer: PieceLayer;
  eyebrow: string;
  title: string;
  /** Group cards theo mood[0] (dùng cho /templates — pre-filter UX). */
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
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pieces.map((piece) => (
        <PieceCard key={piece.slug} piece={piece} />
      ))}
    </div>
  );
}

/** Index layout dùng chung cho /ui, /sections, /templates — một pattern duy nhất. */
export function PieceIndexPage({
  layer,
  eyebrow,
  title,
  groupByMood = false,
}: PieceIndexPageProps) {
  const pieces = allPieces.filter((piece) => piece.layer === layer);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16">
        <section>
          <p className="text-sm font-medium tracking-[0.3em] text-violet-600 uppercase dark:text-violet-300">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
        </section>

        {pieces.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Chưa có Piece — đang chờ registration.
          </p>
        ) : groupByMood ? (
          groupPiecesByMood(pieces).map(([mood, moodPieces]) => (
            <section key={mood}>
              <h2 className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
                {mood}
              </h2>
              <CardGrid pieces={moodPieces} />
            </section>
          ))
        ) : (
          <section>
            <CardGrid pieces={pieces} />
          </section>
        )}
      </main>
    </div>
  );
}
