import { Badge } from "@landing/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@landing/ui/components/tabs";
import { Tooltip } from "@landing/ui/components/tooltip";
import Link from "next/link";

import type { PieceMeta } from "../../lib/catalog";
import { hasPreview } from "../../lib/catalog/preview-loaders";
import {
  assembleSingleFile,
  type PieceSourceFile,
  readPieceSources,
} from "../../lib/catalog/read-source";
import { CodeBlock } from "./code-block";
import { CopyButton } from "./copy-button";
import { PieceLivePreview } from "./piece-live-preview";
import { PreviewViewport } from "./preview-viewport";

const LAYER_INDEX: Record<PieceMeta["layer"], { href: string; label: string }> =
  {
    ui: { href: "/ui", label: "UI" },
    section: { href: "/sections", label: "Sections" },
    template: { href: "/templates", label: "Templates" },
  };

/** Payload copy cho mode multi: nối toàn bộ file kèm banner path. */
function assembleMultiPayload(files: readonly PieceSourceFile[]): string {
  return files
    .map((file) => `// ---- ${file.path} ----\n\n${file.content}`)
    .join("\n\n");
}

/**
 * Detail page mới (Epic 10): breadcrumb + header (badges, deps tooltip,
 * 1 nút Copy solid duy nhất) + Tabs Preview | Code. Copy mechanism giữ
 * nguyên Epic 4: RSC fs.readFile qua read-source.
 */
export async function PieceDetail({ piece }: { piece: PieceMeta }) {
  const layerIndex = LAYER_INDEX[piece.layer];
  const hasSources = (piece.sourcePaths?.length ?? 0) > 0;
  const sources = hasSources ? await readPieceSources(piece) : [];
  const single = piece.copyMode === "single";
  const copyPayload = single
    ? assembleSingleFile(piece, sources)
    : assembleMultiPayload(sources);

  return (
    <main className="mx-auto w-full max-w-[var(--container-max)] px-[var(--space-6)] py-[var(--space-8)]">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-[var(--space-2)] text-[length:var(--text-eyebrow)] text-[var(--p-ink-3)]"
      >
        <Link
          href={layerIndex.href}
          className="hover:text-[var(--p-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
        >
          {layerIndex.label}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-[var(--p-ink-2)]">{piece.name}</span>
      </nav>

      <header className="mt-[var(--space-4)] flex flex-wrap items-start justify-between gap-[var(--space-4)]">
        <div>
          <h1 className="text-[length:var(--text-h2)] font-semibold tracking-tight text-[var(--p-ink)]">
            {piece.name}
          </h1>
          <div className="mt-[var(--space-3)] flex flex-wrap items-center gap-[var(--space-1)]">
            {piece.mood.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
            {[...piece.useCase, ...piece.stackTags, ...piece.animationTags].map(
              (tag) => (
                <Badge key={tag} variant="neutral">
                  {tag}
                </Badge>
              ),
            )}
            {piece.deps.length > 0 && (
              <Tooltip
                content={
                  <span className="font-mono">
                    pnpm add {piece.deps.join(" ")}
                  </span>
                }
              >
                <Badge
                  variant="outline"
                  tabIndex={0}
                  className="cursor-help focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
                >
                  {piece.deps.length} deps
                </Badge>
              </Tooltip>
            )}
          </div>
        </div>
        {sources.length > 0 && (
          <CopyButton
            text={copyPayload}
            label={single ? "Copy source" : "Copy all files"}
            variant="solid"
          />
        )}
      </header>

      <div className="mt-[var(--space-6)]">
        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            {single
              ? sources.length > 0 && (
                  <TabsTrigger value="code">Code</TabsTrigger>
                )
              : sources.map((file) => (
                  <TabsTrigger key={file.path} value={file.path}>
                    {file.name}
                  </TabsTrigger>
                ))}
          </TabsList>

          <TabsContent value="preview" className="mt-[var(--space-4)]">
            {!hasPreview(piece.slug) ? (
              <p className="text-[length:var(--text-caption)] text-[var(--p-ink-3)]">
                Preview chưa đăng ký cho Piece này — thêm entry vào
                `lib/catalog/piece-registrations.ts`.
              </p>
            ) : (
              <PreviewViewport slug={piece.slug}>
                <div data-theme={piece.mood[0]}>
                  <PieceLivePreview slug={piece.slug} />
                </div>
              </PreviewViewport>
            )}
          </TabsContent>

          {single
            ? sources.length > 0 && (
                <TabsContent value="code" className="mt-[var(--space-4)]">
                  <CodeBlock content={copyPayload} copyLabel="Copy source" />
                </TabsContent>
              )
            : sources.map((file) => (
                <TabsContent
                  key={file.path}
                  value={file.path}
                  className="mt-[var(--space-4)]"
                >
                  <p className="mb-[var(--space-2)] truncate font-mono text-[length:var(--text-eyebrow)] text-[var(--p-ink-3)]">
                    {file.path}
                  </p>
                  <CodeBlock
                    content={file.content}
                    copyLabel={`Copy ${file.name}`}
                  />
                </TabsContent>
              ))}
        </Tabs>
      </div>
    </main>
  );
}
