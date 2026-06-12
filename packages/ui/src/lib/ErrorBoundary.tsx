"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Short label shown on the static fallback (e.g. the Piece name). */
  label?: string;
  /** Optional custom fallback; overrides the default gradient slot. */
  fallback?: ReactNode;
  /** Optional hook for reporting (no console logging by default). */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches render/runtime errors in an animated Piece and degrades to a static
 * fallback (gradient + label) instead of crashing the page or leaving a blank.
 *
 * Required wrapper for WebGL/GSAP/canvas Pieces — see
 * `@landing/design-tokens/INVARIANT.md`. React error boundaries must be class
 * components, hence this is not a hook.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback !== undefined) {
      return this.props.fallback;
    }

    return (
      <div
        role="img"
        aria-label={this.props.label ?? "Content unavailable"}
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "12rem",
          width: "100%",
          borderRadius: "var(--radius-sm, 4px)",
          border: "1px solid var(--p-line, rgba(255,255,255,0.12))",
          background:
            "linear-gradient(135deg, var(--p-surface, #0c0d14), var(--p-bg, #07070c))",
          color: "var(--p-ink-3, rgba(255,255,255,0.42))",
          fontSize: "var(--text-caption, 0.8125rem)",
          letterSpacing: "0.02em",
        }}
      >
        {this.props.label ?? "Content unavailable"}
      </div>
    );
  }
}
