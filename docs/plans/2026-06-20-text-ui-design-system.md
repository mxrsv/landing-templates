# Text UI Design System — typography floor + primitives + refactor

**Spec**: [SPEC.md](../../SPEC.md)
**Goal**: Refactor toàn bộ text UI thành một typography system có chủ đích (Inter, slash eyebrow), với token + primitives + rules để AI agent không tự bịa style khi vibe-coding.
**Architecture**: Mở rộng token floor ở `@landing/design-tokens` (tracking/weight/leading + `--font-sans`=Inter), xây 4 text primitive trong `@landing/ui` đọc token, rồi thay hết call-site hand-roll bằng primitive/token. Enforcement bằng INVARIANT mở rộng (review-enforced, không CI lint). Một font duy nhất Inter, không mono.

## 1. Kết quả mong đợi

- Token typography mới có trong `base.css` — verify bằng `grep -E "tracking-(tight|normal|label|wide)|weight-(regular|medium|semibold)|leading-(none|tight|snug|normal)" packages/design-tokens/src/base.css` ra đủ 4+3+4 dòng.
- Font toàn site = Inter — verify bằng `grep -n "Inter" apps/docs/app/layout.tsx` có match và `grep -n "Geist" apps/docs/app/layout.tsx` rỗng.
- 4 primitive export được — verify bằng `grep -E "components/text" packages/ui/package.json` có entry và `pnpm --filter @landing/ui check-types` xanh.
- 0 chỗ hand-roll eyebrow trong apps/docs + packages/ui — verify bằng `grep -rn "tracking-\[" apps/docs packages/ui/src --include="*.tsx" | grep -v node_modules` ra 0 dòng.
- 0 hardcoded `letter-spacing` literal trong packages/sections — verify bằng `grep -rn "letter-spacing: [-0-9]" packages/sections/src --include="*.css"` ra 0 dòng.
- INVARIANT có I-5 mở rộng + I-10 — verify bằng `grep -E "I-10|tracking|weight|leading" packages/design-tokens/INVARIANT.md` có match.
- Prototype đã xoá — verify bằng `test ! -d apps/docs/app/dev/text-system && echo gone`.
- Toàn repo xanh — verify bằng `pnpm build && pnpm lint && pnpm check-types`.

## 2. Nguồn dữ liệu chuẩn

**Canonical data**: token typography là nguồn duy nhất ở [base.css](../../packages/design-tokens/src/base.css) `:root`. Look của mỗi text role là nguồn duy nhất ở primitive trong [packages/ui/src/components/text/](../../packages/ui/src/components/text/).

**Lấy từ**: quyết định đã chốt ở [SPEC.md](../../SPEC.md) + verdict ở [NOTES.md](../../apps/docs/app/dev/text-system/NOTES.md). Giá trị token đã validate visual ở prototype `text-system.css` (biến `--ts-*`).

**KHÔNG lấy từ**: các literal `tracking-[…]` / `letter-spacing:` rải rác trong code cũ — chúng chính là thứ đang loạn, không phải nguồn chuẩn.

## 3. Business rules & invariants

- **Một font duy nhất**: chỉ Inter qua `--font-sans`. KHÔNG thêm mono/display face — verify bằng `grep -rn "font-mono\|Geist_Mono\|--font-geist" apps/docs packages` ra 0 (trừ comment lịch sử).
- **Eyebrow một treatment**: mọi label đi qua `<Eyebrow>` (slash micro-tag, case thường) — verify bằng grep `tracking-[` = 0 ở app/ui.
- **Token-only typography**: section/app không hardcode letter-spacing/font-size px/weight số (trừ carve-out shader/canvas trong INVARIANT) — verify bằng grep ở section 1.
- **Không đổi giá trị type scale cũ**: chỉ THÊM dimension mới (`--tracking-*`, `--weight-*`, `--leading-*`, `--font-sans`); KHÔNG sửa `--text-h2|display|...` — verify bằng `git diff packages/design-tokens/src/base.css` không có dòng `--text-*` bị xoá/đổi giá trị.
- **Primitive đọc token, không nhận style tự do**: prop chỉ là biến thể hẹp (`level`, `size`, `marker`) — verify bằng đọc interface từng primitive, không có prop `fontSize`/`tracking`/`weight`.

