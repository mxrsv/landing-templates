"use client";

import { useRef } from "react";
import { useScrollProgress } from "../lib/use-scroll-progress";
import { Reveal } from "./reveal";

export interface TransformStage {
  /** Short uppercase key shown in the stepper, e.g. "COMMIT". */
  key: string;
  title: string;
  body: string;
}

export interface TransformContent {
  eyebrow: string;
  heading: string;
  /** Exactly three stages drive COMMIT → SETTLE → FINALIZED. */
  stages: TransformStage[];
}

const DEFAULT_CONTENT: TransformContent = {
  eyebrow: "Settlement lifecycle",
  heading: "From intent to finality in one block",
  stages: [
    {
      key: "COMMIT",
      title: "Commit",
      body: "Your transaction is signed and broadcast — captured by the network the instant you hit send.",
    },
    {
      key: "SETTLE",
      title: "Settle",
      body: "Validators reach consensus and the state transition applies — sub-second and deterministic.",
    },
    {
      key: "FINALIZED",
      title: "Finalized",
      body: "The result is irreversibly anchored on-chain — auditable, non-custodial, and entirely yours.",
    },
  ],
};

interface TransformProps {
  /** `prefers-reduced-motion`, from the template's single hook call. */
  reduced?: boolean;
  content?: TransformContent;
}

/**
 * Transform showpiece. A tall section whose inner panel sticks to the viewport
 * while scroll progress (0..1) advances through the three settlement stages —
 * no GSAP pin, just `position: sticky` + `useScrollProgress`.
 *
 * Under reduced-motion the section collapses to a plain static list of all
 * three stages (no sticky, no scroll-driving), so nothing depends on motion.
 */
export function Transform({
  reduced = false,
  content = DEFAULT_CONTENT,
}: TransformProps) {
  const ref = useRef<HTMLElement>(null);
  // Hook is called unconditionally (Rules of Hooks); its value is only read on
  // the animated path. It also returns 1 under reduced-motion anyway.
  const progress = useScrollProgress(ref);
  const { stages } = content;
  const active = Math.min(
    stages.length - 1,
    Math.floor(progress * stages.length),
  );
  const activeStage = stages[active];

  if (reduced) {
    return (
      <section
        ref={ref}
        className="transform transform-static"
        aria-label="Settlement lifecycle"
      >
        <div className="wrap">
          <Reveal reduced>
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="transform-h">{content.heading}</h2>
          </Reveal>
          <ol className="transform-list">
            {stages.map((stage) => (
              <li key={stage.key} className="transform-list-item">
                <span className="step-key">{stage.key}</span>
                <h3 className="transform-title">{stage.title}</h3>
                <p className="transform-desc">{stage.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  if (!activeStage) return null;

  return (
    <section ref={ref} className="transform" aria-label="Settlement lifecycle">
      <div className="transform-sticky">
        <div className="wrap">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="transform-h">{content.heading}</h2>

          <ol className="transform-steps">
            {stages.map((stage, i) => (
              <li
                key={stage.key}
                className={`transform-step${i === active ? " is-active" : ""}${
                  i < active ? " is-done" : ""
                }`}
              >
                <span className="step-dot" aria-hidden="true" />
                <span className="step-key">{stage.key}</span>
              </li>
            ))}
          </ol>

          <div className="transform-rail">
            <span
              className="transform-fill"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>

          {/* Re-keyed on `active` so the copy crossfades in as each stage hits. */}
          <div className="transform-body" key={active}>
            <h3 className="transform-title">{activeStage.title}</h3>
            <p className="transform-desc">{activeStage.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
