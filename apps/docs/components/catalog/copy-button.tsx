"use client";

import { useState } from "react";

type CopyState = "idle" | "copied" | "fallback";

/**
 * Copy text vào clipboard (desktop). Clipboard API thiếu (non-secure
 * context, mobile cũ) hoặc bị deny → hiện fallback textarea read-only
 * auto select-all để user copy tay.
 */
export function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [state, setState] = useState<CopyState>("idle");

  const handleCopy = async () => {
    if (navigator.clipboard === undefined) {
      setState("fallback");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      setTimeout(() => setState("idle"), 1500);
    } catch {
      setState("fallback");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="self-start rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:border-violet-400 hover:text-violet-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-violet-500 dark:hover:text-violet-300"
      >
        {state === "copied" ? "Đã copy ✓" : label}
      </button>
      {state === "fallback" && (
        <textarea
          readOnly
          value={text}
          rows={6}
          aria-label="Source code — select all để copy tay"
          onFocus={(e) => e.currentTarget.select()}
          className="w-full rounded-md border border-zinc-300 bg-zinc-100 p-3 font-mono text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        />
      )}
    </div>
  );
}