## 4. Phạm vi / Ngoài phạm vi

**Làm**:

- Thêm token tracking/weight/leading + `--font-sans`=Inter vào `base.css`.
- Đổi font site sang Inter (`layout.tsx` + `globals.css`).
- Xây `<Eyebrow>` `<Heading>` `<Body>` `<Caption>` trong `@landing/ui` + export.
- Mở rộng `INVARIANT.md` (I-5 + I-10 + acceptance).
- Thay 8 eyebrow call-site apps/docs + 1 ở `@landing/ui` filter-group sang `<Eyebrow>`.
- Tokenize hardcoded `letter-spacing` ở 10 file sections CSS.
- Xoá prototype route `app/dev/text-system`.

**KHÔNG làm**:

- KHÔNG thêm CI/stylelint gate (đã chốt review-enforced).
- KHÔNG đổi giá trị type scale, palette `--p-*`, hay theme files.
- KHÔNG đổi behavior/layout section ngoài thuộc tính typography.
- KHÔNG thêm `<Stat>`/`<Label>` primitive ở vòng này (để sau nếu cần).
- KHÔNG bỏ uppercase ở stat-label sections (chỉ tokenize letter-spacing, giữ nguyên look) — quyết định đổi look stat để epic sau.

## 5. Rủi ro & Quyết định còn mở

**Đã chốt có rủi ro**:

- `--tracking-wide: 0.08em` dùng để tokenize các uppercase label cũ (giá trị gốc 0.1–0.24em) → các label đó sẽ HẸP lại đôi chút so với hiện tại. Rủi ro: thay đổi visual nhẹ ở vài section. Chấp nhận vì mục tiêu là nhất quán; nếu lệch nhiều ở section nào, ghi chú lại trong commit.
- Đổi Geist → Inter toàn site: heading/body sẽ đổi mặt chữ đồng loạt. Rủi ro: vài chỗ canh chỉnh thị giác (kích thước cảm nhận) hơi khác; chấp nhận, không tinh chỉnh per-section ở epic này.
- `letter-spacing` âm trong sections (vd `-0.03em`, `-0.16px`) map về `--tracking-tight: -0.02em` → một số heading nhích nhẹ. Chấp nhận, đây là gom về thang chuẩn.

**Chưa chốt cần resolve**: không còn — các open question của spec đã default xong (xem section 4 + Task 1).

## 6. Các task

### Task 1: Thêm token typography vào base.css

**File(s)**:

- [base.css](../../packages/design-tokens/src/base.css)

**Decision**: Thêm 3 nhóm token (tracking/weight/leading) vào `:root`, KHÔNG sửa các `--text-*` cũ. KHÔNG khai báo `--font-sans` ở đây để tránh double-source — font role giữ ở `globals.css @theme` (nơi đã wire `next/font` variable), xử lý ở Task 3.

**Build**:

- Trong `:root` (ngay dưới khối `--- type scale ---`), thêm:
  - tracking: `--tracking-tight: -0.02em;` `--tracking-normal: 0;` `--tracking-label: 0.02em;` `--tracking-wide: 0.08em;`
  - weight: `--weight-regular: 400;` `--weight-medium: 500;` `--weight-semibold: 600;`
  - leading: `--leading-none: 1;` `--leading-tight: 1.12;` `--leading-snug: 1.35;` `--leading-normal: 1.6;`
- Thêm comment 1 dòng mỗi nhóm (giải thích dùng cho role nào), theo phong cách comment có sẵn trong file.
- KHÔNG đụng khối `@theme inline` (không thêm font ở đây).

**Verify**:

- `grep -E "tracking-(tight|normal|label|wide)" packages/design-tokens/src/base.css` → 4 dòng.
- `grep -E "weight-(regular|medium|semibold)|leading-(none|tight|snug|normal)" packages/design-tokens/src/base.css` → 7 dòng.
- `git diff packages/design-tokens/src/base.css` → không có dòng `--text-*` nào bị đổi giá trị.

