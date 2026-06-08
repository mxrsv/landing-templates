---
title: Epics Adversarial Review — landing-page-list
reviewer: skeptical PM + tech lead
date: 2026-06-08
inputs:
  - _bmad-output/planning-artifacts/epics.md
  - _bmad-output/planning-artifacts/prds/prd-landing-page-list-2026-06-08/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/parallel-dev-strategy.md
method: cynical/adversarial — hunt gaps, untestable AC, scope creep, ordering, holes
---

# Epics Adversarial Review

**Verdict:** Epics **đủ để bắt đầu Wave 0–1**, nhưng **chưa an toàn cho parallel Wave 2+** nếu không vá 3 blocker (Gate-0, `packages/sections` scaffold, FR-10 counting) và 2 gap UX (price-ticker, `/sections` registration).

**Tổng findings:** 4 🔴 CRITICAL · 9 🟠 HIGH · 11 🟡 MEDIUM · 6 ⚪ LOW · 3 ✅ mitigated

---

## Executive Summary (Tiếng Việt)

Epic breakdown bám khá sát PRD/architecture và parallel-dev-strategy — Gate-0, rename `@landing/*`, registration pattern, `copyMode`, wave ordering đều có story. Tuy nhiên, góc nhìn adversarial phát hiện **lỗ hổng cấu trúc monorepo**: Epic 1 không scaffold `packages/sections` và các `packages/templates-*` mới, trong khi Epic 5–7 giả định chúng đã tồn tại. **FR-10 bị hiểu sai layer**: Story 8.3 đếm ≥8 chỉ ở `/ui`, trong khi PRD định nghĩa "8–10 UI/sections **tổng cộng**" — nếu ship theo AC hiện tại có thể over-build templates hoặc under-count catalog. **FR-11 `/sections` layer gần như hollow**: Memecoin/GameFi/NFT sections có story build nhưng thiếu AC bắt buộc `pieceMeta` + registration + preview route — Alex (UJ-1) filter `/sections` sẽ thấy catalog trống. **Gate-0 vẫn unchecked** trong pre-epics checklist; Story 1.5 yêu cầu Ternus "tương đương demo cũ" trong khi v20 hoàn thiện ở Epic 3 — gate Wave 0 mơ hồ. **Không có UX doc**; price-ticker micro-spec (parallel-dev §7) vẫn open — Story 5.1 untestable về API. FR-14 được giữ ngoài MVP đúng; không thấy scope creep CLI.

---

## 🔴 CRITICAL

### C1 — `packages/sections` và template packages mới không được scaffold trong Epic 1

**Epic/Story:** Epic 1 (1.3, 1.4) vs Epic 5–7 (5.2, 6.1, 7.1)

**Finding:** Story 1.3 rename liệt kê `@landing/sections` nhưng Story 1.4 migration map chỉ move `ui` + `templates-ternus`. Không story nào tạo `packages/sections/`, `packages/templates-memecoin/`, `packages/templates-gamefi/`, `packages/templates-nft/` hoặc thêm vào `pnpm-workspace.yaml`.

**Impact:** Agent Epic 5 chạm path chưa tồn tại → phải tự scaffold shared file (workspace yaml) → **vi phạm lane ownership** (chỉ Epic A được sửa root config).

**Fix:** Thêm Story 1.3b hoặc mở rộng 1.4: empty package scaffold + `workspace:*` deps + verify `pnpm --filter @landing/sections build` exit 0.

---

### C2 — FR-10 counting sai layer; risk over/under ship SM-1

**Epic/Story:** Epic 8 (8.3, 8.4) · Epic 9 (9.4)

**Finding:**

- PRD FR-10 / MVP DoD: **"≥8 UI/sections tổng cộng"** (combined), NFR-9 cap **8–15 pieces**.
- Story 8.3 AC: _"catalog đạt ≥8 UI/sections"_ nhưng chỉ scaffold trong `packages/ui/src/<new-name>/`.
- Story 9.4: _"≥8 catalogued pieces"_ không định nghĩa đếm templates/sections/UI riêng hay gộp.

**Count thực tế nếu ship all stories:** ~6–7 UI + ~7 sections + 4 templates = **17+ entries** — vượt scope guard; hoặc agent chỉ đăng ký UI → **<8 total** dù có đủ sections.

**Impact:** SM-1 / FR-10 pass/fail không deterministic; agent có thể chase số lượng UI thay vì curated depth.

