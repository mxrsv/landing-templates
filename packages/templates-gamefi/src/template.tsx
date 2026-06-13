import { CharacterShowcase } from "@landing/sections/character-showcase";
import { GamefiHudHero } from "@landing/sections/gamefi-hud-hero";
import { Button } from "@landing/ui/components/button";

import "./gamefi.css";

/**
 * GameFi — an on-chain battle-arena landing with a game HUD aesthetic (game
 * mood). Composes the Epic 6 sections (HUD hero, character showcase) with a
 * sticky nav, a closing "season pass" CTA band, and footer. Visually distinct
 * from Infra (calm cyan) and Neon (degen): charcoal + lime/amber, mono HUD
 * type, corner brackets. Each section self-scopes `data-theme="game"`; the
 * wrapper scopes it too so nav/footer match.
 */
export function GamefiTemplate() {
  return (
    <div data-theme="game" className="gf-root" id="top">
      <header className="gf-nav">
        <span className="gf-brand">
          <span className="gf-brand-mark" aria-hidden />
          ARENA
        </span>
        <nav className="gf-nav-links" aria-label="Primary">
          <a href="#roster">Roster</a>
          <a href="#season">Season Pass</a>
          <a href="#play">Play</a>
        </nav>
      </header>

      <main>
        <GamefiHudHero />
        <div id="roster">
          <CharacterShowcase />
        </div>

        <section id="season" className="gf-closing">
          <span className="gf-closing-eyebrow">{"// Season Pass — Live"}</span>
          <h2>Claim your loadout</h2>
          <p>
            Every match earns. Gear, skins, and rank are fully on-chain — yours
            to keep, trade, and flex across the arena.
          </p>
          <div className="gf-closing-cta" id="play">
            <Button variant="solid">Play now</Button>
            <Button variant="ghost">View season pass</Button>
          </div>
        </section>
      </main>

      <footer className="gf-footer">
        <span>© 2026 ARENA. On-chain battle arena.</span>
        <span>Season 01 // NA-West</span>
      </footer>
    </div>
  );
}

export default GamefiTemplate;
