# Implementation Plan: Waitlist Template (Aenor)

> Plan · 2026-06-14 · repo `landing-page-list`
> Spec nguồn: [`docs/superpowers/specs/2026-06-14-waitlist-template-design.md`](../superpowers/specs/2026-06-14-waitlist-template-design.md)
> Governed by [template-factory](../ideas/template-factory.md) + [INVARIANT bar](../../packages/design-tokens/INVARIANT.md)
> Tiền lệ mirror: `packages/templates-ternus/` (cũng `infra` + three.js + scroll hooks)

## Overview

Dựng template flagship **Waitlist** (brand demo Aenor, JTBD "launch a waitlist") thành gói riêng
`@landing/templates-waitlist`, render tại `/templates/waitlist` dưới `data-theme="infra"`, hệ màu **Ion**,
điểm nhấn **flow-knot** 3D (Wireframe Flow). Email simple-confirm client-only, không backend.

Chiến lược: **walking skeleton trước** (gói + đăng ký + route render được) để fail fast trên 3 rủi ro
hạ tầng (budget assert, transpile/resolve three, catalog server bundle), rồi bồi dần theo lát dọc:
conversion path (hero+email) → artifact → nội dung core → flourish (cắt được) → verification.

## Architecture Decisions

- **Gói private mirror Ternus**, không thêm folder ở `packages/sections/` (rule-of-three chưa kích hoạt).
- **Ion = skin riêng** qua token private `--wl-*` trong `waitlist.css`, KHÔNG sửa `infra.css` (giữ Ternus không đổi màu).
- **config.ts pure data** (không import component) → catalog aggregator không kéo three vào server bundle.
- **Budget manifest** nâng `EXACT_TEMPLATES 4→5`, `MAX_TOTAL 16→17` (giả định #3 template-factory — kiểm chứng).
- **Reduced-motion là điều kiện chấp nhận**, không phải nice-to-have: mọi section + knot có fallback tĩnh.
- **flow-knot độc lập conversion path** → đặt sau hero để luôn có trang chạy được trước khi thêm WebGL.

## Dependency Graph

```
T1 scaffold gói (package.json/tsconfig/eslint/index/config/template tối giản + waitlist.css)
   │
   ├── T2 đăng ký catalog (manifest budget 5/17 + registration + transpile) ──► /templates/waitlist render
   │
   └── T3 lib (use-in-view, use-scroll-progress, waitlist-email) + primitives (reveal, stat-number)
          │
          ├── T4 hero + email + nav + footer  (conversion path)  [cần T3]
          ├── T5 flow-knot artifact            [cần T3 use-scroll-progress]
          ├── T6 backers + perks + stats       [cần T3]
          ├── T7 trust + closing-cta + faq     [cần T3]
          └── T8/T9 flourish (transform, gauge, globe) [cần T3] — CẮT ĐƯỢC
                 │
                 └── T10 verification + INVARIANT + unit test + harvest-log
```

Implementation order bottom-up; T4–T9 song song được sau khi T3 xong (xem Parallelization).

---

## Task List

### Phase 1 — Foundation (walking skeleton)

#### Task 1: Scaffold gói `@landing/templates-waitlist`

**Description:** Tạo gói nguồn mirror Ternus với cấu hình build/lint/types, một `template.tsx` tối giản
(root `<div className="wl" data-theme="infra">` + placeholder), `config.ts` pieceMeta pure-data, và
`waitlist.css` khai báo token `--wl-*` (Ion). Chưa có section thật.

**Acceptance criteria:**

- [ ] `package.json` name `@landing/templates-waitlist`, exports `"."`→`./src/template.tsx`, `"./config"`→`./src/config.ts`; deps `@landing/ui: workspace:*`; peerDeps `next`/`react` mirror Ternus.
- [ ] `config.ts` export `pieceMeta` đúng shape `PieceMeta`: `slug:"waitlist"`, `layer:"template"`, `mood:["infra"]`, `stackTags:["next","react","three"]`, `animationTags:["webgl","scroll-reveal","count-up"]`, `copyMode:"multi"`, `deps:["@landing/ui","next","react"]`, `sourcePaths` trỏ src.
- [ ] `waitlist.css` có `.wl { --wl-bg/-ink/-cy/-cy-soft/-vi/-pop/-grad/-glow-* }` đúng giá trị Ion (spec §4).
- [ ] `eslint.config.mjs` + `tsconfig.json` copy từ Ternus.

**Verification:**

- [ ] `pnpm --filter @landing/templates-waitlist check-types` xanh
- [ ] `pnpm --filter @landing/templates-waitlist lint` xanh (max-warnings 0)
- [ ] `pnpm install` resolve workspace package (xuất hiện trong `pnpm -r list`)

**Dependencies:** None
**Files likely touched:** `packages/templates-waitlist/{package.json,tsconfig.json,eslint.config.mjs}`, `packages/templates-waitlist/src/{index.ts,config.ts,template.tsx,waitlist.css}`
**Estimated scope:** M (5-7 files)

#### Task 2: Đăng ký catalog + nâng budget

**Description:** Đưa slug `waitlist` vào manifest (kèm bump budget + sửa comment floor), thêm entry
`piece-registrations.ts`, export `WaitlistTemplate` từ `index.ts`, xác minh transpile tự append qua `packageName`.

**Acceptance criteria:**

- [ ] `manifest.ts`: thêm `"waitlist"` vào `templates`; `EXACT_TEMPLATES 4→5`; `MAX_TOTAL 16→17`; cập nhật comment floor (`templates.length === 4` → `=== 5`) + rationale ngắn.
- [ ] `piece-registrations.ts`: import `pieceMeta as waitlistPieceMeta` từ `@landing/templates-waitlist/config` + entry `{ slug, source, meta, packageName, loadPreview: () => import("@landing/templates-waitlist").then(m=>({default:m.WaitlistTemplate})) }`.
- [ ] `src/index.ts`: `export { WaitlistTemplate } from "./template"`.
- [ ] `next.config.ts` lấy transpile qua `catalogTranspilePackages` (auto từ `packageName`) — verify, không cần sửa tay.

**Verification:**

- [ ] `pnpm --filter docs build` (hoặc dev) không ném `[manifest]`/`buildCatalog` error
- [ ] `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/templates/waitlist` → `200`, render skeleton
- [ ] `/templates` index liệt kê card `waitlist`

**Dependencies:** Task 1
**Files likely touched:** `apps/docs/lib/catalog/manifest.ts`, `apps/docs/lib/catalog/piece-registrations.ts`, `packages/templates-waitlist/src/index.ts`
**Estimated scope:** S-M (3 files)

> **Checkpoint — Foundation:** route `/templates/waitlist` 200 · catalog build không ném · `check-types`+`lint` xanh · budget 5/17. **Review trước khi đi tiếp** (đây là cửa fail-fast cho rủi ro hạ tầng).

---

### Phase 2 — Core conversion path

#### Task 3: lib hooks + primitives

**Description:** Port `use-in-view.ts` + `use-scroll-progress.ts` từ Ternus; viết `lib/waitlist-email.ts`
(zod, pure, không React/Web API); tạo `reveal.tsx` (IntersectionObserver wrapper) + `stat-number.tsx` (count-up primitive).

**Acceptance criteria:**

- [ ] `lib/waitlist-email.ts` export `validateEmail(v: string): { ok: boolean; error?: string }` dùng `z.string().email()`; rỗng → lỗi rõ.
- [ ] `use-scroll-progress`/`use-in-view` mirror Ternus, gate được reduced-motion ở consumer.
- [ ] `reveal.tsx` nhận `reduced` → khi true hiện thẳng (no transition); `stat-number.tsx` reduced → số cuối tĩnh.
- [ ] Dependency flow `components/ → lib/`; `lib/` không import `components/`.

**Verification:**

- [ ] `pnpm --filter @landing/templates-waitlist check-types` xanh
- [ ] (chuẩn bị cho T10) `validateEmail` chạy tay: `"a@b.co"`→ok, `"x"`→error, `""`→error

**Dependencies:** Task 1
**Files likely touched:** `packages/templates-waitlist/src/lib/{use-in-view.ts,use-scroll-progress.ts,waitlist-email.ts}`, `src/components/{reveal.tsx,stat-number.tsx}`
**Estimated scope:** M (5 files)

#### Task 4: Hero + email simple-confirm + nav + footer

**Description:** Hero full-bleed với ô email (useState + touched, a11y, đổi UI sang "✓ Đã ghi nhận" khi hợp lệ,
comment `// TODO(integrator): POST email here`), `waitlist-nav`, `waitlist-footer`; compose vào `template.tsx`
(gọi `useReducedMotion()` 1 lần, truyền `reduced` xuống).

**Acceptance criteria:**

- [ ] Submit hợp lệ → trạng thái confirm + disable input; KHÔNG gọi API/lưu.
- [ ] Submit/blur sai → lỗi chỉ hiện sau `touched`; `aria-invalid`+`aria-describedby` đúng; `<label>` ẩn.
- [ ] `template.tsx` truyền `reduced` xuống; hero chữ fade-in (reduced → hiện thẳng).
- [ ] Markup props-hoá nội dung (không hardcode chuỗi inline) — chuẩn bị harvest.

**Verification:**

- [ ] `/templates/waitlist` render hero + nav + footer; thao tác email đúng 3 nhánh (ok/sai/rỗng)
- [ ] Toggle `prefers-reduced-motion` → không animation chữ
- [ ] `check-types` + `lint` xanh

**Dependencies:** Task 3
**Files likely touched:** `src/components/{hero.tsx,waitlist-nav.tsx,waitlist-footer.tsx}`, `src/template.tsx`, `src/waitlist.css`
**Estimated scope:** M (4-5 files)

> **Checkpoint — Conversion:** email flow chạy end-to-end · reduced-motion ok · trang có nav/hero/footer. Đây là MVP có giá trị tự thân.

---

### Phase 3 — Artifact (flagship)

#### Task 5: flow-knot 3D (Wireframe Flow / Ion)

**Description:** `flow-knot.tsx` client component fixed sau toàn trang (`#scene`, z-index 0, pointer-events none):
three.js Group 3 mesh (fill/wire/glow) trên `TorusKnotGeometry(1.0,0.33,240,36)`, backdrop Canvas2D Ion,
scroll-driven qua `use-scroll-progress`. Bọc `ErrorBoundary` (@landing/ui), WebGL probe trước import three,
`useReducedMotion()` → fallback conic blob tĩnh (`.fknot`).

**Acceptance criteria:**

- [ ] Knot render (wire `0x66f3ff`, glow additive `0x33d6ff`, fill `0x05010a`); scroll lái `group.position/scale/rotation`.
- [ ] `prefers-reduced-motion` → KHÔNG init render loop, hiện blob tĩnh; WebGL off → blob tĩnh, không trang trắng.
- [ ] Lỗi WebGL degrade qua ErrorBoundary về blob; cleanup dispose đầy đủ (geometry/material/renderer/forceContextLoss).
- [ ] Hex three.js/Canvas2D dùng carve-out I-4 (không qua CSS var); CSS quanh canvas vẫn qua token.

**Verification:**

- [ ] Manual: scroll → knot biến đổi mượt; DevTools reduced-motion → tĩnh; tắt WebGL (flag) → blob
- [ ] Không memory leak khi navigate away (cleanup chạy)
- [ ] `check-types` + `lint` xanh

**Dependencies:** Task 3 (use-scroll-progress)
**Files likely touched:** `src/components/flow-knot.tsx`, `src/template.tsx`, `src/waitlist.css`; (rủi ro) `packages/templates-waitlist/package.json` nếu cần thêm `three`/`@types/three`
**Estimated scope:** M-L (2-4 files, logic three.js đậm)

> **Checkpoint — Artifact:** wow nhìn thấy được + cả 2 fallback (reduced-motion, no-WebGL) hoạt động.

---

### Phase 4 — Core content sections

#### Task 6: Backers + Perks + Stats

**Description:** `backers.tsx` (logo-loop marquee, reduced → wrap tĩnh), `perks.tsx` (3 perks, reveal stagger),
`stats.tsx` (count-up qua stat-number, reduced → số cuối). Cắm vào template theo thứ tự spec §6.

**Acceptance criteria:**

- [ ] Mỗi section IntersectionObserver-reveal; reduced-motion fallback đúng (marquee đứng, count-up tĩnh).
- [ ] Nội dung props-hoá; không `transition: all`.

**Verification:** `/templates/waitlist` hiện 3 section đúng vị trí; reduced-motion ok; `check-types`+`lint` xanh
**Dependencies:** Task 3 (Task 4 cho thứ tự compose)
**Files likely touched:** `src/components/{backers.tsx,perks.tsx,stats.tsx}`, `src/template.tsx`, `src/waitlist.css`
**Estimated scope:** M (4-5 files)

#### Task 7: Trust + Closing-CTA + FAQ

**Description:** `trust.tsx` (badges, reveal), `closing-cta.tsx` (nhắc lại email/CTA, reveal),
`faq.tsx` (accordion CSS — mở/đóng dùng được kể cả reduced-motion, không animate chiều cao khi reduced).

**Acceptance criteria:**

- [ ] FAQ accordion hoạt động bằng bàn phím (a11y `<details>` hoặc button+aria-expanded); reduced → không animate height.
- [ ] Closing-CTA tái dùng logic email (hoặc link tới hero) nhất quán.

**Verification:** 3 section render; accordion thao tác được; reduced-motion ok; `check-types`+`lint` xanh
**Dependencies:** Task 3
**Files likely touched:** `src/components/{trust.tsx,closing-cta.tsx,faq.tsx}`, `src/template.tsx`, `src/waitlist.css`
**Estimated scope:** M (4-5 files)

> **Checkpoint — Core narrative:** toàn bộ core (Hero→Backers→Perks→Stats→Trust→CTA→FAQ→Footer) + knot render đủ.

---

### Phase 5 — Flourish (CẮT ĐƯỢC — story con nếu cần)

> Spec §13 Q1: 3 section này có thể tách story con. Nếu cắt phạm vi, dừng sau Phase 4 + làm T10 — trang vẫn hoàn chỉnh.

#### Task 8: Transform showpiece (sticky + scroll-progress)

**Description:** `transform.tsx` — sticky container, 3 trạng thái COMMIT→SETTLE→FINALIZED lái bằng
`use-scroll-progress` (không GSAP pin). Reduced → hiện cả 3 trạng thái dạng list tĩnh.

**Acceptance criteria:**

- [ ] Scroll qua section → chuyển 3 trạng thái mượt; reduced → list tĩnh đủ 3.
- [ ] Không `transition: all`; easing qua `--ease-*`.

**Verification:** Manual scroll; reduced-motion → list; `check-types`+`lint` xanh
**Dependencies:** Task 3
**Files likely touched:** `src/components/transform.tsx`, `src/template.tsx`, `src/waitlist.css`
**Estimated scope:** M (3 files)

#### Task 9: Latency gauge + Reach globe

**Description:** `latency-gauge.tsx` (gauge fill khi in-view, reduced → giá trị cuối tĩnh);
`reach-globe.tsx` (Canvas2D globe xoay nhẹ, hex carve-out I-4, reduced → frame tĩnh).

**Acceptance criteria:**

- [ ] Globe Canvas2D cleanup raf khi unmount; reduced → 1 frame tĩnh; gauge reduced → tĩnh.
- [ ] Canvas2D `fillStyle` hex dùng carve-out; CSS quanh canvas qua token.

**Verification:** 2 section render + animate; reduced-motion tĩnh; no raf leak; `check-types`+`lint` xanh
**Dependencies:** Task 3
**Files likely touched:** `src/components/{latency-gauge.tsx,reach-globe.tsx}`, `src/template.tsx`, `src/waitlist.css`
**Estimated scope:** M-L (3-4 files)

> **Checkpoint — Flourish:** 3 flourish render hoặc được hoãn có chủ đích (ghi rõ).

---

### Phase 6 — Verification & harvest

#### Task 10: INVARIANT acceptance + unit test + harvest-log

**Description:** Dán §3 INVARIANT vào ghi chú story, audit I-1..I-9 toàn template (no magic number, no
`transition:all`, màu qua `--wl-*`/`--p-*` trừ carve-out, type/radius/layout qua token). Viết unit test
`lib/waitlist-email.ts`. Tạo `docs/ideas/harvest-log.md`. Chạy full gate.

**Acceptance criteria:**

- [ ] Checklist INVARIANT §8 spec tick hết; render dưới `data-theme="infra"` không layout-shift.
- [ ] Unit test `validateEmail` (hợp lệ/sai/rỗng) pass.
- [ ] `docs/ideas/harvest-log.md` tạo với cột `kind | template | path | ngày`; ghi lần dùng đầu: hero/backers/cta/faq/footer/stats + artifact-3D (`wireframe-flow`/`flow-knot`/`Ion`).
- [ ] Manual matrix: reduced-motion, WebGL-off, email 3 nhánh — pass.

**Verification:**

- [ ] `pnpm build` + `pnpm lint` + `pnpm check-types` (turbo, toàn repo) xanh
- [ ] `assert-type-coverage.mjs` pass
- [ ] `buildCatalog()` không ném; budget 5/17 khớp

**Dependencies:** Tasks 4–7 (core); 8–9 nếu không cắt
**Files likely touched:** `packages/templates-waitlist/src/lib/waitlist-email.test.ts` (hoặc vị trí test repo), `docs/ideas/harvest-log.md`, fix INVARIANT rải rác
**Estimated scope:** M

> **Checkpoint — Complete:** mọi acceptance spec §8/§11 đạt · gate xanh · sẵn sàng review/PR.

---

## Risks and Mitigations

| Risk                                                                                                        | Impact | Mitigation                                                                                           |
| ----------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `three` không khai báo trong `package.json` waitlist (Ternus dựa hoisting qua `@landing/ui`) → resolve fail | Med    | Mirror Ternus trước; nếu import `three` fail, thêm `three` + `@types/three` vào deps/devDeps (T1/T5) |
| Budget `assertManifestBudget()` ném lúc module-init nếu lệch                                                | High   | T2 nâng `EXACT_TEMPLATES`/`MAX_TOTAL` **trước** khi thêm slug; chạy build verify ngay                |
| Catalog server bundle kéo three.js (nặng/SSR lỗi)                                                           | Med    | `config.ts` pure-data (không import component); `loadPreview` dynamic; flow-knot `ssr:false`         |
| WebGL context limit / SSR window undefined                                                                  | Med    | WebGL probe + `useReducedMotion` gate + `ErrorBoundary` + dynamic ssr:false                          |
| Flourish (T8/T9) phình thời gian                                                                            | Low    | Phase 5 cắt được — dừng sau Phase 4 + T10 vẫn ra sản phẩm hoàn chỉnh                                 |
| `--wl-*` đẻ quá nhiều = token floor `infra` thiếu                                                           | Low    | Chỉ _ghi nhận_ vào harvest/note (spec §4), không sửa `infra.css` story này                           |

## Parallelization

- **Tuần tự (bắt buộc):** T1 → T2 (foundation); T3 trước mọi section.
- **Song song được sau T3:** T4 (hero), T5 (knot), T6, T7, T8, T9 — độc lập file, chỉ chạm `template.tsx`+`waitlist.css` chung (cần coordinate khi compose; tách thay đổi nhỏ để tránh chồng).
- **Cuối:** T10 sau khi các section xong.

## Open Questions (từ spec §13 — không chặn bắt đầu)

- **Flourish thành story con?** Đề xuất: giữ Phase 5 trong cùng plan nhưng cắt được; tách story riêng nếu time-box Phase 1–4+T10 trước.
- **Cột harvest-log?** Đề xuất chốt: `kind | template | path | ngày`.
- **Scroll progress cho knot fixed full-bleed?** Đề xuất: theo toàn trang (như demo `final-waitlist.html`).

## Verification (trước khi bắt đầu code)

- [x] Mỗi task có acceptance criteria
- [x] Mỗi task có verification step
- [x] Dependency order xác định + đúng chiều (bottom-up)
- [x] Không task nào chạm > ~5 file (T5/T9 đậm logic nhưng ít file)
- [x] Có checkpoint giữa các phase
- [ ] **Human review + duyệt plan** ← cửa kế tiếp
