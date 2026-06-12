import { Badge } from "@landing/ui/components/badge";
import { EmptyState } from "@landing/ui/components/empty-state";
import Link from "next/link";

import { PieceCard } from "../../components/catalog/piece-card";
import { HomeSearch } from "../../components/shell/home-search";
import { allPieces, type PieceMood } from "../../lib/catalog";

const MOOD_ENTRIES: ReadonlyArray<{ mood: PieceMood; description: string }> = [
  { mood: "infra", description: "Dev-tool, dashboard, độ tin cậy" },
  { mood: "neon", description: "Cyber, glow, năng lượng cao" },
  { mood: "game", description: "Playful, pixel, tương tác" },
  { mood: "nft", description: "Premium, gallery, sang trọng" },
];

function MoodEntryCard({
  mood,
  description,
  count,
}: {
  mood: PieceMood;
  description: string;
  count: number;
}) {
  return (
    <Link
      href={`/sections?mood=${mood}`}
      className="group flex flex-col gap-[var(--space-2)] rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] p-[var(--space-4)] transition-[border-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-[var(--card-border-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
    >
      <div className="flex items-center justify-between">
        <Badge variant="accent">{mood}</Badge>
        <span className="text-[length:var(--text-eyebrow)] text-[var(--p-ink-3)]">
          {count} pieces
        </span>
      </div>
      <p className="text-[length:var(--text-caption)] text-[var(--p-ink-2)]">
        {description}
      </p>
    </Link>
  );
}

/** Home discovery-first: hero gọn + search ⌘K + mood entry + featured templates. */
export default function Home() {
  const featured = allPieces.filter((piece) => piece.layer === "template");
  const moodCounts = MOOD_ENTRIES.map((entry) => ({
    ...entry,
    count: allPieces.filter((piece) => piece.mood.includes(entry.mood)).length,
  }));

  return (
    <main className="mx-auto flex w-full max-w-[var(--container-max)] flex-col gap-[var(--section-pad-y-sm)] px-[var(--space-6)] py-[var(--section-pad-y-md)]">
      <section className="flex max-w-[var(--container-md)] flex-col gap-[var(--space-4)]">
        <h1 className="text-[length:var(--text-h1)] font-semibold tracking-tight text-[var(--p-ink)]">
          Landing sections you can actually copy
        </h1>
        <p className="text-[length:var(--text-body)] text-[var(--p-ink-2)]">
          Browse theo mood, xem live preview, copy source từng Piece — không cần
          cài thêm gì ngoài deps trong header.
        </p>
        <HomeSearch />
      </section>

      {allPieces.length === 0 ? (
        <EmptyState
          message="Catalog đang trống"
          hint="Đang chờ registration trong lib/catalog/piece-registrations.ts."
        />
      ) : (
        <>
          <section className="flex flex-col gap-[var(--space-4)]">
            <h2 className="text-[length:var(--text-eyebrow)] font-medium tracking-[0.2em] text-[var(--p-ink-3)] uppercase">
              Browse theo mood
            </h2>
            <div className="grid gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-4">
              {moodCounts.map((entry) => (
                <MoodEntryCard key={entry.mood} {...entry} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-[var(--space-4)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[length:var(--text-eyebrow)] font-medium tracking-[0.2em] text-[var(--p-ink-3)] uppercase">
                Featured templates
              </h2>
              <Link
                href="/templates"
                className="text-[length:var(--text-eyebrow)] text-[var(--p-ink-2)] hover:text-[var(--p-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
              >
                Xem tất cả →
              </Link>
            </div>
            {featured.length === 0 ? (
              <EmptyState
                message="Chưa có template"
                hint="Đang chờ registration."
              />
            ) : (
              <div className="grid gap-[var(--space-4)] sm:grid-cols-2 xl:grid-cols-3">
                {featured.map((piece) => (
                  <PieceCard key={piece.slug} piece={piece} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