---

### Task 2: Mở rộng INVARIANT.md (I-5 + I-10 + acceptance)

**File(s)**:

- [INVARIANT.md](../../packages/design-tokens/INVARIANT.md)

**Decision**: I-5 bao gồm cả weight/leading/tracking; thêm I-10 "Text via primitives"; cập nhật allowed token vocabulary + acceptance template.

**Build**:

- Sửa dòng I-5: mô tả "Type/weight/leading/tracking đều từ token scale", thêm ví dụ Wrong `letter-spacing: 0.2em` / `font-weight: 600` → Right `var(--tracking-label)` / `var(--weight-semibold)`.
- Thêm row I-10: "**Text via primitives** — eyebrow/heading/body/caption render qua `@landing/ui` text primitive; cấm hand-roll chuỗi `text-[…] tracking-[…] uppercase`." Wrong: chuỗi class label tự viết; Right: `<Eyebrow>…</Eyebrow>`.
- Trong "Allowed token vocabulary": thêm dòng `tracking --tracking-tight|normal|label|wide`, `weight --weight-regular|medium|semibold`, `leading --leading-none|tight|snug|normal`, `font --font-sans`.
- Trong "Acceptance template" §3: thêm 2 checkbox: I-5 mở rộng (weight/leading/tracking) + I-10 (text qua primitive).
- Thêm 1 dòng note: font hệ thống là Inter, một font duy nhất, không mono.

**Verify**:

- `grep -E "I-10|--tracking|--weight|--leading|primitive" packages/design-tokens/INVARIANT.md` → có match cho từng từ khoá.

---

### Task 3: Đổi font site sang Inter

**File(s)**:

- [layout.tsx](../../apps/docs/app/layout.tsx)
- [globals.css](../../apps/docs/app/globals.css)

**Decision**: Thay `Geist` + `Geist_Mono` bằng `Inter` (next/font/google), biến `--font-inter`. Gỡ `--font-mono` khỏi globals.

**Build**:

- `layout.tsx`: đổi import thành `import { Inter } from "next/font/google";`; `const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });`; trên `<html>` đổi `className` dùng `inter.variable` (bỏ `geistSans.variable`/`geistMono.variable`).
- `globals.css`: trong `@theme`, đổi `--font-sans: var(--font-inter);`; XOÁ dòng `--font-mono: var(--font-geist-mono);`; ở rule `body`/root đổi `font-family: var(--font-inter), system-ui, sans-serif;`.

**Verify**:

- `grep -n "Geist" apps/docs/app/layout.tsx` → rỗng.
- `grep -n "Inter\|--font-inter" apps/docs/app/layout.tsx` → có match.
- `grep -n "font-mono\|geist" apps/docs/app/globals.css` → rỗng.

---

### Task 4: Tạo primitive Eyebrow + barrel + export

**File(s)**:

- [eyebrow.tsx](../../packages/ui/src/components/text/eyebrow.tsx)
- [index.ts](../../packages/ui/src/components/text/index.ts)
- [package.json](../../packages/ui/package.json)

**Decision**: `<Eyebrow>` = slash micro-tag (Inter, case thường, dấu `/` màu primary, `--tracking-label`, `--p-ink-2`), prop `marker?: boolean` (default true) để tắt dấu `/`. Theo style class pattern của `badge.tsx` (`[...].filter(Boolean).join(" ")`, KHÔNG dùng `cn`).

**Build**:

- `eyebrow.tsx`: `export interface EyebrowProps extends HTMLAttributes<HTMLSpanElement> { marker?: boolean }`. Render `<span>` với class: `inline-flex items-center gap-[var(--space-2)]`, `text-[length:var(--text-eyebrow)] font-medium`, `tracking-[var(--tracking-label)] leading-[var(--leading-none)]`, `text-[var(--p-ink-2)]`. Khi `marker` (default true) prepend `<span aria-hidden className="font-semibold text-[var(--p-primary)]">/</span>`.
- `index.ts`: `export { Eyebrow } from "./eyebrow";` (sẽ bổ sung Heading/Body/Caption ở task sau).
- `package.json`: thêm export `"./components/text": "./src/components/text/index.ts"`.

