# [PLAN REVIEW — epics.md: landing-page-list Epic Breakdown]

**Reviewed:** 2026-06-08  
**Reviewer:** plan-reviewer subagent  
**Codebase state:** root monorepo chưa tạo — codebase hiện tại là single Next.js app tại `/` với `src/`, `package.json` (npm), không có `apps/`, `packages/`, `pnpm-workspace.yaml`, `turbo.json`.

---

## EXECUTABLE: Partial

**Lý do:** 1 HIGH blocker (Story 1.2 — create-turbo xung đột file) và 1 HIGH false-premise (Story 1.1 — Gate-0 WIP đã committed). Các epic còn lại có chuỗi phụ thuộc đúng và reference hợp lệ. Có thể bắt đầu sau khi fix 2 HIGH.

---

## Blockers

- [H1] Story 1.1: precondition "dirty files exist" FALSE tại HEAD hiện tại — WIP đã committed trong b578a31
- [H2] Story 1.2: `create-turbo@latest .` vào root có sẵn `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs` — file conflict không được xử lý tường minh

---

## 🟠 HIGH (2)

### [H1] Story 1.1 Gate-0 — precondition sai, WIP đã committed

**Epic/Story:** Epic 1, Story 1.1  
**Mô tả:** Story nói _"Given repo có dirty files (PixelBlast.tsx, hero-crystal.tsx, ternus-hero.tsx, ternus.css, ternus-netstrip.tsx)"_. Thực tế: `git status` tại HEAD chỉ có untracked `.playwright-mcp/` logs và `_bmad-output/planning-artifacts/epics.md`. Tất cả WIP v20 đã được commit trong b578a31 `"feat(ternus): v20 WIP, planning artifacts, and architecture docs"`. File `src/templates/ternus/components/{ternus-hero,hero-crystal,ternus-netstrip}.tsx` và `src/templates/ternus/ternus.css` đều đã tracked.

**Evidence:**

```
git log --oneline -1
# b578a31 feat(ternus): v20 WIP, planning artifacts, and architecture docs

git status --short
# ?? .playwright-mcp/...  (untracked, không phải dirty)
# ?? _bmad-output/planning-artifacts/epics.md
```

**Rủi ro:** Agent đọc Given condition → kiểm tra git status → không thấy dirty files → không hiểu phải làm gì; hoặc tạo empty commit sai format Gate-0.

**Fix:** Sửa Story 1.1 thành gate-check: "Verify WIP v20 đã được snapshot trong commit Gate-0 (grep commit log tìm `gate-0` hoặc `v20 WIP`). Nếu chưa có → commit `git add -A && git commit -m 'chore: gate-0 snapshot …'`. Nếu đã có → skip, proceed Story 1.2."

---

### [H2] Story 1.2 — `create-turbo` vào root có existing files không có conflict resolution

**Epic/Story:** Epic 1, Story 1.2  
**Mô tả:** Sau khi `git mv src/* _legacy-src/`, root vẫn còn: `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next-env.d.ts`. Lệnh `pnpm dlx create-turbo@latest . -m pnpm -e with-tailwind --skip-install` sẽ cố tạo scaffold vào thư mục có sẵn các file này. Hành vi của create-turbo khi target dir không rỗng (overwrite? error? prompt?) không được documented trong story. Architecture doc chỉ note "reconcile nếu scaffold ship version khác" nhưng không có bước xử lý cụ thể trong AC.

**Evidence:**

```
ls /landing-page-list/
# package.json  next.config.ts  tsconfig.json  eslint.config.mjs
# postcss.config.mjs  next-env.d.ts  package-lock.json  (+ assets)
```

Sau `git mv src/* _legacy-src/`, các file trên VẪN tồn tại ở root.

**Rủi ro:** create-turbo ghi đè `package.json` (mất version pins next@16.2.7, react@19.2.4) hoặc fail với lỗi "directory not empty". Nếu overwrite, Story 1.2 AC "pin next@16.2.7, react@19.2.4" sẽ cần re-apply thủ công.

**Fix:** Thêm vào Story 1.2 AC một bước tường minh: trước khi chạy create-turbo, backup hoặc xoá các file config sẽ bị ghi đè (`rm -f package.json next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs next-env.d.ts`), vì chúng sẽ được thay thế bởi monorepo equivalents. Sau create-turbo, re-apply pins. Ghi rõ: "create-turbo sẽ ghi đè package.json — đây là expected; reconcile sau bằng version pins."

---

## 🟡 MEDIUM (5)

### [M1] Story 5.2 — Location Memecoin hero section mơ hồ

