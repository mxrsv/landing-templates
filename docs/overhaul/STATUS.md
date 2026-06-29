# Overhaul — STATUS (spine)

> **Đây là source-of-truth tiến độ mới, thay `_bmad-output/.../sprint-status.yaml`** (đợt agent-driven, 2026-06-29).
> Spine file-based. Orchestrator (Claude/`Project Shepherd`) cập nhật file này; specialist agents đẻ draft, merge vào đây.
> Plan đầy đủ: [`01-roadmap.md`](./01-roadmap.md) · State: [`00-baseline.md`](./00-baseline.md).

## Governance đã chốt

- **Harness chủ:** `.claude` (#19). Các `.codex`/`.cursor`/`.conductor`/`.gstack` → read-only/gỡ dần.
- **Spine:** file-based (`docs/overhaul/STATUS.md`), KHÔNG dùng tool ngoài (#5).
- **BMAD:** CHƯA xoá. Chỉ `git rm -r _bmad _bmad-output` SAU khi di trú ràng buộc FR-10/NFR-9 (manifest budget) vào code+INVARIANT.

## Trạng thái: `backlog → in-progress → review → done`

### Phase 0 — Baseline & governance — **done**

- [x] 3 audit (technical/business/UI)
- [x] `00-baseline.md`, `01-roadmap.md`
- [x] `STATUS.md` (spine) + chốt harness chủ

### Phase 1 — Foundation fix — **done**

- [x] **#17 Fix bug token đông cứng** — **done** — `@layer tokens.floor/tokens.theme` + derived block trên `:root,[data-theme]` ở `base.css`; gỡ workaround neon, dọn chrome (giữ 2 token custom). Build 19/19 exit 0, cascade verified game→lime/nft→violet. ⚠️ Shell chrome: `--btn-bg`/badge giờ ăn warm-zinc đúng (cải thiện, nên eye-check khi tiện).
- [x] #14 Mở rộng token floor — **done** — +16 token (`--shadow/blur/z/radius-xl` ở `:root`; `--glow/gradient` ở `:root,[data-theme]`). INVARIANT vocab cập nhật. ❌ `--font-mono` ĐÃ GỠ (2026-06-29 user reject 2-face → giữ single-face Inter).
- [x] #15 Nới gate `manifest.ts` — **done** — `EXACT===5`→floor mềm `MIN_TEMPLATES=4`; cap 17→`SOFT=16` (warn) + `HARD=32` (throw runaway); provenance FR-10/Glossary/SM-C1 di trú vào comment + INVARIANT. (Sau Phase 2 catalog=14 → hết warn.)
- [x] #18 Rút `_bmad*` — **done** (2026-06-29) — `git rm -r _bmad _bmad-output` (59 file); ràng buộc đã di trú vào manifest.ts comment + INVARIANT trước khi xoá.

### Phase 2 — Business clarity — **done** (ratified 2026-06-29)

- [x] Discovery 2 lens (Trend + PM) → `02-business.md`. Hai lens bất đồng identity nhưng GIAO NHAU ở near-term.
- [x] **B1** cắt `aikit` khỏi catalog (manifest+registrations; giữ source + `/aikit-preview` làm harvest) — build 19/19, total 17→14.
- [x] **B2** gỡ 2 slug NFT vapor (`nft-gallery-grid`,`mint-countdown`) khỏi manifest; mood `nft` reserved.
- [x] **B4/B5** schema: `PieceMood` +`defi`; thêm `PieceStatus` + `status?` (default `production`, gamefi=`draft`) + `offSystem?`; validation cập nhật. ⏳ Gallery FILTER theo `status` = việc Phase 3.
- [x] **B6** identity = trục **craft/assembly/no-lock-in**, Web3 = beachhead, optionality giữ (chưa khoá Web3-only).
- **B3** (decision): productionize **Helix** làm flagship restaking duy nhất; **shelve Strata** → xem Phase 4 #3.

### Phase 3 — Technical hardening — **in-progress**

- [x] #11 Sửa shell routing drift — **done** — Explorer đọc `?layer` (spec §6 unified explorer): `/sections`,`/ui`,`/templates` lọc đúng layer; sidebar hiện mọi piece production nhóm theo Layer. Build 19/19.
- [x] #13 Gallery FILTER theo `status` — **done** — gallery + nav chỉ `status="production"`; gamefi (draft) ẩn khỏi BROWSE nhưng deep-link `/?piece=gamefi` vẫn mở detail.
- [ ] #7 Retrofit Ternus về token floor (gỡ font/CSS bespoke, dùng primitives)
- [x] #10 CI tối thiểu — **done** — `.github/workflows/ci.yml`: lint + build (gồm type-coverage + check-types + SSG mọi `/preview/[slug]`) + smoke runtime curl routes. Lint local 8/8 sạch, build 19/19.

### Phase 4 — UI/Design overhaul — **backlog**

- [ ] #12 Harvest 2 skin off-floor (`--wl-*`, `--ak-*`) + gỡ font lậu
- [ ] #8 Vực GameFi qua Production Bar
- [ ] #6 Build NFT thật (mood reserved; tái dùng focal `glass-shape`/`artifact-surface`) — B2
- [ ] #4 Smooth-scroll + scroll-orchestration chung
- [ ] #3 Productionize **Helix** (flagship restaking); **Strata shelved** (harvest caustics) — B3
- [ ] Eye-review gate per template (screenshot full-page)

### Phase 5 — Hợp nhất & đóng — **backlog**

- [ ] Re-run gate · update CONTEXT/INVARIANT/PRODUCTION-BAR · retro · xoá `_bmad*`

## Quyết định còn mở (chủ repo)

1. Web3-only vs tổng quát · 2. NFT build/cut · 3. Lane Helix/Strata thay aikit?
   (Harness chủ + spine đã chốt ở trên.)

_Cập nhật: 2026-06-29 — Phase 1 mở, #17 đang chạy._
