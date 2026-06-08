---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: "Repo chuyên cung cấp landing page, components, templates React/UI"
session_goals: "Cấu trúc sản phẩm; Roadmap 1-2 tuần; Chiến lược phát triển; Ý tưởng mới"
selected_approach: "progressive-flow"
techniques_used: ["Cross-Pollination", "Morphological Analysis", "First Principles Thinking", "Resource Constraints"]
ideas_generated: [20]
context_file: ""
---

# Brainstorming Session Results

**Facilitator:** Kyantran
**Date:** 2026-06-08

## Session Overview

**Topic:** Repo chuyên cung cấp landing page, components, templates React/UI
**Goals:** Cấu trúc sản phẩm; Roadmap 1-2 tuần; Chiến lược phát triển; Ý tưởng mới

### Session Setup

Session khởi tạo từ repo hiện tại `landing-page-list` (Next.js, template Ternus, shared components). Focus: biến repo thành sản phẩm có cấu trúc, chiến lược rõ, actionable trong 1-2 tuần.

## Technique Selection

**Approach:** Progressive Technique Flow
**Journey Design:** Systematic development from exploration to action

**Progressive Techniques:**

- **Phase 1 - Exploration:** Cross-Pollination — học pattern từ domain khác
- **Phase 2 - Pattern Recognition:** Morphological Analysis — map tham số & combo
- **Phase 3 - Development:** First Principles Thinking — xây lại từ nhu cầu gốc
- **Phase 4 - Action Planning:** Resource Constraints — roadmap 1-2 tuần thực tế

**Journey Rationale:** Session cần cả breadth (ý tưởng, chiến lược) lẫn depth (cấu trúc, roadmap ngắn). Progressive flow đảm bảo không nhảy thẳng vào todo list mà vẫn kết thúc actionable.

## Phase 1 — Cross-Pollination (Complete)

**Key breakthroughs:** CLI shadcn-style, 3-layer taxonomy, Web3-native positioning, L1-grade visual bar, Ternus-first token foundation.
**User creative strength:** Quyết định nhanh, rõ ưu tiên visual > marketing, có reference board cụ thể.

## Phase 2 — Morphological Analysis (Complete)

### Winning Combo — Product Structure v1

```
landing-page-list/                    # pnpm + Turborepo
├── apps/
│   └── docs/                         # Gallery: /ui, /sections, /templates
├── packages/
│   ├── design-tokens/                # CSS vars + Tailwind preset (C)
│   ├── ui/                           # Multi-lib animation components
│   ├── sections/                     # Web3 landing blocks
│   └── templates/                    # ternus → memecoin → gamefi → nft
```

**Distribution v1 (no CLI):** Docs gallery + copy source / "Copy code" button
**Distribution v2 (later):** `npx @kyantran/landing add <piece>`

### Emerging Patterns (Phase 2)

1. **Gallery-first, CLI-second** — validate visual catalog trước automation
2. **Tokens unify diversity** — multi-lib chaos được gọi hẹp bởi shared design-tokens
3. **Vertical depth > horizontal breadth** — Web3 templates với L1 visual bar

### Parameter Matrix

| Param                   | Decision                                                                 |
| ----------------------- | ------------------------------------------------------------------------ |
| P1 Monorepo tool        | **pnpm + Turborepo** ✓                                                   |
| P2 Animation/UI stack   | **Multi-library diverse** — FM, GSAP, Three.js, Lottie, CSS… per piece ✓ |
| P3 design-tokens format | **Both** — CSS vars + Tailwind preset map vars ✓                         |
| P4 CLI registry         | **Deferred** — ship sau khi catalog + gallery ổn ✓                       |

### Decision supersessions (post-brainstorm)

| Original (brainstorm)                       | Superseded by                                                     | Rationale                                                                                                                                                                                                                          |
| ------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P3: CSS vars + **Tailwind preset** (v3 API) | PRD FR-3 + architecture: CSS vars + Tailwind 4 **`@theme` block** | Tailwind 4 bỏ preset API v3; `@theme` + CSS vars là equivalent đúng stack. **Không đổi ý định** (token floor + theme ceiling), chỉ đổi mechanism. Ref: `prd.md` §4.2 FR-3, `architecture.md` Styling Solution, `.decision-log.md`. |

## Phase 3 — First Principles Thinking (In Progress)

### First Principles Rebuild

**Job-to-be-done (gốc):** Thư viện nhiều landing template crypto — đa dạng **aesthetic**, mỗi mood professional, không vibe coding.

