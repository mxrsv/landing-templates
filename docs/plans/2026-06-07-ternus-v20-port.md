# Port Ternus landing template lên v20 (React/Next.js)

**Spec (nguồn design đã duyệt)**: [demo-v20.html](../../_bmad-output/brainstorming/demo-v20.html)
**Ràng buộc đã lock**: [RESUME.md](../../_bmad-output/brainstorming/RESUME.md)
**Goal**: Cập nhật bản port React hiện có (đang theo v19) trong [src/templates/ternus](../../src/templates/ternus) lên đúng design v20: scrollytelling How-it-works, section Build (terminal), Ecosystem dựng lại, hero bỏ pipeline + tinh chỉnh PixelBlast, motif threefold, thêm font mono.
**Architecture**: Giữ nguyên kiến trúc hiện tại — component-per-section dưới `components/`, hook dưới `lib/`, CSS scoped `.tn` trong [ternus.css](../../src/templates/ternus/ternus.css), font qua `next/font/google`. Tái dùng tối đa các primitive đã có (`Mark`, `Reveal`, `StatNumber`, `useInView`, `useReducedMotion`). Chỉ thêm 1 hook mới (`useScrollProgress`) và 1 component mới (`BuildTerminal`). Mỗi section = 1 commit để rollback từng bước.

## 1. Kết quả mong đợi

- Route `/ternus` render đủ 6 section đúng thứ tự: Nav → Hero → How it works (scrollytelling) → Build (terminal) → Ecosystem → Token → Closing CTA → Footer — verify bằng mở `http://localhost:3000/ternus` sau `pnpm dev`.
- Project build sạch, không lỗi type — verify bằng `pnpm build` (Next 16 chạy type-check trong build) exit code 0.
- How-it-works là scrollytelling: cuộn qua section thấy pulse chạy dọc rail 3 lớp, layer active highlight, copy đổi theo phase, 3 stat count-up ở cuối — verify visual tại `http://localhost:3000/ternus` cuộn chậm qua `#how`.
- Section Build có terminal 3 tab (`network`/`deploy`/`wallet`) bấm chuyển được + nút copy hoạt động — verify visual: click từng tab thấy nội dung đổi, click "copy" thấy đổi thành "copied".
- Ecosystem: 6 card monogram riêng (N·H·O·M·C·L), KHÔNG còn `Mark` trùng, stats nằm hàng header, không còn `panel` bo viền — verify visual + `grep -c "Mark" src/templates/ternus/components/ecosystem.tsx` trả về 0.
- Bật `prefers-reduced-motion` không vỡ layout, mọi animation tắt/collapse — verify bằng DevTools Rendering → emulate `prefers-reduced-motion: reduce`, cuộn `#how` thấy diagram tĩnh đọc được.

## 2. Nguồn dữ liệu chuẩn

**Canonical data**: Markup, copy text, design tokens, và hành vi JS lấy nguyên từ [demo-v20.html](../../_bmad-output/brainstorming/demo-v20.html) — đây là bản design đã được duyệt trong phiên brainstorm.

**Lấy từ**:

- Cấu trúc/CSS tokens hiện có trong [ternus.css](../../src/templates/ternus/ternus.css) (đã khớp v19, giữ nguyên `:root` tokens).
- API props thật của [PixelBlast.tsx](../../src/components/pixel-blast/PixelBlast.tsx) (đã đọc: `color`, `pixelSize`, `patternScale`, `patternDensity`, `edgeFade`, `speed`, `enableRipples`, `rippleSpeed`, `rippleThickness`, `autoPauseOffscreen`, `transparent`...).
- Ràng buộc design trong [RESUME.md](../../_bmad-output/brainstorming/RESUME.md).

**KHÔNG lấy từ**:

- Số liệu/copy "thật" của một Ternus thật — đây là TEMPLATE, dùng copy plausible trong demo (đã chốt trong RESUME).
- Bản [demo.html](../../_bmad-output/brainstorming/demo.html) v19 cũ (đã bị v20 thay thế ở các section liên quan).

## 3. Business rules & invariants

