import Link from "next/link";

import { ShapesGallery } from "./shapes-gallery";

export const metadata = {
  title: "Glass shapes — UI lab",
};

/**
 * Trang reference (KHÔNG phải catalog piece) — gallery các khối thuỷ tinh
 * holographic dựng bằng three.js. Tách khỏi catalog `/ui` để không đụng
 * manifest budget (lib/catalog/manifest.ts).
 */
export default function ShapesPage() {
  return (
    <main className="mx-auto w-full max-w-[var(--container-max)] px-[var(--space-6)] py-[var(--space-10)]">
      <header>
        <Link
          href="/ui"
          className="text-[length:var(--text-caption)] text-[var(--p-ink-3)] transition-colors hover:text-[var(--p-ink)]"
        >
          ← UI
        </Link>
        <p className="mt-[var(--space-3)] text-[length:var(--text-eyebrow)] font-medium tracking-[0.3em] text-[var(--p-ink-3)] uppercase">
          Lab
        </p>
        <h1 className="mt-[var(--space-2)] text-[length:var(--text-h2)] font-semibold tracking-tight text-[var(--p-ink)]">
          Glass shapes
        </h1>
        <p className="mt-[var(--space-3)] max-w-[60ch] text-[length:var(--text-body)] text-[var(--p-ink-2)]">
          Reference các khối thuỷ tinh holographic (transmission + dispersion +
          iridescence) dựng bằng three.js — tham khảo dáng hình & material,
          không phải UI component copy-paste.
        </p>
      </header>

      <div className="mt-[var(--space-8)]">
        <ShapesGallery />
      </div>
    </main>
  );
}
