# Traceability Review — landing-page-list planning chain

**Ngày:** 2026-06-08
**Phạm vi:** Brainstorm → PRD → Architecture → Epics
**Phương pháp:** 4 agents song song — 3 pass "ngang" theo từng mối nối (seam) + 1 pass "dọc" xuyên 4 tài liệu.

**Tài liệu nguồn:**

1. `_bmad-output/brainstorming/brainstorming-session-2026-06-08-1726.md`
2. `_bmad-output/planning-artifacts/prds/prd-landing-page-list-2026-06-08/prd.md`
3. `_bmad-output/planning-artifacts/architecture.md`
4. `_bmad-output/planning-artifacts/epics.md`

---

## Verdict tổng

| Seam                    | Verdict            | MISSING | PARTIAL | ORPHAN cần xác nhận | Contradiction     |
| ----------------------- | ------------------ | ------- | ------- | ------------------- | ----------------- |
| A. Brainstorm → PRD     | PASS-WITH-CONCERNS | 1       | 3       | 2                   | 0                 |
| B. PRD → Architecture   | PASS-WITH-CONCERNS | 0       | 2       | 0                   | 1 (nội bộ arch)   |
| C. (PRD+Arch) → Epics   | PASS-WITH-CONCERNS | 1       | 2       | 0                   | 0                 |
| D. Vertical (cross-doc) | PASS-WITH-CONCERNS | —       | —       | —                   | 2 MAJOR, ~7 MINOR |

**Verdict tổng thể: PASS-WITH-CONCERNS.** Narrative sản phẩm nhất quán xuyên suốt 4 tài liệu — không có tài liệu nào âm thầm định nghĩa lại "sản phẩm là gì". Mọi FR (14/14) đều truy vết được tới ít nhất 1 story; backward check sạch — **0 orphan story, 0 scope creep ở tầng epic**. Vấn đề nằm ở **con số và đường dẫn**, không ở định hướng. 2 MAJOR cần xử lý trước khi giao epic cho agents dev song song.

---

## 🔄 Trạng thái xử lý (cập nhật 2026-06-08)

Toàn bộ finding "phải/nên xử lý" đã được fix và verify (grep + đọc lại file):

| Finding                    | Trạng thái         | Ghi chú fix                                                                                                                                                                                                                                                                   |
| -------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C1** path template       | ✅ RESOLVED        | PRD (`:66,101,121,127`) + architecture FR→Structure (`:372-375`) + Structure Patterns (`:273`) đổi sang `packages/templates-<slug>`. Alias key `@landing/templates/ternus` giữ `/` (hợp lệ), path trỏ dir hyphen. Grep xác nhận 0 dir `packages/templates/<slug>` còn sót.    |
| **C2** catalog count       | ✅ RESOLVED        | Chốt canonical: **UI+sections ≥ 8** (templates đếm riêng = 4) → tổng **12–16**. Gate Story 9.4 (`:834`) assert `(UI+sections) ≥ 8` AND `templates === 4` AND `allPieces ≤ 16`. Đồng bộ PRD glossary/FR-10/SM-C1 + epics NFR-9/FR-map/Story 4.6/8.4. Hết loạn 8-12/8-15/10-15. |
| **C3** sections barrel     | ✅ RESOLVED        | Chốt **wildcard subpath exports** `@landing/sections/*` → `src/*/index.tsx` (Story 1.3b `:237` + parallel rule `:68`). Mỗi section là thư mục riêng, không barrel chung → Epic 5/6/7 parallel-safe, không cần serial registration.                                            |
| **C4** FR-3 decision       | ✅ RESOLVED (user) | Decision note cross-ref brainstorm + PRD + architecture.                                                                                                                                                                                                                      |
| **G1** NFR-8 Vercel        | ✅ RESOLVED (user) | Story 9.5 mới (CI + Vercel deploy).                                                                                                                                                                                                                                           |
| **O1** showcase motivation | ✅ RESOLVED (user) | Phân biệt internal-first (contribution) vs public read-only gallery.                                                                                                                                                                                                          |
| **M6** price-ticker spec   | ✅ RESOLVED (user) | File `ux-price-ticker-micro-spec.md` mới với props API đầy đủ.                                                                                                                                                                                                                |

Còn lại nhóm cosmetic (D1/D2/M1/M2/M3/M5/M8) chưa gom — không block parallel dev.

---

## Consensus findings (nhiều agent độc lập cùng phát hiện → ưu tiên cao nhất)

### 🔴 C1 — [MAJOR] Mâu thuẫn đường dẫn package template: `packages/templates/ternus` vs `packages/templates-ternus`

