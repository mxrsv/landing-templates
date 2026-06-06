# RESUME — Ternus landing brainstorm (điểm vào cho phiên mới)

> Dán prompt này vào phiên mới: _"Đọc `_bmad-output/brainstorming/RESUME.md` rồi tiếp tục."_

## Đang làm gì

Brainstorm + thiết kế **landing page cho Ternus** — một **Ethereum Layer 2** (crypto). Mục tiêu: trông chuyên nghiệp/uy tín, animation calm, đồng bộ. Dùng pixel aesthetic từ `src/components/pixel-blast/PixelBlast.tsx`.

## Đang ở đâu (bước hiện tại)

✅ **User đã chốt 3 quyết định (2026-06-06)** — xem `## CHECKPOINT` mới nhất trong sổ cái:

1. **TEMPLATE tái dùng** (không phải sản phẩm thật) → không cần wedge/số liệu thật, tự viết copy plausible. 2 chặn lớn cũ KHÔNG còn áp dụng.
2. **GỘP Proof + Technology** → 1 section "How it works". Khung mới: `Nav → ① Hero → ② How it works → ③ Ecosystem → ④ Token → ⑤ Closing CTA → Footer`.
3. **Aesthetic = Technical / hairline tinh tế** (đã CHỐT, reference = `demo.html` v19).

**🔨 Đang làm:** implement thẳng thành template Next.js `src/templates/ternus/` (hero mesh = `PixelBlast` thật; crystal + pipeline + donut port canvas sang client comp; CSS scoped `.tn` giữ token v19; Inter qua next/font; có `prefers-reduced-motion`). Demo route `/ternus`, đăng ký ở `src/templates/index.ts`.

## 4 file (tất cả trong `_bmad-output/brainstorming/`)

| File                                       | Vai trò                                                                                       |
| ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `brainstorming-session-2026-06-05-1606.md` | **Sổ cái** — mọi quyết định locked + checkpoint (đọc mục `## CHECKPOINT` ở cuối để nắm nhanh) |
| `design-review-strategy-2026-06-05.md`     | Review đa agent (6 critic) + plan sửa 3 tầng + 5 gốc rễ "chưa ổn"                             |
| `wireframe.html`                           | Khung low-fi (đang chờ duyệt) — mở bằng local server để xem                                   |
| `demo.html`                                | Bản styled v19 (proxy, không phải production code)                                            |

## 2 chặn lớn cần USER trả lời (chưa có — quan trọng nhất)

1. **Wedge/USP thật** của Ternus là gì? (vertical: gaming/DeFi? cơ chế độc nhất: ZK/optimistic, sub-second finality? con số ownable?) → để viết headline sắc, thay "three layers" generic.
2. **Số liệu thật**: TPS/fee/finality, tokenomics, audit firm, backers — thay placeholder.

## Nguyên tắc/ràng buộc đã LOCK (đừng phá khi tiếp)

- Tone: calm / premium / trustworthy (KHÔNG degen). Motion phải **chậm & êm** (user dễ chóng mặt) + cần `prefers-reduced-motion`.
- Màu: **cyan-dominant** (#22d3ee) trên nền gần đen (#07070C); **cam (#fb923c) chỉ dùng cực ít, 1–2 chỗ có nghĩa**.
- Thẩm mỹ **hairline / thin-line**, font nhẹ (Inter 200–300 heading, 400 body).
- Pixel mesh **chỉ ở hero**; production dùng **`PixelBlast.tsx` thật** (WebGL), demo 2D chỉ là proxy.
- Identity spine: **"threefold / ba"** (Ternus = ba). Mark 3-nét; Apps→Ternus→Ethereum = 3 lớp.
- Text trên landing = **English**.
- Phải **khác Neon.com** (đã lấy cảm hứng nhưng không clone).

## Quy trình lên product (sau khi chốt khung + làm đẹp)

wireframe → spec/PRD (`/bmad-prd`) → implement Next.js + gắn `PixelBlast.tsx` thật.

## Lưu ý kỹ thuật

- Playwright từng kẹt lock; fix bằng `rm -f ~/Library/Caches/ms-playwright/mcp-chrome-ba9621a/Singleton*`. file:// bị chặn → chạy `python3 -m http.server` rồi mở `http://localhost:PORT/...`.
