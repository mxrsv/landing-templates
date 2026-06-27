// PROTOTYPE — throwaway. Helix HERO skeleton (frontend-design-bar Phase 2).
// Cấu trúc + content thật + layout lệch + focal proxy. CHƯA motion/polish (Phase 4).
// Focal hiện là CSS gem proxy cho torus-knot WebGL (Focal track song song — user
// verify live, headless không có WebGL). Run: `PORT=3000 pnpm dev` (apps/docs) →
// /dev/helix-hero. Xoá folder khi fold vào packages/templates-helix.
import "./helix-tokens.css";
import "./helix-hero.css";
import { ShardsFocal } from "./shards-focal";
import { HeroMotion } from "./hero-motion";

const NAV_LINKS = ["Protocol", "Operators", "Restake", "Docs"];

const PROOF = [
  { num: "4.2", unit: "B", label: "TVL restaked" },
  { num: "38", unit: "", label: "AVS secured" },
  { num: "240", unit: "", label: "Operators" },
  { num: "99.9", unit: "%", label: "Uptime" },
];

export default function HelixHeroSkeleton() {
  return (
    <div className="helix" data-theme="helix" id="top">
      <div className="hx-grid" aria-hidden="true" />

      <nav className="hx-nav">
        <span className="hx-nav__brand">
          <span className="hx-nav__mark" aria-hidden="true" />
          Helix
        </span>
        <div className="hx-nav__links">
          {NAV_LINKS.map((l) => (
            <a key={l} href="#top">
              {l}
            </a>
          ))}
        </div>
        <div className="hx-nav__right">
          <button type="button" className="hx-btn hx-btn--primary">
            Start restaking
            <span className="hx-btn__arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </nav>

      <header className="hx-hero">
        <div className="hx-hero__copy">
          <span className="hx-tag">
            <span>Liquid restaking</span>
          </span>
          <h1 className="hx-display hx-hero__headline">
            One stake, securing <em>every network.</em>
          </h1>
          <p className="hx-body hx-hero__sub">
            Helix threads a single deposit through every network it protects —
            one strand of capital securing 38 services at once, fully liquid,
            never fragmented.
          </p>
          <div className="hx-hero__cta">
            <button type="button" className="hx-btn hx-btn--primary">
              Start restaking
              <span className="hx-btn__arrow" aria-hidden="true">
                →
              </span>
            </button>
            <button type="button" className="hx-btn hx-btn--ghost">
              <span>Read docs</span>
              <span className="hx-btn__arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </div>

        <div className="hx-focal" aria-label="Shards focal">
          <div className="hx-focal__glow" aria-hidden="true" />
          <ShardsFocal />
          <div className="hx-focal__gem" aria-hidden="true" />
          <span className="hx-focal__note">Shards focal · WebGL live</span>
        </div>
      </header>

      <section className="hx-proof" aria-label="Protocol stats">
        <div className="hx-ledger">
          {PROOF.map((s) => (
            <div key={s.label} className="hx-ledger__item">
              <span className="hx-ledger__num">
                {s.num}
                {s.unit ? <span className="u">{s.unit}</span> : null}
              </span>
              <span className="hx-ledger__tick" aria-hidden="true" />
              <span className="hx-ledger__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <HeroMotion />
    </div>
  );
}
