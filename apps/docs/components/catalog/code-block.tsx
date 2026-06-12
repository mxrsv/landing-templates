"use client";

import { useRef } from "react";

import { CopyButton } from "./copy-button";

/**
 * Code block read-only cho source tab: select-all (affordance khi clipboard
 * bị deny / mobile) + CopyButton ghost cho từng file.
 */
export function CodeBlock({
  content,
  copyLabel = "Copy",
}: {
  content: string;
  copyLabel?: string;
}) {
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
    <div className="flex flex-col gap-[var(--space-2)]">
      <div className="flex items-center justify-end gap-[var(--space-3)]">
        <button
          type="button"
          onClick={handleSelectAll}
          className="cursor-pointer text-[length:var(--text-eyebrow)] text-[var(--p-ink-3)] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
        >
          Select all
        </button>
        <CopyButton text={content} label={copyLabel} />
      </div>
      <pre
        ref={preRef}
        tabIndex={0}
        className="max-h-[480px] overflow-auto rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-1)] p-[var(--space-4)] font-mono text-[length:var(--text-eyebrow)] leading-5 whitespace-pre text-[var(--p-ink-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
      >
        {content}
      </pre>
    </div>
  );
}
