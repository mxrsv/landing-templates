import Link from "next/link";

import { PieceIndexPage } from "../../../components/catalog/piece-index-page";

export const metadata = {
  title: "UI — Landing Templates",
};

export default async function UiIndexPage(props: PageProps<"/ui">) {
  return (
    <PieceIndexPage
      layer="ui"
      eyebrow="UI"
      title="UI components copy-paste"
      searchParams={await props.searchParams}
      headerAction={
        <div className="flex flex-wrap gap-[var(--space-2)]">
          <Link
            href="/ui/shapes"
            className="rounded-[var(--radius-md)] border border-[var(--border-default)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-caption)] text-[var(--p-ink-2)] transition-colors hover:bg-[var(--state-hover-bg)] hover:text-[var(--p-ink)]"
          >
            Glass shapes →
          </Link>
          <Link
            href="/ui/surfaces"
            className="rounded-[var(--radius-md)] border border-[var(--border-default)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-caption)] text-[var(--p-ink-2)] transition-colors hover:bg-[var(--state-hover-bg)] hover:text-[var(--p-ink)]"
          >
            3D surfaces →
          </Link>
        </div>
      }
    />
  );
}
