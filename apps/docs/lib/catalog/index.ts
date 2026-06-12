/**
 * Catalog aggregator — source of truth cho `allPieces`.
 *
 * REGISTRATION PATTERN (Epic D owner duy nhất sửa file này):
 * 1. Package export `pieceMeta` pure-data từ `config.ts`/`meta.ts` của nó.
 * 2. Mở registration task — Epic D owner merge SERIAL vào danh sách dưới.
 * 3. Epic khác KHÔNG sửa file này trực tiếp (tránh conflict giữa các epic song song).
 *
 * Kèm registration: append package vào `transpilePackages` (next.config.ts)
 * nếu chưa có. Mọi entry được validate fail-fast lúc module init — lỗi
 * registration nổ ngay khi build/dev, không đợi tới lúc render.
 */
import { pieceMeta as ternusPieceMeta } from "@landing/templates-ternus/config";

import { manifestSlugs } from "./manifest";
import type { CopyMode, PieceLayer, PieceMeta, PieceMood } from "./types";

export type {
  CopyMode,
  PieceFilterParams,
  PieceLayer,
  PieceMeta,
  PieceMood,
} from "./types";

const LAYERS: readonly PieceLayer[] = ["ui", "section", "template"];
const MOODS: readonly PieceMood[] = ["infra", "neon", "game", "nft"];
const COPY_MODES: readonly CopyMode[] = ["single", "multi"];

/**
 * Validate một pieceMeta export (boundary giữa package và catalog) và narrow
 * các field widened (`string[]` → `PieceMood[]`). Throw với message rõ ràng
 * khi registration không hợp lệ.
 */
function assertPieceMeta(input: unknown, source: string): PieceMeta {
  if (typeof input !== "object" || input === null) {
    throw new Error(`[catalog] ${source}: pieceMeta phải là object`);
  }
  const meta = input as Record<string, unknown>;

  const fail = (reason: string): never => {
    throw new Error(`[catalog] ${source}: ${reason}`);
  };

  if (typeof meta.slug !== "string" || meta.slug.trim() === "") {
    fail("`slug` phải là string không rỗng");
  }
  if (typeof meta.name !== "string" || meta.name.trim() === "") {
    fail("`name` phải là string không rỗng");
  }
  if (!LAYERS.includes(meta.layer as PieceLayer)) {
    fail(`\`layer\` "${String(meta.layer)}" không thuộc ${LAYERS.join("|")}`);
  }

  const isStringArray = (v: unknown): v is string[] =>
    Array.isArray(v) && v.every((x) => typeof x === "string");

  if (!isStringArray(meta.mood) || meta.mood.length === 0) {
    fail("`mood` phải là mảng string không rỗng");
  }
  const mood = meta.mood as string[];
  for (const m of mood) {
    if (!MOODS.includes(m as PieceMood)) {
      fail(`mood "${m}" không thuộc ${MOODS.join("|")}`);
    }
  }

  for (const key of ["useCase", "stackTags", "animationTags", "deps"]) {
    if (!isStringArray(meta[key])) {
      fail(`\`${key}\` phải là mảng string`);
    }
  }
  if (!COPY_MODES.includes(meta.copyMode as CopyMode)) {
    fail(`\`copyMode\` "${String(meta.copyMode)}" không thuộc single|multi`);
  }
  if (meta.sourcePaths !== undefined && !isStringArray(meta.sourcePaths)) {
    fail("`sourcePaths` (nếu có) phải là mảng string");
  }

  return {
    slug: meta.slug as string,
    name: meta.name as string,
    layer: meta.layer as PieceLayer,
    mood: mood as PieceMood[],
    useCase: meta.useCase as string[],
    stackTags: meta.stackTags as string[],
    animationTags: meta.animationTags as string[],
    deps: meta.deps as string[],
    copyMode: meta.copyMode as CopyMode,
    ...(meta.sourcePaths !== undefined
      ? { sourcePaths: meta.sourcePaths as string[] }
      : {}),
  };
}

/** Gom + validate registrations; duplicate slug bị reject ngay. */
function buildCatalog(
  registrations: ReadonlyArray<{ meta: unknown; source: string }>,
): readonly PieceMeta[] {
  const seen = new Set<string>();
  return registrations.map(({ meta, source }) => {
    const piece = assertPieceMeta(meta, source);
    if (seen.has(piece.slug)) {
      throw new Error(
        `[catalog] duplicate slug "${piece.slug}" (${source}) — slug phải duy nhất toàn catalog`,
      );
    }
    if (!manifestSlugs.has(piece.slug)) {
      throw new Error(
        `[catalog] slug "${piece.slug}" (${source}) không có trong manifest — thêm vào lib/catalog/manifest.ts trước khi registration (budget FR-10/NFR-9)`,
      );
    }
    seen.add(piece.slug);
    return piece;
  });
}

export const allPieces: readonly PieceMeta[] = buildCatalog([
  // Registration #1 — Ternus (Story 3.3 / 4.5)
  { meta: ternusPieceMeta, source: "@landing/templates-ternus/config" },
]);
