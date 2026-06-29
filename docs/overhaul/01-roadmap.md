# Overhaul — Roadmap phased + Governance (Phase 0 output)

> 2026-06-29 · Kế hoạch đại tu dựa trên [`00-baseline.md`](./00-baseline.md).
> Khung: đại tu cả 3 chiều · agent-driven · rút BMAD. Phase 0 đã xong (3 audit + baseline + doc này).

## A. Spine mới thay BMAD (làm trước khi xoá `_bmad*`)

Rút BMAD = mất source-of-truth. Đề xuất thay bằng **file-based spine, agent-driven**, nhẹ và sống cạnh code:

- **`docs/overhaul/`** = nguồn kế hoạch duy nhất: `00-baseline.md` (state), `01-roadmap.md` (plan này), thêm `STATUS.md` (backlog phẳng: phase → task → trạng thái `backlog|in-progress|review|done`, thay `sprint-status.yaml`).
- **Di trú ràng buộc trước khi xoá:** các số hardcode trong `manifest.ts` (FR-10/NFR-9) → comment ngay tại code + ghi vào `INVARIANT.md`, KHÔNG để trỏ về `prd.md` sắp xoá.
- **Giữ lại (không phải BMAD):** `docs/PRODUCTION-BAR.md`, `packages/design-tokens/INVARIANT.md`, `docs/adr/*`, `CONTEXT.md`, `SPEC.md`, `docs/ideas/template-factory.md` + `harvest-log.md`. Đây là spine kỹ thuật/sản xuất thật, độc lập BMAD.
- **Harness chủ:** chốt **`.claude`** (đang chạy ở đây) làm chủ; các `.codex`/`.cursor`/`.conductor` để read-only hoặc gỡ dần.
- **Orchestrator:** 1 agent giữ `STATUS.md` — đề xuất `Project Shepherd` (điều phối execution). Specialist agents đẻ _draft_, merge vào spine, không tạo nguồn song song.

> ⚠️ Thứ tự bắt buộc: dựng `STATUS.md` + di trú ràng buộc **xong rồi mới** `git rm -r _bmad _bmad-output`. Không làm ngược.

## B. Nguyên tắc điều phối (4 luật)

1. **Một spine:** `docs/overhaul/STATUS.md` là sự thật; agent feed draft vào.
2. **Tuần tự, không bầy đàn:** discovery chạy song song được; _commit thay đổi_ thì serial + có review.
3. **Mỗi đổi UI → Production Bar** (eye-review screenshot full-page thật, Chrome+WebGL). **Mỗi đổi code → reviewer agent** (`code-reviewer` / `typescript-reviewer` / `react-reviewer`).
4. **1 vai = 1 nguồn:** agent để diverge/brainstorm, artifact canonical chốt vào `docs/`. Không để 2 bản kế hoạch đá nhau.

## C. Roadmap phased

> Thứ tự suy ra từ dependency 3 audit. **Phase 1 là blocker** — gần như mọi thứ khác đứng sau nó.

### ✅ Phase 0 — Baseline & governance (XONG)

3 audit · `00-baseline.md` · roadmap này. **Còn lại:** chốt 5 quyết định mở (§5 baseline) + dựng `STATUS.md`.

### 🔴 Phase 1 — Foundation fix (BLOCKER, làm ngay)

Mục tiêu: vá nền để mọi mood/template sau kế thừa đúng.

- **1.1** Fix bug token đông cứng: re-declare mapping layer dưới `:root, [data-theme]` ở `base.css`; xoá workaround cục bộ `neon.css`/`chrome.css`.
- **1.2** Mở rộng token floor: thêm tầng chung `--shadow-*`, `--glow-*`, `--gradient-*`, `--blur-*`, `--z-*`, quyết định `--font-mono` (1 face hay 2).
- **1.3** Nới gate `manifest.ts`: bỏ `EXACT_*`/cap cứng → floor mềm + tham số hoá; migrate ràng buộc FR/NFR vào comment+INVARIANT.
- **1.4** Dựng spine mới (`STATUS.md`) + di trú → **rồi** rút `_bmad*`. Chốt harness chủ.
- **Agents:** `Software Architect` (thiết kế token v3 + gate) → `Frontend Developer` (impl CSS) → `Backend Architect` (gate logic). **Gate:** `typescript-reviewer` + `react-reviewer`.

### 🧭 Phase 2 — Business flow clarity (chạy song song Phase 1, quyết định feed Phase 3-4)

Mục tiêu: gỡ mâu thuẫn định vị — KHÔNG đi tìm monetization (đã hoãn có chủ đích).

