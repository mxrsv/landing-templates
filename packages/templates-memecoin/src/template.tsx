import { CommunityMarquee } from "@landing/sections/community-marquee";
import { MemecoinHeroTicker } from "@landing/sections/memecoin-hero-ticker";
import { TokenStatsStrip } from "@landing/sections/token-stats-strip";
import { Button } from "@landing/ui/components/button";

import "./memecoin.css";

/**
 * Memecoin — a degen-grade memecoin landing with infra-grade polish (neon
 * mood). Composes the Epic 5 sections (hero+ticker, token stats, community
 * marquee) with a sticky nav, closing CTA, and footer. Each section self-scopes
 * `data-theme="neon"`; the wrapper scopes it too so nav/footer match.
 */
export function MemecoinTemplate() {
  return (
    <div data-theme="neon" className="mc-root" id="top">
      <header className="mc-nav">
        <span className="mc-brand">
          <span className="mc-brand-mark" aria-hidden />
          $MEME
        </span>
        <nav className="mc-nav-links" aria-label="Primary">
          <a href="#stats">Stats</a>
          <a href="#community">Community</a>
          <a href="#buy">Buy</a>
        </nav>
      </header>

      <main>
        <MemecoinHeroTicker />
        <div id="stats">
          <TokenStatsStrip />
        </div>
        <div id="community">
          <CommunityMarquee />
        </div>

        <section id="buy" className="mc-closing">
          <h2>Ready to send it?</h2>
          <p>
            Grab $MEME on your favorite DEX. Fair launch, no presale, liquidity
            locked — just vibes and a verified contract.
          </p>
          <Button variant="solid">Buy $MEME now</Button>
        </section>
      </main>

      <footer className="mc-footer">
        <span>© 2026 $MEME. Not financial advice.</span>
        <span>Built on Monad</span>
      </footer>
    </div>
  );
}

export default MemecoinTemplate;
