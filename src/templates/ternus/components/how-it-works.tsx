"use client";

import { Reveal } from "./reveal";
import { StatNumber } from "./stat-number";

/**
 * Merged "How it works" — folds the old Proof-of-Speed + Technology sections
 * into one flow: intro → mechanism (3-layer stack) + properties (pillars) →
 * proof (metrics). Removes the duplicated rollup narrative.
 */
export function HowItWorks() {
  return (
    <section id="how">
      <div className="wrap">
        <div className="eyebrow">How it works</div>
        <h2>
          Three layers, <span className="ac">settled as one</span>.
        </h2>
        <p className="lead">
          Ternus executes off-chain at high speed, then proves every batch to
          Ethereum L1 — mainnet-grade security, none of the congestion.
        </p>

        <div className="split" style={{ marginTop: 56 }}>
          <div style={{ paddingLeft: 28 }}>
            <div className="stack">
              <Reveal className="layer">
                <span className="layer-idx">01</span>
                <div className="layer-tag">Apps &amp; users</div>
                <div className="layer-main">Your transactions</div>
                <div className="layer-side">Wallets · dApps · DeFi</div>
              </Reveal>
              <div className="flow">
                <i />
              </div>
              <Reveal className="layer l2" delay={110}>
                <span className="layer-idx">02</span>
                <div className="layer-tag">Ternus · Layer 2</div>
                <div className="layer-main">Execute &amp; roll up</div>
                <div className="layer-side">9,400 TPS · EVM</div>
              </Reveal>
              <div className="flow">
                <i />
              </div>
              <Reveal className="layer l1" delay={220}>
                <span className="layer-idx">03</span>
                <div className="layer-tag">Ethereum · Layer 1</div>
                <div className="layer-main">Settle &amp; secure</div>
                <div className="layer-side">Proof verified</div>
              </Reveal>
            </div>
          </div>

          <div>
            <div className="pillars">
              <Reveal className="pillar">
                <svg className="ic" viewBox="0 0 24 24">
                  <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
                </svg>
                <div className="pt">Fully EVM-equivalent</div>
                <div className="pd">Deploy existing Solidity unchanged.</div>
              </Reveal>
              <Reveal className="pillar" delay={110}>
                <svg className="ic" viewBox="0 0 24 24">
                  <path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6l7-3z" />
                </svg>
                <div className="pt">Trustless bridging</div>
                <div className="pd">
                  Move assets with proofs, not custodians.
                </div>
              </Reveal>
              <Reveal className="pillar" delay={220}>
                <svg className="ic" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M8.5 12l2.5 2.5 4.5-5" />
                </svg>
                <div className="pt">Open-source &amp; audited</div>
                <div className="pd">Every contract public and reviewed.</div>
              </Reveal>
              <Reveal className="pillar" delay={330}>
                <svg className="ic" viewBox="0 0 24 24">
                  <circle cx="6" cy="6" r="2" />
                  <circle cx="18" cy="6" r="2" />
                  <circle cx="12" cy="18" r="2" />
                  <path d="M7.5 7.5L11 16M16.5 7.5L13 16M8 6h8" />
                </svg>
                <div className="pt">Decentralized sequencer</div>
                <div className="pd">Roadmap to a permissionless set.</div>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="num">
              <StatNumber to={9400} />
            </div>
            <div className="cap">Transactions / sec</div>
            <div className="desc">Sustained testnet throughput.</div>
          </div>
          <div className="stat">
            <div className="num">
              $<StatNumber to={0.001} dec={3} />
            </div>
            <div className="cap">Average fee</div>
            <div className="desc">Predictable, near-zero gas.</div>
          </div>
          <div className="stat">
            <div className="num">
              <StatNumber to={1.2} dec={1} />
              <span className="unit">s</span>
            </div>
            <div className="cap">Time to finality</div>
            <div className="desc">Submitted to settled, fast.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