**Verify**:

- `grep -n "components/text" packages/ui/package.json` → có entry.
- `pnpm --filter @landing/ui check-types` → xanh.

---

### Task 5: Tạo primitive Heading

**File(s)**:

- [heading.tsx](../../packages/ui/src/components/text/heading.tsx)
- [index.ts](../../packages/ui/src/components/text/index.ts)

**Phụ thuộc**: Task 4

**Decision**: `<Heading level={1|2|3} as?>` map level → token: 1=`--text-display`/`--leading-tight`/`--tracking-tight`, 2=`--text-h2`/`--leading-tight`/`--tracking-tight`, 3=`--text-h3`/`--leading-snug`/`--tracking-normal`. Default `weight-semibold`. `as` override tag semantic (default `h{level}` cho 2/3, `h1` cho 1).

**Build**:

- `heading.tsx`: `interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> { level: 1 | 2 | 3; as?: "h1"|"h2"|"h3"|"p" }`. `const LEVEL_CLASS: Record<1|2|3, string>` chứa class token tương ứng + `font-semibold text-[var(--p-ink)]`. Render tag = `as ?? \`h${level}\``.
- `index.ts`: thêm `export { Heading } from "./heading";`.

**Verify**:

- `pnpm --filter @landing/ui check-types` → xanh.
- `grep -n "Heading" packages/ui/src/components/text/index.ts` → có dòng export.

---

### Task 6: Tạo primitive Body + Caption

**File(s)**:

- [body.tsx](../../packages/ui/src/components/text/body.tsx)
- [caption.tsx](../../packages/ui/src/components/text/caption.tsx)
- [index.ts](../../packages/ui/src/components/text/index.ts)

**Phụ thuộc**: Task 4

**Decision**: `<Body size="default"|"lead" as?>` — default: `--text-body`/`--leading-normal`/`--p-ink-2`; lead: `--text-h3`/`--leading-snug`/`--p-ink`. `<Caption>` — `--text-caption`/`--leading-snug`/`--p-ink-3`. Cả hai `--tracking-normal`, render `<p>` mặc định (`as` override).

**Build**:

- `body.tsx`: `interface BodyProps extends HTMLAttributes<HTMLParagraphElement> { size?: "default"|"lead"; as?: "p"|"span"|"div" }`; map size → class token.
- `caption.tsx`: `interface CaptionProps extends HTMLAttributes<HTMLParagraphElement> { as?: "p"|"span" }`.
- `index.ts`: thêm `export { Body } from "./body";` và `export { Caption } from "./caption";`.

**Verify**:

- `pnpm --filter @landing/ui check-types` → xanh.
- `grep -cE "Eyebrow|Heading|Body|Caption" packages/ui/src/components/text/index.ts` → 4.

---

### Task 7: Refactor eyebrow ở catalog components

**File(s)**:

- [poster-thumb.tsx](../../apps/docs/components/catalog/poster-thumb.tsx)
- [piece-source-panel.tsx](../../apps/docs/components/catalog/piece-source-panel.tsx)
- [gallery-grid.tsx](../../apps/docs/components/catalog/gallery-grid.tsx)

**Phụ thuộc**: Task 4

**Decision**: Thay chuỗi class eyebrow hand-roll bằng `<Eyebrow>` import từ `@landing/ui/components/text`. Giữ nguyên nội dung text + vị trí.

**Build**:

- Mỗi file: thêm `import { Eyebrow } from "@landing/ui/components/text";`.
- Thay phần tử mang class `text-[length:var(--text-eyebrow)] … tracking-[…] uppercase` bằng `<Eyebrow className={…nếu cần spacing margin}>…nội dung…</Eyebrow>`. Chuyển margin/spacing thừa qua `className`.
- Xoá `uppercase`/`tracking-[…]` literal.

**Verify**:

