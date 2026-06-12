import type { PieceMeta } from "../../lib/catalog";
import { hasPreview } from "../../lib/catalog/preview-loaders";
import {
  assembleSingleFile,
  readPieceSources,
} from "../../lib/catalog/read-source";
import { PieceLivePreview } from "./piece-live-preview";
import { SourceViewer } from "./source-viewer";

const TAG_GROUPS = [
  ["mood", (p: PieceMeta) => p.mood],
  ["use case", (p: PieceMeta) => p.useCase],
  ["stack", (p: PieceMeta) => p.stackTags],
  ["animation", (p: PieceMeta) => p.animationTags],
] as const;

/** Detail page dùng chung: metadata header + full preview trong data-theme wrapper. */
export async function PieceDetail({ piece }: { piece: PieceMeta }) {
  const hasSources = (piece.sourcePaths?.length ?? 0) > 0;
  const sources = hasSources ? await readPieceSources(piece) : [];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="mx-auto w-full max-w-6xl px-6 py-10">
        <p className="text-sm font-medium tracking-[0.3em] text-violet-600 uppercase dark:text-violet-300">
          {piece.layer}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {piece.name}
        </h1>
        <dl className="mt-5 flex flex-col gap-2">
          {TAG_GROUPS.map(([label, pick]) => {
            const tags = pick(piece);
            if (tags.length === 0) return null;
            return (
              <div key={label} className="flex flex-wrap items-center gap-2">
                <dt className="w-24 text-xs tracking-[0.15em] text-zinc-500 uppercase dark:text-zinc-400">
                  {label}
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            );
          })}
        </dl>
      </header>

      <div data-theme={piece.mood[0]}>
        {!hasPreview(piece.slug) ? (
          <p className="mx-auto w-full max-w-6xl px-6 pb-16 text-sm text-zinc-500 dark:text-zinc-400">
            Preview chưa đăng ký cho Piece này — thêm entry vào
            `lib/catalog/piece-registrations.ts`.
          </p>
        ) : (
          <PieceLivePreview slug={piece.slug} />
        )}
      </div>

      {sources.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6 py-12">
          <h2 className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
            Source
          </h2>
          <div className="mt-4">
            <SourceViewer
              mode={piece.copyMode}
              files={sources}
              {...(piece.copyMode === "single"
                ? { singlePayload: assembleSingleFile(piece, sources) }
                : {})}
            />
          </div>
        </section>
      )}
    </div>
  );
}