**Phát hiện bởi:** Seam B (M-1), Seam C, Vertical — **triple-confirmed.**

- **Quy tắc binding** (đúng): Architecture Naming Patterns — `@landing/templates-<slug>`, "**không** dùng `/` trong package name" (`architecture.md:236, 254`); migration map dùng `packages/templates-ternus/src/` (`architecture.md:124`).
- **Vi phạm**: Architecture **tự mâu thuẫn với chính nó** — bảng **FR→Structure Mapping** lại viết `packages/templates/ternus`, `/memecoin`, `/gamefi`, `/nft` (`architecture.md:369-373`); caption cây thư mục trộn cả hai (`architecture.md:359-360`).
- **PRD sai hoàn toàn**: FR-2a dùng form nested/slash ở cả migration map target `packages/templates/ternus/src/` (`prd.md:121`) lẫn tsconfig alias `@landing/templates/ternus` → `packages/templates/ternus/src` (`prd.md:127`). Lưu ý `@landing/templates/ternus` không phải npm package name hợp lệ (scoped name không chứa `/` thứ hai) — đây mới là gốc của lỗi.
- **Epics đúng**: dùng `packages/templates-ternus/src` + alias `@landing/templates/ternus` (`epics.md:215, 249`).

**Tại sao quan trọng:** Đây là package boundary load-bearing. Agent nào đọc bảng FR→Structure của architecture sẽ scaffold sai thư mục `packages/templates/ternus`, làm hỏng `transpilePackages`, `workspace:*` resolution và tsconfig alias. npm scoped name không chứa `/` thứ hai → form gạch nối là form đúng.

**Hành động:** Patch PRD + sửa bảng FR→Structure của architecture sang form `packages/templates-<slug>` đồng nhất. Epics đã đúng, không sửa.

---

### 🔴 C2 — [MAJOR] Catalog piece-count: 4 dải số khác nhau + đổi mẫu số (có/không tính templates)

**Phát hiện bởi:** Seam A (F5), Seam C (F1), Vertical (x2) — **triple-confirmed.**

Hai vấn đề chồng nhau:

**(a) Dải số trôi qua 4 giá trị:**

- `8–10`: brainstorm DoD (`brainstorming:134`), PRD DoD (`prd.md:316`), PRD SM-1 (`prd.md:338`)
- `10–15`: brainstorm Cat#7 (`brainstorming:209`), PRD SM-C1 (`prd.md:348`)
- `8–15`: PRD glossary (`prd.md:72`) — **dải mới phát sinh ở tầng PRD, không có trong brainstorm**, epics NFR-9 (`epics.md:58`)
- `8–12`: epics Story 4.6/8.4/9.4 (`epics.md:503, 763, 833`)

**(b) Đổi mẫu số — nghiêm trọng hơn:** PRD FR-10 đếm "≥8 **UI/sections** tổng cộng", templates loại trừ (`prd.md:222`; brainstorm `:134`). Epics đổi gate thành "combined UI+sections+**templates**" (`epics.md:833, 763`) và bỏ floor UI-only ("không đếm UI-only" `epics.md:504`).

**Tại sao quan trọng:** Vì 4 templates luôn tồn tại (FR-6→9), gate `allPieces.length 8–12` có thể thỏa mãn chỉ với ~4 UI/sections — một nửa yêu cầu PRD. Build "pass QA" nhưng giao chưa tới một nửa độ sâu catalog mà PRD định. SM-1 và smoke gate Story 9.4 đang test thứ khác với điều PRD spec.

**Hành động:** Chốt 1 dải canonical duy nhất + định nghĩa rõ "UI/sections-only" hay "combined". Thêm AC enforce `(UI + sections) ≥ 8` không tính templates nếu giữ ý định PRD.

---

### 🟠 C3 — [MAJOR] `packages/sections` bị 3 epic song song cùng ghi, không có quy tắc sở hữu barrel file

**Phát hiện bởi:** Seam C (F2); Vertical chạm tới (placement, MINOR).

- Architecture mandate: "1 package path = 1 owner agent / wave" (`architecture.md:387`); Wave 4 chạy "Epic E (GameFi) ∥ Epic F (NFT)" (`architecture.md:228`).
- Nhưng Epic 5 (Story 5.2/5.4), Epic 6 (Story 6.1/6.2 → `packages/sections/src/gamefi-hero/`, `epics.md:609`), Epic 7 (Story 7.1/7.2 → `packages/sections/src/nft-gallery-grid/`, `epics.md:660`) đều ghi vào package **dùng chung** `packages/sections`.
- **Barrel chỉ được scaffold RỖNG ở Story 1.3b** (`epics.md:229` — "scaffold empty packages với `src/index.ts`"), rồi **không story nào định nghĩa cách `@landing/sections` re-export các section mới** — không có task cập nhật `packages/sections/src/index.ts` gán cho owner nào, và **chiến lược export (single barrel vs per-section subpath) không bao giờ được chốt**.
- Đối chiếu rõ: catalog `lib/catalog/index.ts` ĐÃ serial hóa qua Epic D owner (`epics.md:67, 761`), nhưng export surface của chính package `@landing/sections` thì chưa.

