"use client";

import { useEffect } from "react";

export default function AppError({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string };
    unstable_retry: () => void;
}) {
    useEffect(() => {
        console.error("[app] uncaught render error", error);
    }, [error]);

    return (
        <div role="alert" className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-400">
                {error.digest ? `Error ref: ${error.digest}` : (error.message ?? "Unexpected render error.")}
            </p>
            <button
                type="button"
                onClick={() => unstable_retry()}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
                Try again
            </button>
        </div>
    );
}