- **prefers-reduced-motion**: mọi animation (PixelBlast, scrollytelling, count-up, reveal, crystal) phải có nhánh tắt — verify bằng emulate reduced-motion, không animation nào chạy.
- **CSS scoped `.tn`**: không thêm selector global; mọi rule mới nằm dưới `.tn` — verify bằng `grep -nE "^[[:space:]]*(body|html|\*|:root)" src/templates/ternus/ternus.css` không tăng so với hiện tại (chỉ `:root` tokens được phép, vốn đã có).
- **Cam (`--orange`) chỉ 1-2 chỗ có nghĩa**: chỉ dùng cho "live dot" badge và "settled" moment trong scrollytelling — verify bằng `grep -c "var(--orange)" src/templates/ternus/ternus.css` ≤ 4.
- **Threefold motif**: mỗi eyebrow có `Mark` 3-nét + index dạng mono; scrollytelling có ring số 1·2·3 — verify visual mỗi eyebrow có 3 vạch + chữ `0x / 03`.
- **Component-per-section, file nhỏ**: mỗi file < 400 dòng; component lớn tách hook/sub — verify bằng `wc -l` từng file mới < 400.

## 4. Phạm vi / Ngoài phạm vi

**Làm**:

- Thêm font `JetBrains_Mono` + bổ sung Inter weights `200`/`300` trong [template.tsx](../../src/templates/ternus/template.tsx).
- Thêm CSS var `--tn-mono` + style cho `.eyebrow .idx` (motif threefold) trong [ternus.css](../../src/templates/ternus/ternus.css).
- Sửa nav + footer links cho khớp khung v20.
- Hero: bỏ `HeroPipeline`, tinh chỉnh props PixelBlast cho calm.
- Viết hook `useScrollProgress` + viết lại `HowItWorks` thành scrollytelling.
- Thêm component `BuildTerminal` + đăng ký vào template.
- Viết lại `Ecosystem` theo design v20.
- Dọn code chết: xoá [hero-pipeline.tsx](../../src/templates/ternus/components/hero-pipeline.tsx) + CSS không dùng.

**KHÔNG làm**:

- Không sửa home page [src/app/page.tsx](../../src/app/page.tsx) hay [template-card.tsx](../../src/components/template-card.tsx).
- Không đổi `:root` design tokens (màu, type scale, spacing) — đã chốt từ v19.
- Không thêm lib animation (Framer Motion) — tự code bằng hook hiện có.
- Không đổi `Token` / `ClosingCta` / `TernusFooter` về nội dung (chỉ chỉnh eyebrow/links nếu cần motif).
- Không tạo số liệu/RPC thật.

## 5. Rủi ro & Quyết định còn mở

**Đã chốt có rủi ro**:

- Giữ `PixelBlast` `enableRipples` (phản ứng con trỏ kiểu click-ripple) thay vì "hover-halo" như demo v20 vẽ tay — rủi ro: cảm giác tương tác hơi khác bản demo HTML; chấp nhận vì WebGL đẹp hơn và đã có sẵn.
- Track scrollytelling cao `360vh` (cuộn dài) — rủi ro: người nhạy cảm chuyển động mệt; giảm thiểu bằng nhánh reduced-motion collapse track về `auto`.
- Giữ `HeroCrystal` (octahedron 2D canvas) — rủi ro: hero có 2 canvas (PixelBlast WebGL + crystal 2D) cùng lúc, cần kiểm tra perf; chấp nhận vì crystal nhẹ và `autoPauseOffscreen`.

**Chưa chốt cần resolve**:

- Monogram Ecosystem dùng chữ cái (N·H·O...) hay icon line riêng từng project? Plan mặc định **chữ cái** (khớp demo v20); nếu muốn icon line thì phát sinh thêm 6 SVG.
- Category text Ecosystem (Perps, DEX, Bridge...) là tự bịa — cần user xác nhận giữ hay đổi.

## 6. Các task

### Task 1: Thêm font mono + Inter nhẹ + token threefold

**File(s)**:

- [template.tsx](../../src/templates/ternus/template.tsx)
- [ternus.css](../../src/templates/ternus/ternus.css)