**Fix:** Một story "Catalog manifest & piece budget" — liệt kê canonical 8–12 slugs across layers; AC đếm `allPieces.length` trong range; tách FR-10 khỏi Epic 8-only.

---

### C3 — FR-11 `/sections` layer: build stories không có registration/preview AC

**Epic/Story:** Epic 5 (5.2, 5.4) · Epic 6 (6.1, 6.2) · Epic 7 (7.1, 7.2) · Epic 4 (4.3)

**Finding:** FR-11 yêu cầu `/sections` index + detail preview. Chỉ Story 5.3 và 6.2 mention `export pieceMeta`; 5.2, 5.4, 7.x không. Không registration task riêng cho sections (chỉ template-level 5.5, 6.3, 7.3). UJ-1: Alex vào `/sections`, filter memecoin — **sẽ fail**.

**Impact:** Gallery ship với `/sections` trống hoặc chỉ template routes — **functional gap vs PRD**.

**Fix:** Mỗi section story thêm: `pieceMeta` + `layer: "section"` + AC `/sections/<slug>` render; registration task #2b sau Epic 5 (serial, Epic D owner).

---

### C4 — Gate-0 chưa done; Story 1.5 vs Epic 3 conflict về Ternus readiness

**Epic/Story:** Epic 1 (1.1, 1.5) · Epic 3 (3.1) · parallel-dev §7 pre-epics

**Finding:**

- Pre-epics checklist: `[ ] Gate-0 commit` — **chưa xong** khi epics đã written.
- Story 1.5: `/templates/ternus` **"render tương đương demo cũ"** tại cuối Epic 1.
- Architecture/parallel-dev: WIP v20 **hoàn thiện ở Epic B (Epic 3)**, Epic A chỉ migrate nguyên trạng.

**Impact:** Wave 0 gate không rõ pass criteria — incomplete v20 có pass Epic 1 không? Agent Epic 1 có scope creep hoàn thiện v20 không?

**Fix:** Story 1.5 đổi AC: _"render không crash; visual parity = pre-migration baseline (WIP OK); Fuel/Monad bar = Epic 3 gate"_. Block mọi wave cho đến Story 1.1 done.

---

## 🟠 HIGH

### H1 — NFR không map story: CI, deploy, package boundaries

**Epic/Story:** FR-1 (CI build) · NFR-2 · NFR-8

**Finding:**

- FR-1 consequences: **"CI build pass"** — không story CI/`turbo run lint` trong pipeline.
- NFR-8 Vercel static hosting — zero story deploy/smoke production URL.
- NFR-2: không AC `grep` import ngược `apps/docs` từ packages.

**Fix:** Story 1.6 minimal CI hoặc note explicit defer; Story 9.5 boundary grep; deploy = post-MVP ghi rõ trong epic header.

---

### H2 — Registration task numbering mâu thuẫn

**Epic/Story:** 6.3 · 7.3 · 8.4 · parallel-dev §5 Wave 4–5

**Finding:** Story 6.3 và 7.3 **cùng** "registration task #3". Parallel-dev: #3 = E∥F merge, #4 = UI. Agent không biết merge order.

**Fix:** Renumber: #2 Memecoin, #3 GameFi, #4 NFT, #5 UI — hoặc một story Epic 9.0 "Registration sweep" gom tất cả.

---

### H3 — Story 5.1 price-ticker: thiếu UX micro-spec → untestable API

**Epic/Story:** Epic 5 (5.1) · parallel-dev §7 `[ ] UX micro-spec price-ticker`

**Finding:** AC có modes marquee/slot nhưng không có props `{ mode, tokens, interval }`, data shape giá, flash mode deferred nhưng prop union vẫn có `flash`. Agent sẽ đoán API — SM-3 paste-into-fresh-Next.js at risk.

**Fix:** Attach micro-spec vào Story 5.1 Given clause; AC thêm render với mock `{ price, change24h }`.

---

### H4 — Epic 4 (Wave 2) vs Epic 3 pieceMeta dependency underspecified

**Epic/Story:** 3.3 · 4.5 · 4.3

**Finding:** Story 4.3 tạo dynamic routes trước khi catalog có pieces. Story 4.5 cần Ternus pieceMeta nhưng không AC cho **empty state** khi Wave 2 B chưa merge. Story 4.3 "Piece không tồn tại → 404" — OK — nhưng index pages với 0 items không có UX spec.

**Fix:** AC empty catalog state; registration #1 là **hard gate** trước demo Wave 2 complete.