- **2.1** Chốt **Web3-only vs catalog tổng quát** → quyết số phận aikit/waitlist + mood enum.
- **2.2** Quyết value-prop "copy block": register tầng UI (epic-8) hay bỏ lời hứa block-nhỏ.
- **2.3** Reconcile scope creep: chốt danh sách template GIỮ/CẮT (Helix/Strata/NFT).
- **Agents:** `Trend Researcher` (so sánh shadcn/21st.dev/Aceternity/Cruip/ThemeForest) → `Product Manager` (cập nhật thesis) → `Sprint Prioritizer` (xếp ưu tiên). **Output:** PRD mới gọn trong `docs/overhaul/`.

### 🔧 Phase 3 — Technical hardening (sau Phase 1)

Mục tiêu: gỡ drift epic-3/4 + dựng lưới an toàn.

- **3.1** Sửa shell routing: implement `sp.layer` hoặc bỏ redirect `?layer=`; truyền đủ layer vào sidebar hoặc xoá dead-branch.
- **3.2** Register UI Pieces vào catalog (nếu Phase 2 chọn giữ) + thêm field `status: draft|production` vào `PieceMeta`.
- **3.3** Retrofit Ternus về token floor (gỡ font/CSS bespoke) — đóng "đảo riêng".
- **3.4** Dựng CI tối thiểu: wire `pnpm build`+`check-types`+`lint`+`posters:check` + route smoke-test `/preview/[slug]` (epic-9).
- **Agents:** `Frontend Developer` + `DevOps Automator`. **Gate:** reviewer agents + `silent-failure-hunter`.

### 🎨 Phase 4 — UI/Design overhaul (sau Phase 1, song song Phase 3)

Mục tiêu: cả catalog đạt Production Bar bằng assembly thật.

- **4.1** Harvest 2 skin off-floor (`--wl-*` Ion, `--ak-*` aikit) về floor v3; gỡ font lậu.
- **4.2** Vực **GameFi** qua bar: thay blank `character-showcase` bằng focal thật (tái dùng `glass-shape`/`artifact-surface` đã có); thêm focal HUD hero.
- **4.3** Quyết **NFT**: build template + 2 section (`nft-gallery-grid`, `mint-countdown`) hay gỡ khỏi manifest.
- **4.4** Productionize lane premium **Helix/Strata** (đã có spec + proto + deps).
- **4.5** Thêm smooth-scroll + scroll-orchestration chung (lenis/gsap) — vá "assembly rời rạc".
- **4.6** **Eye-review gate**: chạy screenshot full-page (Chrome+WebGL) cả 5 template → chấm P-1..P-10 thật.
- **Agents:** `UX Architect` → `UI Designer` → `Whimsy Injector` → `Brand Guardian`. **Gate bắt buộc:** skill `frontend-design-bar` + `docs/PRODUCTION-BAR.md`. ❌ Cấm agent đẻ static CSS gọi là "design".

### 📦 Phase 5 — Hợp nhất & đóng

Re-run toàn bộ gate; update `CONTEXT.md`/`INVARIANT.md`/`PRODUCTION-BAR.md`; retrospective; xoá `_bmad*` (nếu Phase 1.4 chưa làm); cập nhật `STATUS.md` = done.

## D. Bản đồ Agent → việc (tra nhanh)

| Vai             | Agent                                                                             | Dùng ở                 |
| --------------- | --------------------------------------------------------------------------------- | ---------------------- |
| Điều phối/spine | `Project Shepherd` (hoặc `Studio Producer`)                                       | Xuyên suốt             |
| Kiến trúc       | `Software Architect`, `Backend Architect`                                         | Phase 1, 3             |
| Frontend impl   | `Frontend Developer`, `Senior Developer`                                          | Phase 1, 3, 4          |
| Business/PM     | `Trend Researcher`, `Product Manager`, `Sprint Prioritizer`                       | Phase 2                |
| UX/UI           | `UX Architect`, `UI Designer`, `Brand Guardian`, `Whimsy Injector`                | Phase 4                |
| DevOps/CI       | `DevOps Automator`                                                                | Phase 3                |
| Gate review     | `code-reviewer`, `typescript-reviewer`, `react-reviewer`, `silent-failure-hunter` | Cuối mỗi phase         |
| Prototype nhanh | `Rapid Prototyper`                                                                | Phase 4 (Helix/Strata) |

## E. Critical path (1 dòng)

**Phase 1 (token floor + spine)** → mở khoá → **Phase 3 (technical) ∥ Phase 4 (UI)**, với **Phase 2 (business)** chạy song song từ đầu để quyết GIỮ/CẮT trước khi Phase 4 polish.