**Decision**: Dùng `next/font/google` `JetBrains_Mono` (subset latin, weight 400/500) gán biến `--tn-mono`; bổ sung Inter weights `200`,`300` vào khai báo `Inter` hiện có; thêm style `.eyebrow` (flex, gap) + `.eyebrow .idx` (mono, ink-3) dưới `.tn`.

**Build**:

- Trong [template.tsx](../../src/templates/ternus/template.tsx): import `JetBrains_Mono` từ `next/font/google`, khởi tạo với `variable: "--tn-font-mono"`, weight `["400","500"]`; sửa mảng weight của `inter` thành `["200","300","400","500","600"]`; thêm class biến mono vào `div.tn` cùng `inter.variable`.
- Trong [ternus.css](../../src/templates/ternus/ternus.css): thêm `--tn-mono: var(--tn-font-mono), ui-monospace, monospace;` trong `:root` (dưới `.tn`); **mở rộng block `.tn .eyebrow` đã có sẵn tại `ternus.css:87` tại chỗ** (thêm `display:inline-flex; align-items:center; gap:11px` — KHÔNG tạo selector `.tn .eyebrow` trùng thứ hai); thêm mới sub-selector `.tn .eyebrow .idx { font:500 11px var(--tn-mono); letter-spacing:.1em; color:var(--ink-3) }`.

**Verify**:

- `pnpm build` exit 0.
- `grep -c "JetBrains_Mono" src/templates/ternus/template.tsx` → `1`.
- Mở `/ternus`, eyebrow bất kỳ hiển thị chữ index dạng monospace.

---

### Task 2: Sửa nav + footer links khớp khung v20

**File(s)**:

- [ternus-nav.tsx](../../src/templates/ternus/components/ternus-nav.tsx)
- [ternus-footer.tsx](../../src/templates/ternus/components/ternus-footer.tsx)

**Decision**: Nav links = `How it works (#how)`, `Build (#build)`, `Ecosystem (#ecosystem)`, `Token (#token)`, `Docs (#)`. Footer links = `How it works (#how)`, `Build (#build)`, `Token (#token)`, `GitHub (#)`, `Discord (#)`.

**Build**:

- Trong [ternus-nav.tsx](../../src/templates/ternus/components/ternus-nav.tsx): đổi mảng `navlinks` về đúng label/anchor trên (thay link "Technology"→"How it works" anchor `#how`, thêm `#build`).
- Trong [ternus-footer.tsx](../../src/templates/ternus/components/ternus-footer.tsx): cập nhật anchor cho khớp (thêm `#build`, đổi anchor cũ trỏ section không tồn tại).

**Verify**:

- `pnpm build` exit 0.
- Mở `/ternus`, click "Build" trên nav cuộn xuống đúng section terminal (sau khi Task 6 xong); trước đó click không lỗi console.

---

### Task 3: Hero — bỏ pipeline, tinh chỉnh PixelBlast cho calm

**File(s)**:

- [ternus-hero.tsx](../../src/templates/ternus/components/ternus-hero.tsx)
- [ternus.css](../../src/templates/ternus/ternus.css)

**Decision**: Xoá `<HeroPipeline />` và import của nó khỏi hero; giữ `<HeroCrystal />`. Tinh chỉnh props `PixelBlast`: `speed={0.15}`, `rippleSpeed={0.2}`, `patternDensity={0.5}` (chậm/êm hơn theo ràng buộc calm). Giữ `enableRipples`, `transparent`, `autoPauseOffscreen`.

**Build**:

- Trong [ternus-hero.tsx](../../src/templates/ternus/components/ternus-hero.tsx): xoá dòng `import { HeroPipeline }` và `<HeroPipeline />` ở cuối `.wrap`; sửa giá trị props PixelBlast như Decision.
- Trong [ternus.css](../../src/templates/ternus/ternus.css): không xoá CSS pipeline ở task này (để Task 8 dọn chung), chỉ kiểm tra hero còn cân đối khi thiếu pipeline (không cần đổi nếu `.pipeline` chỉ là khối con).

