# Waitlist Template (Aenor) — Design Spec

> Spec · 2026-06-14 · repo `landing-page-list` · status: **draft for review**
> Brainstorm visual source of truth: `.superpowers/brainstorm/494-1781415686/content/final-waitlist.html`
> Governed by [template-factory](../../ideas/template-factory.md) (templates-first, harvest-later)
> và [INVARIANT bar](../../../packages/design-tokens/INVARIANT.md).

## 1. Mục tiêu & JTBD

Template landing **Waitlist** mới, dựng như một sản phẩm JTBD cụ thể: *"launch a waitlist —
thu email trước khi mainnet"*. Brand demo: **Aenor**, archetype fintech/crypto —
*"the trust layer for on-chain finance"*.

- **Là gì:** một template flagship (`layer: "template"`) trên `theme-infra`, ăn token chung,
có một *3D artifact* làm điểm nhấn "đẹp & lạ".
- **Vì sao:** (a) lấp một JTBD phổ biến nhất của landing; (b) là **phép thử** cho 2 giả định
trong template-factory — "theme tái dùng được" và "token floor đủ biểu đạt"; (c) cung cấp
ứng viên harvest đầu tiên cho rule-of-three (hero / proof / cta / faq / footer).
- **Thước đo thành công:** render đúng dưới `data-theme="infra"` không layout-shift · pass
INVARIANT bar · `prefers-reduced-motion` có fallback tĩnh đầy đủ · build/lint/check-types xanh ·
extraction-ready (tách 1 block sau này ≤ ½ ngày).

## 2. Quyết định đã chốt (qua brainstorm visual)


| Hạng mục           | Chốt                                                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Theme mood         | `infra` (calm / premium / trustworthy) — root `data-theme="infra"`                                                                     |
| Hình khối artifact | **Flow knot** (`THREE.TorusKnotGeometry(1.0, 0.33, 240, 36)`)                                                                          |
| Bề mặt artifact    | **Wireframe Flow** — lưới phát sáng + lõi tối + quầng glow additive (unlit)                                                            |
| Hệ màu             | **Ion** — cyan băng `#5fd6ff` / indigo `#6f8bff` / violet pop `#b58bff` / ink `#eaf2ff` / bg `#0a0b16`                                 |
| Motion             | three.js scroll-driven + IntersectionObserver reveal + count-up. **KHÔNG GSAP** (repo không có; dùng `use-scroll-progress` như Ternus) |
| Reduced-motion     | Bắt buộc: fallback tĩnh (conic blob), không autoplay/parallax/loop                                                                     |
| Email capture      | **Simple-confirm client-side** — validate + đổi UI, KHÔNG backend                                                                      |


Các bề mặt artifact khác đã lưu thành kho tham khảo:
`[docs/ideas/reference/3d-artifact-surfaces.md](../../ideas/reference/3d-artifact-surfaces.md)`
(+ lookbook chạy được). Plasma Core bị loại có chủ đích.

## 3. Kiến trúc — gói & đăng ký

Mirror **Ternus** (tiền lệ gần nhất: cũng `infra` + three.js + scroll hooks).

### 3.1 Gói mới `packages/templates-waitlist/`