---

### H5 — Memecoin hero location ambiguous (`templates-memecoin` vs `sections`)

**Epic/Story:** 5.2

**Finding:** AC: _"tạo hero+ticker section trong `packages/templates-memecoin/` hoặc `packages/sections/`"_ — hai package layers khác nhau cho cùng FR-7 section. Ảnh hưởng `layer` metadata, copy `copyMode`, `/sections` vs template-only.

**Fix:** Chốt một path: sections → `packages/sections/`; template compose → `templates-memecoin`.

---

### H6 — SM-3 / SM-2 không có story acceptance

**Epic/Story:** PRD §7 · Epic 9

**Finding:** SM-3 (paste Memecoin hero vào fresh Next.js <30 phút) và SM-2 (3 moods visually distinct) không map story. Epic 9.3 audit invariant không cover aesthetic blind test hay consumer paste.

**Fix:** Story 9.5 manual smoke script hoặc checklist SM-2/SM-3; ghi `[ASSUMPTION: human QA]`.

---

### H7 — `packages/ui build` trong Epic 1 — package có build script?

**Epic/Story:** 1.4

**Finding:** AC `pnpm --filter @landing/ui build` — create-turbo `with-tailwind` có thể không ship build script cho ui package; có thể false-fail Wave 0.

**Fix:** AC fallback: `pnpm build` root only, hoặc story explicit thêm `tsup`/`tsc` nếu cần.

---

### H8 — Filter chỉ Epic 9; PRD UJ-1 mid-sprint discovery degraded

**Epic/Story:** Epic 9 (9.1–9.2) vs PRD UJ-1

**Finding:** Alex journey assumes filter on `/sections` early. Filters last — **acceptable MVP** nếu conscious; nhưng epic list không flag "filters = week 2 only" cho stakeholder.

**Fix:** Epic 9 header note dependency; optional Story 4.6 stub FilterBar disabled = out of scope.

---

### H9 — Theme count vs PRD MVP "3 theme variants live"

**Epic/Story:** 2.2 · PRD §6.1

**Finding:** Story 2.2 ships 4 themes including `nft` placeholder. PRD MVP table: **"3 theme variants live"**. NFT placeholder có thể interpret as 4th — minor PRD/epic drift.

**Fix:** Clarify MVP = 3 live + 1 placeholder skeleton; AC `nft` marked non-live in docs.

---

## 🟡 MEDIUM

### M1 — Story 3.1 sections list vague ("hero, netstrip, ecosystem, v.v.")

**Epic/Story:** 3.1

**Finding:** Không enumerate sections từ v20 port plan — untestable "đầy đủ".

**Fix:** Link checklist file §sections với tick list cụ thể.

---

### M2 — Subjective visual AC không machine-verifiable

**Epic/Story:** 3.1, 3.2, 5.2, 6.1, 6.3 ("visual distinct")

**Finding:** "Fuel/Monad bar", "polished như monad.xyz", "HUD aesthetic" — agent không biết pass/fail.

**Fix:** Chuyển sang checklist cụ thể từ INVARIANT.md + screenshot manual gate.

---

### M3 — Story 8.3 "2–3 UI mới" — không chọn slugs

**Epic/Story:** 8.3

**Finding:** Agent sẽ invent components — có thể trùng scope hoặc low value.

**Fix:** PRD/brainstorm pick 2 slugs (e.g. `glow-button`, `stat-counter`) hoặc story spike 8.0.

---

### M4 — NFR-7 chỉ explicit ở 3.2, 8.1 — Story 8.3 new UI thiếu

**Epic/Story:** 8.3

**Finding:** Nếu new UI dùng WebGL, thiếu ErrorBoundary AC.

**Fix:** Template AC: "if stackTags includes webgl → ErrorBoundary".

---

### M5 — Copy section multi-file behavior không story-level

**Epic/Story:** 4.4 · architecture Format Patterns

**Finding:** Architecture: section >1 file → tabbed viewer. Không story nào scaffold multi-file section để test path.

**Fix:** Note in 5.5 hoặc defer; risk low if all sections single-file.

---

### M6 — Epic 2.2 "docs app demo switch theme trên 1 test page" — không cleanup story

**Epic/Story:** 2.2

**Finding:** Test page có thể ship to production gallery — UX cruft.

**Fix:** AC: test page under `/dev/theme-switch` hoặc xoá trước Epic 4.

---