**Verify**:

- `pnpm build` exit 0.
- Mở `/ternus`, hero không còn dải pipeline 3-lane dưới crystal; mesh chạy chậm, êm.
- `grep -c "HeroPipeline" src/templates/ternus/components/ternus-hero.tsx` → `0`.

---

### Task 4: Hook useScrollProgress

**File(s)**:

- [use-scroll-progress.ts](../../src/templates/ternus/lib/use-scroll-progress.ts)

**Decision**: Hook nhận `RefObject<HTMLElement>`, trả `number` (0..1) = tiến độ cuộn qua section tính bằng `clamp(-rect.top / (rect.height - innerHeight), 0, 1)`; cập nhật trong `scroll` listener `passive` có `requestAnimationFrame` throttle; cleanup listener khi unmount; trả `1` khi `prefers-reduced-motion` (đọc qua `useReducedMotion`) — coi như đã hoàn tất để diagram hiện đầy đủ tĩnh, KHÔNG trả `0` (sẽ collapse diagram rỗng).

**Build**:

- Tạo [use-scroll-progress.ts](../../src/templates/ternus/lib/use-scroll-progress.ts): export `useScrollProgress(ref): number`. Dùng `useState<number>(0)`, `useEffect` gắn listener, `rafRef` chống dồn frame, `clamp` nội bộ. Nếu `reduced` → set `1` (coi như đã hoàn tất, để diagram hiện đầy đủ tĩnh).

**Verify**:

- `pnpm build` exit 0.
- `grep -c "export function useScrollProgress" src/templates/ternus/lib/use-scroll-progress.ts` → `1`.

---

### Task 5: Viết lại How-it-works thành scrollytelling

**File(s)**:

- [how-it-works.tsx](../../src/templates/ternus/components/how-it-works.tsx)
- [ternus.css](../../src/templates/ternus/ternus.css)

**Phụ thuộc**: Task 4

**Decision**: Section `#how` cao `360vh`, chứa stage `sticky top:0 height:100vh`. Layout 2 cột: trái = 3 khối `.phase` (chỉ phase active hiển thị, đổi theo progress: `<0.36`→0, `<0.72`→1, else 2) + eyebrow có `Mark` và index `0x / 03`; phải = rail 3 layer `.rl` (layer active có class `on`) + 1 pulse `#txpulse` chạy dọc + đường fill `#railFill`. Cuối stage có hàng `.scrolly-stats` dùng `StatNumber` (9400 / 0.001 dec3 / 1.2 dec1) hiện khi `progress>0.8`. Pulse đổi sang màu cam khi `progress>0.82` (settled moment). Dùng `useScrollProgress` cho ref section.

**Build**:

- Viết lại [how-it-works.tsx](../../src/templates/ternus/components/how-it-works.tsx): `"use client"`, ref section, `const p = useScrollProgress(ref)`, tính `phase`, style inline cho `top`/`height`/`opacity` của pulse + fill theo `p`, render 3 phase + rail + stats; reuse `Mark`, `StatNumber`; nhánh `reduced` (từ `useReducedMotion`) hiện tất cả phase tĩnh + fill 100%.
- Trong [ternus.css](../../src/templates/ternus/ternus.css): thêm block CSS scrollytelling (`.tn .scrolly`, `.scrolly-stage`, `.scrolly-grid`, `.scrolly-copy`, `.phase`, `.ph-k .ring`, `.rail`, `.rail-line i`, `.rl`, `.rl.on`, `#txpulse`, `.scrolly-stats`) — copy giá trị từ [demo-v20.html](../../_bmad-output/brainstorming/demo-v20.html) **block CSS scrollytelling tại dòng `449–685`** (selector `.scrolly` bắt đầu dòng 449, `.rl`/`.rl.on` dòng 566/593, `#txpulse`/`#txpulse.settled` dòng 625/637, `.scrolly-stats` dòng 642), prefix `.tn`. Thêm nhánh `@media (prefers-reduced-motion: reduce)` collapse `.scrolly` về `height:auto` và stage về `position:relative`.

