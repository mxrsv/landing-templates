import { Mark } from "./mark";

const PARTNERS = [
  "Northwind",
  "Helix",
  "Orbit",
  "Meridian",
  "Catalyst",
  "Lattice",
];

const STATS: { value: string; label: string }[] = [
  { value: "60+", label: "Projects building" },
  { value: "3", label: "Independent audits" },
  { value: "100%", label: "Open-source contracts" },
];

export function Ecosystem() {
  return (
    <section id="ecosystem">
      <div className="wrap">
        <div className="panel">
          <div className="eyebrow">Ecosystem</div>
          <h2>
            Builders are shipping on <span className="ac">Ternus</span>.
          </h2>
          <div className="logowall">
            {PARTNERS.map((name) => (
              <span className="plogo" key={name}>
                <Mark />
                {name}
              </span>
            ))}
          </div>
          <div className="ecostats">
            {STATS.map((stat) => (
              <div className="es" key={stat.label}>
                <div className="en">{stat.value}</div>
                <div className="el">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
