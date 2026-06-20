import { Suspense } from "react";

import {
  CatalogSidebar,
  SidebarNavFallback,
} from "../../components/shell/catalog-sidebar";
import { allPieces } from "../../lib/catalog";

/** Repo chỉ trưng Templates → sidebar bỏ qua layer UI/Sections. */
const templates = allPieces.filter((piece) => piece.layer === "template");

/**
 * Shell catalog: sidebar nav cố định trái + content slot phải (master–detail).
 * Sidebar `hidden lg:block` (mobile dồn vào deep-link). Route `/preview/*` nằm
 * ngoài group `(shell)` nên không dính khung này.
 */
export default function ShellLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto flex w-full max-w-[var(--container-max)] gap-[var(--space-6)] px-[var(--space-6)]">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 overflow-y-auto py-[var(--space-8)] lg:block">
        <Suspense fallback={<SidebarNavFallback pieces={templates} />}>
          <CatalogSidebar pieces={templates} />
        </Suspense>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
