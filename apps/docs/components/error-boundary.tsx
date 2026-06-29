"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: (error: Error, retry: () => void) => ReactNode;
    onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    error: Error | null;
}

/**
 * Reusable React error boundary. Catches render errors in `children` and
 * renders `fallback` (or a default message) instead of crashing the subtree.
 * Use to isolate risky sub-trees (live previews, WebGL mounts, dynamic chunks).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("[ErrorBoundary] render error", error, info);
        this.props.onError?.(error, info);
    }

    private retry = () => this.setState({ error: null });

    render() {
        const { error } = this.state;
        if (error) {
            return this.props.fallback?.(error, this.retry) ?? null;
        }
        return this.props.children;
    }
}
