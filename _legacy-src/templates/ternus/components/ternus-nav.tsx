"use client";

import { useEffect, useState } from "react";
import { Mark } from "./mark";

/** Sticky nav that gains a blurred background once the page is scrolled. */
export function TernusNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`.trim()}>
      <a className="brand" href="#top">
        <Mark />
        Ternus
      </a>
      <div className="navlinks">
        <a href="#how">How it works</a>
        <a href="#build">Build</a>
        <a href="#ecosystem">Ecosystem</a>
        <a href="#token">Token</a>
        <a href="#">Docs</a>
      </div>
      <button className="connect" type="button">
        Connect Wallet
      </button>
    </nav>
  );
}
