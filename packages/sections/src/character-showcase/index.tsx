import "./character-showcase.css";

interface RosterEntry {
  name: string;
  klass: string;
}

/** Placeholder roster — no live data (skeleton section, v1). */
const ROSTER: RosterEntry[] = [
  { name: "Bulwark", klass: "Tank" },
  { name: "Ember", klass: "Mage" },
  { name: "Specter", klass: "Assassin" },
  { name: "Aegis", klass: "Support" },
  { name: "Rook", klass: "Marksman" },
  { name: "Drift", klass: "Scout" },
];

/**
 * Character showcase (skeleton) — game mood. A placeholder roster layout for
 * GameFi character display: a featured portrait panel beside a card grid.
 * Intentionally static/low-fidelity (marked skeleton in metadata) so the
 * GameFi template can ship its ≥2-sections floor (FR-8) without blocking on
 * final art. Self-scopes `data-theme="game"` for standalone copy.
 */
export function CharacterShowcase() {
  return (
    <section data-theme="game" className="cs-root">
      <div className="cs-inner">
        <div className="cs-head">
          <span className="cs-eyebrow">{"// Roster — Season 01"}</span>
          <h2 className="cs-title">Pick your fighter</h2>
        </div>

        <div className="cs-layout">
          <div className="cs-featured">
            <div className="cs-portrait" aria-hidden />
            <h3 className="cs-featured-name">Vanguard</h3>
            <div className="cs-featured-meta">
              <span className="cs-chip cs-chip-accent">Legendary</span>
              <span className="cs-chip">Tank</span>
              <span className="cs-chip">Lv 24</span>
            </div>
          </div>

          <div className="cs-roster">
            {ROSTER.map((entry) => (
              <div key={entry.name} className="cs-card">
                <div className="cs-card-thumb" aria-hidden />
                <span className="cs-card-name">{entry.name}</span>
                <span className="cs-card-class">{entry.klass}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CharacterShowcase;
