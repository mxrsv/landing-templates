export interface WaitlistFooterContent {
  brand: string;
  nav: string;
  social: string;
}

const DEFAULT_CONTENT: WaitlistFooterContent = {
  brand: "◈ Aenor",
  nav: "Docs · Blog · Careers",
  social: "↗ X · Discord · GitHub",
};

interface WaitlistFooterProps {
  content?: WaitlistFooterContent;
}

/** Hairline footer — brand mark + two muted link clusters. No motion. */
export function WaitlistFooter({
  content = DEFAULT_CONTENT,
}: WaitlistFooterProps) {
  return (
    <footer className="wl-footer">
      <div className="wrap wl-footer-row">
        <span className="logo">{content.brand}</span>
        <span className="mut">{content.nav}</span>
        <span className="mut">{content.social}</span>
      </div>
    </footer>
  );
}