**Tại sao quan trọng:** Nếu `@landing/sections` dùng 1 public entrypoint (single barrel), Epic 6 và 7 trong cùng wave phải cùng edit `src/index.ts` → merge-conflict / ownership collision đúng cái mà quy tắc parallel cấm.

**Hành động:** Chốt chiến lược export. Hoặc (a) per-section subpath exports (`@landing/sections/gamefi-hero`) để né collision hoàn toàn, hoặc (b) thêm task serial barrel-registration cho sections (tương tự pattern `transpilePackages`) gán cho 1 owner.

---

### 🟡 C4 — [MAJOR→MINOR] FR-3: quyết định "Tailwind preset" của brainstorm bị đảo ngược âm thầm

**Phát hiện bởi:** Seam A (F1, MAJOR), Vertical (MINOR).

- Brainstorm P3 khóa "Both — CSS vars + **Tailwind preset** map vars ✓" (`brainstorming:76`) — quyết định parameter có dấu ✓.
- PRD FR-3 đảo thành "`@theme` block (Tailwind 4 — **không dùng preset API v3**)" (`prd.md:152`); architecture đồng thuận (`architecture.md:130`).

**Tại sao quan trọng:** Reversal là **đúng** cho Tailwind 4, nhưng không tài liệu nào ghi nhận rằng quyết định brainstorm đã bị thay thế. Ai bắt đầu từ brainstorm sẽ build sai token export.

**Hành động:** Ghi 1 dòng decision-change note. Không cần đổi hướng kỹ thuật.

---

## Coverage gaps (MISSING / PARTIAL)

| #   | Severity | Finding                                                                                                                                                                                                                                                               | Nguồn  | Ref                   |
| --- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------------- |
| G1  | MISSING  | **NFR-8 Vercel deploy/CI không có story nào triển khai.** SM-1 nói "Gallery live" nhưng không gì làm nó live; arch nêu CI `turbo run build lint` (`architecture.md:217`) nhưng epics chỉ chạy `pnpm build`/`pnpm lint` local. Có thể là bước ops out-of-band cố ý.    | Seam C | `epics.md:837`        |
| G2  | PARTIAL  | **NFR-2 boundary discipline được nêu nhưng không bao giờ gated.** Khác FR-4 (Story 9.3 grep `transition: all` → 0), không story nào grep-check "package không import ngược từ `apps/docs`". Anti-pattern liệt kê (`architecture.md:332`) nhưng dựa vào kỷ luật agent. | Seam C | `architecture.md:379` |
| G3  | PARTIAL  | **FR-10 không có slot kiến trúc.** Arch chỉ liệt kê UI đã migrate + price-ticker, không reserve placeholder cho "+2–3 UI mới"; delegate hoàn toàn cho epics (đã có Story 8.3).                                                                                        | Seam B | `prd.md:223`          |
| G4  | PARTIAL  | **FR-12 mobile copy fallback chưa đặc tả.** PRD nói "mobile fallback hiển thị code block" nhưng arch chỉ "Clipboard API desktop-primary", không mô tả `<pre>` selectable fallback. PRD tự đánh dấu nice-to-have.                                                      | Seam B | `prd.md:254`          |
| G5  | PARTIAL  | **NFR-6 FCP < 3s untestable.** Story 9.4 assert nhưng không định nghĩa công cụ đo. Kế thừa stance "informal" của PRD.                                                                                                                                                 | Seam C | `epics.md:836`        |

---

## Orphans / net-new cần human xác nhận

| #   | Severity | Finding                                                                                                                                                                                                                                                                                                                                                                      | Ref    |
| --- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| O1  | MAJOR    | **Motivation showcase/social-credit (JTBD-3) căng với stance "internal-first" của brainstorm.** PRD thêm "gallery công khai showcase craft" / "builder được credit" (`prd.md:38, 366`); brainstorm #7 nói rõ "internal-first, chưa open contribution" (`brainstorming:209`). Tag `[ASSUMPTION]` là hook để human confirm — xác nhận đây không phải scope creep ngoài ý muốn. | Seam A |
| O2  | MINOR    | Success Metrics (§7), target perf "<3s FCP", "<30 phút copy-paste", platform NFR (Next 16+/React 19+/TW4) — đều net-new ở tầng PRD. Hợp lý nhưng là orphan theo định nghĩa; SM-C1/C2 thực ra re-anchor đúng intent depth-over-volume → benign.                                                                                                                               | Seam A |

