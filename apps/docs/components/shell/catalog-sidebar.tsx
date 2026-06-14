"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import type { PieceLayer, PieceMeta } from "../../lib/catalog";

const LAYER_GROUPS: ReadonlyArray<{ layer: PieceLayer; label: string }> = [
  { layer: "ui", label: "UI" },
  { layer: "section", label: "Sections" },
  { layer: "template", label: "Templates" },
];

/** Brand link đầu sidebar — về `/` (reset selection + filter). */
function BrandLink() {
  return (
    <Link
      href="/"
      className="flex items-center gap-[var(--space-2)] font-medium text-[var(--p-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
    >
      <span aria-hidden className="text-[var(--p-primary)]">
        ▞
      </span>
      landing-list
    </Link>
  );
}

/**
 * Render thuần của sidebar (không hook) — dùng chung cho `CatalogSidebar`
 * (client, active theo URL) và `SidebarNavFallback` (Suspense fallback, không
 * active). `buildHref` do nơi gọi cung cấp để giữ filter/layer hiện tại.
 */
function SidebarNav({
  pieces,
  activeSlug,
  buildHref,
}: {
  pieces: readonly PieceMeta[];
  activeSlug: string | null;
  buildHref: (slug: string) => string;
}) {
  return (
    <nav
      aria-label="Catalog"
      className="flex flex-col gap-[var(--space-6)] text-[length:var(--text-caption)]"
    >
      <BrandLink />

      {LAYER_GROUPS.map(({ layer, label }) => {
        const group = pieces.filter((piece) => piece.layer === layer);
        if (group.length === 0) return null;
        return (
          <div key={layer} className="flex flex-col gap-[var(--space-2)]">
            <p className="text-[length:var(--text-eyebrow)] font-medium tracking-[0.2em] text-[var(--p-ink-3)] uppercase">
              {label}
            </p>
            <ul className="flex flex-col gap-[var(--space-1)]">
              {group.map((piece) => {
                const active = piece.slug === activeSlug;
                return (
                  <li key={piece.slug}>
                    <Link
                      href={buildHref(piece.slug)}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-[var(--radius-md)] px-[var(--space-2)] py-[var(--space-1)] transition-[color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)] ${
                        active
                          ? "bg-[var(--state-active-bg)] text-[var(--p-ink)]"
                          : "text-[var(--p-ink-2)] hover:bg-[var(--state-hover-bg)] hover:text-[var(--p-ink)]"
                      }`}
                    >
                      {piece.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

/**
 * Sidebar điều hướng catalog (thay SiteNav): text thuần kiểu Storybook, nhóm
 * theo Layer, active theo `?piece`. Href giữ nguyên filter/layer hiện tại
 * (chỉ set/đổi `piece`) → URL là source of truth (spec §3.1).
 */
export function CatalogSidebar({ pieces }: { pieces: readonly PieceMeta[] }) {
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("piece");

  const buildHref = (slug: string): string => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("piece", slug);
    return `/?${params.toString()}`;
  };

  return (
    <SidebarNav pieces={pieces} activeSlug={activeSlug} buildHref={buildHref} />
  );
}

/**
 * Fallback cho `<Suspense>` bọc CatalogSidebar (guide Next: client component
 * dùng useSearchParams phải có Suspense, nếu không build fail). Cùng cấu trúc
 * nav nên không gây layout shift; chưa giữ filter (sẽ được client sửa ngay khi
 * hydrate), active rỗng.
 */
export function SidebarNavFallback({
  pieces,
}: {
  pieces: readonly PieceMeta[];
}) {
  return (
    <SidebarNav
      pieces={pieces}
      activeSlug={null}
      buildHref={(slug) => `/?piece=${slug}`}
    />
  );
}
