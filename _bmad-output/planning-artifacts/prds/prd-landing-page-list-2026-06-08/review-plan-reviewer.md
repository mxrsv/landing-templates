# Plan Review — PRD: landing-page-list (Web3 Landing Library)

**Reviewer:** plan-reviewer agent
**Date:** 2026-06-08
**Iteration:** 1/3
**Plan file:** `_bmad-output/planning-artifacts/prds/prd-landing-page-list-2026-06-08/prd.md`
**Upstream spec:** `_bmad-output/brainstorming/brainstorming-session-2026-06-08-1726.md`

---

## EXECUTABLE: Partial

- PRD is well-structured and scope-accurate, but **Track A (monorepo, the critical blocker) has no actionable migration steps** — references a "addendum / architecture doc" that does not exist in the repo.
- A developer/agent cannot start Day 1 execution from this document alone.
- All other tracks (B–I) are gated on Track A completion; until an architecture doc exists, the entire timeline is blocked.

---

## Blockers

- **[H1]** Track A migration steps deferred to non-existent architecture doc.
- **[H2]** npm → pnpm package manager switch not specified.

---

## Codebase State Summary (verified)

| Item                                             | Expected by PRD         | Found in codebase                                    |
| ------------------------------------------------ | ----------------------- | ---------------------------------------------------- |
| `apps/` directory                                | yes (monorepo)          | ❌ does not exist                                    |
| `packages/` directory                            | yes (monorepo)          | ❌ does not exist                                    |
| `pnpm-workspace.yaml`                            | yes                     | ❌ does not exist                                    |
| `turbo.json`                                     | yes                     | ❌ does not exist                                    |
| `src/components/pixel-blast/`                    | yes (PixelBlast)        | ✅ exists                                            |
| `src/components/logo-loop/`                      | yes (LogoLoop)          | ✅ exists                                            |
| `src/components/soft-aurora/`                    | yes (SoftAurora)        | ✅ exists                                            |
| `src/templates/ternus/`                          | yes (Ternus template)   | ✅ exists                                            |
| `src/templates/ternus/lib/use-reduced-motion.ts` | yes (accessibility NFR) | ✅ exists                                            |
| Next.js 16                                       | yes                     | ✅ `16.2.7`                                          |
| React 19                                         | yes                     | ✅ `19.2.4`                                          |
| Tailwind 4                                       | yes                     | ✅ `^4`                                              |
| Package manager: npm                             | not mentioned           | ⚠️ `package-lock.json` present — pnpm assumed by PRD |

---

## 🟠 HIGH (2)

### [H1] Track A has no executable migration steps — Step Day 1–2 blocked

**§4.1 FR-1/FR-2** correctly marks Track A as blocker and says:

> "Chi tiết migration path → addendum / architecture doc."

No such addendum or architecture document exists in the repo (`docs/`, `_bmad-output/`). A Track A story cannot be agent-executed without knowing:

