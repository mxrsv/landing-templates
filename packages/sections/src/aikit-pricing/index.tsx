"use client";

import { useEffect, useRef, useState } from "react";

import { ErrorBoundary } from "@landing/ui/lib/error-boundary";
import { useReducedMotion } from "@landing/ui/lib/use-reduced-motion";

import "./aikit-pricing.css";

interface Plan {
  name: string;
  price: string;
}

type Cell = string | boolean;

interface Row {
  label: string;
  cells: [Cell, Cell, Cell];
}

const PLANS: readonly Plan[] = [
  { name: "Basic", price: "$29" },
  { name: "Pro", price: "$79" },
  { name: "Business", price: "$149" },
] as const;

const PRO_INDEX = 1;

const ROWS: readonly Row[] = [
  {
    label: "Keyword optimization",
    cells: ["Unlimited", "Unlimited", "Unlimited"],
  },
  { label: "Automated meta tags", cells: ["1000", "Unlimited", "Unlimited"] },
  { label: "SEO monitoring", cells: [true, true, true] },
  { label: "Monthly reports", cells: [true, true, true] },
  { label: "Content suggestions", cells: [false, true, true] },
  { label: "Link optimization", cells: [false, true, true] },
  { label: "Multi-user access", cells: [false, false, true] },
  { label: "API integration", cells: [false, false, true] },
] as const;

function Check() {
  return (
    <svg className="ak-pr-check" viewBox="0 0 16 16" aria-hidden>
      <path d="M3.25 8.5l3 3 6.5-7.5" />
    </svg>
  );
}

interface CellContentProps {
  value: Cell;
  planName: string;
  rowLabel: string;
}

function CellContent({ value, planName, rowLabel }: CellContentProps) {
  if (typeof value === "boolean") {
    return value ? (
      <>
        <Check />
        <span className="ak-pr-sr">
          {rowLabel} included in {planName}
        </span>
      </>
    ) : (
      <span className="ak-pr-sr">
        {rowLabel} not in {planName}
      </span>
    );
  }
  return (
    <span className="ak-pr-cellrow">
      <Check />
      <span className="ak-pr-celltext">{value}</span>
    </span>
  );
}

/**
 * Reveal-on-scroll: adds `is-in` once the node enters the viewport. When
 * `prefers-reduced-motion` is set the node is marked visible immediately and no
 * observer is attached.
 */
function useReveal(reduced: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return { ref, shown };
}

/**
 * AI-kit pricing — SaaS/AI startup mood. Faithful clone of the Framer "AI
 * Startup Website Kit" pricing block: a 56px centered "Pricing" title, a muted
 * two-line subtitle, and a three-tier comparison table (Basic / Pro /
 * Business). The Pro column is highlighted with a subtle purple wash + border
 * that extends slightly above the header and below the last row. Per-column
 * "Get started" buttons (Pro = solid purple, others = ghost) and purple check
 * marks. Scroll-reveal + hover transitions are gated by `useReducedMotion()`.
 * Self-scopes `data-theme="aikit"`.
 */
export function AikitPricing() {
  const reduced = useReducedMotion();
  const { ref, shown } = useReveal(reduced);

  const rootClass = [
    "ak-pr",
    reduced ? "" : "ak-pr--anim",
    shown ? "is-in" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section data-theme="aikit" className={rootClass}>
      <ErrorBoundary label="Pricing unavailable">
        <div className="ak-pr-inner" ref={ref}>
          <header className="ak-pr-head">
            <h2 className="ak-pr-title">Pricing</h2>
            <p className="ak-pr-sub">
              Choose the right plan to meet your SEO needs and start optimizing
              today.
            </p>
          </header>

          <div className="ak-pr-card">
            <div
              className="ak-pr-table"
              role="table"
              aria-label="Plan comparison"
            >
              {/* Pro highlight box — sits behind the Pro column, floats slightly
                  above/below the rows. */}
              <div className="ak-pr-prohl" aria-hidden />

              <div className="ak-pr-row ak-pr-row--plans" role="row">
                <span
                  className="ak-pr-cell ak-pr-cell--label"
                  role="columnheader"
                />
                {PLANS.map((plan, i) => (
                  <div
                    key={plan.name}
                    role="columnheader"
                    className={`ak-pr-cell ak-pr-cell--plan${i === PRO_INDEX ? " is-pro" : ""}`}
                  >
                    <span className="ak-pr-planname">{plan.name}</span>
                    <button
                      type="button"
                      className={`ak-pr-btn ${i === PRO_INDEX ? "ak-pr-btn--solid" : "ak-pr-btn--ghost"}`}
                    >
                      Get started
                    </button>
                  </div>
                ))}
              </div>

              <div className="ak-pr-row ak-pr-row--price" role="row">
                <span className="ak-pr-cell ak-pr-cell--label" role="rowheader">
                  Price
                </span>
                {PLANS.map((plan, i) => (
                  <div
                    key={plan.name}
                    role="cell"
                    className={`ak-pr-cell${i === PRO_INDEX ? " is-pro" : ""}`}
                  >
                    <span className="ak-pr-amt">{plan.price}</span>
                  </div>
                ))}
              </div>

              {ROWS.map((row) => (
                <div key={row.label} className="ak-pr-row" role="row">
                  <span
                    className="ak-pr-cell ak-pr-cell--label"
                    role="rowheader"
                  >
                    {row.label}
                  </span>
                  {PLANS.map((plan, ci) => (
                    <div
                      key={plan.name}
                      role="cell"
                      className={`ak-pr-cell${ci === PRO_INDEX ? " is-pro" : ""}`}
                    >
                      <CellContent
                        value={row.cells[ci] ?? false}
                        planName={plan.name}
                        rowLabel={row.label}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </section>
  );
}

export default AikitPricing;
