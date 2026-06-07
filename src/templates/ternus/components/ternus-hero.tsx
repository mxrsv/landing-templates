"use client";

import { useEffect, useState } from "react";
import { PixelBlast } from "@/components/pixel-blast";
import { useReducedMotion } from "../lib/use-reduced-motion";
import { HeroCrystal } from "./hero-crystal";

const INITIAL_BLOCK = 18234567;

export function TernusHero() {
  const reduced = useReducedMotion();
  const [block, setBlock] = useState(INITIAL_BLOCK);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setBlock((b) => b + 1 + Math.floor(Math.random() * 2));
    }, 2400);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <section className="hero">
      {!reduced && (
        <div className="mesh">
          <PixelBlast
            variant="square"
            color="#fb923c"
            pixelSize={4}
            patternScale={2}
            patternDensity={0.5}
            edgeFade={0.6}
            speed={0.15}
            enableRipples
            rippleSpeed={0.2}
            rippleThickness={0.1}
            liquid={false}
            noiseAmount={0}
            transparent
            autoPauseOffscreen
          />
        </div>
      )}
      <div className="vignette" />

      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="badges">
              <span className="badge live">
                <span className="ldot" />
                Testnet Live
              </span>
              <span className="badge">Audited</span>
              <span className="badge">EVM-equivalent</span>
            </div>
            <h1 className="headline">
              Three layers,
              <br />
              <span className="ac">one network</span>.
            </h1>
            <p className="hero-sub">
              Ternus is the Ethereum Layer 2 with threefold throughput — your
              apps run fast and cheap, settled with mainnet-grade security.
            </p>
            <div className="cta">
              <button className="btn btn-primary" type="button">
                Start building
              </button>
              <button className="btn btn-ghost" type="button">
                Read the docs →
              </button>
            </div>
            <div className="netstrip">
              <div className="nstat">
                <span className="nk">
                  Throughput
                  <span className="net-tag">testnet</span>
                </span>
                <span className="nv">9,400</span>
              </div>
              <span className="nsep" />
              <div className="nstat">
                <span className="nk">Avg fee</span>
                <span className="nv">$0.001</span>
              </div>
              <span className="nsep" />
              <div className="nstat">
                <span className="nk">Block height</span>
                <span className="nv">{block.toLocaleString("en-US")}</span>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <HeroCrystal />
          </div>
        </div>
      </div>
    </section>
  );
}
