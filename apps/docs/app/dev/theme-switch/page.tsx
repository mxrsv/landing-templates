// REMOVE before Epic 4 ship — dev-only demo for the 4 design-token themes.
"use client";

import { useState } from "react";
import {
  THEME_MOODS,
  resolveTheme,
  type ThemeMood,
} from "@landing/design-tokens/theme";

export default function ThemeSwitchPage() {
  const [theme, setTheme] = useState<ThemeMood>("infra");

  return (
    <main className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
      <h1 className="text-2xl font-semibold tracking-tight">
        Theme switch (dev)
      </h1>
      <p className="mt-2 text-sm text-zinc-400">
        Đổi <code>data-theme</code> trên wrapper bên dưới. Palette đổi theo,
        spacing/type floor giữ nguyên.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {THEME_MOODS.map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => setTheme(resolveTheme(mood))}
            aria-pressed={theme === mood}
            className={`rounded border px-3 py-1.5 text-sm transition-colors ${
              theme === mood
                ? "border-zinc-100 bg-zinc-100 text-zinc-900"
                : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* Wrapper carries data-theme — NOT documentElement — matching the
          Epic 4 preview-wrapper pattern (scoped, no global leak). */}
      <section
        data-theme={theme}
        className="mt-8 rounded-lg border border-line p-[var(--space-6)]"
        style={{ background: "var(--p-bg)" }}
      >
        <p className="text-[length:var(--text-eyebrow)] tracking-[0.3em] text-accent uppercase">
          {theme} mood
        </p>
        <h2 className="mt-[var(--space-3)] text-[length:var(--text-h2)] text-ink">
          Same spacing floor, different palette
        </h2>
        <p className="mt-[var(--space-4)] text-[length:var(--text-body)] text-ink-2">
          Khối này dùng <code>bg-primary</code>, <code>text-ink</code>,{" "}
          <code>border-line</code> — tất cả resolve qua <code>var(--p-*)</code>.
        </p>
        <div className="mt-[var(--space-4)] flex gap-[var(--space-2)]">
          <span className="inline-block h-8 w-16 rounded bg-primary" />
          <span className="inline-block h-8 w-16 rounded bg-surface" />
          <span className="inline-block h-8 w-16 rounded bg-accent" />
        </div>
      </section>
    </main>
  );
}
