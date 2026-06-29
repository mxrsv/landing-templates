/**
 * Catalog aggregator — source of truth cho `allPieces`.
 * Preview loaders (client-safe) nằm ở `preview-loaders.ts`.
 *
 * REGISTRATION: thêm Piece mới tại `piece-registrations.ts` (single entry point).
 * Slug phải có trong `manifest.ts` trước. Không sửa file này trực tiếp.
 */
import { pieceRegistrations } from "./piece-registrations";
import { manifestSlugs } from "./manifest";
import type {
  CopyMode,
  PieceLayer,
  PieceMeta,
  PieceMood,
  PieceStatus,
} from "./types";

export type {
  CopyMode,
  PieceLayer,
  PieceMeta,
  PieceMood,
  PieceStatus,
} from "./types";

const LAYERS: readonly PieceLayer[] = ["ui", "section", "template"];
const MOODS: readonly PieceMood[] = ["infra", "neon", "game", "nft", "defi"];
const COPY_MODES: readonly CopyMode[] = ["single", "multi"];
const STATUSES: readonly PieceStatus[] = ["draft", "production", "planned"];

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
  if (
    meta.status !== undefined &&
    !STATUSES.includes(meta.status as PieceStatus)
  ) {
    fail(
      `\`status\` "${String(meta.status)}" không thuộc ${STATUSES.join("|")}`,
    );
  }
  if (meta.offSystem !== undefined && typeof meta.offSystem !== "boolean") {
    fail("`offSystem` (nếu có) phải là boolean");
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
    status: (meta.status as PieceStatus | undefined) ?? "production",
    ...(meta.sourcePaths !== undefined
      ? { sourcePaths: meta.sourcePaths as string[] }
      : {}),
    ...(meta.offSystem !== undefined
      ? { offSystem: meta.offSystem as boolean }
      : {}),
  };
}

function buildCatalog(
  registrations: typeof pieceRegistrations,
): readonly PieceMeta[] {
  const seen = new Set<string>();
  return registrations.map(({ slug, meta, source }) => {
    const piece = assertPieceMeta(meta, source);
    if (piece.slug !== slug) {
      throw new Error(
        `[catalog] registration slug "${slug}" (${source}) không khớp meta.slug "${piece.slug}"`,
      );
    }
    if (seen.has(piece.slug)) {
      throw new Error(
        `[catalog] duplicate slug "${piece.slug}" (${source}) — slug phải duy nhất toàn catalog`,
      );
    }
    if (!manifestSlugs.has(piece.slug)) {
      throw new Error(
        `[catalog] slug "${piece.slug}" (${source}) không có trong manifest — thêm vào lib/catalog/manifest.ts trước khi registration`,
      );
    }
    seen.add(piece.slug);
    return piece;
  });
}

export const allPieces: readonly PieceMeta[] = buildCatalog(pieceRegistrations);