- How to restructure `src/templates/ternus/` → `packages/templates/ternus/`
- How to restructure `src/components/` → `packages/ui/`
- What happens to `src/app/` → `apps/docs/` (it's currently the Next.js app root)
- How to update `tsconfig.json` paths alias `@/*` → workspace cross-package imports
- How to preserve the existing Ternus demo route `/ternus` after migration

**Fix:** Create architecture doc or Track A epic before handing to execution agents. Minimum content: file tree mapping (before → after), tsconfig migration, import alias update plan.

---

### [H2] npm → pnpm switch not specified — Day 1 environment risk

Current repo uses **npm** (`package-lock.json` present, no `pnpm-workspace.yaml`). PRD §4.1 and brainstorm P1 decide "pnpm + Turborepo" without calling out this requires:

1. Deleting `package-lock.json` and running `pnpm install`
2. Adding `pnpm-workspace.yaml`
3. Updating CI (if any) for `pnpm`
4. Installing `turbo` as dev dependency

This is a Day 1, Step 0 action that blocks everything. Missing from PRD and from any checklist.

**Fix:** Add a Track A pre-step: "Switch package manager npm → pnpm; add `pnpm-workspace.yaml`; install turbo."

---

## 🟡 MEDIUM (4)

### [M1] Tailwind 4 + `packages/design-tokens` compatibility not addressed — FR-3 risk

PRD §4.2 FR-3: `packages/design-tokens` exports "CSS file(s) và/hoặc Tailwind preset mapping vars."

Tailwind v4 changed its configuration model fundamentally: no `tailwind.config.js`, uses CSS `@theme` directive instead. A `packages/design-tokens` that exports a Tailwind "preset" in the v3 sense won't work directly in Tailwind v4. This is a non-trivial architectural decision that affects:

- How design-tokens are consumed by `apps/docs`
- Whether `@theme` CSS variables or a custom plugin is used

**Fix:** Architecture doc for FR-3 should specify: CSS custom properties file + `@import` pattern (compatible with Tailwind 4 `@theme`), or a Tailwind 4 plugin approach. Do not assume v3 preset API.

---

### [M2] In-flight WIP on Ternus components not acknowledged — Track B conflict risk

Git status shows:

```
M src/components/pixel-blast/PixelBlast.tsx
M src/templates/ternus/components/hero-crystal.tsx
M src/templates/ternus/components/ternus-hero.tsx
?? src/templates/ternus/components/ternus-netstrip.tsx  (new, untracked)
```

PRD §6.1 Track B = "Ternus refresh (Fuel/Monad bar)" and Track G = "UI polish + polish PixelBlast". These track targets overlap with current uncommitted changes. If Track A migration runs while these changes are uncommitted/unstaged, the restructure could scatter them or silently drop context.

**Fix:** Commit or stash all WIP before Track A migration begins. Add this as a gate-0 pre-condition in Track A epic.

---

### [M3] Parallel Day 7–9 (E∥F∥G) is 3 tracks for 1 builder + AI — schedule risk

Week 2 roadmap has GameFi (E), NFT skeleton (F), and UI polish (F) running in parallel. For AI agent execution this is fine if agents are truly independent (no shared file conflicts). However:

- E and G both touch `packages/ui` (GameFi HUD components + PixelBlast polish)
- If same agent, sequential is safer; if parallel agents, file collision risk on `packages/ui`

**Fix:** In sprint planning / epic creation, assign E and G to separate agents with explicit file ownership boundaries, or make G (UI polish) sequential after E to avoid `packages/ui` collisions.

---

### [M4] FR-7 Memecoin price-ticker has no interaction spec — Track C unactionable without design

FR-7 specifies "≥2 modes (marquee, slot-machine hoặc flash)" for the price-ticker UI. No design spec, wireframe, or interaction detail exists. An agent building this component will make arbitrary UX decisions.

This is acceptable for a PRD (capability-level spec), but Track C cannot be agent-executed without a brief UX spec per the PRD's own §2.3 UJ-1 ("Dev đọc stack tag, cài dependency trước khi paste" — implies predictable component API).

**Fix:** Add a component spec (props API, visual mode descriptions) to the Track C story before execution.

---

## ⚪ LOW (2)

### [L1] Minor typo in §5 Non-Goals

"Marketing site tách riê khỏi gallery" — missing "ng" → should be "tách riêng".

### [L2] NFT aesthetic naming is an open question but not flagged as a blocker for Track F

§8 Open Question #3: "NFT aesthetic thứ 4: Mood name chưa chốt." PRD correctly marks NFT as skeleton, but Track F agent will need a placeholder theme name to scaffold the token variant. Suggest defaulting to `theme-nft` in story spec.

---

## ✅ POSITIVE (6)

### [P1] Codebase references are accurate

PRD correctly identifies existing components (PixelBlast, LogoLoop, SoftAurora, Ternus), their locations, and the `use-reduced-motion` hook. No ghost file references in the requirements section.

### [P2] Stack versions match reality

PRD §Adapt-In Platform: "Next.js 16+, React 19+, Tailwind 4" — all confirmed in `package.json`. No version mismatch surprises.

### [P3] Track dependency ordering is correct

Day 1–2 A → Day 2–4 B∥D → Day 4–6 C → Day 7–9 E∥F∥G → Day 10 I+QA. Track A as hard blocker is correct. B and D can parallelize once tokens are ready (B uses Ternus tokens, D builds gallery app). C correctly after tokens exist. Ordering logic is sound.

### [P4] Assumptions explicitly tagged and indexed

All `[ASSUMPTION]` tags in-text + index in §9. This is agent-friendly — execution agents can identify soft decisions quickly.

### [P5] Non-goals list is explicit and well-scoped

§5 clearly defers CLI, open contribution, deploy buttons, marketing. Prevents scope creep during execution.

### [P6] Scope alignment with brainstorm is high

PRD captures all key brainstorm decisions: gallery-first, pnpm+Turborepo, 3 aesthetic moods, CLI deferred, roadmap tracks A–I, Definition of Done. No brainstorm decision contradicted or dropped.

---

## Summary

| Severity    | Count |
| ----------- | ----- |
| 🔴 CRITICAL | 0     |
| 🟠 HIGH     | 2     |
| 🟡 MEDIUM   | 4     |
| ⚪ LOW      | 2     |
| ✅ POSITIVE | 6     |

**EXECUTABLE: Partial**

The PRD is accurate, well-scoped, and strongly aligned with the brainstorm. It is ready to drive epic/story creation. However, it **cannot be handed directly to execution agents** because Track A (monorepo migration, the Day 1 blocker) has no implementation detail and references a non-existent architecture document. A developer cannot begin without resolving H1 and H2 first.

---

## Recommended Next Actions (priority order)

1. **[Blocker — resolve before any agent execution]** Create architecture doc or Track A epic with: file tree migration map (`src/` → `packages/*` + `apps/docs/`), npm → pnpm switch steps, tsconfig path alias update, Ternus route preservation plan.
2. **[Blocker — Day 1 environment]** Document npm → pnpm migration as Track A pre-step.
3. **[Before Track A]** Commit or stash current WIP (PixelBlast, ternus-hero, hero-crystal, ternus-netstrip).
4. **[Before FR-3]** Decide design-tokens format for Tailwind 4 (`@theme` CSS vars vs plugin) and document in architecture addendum.
5. **[Before Track C]** Create brief UX spec for price-ticker component (props API, mode descriptions).
