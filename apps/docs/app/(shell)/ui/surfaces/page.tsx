import Link from "next/link";

import { SurfacesGallery } from "./surfaces-gallery";

export const metadata = {
  title: "3D surfaces — UI lab",
};

/**
 * Trang reference (KHÔNG phải catalog piece) — kho bề mặt 3D cho viên "flow
 * knot" (TorusKnot) sinh từ brainstorm Waitlist. Tách khỏi catalog `/ui` để
 * không đụng manifest budget (lib/catalog/manifest.ts).
 * Recipe gốc: docs/ideas/reference/3d-artifact-surfaces.md
 */
export default function SurfacesPage() {
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
          3D artifact surfaces
        </h1>
        <p className="mt-[var(--space-3)] max-w-[60ch] text-[length:var(--text-body)] text-[var(--p-ink-2)]">
          Kho bề mặt tham khảo cho viên flow knot (TorusKnot) — mỗi bề mặt xử lý
          ánh sáng theo cách khác nhau (unlit / khúc xạ / phản chiếu / phát xạ).
          Sinh từ brainstorm Waitlist template, giữ ở dạng recipe theo mô hình
          harvest-later — tham khảo material, không phải UI component
          copy-paste.
        </p>
      </header>

      <div className="mt-[var(--space-8)]">
        <SurfacesGallery />
      </div>
    </main>
  );
}
