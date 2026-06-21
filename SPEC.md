# Spec: Text UI Design System — typography floor + primitives + agent rules

> Status: DRAFT — chờ human review trước khi sang PLAN/IMPLEMENT.
> Ngày: 2026-06-20. Liên quan: `packages/design-tokens/INVARIANT.md` (I-5),
> memory `ion-skin-token-signal` (infra token floor quá mỏng → cần mở rộng).

## Objective

**Cái gì:** Refactor toàn bộ text UI của catalog `landing-page-list` thành một
hệ thống typography có chủ đích — thay cho kiểu style "AI tự generate" (label
uppercase + `letter-spacing` rộng + xám nhạt vô hồn, ví dụ chữ `TEMPLATES`).

**Tại sao:** Hiện không có token cho `letter-spacing` / `font-weight` /
`line-height` / font-role, và không có text primitive trong `@landing/ui`. Hệ
quả: mỗi lần vibe-coding, AI agent **tự bịa** giá trị. Cùng một label "eyebrow"
đang tồn tại với ≥ 5 tracking khác nhau (`0.1 / 0.14 / 0.2 / 0.25 / 0.3em`) và
sections CSS hardcode hàng chục `letter-spacing` (`-0.03em`, `0.06em`, `-0.1px`,
`0.24px`…). Đây là nguồn bất nhất quán lớn nhất của catalog.

**User:** (a) chính chủ dự án khi vibe-coding template mới — cần "rào" để agent
không đi lạc; (b) AI agent — cần primitive + rule rõ ràng để dùng đúng;
(c) người xem catalog — nhận một typography mạch lạc, premium, không "templated".

**Success = (testable):**

- [ ] Không còn `tracking-[...]` arbitrary và `letter-spacing: <literal>` nào
      trong `apps/docs` + `packages/sections` (trừ carve-out shader/canvas).
      Verify: `grep -rn "tracking-\[\|letter-spacing:" apps/docs packages/sections
--include="*.tsx" --include="*.css"` → 0 dòng vi phạm.
- [ ] Mọi eyebrow/label render qua `<Eyebrow>` của `@landing/ui` với **một**
      treatment duy nhất (slash micro-tag, Inter). 0 chỗ hand-roll chuỗi
      `text-[length:var(--text-eyebrow)] … tracking-[…] uppercase`.
- [ ] `pnpm build` + `pnpm lint` + `check-types` xanh.
- [ ] `INVARIANT.md` có rule text mới (I-5 mở rộng + I-10) + acceptance checkbox.
- [ ] Tất cả call-site cũ (8+ eyebrow + ~6 sections CSS) đã chuyển sang
      primitive/token mới — codebase nhất quán 100%.

## Tech Stack

- Monorepo **pnpm + turbo**, Next.js (xem `AGENTS.md`: bản Next có breaking
  changes — đọc `node_modules/next/dist/docs/` trước khi code).
- **Tailwind v4** (`@import "tailwindcss"` + `@theme inline`), không có
  `tailwind.config.js` cổ điển — token bridge ở `packages/design-tokens/base.css`.
- Font: **Inter** (một font duy nhất, không mono) qua `next/font/google` →
  CSS var `--font-sans`. CHỐT ở prototype `app/dev/text-system` (xem NOTES.md).
  Chú ý: `app/layout.tsx` hiện đang load Geist Sans/Mono → PLAN thay bằng Inter.
- Packages liên quan: `@landing/design-tokens`, `@landing/ui`, `@landing/sections`,
  `@landing/tailwind-config`, các `@landing/templates-*`.

## Commands

```bash
# Cài đặt
pnpm install

# Dev preview (theo memory dev-server-pattern: preview phục vụ từ apps/docs)
PORT=3000 pnpm dev

# Build / type-check / lint toàn repo (KHÔNG dùng `pnpm exec`)
pnpm build
pnpm check-types       # hoặc: pnpm run check-types
pnpm lint              # whole-repo lint

# Verify refactor sạch (custom grep — chạy thủ công, xem Success Criteria)
grep -rn "tracking-\[" apps/docs packages/sections --include="*.tsx"
grep -rn "letter-spacing:" apps/docs packages/sections --include="*.css"
```

