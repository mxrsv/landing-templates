"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

export interface TooltipProps {
  /** Tooltip body, e.g. dependency install hint. */
  content: ReactNode;
  children: ReactNode;
}

/**
 * Hover/focus tooltip on `--surface-3`, 300ms delay (spec §4). Wrap any
 * trigger element; Radix handles aria/positioning.
 */
export function Tooltip({ content, children }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={6}
            className="max-w-72 rounded-[var(--radius-md)] border border-[var(--tooltip-border)] bg-[var(--tooltip-bg)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-eyebrow)] text-[var(--tooltip-fg)] shadow-lg"
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