**Architecture insight:** `design-tokens` = quality floor (spacing, type, easing) | `theme variants` = aesthetic ceiling (palette, mesh, motion).

**Aesthetic Trinity (I+N+G):**
| Mood | Template | Tokens variant |
|------|----------|----------------|
| Infra Dark Refined (I) | Ternus (L2/infra) | `theme-infra` |
| Neon Meme Energy (N) | Memecoin | `theme-neon` |
| Game HUD / Cyber (G) | GameFi | `theme-game` |

NFT (phase sau) = aesthetic thứ 4 chưa chốt.

**Invariant Professional Bar (non-negotiable):**

- **Spacing rhythm** — grid 4/8px, whitespace có chủ đích
- **Motion easing** — mọi animation có curve riêng, cấm `transition: all`

Typography và responsive = important nhưng flexible hơn ở v1.

## Phase 3 — First Principles Thinking (Complete)

**Product identity:** Thư viện landing Web3 đa aesthetic (Infra/Neon/Game), unified spacing + motion craft. Gallery-first, CLI sau.

## Phase 4 — Resource Constraints (Complete)

**CLI:** Deferred (confirmed) — gallery + copy only cho 2 tuần đầu.

**Constraints:** 1–2 tuần | 1 người + AI agents (high velocity) | Visual-first | 3 aesthetic moods

### Roadmap Aggressive (AI-accelerated)

**TUẦN 1 — Foundation + Infra + Neon**
| Parallel track | Output |
|----------------|--------|
| A: Monorepo + design-tokens + 3 themes | `theme-infra`, `theme-neon`, `theme-game` skeleton |
| B: Ternus refresh (Fuel/Monad) | Gallery `/templates/ternus` |
| C: Memecoin sections (all 3) + price-ticker ui | hero+ticker, stats, community-marquee |
| D: Gallery app | `/ui`, `/sections`, `/templates` + copy button + basic tags |

**TUẦN 2 — Game + Polish + Gallery**
| Parallel track | Output |
|----------------|--------|
| E: GameFi template (theme-game) | HUD sections, character showcase skeleton |
| F: NFT template skeleton | gallery grid + mint countdown section |
| G: UI catalog expansion | polish PixelBlast, LogoLoop, SoftAurora + 2-3 new ui |
| I: Gallery filters | use case + animation + stack tags |

**Definition of Done (2 tuần aggressive):**

- 4 templates: Ternus, Memecoin, GameFi, NFT (skeleton OK)
- 3 theme variants live
- 8–10 ui/sections catalogued
- Gallery browse + copy

**Agent execution tips:**

- Track A first (monorepo) — block everything else
- B + C parallel sau khi tokens ready
- E + F parallel week 2
- Mỗi piece = 1 agent story với invariant bar (spacing + easing)

---

## Session Synthesis

### Themes

| Theme                | Focus                         | Key ideas                                    |
| -------------------- | ----------------------------- | -------------------------------------------- |
| **Product Identity** | shadcn-for-Web3, đa aesthetic | #8, #9, #17, #18                             |
| **Architecture**     | Monorepo 3-layer + tokens     | #3, #6, #20, P1–P3                           |
| **Visual Moat**      | L1-grade, anti vibe-coding    | #15–#19, invariant spacing+easing            |
| **Catalog Content**  | 4 templates, 3 moods          | I=ternus, N=memecoin, G=gamefi, NFT skeleton |
| **Distribution**     | Gallery-first, CLI later      | #4, #5, P4 deferred                          |

### Product Identity (final)

> Thư viện landing Web3 đa aesthetic (Infra / Neon / Game) — professional spacing + motion craft. Gallery browse + copy. CLI phase 2.

### Immediate Next Action

**Track A (blocker):** Scaffold monorepo → migrate `src/` → `apps/docs` + `packages/{design-tokens,ui,sections,templates}`

### Agent Parallel Order

```
Day 1-2:  [A] monorepo + design-tokens + 3 theme skeletons
Day 2-4:  [B] Ternus refresh  ||  [D] gallery routes
Day 4-6:  [C] Memecoin sections + price-ticker ui
Day 7-9:  [E] GameFi  ||  [F] NFT skeleton  ||  [G] ui polish
Day 10:   [I] gallery filters + QA visual bar
```

### Reference Board

fuel.network · layerzero.network · celestia.org · polygon.technology · monad.xyz · neon.com · vercel.com

### Out of Scope (2 tuần)

CLI · open contribution · Deploy buttons · marketing

