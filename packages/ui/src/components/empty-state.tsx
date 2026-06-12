import type { ReactNode } from "react";

export interface EmptyStateProps {
  /** Primary message, e.g. "Không có Piece phù hợp". */
  message: string;
  /** Secondary hint, e.g. "Thử bỏ bớt filter". */
  hint?: string;
  /** Escape action (a Button / link), e.g. "Xoá hết filter". */
  action?: ReactNode;
}

/** Shared empty state for an empty catalog or a zero-result filter. */
export function EmptyState({ message, hint, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-[var(--space-2)] border border-dashed border-[var(--border-default)] rounded-[var(--card-radius)] px-[var(--space-6)] py-[var(--space-10)]">
      <span
        aria-hidden
        className="text-[var(--p-ink-3)] text-[length:var(--text-h3)]"
      >
        ◌
      </span>
      <p className="text-[length:var(--text-caption)] text-[var(--p-ink)]">
        {message}
      </p>
      {hint && (
        <p className="text-[length:var(--text-eyebrow)] text-[var(--p-ink-3)]">
          {hint}
        </p>
      )}
      {action && <div className="mt-[var(--space-2)]">{action}</div>}
    </div>
  );
}
