import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@landing/ui/components/tabs";
import { Eyebrow } from "@landing/ui/components/text";

import type { PieceMeta } from "../../lib/catalog";
import {
  assembleSingleFile,
  type PieceSourceFile,
  readPieceSources,
} from "../../lib/catalog/read-source";
import { CodeBlock } from "./code-block";
import { CopyButton } from "./copy-button";

/** Payload copy cho mode multi: nối toàn bộ file kèm banner path. */
function assembleMultiPayload(files: readonly PieceSourceFile[]): string {
  return files
    .map((file) => `// ---- ${file.path} ----\n\n${file.content}`)
    .join("\n\n");
}

/**
 * Source/Copy của right pane khi đã chọn Piece (hấp thụ từ piece-detail.tsx).
 * RSC `fs.readFile` build-time qua read-source. Tab Preview KHÔNG ở đây —
 * preview do DetailPreview lo (preview luôn hiện trên, source dưới).
 */
export async function PieceSourcePanel({ piece }: { piece: PieceMeta }) {
  const hasSources = (piece.sourcePaths?.length ?? 0) > 0;
  const sources = hasSources ? await readPieceSources(piece) : [];
  if (sources.length === 0) return null;

  const single = piece.copyMode === "single";
  const copyPayload = single
    ? assembleSingleFile(piece, sources)
    : assembleMultiPayload(sources);

  return (
    <section className="flex flex-col gap-[var(--space-3)]">
      <div className="flex items-center justify-between gap-[var(--space-3)]">
        <Eyebrow as="h2">Source</Eyebrow>
        <CopyButton
          text={copyPayload}
          label={single ? "Copy source" : "Copy all files"}
          variant="solid"
        />
      </div>

      <Tabs defaultValue={single ? "code" : sources[0]?.path}>
        <TabsList>
          {single ? (
            <TabsTrigger value="code">Code</TabsTrigger>
          ) : (
            sources.map((file) => (
              <TabsTrigger key={file.path} value={file.path}>
                {file.name}
              </TabsTrigger>
            ))
          )}
        </TabsList>

        {single ? (
          <TabsContent value="code" className="mt-[var(--space-4)]">
            <CodeBlock content={copyPayload} copyLabel="Copy source" />
          </TabsContent>
        ) : (
          sources.map((file) => (
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
          ))
        )}
      </Tabs>
    </section>
  );
}
