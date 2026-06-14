# Harvest log — theo dõi "rule of three"

Sổ ghi mỗi `kind` (loại piece tái dùng được) xuất hiện ở template nào. Mục đích: phát hiện
khi một `kind` chạm **3 template khác nhau** → lúc đó mới harvest sang `@landing/sections`
(hoặc `@landing/ui` nếu là primitive). Trước ngưỡng 3, để nguyên tại template — tránh trừu
tượng hoá non.

**Cách dùng:** mỗi lần thêm/clone template, ghi từng `kind` của nó vào bảng dưới (một dòng
một lần dùng). Khi gom đủ 3 dòng cùng `kind` ở 3 template khác nhau → tạo task harvest.

**Phạm vi:** log này theo dõi _tiến về phía trước_ kể từ Waitlist. Template trước đó (Ternus,
các epic memecoin) **chưa back-fill** — nếu cần đếm chính xác ngưỡng 3 thì bổ sung sau.

> Reference bề mặt 3D: [`reference/3d-artifact-surfaces.md`](./reference/3d-artifact-surfaces.md)
> (6 surface + lookbook). Mô hình sản xuất: [`template-factory.md`](./template-factory.md).

## Bảng theo dõi

| kind             | template         | path                                                             | ngày       |
| ---------------- | ---------------- | ---------------------------------------------------------------- | ---------- |
| hero             | waitlist (Aenor) | `packages/templates-waitlist/src/components/hero.tsx`            | 2026-06-14 |
| proof/backers    | waitlist (Aenor) | `packages/templates-waitlist/src/components/backers.tsx`         | 2026-06-14 |
| cta              | waitlist (Aenor) | `packages/templates-waitlist/src/components/closing-cta.tsx`     | 2026-06-14 |
| email-capture    | waitlist (Aenor) | `packages/templates-waitlist/src/components/email-form.tsx`      | 2026-06-14 |
| faq              | waitlist (Aenor) | `packages/templates-waitlist/src/components/faq.tsx`             | 2026-06-14 |
| footer           | waitlist (Aenor) | `packages/templates-waitlist/src/components/waitlist-footer.tsx` | 2026-06-14 |
| stats (count-up) | waitlist (Aenor) | `packages/templates-waitlist/src/components/stats.tsx`           | 2026-06-14 |
| trust/badges     | waitlist (Aenor) | `packages/templates-waitlist/src/components/trust.tsx`           | 2026-06-14 |
| perks/feature-3  | waitlist (Aenor) | `packages/templates-waitlist/src/components/perks.tsx`           | 2026-06-14 |
| artifact-3D      | waitlist (Aenor) | `packages/templates-waitlist/src/components/flow-knot.tsx`       | 2026-06-14 |

`artifact-3D` lần dùng này: surface **`wireframe-flow`**, shape **`flow-knot`** (TorusKnot),
palette **`Ion`**.

## Flourish (showpiece — candidate kind, chưa chắc tái dùng)

Ba piece "wow" của Waitlist; đếm riêng vì còn nghi vấn có lặp ở template khác không. Nếu một
trong số chạm 2 template nữa thì nâng lên bảng chính.

| kind (candidate)     | template         | path                                                           | ngày       |
| -------------------- | ---------------- | -------------------------------------------------------------- | ---------- |
| sticky-showpiece     | waitlist (Aenor) | `packages/templates-waitlist/src/components/transform.tsx`     | 2026-06-14 |
| metric-gauge (SVG)   | waitlist (Aenor) | `packages/templates-waitlist/src/components/latency-gauge.tsx` | 2026-06-14 |
| reach-globe (Canvas) | waitlist (Aenor) | `packages/templates-waitlist/src/components/reach-globe.tsx`   | 2026-06-14 |