> Cập nhật mục này nếu tên script thực tế trong `package.json` gốc khác (PLAN sẽ
> xác minh `build` / `lint` / `check-types` / `dev` trước khi implement).

## Project Structure

```
packages/design-tokens/
  src/base.css            → FLOOR: thêm tracking / weight / leading / font-role tokens
  INVARIANT.md            → thêm rule text mới (I-5 mở rộng + I-10) + acceptance

packages/ui/src/
  components/             → đã có button/card/badge/tabs/input/tooltip/checkbox
    text/                 → MỚI: text primitives
      heading.tsx         → <Heading level={1|2|3} as?>
      eyebrow.tsx         → <Eyebrow>  (slash micro-tag, Inter)
      body.tsx            → <Body size="default|lead">
      caption.tsx         → <Caption>
      text.tsx            → (tuỳ chọn) primitive cơ sở dùng chung
      index.ts
  index.ts                → re-export text primitives

apps/docs/                → REFACTOR call-site eyebrow sang <Eyebrow>:
  app/(shell)/ui/shapes, /surfaces, /surfaces/surfaces-gallery
  app/dev/theme-switch
  components/shell/catalog-sidebar
  components/catalog/{poster-thumb, piece-source-panel, gallery-grid}

packages/sections/src/    → REFACTOR hardcoded letter-spacing sang token:
  token-stats-strip/, aikit-features/, aikit-pricing/, … (audit toàn bộ)
```

## Code Style

**Token mới (đề xuất — PLAN chốt giá trị cuối):** gom sự loạn về số tối thiểu.

```css
/* packages/design-tokens/src/base.css  (thêm vào :root) */

/* --- font role (MỘT font — Inter, không mono) ---------- */
--font-sans: var(--font-inter), system-ui, sans-serif;

/* --- letter-spacing (gom 8 giá trị loạn → 3) ----------- */
--tracking-tight: -0.02em; /* display / heading lớn   */
--tracking-normal: 0; /* body, mặc định          */
--tracking-label: 0.02em; /* eyebrow slash micro-tag */

/* --- font-weight --------------------------------------- */
--weight-regular: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;

/* --- line-height --------------------------------------- */
--leading-none: 1; /* label / stat            */
--leading-tight: 1.12; /* display / heading       */
--leading-snug: 1.35; /* subhead / h3            */
--leading-normal: 1.6; /* body                    */
```

**Eyebrow treatment đã chốt = slash micro-tag** (Inter, case thường — KHÔNG
uppercase, dấu dẫn `/` màu primary, tracking calm, màu `--p-ink-2`):

```tsx
// packages/ui/src/components/text/eyebrow.tsx — DUY NHẤT 1 nơi định nghĩa look
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[var(--space-2)]",
        "text-[length:var(--text-eyebrow)] font-medium",
        "tracking-[var(--tracking-label)] leading-[var(--leading-none)]",
        "text-[var(--p-ink-2)]",
        className,
      )}
    >
      <span aria-hidden className="font-semibold text-[var(--p-primary)]">
        /
      </span>
      {children}
    </span>
  );
}
// Dùng: <Eyebrow>Templates</Eyebrow>  → render:  / Templates  (Inter, case thường)
```

**Quy ước:**

- Component text **đa hình** qua prop `as` (vd `<Heading as="h2" level={1}>`) để
  tách style khỏi semantic tag.
- Primitive đọc token, **không** nhận `fontSize`/`tracking`/`weight` tự do từ
  ngoài (chỉ nhận biến thể đã định nghĩa: `level`, `size="default|lead"`).
- `cn()` / class util theo pattern hiện có của `@landing/ui` (PLAN xác minh có
  sẵn helper hay không; nếu không, dùng template literal như các component khác).
- Naming: `kebab-case` file, `PascalCase` component, prop biến thể là union hẹp.

## Testing Strategy

- **Không có** test framework runtime cho UI ở repo này hiện tại → chiến lược
  **verify bằng build + lint + grep + visual**, khớp cách INVARIANT đang được
  enforce (review-enforced, build-gate).
- **Gate tự động:** `pnpm build` + `pnpm check-types` + `pnpm lint` phải xanh sau
  mỗi task refactor (turbo cache theo package).
- **Grep-gate (anti-regression):** sau refactor, các lệnh grep ở Success Criteria
  phải trả 0 vi phạm. Đây là "test" chính cho mục tiêu nhất quán.
