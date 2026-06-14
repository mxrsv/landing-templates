"use client";

import { GLASS_SLIDERS, type GlassParams } from "./glass-params";

interface GlassControlsProps {
  params: GlassParams;
  onChange: (next: GlassParams) => void;
  onReset: () => void;
}

/**
 * Panel slider điều chỉnh material của 1 khối. Stateless — nhận `params` +
 * callback, update immutable (spread) ở caller.
 */
export function GlassControls({
  params,
  onChange,
  onReset,
}: GlassControlsProps) {
  return (
    <div className="flex flex-col gap-[var(--space-2)] border-t border-[var(--border-default)] px-[var(--space-4)] py-[var(--space-3)]">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-[var(--space-2)] text-[length:var(--text-eyebrow)] text-[var(--p-ink-2)]">
          <span>Color</span>
          <input
            type="color"
            value={params.color}
            onChange={(e) => onChange({ ...params, color: e.target.value })}
            className="h-[24px] w-[40px] cursor-pointer rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-transparent"
            aria-label="Màu thuỷ tinh"
          />
        </label>
        <button
          type="button"
          onClick={onReset}
          className="rounded-[var(--radius-sm)] border border-[var(--border-default)] px-[var(--space-2)] py-[2px] text-[length:var(--text-eyebrow)] text-[var(--p-ink-3)] transition-colors hover:bg-[var(--state-hover-bg)] hover:text-[var(--p-ink)]"
        >
          Reset
        </button>
      </div>

      {GLASS_SLIDERS.map((s) => (
        <label
          key={s.key}
          className="flex items-center gap-[var(--space-2)] text-[length:var(--text-eyebrow)] text-[var(--p-ink-3)]"
        >
          <span className="w-[84px] shrink-0">{s.label}</span>
          <input
            type="range"
            min={s.min}
            max={s.max}
            step={s.step}
            value={params[s.key]}
            onChange={(e) =>
              onChange({ ...params, [s.key]: Number(e.target.value) })
            }
            className="h-[2px] flex-1 cursor-pointer accent-[var(--p-primary)]"
            aria-label={s.label}
          />
          <span className="w-[36px] shrink-0 text-right tabular-nums text-[var(--p-ink-2)]">
            {params[s.key].toFixed(2)}
          </span>
        </label>
      ))}
    </div>
  );
}
