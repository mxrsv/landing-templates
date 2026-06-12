"use client";

import { PixelBlast } from "@landing/ui/pixel-blast";
import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";
import { HeroCrystal } from "./hero-crystal";
import { TernusNetstrip } from "./ternus-netstrip";

/** Tạm thời ẩn khối crystal (logo eth) ở nửa phải hero — bật lại = true. */
const SHOW_CRYSTAL = false;

export function TernusHero() {
  const reduced = useReducedMotion();

  return (
    <section className="hero">
      {!reduced && (
        <div className="mesh">
          <PixelBlast
            variant="square"
            color="#fb923c"
            pixelSize={4}
            patternScale={2}
            patternDensity={0.65}
            edgeFade={0.15}
            speed={0.15}
            enableRipples
            rippleSpeed={0.2}
            rippleThickness={0.1}
            liquid={false}
            noiseAmount={0}
            transparent
            autoPauseOffscreen
            cursorErase
            eraseRadius={1.4}
            eraseStrength={2}
          />
        </div>
      )}
      <div className="vignette" />
      <div className="hero-scrim" />

      <div className="wrap">
        <div className={`hero-grid ${SHOW_CRYSTAL ? "" : "no-visual"}`.trim()}>
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
              Run your apps across three layers, settled as{" "}
              <span className="ac">one fast, secure network</span>.
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
            <TernusNetstrip />
          </div>
          {SHOW_CRYSTAL && (
            <div className="hero-right">
              <HeroCrystal />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
