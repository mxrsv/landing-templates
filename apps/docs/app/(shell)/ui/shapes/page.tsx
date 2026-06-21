import Link from "next/link";
import { Body, Eyebrow, Heading } from "@landing/ui/components/text";

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
        <Eyebrow as="p" className="mt-[var(--space-3)]">
          Lab
        </Eyebrow>
        <Heading level={2} as="h1" className="mt-[var(--space-2)]">
          Glass shapes
        </Heading>
        <Body className="mt-[var(--space-3)] max-w-[60ch]">
          Reference các khối thuỷ tinh holographic (transmission + dispersion +
          iridescence) dựng bằng three.js — tham khảo dáng hình & material,
          không phải UI component copy-paste.
        </Body>
      </header>

      <div className="mt-[var(--space-8)]">
        <ShapesGallery />
      </div>
    </main>
  );
}
