# Overhaul — Phase 2: Fork định vị (tổng hợp 2 lens)

> 2026-06-29 · Tổng hợp `Product Manager` (lens nội bộ) + `Trend Researcher` (lens thị trường).
> ⚠️ **Hai lens BẤT ĐỒNG ở câu cốt lõi** — doc này không che, mà chỉ ra chỗ giao để hành động được ngay.
> Cần chủ repo ratify mục §3. Plan: [`01-roadmap.md`](./01-roadmap.md) · State: [`00-baseline.md`](./00-baseline.md).

## TL;DR

Hai lens cãi nhau về **identity** (Web3-only vs multi-vertical) — nhưng **việc cần làm ngắn hạn thì GIỐNG HỆT nhau**. Nên: ratify mấy quyết định GIỮ/CẮT cụ thể (cả 2 lens đều ủng hộ) và **hoãn** câu identity (vì internal-first, chưa cần khoá).

## 1. Chỗ BẤT ĐỒNG (trung thực)

|                          | `Product Manager` (nội bộ)                                                                 | `Trend Researcher` (thị trường)                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Fork**                 | **Web3-only** — thu hẹp để sâu (conf 75%)                                                  | **Multi-vertical** — fork theo _trục định vị_ chứ không theo vertical (conf 70%)                       |
| **Lý do chính**          | Solo + moat=chất lượng → breadth giết nhanh; moat của 1 người = độ sâu craft trong 1 niche | Moat (craft/assembly) **vertical-agnostic** → bó vào Web3 vứt đòn bẩy moat mà không mua thêm phòng thủ |
| **Về Web3 niche**        | Niche đã đủ rộng aesthetic (memecoin/GameFi/NFT/DeFi/infra) để giữ 1 quality bar           | Web3 là **bẫy giá trị**: buyer memecoin chuộng tốc độ > craft → đổ craft vào nơi không trả cho craft   |
| **Drift aikit/waitlist** | Bằng chứng giả, nên cắt                                                                    | Đa dạng hoá bề mặt craft đúng hướng, không phải lỗi                                                    |

> Cả hai **đều ~70-75%** và ngược chiều → đây là **judgment call thật về identity sản phẩm**, không có đáp án máy móc. Đó là quyết định của chủ repo.

## 2. Chỗ GIAO NHAU (cả 2 lens đồng ý — hành động được ngay)

- **Moat = craft/assembly/motion/no-lock-in.** Trục định vị phải là _"assembly-grade, copy-source, no-lock-in full-landing"_, KHÔNG phải "liệt kê vertical". (Trend nói thẳng; PM ngụ ý qua "1 quality bar".)
- **`aikit` hiện tại yếu dưới CẢ HAI thesis:** nó là **clone** pixel (không phải craft gốc → không showcase được moat) + off-system. PM: cắt. Trend: muốn giữ "multi-vertical" nhưng một _clone_ không chứng minh được craft → vẫn phải rework/đưa khỏi gallery. ⇒ **Cắt aikit khỏi catalog dù chọn fork nào.**
- **Value-prop:** đơn vị copy = **full template / section**, UI-block là _emergent_ (harvest rule-of-three). Khớp model đã khoá `templates-first/harvest-later`. ⇒ đừng register 5 UI slug rỗng.
- **Helix vs Strata:** 💡 cả hai đều là landing **liquid-restaking** (PM phát hiện) → catalog curated không cần 2 flagship trùng vertical → ship **một** (Helix, gần stack nhất), lane kia harvest.
- **NFT:** Web3-valid, focal đã build sẵn (`glass-shape`/`artifact-surface`) → build thật sau; gỡ skeleton + 2 section vapor khỏi catalog now.
- **`status` field + fix bug §1:** phải làm dù chọn gì.

→ **Then chốt: identity chưa cần quyết để chạy tiếp.** Vì internal-first, quyết "Web3-only vs multi-vertical" là **one-way door** — low-regret nhất là **giữ optionality**: làm hết phần GIAO NHAU, hoãn câu identity tới khi có tín hiệu thật.

## 3. Quyết định cụ thể để RATIFY (cả 2 lens ủng hộ)

| #   | Quyết định              | Default đề xuất                                                                                                           | Đụng file                                                   |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| B1  | **aikit**               | 🔴 Gỡ khỏi catalog/manifest/registrations; **giữ source** làm harvest                                                     | `manifest.ts`, `piece-registrations.ts`, `templates-aikit/` |
| B2  | **NFT skeleton**        | 🟡 Gỡ 2 slug vapor (`nft-gallery-grid`, `mint-countdown`) + package rỗng khỏi catalog; giữ mood `nft` reserved; build sau | `manifest.ts`, `templates-nft/`                             |
| B3  | **Restaking**           | 🟢 Productionize **Helix** làm flagship duy nhất; **shelve Strata** (harvest caustics)                                    | `docs/specs/...helix.md`, `proto/restake/`                  |
| B4  | **Value-prop**          | "copy full template/section"; UI-layer = `status: planned`, không register rỗng                                           | `types.ts` (+`status`)                                      |
| B5  | **mood enum**           | Giữ Web3-semantic + thêm `defi`; thêm `status`+`offSystem`; **KHÔNG** genericize                                          | `types.ts`                                                  |
| B6  | **Identity** (deferred) | Trục **craft/assembly/no-lock-in**, Web3 = beachhead hiện tại, **giữ optionality** — chưa khoá Web3-only                  | (chỉ positioning, chưa đụng code)                           |

**Điều kiện lật về Web3-only sắc** (Trend): chỉ khi chuyển sang **monetize public + cần SEO/distribution nhanh** trong 1-2 quý → lúc đó cần wedge sắc (nhưng nên là _"motion/assembly-grade"_ hoặc niche **thưởng-craft** như premium SaaS/founder, KHÔNG phải memecoin).

## 4. Wedge / positioning one-liner (từ Trend — chọn sau)

1. **"Assembly-grade landing Pieces — copy the source, own the motion."** (shadcn ownership + Aceternity wow, ở tầng full-landing theo mood).
2. **"Framer-grade motion, but it's React you own."** (đánh khe hở Framer lock-in vs shadcn trơ).
3. **"The premium tier ThemeForest forgot — mood-organized, motion-native, no bloat, no lock-in."**

## 5. Landscape (gọn)

Không đối thủ nào nắm trọn 3 trục: **copy-source** (shadcn/Aceternity/Cruip/Tailwind Plus) · **assembly thật** (Aceternity/Magic/Framer) · **full-landing theo mood** (gần như trống). Aceternity Pro mạnh motion nhưng dừng ở _component_ + 1 aesthetic dark-SaaS. Cruip/Tailwind Plus full-landing nhưng _ít motion_. Framer motion tốt nhưng _lock-in_. Web3-landing bằng code rất mỏng (Crypgo + Figma kits) — nhưng under-served vì thị trường đó _không trả cho craft_, không phải vì chưa ai nghĩ ra.
