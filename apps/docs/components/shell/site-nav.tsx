"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/ui", label: "UI" },
  { href: "/sections", label: "Sections" },
  { href: "/templates", label: "Templates" },
] as const;

/** Chrome top nav — neutral frame, active link đánh dấu bằng tab indicator. */
export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--surface-0)]/90 backdrop-blur">
      <nav className="mx-auto flex h-12 w-full max-w-[var(--container-max)] items-center justify-between px-[var(--space-6)]">
        <Link
          href="/"
          className="flex items-center gap-[var(--space-2)] text-[length:var(--text-caption)] font-medium text-[var(--p-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
        >
          <span aria-hidden className="text-[var(--p-primary)]">
            ▞
          </span>
          landing-list
        </Link>
        <div className="flex items-center gap-[var(--space-1)]">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-[var(--radius-md)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-caption)] transition-[color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)] ${
                  active
                    ? "text-[var(--p-ink)] bg-[var(--state-active-bg)]"
                    : "text-[var(--p-ink-2)] hover:text-[var(--p-ink)] hover:bg-[var(--state-hover-bg)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