**Verify**:

- `pnpm build` exit 0.
- Mở `/ternus`, cuộn chậm qua `#how`: pulse di chuyển, layer active đổi 1→2→3, copy đổi, stats count-up ở cuối.
- Emulate reduced-motion: section `#how` hiện diagram tĩnh đầy đủ, đọc được, không pin.
- `wc -l src/templates/ternus/components/how-it-works.tsx` < 400.

---

### Task 6: Section Build (terminal) — component mới + đăng ký

**File(s)**:

- [build-terminal.tsx](../../src/templates/ternus/components/build-terminal.tsx)
- [template.tsx](../../src/templates/ternus/template.tsx)
- [ternus.css](../../src/templates/ternus/ternus.css)

**Decision**: Component `BuildTerminal` render section `#build` layout `.split`: trái = eyebrow (Mark + "for developers") + h2 + 3 bước `01/02/03`; phải = terminal `.term` có `.term-bar` (3 dot + 3 tab `network`/`deploy`/`wallet` + nút copy) và 3 `.term-pane` (chỉ pane active hiển thị). State `useState<"rpc"|"deploy"|"wallet">("rpc")` cho tab — **lưu ý cố ý**: key nội bộ là `rpc` nhưng label hiển thị của tab đầu là `network` (khớp demo v20 `data-pane="rpc"` / text "network" tại dòng 1292), KHÔNG phải bug, đừng đổi key thành `network`. Nút copy dùng `navigator.clipboard.writeText` đọc text pane active, đổi label "copy"→"copied ✓" 1.4s. Nội dung code 3 pane lấy nguyên từ demo v20 (foundry.toml / forge create / addEthereumChain). Đăng ký `<BuildTerminal />` giữa `<HowItWorks />` và `<Ecosystem />` trong template.

**Build**:

- Tạo [build-terminal.tsx](../../src/templates/ternus/components/build-terminal.tsx): `"use client"`, state tab, handler copy (bọc try/catch, catch → label "select & ⌘C"), markup tab + pane, dùng `Mark`. Code trong pane để trong `<pre>` với các `<span className="...">` tô màu như demo (class `c`/`p`/`k`/`s`/`o`/`d`).
- Trong [template.tsx](../../src/templates/ternus/template.tsx): import `BuildTerminal`, chèn `<BuildTerminal />` sau `<HowItWorks />`.
- Trong [ternus.css](../../src/templates/ternus/ternus.css): thêm block `.tn #build .term`, `.term-bar`, `.term-tab`, `.term-tab.on`, `.term-copy`, `.term-body`, `.term-pane`, và các class màu `.term-body .c/.p/.k/.s/.o/.d` — copy từ [demo-v20.html](../../_bmad-output/brainstorming/demo-v20.html) **block CSS terminal tại dòng `687–785`** (`#build .term` dòng 687, `.term-bar` 694, `.term-tab`/`.term-tab.on` 713/729, `.term-body` 752, `.term-pane.on` 761, class màu `.c/.p/.k/.s/.o/.d` dòng 764–779), prefix `.tn`.

**Verify**:

- `pnpm build` exit 0.
- Mở `/ternus`, section Build hiển thị; click tab `deploy`/`wallet` đổi nội dung; click "copy" đổi thành "copied ✓".
- `grep -c "navigator.clipboard" src/templates/ternus/components/build-terminal.tsx` → `1`.

---

### Task 7: Viết lại Ecosystem (logo grid + stats header)

**File(s)**:

- [ecosystem.tsx](../../src/templates/ternus/components/ecosystem.tsx)
- [ternus.css](../../src/templates/ternus/ternus.css)

**Decision**: Bỏ `panel`, bỏ `Mark` trùng. Layout: `.eco-head` (grid `1fr auto`) = trái eyebrow + h2, phải `.eco-stats` 3 số (60+/3/100%) có vạch ngăn dọc. Dưới là `.eco-grid` (3 cột) gồm 6 `.eco-card`, mỗi card = `.eco-mono` (chữ cái đầu trong khung hairline) + tên + category. Data: mảng `{ mono, name, cat }` cho 6 project (Northwind/Perps & derivatives, Helix/DEX & liquidity, Orbit/Cross-chain bridge, Meridian/Lending & money market, Catalyst/Launchpad, Lattice/RPC & infra). Component không cần `"use client"` (tĩnh, hover bằng CSS).