- `grep -n "tracking-\[" apps/docs/components/catalog/poster-thumb.tsx apps/docs/components/catalog/piece-source-panel.tsx apps/docs/components/catalog/gallery-grid.tsx` → rỗng.

---

### Task 8: Refactor eyebrow ở shell sidebar + ui filter-group

**File(s)**:

- [catalog-sidebar.tsx](../../apps/docs/components/shell/catalog-sidebar.tsx)
- [filter-group.tsx](../../packages/ui/src/components/filter-group.tsx)

**Phụ thuộc**: Task 4

**Decision**: Cả hai dùng `<Eyebrow>`. `filter-group.tsx` nằm trong `@landing/ui` → import từ đường dẫn nội bộ `./text` (cùng package).

**Build**:

- `catalog-sidebar.tsx`: import `Eyebrow` từ `@landing/ui/components/text`, thay legend/label eyebrow.
- `filter-group.tsx`: import `{ Eyebrow } from "./text";`, thay `<legend className="…tracking-[0.1em]…uppercase">` bằng `<Eyebrow as=... />` (giữ tag `legend` nếu cần semantic — nếu Eyebrow không hỗ trợ `legend`, bọc `<legend><Eyebrow marker={false}>…</Eyebrow></legend>`).

**Verify**:

- `grep -n "tracking-\[" apps/docs/components/shell/catalog-sidebar.tsx packages/ui/src/components/filter-group.tsx` → rỗng.

---

### Task 9: Refactor eyebrow ở ui gallery pages

**File(s)**:

- [shapes/page.tsx](<../../apps/docs/app/(shell)/ui/shapes/page.tsx>)
- [surfaces/page.tsx](<../../apps/docs/app/(shell)/ui/surfaces/page.tsx>)
- [surfaces-gallery.tsx](<../../apps/docs/app/(shell)/ui/surfaces/surfaces-gallery.tsx>)

**Phụ thuộc**: Task 4

**Decision**: Thay eyebrow hand-roll bằng `<Eyebrow>`. Trong `surfaces-gallery.tsx` chỗ eyebrow đang nằm trong `<span>` badge-like — dùng `<Eyebrow marker={false}>` nếu không muốn dấu `/`.

**Build**:

- Mỗi file thêm import `Eyebrow` từ `@landing/ui/components/text`, thay chuỗi class eyebrow tương ứng, xoá `uppercase`/`tracking-[…]`.

**Verify**:

- `grep -rn "tracking-\[" "apps/docs/app/(shell)/ui/shapes/page.tsx" "apps/docs/app/(shell)/ui/surfaces/page.tsx" "apps/docs/app/(shell)/ui/surfaces/surfaces-gallery.tsx"` → rỗng.

---

### Task 10: Refactor eyebrow ở dev theme-switch page

**File(s)**:

- [theme-switch/page.tsx](../../apps/docs/app/dev/theme-switch/page.tsx)

**Phụ thuộc**: Task 4

**Decision**: Thay eyebrow `tracking-[0.3em]` bằng `<Eyebrow>`. Đây là dev page nhưng vẫn nằm trong scope "0 hand-roll".

**Build**:

- Thêm import `Eyebrow`, thay phần tử `<p className="…tracking-[0.3em]…uppercase">` bằng `<Eyebrow>`.

**Verify**:

- `grep -n "tracking-\[" apps/docs/app/dev/theme-switch/page.tsx` → rỗng.

---

### Task 11: Tokenize letter-spacing — nhóm aikit core

**File(s)**:

- [aikit-features.css](../../packages/sections/src/aikit-features/aikit-features.css)
- [aikit-pricing.css](../../packages/sections/src/aikit-pricing/aikit-pricing.css)
- [aikit-hero.css](../../packages/sections/src/aikit-hero/aikit-hero.css)

**Decision**: Map mỗi literal `letter-spacing` → token theo quy tắc: giá trị âm → `var(--tracking-tight)`; `0`–`0.03em` → `var(--tracking-normal)`; `> 0.03em` (uppercase label) → `var(--tracking-wide)`. Đơn vị `px` quy đổi tương đương rồi map theo cùng quy tắc.

