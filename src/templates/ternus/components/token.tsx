import { Reveal } from "./reveal";
import { TokenDonut } from "./token-donut";

interface Utility {
  title: string;
  desc: string;
  icon: string;
}

const UTILITIES: Utility[] = [
  {
    title: "Gas & fees",
    desc: "Pay for every transaction on Ternus.",
    icon: "M5 19V7l5-3 5 3v12M5 19h10M14 10h3v6a2 2 0 01-2 2",
  },
  {
    title: "Staking & security",
    desc: "Stake to help secure the sequencer.",
    icon: "M4 8l8-4 8 4-8 4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4",
  },
  {
    title: "Governance",
    desc: "Vote on upgrades and treasury.",
    icon: "M12 4v16M6 8h12M7 8l-2 5h4l-2-5zM17 8l-2 5h4l-2-5z",
  },
  {
    title: "Ecosystem incentives",
    desc: "Reward builders, LPs, early users.",
    icon: "M12 3v18M3 12h18M6 6l12 12M18 6L6 18",
  },
];

export function Token() {
  return (
    <section id="token">
      <div className="wrap">
        <div className="split">
          <div>
            <div className="eyebrow">Token</div>
            <h2>
              One token securing <span className="ac">the whole network</span>.
            </h2>
            <p className="lead">
              $TERN powers gas, secures the sequencer, and governs the protocol
              — aligning everyone who builds on Ternus.
            </p>
            <div className="utils">
              {UTILITIES.map((u, i) => (
                <Reveal className="util" delay={i * 110} key={u.title}>
                  <svg className="ic" viewBox="0 0 24 24">
                    <path d={u.icon} />
                  </svg>
                  <div>
                    <div className="ut">{u.title}</div>
                    <div className="ud">{u.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <TokenDonut />
        </div>
      </div>
    </section>
  );
}
