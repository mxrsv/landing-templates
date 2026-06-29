# Handoff — tiếp tục thiết kế template "đẹp/có gu" (session mới)

**Ngày:** 2026-06-26 · **Repo:** `landing-page-list` (branch `main`) · **Ngôn ngữ trả lời: Tiếng Việt** (CLAUDE.md user).

## Mục tiêu

Build một **template landing mới thật đẹp, có gu, không generic** cho catalog. Vertical không quan trọng — **craft/aesthetic** mới là điểm. Đang ở giai đoạn **prototype hero**, chưa productionize.

## ⛔ LUẬT BẮT BUỘC (đọc trước khi làm bất cứ gì)

1. **EYE-REVIEW GATE** — _không bao giờ_ tự áp design/treatment làm final. Mọi UI + mỗi quyết định nhỏ phải qua **mắt thật của user** trước. LLM làm qua code/text, **không phán được "đẹp"**. Quy trình: **propose treatment spec (text) → user lái từng con số → apply → render → user review**. Không tự bake median rồi nói "xong". (Canonical: `~/.claude/skills/frontend-design-bar/references/workflow.md` Rule 0.)
2. **Đẹp = treatment, không phải ingredient.** Mỗi element là một parameter space; AI fail vì chọn **trung vị mọi lever**. Set mọi lever có chủ ý. (`references/treatment-levers.md`.)
3. **References-first + gu PHẢI do user nói ra** (đừng suy đoán rồi build). User OK với `AskUserQuestion` khi chọn preferences.
4. Đẹp = **assembly** (motion libs, depth) + **de-stock** mọi element default.

## Gu user — ĐÃ CHỐT (user tự chọn qua poll 9 reference)

Nguồn chân lý: memory `frontend-taste-profile.md`. Tóm tắt:

- Nền **tối** (đen cinematic / tím-indigo / gradient mesh) — **KHÔNG sáng/trắng**.
- Accent **CHỈ xanh neon (green)**.
- Focal = **dải sáng volumetric + vật thể 3D bóng/iridescent**. **KHÔNG** console/data-viz, **KHÔNG** card UI glass.
- Chữ: **bold geometric sans headline + mono cho eyebrow/label**. **KHÔNG** mono headline, **KHÔNG** serif.
- ⇒ Hướng "institutional bone-paper + Fraunces + route-graph" mình thử lúc đầu = **SAI gu, đã bỏ.**

## Prototype hiện tại (cái để tiếp tục)

- **`apps/docs/public/proto/fluxion-aurora.html`** ← bản ON-GU (đen + xanh neon + bold sans/mono + orb iridescent CSS trong dải sáng). Mở: chạy `PORT=3000 pnpm dev` trong `apps/docs` rồi vào `http://localhost:3000/proto/fluxion-aurora.html`. (Bản gốc ở scratchpad session cũ — đã copy vào repo cho bền.)
- `apps/docs/public/proto/fluxion-neon.html` = bản SAI (focal console + headline mono) — giữ làm bài học, đừng dùng.
- ⚠️ **WebGL không chạy trong headless `browse`** → orb đang là **CSS iridescent** (proxy để review bằng mắt). Production focal nên là **three.js WebGL thật** (chạy trong Chrome user; LLM không screenshot được → user verify live).

## Việc tiếp theo (theo eye-review gate)

1. Bắt đầu bằng **TREATMENT SPEC đề xuất** (text, lever values rõ ràng — xem mẫu trong `treatment-levers.md`: Inter Display + tracking + opacity ramp 100/70/40 + OpenType tnum/slashed-zero cho stats) cho user duyệt/lái TRƯỚC khi apply.
2. Sau khi user chốt từng treatment → apply → render → user review.
3. Cân nhắc nâng focal lên **WebGL three.js** (user verify live).
4. Khi hero "muốn dùng" → build **full landing** lane này → rồi mới productionize vào catalog (tokens/INVARIANT/Pieces, theo `template-production-model`).

## Hệ thống tri thức design (đã dựng — dùng nó)

- Skill **`~/.claude/skills/frontend-design-bar/`** (canonical "how"): `SKILL.md` + `references/`{`workflow.md` (Rule 0), `treatment-levers.md`, `de-stock-recipes.md`, `motion.md`, `typography.md`, `color.md`, `layout.md`, `libraries.md`, `gallery.md` (9 ref đã log), `screenshots/` (ảnh ref)}.
- `<frontend_design>` rule trong `~/.claude/CLAUDE.md` (gate trigger).
- Memory (project `…/memory/`): **`frontend-taste-profile.md`** (gu chốt + process rules — đọc đầu tiên), `template-design-bar.md`, `production-bar.md`, `template-production-model.md`.

## Gotchas môi trường

- `browse` cần `chromium_headless_shell-1208` → đã symlink sang `-1217` tại `~/Library/Caches/ms-playwright/`.
- Headless KHÔNG có WebGL (xem trên).
- `design` (gstack) cần OpenAI key — chưa setup; build HTML thật + render bằng `browse`.
- Render: `browse goto/screenshot --viewport`; ép intro `browse js "gsap.globalTimeline.progress(1)"`; ép reveal hiện bằng JS; hover element trung tính để xoá hover dính; nền `position:fixed` thì full-page screenshot chỉ thấy 1 dải.
- Server: scratchpad cũ chạy `python3 -m http.server 4567` (sẽ chết khi session cũ end). Session mới dùng `apps/docs` dev :3000 + đường `/proto/*.html`.

## Suggested skills

- **`frontend-design-bar`** — ĐỌC trước tiên (gate). Đặc biệt `workflow.md` Rule 0 + `treatment-levers.md`.
- `/gstack-office-hours` — nếu brainstorm thêm hướng.
- `/gstack-design-review` — polish visual.
- `/gstack-spec` + `/gstack-plan-eng-review` — khi productionize vào monorepo.
- `/gstack-ship` — khi land template vào catalog.