**Build**:

- Viết lại [ecosystem.tsx](../../src/templates/ternus/components/ecosystem.tsx): xoá import `Mark`; định nghĩa `PARTNERS: { mono:string; name:string; cat:string }[]` và `STATS`; render `.eco-head` + `.eco-grid` map card.
- Trong [ternus.css](../../src/templates/ternus/ternus.css): thêm block `.tn #ecosystem .eco-head`, `.eco-stats`, `.eco-stats .es + .es` (border-left), `.eco-stats .en/.el`, `.eco-grid`, `.eco-card`, `.eco-card:hover`, `.eco-mono`, `.eco-name`, `.eco-cat` + responsive `@media (max-width:820px)` và `540px` — copy từ demo v20 (đã chỉnh), prefix `.tn`.

**Verify**:

- `pnpm build` exit 0.
- `grep -c "Mark" src/templates/ternus/components/ecosystem.tsx` → `0`.
- Mở `/ternus`, Ecosystem: 6 card monogram khác nhau, stats trên header, không còn card bo viền; hover card thấy viền sáng + nhấc nhẹ.

---

### Task 8: Dọn code chết (pipeline + CSS v19 không dùng)

**File(s)**:

- [hero-pipeline.tsx](../../src/templates/ternus/components/hero-pipeline.tsx)
- [ternus.css](../../src/templates/ternus/ternus.css)

**Phụ thuộc**: Task 3, Task 5, Task 7

**Decision**: Xoá file `hero-pipeline.tsx` (không còn ai import sau Task 3). Xoá các block CSS không còn dùng trong `ternus.css`: `.pipeline`/`.pipe-head`/`#pipe`, các class How-it-works cũ (`.stack`/`.layer`/`.flow`/`.pillars`/`.pillar`/`.layer-*`), Ecosystem cũ (`.panel`/`.logowall`/`.plogo`/`.ecostats`/`.es .en`/`.es .el` bản cũ), và `.stats`/`.stat` cũ NẾU không còn dùng (kiểm tra StatNumber trong scrollytelling có tái dùng class nào không trước khi xoá).

**Build**:

- Xoá [hero-pipeline.tsx](../../src/templates/ternus/components/hero-pipeline.tsx).
- Trong [ternus.css](../../src/templates/ternus/ternus.css): grep từng selector ở Decision, xoá block tương ứng. Trước khi xoá `.stats/.stat`, `grep -rn "className=\"stat" src/templates/ternus/components` xác nhận không component nào còn dùng.

**Verify**:

- `grep -rn "hero-pipeline\|HeroPipeline" src/templates/ternus` → không kết quả.
- `pnpm build` exit 0.
- Mở `/ternus`, tất cả section vẫn hiển thị đúng (không mất style do xoá nhầm).

---

### Task 9: Verify tổng thể (build + visual + reduced-motion + responsive)

**File(s)**:

- (không sửa file — chỉ kiểm tra)

**Phụ thuộc**: Task 1-8

**Decision**: Chạy verify cuối toàn trang trước khi coi là xong.

**Build**:

- Chạy `pnpm build`.
- Chạy `pnpm dev`, mở `/ternus`, cuộn toàn trang đọc từng section.
- DevTools: emulate `prefers-reduced-motion: reduce`, cuộn lại toàn trang.
- DevTools: thu hẹp viewport xuống 820px và 540px kiểm tra Ecosystem grid (3→2→1 cột) và hero-grid (2→1 cột).

**Verify**:

- `pnpm build` exit 0, không warning về hydration.
- Console tab không có error (trừ favicon nếu có).
- Reduced-motion: không animation nào chạy, scrollytelling tĩnh đọc được.
- Responsive: 540px → eco-grid 1 cột, hero crystal lên trên (order -1) như CSS hiện có.

---
