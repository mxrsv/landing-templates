/**
 * Server-only source reader cho copy viewer (Story 4.4).
 *
 * Copy mechanism chốt toàn catalog: RSC `fs.readFile` tại build theo
 * `pieceMeta.sourcePaths`. KHÔNG import file này từ client component.
 */
import "server-only";

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { PieceMeta } from "./types";

export interface PieceSourceFile {
  /** Đường dẫn từ repo root (giữ nguyên như trong sourcePaths). */
  path: string;
  /** Tên file hiển thị (basename). */
  name: string;
  content: string;
}

/** Repo root = thư mục chứa `pnpm-workspace.yaml`, dò từ cwd đi lên. */
function repoRoot(): string {
  let dir = process.cwd();
  while (!existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(
        "[catalog] không tìm thấy pnpm-workspace.yaml từ cwd đi lên — read-source cần chạy trong monorepo",
      );
    }
    dir = parent;
  }
  return dir;
}

/**
 * Đọc toàn bộ sourcePaths của một Piece. Fail fast khi path thoát khỏi
 * `<repo>/packages/` (chống traversal) hoặc file không tồn tại — lỗi nổ
 * lúc build/dev thay vì render thiếu file âm thầm.
 */
export async function readPieceSources(
  piece: PieceMeta,
): Promise<PieceSourceFile[]> {
  const root = repoRoot();
  const allowedPrefix = path.join(root, "packages") + path.sep;

  return Promise.all(
    (piece.sourcePaths ?? []).map(async (sourcePath) => {
      const resolved = path.resolve(root, sourcePath);
      if (!resolved.startsWith(allowedPrefix)) {
        throw new Error(
          `[catalog] sourcePath "${sourcePath}" (piece "${piece.slug}") nằm ngoài packages/ — từ chối đọc`,
        );
      }
      const content = await readFile(resolved, "utf8");
      return { path: sourcePath, name: path.basename(sourcePath), content };
    }),
  );
}

/**
 * Payload clipboard cho `copyMode: "single"`: header `// deps:` + file .tsx
 * chính + CSS nối cuối, mỗi file CSS mở đầu bằng banner "---- name.css ----".
 */
export function assembleSingleFile(
  piece: PieceMeta,
  files: readonly PieceSourceFile[],
): string {
  const main = files.find((f) => f.name.endsWith(".tsx")) ?? files[0];
  const cssFiles = files.filter((f) => f.name.endsWith(".css"));

  const parts = [`// deps: ${piece.deps.join(" ")}`, main?.content ?? ""];
  for (const css of cssFiles) {
    parts.push(`/* ---- ${css.name} ---- */`, css.content);
  }
  return parts.join("\n\n");
}