### M7 — Thumbnail vs inline preview — inconsistent AC

**Epic/Story:** 4.3 · 8.4

**Finding:** "thumbnail **hoặc** inline preview" — agent pick arbitrary; gallery consistency risk.

**Fix:** Chốt một pattern trong Story 4.3.

---

### M8 — `flash` price-ticker mode in prop union but MVP excludes it

**Epic/Story:** 5.1 · FR-7

**Finding:** Prop `mode: 'marquee' | 'slot' | 'flash'` nhưng MVP chỉ marquee+slot — agent có thể build flash = scope creep week 1.

**Fix:** AC: `flash` throws or no-op with `// TODO week 2` only.

---

### M9 — Story 1.1 file paths không fully qualified

**Epic/Story:** 1.1

**Finding:** Lists `PixelBlast.tsx` not `src/components/pixel-blast/PixelBlast.tsx` — agent Gate-0 có thể miss files.

**Fix:** Mirror parallel-dev Patch 4 paths exactly.

---

### M10 — No `lint` story despite turbo pipeline defining lint

**Epic/Story:** 1.2

**Finding:** `turbo.json` lint task defined; no story verifies `pnpm lint` pass.

**Fix:** Add to 1.5 or 9.4.

---

### M11 — UJ-3 mood comparison — no gallery UX story

**Epic/Story:** PRD UJ-3 · Epic 4.1

**Finding:** Visitor compare templates by mood — relies on Epic 9 filters + `/templates` index. No side-by-side or featured mood grouping in Epic 4.

**Fix:** Story 4.1 AC: templates index group by `mood` tag (pre-filter).

---

## ⚪ LOW

### L1 — FR-14 boundary: ✅ clean

**Finding:** FR-14 explicitly unmapped; no CLI/registry stories. Copy multi-file là gallery UX, không phải `npx add` — **no violation**.

---

### L2 — Epic numbering vs wave letters (A/T/B/D/C/E/F/G/I) — cognitive load

**Finding:** Epics 1–9 map OK to parallel strategy nhưng docs dùng cả "Epic D" và "Epic 4" — dispatch packet confusion.

**Fix:** Glossary table in epics header.

---

### L3 — Story 2.3 creates INVARIANT.md but FR-4 wants enforcement at publish — no linter

**Finding:** Doc-only enforcement; relies on Epic 9 grep — acceptable per PRD but brittle.

---

### L4 — Legacy redirect only Story 1.5 — OK

**Finding:** No duplicate redirect stories elsewhere. ✅

---

### L5 — `_legacy-src` delete timing — single owner Story 1.5 ✅

---

### L6 — PRD typo "tách riê" — epics không inherit ✅

---

## UX Gaps (No UX Document)

