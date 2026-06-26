// PROTOTYPE — throwaway. Helix token specimen (frontend-design-bar Phase 1, v3).
// Làn template ĐỘC LẬP: token/font/CSS riêng, KHÔNG @landing/design-tokens.
// Direction v3 (refs = Polygon): chamfer · iridescent blue/purple · blueprint grid ·
// bracket tag · bento lệch · 1 font Clash. Content = liquid restaking thật (P-1).
// Run: `PORT=3000 pnpm dev` (apps/docs) → /dev/helix-tokens
// Xoá cả folder helix-tokens/ khi token đã chốt + fold vào hero.
import "./helix.css";

const RAMP = [
  { name: "void", val: "#08070F", bg: "var(--hx-void)" },
  { name: "s1", val: "#0E0D1A", bg: "var(--hx-s1)" },
  { name: "s2", val: "#151327", bg: "var(--hx-s2)" },
  { name: "s3", val: "#1D1A34", bg: "var(--hx-s3)" },
];

const BENTO = [
  {
    cat: "Shared security",
    idx: "01",
    body: "One deposit secures 38 actively validated services. No fragmenting your position across protocols.",
  },
  {
    cat: "Liquid",
    idx: "02",
    body: "Stay liquid while you restake — withdraw or trade your position without an unbonding queue.",
  },
  {
    cat: "Yield",
    idx: "03",
    body: "Stack rewards from every network your capital protects, settled in a single stream.",
  },
];

const STATS = [
  { num: "4.2", unit: "B", label: "TVL restaked" },
  { num: "38", unit: "", label: "AVS secured" },
  { num: "240", unit: "", label: "Operators" },
  { num: "12", unit: "", label: "Networks" },
];

export default function HelixTokenSpecimen() {
  return (
    <div className="helix" data-theme="helix" id="top">
      <div className="hx-grid" aria-hidden="true" />
      <div className="helix-wrap">
        {/* ── type ladder + bracket tag ─────────────────────────────── */}
        <section className="hx-section">
          <p className="hx-section__label">
            Type ladder + bracket tag · Clash Display
          </p>
          <span className="hx-tag">
            <span>Liquid restaking</span>
          </span>
          <h1 className="hx-display">
            One stake, securing <em>every network.</em>
          </h1>
          <h2 className="hx-h2">Capital that works in more than one place.</h2>
          <h3 className="hx-h3">Restake once. Extend trust everywhere.</h3>
          <p className="hx-body">
            Helix lets a single deposit secure dozens of actively validated
            services at once — one strand of capital threaded through every
            network it protects, without fragmenting your position.
          </p>
        </section>

        {/* ── surface ramp ──────────────────────────────────────────── */}
        <section className="hx-section">
          <p className="hx-section__label">
            Surface ramp · cool indigo near-black
          </p>
          <div className="hx-ramp">
            {RAMP.map((c) => (
              <div
                key={c.name}
                className="hx-ramp__cell"
                style={{ background: c.bg }}
              >
                <span className="hx-ramp__name">{c.name}</span>
                <span>{c.val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── accent system · iridescent ────────────────────────────── */}
        <section className="hx-section">
          <p className="hx-section__label">
            Accent · iridescent blue→violet→pink (system)
          </p>
          <div className="hx-accent-row">
            <span className="hx-chip hx-chip--irid">iridescent</span>
            <span className="hx-chip hx-chip--violet">violet (primary)</span>
            <span className="hx-chip hx-chip--blue">blue</span>
            <span className="hx-chip hx-chip--pink">pink</span>
            <span className="hx-chip hx-chip--tint">tint 14%</span>
          </div>
        </section>

        {/* ── buttons · chamfer + arrow ─────────────────────────────── */}
        <section className="hx-section">
          <p className="hx-section__label">Buttons · chamfer + arrow</p>
          <div className="hx-actions">
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
        </section>

        {/* ── bento panels · chamfer hairline ───────────────────────── */}
        <section className="hx-section">
          <p className="hx-section__label">
            Bento panels · chamfer (benefit style)
          </p>
          <div className="hx-bento">
            {BENTO.map((b) => (
              <article key={b.idx} className="hx-panel">
                <div className="hx-panel__inner">
                  <div className="hx-panel__head">
                    <span className="hx-panel__cat">{b.cat}</span>
                    <span className="hx-panel__glyph" aria-hidden="true" />
                  </div>
                  <div className="hx-panel__body">
                    <span className="hx-panel__idx">{b.idx}</span>
                    <span>{b.body}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── stats · hairline ledger ───────────────────────────────── */}
        <section className="hx-section">
          <p className="hx-section__label">Stats · hairline ledger</p>
          <div className="hx-ledger">
            {STATS.map((s) => (
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
      </div>
    </div>
  );
}