---

## Dropped without rationale (đầu vào craft bị mất)

| #   | Finding                                                                                                                                                                                                                              | Ref                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| D1  | **Lottie** bị bỏ khỏi animation stack (brainstorm P2 có "FM, GSAP, Three.js, Lottie, CSS"; PRD FR-10/NFR chỉ còn "FM, GSAP, Three.js, CSS").                                                                                         | `brainstorming:74` → `prd.md:228, 421` |
| D2  | **Craft north-stars Linear/Raycast/Stripe** bị mất (brainstorm #15 dùng làm reference tier craft; PRD Anti-references chỉ giữ anchor phủ định ThemeForest/purple-gradient/pump.fun). Làm yếu định nghĩa quality-bar cho implementer. | `brainstorming:241` → `prd.md:384`     |

---

## Inconsistency nội bộ & minor khác

| #   | Severity           | Finding                                                                                                                                                                                                                                        | Ref        |
| --- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| M1  | MINOR              | **PRD tự mâu thuẫn version**: UJ-1 "Next.js 15" (`prd.md:51`) vs Compatibility "Next.js 16+" (`prd.md:420`).                                                                                                                                   | PRD nội bộ |
| M2  | MINOR              | Next.js version loose "16+" (PRD) vs pinned "16.2.7" (arch/epics). Reconcile được nhưng nên thống nhất phrasing.                                                                                                                               | Vertical   |
| M3  | MINOR              | `example` template/route chỉ xuất hiện downstream — arch+epics xóa `app/(demos)/example/` + `templates/example/` nhưng PRD migration map không hề biết artifact `example`. Cleanup phát hiện đối chiếu repo thật, không phải mâu thuẫn intent. | Vertical   |
| M4  | MINOR              | Track/lane **"T"** (design-tokens, serial) là lane mới ở arch/epics, không có trong bảng MVP của brainstorm/PRD (chỉ A–I, không H). Không sai, chỉ là promote downstream.                                                                      | Vertical   |
| M5  | MINOR              | "3 themes live" (PRD/brainstorm DoD) vs "4 theme files {infra,neon,game,nft}.css" (arch/epics, nft = placeholder). Epics Story 2.2 reconcile đúng ("3 live + 1 skeleton") nhưng PRD không account cho file thứ 4.                              | Vertical   |
| M6  | MINOR              | **Story 5.1 (price-ticker) bị block bởi UX micro-spec chưa tồn tại** — checklist `epics.md:23` unchecked, AC `epics.md:528` "(block nếu chưa có UX micro-spec price-ticker props)". Open blocker đã được flag đúng.                            | Seam C     |
| M7  | MINOR (DROPPED-OK) | Price-ticker 3 modes → MVP 2 modes (flash defer week 2). Đã document ở Assumptions §4.3 → hợp lệ, không cần action.                                                                                                                            | Seam A/B/D |
| M8  | MINOR              | Theme naming surface: `theme-infra` (brainstorm/PRD glossary) vs `data-theme="infra"` + file `themes/infra.css` (arch/epics). Cosmetic; ai grep `theme-infra` sẽ không thấy gì.                                                                | Vertical   |

---

## Khuyến nghị trước khi giao epic cho dev agents song song

**Phải xử lý (block parallel dev):**

1. **C1** — Chốt convention `packages/templates-<slug>`, patch PRD + bảng FR→Structure của architecture.
2. **C2** — Chốt 1 dải catalog canonical + định nghĩa rõ mẫu số; thêm AC `(UI+sections) ≥ 8` nếu giữ intent PRD.
3. **C3** — Thêm task serial barrel-registration cho `packages/sections` (hoặc subpath exports) để gỡ ownership collision Epic 6 ∥ Epic 7.

**Nên xử lý:** 4. **C4** — Ghi decision-change note cho FR-3 (preset → `@theme`). 5. **G1** — Xác nhận NFR-8 deploy/CI là bước ops cố ý, hay thêm story. 6. **O1** — Human confirm motivation showcase/social-credit có chủ đích. 7. **M6** — Tạo UX micro-spec price-ticker để unblock Story 5.1.

**Cosmetic/cleanup:** D1, D2, M1, M2, M3, M5, M8 — gom 1 lượt sửa biên tập.
