# Design System v2 & Gallery Redesign — Design Spec

**Ngày:** 2026-06-12
**Trạng thái:** Approved qua brainstorm (visual companion session `.superpowers/brainstorm/7390-1781276873`)
**Scope:** Re-design UI + UX flow trên cả 3 tầng (token nền → component library → gallery shell), retrofit Ternus. KHÔNG đổi architecture: package boundaries, catalog schema/`PieceMeta`, copy mechanism giữ nguyên logic.

---

## 1. Bối cảnh & mục tiêu

Dự án `landing-page-list` (BMAD monorepo) đã xong Epic 1-4 phần dev: monorepo pnpm+turbo, token floor (`packages/design-tokens`), Ternus port (~20 components), gallery shell v1 + catalog registry. Vấn đề: thiếu design system bài bản — token floor chỉ có primitive (spacing/type/motion/palette/radius), không có semantic states/surfaces/component tokens; gallery shell v1 chưa có hệ thống; chưa có UX spec tổng thể.

**Mục tiêu (4 tiêu chí "xong"):**

1. Design system spec hoàn chỉnh — người build piece mới chỉ cần đọc là làm đúng.
2. Gallery shell mới (discovery-first, neutral chrome) chạy thật trên `apps/docs`.
3. Toàn bộ ~20 Ternus pieces retrofit sang chuẩn mới, không regression visual (so mắt thường), giữ locked constraints.
4. Filter đa trục + URL searchParams hoạt động (nuốt story 9.1 + 9.2 vào scope này).

**Ràng buộc giữ nguyên:**

- Package dependency flow: `apps/docs` → packages, không ngược.
- Tailwind 4 `@theme inline` cho runtime theme swap (gotcha đã học ở Epic 2).
- `prefers-reduced-motion` bắt buộc mọi piece animated (user bị motion sickness).
- Locked constraints của Ternus: cyan `#22d3ee` on near-black `#07070C`, orange chỉ 1-2 điểm nhấn, calm/slow motion, hairline aesthetic, Inter weights nhẹ, PixelBlast WebGL thật ở hero.
- Desktop-primary; mobile = không gãy, không cần tối ưu.
- Không automated visual regression ở v1.

---

## 2. Phương án thực thi: Token-first tuần tự (4 phase)

Đã cân nhắc 3 phương án (gallery-first, song song 2 track, token-first) — chọn **token-first tuần tự** vì mọi tầng trên đều tiêu thụ token; gallery shell trở thành reference implementation; retrofit Ternus thành việc cơ học khi vocabulary đã chốt.

| Phase | Package                     | Nội dung                                                                                  |
| ----- | --------------------------- | ----------------------------------------------------------------------------------------- |
| 1     | `packages/design-tokens`    | Token v2: surfaces, states, layout rhythm, component tokens, theme `chrome`, INVARIANT v2 |
| 2     | `packages/ui`               | 8 component dùng chung tiêu thụ component tokens                                          |
| 3     | `apps/docs`                 | Gallery shell mới: home + index discovery-first + detail, FilterBar + URL params          |
| 4     | `packages/templates-ternus` | Retrofit ~20 components, cuốn chiếu 3 nhóm                                                |

---

## 3. Phase 1 — Design System v2 (`packages/design-tokens`)

Nguyên tắc: **mở rộng, không đổi tên** — token cũ (`--space-*`, `--text-*`, `--ease-*`, `--duration-*`, `--p-*`, `--radius-*`, `--line-w`) giữ nguyên để Ternus không gãy trước retrofit.

### 3.1 Surfaces & semantic states

- `--surface-0..3` — elevation nền: 0 = page, 1 = card, 2 = popover/dropdown, 3 = modal. Mood override được.
- `--state-hover-bg`, `--state-active-bg`, `--state-focus-ring`, `--state-disabled-opacity` — mọi interactive element dùng chung.
- `--overlay` (scrim modal), `--border-default`, `--border-emphasis` (bổ sung cho `--line-w` hairline).

### 3.2 Layout rhythm

- `--container-sm/md/lg/max` — max-width chuẩn cho section content.
- `--section-pad-y-sm/md/lg` — nhịp padding dọc giữa các section trong template.
- Breakpoints theo Tailwind 4 default (`sm/md/lg/xl`); document rõ desktop-primary.

### 3.3 Component tokens

Tầng map (không phải giá trị mới): `--btn-bg/--btn-fg`, `--card-bg/--card-border`, `--tab-active-fg`, … chỉ map từ token nền/surface. Mood muốn đổi cá tính component thì override tầng này.

### 3.4 Theme `chrome` — neutral chrome cho gallery (hướng "Warm graphite")

Theme thứ 5, `data-theme="chrome"`, CHỈ dùng cho gallery shell, không vào catalog moods. Pieces render trong wrapper `data-theme={mood}` như hiện tại — chrome làm "khung tranh", không cạnh tranh với mood.

