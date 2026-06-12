import { Inter, JetBrains_Mono } from "next/font/google";
import "./ternus.css";
import { BuildTerminal } from "./components/build-terminal";
import { ClosingCta } from "./components/closing-cta";
import { Ecosystem } from "./components/ecosystem";
import { HowItWorks } from "./components/how-it-works";
import { TernusFooter } from "./components/ternus-footer";
import { TernusHero } from "./components/ternus-hero";
import { TernusNav } from "./components/ternus-nav";
import { Token } from "./components/token";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--tn-font",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--tn-font-mono",
  display: "swap",
});

/**
 * Ternus — an Ethereum Layer-2 landing template.
 * Dark, hairline/technical aesthetic; cyan-dominant with a single orange
 * accent; calm scroll-triggered motion; WebGL pixel mesh in the hero.
 */
export function TernusTemplate() {
  return (
    <div
      className={`tn ${inter.variable} ${jetbrainsMono.variable}`}
      data-theme="infra"
      id="top"
    >
      <TernusNav />
      <main>
        <TernusHero />
        <HowItWorks />
        <BuildTerminal />
        <Ecosystem />
        <Token />
        <ClosingCta />
      </main>
      <TernusFooter />
    </div>
  );
}
