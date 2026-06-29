# Overhaul — Baseline hiện trạng (Phase 0)

> 2026-06-29 · Tổng hợp 3 audit read-only (technical / business / UI) cho cuộc đại tu toàn diện.
> Quyết định khung: **đại tu cả 3 chiều (phased)** · **chuyển sang agent-driven, rút dần BMAD**.
> Đây là ảnh chụp current-state, KHÔNG phải kế hoạch — kế hoạch ở [`01-roadmap.md`](./01-roadmap.md).

## 0. Sản phẩm là gì (chốt lại để khỏi trôi)

Monorepo **catalog Pieces**: copy-paste landing building blocks theo `Layer` (`ui` / `section` / `template`) × `Mood` (`infra` / `neon` / `game` / `nft`). App `apps/docs` để browse / preview / copy. Định vị gốc (PRD 2026-06-08): **"shadcn for Web3 landing"** — dev copy source vào project Next.js của họ, sửa trực tiếp, không lock-in.

Mô hình sản xuất đã **khoá** (`docs/ideas/template-factory.md`): hybrid `clone → chắt lọc → compose`, **templates-first / harvest-later** (rule of three), mỗi template bắt buộc _extraction-ready_. Stance kinh doanh đã khoá: **nội bộ trước, public sau** — chưa storefront/pricing/license. → "Rethink business" KHÔNG phải đi tìm monetization; xem §3.

## 1. Phát hiện xuyên suốt (1 gốc, hiện ở cả 3 audit)

> Đây là phần quan trọng nhất: cùng một nguyên nhân gốc xuất hiện ở cả technical, UI và business.

### 🔴 GỐC #1 — Token floor mỏng + component-token đông cứng

- **Bug đông cứng (confirmed):** mapping layer (`--btn-*`, `--border-*`, `--surface-*`, `--badge-*`, `--state-*`…) khai ở `:root` của `packages/design-tokens/src/base.css` → resolve một lần = palette infra (cyan). Đổi `[data-theme]` chỉ đổi `--p-*`, KHÔNG re-flow vào mapping đã resolve. `neon.css`/`chrome.css` đã re-declare để né; **`game.css` + `nft.css` thì KHÔNG** → `<Button variant="solid">`, border, focus-ring, badge dưới mood game/nft ra **cyan sai mood**. (Khớp memory `neon-component-token-frozen`.)
- **Floor thiếu tầng biểu đạt:** không có token chung cho `glow / gradient / shadow / blur / z-index / font-mono`. Hệ quả trực tiếp: mỗi template tự chế → đẻ skin private.
- **Biểu hiện UI:** Waitlist có **25 token `--wl-*`** hex cứng; AI-kit có **24 token `--ak-*`** + tự bịa cả `data-theme="aikit"` **ngoài hệ 4 mood**. Cộng 2 font lậu phá font-floor "chỉ Inter": `JetBrains_Mono` (waitlist) + `Switzer` (aikit-testimonial.css).
- **Biểu hiện business:** moat tự nhận là "L1-grade bar đồng nhất" — nhưng chất lượng không đều chính vì floor nứt ở các mood chưa polish.

→ **Đây là blocker nền tảng. Phải fix trước mọi việc UI, nếu không mọi mood/template mới kế thừa bug.**

### 🔴 GỐC #2 — Catalog gates brittle + schema drift khỏi shell

- **Budget cap cứng:** `apps/docs/lib/catalog/manifest.ts` đang `EXACT_TEMPLATES===5` và tổng `17 = MAX_TOTAL` (đúng trần). Assert chạy lúc module-init → **thêm bất kỳ Piece nào (kể cả template NFT epic-7) = throw fail build toàn app**. Trực tiếp chặn mở rộng catalog.
- **Schema lệch shell (di sản epic-4 đóng nhanh):** `?layer=` là **dead param** (`Explorer` chỉ đọc `sp.piece`); `catalog-sidebar.tsx::LAYER_GROUPS` có **2 nhánh chết** (chỉ truyền `templates`); route `/sections`, `/ui` redirect về param chết.
- **Tầng UI gần như rỗng:** 5 UI piece (`pixel-blast, logo-loop, soft-aurora, price-ticker, chip-connect`) ở manifest nhưng **0 registered** → không lên gallery. Cái lõi value-prop "copy 1 block" gần như chưa giao được (epic-8 backlog).
- **Thiếu field trạng thái:** `PieceMeta` không có `status: draft|production` → viewer không phân biệt skeleton vs shippable.

### 🟡 GỐC #3 — Spine & governance: đang rút BMAD nhưng chưa có thay thế

- Source-of-truth hiện tại là `_bmad-output/implementation-artifacts/sprint-status.yaml` (tiến độ) + `prds/.../prd.md` + `epics.md` (nguồn của các số hardcode trong `manifest.ts`: FR-10/NFR-9). **Rút BMAD mà chưa di trú các ràng buộc này = code mồ côi + mất truy vết.**
- **Đa harness:** repo có `.claude`, `.codex`, `.github`, `.cursor`, `.conductor`, `.superpowers`, `.gstack` song song + **54 agent** trong `.claude/agents/`. Agent-driven cần chốt **1 harness chủ**.

## 2. Trạng thái Technical (chi tiết)