**Epic/Story:** Epic 5, Story 5.2  
**Mô tả:** AC viết _"tạo hero+ticker section trong `packages/templates-memecoin/` **hoặc** `packages/sections/`"_. Hai location khác nhau về semantics: `packages/sections/` = reusable isolated section; `packages/templates-memecoin/` = template-internal component. Epics 6, 7 đặt section trong `packages/sections/src/gamefi-hero/` và `packages/sections/src/nft-gallery-grid/` — Memecoin nên nhất quán.

**Fix:** Xóa "hoặc", chốt: `packages/sections/src/memecoin-hero/` (nhất quán với GameFi hero tại `packages/sections/src/gamefi-hero/` ở Story 6.1).

---

### [M2] Story 3.1 — Plan file `ternus-v20-port.md` có stale file paths

**Epic/Story:** Epic 3, Story 3.1  
**Mô tả:** Story 3.1 chỉ dẫn agent thực hiện theo `docs/plans/2026-06-07-ternus-v20-port.md`. Plan này được viết trước migration, dùng paths tiền-monorepo:

- `src/templates/ternus/components/ternus-hero.tsx`
- `src/templates/ternus/ternus.css`
- `src/components/pixel-blast/PixelBlast.tsx`

Sau Epic 1, các file move sang:

- `packages/templates-ternus/src/components/ternus-hero.tsx`
- `packages/templates-ternus/src/ternus.css`
- `packages/ui/src/pixel-blast/PixelBlast.tsx`

Story 3.1 nói "hoàn thiện trong `packages/templates-ternus/src/`" nhưng agent theo plan chi tiết (Task 1-9 với verify commands) sẽ chạy commands sai path (`grep -c "JetBrains_Mono" src/templates/ternus/template.tsx` → file not found).

**Fix:** Thêm note vào Story 3.1: "Plan `ternus-v20-port.md` dùng paths pre-migration. Thay `src/templates/ternus/` → `packages/templates-ternus/src/` và `src/components/pixel-blast/` → `packages/ui/src/pixel-blast/` trong mọi verify command."

---

### [M3] Story 8.3 — "2–3 UI mới" không có spec

**Epic/Story:** Epic 8, Story 8.3  
**Mô tả:** AC chỉ nói "scaffold 2–3 UI mới" với tiêu chí chung (< 400 dòng, export pieceMeta, stack tag). Không có component cụ thể, không có file paths, không có visual reference. Agent có toàn quyền chọn bất kỳ component, rủi ro inconsistency về quality bar và aesthetic.

**Fix:** List ít nhất 2 candidate components với tên tentative (ví dụ: `aurora-text`, `typewriter-heading`, `count-up-stats`), theme mood phù hợp, và animation lib mong muốn. Giữ slot thứ 3 flexible.

---

### [M4] Story 1.3 — Relative path cho tsconfig alias không explicit

**Epic/Story:** Epic 1, Story 1.3  
**Mô tả:** AC nói: `apps/docs/tsconfig.json` có alias `@landing/templates/ternus` → `packages/templates-ternus/src`. Từ góc độ `apps/docs/tsconfig.json`, relative path thực tế là `../../packages/templates-ternus/src`. Không ghi rõ path relative hay absolute, agent có thể viết sai.

**Fix:** Thêm concrete tsconfig snippet:

```json
{
  "paths": {
    "@landing/templates/ternus": ["../../packages/templates-ternus/src"]
  }
}
```

Và note: path tính từ thư mục chứa tsconfig.json (apps/docs/).

---

### [M5] Turbo version không được pin trong Story 1.2

**Epic/Story:** Epic 1, Story 1.2  
**Mô tả:** Architecture doc chỉ rõ `Turborepo 2.9.x` nhưng Story 1.2 AC chỉ pin `next@16.2.7`, `react@19.2.4`, `tailwindcss@^4`. create-turbo@latest có thể ship turbo 3.x với breaking changes (ví dụ: `turbo.json` schema v2→v3 thay đổi task format).

**Fix:** Thêm vào AC: `pnpm add -D turbo@^2.9 -w` sau install, hoặc pin `turbo: "^2.9"` trong root `package.json` devDependencies.

---

## ⚪ LOW (2)

### [L1] Registration task number #3 trùng giữa Epic 6 và Epic 7

**Epic/Story:** Story 6.3 và Story 7.3  
**Mô tả:** Story 6.3 nói "registration task #3" và Story 7.3 cũng nói "registration task #3 merge". Sẽ gây nhầm lẫn khi Epic D owner thực hiện merge serial.

