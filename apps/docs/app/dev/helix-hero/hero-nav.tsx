// PROTOTYPE — Helix nav (client). Desktop: brand + links + CTA. Mobile (<=860px):
// links + CTA gập vào hamburger menu (giữ ngôn ngữ chamfer/corner-tick). A11y:
// aria-expanded/controls, link chỉ focus được khi menu mở (visibility:hidden lúc
// đóng → out of tab order). Reveal qua CSS data-open (honor reduced-motion ở CSS).
"use client";

import { useState } from "react";

const NAV_LINKS = ["Protocol", "Operators", "Restake", "Docs"];

export function HeroNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="hx-nav">
      <span className="hx-nav__brand">
        <span className="hx-nav__mark" aria-hidden="true" />
        Helix
      </span>

      <div className="hx-nav__links">
        {NAV_LINKS.map((l) => (
          <a key={l} href="#top">
            {l}
          </a>
        ))}
      </div>

      <div className="hx-nav__right">
        <button type="button" className="hx-btn hx-btn--primary hx-nav__cta">
          Start restaking
          <span className="hx-btn__arrow" aria-hidden="true">
            →
          </span>
        </button>
        <button
          type="button"
          className="hx-nav__toggle"
          aria-expanded={open}
          aria-controls="hx-nav-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="hx-nav__bars" data-open={open} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <div id="hx-nav-menu" className="hx-nav__menu" data-open={open}>
        {NAV_LINKS.map((l) => (
          <a key={l} href="#top" onClick={() => setOpen(false)}>
            {l}
          </a>
        ))}
        <button
          type="button"
          className="hx-btn hx-btn--primary hx-nav__menu-cta"
          onClick={() => setOpen(false)}
        >
          Start restaking
          <span className="hx-btn__arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </nav>
  );
}
