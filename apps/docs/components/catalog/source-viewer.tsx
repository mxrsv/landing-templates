"use client";

import { useRef, useState } from "react";

import type { PieceSourceFile } from "../../lib/catalog/read-source";
import { CopyButton } from "./copy-button";

interface SourceViewerProps {
  mode: "single" | "multi";
  files: readonly PieceSourceFile[];
  /** Payload clipboard assembled cho mode single (deps header + tsx + css). */
  singlePayload?: string;
}

function CodeBlock({ content }: { content: string }) {
  const preRef = useRef<HTMLPreElement>(null);

  const handleSelectAll = () => {
    const node = preRef.current;
    if (node === null) return;
    const selection = window.getSelection();
    if (selection === null) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Mobile/clipboard-denied affordance: select-all không cần Clipboard API */}
      <button
        type="button"
        onClick={handleSelectAll}
        className="self-end text-xs text-zinc-500 underline-offset-2 hover:underline dark:text-zinc-400"
      >
        Select all
      </button>
      <pre
        ref={preRef}
        tabIndex={0}
        className="max-h-[480px] overflow-auto rounded-md border border-zinc-200 bg-zinc-100 p-4 font-mono text-xs leading-5 whitespace-pre text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
      >
        {content}
      </pre>
    </div>
  );
}

/**
 * Viewer source read-only (Story 4.4):
 * - multi: file tree sidebar + tab theo file, copy từng file riêng.
 * - single: 1 code block + 1 CopyButton với payload assembled.
 */
export function SourceViewer({
  mode,
  files,
  singlePayload,
}: SourceViewerProps) {
  const [activePath, setActivePath] = useState(files[0]?.path ?? "");
  const active = files.find((f) => f.path === activePath) ?? files[0];

  if (files.length === 0) return null;

  if (mode === "single") {
    const payload = singlePayload ?? files[0]?.content ?? "";
    return (
      <div className="flex flex-col gap-3">
        <CopyButton text={payload} label="Copy source" />
        <CodeBlock content={payload} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <nav
        aria-label="File tree"
        className="shrink-0 overflow-auto rounded-md border border-zinc-200 p-2 lg:max-h-[520px] lg:w-72 dark:border-zinc-800"
      >
        <ul className="flex flex-col gap-1">
          {files.map((file) => (
            <li key={file.path}>
              <button
                type="button"
                onClick={() => setActivePath(file.path)}
                aria-current={file.path === active?.path ? "true" : undefined}
                className={`w-full truncate rounded px-2 py-1 text-left font-mono text-xs transition-colors ${
                  file.path === active?.path
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
                title={file.path}
              >
                {file.path.replace("packages/", "")}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {active !== undefined && (
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {active.path}
            </span>
            <CopyButton text={active.content} label={`Copy ${active.name}`} />
          </div>
          <CodeBlock content={active.content} />
        </div>
      )}
    </div>
  );
}
