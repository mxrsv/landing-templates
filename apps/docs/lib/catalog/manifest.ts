/**
 * Catalog manifest — canonical slug list cho v1 (Story 4.6).
 *
 * Source of truth cho piece budget (PRD FR-10 / NFR-9) và smoke test
 * Story 9.4. Đây là danh sách PLANNED: pieces registration dần qua
 * Epic 5–8; slug đăng ký vào aggregator phải nằm trong manifest.
 *
 * Floors (enforce fail-fast lúc module init):
 * - (ui + sections).length ≥ 8 — KHÔNG tính templates
 * - templates.length === 5 (4 mood gốc + Waitlist JTBD trên mood infra)
 * - tổng ≤ 17 (exception >16 cần rationale trong PR)
 *
 * Rationale bump 4→5 / 16→17 (giả định #3 template-factory): chuyển khỏi tư
 * duy "tổng ≤16" sang "đủ chiều sâu mỗi kind". Waitlist là template JTBD chính
 * đáng ("launch a waitlist"), không phải phình tuỳ tiện — story kiểm chứng cap.
 */
import type { PieceLayer } from "./types";

export const manifest = {
  ui: [
    "pixel-blast",
    "logo-loop",
    "soft-aurora",
    "price-ticker",
    "chip-connect",
  ],
  sections: [
    "memecoin-hero-ticker",
    "token-stats-strip",
    "community-marquee",
    "gamefi-hud-hero",
    "character-showcase",
    "nft-gallery-grid",
    "mint-countdown",
  ],
  templates: ["ternus", "memecoin", "gamefi", "aikit", "waitlist"],
} as const satisfies Record<"ui" | "sections" | "templates", readonly string[]>;

const MIN_UI_SECTIONS = 8;
const EXACT_TEMPLATES = 5;
const MAX_TOTAL = 17;

function assertManifestBudget(): void {
  const uiSections = manifest.ui.length + manifest.sections.length;
  const templates = manifest.templates.length;
  const total = uiSections + templates;

  if (uiSections < MIN_UI_SECTIONS) {
    throw new Error(
      `[manifest] (UI + sections) = ${uiSections} < ${MIN_UI_SECTIONS} — vi phạm floor FR-10`,
    );
  }
  if (templates !== EXACT_TEMPLATES) {
    throw new Error(
      `[manifest] templates = ${templates}, yêu cầu đúng ${EXACT_TEMPLATES}`,
    );
  }
  if (total > MAX_TOTAL) {
    throw new Error(
      `[manifest] tổng = ${total} > ${MAX_TOTAL} — vượt budget NFR-9 (exception cần rationale)`,
    );
  }
}

assertManifestBudget();

/** Toàn bộ canonical slugs (flat) — dùng cho guard registration + smoke 9.4. */
export const manifestSlugs: ReadonlySet<string> = new Set([
  ...manifest.ui,
  ...manifest.sections,
  ...manifest.templates,
]);

const LAYER_TO_GROUP: Record<PieceLayer, keyof typeof manifest> = {
  ui: "ui",
  section: "sections",
  template: "templates",
};

/** Canonical slugs của một layer (PieceLayer → nhóm manifest). */
export function manifestSlugsForLayer(layer: PieceLayer): readonly string[] {
  return manifest[LAYER_TO_GROUP[layer]];
}
