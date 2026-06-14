import { Inter, JetBrains_Mono } from "next/font/google";
import "./waitlist.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--wl-font",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--wl-font-mono",
  display: "swap",
});

/**
 * Waitlist — a "launch a waitlist" landing template (brand demo Aenor, the
 * trust layer for on-chain finance). Infra mood with the Ion skin; flow-knot
 * 3D artifact behind the page; client-only email simple-confirm.
 *
 * Skeleton scaffold (Task 1): sections land in later tasks. The root carries
 * `data-theme="infra"` for the shared `--p-*` floor and class `wl` to scope the
 * private Ion `--wl-*` tokens.
 */
export function WaitlistTemplate() {
  return (
    <div
      className={`wl ${inter.variable} ${jetbrainsMono.variable}`}
      data-theme="infra"
      id="top"
    >
      <main>
        <section className="wl-placeholder">
          <div className="wrap">
            <p className="eyebrow">Aenor · Waitlist</p>
            <h1>Walking skeleton</h1>
            <p>Sections land in the next tasks.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
