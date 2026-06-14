"use client";

import { Reveal } from "./reveal";
import { StatNumber } from "./stat-number";

export interface Stat {
  /** Final value the count-up settles on. */
  to: number;
  /** Decimal places (0 → integer with thousands separators). */
  dec?: number;
  /** Text shown before the number, e.g. "$". */
  prefix?: string;
  /** Text shown after the number, e.g. "%" or "M". */
  suffix?: string;
  label: string;
}

export interface StatsContent {
  eyebrow: string;
  stats: Stat[];
}

const DEFAULT_CONTENT: StatsContent = {
  eyebrow: "Trust by the numbers",
  stats: [
    { to: 2431, label: "Builders signed up" },
    { to: 38, prefix: "$", suffix: "M", label: "Committed value" },
    { to: 99.99, dec: 2, suffix: "%", label: "Testnet uptime" },
    { to: 42, label: "Countries reached" },
  ],
};

interface StatsProps {
  /** `prefers-reduced-motion`, from the template's single hook call. */
  reduced?: boolean;
  content?: StatsContent;
}

/**
 * Credibility stats. Each figure counts up once on scroll-in via StatNumber,
 * which itself jumps straight to the final value under reduced-motion.
 */
export function Stats({
  reduced = false,
  content = DEFAULT_CONTENT,
}: StatsProps) {
  return (
    <section className="stats" aria-label="Stats">
      <div className="wrap">
        <Reveal reduced={reduced}>
          <span className="eyebrow">{content.eyebrow}</span>
        </Reveal>

        <div className="stats-grid">
          {content.stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              reduced={reduced}
              className="stat"
              delay={i * 80}
            >
              <span className="stat-num">
                {stat.prefix}
                <StatNumber to={stat.to} dec={stat.dec} reduced={reduced} />
                {stat.suffix}
              </span>
              <span className="stat-label">{stat.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