Đã chọn qua so sánh visual 3 hướng (Warm graphite / Mono sharp / Slate air) → **Warm graphite**:

- Palette zinc ấm: surface ramp tham chiếu `#101012 → #18181b → #202024 → #28282d`, borders `#26262a → #424249`, text `#fafafa / #d4d4d8 / #a1a1aa / #71717a`.
- Radius mềm 6-8px.
- Accent cam nhạt `#fbbf77` (cùng họ orange Ternus) — chỉ dùng cho: hành động chính (Copy), tab active underline, mood badge, focus ring, checkbox checked. Tối đa 1 solid-accent element mỗi khung nhìn.
- Giá trị hex trên là tham chiếu từ mockup đã duyệt; tinh chỉnh ±1 step khi implement được phép nếu giữ đúng cảm giác, contrast đạt WCAG AA cho text.

### 3.5 INVARIANT v2

Thêm 3 rule:

- **I-7** — interactive states qua `--state-*`, cấm tự chế hover/focus per-piece.
- **I-8** — surface qua `--surface-*`, cấm tự chế bg lồng nhau.
- **I-9** — section dùng `--container-*` / `--section-pad-*`, cấm max-width tự đặt.

Cập nhật acceptance template §3 tương ứng. INVARIANT v2 là acceptance gate cho mọi story từ Epic 10 trở đi.

---

## 4. Phase 2 — Component library (`packages/ui`)

8 component v1 (YAGNI — chỉ những gì gallery shell + pieces cần):

| Component                  | Variants/hành vi                                                       | Dùng ở đâu                     |
| -------------------------- | ---------------------------------------------------------------------- | ------------------------------ |
| `Button`                   | solid / ghost / icon; solid chỉ cho hành động chính                    | copy, filter actions, nav      |
| `Card`                     | preview area + meta footer; hover = `--border-emphasis` + play preview | piece card                     |
| `Badge`                    | mood (accent nhạt) / neutral; click = thêm filter                      | tags                           |
| `Tabs`                     | underline accent; Radix primitive                                      | preview ↔ code, multi-file    |
| `Checkbox` + `FilterGroup` | kèm count kết quả; AND logic giữa groups                               | sidebar filter                 |
| `Input`                    | search, ⌘K shortcut; lọc client-side                                   | tìm piece                      |
| `EmptyState`               | icon + message + action thoát                                          | catalog rỗng, filter 0 kết quả |
| `Tooltip`                  | surface-3, Radix, delay 300ms                                          | giải thích deps/tags           |

**Quy ước:**

- Style 100% qua component tokens — component không biết mình ở theme nào.
- Mỗi component 1 file, stateless tối đa.
- Cấm FM/GSAP ở tầng này — chỉ CSS transition với named easing.
- `Tabs`/`Tooltip` dùng Radix primitives (headless) — không tự viết focus-trap/aria.
- Focus ring + keyboard navigation chuẩn trên mọi interactive component.

**Không làm v1:** Dialog/Modal, DropdownMenu, Toast — chưa có chỗ dùng.

---

## 5. Phase 3 — Gallery shell (`apps/docs`)

North star: lai **discovery-first (21st.dev)** làm khung + **copy-UX chặt (shadcn)** ở detail + showcase đậm trong card/detail preview. Đã chọn qua wireframe 3 phương án → **B. Discovery-first**.

### 5.1 Home — cổng vào, không phải landing dài

- Nav: logo + UI / Sections / Templates + ⌘K.
- Hero 1 dòng ("Landing sections you can actually copy") + sub-line đếm pieces/moods/stack.
- Search input ⌘K.
- 4 ô mood entry (infra/neon/game/nft) kèm số piece — click = vào index pre-filtered.
- Hàng featured (3 card preview live). Hết — không sales copy.
- Catalog rỗng → EmptyState thay featured.

### 5.2 Index `/ui`, `/sections`, `/templates` — sidebar filter + grid

- Sidebar trái: 4 trục filter (mood / use-case / stack / animation), checkbox + count, AND logic.
- Trên grid: số kết quả + chips filter active (click ✕ để bỏ).
- Filter state sync URL searchParams (`?mood=infra&stack=gsap`) — share được link (nuốt story 9.1 + 9.2).
- Grid 2-3 cột tuỳ viewport; card hover = border accent + play preview (tôn trọng reduced-motion).
- 0 kết quả → EmptyState + nút xoá filter.
- `/templates` giữ pre-filter UX theo mood (kế thừa story 4.1).

### 5.3 Detail `/[layer]/[slug]`

- Breadcrumb ← layer / slug.
- Header: tên + badges (mood/stack/deps có tooltip) + nút **Copy code** (solid accent — hành động chính duy nhất trên trang).
- Tabs: Preview / từng file source (copyMode multi) — copyMode single thì chỉ Preview + Code.
- Toolbar phải: fullscreen + viewport switcher (xem responsive).
- Preview render trong wrapper `data-theme={piece.mood[0]}`, full-bleed, ErrorBoundary + reduced-motion như INVARIANT.
- **Copy mechanism giữ nguyên Epic 4**: RSC `fs.readFile` theo `sourcePaths`, single = 1 file + header deps + CSS nối cuối, multi = copy từng file; Clipboard API denied → fallback select-all. Chỉ thay UI bọc ngoài.
- Slug sai/sai layer → 404 graceful (giữ từ story 4.3).

