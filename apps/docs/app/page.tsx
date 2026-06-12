import Link from "next/link";

import { allPieces, type PieceMeta } from "../lib/catalog";

const BROWSE_ENTRIES = [
  {
    href: "/ui",
    title: "UI",
    description: "Components đơn lẻ — copy 1 file là chạy.",
  },
  {
    href: "/sections",
    title: "Sections",
    description: "Khối section ghép trang — hero, pricing, footer…",
  },
  {
    href: "/templates",
    title: "Templates",
    description: "Landing page hoàn chỉnh theo từng mood.",
  },
] as const;

function FeaturedCard({ piece }: { piece: PieceMeta }) {
  return (
    <Link
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
  );
}

export default function Home() {
  const featured = allPieces.filter((piece) => piece.layer === "template");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-16">
        <section className="max-w-3xl">
          <p className="text-sm font-medium tracking-[0.3em] text-violet-600 uppercase dark:text-violet-300">
            Landing Templates
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Thư viện landing page, template và components
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Browse, xem live preview và copy source từng Piece.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
            Featured templates
          </h2>
          {featured.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              Chưa có template — đang chờ registration.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((piece) => (
                <FeaturedCard key={piece.slug} piece={piece} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
            Browse
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {BROWSE_ENTRIES.map((entry) => (
              <Link
                key={entry.href}
                href={entry.href}
                className="group rounded-lg border border-zinc-200 p-5 transition-colors hover:border-violet-400 dark:border-zinc-800 dark:hover:border-violet-500"
              >
                <h3 className="font-medium text-zinc-900 group-hover:text-violet-600 dark:text-zinc-50 dark:group-hover:text-violet-300">
                  {entry.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {entry.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
