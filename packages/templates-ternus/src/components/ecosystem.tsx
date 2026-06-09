interface Partner {
  /** Each partner gets its OWN monogram letter — not the Ternus mark. */
  mono: string;
  name: string;
  cat: string;
}

const PARTNERS: Partner[] = [
  { mono: "N", name: "Northwind", cat: "Perps & derivatives" },
  { mono: "H", name: "Helix", cat: "DEX & liquidity" },
  { mono: "O", name: "Orbit", cat: "Cross-chain bridge" },
  { mono: "M", name: "Meridian", cat: "Lending & money market" },
  { mono: "C", name: "Catalyst", cat: "Launchpad" },
  { mono: "L", name: "Lattice", cat: "RPC & infra" },
];

const STATS: { en: string; el: string }[] = [
  { en: "60+", el: "Projects building" },
  { en: "3", el: "Audits" },
  { en: "100%", el: "Open-source" },
];

export function Ecosystem() {
  return (
    <section id="ecosystem">
      <div className="wrap">
        <div className="eco-head">
          <div>
            {/* eyebrow mark inlined (the partner monograms below replace the
                old duplicated Ternus marks) */}
            <div className="eyebrow">
              <span className="mark" aria-hidden>
                <i />
                <i />
                <i />
              </span>{" "}
              Ecosystem
            </div>
            <h2>
              Builders are shipping on <span className="ac">Ternus</span>.
            </h2>
          </div>
          <div className="eco-stats">
            {STATS.map((stat) => (
              <div className="es" key={stat.el}>
                <div className="en">{stat.en}</div>
                <div className="el">{stat.el}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="eco-grid">
          {PARTNERS.map((partner) => (
            <div className="eco-card" key={partner.name}>
              <span className="eco-mono">{partner.mono}</span>
              <div>
                <div className="eco-name">{partner.name}</div>
                <div className="eco-cat">{partner.cat}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
