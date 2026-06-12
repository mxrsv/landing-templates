import Link from "next/link";

import { allPieces, type PieceMeta, type PieceMood } from "../../lib/catalog";

export const metadata = {
  title: "Templates — Landing Templates",
};

/** Group templates theo mood chính (mood[0]) — pre-filter UX cho visitor. */
function groupByMood(
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

export default function TemplatesIndexPage() {
  const templates = allPieces.filter((piece) => piece.layer === "template");
  const groups = groupByMood(templates);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16">
        <section>
          <p className="text-sm font-medium tracking-[0.3em] text-violet-600 uppercase dark:text-violet-300">
            Templates
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Landing templates theo mood
          </h1>
        </section>

        {groups.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Chưa có Piece — đang chờ registration.
          </p>
        ) : (
          groups.map(([mood, pieces]) => (
            <section key={mood}>
              <h2 className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
                {mood}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pieces.map((piece) => (
                  <Link
                    key={piece.slug}
                    href={`/templates/${piece.slug}`}
                    className="group rounded-lg border border-zinc-200 p-5 transition-colors hover:border-violet-400 dark:border-zinc-800 dark:hover:border-violet-500"
                  >
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
                  </Link>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
