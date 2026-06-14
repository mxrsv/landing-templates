# Template Factory — templates-first, harvest-later

> Idea one-pager · 2026-06-14 · repo `landing-page-list`
> Locked decisions from idea-refine session. Đây là kim chỉ nam sản xuất, không phải spec.

## Problem Statement

Làm sao ra template landing **đẹp + nhanh** trên một hệ nền chung, mà KHÔNG rơi vào
"mỗi template một codebase" — khi ưu tiên _ra template trước, tách block sau_?

## Locked Decisions

- **Mục tiêu:** nội bộ trước, public sau → đầu tư vào _hệ nền_ để CÓ THỂ public, chưa làm storefront.
- **Mô hình sản xuất:** Hybrid `clone → chắt lọc → compose`. Clone template ngoài CHỈ là nguyên liệu thô.
- **Thứ tự:** **templates-first, harvest-later** (rule of three) — không thiết kế block library upfront.
- **Thước đo "chặt chẽ + đẹp":** cả 4 (wow / tốc độ / độ phủ / chất lượng) → để **hệ thống gánh**, không phải con người gánh từng template.

## Recommended Direction

Build **full template** ngay (NFT → polish → Waitlist) như các sản phẩm JTBD cụ thể.
Mỗi template **bắt buộc extraction-ready**. Việc tách block (taxonomy `kind×variant`, harvest ritual)
**dời từ "làm ngay" → "làm khi 1 `kind` lặp ở 3 template"** (rule of three).

Lực ép để "tách sau" thật sự xảy ra:

1. Kỷ luật **extraction-ready** (xem dưới) — bắt buộc ngay.
2. File `docs/ideas/harvest-log.md` ghi block lặp + theme/template dùng nó.
3. Trigger **rule-of-three**: 1 `kind` (hero/pricing/proof/cta/faq/footer) xuất hiện ở 3 template → tách vào `@landing/sections`.

### Extraction-ready (điều kiện KHÔNG thương lượng ngay từ bây giờ)

Khác biệt giữa "tách sau làm trong 1 giờ" và "tách sau = viết lại":

- Ăn token, **không hex thô**.
- Props hoá, **không hardcode** nội dung/giá trị.
- `useReducedMotion` gate trên mọi motion.
- Cấm `transition: all`; spacing theo 4/8px grid.

> ⚠️ **Rủi ro #1: "tách sau" = "không bao giờ"** nếu thiếu lực ép.
> Bằng chứng đã có: `aikit` + `chip-connect` clone xong, chưa cái nào harvest thành block.
> Template build bẩn → tách sau thành rewrite → không ai làm → debt "mỗi template một codebase".

## Resolved Choices

- **Theme Waitlist:** `theme-infra` (calm/premium/trustworthy — hợp "đưa email cho tôi"). Swap được sau; cũng là phép thử rẻ cho giả định "theme tái dùng được".
- **Rule-of-three trigger:** `kind` lặp ở **3** template.
- **INVARIANT enforcement:** **script grep nhẹ (Node)** quét `.css`/`.tsx` → cắm turbo `check` + CI, fail-fast. (ESLint AST gượng với CSS; nâng stylelint sau nếu cần.)

## Key Assumptions to Validate

- [ ] **Bạn sẽ thực sự quay lại tách.** _Test:_ sau Waitlist, lift 1 block (vd CTA) sang `@landing/sections` — nếu >½ ngày là template chưa đủ sạch.
- [ ] **Token floor đủ biểu đạt.** _Test:_ build Waitlist chỉ bằng token hiện có; đếm số token phải đẻ thêm (nhiều = floor thiếu).
- [ ] **Budget cap ≤16 không nổ sớm.** _Test:_ NFT + Waitlist thêm bao nhiêu slug vào `manifest.ts` (đang gần trần) → cần đổi budget từ "tổng ≤16" sang "đủ chiều sâu mỗi `kind`".

## MVP Scope

**IN:** đóng Epic 7 (NFT: `nft-gallery-grid`, `mint-countdown`, `/templates/nft`) → Epic 8 polish →
**template Waitlist mới** trên `theme-infra`. Mỗi cái extraction-ready. Tạo `harvest-log.md`. Script INVARIANT linter.
**OUT:** refactor taxonomy `kind×variant` · tách skin toàn bộ · template-as-data · visual-regression nặng · storefront/pricing.

## Not Doing (và vì sao)

- **Taxonomy `kind×variant` upfront** — chưa đủ template để biết abstraction đúng; trừu tượng sớm = đoán sai.
- **Tách skin toàn bộ** — chi phí cao, mỗi template còn chọn 1 theme là đủ.
- **Storefront / pricing / license** — "nội bộ trước, public sau".
- **Visual-regression hạ tầng** — nặng, chưa tới ngưỡng; chỉ giữ INVARIANT linter nhẹ.

## Open Questions (chưa chặn việc bắt đầu)

- Khi rule-of-three kích hoạt: ai/đâu giữ "registry" tên `kind` để biết đã lặp 3×? (gợi ý: cột trong `harvest-log.md`).
- Đổi `manifest.ts` budget lúc nào — ngay khi NFT+Waitlist đẩy gần trần, hay đợi nổ?
