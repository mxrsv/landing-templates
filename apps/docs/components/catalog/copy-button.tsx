"use client";

import { Button } from "@landing/ui/components/button";
import { useState } from "react";

type CopyState = "idle" | "copied" | "fallback";

/**
 * Copy text vào clipboard. Clipboard API thiếu (non-secure context, mobile
 * cũ) hoặc bị deny → hiện fallback textarea read-only auto select-all để
 * user copy tay. `variant="solid"` cho primary action duy nhất trên detail.
 */
export function CopyButton({
  text,
  label = "Copy",
  variant = "ghost",
}: {
  text: string;
  label?: string;
  variant?: "solid" | "ghost";
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
    <div className="flex flex-col gap-[var(--space-2)]">
      <Button variant={variant} onClick={handleCopy} className="self-start">
        {state === "copied" ? "Đã copy ✓" : label}
      </Button>
      {state === "fallback" && (
        <textarea
          readOnly
          value={text}
          rows={6}
          aria-label="Source code — select all để copy tay"
          onFocus={(e) => e.currentTarget.select()}
          className="w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-1)] p-[var(--space-3)] font-mono text-[length:var(--text-eyebrow)] text-[var(--p-ink-2)]"
        />
      )}
    </div>
  );
}
