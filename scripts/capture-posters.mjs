// @ts-check
/**
 * Poster capture pipeline (ADR-0001).
 *
 * Với mỗi slug đã register, mở Fullscreen preview `/preview/<slug>` ở viewport
 * 1280×720 (đúng 16:9 = hero-fold) dưới `prefers-reduced-motion: reduce`, chụp
 * PNG rồi convert WebP quality ~80 → `apps/docs/public/posters/<slug>.webp`.
 *
 * Playwright chỉ xuất PNG/JPEG nên buộc qua `sharp` để ra WebP.
 *
 * Boot: tự spawn production server (`pnpm --filter docs start`, PORT=3210) —
 * yêu cầu `pnpm build` chạy trước. Override bằng env `POSTERS_BASE_URL` để
 * trỏ vào server có sẵn (bỏ qua spawn).
 *
 * Slug đọc trực tiếp từ text `piece-registrations.ts` (regex) vì file `.mjs`
 * không resolve được workspace TS import — registrations là canonical source
 * cho tập có preview (mỗi entry có `loadPreview`).
 */
import { spawn } from "node:child_process";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const REGISTRATIONS = resolve(
  REPO_ROOT,
  "apps/docs/lib/catalog/piece-registrations.ts",
);
const POSTERS_DIR = resolve(REPO_ROOT, "apps/docs/public/posters");

const VIEWPORT = { width: 1280, height: 720 };
const PORT = 3210;
const WEBP_QUALITY = 80;
const SETTLE_MS = 400;
const READY_TIMEOUT_MS = 60_000;

/** Lấy danh sách slug có preview từ registrations (regex trên text canonical). */
function readRegisteredSlugs() {
  const text = readFileSync(REGISTRATIONS, "utf8");
  const slugs = [...text.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  const unique = [...new Set(slugs)];
  if (unique.length === 0) {
    throw new Error("[posters] không tìm thấy slug nào trong registrations");
  }
  return unique;
}

/** Spawn production server, resolve khi `/` trả 200 (hoặc reject khi timeout). */
async function bootServer() {
  const child = spawn("pnpm", ["--filter", "docs", "start"], {
    cwd: REPO_ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: "ignore",
  });
  const base = `http://localhost:${PORT}`;
  const deadline = Date.now() + READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(base + "/");
      if (res.ok) return { child, base };
    } catch {
      // server chưa sẵn sàng — poll tiếp
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  child.kill("SIGTERM");
  throw new Error(`[posters] server không sẵn sàng sau ${READY_TIMEOUT_MS}ms`);
}

async function main() {
  const slugs = readRegisteredSlugs();
  mkdirSync(POSTERS_DIR, { recursive: true });

  const override = process.env.POSTERS_BASE_URL;
  const server = override ? null : await bootServer();
  const base = override ?? server.base;

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });

  const failures = [];
  try {
    for (const slug of slugs) {
      const page = await context.newPage();
      try {
        await page.goto(`${base}/preview/${slug}`, {
          waitUntil: "networkidle",
          timeout: 30_000,
        });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(SETTLE_MS);
        const png = await page.screenshot({
          type: "png",
          clip: { x: 0, y: 0, ...VIEWPORT },
        });
        await sharp(png)
          .webp({ quality: WEBP_QUALITY })
          .toFile(resolve(POSTERS_DIR, `${slug}.webp`));
        process.stdout.write(`[posters] ✓ ${slug}\n`);
      } catch (error) {
        failures.push(slug);
        const message = error instanceof Error ? error.message : String(error);
        process.stderr.write(`[posters] ✗ ${slug}: ${message}\n`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    server?.child.kill("SIGTERM");
  }

  if (failures.length > 0) {
    throw new Error(
      `[posters] thất bại ${failures.length}: ${failures.join(", ")}`,
    );
  }
  process.stdout.write(`[posters] hoàn tất ${slugs.length} poster\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : error}\n`);
  process.exit(1);
});
