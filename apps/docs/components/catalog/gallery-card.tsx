"use client";

import { Badge } from "@landing/ui/components/badge";
import { Card, CardBody, CardPreview } from "@landing/ui/components/card";
import Link from "next/link";

import type { PieceMeta, PieceMood } from "../../lib/catalog";
import { PosterThumb } from "./poster-thumb";
import { useHoverIntent } from "./use-hover-intent";

const LAYER_LABEL: Record<PieceMeta["layer"], string> = {
  ui: "UI",
  section: "Section",
  template: "Template",
};

const DEFAULT_MOOD: PieceMood = "infra";

/**
 * Card gallery: poster thumbnail + tên (stretched-link) + tags. Hover-intent
 * bind ở wrapper card-level — `pointerenter` vẫn bắn dù stretched-link overlay
 * (`after:inset-0`) phủ poster — rồi truyền `active` xuống PosterThumb
 * (controlled) để mount live. Tránh `<a>` lồng `<a>`: chỉ tên là Link, poster
 * không bọc anchor.
 */
export function GalleryCard({
  piece,
  href,
}: {
  piece: PieceMeta;
  href: string;
}) {
  const { active, bind } = useHoverIntent();
  const mood = piece.mood[0] ?? DEFAULT_MOOD;

  return (
    <div {...bind}>
      <Card className="relative">
        <CardPreview className="border-b border-[var(--card-border)]">
          <PosterThumb slug={piece.slug} mood={mood} active={active} />
        </CardPreview>
        <CardBody>
          <h3 className="text-[length:var(--text-caption)] font-medium text-[var(--p-ink)]">
            <Link
              href={href}
              aria-label={`${piece.name} — ${LAYER_LABEL[piece.layer]} piece`}
              className="rounded-[var(--radius-sm)] after:absolute after:inset-0 after:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus-ring)]"
            >
              {piece.name}
            </Link>
          </h3>
          <div className="relative mt-[var(--space-2)] flex flex-wrap gap-[var(--space-1)]">
            {piece.mood.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
            {piece.stackTags.map((tag) => (
              <Badge key={tag} variant="neutral">
                {tag}
              </Badge>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