```
packages/templates-waitlist/
├── package.json            # name "@landing/templates-waitlist"; scripts build/lint/check-types
├── tsconfig.json
└── src/
    ├── index.ts            # export { WaitlistTemplate } (named)
    ├── config.ts           # pieceMeta — PURE DATA, không import component (xem 3.3)
    ├── template.tsx        # root: <div className="wl" data-theme="infra"> … (client)
    ├── waitlist.css        # private --wl-* Ion tokens + scoped styles
    ├── components/
    │   ├── waitlist-nav.tsx
    │   ├── hero.tsx              # hero full-bleed + email form
    │   ├── flow-knot.tsx        # 3D artifact (three.js, client) — Wireframe Flow / Ion
    │   ├── backers.tsx          # logo-loop social proof
    │   ├── transform.tsx        # showpiece 3 trạng thái COMMIT→SETTLE→FINALIZED (sticky + scroll-progress)
    │   ├── perks.tsx            # 3 perks
    │   ├── latency-gauge.tsx    # gauge số liệu
    │   ├── reach-globe.tsx      # Canvas2D globe (hex carve-out I-4)
    │   ├── stats.tsx            # count-up
    │   ├── trust.tsx            # trust badges
    │   ├── closing-cta.tsx
    │   ├── faq.tsx
    │   ├── waitlist-footer.tsx
    │   ├── reveal.tsx           # IntersectionObserver wrapper (port từ Ternus pattern)
    │   └── stat-number.tsx      # count-up primitive
    └── lib/
        ├── use-in-view.ts          # IntersectionObserver hook (port Ternus)
        ├── use-scroll-progress.ts  # scroll fraction 0..1 (port Ternus) — lái knot + transform
        └── waitlist-email.ts       # pure: zod schema + validate (testable, không React/Web API)
```

> Mọi section là **component private** trong gói — KHÔNG tạo folder mới ở `packages/sections/`
> tại story này (rule-of-three chưa kích hoạt).

### 3.2 Đổi budget manifest (BLOCKER — bắt buộc)

`apps/docs/lib/catalog/manifest.ts` hiện chốt cứng:
`templates = ["ternus","memecoin","gamefi","aikit"]`, `EXACT_TEMPLATES = 4`,
`assertManifestBudget()` ném lỗi nếu `templates.length !== 4` hoặc `total > 16`.

Thay đổi (kèm rationale ghi trong PR theo yêu cầu comment của file):

- thêm `"waitlist"` vào `templates`
- `EXACT_TEMPLATES = 4 → 5`
- `MAX_TOTAL = 16 → 17`

> Đây chính là giả định #3 trong template-factory ("budget cap không nổ sớm") — story này là
> lần kiểm chứng. Rationale: chuyển khỏi tư duy "tổng ≤16" sang "đủ chiều sâu mỗi `kind`";
> Waitlist là template JTBD chính đáng, không phải phình tuỳ tiện.

### 3.3 Chuỗi đăng ký (theo `aikit`)

1. `config.ts` export `pieceMeta` shape `PieceMeta` (slug/name/layer/mood/useCase/stackTags/
  animationTags/deps/copyMode/sourcePaths) — **pure data**, không import component (tránh kéo
   three.js vào server bundle của catalog aggregator).
  - `slug: "waitlist"`, `layer: "template"`, `mood: ["infra"]`,
  `stackTags: ["next","react","three"]`, `animationTags: ["webgl","scroll-reveal","count-up"]`,
  `copyMode: "multi"`, `deps: ["@landing/ui","next","react"]`.
2. `apps/docs/lib/catalog/piece-registrations.ts` — thêm entry:
  `{ slug:"waitlist", source:"@landing/templates-waitlist/config", meta: waitlistPieceMeta,

packageName:"@landing/templates-waitlist",
loadPreview: () => import("@landing/templates-waitlist").then(m => ({default: m.WaitlistTemplate})) }`3.`packages/templates-waitlist/src/index.ts`—`export { WaitlistTemplate } from "./template"`. 4.` apps/docs/next.config.ts`— đảm bảo`@landing/templates-waitlist`trong`transpilePackages   `(hoặc dựa cơ chế auto-append từ`packageName`nếu có). 5. Route`apps/docs/app/(shell)/templates/[slug]/page.tsx`đã tự sinh`/templates/waitlist   `qua`generateStaticParams()`(lọc`layer==="template"`) — không cần thêm file route.

`buildCatalog()` sẽ validate: meta shape, `slug===meta.slug`, không trùng slug, slug ∈ `manifestSlugs`.

## 4. Hệ màu Ion — token bridge

Root mang `data-theme="infra"` để có sẵn `--p-*` chung, scope token private bằng **class gốc `.wl`**
(theo convention repo: Ternus dùng `.tn`, aikit dùng `.ak-root`). Giá trị Ion là **token private
`--wl-*`** khai báo trong `waitlist.css`, KHÔNG sửa `packages/design-tokens/src/themes/infra.css`.