**Build**:

- Thay từng dòng `letter-spacing: <literal>;` bằng `letter-spacing: var(--tracking-*);` đúng theo quy tắc trên. Không đổi thuộc tính khác.

**Verify**:

- `grep -n "letter-spacing: [-0-9]" packages/sections/src/aikit-features/aikit-features.css packages/sections/src/aikit-pricing/aikit-pricing.css packages/sections/src/aikit-hero/aikit-hero.css` → rỗng.

---

### Task 12: Tokenize letter-spacing — aikit còn lại + stat-strip

**File(s)**:

- [aikit-testimonial.css](../../packages/sections/src/aikit-testimonial/aikit-testimonial.css)
- [aikit-gallery.css](../../packages/sections/src/aikit-gallery/aikit-gallery.css)
- [token-stats-strip.css](../../packages/sections/src/token-stats-strip/token-stats-strip.css)

**Decision**: Cùng quy tắc map như Task 11. `token-stats-strip.css` giữ uppercase, chỉ tokenize letter-spacing (`0.14em`→wide, `0.06em`→wide, `-0.03em`→tight).

**Build**:

- Thay từng `letter-spacing: <literal>;` bằng token tương ứng.

**Verify**:

- `grep -n "letter-spacing: [-0-9]" packages/sections/src/aikit-testimonial/aikit-testimonial.css packages/sections/src/aikit-gallery/aikit-gallery.css packages/sections/src/token-stats-strip/token-stats-strip.css` → rỗng.

---

### Task 13: Tokenize letter-spacing — marquee + memecoin

**File(s)**:

- [community-marquee.css](../../packages/sections/src/community-marquee/community-marquee.css)
- [memecoin-hero-ticker.css](../../packages/sections/src/memecoin-hero-ticker/memecoin-hero-ticker.css)

**Decision**: Cùng quy tắc map như Task 11.

**Build**:

- Thay từng `letter-spacing: <literal>;` bằng token tương ứng.

**Verify**:

- `grep -n "letter-spacing: [-0-9]" packages/sections/src/community-marquee/community-marquee.css packages/sections/src/memecoin-hero-ticker/memecoin-hero-ticker.css` → rỗng.

---

### Task 14: Tokenize letter-spacing — gamefi + character

**File(s)**:

- [gamefi-hud-hero.css](../../packages/sections/src/gamefi-hud-hero/gamefi-hud-hero.css)
- [character-showcase.css](../../packages/sections/src/character-showcase/character-showcase.css)

**Decision**: Cùng quy tắc map như Task 11.

**Build**:

- Thay từng `letter-spacing: <literal>;` bằng token tương ứng.

**Verify**:

- `grep -n "letter-spacing: [-0-9]" packages/sections/src/gamefi-hud-hero/gamefi-hud-hero.css packages/sections/src/character-showcase/character-showcase.css` → rỗng.

---

### Task 15: Xoá prototype + verify toàn cục

**File(s)**:

- [text-system/](../../apps/docs/app/dev/text-system/)

**Phụ thuộc**: Task 1–14

**Decision**: Xoá cả thư mục prototype (route + NOTES.md + screenshots tạm ở root repo) sau khi mọi quyết định đã fold vào code thật.

**Build**:

- Xoá thư mục `apps/docs/app/dev/text-system/`.
- Xoá các file screenshot tạm ở root: `text-system-*.png`, `ts2-*.png`, `font-*.png`, `f3-*.png` (nếu chưa gitignore).
- Chạy grep-gate toàn cục + build/lint/types.

**Verify**:

- `test ! -d apps/docs/app/dev/text-system && echo gone` → `gone`.
- `grep -rn "tracking-\[" apps/docs packages/ui/src --include="*.tsx" | grep -v node_modules` → rỗng.
- `grep -rn "letter-spacing: [-0-9]" packages/sections/src --include="*.css"` → rỗng.
- `pnpm build && pnpm lint && pnpm check-types` → tất cả xanh.
