/**
 * Catalog manifest — canonical slug list (Story 4.6).
 *
 * Source of truth cho piece budget + smoke test Story 9.4. Đây là danh sách
 * PLANNED: pieces register dần qua Epic 5–8; slug đăng ký vào aggregator phải
 * nằm trong manifest.
 *
 * ── BUDGET PROVENANCE (di trú từ BMAD — self-contained, `_bmad-output` sắp xoá) ──
 * Kỷ luật catalog = "depth over volume", KHÔNG chase volume. Nguồn gốc:
 * - PRD §4.3 FR-10 "UI catalog expansion": Gallery liệt kê ≥8 UI/sections,
 *   templates đếm RIÊNG → `MIN_UI_SECTIONS` (floor cứng).
 * - PRD §3 Glossary "Catalog": curated depth v1 = UI+sections ≥8 + templates
 *   riêng → tổng ~12–16 piece (depth over volume) → `SOFT_TOTAL_BUDGET` (target
 *   để cảnh báo, KHÔNG phải trần cứng). (Lưu ý: comment cũ ghi "NFR-9" nhưng PRD
 *   hiện không có mục đánh số đó — nguồn thật là Glossary + SM-C1 dưới đây.)
 * - PRD §6 SM-C1 (counter-metric): "không chase 50+; 12–16 curated đủ" → cơ sở
 *   cho `HARD_TOTAL_CEILING` (chặn volume-race thật, đặt << 50 nhưng dư chỗ cho
 *   roadmap: NFT epic-7, UI layer epic-8, Helix, Strata).
 * - docs/ideas/template-factory.md (giả định #3): đổi từ "tổng ≤16" CỨNG sang
 *   "đủ chiều sâu mỗi kind"; cap KHÔNG được nổ sớm khi thêm template/UI hợp lệ.
 *
 * Gate (fail-fast lúc module init) — đã NỚI để không vỡ build khi mở rộng hợp lệ:
 * - (ui+sections) ≥ MIN_UI_SECTIONS  → throw nếu TỤT dưới floor (regression guard).
 * - templates       ≥ MIN_TEMPLATES  → floor MỀM: throw chỉ khi tụt dưới core
 *   moods, KHÔNG chặn thêm template mới (trước đây === EXACT làm vỡ build).
 * - total           ≤ HARD_TOTAL_CEILING → throw chỉ khi runaway volume.
 * - total           >  SOFT_TOTAL_BUDGET → console.warn (tín hiệu mềm, KHÔNG throw).
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
  ],
  templates: ["ternus", "memecoin", "gamefi", "waitlist"],
} as const satisfies Record<"ui" | "sections" | "templates", readonly string[]>;

/** Floor cứng UI+sections — PRD FR-10 (templates đếm RIÊNG). */
const MIN_UI_SECTIONS = 8;
/** Floor MỀM templates — Aesthetic Trinity (infra/neon/game) + NFT; không tụt dưới. */
const MIN_TEMPLATES = 4;
/** Target curated "12–16" (PRD Glossary/SM-C1) — vượt → cảnh báo, KHÔNG throw. */
const SOFT_TOTAL_BUDGET = 16;
/** Trần runaway (SM-C1 "không 50+") — đặt << 50, dư cho roadmap NFT/UI/Helix/Strata. */
const HARD_TOTAL_CEILING = 32;

function assertManifestBudget(): void {
  const uiSections = manifest.ui.length + manifest.sections.length;
  const templates = manifest.templates.length;
  const total = uiSections + templates;

  // Floor cứng: UI+sections không được dưới ngưỡng curated-depth (PRD FR-10).
  if (uiSections < MIN_UI_SECTIONS) {
    throw new Error(
      `[manifest] (UI + sections) = ${uiSections} < ${MIN_UI_SECTIONS} — vi phạm floor FR-10`,
    );
  }
  // Floor MỀM: chỉ chặn khi TỤT dưới core moods — KHÔNG chặn thêm template mới.
  if (templates < MIN_TEMPLATES) {
    throw new Error(
      `[manifest] templates = ${templates} < ${MIN_TEMPLATES} — thiếu core moods (Aesthetic Trinity + NFT)`,
    );
  }
  // Trần CỨNG: chỉ nổ khi runaway volume (SM-C1 "depth over volume, không chase 50+").
  if (total > HARD_TOTAL_CEILING) {
    throw new Error(
      `[manifest] tổng = ${total} > ${HARD_TOTAL_CEILING} — vượt trần runaway (SM-C1: không chase 50+)`,
    );
  }
  // Tín hiệu MỀM: nhắc kỷ luật curated khi vượt target — KHÔNG vỡ build.
  if (total > SOFT_TOTAL_BUDGET) {
    console.warn(
      `[manifest] tổng = ${total} > ${SOFT_TOTAL_BUDGET} (curated target) — giữ "depth over volume" (PRD SM-C1); mỗi piece thêm cần justify trong PR.`,
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