---

## 6. Phase 4 — Ternus retrofit (cuốn chiếu 3 nhóm)

Mỗi nhóm = 1 story riêng (rollback an toàn từng commit):

1. **Nhóm 1 — nền:** layout primitives, section wrappers, typography → `--container-*`, `--section-pad-*`.
2. **Nhóm 2 — interactive:** buttons, links, cards, nav trong Ternus → `--state-*`, component tokens.
3. **Nhóm 3 — WebGL/motion:** PixelBlast, hero-crystal, netstrip, aurora → chỉ surface/spacing quanh canvas, **không đụng shader/logic animation**.

- So sánh trước/sau bằng mắt trên 2 route song song; `/templates/ternus` giữ bản cũ tới khi nhóm 3 xong.
- Locked constraints là acceptance criteria từng story.
- Sau retrofit, mọi piece Ternus pass INVARIANT v2 (I-1..I-9).

---

## 7. Error handling

| Tình huống                  | Hành vi                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------- |
| Preview runtime error       | ErrorBoundary → static fallback + badge "preview unavailable"; card vẫn click được |
| Filter 0 kết quả            | EmptyState + nút xoá filter                                                        |
| URL param rác (`?mood=xyz`) | Bỏ qua param không hợp lệ, không crash, không 500                                  |
| Clipboard API bị chặn       | Fallback select-all code block (giữ Epic 4)                                        |
| WebGL không khả dụng        | Static poster image (pattern sẵn của PixelBlast)                                   |
| Catalog rỗng / slug sai     | EmptyState / 404 graceful (giữ story 4.1, 4.3)                                     |

## 8. Testing

- **Unit:** parse/serialize filter URL params (pure function trong `lib/`, mock pattern `{ get: (k) => map.get(k) ?? null }`); catalog aggregator — duplicate slug guard, manifest floors (UI+sections ≥ 8, templates = 4, tổng ≤ 16).
- **Smoke:** mọi route trong manifest render 200 (kế thừa story 9.4).
- **Visual:** so mắt thường trước/sau retrofit — không automated visual regression (constraint v1).
- **A11y:** keyboard đi hết filter → tabs → copy; focus ring hiện rõ trên nền chrome.

## 9. Tích hợp BMAD

1. Mark done 9 stories Epic 3+4 đang `review` (quyết định đã chốt: đóng nhanh, chấp nhận rủi ro logic để giải phóng sprint — UI sẽ bị thay phần lớn).
2. Chạy `bmad-correct-course`: thêm **Epic 10 — Design System v2 & Gallery Redesign**, 4 nhóm story = 4 phase ở trên.
3. Epic 9 viết lại: **bỏ story 9.1 + 9.2** (đã nuốt vào Epic 10), giữ 9.3 (QA audit), 9.4 (smoke test), 9.5 (CI/deploy).
4. **Epic 5-8 chạy SAU Epic 10** — pieces mới build thẳng trên chuẩn v2, không retrofit lần hai. Thứ tự sprint mới: **Epic 10 → 5 → 6 → 7 → 8 → 9**.
5. Spec này là input cho story files của Epic 10; INVARIANT v2 là acceptance gate mới.

## 10. Quyết định đã chốt trong brainstorm (audit trail)

| Quyết định           | Lựa chọn                                           | Phương án bị loại                                         |
| -------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| Phạm vi              | UI + UX flow, giữ architecture                     | chỉ-UI; re-architect                                      |
| Động lực             | Chuẩn hoá design system                            | đổi aesthetic                                             |
| Bề mặt               | Cả 3 tầng (tokens + shell + pieces)                | —                                                         |
| North star gallery   | Lai → **B. Discovery-first**                       | A. Showcase-first; C. 2 tầng                              |
| Token gaps           | States/surfaces + component tokens + layout rhythm | chỉ document                                              |
| Gallery chrome       | Neutral → **A. Warm graphite** (accent `#fbbf77`)  | theme-infra branded; đổi theo mood; Mono sharp; Slate air |
| Epic 3+4 đang review | Đóng nhanh không review kỹ                         | review kỹ rồi đóng; gộp vào redesign                      |
| Ternus               | Retrofit toàn bộ trong đợt này                     | forward-only                                              |
| Tiêu chí xong        | Cả 4 (spec + shell live + retrofit + filter)       | —                                                         |
| Thực thi             | A. Token-first tuần tự                             | gallery-first; song song 2 track                          |

Mockup đã duyệt lưu tại `.superpowers/brainstorm/7390-1781276873/content/` (gitignored — tham khảo local).
