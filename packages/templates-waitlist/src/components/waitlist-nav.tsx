export interface WaitlistNavContent {
  brand: string;
  cta: string;
}

const DEFAULT_CONTENT: WaitlistNavContent = {
  brand: "◈ Aenor",
  cta: "Join waitlist →",
};

interface WaitlistNavProps {
  /** Content is props-ised so the bar harvests cleanly into a shared section. */
  content?: WaitlistNavContent;
}

/** Fixed top nav — brand mark + a single jump-to-form pill. No motion. */
export function WaitlistNav({ content = DEFAULT_CONTENT }: WaitlistNavProps) {
  return (
    <nav className="wl-nav">
      <a className="logo" href="#top">
        {content.brand}
      </a>
      <a className="navpill" href="#join">
        {content.cta}
      </a>
    </nav>
  );
}