**[Category #1]**: Landing-Add CLI
_Concept_: `npx @kyantran/landing add ternus` copy `app/(landing)/ternus/` + shared components vào project Next.js.
_Novelty_: Template là route group plug-and-play, sửa code trực tiếp như shadcn.

**[Category #2]**: Two-Layer Architecture → evolved to Three-Layer
_Concept_: `ui/` + `sections/` + `templates/` tách layer rõ.
_Novelty_: Scale từ button glow đến full page.

**[Category #3]**: Three-Layer Taxonomy
_Concept_: CLI `add` theo layer; template auto resolve deps.
_Novelty_: Một hệ thống thống nhất.

**[Category #4]**: Docs-as-Gallery
_Concept_: `/ui`, `/sections`, `/templates` live preview + CLI button.
_Novelty_: Marketing ẩn trong docs.

**[Category #5]**: Multi-Axis Discovery
_Concept_: Filter use case + animation tag + stack tag.
_Novelty_: Discovery đa chiều.

**[Category #6]**: Monorepo-First
_Concept_: apps/docs + packages/{cli,ui,sections,templates}.
_Novelty_: Scale không đau refactor.

**[Category #7]**: Quality-First Catalog
_Concept_: 10–15 piece curated, internal-first, chưa open contribution.
_Novelty_: Depth over volume.

**[Category #8]**: Web3-Native Library
_Concept_: Position "shadcn for Web3 landing".
_Novelty_: Own niche Web3 visual language.

**[Category #9]**: Multi-Template Web3 Catalog
_Concept_: Nhiều templates crypto — L2, memecoin, GameFi, NFT.
_Novelty_: Living code + CLI.

**[Category #10]**: Web3 Template Trinity
_Concept_: Memecoin, NFT, GameFi templates sau Ternus.
_Novelty_: Nhiều mood crypto.

**[Category #11]**: Phased Template Roadmap
_Concept_: Memecoin → GameFi → NFT.
_Novelty_: Validate pipeline mỗi template.

**[Category #12]**: Memecoin MVP Bundle
_Concept_: meme-hero+ticker, token-stats-strip, community-marquee.
_Novelty_: 3 section đủ 1 landing.

**[Category #13]**: Multi-Mode Price Ticker
_Concept_: marquee / slot-machine / flash red-green variants.
_Novelty_: 1 ui component, 3 modes.

**[Category #14]**: Dual Community Marquee
_Concept_: C1 social icons + follower count; C2 holder avatars wall. Có thể 2 variant hoặc stacked trong 1 section.
_Novelty_: Social proof kép — platform reach + community size.

**[Category #15]**: Anti-Generic Design Bar
_Concept_: Không purple-gradient-slate-card vibe coding; reference tier Linear/Raycast/Stripe.
_Novelty_: Design-first, dev-second.

**[Category #16]**: Professional Product Standard
_Concept_: 3 lớp visual/code/presentation — user ưu tiên Visual nặng nhất.
_Novelty_: Sẵn sàng đưa vào sản phẩm thật.

**[Category #17]**: Visual-First Professionalism
_Concept_: Bar chất lượng đặt ở typography, color system, motion choreography, spacing rhythm — code và docs phục vụ visual.
_Novelty_: Memecoin/NFT vẫn premium, không “cheap hype”.

**[Category #18]**: L1-Grade Visual Reference Board
_Concept_: North star: fuel.network, layerzero.network, celestia.org, polygon.technology, monad.xyz, neon.com, vercel.com. Pattern chung: dark/refined palette, display typography lớn, scroll narrative, stats-as-hero, gradient subtle, whitespace nhiều, motion có chủ đích, social proof (logos/quotes).
_Novelty_: Bar visual = infra blockchain tier, không phải ThemeForest hay vibe coding template.

**[Category #19]**: Infra-Grade Memecoin Shell
_Concept_: Memecoin template dùng shell dark refined (Fuel/Monad) — mesh gradient subtle, display type lớn, stats strip polished. Meme/ticker/FOMO là content layer bên trong, không phá layout.
_Novelty_: Memecoin landing professional — niche chưa ai làm tốt (hoặc pump.fun vs monad.xyz gap).

**[Category #20]**: Ternus-First Token Foundation
_Concept_: Tuần 1: `packages/design-tokens` (color, font, easing, spacing) + refresh Ternus lên bar Fuel/Monad. Memecoin/GameFi/NFT inherit tokens — DNA visual thống nhất.
_Novelty_: Ship foundation trước catalog — mọi template sau không redesign từ zero.
