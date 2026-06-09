"use client";

import { useRef } from "react";
import { useReducedMotion } from "../lib/use-reduced-motion";
import { useScrollProgress } from "../lib/use-scroll-progress";
import { Mark } from "./mark";
import { StatNumber } from "./stat-number";

interface Phase {
  ring: string;
  kicker: string;
  heading: string;
  body: string;
}

interface Layer {
  k: string;
  t: string;
  side: [string, string];
}

const PHASES: Phase[] = [
  {
    ring: "1",
    kicker: "APPS & USERS",
    heading: "Your transaction starts here.",
    body: "Wallets, dApps and DeFi submit transactions to Ternus exactly like they would to Ethereum — same Solidity, same tooling, no rewrite.",
  },
  {
    ring: "2",
    kicker: "TERNUS · LAYER 2",
    heading: "Executed off-chain, rolled into one batch.",
    body: "Ternus runs thousands of transactions per second off-chain, then compresses them into a single proof — fast and near-zero cost.",
  },
  {
    ring: "3",
    kicker: "ETHEREUM · LAYER 1",
    heading: "Settled and secured on mainnet.",
    body: "The proof is verified on Ethereum L1 — your transaction inherits mainnet-grade security, with none of the congestion.",
  },
];

const LAYERS: Layer[] = [
  {
    k: "Layer · Apps",
    t: "Your transactions",
    side: ["wallets · dApps", "DeFi"],
  },
  {
    k: "Layer · Ternus L2",
    t: "Execute & roll up",
    side: ["9,400 TPS", "EVM"],
  },
  {
    k: "Layer · Ethereum L1",
    t: "Settle & secure",
    side: ["proof", "verified"],
  },
];

/**
 * Scrollytelling "How it works": a tall track with a sticky stage. As the user
 * scrolls, a transaction pulse travels down a 3-layer rail, the active layer
 * highlights, the copy swaps phase, and three proof stats count up at the end.
 * Driven by {@link useScrollProgress}; collapses to a static, fully-revealed
 * diagram under `prefers-reduced-motion`.
 */
export function HowItWorks() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const p = useScrollProgress(ref);

  const phase = p < 0.36 ? 0 : p < 0.72 ? 1 : 2;
  const isActive = (i: number) => reduced || i === phase;
  const showStats = reduced || p > 0.8;
  const settled = !reduced && p > 0.82;

  const fillHeight = reduced ? "100%" : `${(p * 100).toFixed(1)}%`;
  const pulseStyle = reduced
    ? { opacity: 0 }
    : {
        top: `calc(18px + (100% - 36px) * ${p} - 6px)`,
        opacity: p > 0.01 && p < 0.99 ? 1 : 0,
      };
  const idx = reduced ? "01 / 03" : `0${phase + 1} / 03`;

  return (
    <section className="scrolly" id="how" ref={ref}>
      <div className="scrolly-stage">
        <div className="wrap">
          <div className="scrolly-grid">
            {/* left: phase copy that swaps with scroll */}
            <div className="scrolly-copy">
              <div className="eyebrow">
                <Mark /> How it works
                <span className="idx">{idx}</span>
              </div>
              {PHASES.map((ph, i) => (
                <div
                  className={`phase ${isActive(i) ? "active" : ""}`.trim()}
                  key={ph.kicker}
                >
                  <div className="ph-k">
                    <span className="ring">{ph.ring}</span> {ph.kicker}
                  </div>
                  <h3>{ph.heading}</h3>
                  <p>{ph.body}</p>
                </div>
              ))}
            </div>

            {/* right: the 3-layer rail with a travelling pulse */}
            <div className="rail">
              <div className="rail-line">
                <i style={{ height: fillHeight }} />
              </div>
              <div
                className={`txpulse ${settled ? "settled" : ""}`.trim()}
                style={pulseStyle}
              />
              {LAYERS.map((layer, i) => (
                <div
                  className={`rl ${isActive(i) ? "on" : ""}`.trim()}
                  key={layer.k}
                >
                  <span className="dot" />
                  <div>
                    <div className="rl-k">{layer.k}</div>
                    <div className="rl-t">{layer.t}</div>
                  </div>
                  <div className="rl-side">
                    {layer.side[0]}
                    <br />
                    {layer.side[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* proof stats fold up at the end of the scroll */}
        {showStats && (
          <div className="scrolly-stats in">
            <div className="ss">
              <div className="num">
                <StatNumber to={9400} />
              </div>
              <div className="cap">Transactions / sec</div>
            </div>
            <div className="ss">
              <div className="num">
                $<StatNumber to={0.001} dec={3} />
              </div>
              <div className="cap">Average fee</div>
            </div>
            <div className="ss">
              <div className="num">
                <StatNumber to={1.2} dec={1} />
                <span className="unit">s</span>
              </div>
              <div className="cap">Time to finality</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