| Gap                                                 | Severity | Epic impact     |
| --------------------------------------------------- | -------- | --------------- |
| Không có UX doc riêng (epics L68 ghi nhận)          | 🟠       | Toàn bộ gallery |
| Price-ticker props/API/modes (parallel-dev §7 open) | 🟠       | 5.1             |
| Filter UI: sidebar vs top bar (PRD IA)              | 🟡       | 9.1             |
| Mobile gallery/browse priority (PRD Q#6)            | 🟡       | 4.1, 4.4        |
| Empty catalog / empty filter results                | 🟡       | 4.3, 9.1        |
| Template multi-file copy UX (tabs/tree)             | 🟡       | 4.4             |
| Theme demo page cruft (2.2)                         | 🟡       | 2.2             |
| Section detail layout (metadata + preview order)    | 🟡       | 4.3             |
| Thumbnail strategy                                  | 🟡       | 4.3, 8.4        |

**Recommendation:** Tối thiểu 1-page UX micro-spec (`_bmad-output/planning-artifacts/ux-gallery-mvp.md`) cover: FilterBar placement, PieceCard layout, CopyButton states, price-ticker API — **block Epic 5 Story 5.1**, không block Epic 1.

---

## FR/NFR Coverage Matrix (Adversarial)

| ID    | Mapped Epic | Gap?                                     |
| ----- | ----------- | ---------------------------------------- |
| FR-0  | Epic 1 ✅   | —                                        |
| FR-1  | Epic 1 ✅   | CI không story (H1)                      |
| FR-2  | Epic 1 ✅   | —                                        |
| FR-2a | Epic 1 ✅   | Gate-0 undone (C4)                       |
| FR-3  | Epic 2 ✅   | —                                        |
| FR-4  | Epic 2, 9   | No per-piece linter (L3)                 |
| FR-5  | Epic 2, 3   | —                                        |
| FR-6  | Epic 3 ✅   | 1.5 vs 3.1 conflict (C4)                 |
| FR-7  | Epic 5      | UX spec (H3); sections registration (C3) |
| FR-8  | Epic 6 ✅   | Section registration (C3)                |
| FR-9  | Epic 7 ✅   | —                                        |
| FR-10 | Epic 8      | **Wrong layer count (C2)**               |
| FR-11 | Epic 4      | **Sections hollow (C3)**                 |
| FR-12 | Epic 4 ✅   | SM-3 not tested (H6)                     |
| FR-13 | Epic 9 ✅   | Late vs UJ-1 (H8)                        |
| FR-14 | deferred ✅ | Clean (L1)                               |
| NFR-1 | Epic 9      | —                                        |
| NFR-2 | —           | **Unmapped (H1)**                        |
| NFR-3 | per-story   | —                                        |
| NFR-4 | Epic 1      | —                                        |
| NFR-5 | per-story   | —                                        |
| NFR-6 | Epic 9.4    | Informal/untestable                      |
| NFR-7 | partial     | 8.3 gap (M4)                             |
| NFR-8 | —           | **Unmapped (H1)**                        |
| NFR-9 | —           | **C2 budget**                            |

---

## Epic Ordering Assessment

| Check                                | Result                        |
| ------------------------------------ | ----------------------------- |
| Epic 1 serial before all             | ✅                            |
| Epic 2 (tokens) before Wave 2        | ✅                            |
| Epic 3 ∥ Epic 4 (Wave 2)             | ✅ với registration gate (H4) |
| Epic 5 after 3+4                     | ✅                            |
| Epic 8 after Epic 5 (ui lane)        | ✅ per parallel-dev           |
| Epic 9 last                          | ✅                            |
| Epic 6 ∥ Epic 7 (Wave 4)             | ✅ disjoint lanes             |
| **Package scaffold before Epic 5–7** | ❌ **C1**                     |
| **Sections catalog before ship**     | ❌ **C3**                     |

---

## Duplicate Work / Holes Summary

| Type          | Items                                                        |
| ------------- | ------------------------------------------------------------ |
| **Duplicate** | Invariant grep mỗi story + 9.3 audit — acceptable redundancy |
| **Hole**      | `packages/sections` + template packages scaffold (C1)        |
| **Hole**      | `/sections` registration cho Memecoin/GameFi/NFT (C3)        |
| **Hole**      | FR-10 canonical piece list (C2)                              |
| **Hole**      | CI/deploy/boundary NFR stories (H1)                          |
| **Hole**      | SM-2, SM-3 validation (H6)                                   |
| **Conflict**  | Registration #3 numbering (H2)                               |
| **Conflict**  | Ternus ready Epic 1 vs Epic 3 (C4)                           |

---

## Recommended Fix Order (Before Parallel Wave 2)

1. **Execute Story 1.1 Gate-0** — block everything (C4).
2. **Patch Epic 1** — scaffold empty `packages/sections`, `templates-memecoin/gamefi/nft` (C1).
3. **Patch Epic 1.5 AC** — Ternus parity = no-crash baseline, not Fuel/Monad (C4).
4. **Add catalog manifest story** — 8–12 slugs, cross-layer count (C2).
5. **Patch Epic 5–7 section stories** — `pieceMeta` + `/sections/[slug]` + registration tasks (C3).
6. **Write price-ticker UX micro-spec** — attach to 5.1 (H3).
7. **Renumber registration tasks** (H2).
8. **Optional:** `ux-gallery-mvp.md` one-pager (UX table).

---

## Positive (Không bỏ qua — epics làm đúng)

- ✅ FR-14 explicitly excluded; không CLI creep.
- ✅ Gate-0, rename `@landing/*`, in-repo `_legacy-src` có story cụ thể với commands.
- ✅ `copyMode` single/multi phân tách UI vs template.
- ✅ Registration pattern giảm catalog collision (parallel-dev R1).
- ✅ Epic G sau Epic C — `packages/ui` lane conflict resolved.
- ✅ `transpilePackages: ["@landing/*"]` early (1.3) mitigates R4.
- ✅ Wave diagram alignment với parallel-dev-strategy §5.

---

_Review complete. Không sửa epics.md — chỉ báo cáo findings cho human/agent patch._