| Vùng           | Điểm | Ghi chú                                                                                                                             |
| -------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Build pipeline | 🟢   | turbo + pnpm + type-coverage guard chỉn chu; nhưng đa số package `build = echo no-op` (chỉ `@landing/ui` + `next build` chạy thật). |
| Type-safety    | 🟢   | `scripts/assert-type-coverage.mjs` bịt lỗ hổng turbo-skip. ⚠️ Bị né nếu gọi `turbo` trực tiếp thay vì `pnpm build`.                 |
| Test coverage  | 🔴   | **Cả repo 1 unit test** (`waitlist-email.test.ts`). Không e2e, không CI (epic-9 backlog).                                           |
| Lint           | 🟡   | `only-warn` plugin hạ mọi rule → `warn`; gate = `--max-warnings 0`. Không có linter cho token-discipline.                           |
| Preview infra  | 🟡   | ADR-0001 poster-first tốt; nhưng poster regen thủ công, slug parse bằng regex text (fragile), drift-gate chưa vào CI.               |
| Token infra    | 🔴   | Bug đông cứng §1.                                                                                                                   |

**Rủi ro epic-3/4 (đóng nhanh không review):** không phải crash — là **drift**. Ternus là "đảo riêng" (1384 LOC, tự load font, CSS bespoke `.btn`/`.headline`, không dùng token primitives → vi phạm font-floor); `HeroCrystal` bị tắt cứng (dead branch). Gallery/catalog = logic-vs-spec drift (§GỐC #2).

## 3. Trạng thái Business (đã hiệu chỉnh theo doc đã khoá)

- **Product thesis:** "shadcn for Web3 landing"; ICP gốc = "Alex" indie Web3 dev ship landing trong 1-2 ngày; phụ = chủ repo showcase craft để credit (JTBD-3).
- **Monetization:** **KHÔNG có — và đó là quyết định cố ý.** `prd.md` §5 + `architecture.md` + `template-factory.md` đều ghi free/no-paywall/no-storefront v1. → Đừng coi đây là lỗ hổng cần lấp; nó được hoãn có chủ đích.
- **Mâu thuẫn business THẬT (cần chốt):**
  1. **Web3-only vs catalog tổng quát.** Thesis khoá "for Web3" + liệt kê SaaS/e-commerce là _non-user_. Nhưng đã build **aikit (SaaS/AI, có pricing section)** + **waitlist (JTBD generic)**, và mood enum hard-lock 4 giá trị Web3 ép aikit vào `neon`. → Hoặc chính thức mở rộng thesis, hoặc cắt drift.
  2. **Value-prop "copy block" under-deliver:** tầng UI = 0 entry; cái lên gallery hầu hết là full template, không phải block nhỏ.
  3. **Scope creep ngược counter-metric:** PRD tự dặn "không chase 50+, 12-16 curated đủ", nhưng budget đã bump 16→17, templates 4→5, + Helix/Strata/NFT đang triển khai.

## 4. Trạng thái UI/Design (chi tiết)

> ⚠️ Toàn bộ nhận định template có WebGL là **suy luận từ code** — môi trường headless không chạy WebGL nên **chưa có eye-review nào**. Production Bar yêu cầu screenshot full-page thật → đây là một gap phải đóng ở Phase UI.

| Template (mood)                     | Mức Production Bar                   | Điểm yếu chính                                                                                                           |
| ----------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Memecoin** (neon)                 | Baseline→Production (mới polish)     | Focal CoinMint WebGL + stats thật; phần dưới hero nhẹ ký hơn.                                                            |
| **Ternus** (infra)                  | Production-leaning                   | Rủi ro monochrome cyan; "đảo riêng" lệch floor.                                                                          |
| **Waitlist/Aenor** (infra+skin Ion) | Owner chấm 10/10, thực tế baseline+  | `flow-knot` full-bleed đè/cắt section; gần monochrome; thiếu focal.                                                      |
| **GameFi** (game)                   | 🔴 Skeleton/DRAFT                    | `character-showcase` là **blank box rỗng** (đúng lỗi P-2/P-3 mà Production Bar nêu đích danh); button sai màu do bug §1. |
| **AI-kit** (aikit off-system)       | Visually-complete nhưng là **CLONE** | Clone pixel template Framer người khác; ngoài floor hoàn toàn; mood metadata lệch.                                       |
| **NFT** (nft)                       | 🔴 0%                                | Package vỏ rỗng, không src; theme placeholder; 2 section nft chưa tồn tại.                                               |

**Thiếu toàn cục:** không smooth-scroll, không scroll-orchestration chung → assembly rời rạc, mỗi template tự dựng reveal.

**Nguyên liệu sẵn có chưa khai thác (focal WebGL đã build trong `packages/ui/src`):** `coin-mint`, `glass-shape`, `artifact-surface`, `soft-aurora`, `pixel-blast` — dùng ngay cho GameFi/NFT mà không phải viết shader mới. Lane premium **Helix** (`docs/specs/2026-06-26-template-restaking-helix.md`, deps three.js/gsap đã thêm) + **Strata** (proto `apps/docs/public/proto/restake/`) đang dang dở, đúng gu đã chốt, chưa productionize.

## 5. Quyết định đang mở (cho chủ repo chốt — xem roadmap)

1. **Web3-only hay catalog landing tổng quát?** (gỡ mâu thuẫn aikit/waitlist + mood enum)
2. **Số phận NFT:** build thật (epic-7) hay gỡ khỏi manifest?
3. **Lane Helix/Strata:** có thay AI-kit clone bằng template gốc on-gu không?
4. **Harness chủ** cho agent-driven: chốt `.claude` hay khác?
5. **Spine mới** thay `sprint-status.yaml`: file-based trong `docs/overhaul/` hay tool ngoài (Linear)?

## Nguồn

3 audit (`Codebase Onboarding Engineer` / `Product Manager` / `UX Researcher`, 2026-06-29) + đọc trực tiếp: `manifest.ts`, `piece-registrations.ts`, `types.ts`, `base.css` + themes, `template-factory.md`, `harvest-log.md`, `prd.md`, `sprint-status.yaml`, `PRODUCTION-BAR.md`, `INVARIANT.md`.