```css
/* waitlist.css */
.wl {
  --wl-bg: #0a0b16;
  --wl-ink: #eaf2ff;
  --wl-cy: #5fd6ff; /* primary  */
  --wl-cy-soft: #9ce8ff;
  --wl-vi: #6f8bff; /* indigo phụ */
  --wl-pop: #b58bff; /* violet pop */
  --wl-grad: linear-gradient(120deg, #9ce8ff 0%, #5fd6ff 46%, #6f8bff 100%);
  --wl-glow-cy: rgba(95, 214, 255, 0.5);
  --wl-glow-vi: rgba(111, 139, 255, 0.5);
  --wl-glow-pop: rgba(181, 139, 255, 0.45);
}
```

- **I-1/2/3/5/6/9 vẫn áp full:** spacing `--space-*`, easing `--ease-*`, type `--text-*`,
radius `--radius-*`, layout `--container-*`/`--section-pad-y-*`. KHÔNG magic number, KHÔNG `transition: all`.
- **I-4 (palette via token):** màu Ion đi qua `--wl-*` (token), không hex trần rải trong CSS rule.
- **Carve-out I-4 cho WebGL/Canvas2D:** hex truyền cho three.js material (`0x66f3ff`, `0x33d6ff`,
`0x05010a`) và Canvas2D `fillStyle` (backdrop pools, globe) **được miễn** — GPU/canvas không đọc
CSS var. Các giá trị này pin theo mood `infra`/Ion. Mọi CSS *quanh* canvas vẫn qua token.

> Lý do dùng `--wl-*` thay vì sửa `infra.css`: Ion là *skin* riêng của một template, không phải
> đổi mood chung. Giữ `infra.css` nguyên để các template infra khác (Ternus) không đổi màu.
> Đây cũng là dữ liệu cho giả định "theme tái dùng được": nếu phải đẻ quá nhiều `--wl-*`, tức
> token floor của `infra` thiếu → ghi nhận để mở rộng floor sau.

## 5. 3D artifact — Flow knot (Wireframe Flow / Ion)

`components/flow-knot.tsx` — client component, fixed phía sau toàn trang (`#scene`, `z-index:0`,
`pointer-events:none`). Port kỹ thuật từ `final-waitlist.html` + tiền lệ Ternus `hero-crystal.tsx`.

- **three.js:** `WebGLRenderer({alpha, antialias})`, `ACESFilmicToneMapping` exposure 1.3.
PerspectiveCamera(42), camera z≈4.6.
- **Knot = `THREE.Group`** gồm 3 mesh chung 1 geometry `TorusKnotGeometry(1.0,0.33,240,36)`:
  - fill `MeshBasicMaterial{color:0x05010a}` scale 0.985 (lõi gần-đen)
  - wire `MeshBasicMaterial{color:0x66f3ff, wireframe:true, transparent:true, opacity:1.0}`
  - glow `MeshBasicMaterial{color:0x33d6ff, transparent:true, opacity:0.14, blending:AdditiveBlending}` scale 1.05
  - Unlit → không phụ thuộc đèn/env, không "ăn màu nền".
- **Backdrop** Canvas2D plane: nền `#0a0b16` + pool tím/indigo + tia cyan rất nhẹ + halo tối
giữa khung (đẩy knot tách khỏi nền). Khác hue với knot cyan → tách bạch là đặc tính sẵn có.
- **Scroll-driven:** `use-scroll-progress` → fraction 0..1 lái `group.position`/`scale`/rotation
qua bảng keyframe (như demo). Vanilla, không GSAP.
- **Reduced-motion (`useReducedMotion()` từ `@landing/ui`):** KHÔNG khởi tạo render loop;
hiển thị fallback tĩnh — conic-gradient blob (`.fknot`, tông Ion: `#1a1040 → #5fd6ff → #9ce8ff → #6f8bff → #b58bff`) đứng yên, không animation. (three.js có thể render 1 frame tĩnh tuỳ chọn.)
- **An toàn:** bọc artifact trong `ErrorBoundary` của `@landing/ui` → lỗi WebGL degrade về blob tĩnh,
không trang trắng. WebGL probe trước khi import three (fallback nếu không có WebGL).

