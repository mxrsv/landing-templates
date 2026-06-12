"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { useId } from "react";

export interface CheckboxProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Result count shown muted next to the label (filter UX). */
  count?: number;
  disabled?: boolean;
}

/**
 * Labelled checkbox for filter groups — Radix primitive for keyboard/aria,
 * checked state uses the accent (within the accent budget for form controls).
 */
export function Checkbox({
  label,
  checked,
  onCheckedChange,
  count,
  disabled,
}: CheckboxProps) {
  const id = useId();
  return (
    <div className="flex items-center gap-[var(--space-2)]">
      <CheckboxPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        disabled={disabled}
        className={
          "size-3.5 shrink-0 rounded-[3px] border border-[var(--border-emphasis)] bg-transparent cursor-pointer " +
          "transition-[background-color,border-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] " +
          "data-[state=checked]:bg-[var(--state-focus-ring)] data-[state=checked]:border-[var(--state-focus-ring)] " +
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)] " +
          "disabled:opacity-[var(--state-disabled-opacity)] disabled:pointer-events-none"
        }
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-[var(--btn-solid-fg)] text-[9px] leading-none">
          ✓
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label
        htmlFor={id}
        className="text-[length:var(--text-caption)] text-[var(--p-ink-2)] cursor-pointer select-none"
      >
        {label}
        {typeof count === "number" && (
          <span className="ml-[var(--space-1)] text-[var(--p-ink-3)]">
            ({count})
          </span>
        )}
      </label>
    </div>
  );
}