**Fix:** Rename: Epic 6 Story 6.3 = "registration task #3 (GameFi)", Epic 7 Story 7.3 = "registration task #4 (NFT)". Cập nhật Story 8.4 thành "#5 (UI batch)".

---

### [L2] Architecture `FR → Structure Mapping` table dùng path nested không nhất quán

**Epic/Story:** architecture.md (tham chiếu từ epics.md)  
**Mô tả:** Table "FR → Structure Mapping" trong architecture.md dùng `packages/templates/ternus` (nested) trong khi epics.md và Project Directory Structure dùng `packages/templates-ternus/` (flat). Không ảnh hưởng epics vì epics tự nhất quán.

**Fix:** Sửa table trong architecture.md: `packages/templates/ternus` → `packages/templates-ternus/src`.

---

## ✅ POSITIVE (5)

### [P1] pieceMeta + serial registration pattern — parallelization an toàn

Mỗi epic chỉ export `pieceMeta` trong package của mình; Epic D owner merge vào catalog serial. Loại bỏ hoàn toàn file collision risk trên `lib/catalog/index.ts`.

### [P2] FR Coverage Map đầy đủ và truy xuất được

Bảng FR → Epic mapping ở đầu file cho phép truy ngược requirement nhanh. Mọi FR-0 đến FR-13 đều có epic chủ sở hữu rõ ràng.

### [P3] Invariant bar định nghĩa sớm và nhất quán

Tiêu chí pass (spacing 4/8px grid, named easing, cấm `transition: all`, useReducedMotion bắt buộc) được reference trong acceptance criteria của mọi section-level story — giảm ambiguity cho agent.

### [P4] Dependency chain giữa các epic đúng thứ tự

"Given" clauses trace đúng: Epic 3 requires Epic 1+2; Epic 4 requires Epic 1+2; Epic 5 requires Epic 2+3; Epic 6/7 require Epic 2; Epic 8 requires monorepo; Epic 9 requires all epics merged. Không phát hiện circular dependency.

### [P5] Ternus v20-port plan tồn tại và đủ chi tiết

`docs/plans/2026-06-07-ternus-v20-port.md` tồn tại ✅ với 9 task có file paths, decision, build steps, và verify commands — đủ để agent tự thực thi khi đã apply path correction (xem M2).

---

## Reference Verification Summary

| Ref được claim trong epics                            | Tồn tại?      | Ghi chú                                          |
| ----------------------------------------------------- | ------------- | ------------------------------------------------ |
| `src/templates/ternus/` (migration source)            | ✅            | Confirmed tại `src/templates/ternus/`            |
| `src/components/{pixel-blast,logo-loop,soft-aurora}/` | ✅            | Confirmed tại `src/components/`                  |
| `src/lib/types.ts`                                    | ✅            | Confirmed                                        |
| `docs/plans/2026-06-07-ternus-v20-port.md`            | ✅            | Confirmed                                        |
| `src/app/(demos)/example/` (sẽ DELETE)                | ✅            | Confirmed tại `src/app/(demos)/example/page.tsx` |
| `apps/`, `packages/`, `pnpm-workspace.yaml`           | ❌ (expected) | Chưa tạo — sẽ tạo trong Epic 1                   |
| `packages/design-tokens/src/themes/*.css`             | ❌ (expected) | Chưa tạo — sẽ tạo trong Epic 2                   |
| `packages/templates-ternus/src/config.ts`             | ❌ (expected) | Chưa tạo — sẽ tạo sau migrate                    |
| `apps/docs/lib/catalog/types.ts`                      | ❌ (expected) | Chưa tạo — Epic 4                                |
| `apps/docs/components/FilterBar.tsx`                  | ❌ (expected) | Chưa tạo — Epic 9                                |

_Tất cả "expected missing" đều nằm trong các epic sẽ tạo chúng — không phải hard ref lỗi._

---

## Summary Table

| Severity    | Count |
| ----------- | ----- |
| 🟠 HIGH     | 2     |
| 🟡 MEDIUM   | 5     |
| ⚪ LOW      | 2     |
| ✅ POSITIVE | 5     |

**EXECUTABLE: Partial**

Fix 2 HIGH blockers trước khi giao Epic 1 cho agent:

1. **H1** — Sửa Story 1.1 thành gate-check có điều kiện (not mandatory commit)
2. **H2** — Thêm bước xóa/backup existing root config files trước khi chạy `create-turbo`

Các MEDIUM có thể fix inline khi agent bắt đầu story tương ứng, nhưng M2 (stale paths) nên fix trước khi giao Epic 3.