## 6. Giải phẫu trang (sections)

Thứ tự + vai trò (đều IntersectionObserver-reveal, gate reduced-motion; KHÔNG `transition: all`):


| #   | Section           | Vai trò (JTBD)                    | Motion                                        | Reduced-motion                                 |
| --- | ----------------- | --------------------------------- | --------------------------------------------- | ---------------------------------------------- |
| 1   | **Hero**          | hook + ô email (core conversion)  | knot scroll-driven sau lưng, fade-in chữ      | knot tĩnh, chữ hiện thẳng                      |
| 2   | **Backers**       | social proof (logo-loop)          | marquee chậm                                  | đứng yên, wrap tĩnh                            |
| 3   | **Transform**     | showpiece COMMIT→SETTLE→FINALIZED | **sticky + scroll-progress** (không GSAP pin) | hiện cả 3 trạng thái dạng list tĩnh            |
| 4   | **Perks**         | 3 lý do tham gia                  | reveal stagger                                | hiện thẳng                                     |
| 5   | **Latency gauge** | số liệu hiệu năng                 | gauge fill                                    | giá trị cuối tĩnh                              |
| 6   | **Reach globe**   | phủ toàn cầu (Canvas2D)           | xoay nhẹ                                      | frame tĩnh                                     |
| 7   | **Stats**         | count-up uy tín                   | count-up khi in-view                          | số cuối tĩnh                                   |
| 8   | **Trust**         | badges/bảo chứng                  | reveal                                        | tĩnh                                           |
| 9   | **Closing CTA**   | nhắc lại email                    | reveal                                        | tĩnh                                           |
| 10  | **FAQ + Footer**  | gỡ phản đối + điều hướng          | accordion (CSS)                               | mở/đóng vẫn dùng được, không animate chiều cao |


> **Core vs flourish (cho writing-plans sắp xếp):** core = Hero(+email), Backers, Perks, Stats,
> FAQ, CTA, Footer, flow-knot. Flourish (flagship "wow") = Transform showpiece, Latency gauge,
> Reach globe. Plan có thể giao flourish thành story con tách rời nếu cần cắt phạm vi.

## 7. Email capture — simple-confirm (client-only)

- `lib/waitlist-email.ts`: pure function + **zod** schema `z.string().email()`. Không React, không
Web API → unit-test thẳng. (Theo react-patterns: form < 5 fields, compute live → `useState` thuần,
không form library.)
- Hero form: `useState` cho value + `touched`; lỗi chỉ hiện sau touched.
- Submit (`onSubmit`, `preventDefault`): validate → nếu hợp lệ đổi UI sang trạng thái
"✓ Đã ghi nhận" (`.ok` hiện), disable input. **KHÔNG gọi API, KHÔNG lưu** — đây là template demo;
nơi cắm endpoint thật được đánh dấu bằng comment `// TODO(integrator): POST email here`.
- A11y: `<label>` ẩn, `aria-invalid`, `aria-describedby` cho thông báo lỗi; focus-ring qua token.

## 8. Extraction-ready & INVARIANT (acceptance)

Dán nguyên §3 của INVARIANT.md vào story khi triển khai. Tóm các điểm bắt buộc:

- [ ] I-1 spacing chỉ `--space-`* (4/8px) — no magic number
- [ ] I-2 easing chỉ `--ease-*` — no inline cubic-bezier
- [ ] I-3 không `transition: all`
- [ ] I-4 màu qua `--wl-*`/`--p-*`/utilities — no hex trần (trừ carve-out WebGL/Canvas2D)
- [ ] I-5 type qua `--text-*`
- [ ] I-6 radius/hairline qua `--radius-*`/`--line-w`
- [ ] I-9 layout qua `--container-*`/`--section-pad-y-*`
- [ ] `useReducedMotion()` honored + fallback tĩnh (mọi section + knot)
- [ ] artifact bọc `ErrorBoundary` (`@landing/ui`)
- [ ] render dưới `data-theme="infra"` không layout-shift
- [ ] nội dung props-hoá, không hardcode chuỗi/giá trị trong markup (để harvest sau ≤ ½ ngày)