- **Visual check:** `PORT=3000 pnpm dev`, mở các trang đã refactor
  (`/(shell)/ui/surfaces`, catalog sidebar, poster thumb) — xác nhận eyebrow mới
  render đúng treatment, không layout shift, đọc được dưới `data-theme` áp dụng.
  Theo memory `dev-server-pattern`: Playwright MCP không toggle được reduced-motion
  → các thuộc tính đó verify bằng đọc code.
- **Nếu PLAN quyết thêm test:** chỉ cân nhắc unit test thuần cho helper (vd hàm
  map `level → token`) — không kéo cả test runner vào nếu chưa có.

## Boundaries

**Always do:**

- Token mới chỉ sống ở `packages/design-tokens/src/base.css` (single source).
- Mọi eyebrow/heading/body/caption đi qua primitive `@landing/ui`.
- Chạy `pnpm build && pnpm lint && pnpm check-types` trước khi coi 1 task là xong.
- 1 task = 1 commit riêng (rollback an toàn — theo `react-patterns` rule).
- Đọc `node_modules/next/dist/docs/` khi đụng API Next (theo `AGENTS.md`).

**Ask first:**

- Thay đổi **giá trị** type scale hiện có (`--text-h2`, `--text-display`…) — chỉ
  THÊM dimension mới, không sửa số cũ trừ khi được duyệt.
- Thêm dependency mới (vd lib `cn`/clsx nếu repo chưa có).
- Thêm font thứ 2 (display/mono riêng) — đã CHỐT một font Inter; muốn thêm phải hỏi.
- Thêm CI lint rule tự động (user đã chọn review-enforced, KHÔNG CI gate ở vòng này).

**Never do:**

- Hand-roll lại chuỗi `text-[…] tracking-[…] uppercase` cho label — luôn dùng
  `<Eyebrow>`.
- Hardcode `letter-spacing` / `font-size` px / `font-weight` số trong section/app
  (trừ carve-out shader/canvas đã ghi trong INVARIANT).
- Sửa giá trị `--p-*` palette hay đụng theme files trong scope này.
- Xoá/đổi behavior section ngoài phần typography.

## Plan (high-level — chi tiết ở Phase 2)

1. **Mở rộng floor** — thêm tracking/weight/leading/font-role tokens vào
   `base.css`; map utility nếu cần. (Nền cho mọi bước sau.)
2. **Cập nhật INVARIANT** — mở rộng I-5 (type+weight+leading+tracking) + thêm
   I-10 "Text via primitives"; thêm acceptance checkbox.
3. **Đổi font sang Inter** — thay Geist Sans/Mono trong `app/layout.tsx` bằng
   `Inter` (`next/font/google` → `--font-inter`); map `--font-sans`.
4. **Xây text primitives** — `@landing/ui/src/components/text/` (Eyebrow,
   Heading, Body, Caption) + export.
5. **Refactor apps/docs** — 8+ call-site eyebrow → `<Eyebrow>`; headings/body
   sang primitive nơi hợp lý.
6. **Refactor packages/sections** — thay hardcoded `letter-spacing` bằng token;
   label → primitive. Audit từng section file.
7. **Verify & dọn** — grep-gate 0 vi phạm, build/lint/types xanh, visual check.

Thứ tự bắt buộc: 1 → 2 → 3 → 4 trước; 5 và 6 có thể song song sau khi 4 xong.

## Open Questions

1. Giá trị token cuối: `--tracking-label` = 0.02em (đã chốt ở prototype). Có cần
   `--tracking-wide` riêng cho stat-strip uppercase không, hay bỏ hẳn uppercase?
2. Bộ primitive: 4 cái (Eyebrow/Heading/Body/Caption) đủ chưa, hay cần thêm
   `<Stat>` / `<Label>` (token-stats-strip đang có text role riêng)?
3. `<Heading>` có cần variant `display` riêng (level 0) cho hero không?
4. Dấu dẫn `/` của Eyebrow: render qua component (như trên) hay cho phép tắt qua
   prop `marker={false}` ở vài chỗ?
5. `cn()`/class helper — repo đã có chưa, hay primitive dùng template literal
   thuần như các component `@landing/ui` hiện tại?
