"use client";

import { useInView } from "../lib/use-in-view";

// Ruler ticks along the L1 axis (every ~19px, every 4th is taller).
const TICKS = Array.from({ length: 40 }, (_, i) => 150 + i * 19.7);

/**
 * Rollup-lifecycle timeline (SVG, no dependencies). Visual language borrowed
 * from CI/branch timelines but mapped to Ternus: a glowing Ethereum-L1 axis,
 * a Ternus-L2 branch that batches transactions, then settles back to L1 with a
 * single orange confirmation. Draws once when scrolled into view; respects
 * prefers-reduced-motion via CSS.
 */
export function HeroPipeline() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);

  return (
    <div className="pipeline" ref={ref}>
      <div className="pl-caption">How a transaction settles</div>
      <svg
        className={`pipe-svg ${inView ? "playing" : ""}`.trim()}
        viewBox="0 0 960 300"
        role="img"
        aria-label="A transaction is batched on Ternus L2 and settled on Ethereum L1."
      >
        {/* ruler ticks */}
        <g className="pl-ticks">
          {TICKS.map((x, i) => {
            const long = i % 4 === 0;
            return (
              <line
                key={i}
                x1={x}
                x2={x}
                y1={196 - (long ? 7 : 3)}
                y2={196 + (long ? 7 : 3)}
              />
            );
          })}
        </g>

        {/* L1 axis */}
        <line
          className="pl-axis"
          pathLength={1}
          x1={150}
          y1={196}
          x2={930}
          y2={196}
        />

        {/* branch geometry */}
        <path
          className="pl-branch pl-up"
          pathLength={1}
          d="M300 196 C300 150 318 112 362 112"
        />
        <line
          className="pl-branch pl-top"
          pathLength={1}
          x1={510}
          y1={112}
          x2={760}
          y2={112}
        />
        <path
          className="pl-branch pl-down pl-dash"
          d="M760 112 C824 112 838 196 862 196"
        />

        {/* sprout node on the axis */}
        <circle className="pl-node" cx={300} cy={196} r={4} />

        {/* origin badge on the up-curve — threefold mark */}
        <g className="pl-badge">
          <circle cx={300} cy={150} r={13} />
          <g className="pl-badge-mark">
            <rect x={295} y={150} width={1.6} height={4} />
            <rect x={298.4} y={147.5} width={1.6} height={6.5} />
            <rect x={301.8} y={145} width={1.6} height={9} />
          </g>
        </g>

        {/* checkpoint 1 — transactions */}
        <g className="pl-ck pl-ck-1">
          <line className="pl-drop" x1={600} y1={112} x2={600} y2={64} />
          <text className="pl-lbl" x={600} y={54}>
            transactions
          </text>
          <circle className="pl-check" cx={600} cy={112} r={9} />
          <path className="pl-tick" d="M595.5 112 l3 3 l6 -6.5" />
        </g>

        {/* checkpoint 2 — rollup batch */}
        <g className="pl-ck pl-ck-2">
          <line className="pl-drop" x1={700} y1={112} x2={700} y2={64} />
          <text className="pl-lbl" x={700} y={54}>
            rollup batch · 128 tx
          </text>
          <circle className="pl-check" cx={700} cy={112} r={9} />
          <path className="pl-tick" d="M695.5 112 l3 3 l6 -6.5" />
        </g>

        {/* settle node on the axis — the single orange moment */}
        <g className="pl-settle">
          <line
            className="pl-drop pl-drop-down"
            x1={862}
            y1={196}
            x2={862}
            y2={238}
          />
          <text className="pl-lbl pl-lbl-down" x={862} y={252}>
            settled on l1
          </text>
          <circle className="pl-ring" cx={862} cy={196} r={9} />
          <circle className="pl-dot" cx={862} cy={196} r={4} />
        </g>

        {/* timestamps (mono) */}
        <text className="pl-time" x={300} y={228}>
          18:24:00
        </text>
        <text className="pl-time" x={862} y={270}>
          20:32:04
        </text>

        {/* pill: ethereum l1 (axis anchor) */}
        <g className="pl-pill">
          <rect x={20} y={180} width={134} height={32} rx={16} />
          <g className="pl-pill-mark">
            <rect x={40} y={196} width={2} height={5} />
            <rect x={44} y={193} width={2} height={8} />
            <rect x={48} y={190} width={2} height={11} />
          </g>
          <text className="pl-pill-text" x={60} y={200}>
            ethereum l1
          </text>
        </g>

        {/* pill: ternus-l2 (active branch) */}
        <g className="pl-pill pl-pill-active">
          <rect x={362} y={96} width={150} height={32} rx={16} />
          <g className="pl-pill-mark pl-pill-mark-dark">
            <rect x={380} y={112} width={2} height={5} />
            <rect x={384} y={109} width={2} height={8} />
            <rect x={388} y={106} width={2} height={11} />
          </g>
          <text className="pl-pill-text pl-pill-text-dark" x={400} y={116}>
            ternus-l2
          </text>
        </g>
      </svg>
    </div>
  );
}