## 9. Harvest-later (rule of three)

- Tạo `docs/ideas/harvest-log.md` (chưa tồn tại) — ghi mỗi `kind` lặp + theme/template dùng nó.
Sau Waitlist, các `kind` đáng đếm: `hero`, `proof/backers`, `cta`, `faq`, `footer`, `stats`,
và **artifact 3D** (lần dùng này: surface `wireframe-flow`, shape `flow-knot`, palette `Ion`).
- Chưa tách gì sang `@landing/sections` tại story này. Khi 1 `kind` chạm 3 template → mới harvest.
- Reference đã có: `docs/ideas/reference/3d-artifact-surfaces.md` (6 bề mặt + lookbook).

## 10. Đơn vị (isolation) — mỗi unit một nhiệm vụ


| Unit                         | Làm gì                                                                        | Dùng sao                           | Phụ thuộc                                                 |
| ---------------------------- | ----------------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------- |
| `template.tsx`               | compose root + theme + gọi `useReducedMotion()` 1 lần, truyền `reduced` xuống | `<WaitlistTemplate/>`              | tất cả components                                         |
| `flow-knot.tsx`              | render artifact 3D, nhận `reduced`                                            | `<FlowKnot reduced/>`              | three, `use-scroll-progress`, `@landing/ui` ErrorBoundary |
| `lib/use-scroll-progress.ts` | scroll fraction 0..1                                                          | `const p = useScrollProgress(ref)` | React                                                     |
| `lib/use-in-view.ts`         | IntersectionObserver bool                                                     | `const seen = useInView(ref)`      | React                                                     |
| `lib/waitlist-email.ts`      | validate email (pure)                                                         | `validateEmail(v) → {ok, error}`   | zod                                                       |
| mỗi `components/*.tsx`       | một section, nhận `reduced` + props nội dung                                  | `<Perks reduced items={…}/>`       | reveal/stat-number                                        |


Dependency flow: `components/ → lib/` (chiều thuận); `lib/` KHÔNG import `components/`.

## 11. Kiểm thử / verification

- `pnpm build` + `pnpm lint` + `check-types` (turbo) xanh; `assert-type-coverage.mjs` pass
(gói mới có script `check-types`).
- Unit test `lib/waitlist-email.ts` (hợp lệ / sai / rỗng).
- Thủ công: `/templates/waitlist` render; toggle `prefers-reduced-motion` → fallback tĩnh đúng;
WebGL off → blob tĩnh; submit email hợp lệ → trạng thái confirm; sai → lỗi sau touched.
- Catalog: `buildCatalog()` không ném; `EXACT_TEMPLATES`/`MAX_TOTAL` mới khớp.

## 12. Ngoài phạm vi (YAGNI)

- Backend lưu email / gửi mail / double opt-in — chỉ chừa chỗ cắm.
- Tách block sang `@landing/sections` — đợi rule-of-three.
- INVARIANT linter tự động (grep hex) — vẫn review-level; ứng viên tương lai.
- i18n, dark/light toggle, A/B copy, GSAP.
- Sửa `infra.css` floor — chỉ *ghi nhận* token thiếu, không mở rộng trong story này.

## 13. Câu hỏi mở (không chặn bắt đầu)

- Có cắt 3 section flourish (Transform/gauge/globe) thành story con riêng không, hay làm 1 lần?
- `harvest-log.md` đặt cột gì để đếm rule-of-three thuận tiện nhất? (đề xuất: `kind | template | path | ngày`)
- Knot scroll-driven khi artifact fixed full-bleed: lấy progress theo toàn trang hay theo từng
section pin? (đề xuất: toàn trang, như demo.)

