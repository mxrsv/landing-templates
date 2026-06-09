#!/usr/bin/env node
// Gate structural: mọi workspace package CHỨA source .ts/.tsx phải khai báo
// script `check-types`. Nếu thiếu, `turbo run check-types|build` sẽ bỏ qua package
// đó âm thầm (turbo coi task không có script là no-op thành công) → lỗ hổng
// type-coverage tái mở khi epic sau thêm code vào skeleton mà quên thêm script.
// Story 1.6 AC#1/#7: "regression type ở BẤT KỲ package nào đều fail gate".
//
// ⚠️ BYPASS: guard chỉ được wire vào root script `build` + `check-types`
// (package.json). Chạy thẳng `turbo run build` / `pnpm --filter <pkg> build`
// sẽ KHÔNG qua guard này. Khi dựng CI (story 9-5), CI PHẢI gọi `pnpm build` /
// `pnpm check-types`, KHÔNG gọi turbo trực tiếp, nếu không gate sẽ bị né.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKSPACE_DIRS = ["apps", "packages"];
const SOURCE_EXT = [".ts", ".tsx"];
const IGNORE_DIRS = new Set(["node_modules", "dist", ".next", ".turbo"]);
const DECLARATION_SUFFIX = ".d.ts";

/** @param {string} dir @returns {boolean} */
function hasSourceFiles(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return false;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      if (hasSourceFiles(join(dir, entry.name))) return true;
      continue;
    }
    const name = entry.name;
    if (name.endsWith(DECLARATION_SUFFIX)) continue; // .d.ts không cần tsc gate
    if (SOURCE_EXT.some((ext) => name.endsWith(ext))) return true;
  }
  return false;
}

/** @type {string[]} */
const offenders = [];

for (const group of WORKSPACE_DIRS) {
  const groupPath = join(ROOT, group);
  let pkgDirs;
  try {
    pkgDirs = readdirSync(groupPath);
  } catch {
    continue;
  }
  for (const pkgName of pkgDirs) {
    const pkgPath = join(groupPath, pkgName);
    if (!statSync(pkgPath).isDirectory()) continue;

    const manifestPath = join(pkgPath, "package.json");
    let manifest;
    try {
      manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    } catch {
      continue; // không phải package có manifest
    }

    // Scan TOÀN package (không chỉ src/) — apps dùng Next để source ở app/ +
    // next.config.ts ở root, không có src/. Config package (typescript/eslint/
    // tailwind-config) có 0 file .ts/.tsx nên vẫn bị skip đúng.
    if (!hasSourceFiles(pkgPath)) continue; // skeleton rỗng — bỏ qua
    if (manifest.scripts?.["check-types"]) continue; // đã có gate

    offenders.push(
      `${manifest.name ?? `${group}/${pkgName}`} (${group}/${pkgName})`,
    );
  }
}

if (offenders.length > 0) {
  console.error(
    "✗ Type-coverage gate: các package sau CÓ source .ts/.tsx nhưng THIẾU script `check-types`,\n" +
      '  nên turbo sẽ bỏ qua type-check chúng âm thầm. Thêm `"check-types": "tsc --noEmit"`\n' +
      "  (kèm tsconfig.json extends @landing/typescript-config + devDep typescript):\n" +
      offenders.map((o) => `    - ${o}`).join("\n"),
  );
  process.exit(1);
}

console.log(
  "✓ Type-coverage gate: mọi package có source đều khai báo `check-types`.",
);
